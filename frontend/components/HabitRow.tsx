"use client";

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
  onRemove: (habitId: number) => void;
};

export default function HabitRow({
  habit,
  today,
  checkingIn,
  animateDay,
  onCheckIn,
  onRemove,
}: Props) {
  const days = currentWeek(today);
  const checked = checkedDays(habit);
  const todayKey = dayKey(today);
  const doneToday = checked.has(todayKey);
  const streak = habit.current_streak;

  const past = days.filter((d) => d.key < todayKey);
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

  return (
    <li className="leaf">
      <div className="min-w-0">
        <h2 className="truncate text-[0.9375rem] font-semibold leading-tight text-[var(--color-ink)]">
          {habit.name}
        </h2>
        <p className="mt-1 text-[0.6875rem] leading-tight text-[var(--color-ink-muted)]">
          {habit.longest_streak > 0 ? `best ${habit.longest_streak}` : "no streak yet"}
        </p>
      </div>

      <WeekStrip checked={checked} today={today} animateDay={animateDay} />

      <p className="flex items-baseline justify-end gap-1.5 text-right">
        <span className="text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-[var(--color-ink)]">
          {streak}
        </span>
        <span className="text-[0.6875rem] text-[var(--color-ink-muted)]">
          {streak === 1 ? "day" : "days"}
        </span>
      </p>

      <div className="flex flex-col items-stretch gap-1.5">
        <button
          type="button"
          className="btn-primary"
          disabled={doneToday || checkingIn}
          onClick={() => onCheckIn(habit.id)}
        >
          {doneToday ? "Checked in" : checkingIn ? "Checking in" : "Check in"}
        </button>
        <button
          type="button"
          className="btn-quiet"
          onClick={() => onRemove(habit.id)}
        >
          Remove
        </button>
      </div>

      <p className="sr-only">{summary}</p>
    </li>
  );
}