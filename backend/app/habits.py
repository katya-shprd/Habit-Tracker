from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas
from .database import get_db
from .redis_client import check_rate_limit

router = APIRouter()


def get_current_user_id(x_user_id: int | None = Header(default=None)) -> int:
    if x_user_id is None:
        raise HTTPException(status_code=400, detail="X-User-Id header is required")
    return x_user_id


def _bump_streak_after_checkin(db: Session, habit: models.Habit):
    # quick pass: grab the last 400 checkins and walk backwards day by day
    # from today until we hit a gap
    checkins = (
        db.query(models.Checkin)
        .filter(models.Checkin.habit_id == habit.id)
        .order_by(models.Checkin.checked_at.desc())
        .limit(400)
        .all()
    )
    days_checked = set()
    for c in checkins:
        days_checked.add(c.checked_at.date())

    cursor = date.today()
    if cursor not in days_checked:
        cursor = cursor - timedelta(days=1)

    streak = 0
    while cursor in days_checked:
        streak += 1
        cursor = cursor - timedelta(days=1)

    habit.current_streak = streak
    if streak > habit.longest_streak:
        habit.longest_streak = streak
    db.add(habit)
    db.commit()
    db.refresh(habit)


def _recompute_streak_for_read(habit: models.Habit) -> int:
    # the cached column can lag behind, so patch it up here too when we
    # serve a read - only look back 90 days, that's plenty for a streak
    now = datetime.now()
    today = now.date()
    cutoff = today - timedelta(days=90)

    seen_days = set()
    for c in habit.checkins:
        d = c.checked_at.date()
        if d >= cutoff:
            seen_days.add(d)

    day = today
    if day not in seen_days:
        day = day - timedelta(days=1)

    n = 0
    while day in seen_days:
        n += 1
        day = day - timedelta(days=1)
    return n


@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.id).all()


@router.get("/habits", response_model=list[schemas.HabitOut])
def list_habits(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    habits = db.query(models.Habit).filter(models.Habit.user_id == user_id).all()
    for h in habits:
        h.current_streak = _recompute_streak_for_read(h)
    return habits


@router.post("/habits", response_model=schemas.HabitOut)
def create_habit(
    payload: schemas.HabitCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    habit = models.Habit(user_id=user_id, name=payload.name, current_streak=0, longest_streak=0)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@router.get("/habits/{habit_id}", response_model=schemas.HabitOut)
def get_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit.current_streak = _recompute_streak_for_read(habit)
    return habit


@router.delete("/habits/{habit_id}", status_code=204)
def delete_habit(
    habit_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == user_id)
        .first()
    )
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()


@router.delete("/habits/{habit_id}/checkins", response_model=schemas.HabitOut)
def delete_today_checkin(
    habit_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Removes today's check-in, so the card returns to the not-done state."""
    habit = (
        db.query(models.Habit)
        .filter(models.Habit.id == habit_id, models.Habit.user_id == user_id)
        .first()
    )
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    if not check_rate_limit(user_id, action="uncheckin", max_attempts=60, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many uncheck attempts, slow down")

    today = date.today()
    for checkin in list(habit.checkins):
        if checkin.checked_at.date() == today:
            db.delete(checkin)
    db.commit()
    db.refresh(habit)

    # The streak drops, so recompute it from the check-ins that are left.
    habit.current_streak = _recompute_streak_for_read(habit)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit


@router.post("/habits/{habit_id}/checkins", response_model=schemas.HabitOut)
def create_checkin(
    habit_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    if not check_rate_limit(user_id, action="checkin", max_attempts=60, window_seconds=60):
        raise HTTPException(status_code=429, detail="Too many check-in attempts, slow down")

    checkin = models.Checkin(habit_id=habit.id, checked_at=datetime.now())
    db.add(checkin)
    db.commit()

    _bump_streak_after_checkin(db, habit)

    db.refresh(habit)
    return habit
