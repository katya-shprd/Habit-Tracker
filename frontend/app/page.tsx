"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import HabitRow from "../components/HabitRow";
import {
  dayKey,
  formatLongDate,
  type Habit,
  type User,
} from "../lib/habits";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Status = "loading" | "ready" | "error";

export default function DashboardPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [notice, setNotice] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<number | null>(null);
  const [workedDay, setWorkedDay] = useState<Record<number, string>>({});
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const workTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setToday(new Date());
  }, []);

  const load = useCallback(async (id: number) => {
    setStatus("loading");
    setNotice(null);
    try {
      const res = await fetch(`${API_URL}/habits`, {
        headers: { "X-User-Id": String(id) },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setHabits(await res.json());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/users`, { cache: "no-store" })
      .then((res) => res.json())
      .then((users: User[]) => {
        if (cancelled) return;
        if (users.length > 0) setUserId(users[0].id);
        else setStatus("error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (userId === null) return;
    void load(userId);
  }, [userId, load]);

  useEffect(() => {
    const timers = workTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  function handleCheckIn(habitId: number) {
    if (userId === null || checkingInId !== null || !today) return;
    setCheckingInId(habitId);
    setNotice(null);

    fetch(`${API_URL}/habits/${habitId}/checkins`, {
      method: "POST",
      headers: { "X-User-Id": String(userId) },
    })
      .then((res) => {
        if (res.status === 429) {
          setNotice(
            "Too many check-in attempts in a minute. Wait a moment, then check in again."
          );
          return null;
        }
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((updated: Habit | null) => {
        if (updated) {
          setHabits((prev) =>
            prev.map((h) => (h.id === updated.id ? updated : h))
          );
          const key = dayKey(today!);
          setWorkedDay((prev) => ({ ...prev, [habitId]: key }));
          clearTimeout(workTimers.current[habitId]);
          workTimers.current[habitId] = setTimeout(() => {
            setWorkedDay((prev) => {
              const next = { ...prev };
              delete next[habitId];
              return next;
            });
          }, 600);
        }
        setCheckingInId(null);
      })
      .catch(() => {
        setNotice("That check-in did not go through. Try again.");
        setCheckingInId(null);
      });
  }

  function handleUncheck(habitId: number) {
    if (userId === null || checkingInId !== null || !today) return;
    setCheckingInId(habitId);
    setNotice(null);

    fetch(`${API_URL}/habits/${habitId}/checkins`, {
      method: "DELETE",
      headers: { "X-User-Id": String(userId) },
    })
      .then((res) => {
        if (res.status === 429) {
          setNotice(
            "Too many attempts in a minute. Wait a moment, then try again."
          );
          return null;
        }
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((updated: Habit | null) => {
        if (updated) {
          setHabits((prev) =>
            prev.map((h) => (h.id === updated.id ? updated : h))
          );
        }
        setCheckingInId(null);
      })
      .catch(() => {
        setNotice("That undo did not go through. Try again.");
        setCheckingInId(null);
      });
  }

  function handleAddHabit(event: FormEvent) {
    event.preventDefault();
    const name = newHabitName.trim();
    if (!name || userId === null || adding) return;

    setAdding(true);
    setNotice(null);
    fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": String(userId),
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((habit: Habit) => {
        setHabits((prev) => [...prev, habit]);
        setNewHabitName("");
        setAdding(false);
      })
      .catch(() => {
        setNotice(`"${name}" was not added. Try again.`);
        setAdding(false);
      });
  }

  function handleRemoveHabit(habitId: number) {
    if (userId === null) return;
    setNotice(null);
    fetch(`${API_URL}/habits/${habitId}`, {
      method: "DELETE",
      headers: { "X-User-Id": String(userId) },
    })
      .then(() => {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
      })
      .catch(() => {
        setNotice("That habit was not removed. Try again.");
      });
  }

  const dateLine = useMemo(
    () => (today ? formatLongDate(today) : ""),
    [today]
  );

  return (
    <main className="min-h-screen px-8 py-10">
      <div className="mx-auto w-full max-w-[58rem]">
        <header className="flex items-center justify-between gap-6 pb-6">
          <div className="flex items-center gap-3">
            <img src="/images/tiger-logo.png" alt="" className="h-9 w-9" />
            <h1 className="text-[0.9375rem] font-semibold tracking-tight text-[var(--color-ink)]">
              Habit Tracker
            </h1>
          </div>
          <p className="text-[0.8125rem] tabular-nums text-[var(--color-ink-muted)]">
            {dateLine}
          </p>
        </header>

        {notice && (
          <p
            role="status"
            className="mb-6 rounded-[var(--radius)] border border-[var(--color-thread-dark)] px-4 py-3 text-[0.8125rem] text-[var(--color-thread-dark)]"
          >
            {notice}
          </p>
        )}

        {status === "error" && (
          <section className="panel mb-2">
            <h2 className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
              The habits did not load
            </h2>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              The API did not answer. Check that the backend is running, then try again.
            </p>
            <button
              type="button"
              className="btn-primary mt-4"
              disabled={userId === null}
              onClick={() => userId !== null && load(userId)}
            >
              Try again
            </button>
          </section>
        )}

        {status === "loading" && (
          <ul className="m-0 list-none p-0">
            {[0, 1, 2].map((i) => (
              <li key={i} className="leaf animate-pulse">
                <div className="min-w-0">
                  <div className="h-5 w-40 rounded bg-[var(--color-rule)]" />
                </div>
                <div className="w-[236px]">
                  <div className="h-[18px] w-full rounded bg-[var(--color-rule)]" />
                  <div className="mt-2 h-[20px] w-full rounded-full bg-[var(--color-rule)]" />
                  <div className="mt-1.5 h-4 w-full rounded bg-[var(--color-rule)]" />
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-8 w-12 rounded bg-[var(--color-rule)]" />
                  <div className="h-8 w-px bg-[var(--color-rule)]" />
                  <div className="h-8 w-12 rounded bg-[var(--color-rule)]" />
                </div>
                <div>
                  <div className="h-11 w-[152px] rounded-[var(--radius)] bg-[var(--color-rule)]" />
                </div>
                <div className="h-9 w-9 rounded-full bg-[var(--color-rule)]" />
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddHabit} className="add-card">
          <div className="add-row">
            <label htmlFor="new-habit" className="sr-only">
              New habit name
            </label>
            <input
              id="new-habit"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="New habit name"
              className="field"
              maxLength={80}
            />
            <button type="submit" className="btn-add" disabled={adding}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
              {adding ? "Adding" : "Add habit"}
            </button>
          </div>
        </form>

        {status === "ready" && habits.length === 0 && (
          <section className="panel">
            <h2 className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">
              No habits yet
            </h2>
            <p className="mt-1.5 max-w-prose text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              Add one above. A name is all it needs. Each day you check in, the
              week rail fills another day of thread.
            </p>
          </section>
        )}

        {status === "ready" && habits.length > 0 && today && (
          <ul className="m-0 list-none p-0">
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                today={today}
                checkingIn={checkingInId === habit.id}
                animateDay={workedDay[habit.id] ?? null}
                onCheckIn={handleCheckIn}
                onUncheck={handleUncheck}
                onRemove={handleRemoveHabit}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

