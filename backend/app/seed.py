import random
from datetime import date, datetime, timedelta

from . import models
from .database import SessionLocal

DEMO_USERS = [
    {"name": "John Doe", "email": "john@example.com"},
]

# How much history each seeded habit carries.
DAYS_BACK = 30

HABITS_BY_USER = {
    "John Doe": ["Morning run", "Read 20 pages", "Meditate", "Drink water", "Yoga"],
}


def _seed_checkins(db, habit, days_back, completion_rate=0.85):
    today = date.today()
    for i in range(days_back, 0, -1):
        day = today - timedelta(days=i)
        if random.random() < completion_rate:
            hour = random.randint(6, 22)
            minute = random.randint(0, 59)
            checked_at = datetime(day.year, day.month, day.day, hour, minute)
            db.add(models.Checkin(habit_id=habit.id, checked_at=checked_at))
    db.commit()


def _longest_streak_from_checkins(db, habit):
    days = sorted({c.checked_at.date() for c in habit.checkins})
    longest = 0
    streak = 0
    prev = None
    for day in days:
        streak = streak + 1 if prev and day == prev + timedelta(days=1) else 1
        longest = max(longest, streak)
        prev = day
    return longest


def _seed_late_night_checkins(db, habit):
    today = date.today()
    early = today - timedelta(days=5)
    late = today - timedelta(days=4)
    db.add(models.Checkin(habit_id=habit.id, checked_at=datetime(early.year, early.month, early.day, 0, 3)))
    db.add(models.Checkin(habit_id=habit.id, checked_at=datetime(late.year, late.month, late.day, 23, 57)))
    db.commit()


def run_seed():
    db = SessionLocal()
    try:
        if db.query(models.User).count() > 0:
            print("seed: database already has data, skipping")
            return

        users = []
        for u in DEMO_USERS:
            user = models.User(name=u["name"], email=u["email"])
            db.add(user)
            users.append(user)
        db.commit()
        for user in users:
            db.refresh(user)

        for user in users:
            for habit_name in HABITS_BY_USER[user.name]:
                habit = models.Habit(
                    user_id=user.id,
                    name=habit_name,
                    current_streak=0,
                    longest_streak=0,
                    # The habit is older than the history it carries. Without
                    # this the creation date lands inside the check-in window
                    # and the strip hides real days as if they never happened.
                    created_at=datetime.utcnow() - timedelta(days=DAYS_BACK + 1),
                )
                db.add(habit)
                db.commit()
                db.refresh(habit)
                _seed_checkins(db, habit, days_back=DAYS_BACK)
                db.refresh(habit)
                habit.longest_streak = _longest_streak_from_checkins(db, habit)
                db.add(habit)
                db.commit()

        first_user_habit = (
            db.query(models.Habit).filter(models.Habit.user_id == users[0].id).first()
        )
        _seed_late_night_checkins(db, first_user_habit)
        db.refresh(first_user_habit)
        first_user_habit.longest_streak = _longest_streak_from_checkins(db, first_user_habit)
        db.add(first_user_habit)
        db.commit()

        print(f"seed: created {len(users)} users with habits and check-in history")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
