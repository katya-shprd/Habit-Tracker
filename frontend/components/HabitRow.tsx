"use client";

import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "./ConfirmDialog";
import WeekStrip from "./WeekStrip";
import {
  checkedDays,
  currentWeek,
  dayKey,
  isFuture,
  type Habit,
} from "../lib/habits";

type Props = {
  habit: Habit;
  today: Date;
  checkingIn: boolean;
  animateDay: string | null;
  onCheckIn: (habitId: number) => void;
  onUncheck: (habitId: number) => void;
  onRemove: (habitId: number) => void;
};

/** The flame beside the current streak. */
function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2c.6 3.2-1.4 4.6-2.9 6.1C7.6 9.6 6.5 11 6.5 13.2 6.5 17 9.2 20 12 20s5.5-3 5.5-6.8c0-2.4-1-4-2.4-5.6-.3 1-1 1.7-1.8 2 .5-2.9-.3-5.6-1.3-7.6z"
        fill="#f2652a"
      />
      <path
        d="M12 20c-1.7 0-3-1.4-3-3.2 0-1.3.7-2.2 1.6-3 .2.6.6 1 1.1 1.2.2-1.2 0-2.3-.4-3.3 1.3 1 2.7 2.3 2.7 5.1 0 1.8-1.3 3.2-2 3.2z"
        fill="#ffb066"
      />
    </svg>
  );
}

/** The cup beside the best streak. */
function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 4h10v2h3v3a4 4 0 0 1-4 4h-.4A5 5 0 0 1 13 15.9V18h3v2H8v-2h3v-2.1A5 5 0 0 1 8.4 13H8a4 4 0 0 1-4-4V6h3V4zm0 4H6v1a2 2 0 0 0 1 1.7V8zm10 0v2.7A2 2 0 0 0 18 9V8h-1z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The three dots that open the remove action. */
function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="19" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function HabitRow({
  habit,
  today,
  checkingIn,
  animateDay,
  onCheckIn,
  onUncheck,
  onRemove,
}: Props) {
  const days = currentWeek(today);
  const checked = checkedDays(habit);
  const todayKey = dayKey(today);
  const doneToday = checked.has(todayKey);
  const streak = habit.current_streak;
  // A habit created partway through this week has no history before its first
  // day, so those days are not misses.
  const startsOn = dayKey(new Date(habit.created_at));

  // Only count days the habit was alive for. A day with a real check-in counts
  // whatever the creation date says.
  const past = days.filter(
    (d) => d.key < todayKey && (d.key >= startsOn || checked.has(d.key))
  );
  const worked = past.filter((d) => checked.has(d.key));
  const missed = past.filter((d) => !checked.has(d.key));
  const ahead = days.filter((d) => isFuture(d.key, todayKey)).length;

  const list = (ds: typeof days) =>
    ds.map((d) => `${d.label} ${d.date}`).join(", ");

  const summary =
    `${habit.name}. ` +
    `Current streak ${streak} ${streak === 1 ? "day" : "days"}. ` +
    `This week: worked ${list(worked) || "nothing"}. ` +
    `Missed ${list(missed) || "nothing"}. ` +
    (doneToday ? "Today is already done." : "Today is not done yet.") +
    (ahead > 0
      ? ` ${ahead} ${ahead === 1 ? "day is" : "days are"} still to come.`
      : "");

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLButtonElement | null>(null);

  // The menu closes on Escape, on a click away, and when the habit list moves
  // this row out from under it.
  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || dotsRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        dotsRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <li className="leaf">
      <div className="min-w-0 zone-name">
        <h2 className="text-[0.875rem] font-semibold leading-snug text-[var(--color-ink)]">
          {habit.name}
        </h2>
      </div>

      <WeekStrip
        checked={checked}
        today={today}
        startsOn={startsOn}
        animateDay={animateDay}
      />

      <div className="figures zone-figures">
        <div className="figure">
          <div className="figure-row">
            <FlameIcon />
            <span className="figure-num">{streak}</span>
          </div>
          <span className="figure-label">Current</span>
        </div>

        <div className="figure-rule" aria-hidden="true" />

        <div className="figure">
          <div className="figure-row text-[var(--color-ink-muted)]">
            <TrophyIcon />
            <span className="figure-num">{habit.longest_streak}</span>
          </div>
          <span className="figure-label">Best</span>
        </div>
      </div>

      <div className="zone-action">
        {doneToday ? (
          <button
            type="button"
            className="btn-done btn-check"
            onClick={() => onUncheck(habit.id)}
            disabled={checkingIn}
            aria-label={`Undo today's check-in for ${habit.name}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M5 12.5 10 17.5 19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Checked in
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary btn-check"
            disabled={checkingIn}
            onClick={() => onCheckIn(habit.id)}
          >
            {checkingIn ? "Checking in" : "Check in"}
          </button>
        )}
      </div>

      <div className="menu zone-menu" ref={menuRef}>
        <button
          type="button"
          ref={dotsRef}
          className="btn-menu"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={`More actions for ${habit.name}`}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <DotsIcon />
        </button>

        {menuOpen && (
          <div className="menu-panel" role="menu">
            <button
              type="button"
              role="menuitem"
              className="menu-item menu-item-danger"
              onClick={() => {
                setMenuOpen(false);
                setConfirmOpen(true);
              }}
            >
              Remove habit
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`Remove ${habit.name}?`}
        body={`This removes the habit and all of its check-ins. The card and every day it holds will be gone. You cannot undo this.`}
        confirmLabel="Remove habit"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onRemove(habit.id);
        }}
      />

      <p className="sr-only">{summary}</p>
    </li>
  );
}