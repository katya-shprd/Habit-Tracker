export type Checkin = {
  id: number;
  habit_id: number;
  checked_at: string;
};

export type Habit = {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  current_streak: number;
  longest_streak: number;
  checkins: Checkin[] | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type WeekDay = {
  key: string;
  /** Three-letter weekday, Monday first. */
  label: string;
  /** Day of the month, for the date number under the track. */
  date: number;
  long: string;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Local calendar day as YYYY-MM-DD. The API sends naive local timestamps. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Every day this habit has a check-in, as YYYY-MM-DD keys. */
export function checkedDays(habit: Habit): Set<string> {
  return new Set((habit.checkins ?? []).map((c) => c.checked_at.slice(0, 10)));
}

/** The calendar week that holds `today`: Monday to Sunday, oldest first. */
export function currentWeek(today: Date): WeekDay[] {
  // Built through the Date constructor so a local midnight that a DST change
  // moves still lands on the right calendar day.
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - ((today.getDay() + 6) % 7)
  );

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + i
    );
    return {
      key: dayKey(date),
      label: DAY_LABELS[i],
      date: date.getDate(),
      long: date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  });
}

/** True for a day in this week that has not happened yet. */
export function isFuture(key: string, todayKey: string): boolean {
  return key > todayKey;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}