"use client";

import { useId } from "react";

import { currentWeek, dayKey, isFuture } from "../lib/habits";

/**
 * The signature move: a week worked as one length of thread.
 *
 * Three rows. Weekdays sit on top, then the rail, then the calendar numbers.
 * Under the rail sits a node for every day: filled and ticked when worked, a
 * ring with a cross when missed, a green disc when today is done, a ring with a
 * dot while today is still owed, and an empty circle for a day still to come.
 *
 * Every card is drawn the same way. The rail is always one pale length from
 * Monday to today: pale orange while today is still owed, pale grey once it is
 * done. Only the colour changes, so a list of cards reads as one system.
 *
 * While today is owed the nodes carry the orange thread, so the run reads as
 * live. Once today is done the strip turns green and the worked days settle to
 * grey, so a finished card can never be mistaken for an open one.
 *
 * Every measurement below is fixed, so the labels, the numbers and the rail all
 * hang off the same pitch and can never drift from the nodes.
 */
const DAYS = 7;
const NODE = 20;
const PITCH = 34;
const BOX_W = PITCH * (DAYS - 1) + NODE;
const TRACK_X = NODE / 2;
const TRACK_H = 4;
const TRACK_Y = (NODE - TRACK_H) / 2;
const MID_Y = NODE / 2;
/** The empty circle on a day that has not come yet. */
const AHEAD_R = NODE / 2 - 1;
/** Label rows are hung on the node pitch, not the box width. */
const LABEL_W = PITCH * DAYS;
const LABEL_SHIFT = TRACK_X - PITCH / 2;
/** Height of the weekday row, and the gap from it down to the node row. */
const LABEL_H = 18;
const ROW_GAP = 8;
/** Where the node row starts inside the strip. */
const NODE_TOP = LABEL_H + ROW_GAP;
/** The date row sits under the rail, so it clears every node. */
const NUM_GAP = 6;
const NUM_TOP = NODE_TOP + NODE + NUM_GAP;
const NUM_H = 16;
const STRIP_H = NUM_TOP + NUM_H;

const centreX = (i: number) => TRACK_X + i * PITCH;

type Props = {
  checked: Set<string>;
  today: Date;
  /** Day key to play the worked-node entrance on, after a check-in. */
  animateDay: string | null;
};

export default function WeekStrip({ checked, today, animateDay }: Props) {
  const days = currentWeek(today);
  const todayKey = dayKey(today);
  const todayIndex = days.findIndex((d) => d.key === todayKey);
  const justWorked = animateDay !== null;
  const clipId = `rail-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Today done turns the whole strip green. Otherwise the orange thread says
  // the run is still live.
  const doneToday = checked.has(todayKey);
  const accent = doneToday ? "var(--color-sage-500)" : "var(--color-thread)";
  // The rail is one pale length in both states. It stays pale orange while the
  // run is live and turns pale grey once today is done, so every card in the
  // list is built the same way and only the colour says which state it is in.
  const railColor = doneToday
    ? "var(--color-track-done)"
    : "var(--color-track-bed)";
  // The tick is dark on every filled node, on green and on orange alike.
  const tickInk = "var(--color-ink-strong)";

  // The rail is one length from Monday to today. It does not stop at a break,
  // because the nodes already say which days were worked. It stops at today,
  // because the days still to come are not part of this week yet.
  const bedW = todayIndex < 0 ? 0 : centreX(todayIndex) - TRACK_X;

  return (
    <div
      className={`strip${doneToday ? " strip-done" : ""}`}
      style={{ width: BOX_W, height: STRIP_H }}
    >
      {/* Today is lit from behind, so the eye finds it at a glance. The fill
          sits under the rail, so the rail reads as passing behind the card. */}
      {todayIndex >= 0 && (
        <div
          className="today-band"
          style={{ left: LABEL_SHIFT + todayIndex * PITCH, width: PITCH }}
          aria-hidden="true"
        />
      )}

      <div
        className="flex"
        style={{ width: LABEL_W, marginLeft: LABEL_SHIFT, height: LABEL_H }}
        aria-hidden="true"
      >
        {days.map((day) => (
          <div
            key={day.key}
            className={`day-week${day.key === todayKey ? " day-week-today" : ""}`}
            style={{ width: PITCH }}
          >
            {day.label}
          </div>
        ))}
      </div>

      <svg
        className="block overflow-visible"
        style={{ marginTop: ROW_GAP }}
        width={BOX_W}
        height={NODE}
        viewBox={`0 0 ${BOX_W} ${NODE}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={TRACK_X}
              y={TRACK_Y}
              width={BOX_W - NODE}
              height={TRACK_H}
              rx={TRACK_H / 2}
            />
          </clipPath>
        </defs>

        {/* One pale rail, Monday to today, in both states. It never changes width or
            presence, so every card in the list is drawn the same way. */}
        {bedW > 0 && (
          <rect
            className={justWorked ? "rail-fill" : undefined}
            style={{ "--rail-fill": `${bedW}px` } as React.CSSProperties}
            x={TRACK_X}
            y={TRACK_Y}
            width={bedW}
            height={TRACK_H}
            rx={TRACK_H / 2}
            fill={railColor}
            clipPath={`url(#${clipId})`}
          />
        )}

        {days.map((day, i) => {
          const cx = centreX(i);
          const isToday = day.key === todayKey;
          const ahead = isFuture(day.key, todayKey);
          const isDone = checked.has(day.key);
          const isMissed = !isDone && !isToday && !ahead;
          const pop = day.key === animateDay;
          // Once today is done the past settles, so green stays on today alone.
          const doneFill =
            isDone && !isToday
              ? doneToday
                ? "var(--color-settled)"
                : "var(--color-thread)"
              : accent;

          return (
            <g key={day.key} className={pop ? "node-worked" : undefined}>
              {/* The rail runs behind every node. */}
              <circle
                cx={cx}
                cy={MID_Y}
                r={NODE / 2 - 1}
                fill="var(--color-leaf)"
                stroke={
                  ahead
                    ? "var(--color-ahead)"
                    : isMissed
                      ? "var(--color-rule)"
                      : "none"
                }
                strokeWidth={1.5}
              />

              {isDone && (
                <>
                  <circle cx={cx} cy={MID_Y} r={NODE / 2 - 1} fill={doneFill} />
                  <path
                    className={pop ? "check-mark" : undefined}
                    d={`M ${cx - 4.5} ${MID_Y + 0.2} L ${cx - 1.4} ${MID_Y + 3.2} L ${cx + 4.8} ${MID_Y - 3.2}`}
                    fill="none"
                    stroke={tickInk}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* A missed day keeps its cross. It says the day passed and
                  nothing was worked, without turning into an alarm. */}
              {isMissed && (
                <path
                  d={`M ${cx - 3.2} ${MID_Y - 3.2} L ${cx + 3.2} ${MID_Y + 3.2} M ${cx + 3.2} ${MID_Y - 3.2} L ${cx - 3.2} ${MID_Y + 3.2}`}
                  fill="none"
                  stroke="var(--color-ink-muted)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              )}

              {/* Today, still owed: an open ring with a dot at the centre. The
                  rail arrives at it and waits. */}
              {!isDone && isToday && (
                <>
                  <circle
                    cx={cx}
                    cy={MID_Y}
                    r={NODE / 2 - 1}
                    fill="var(--color-leaf)"
                    stroke="var(--color-thread)"
                    strokeWidth={2}
                  />
                  <circle cx={cx} cy={MID_Y} r={3.25} fill="var(--color-thread)" />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Once today is done the rail goes away with the orange. A green card has no
     thread in it, only the record of one. */}
      <div
        className="absolute flex items-center"
        style={{
          top: NUM_TOP,
          height: NUM_H,
          width: LABEL_W,
          marginLeft: LABEL_SHIFT,
        }}
        aria-hidden="true"
      >
        {days.map((day) => (
          <div
            key={day.key}
            className={`day-num${day.key === todayKey ? " day-num-today" : ""}`}
            style={{ width: PITCH }}
          >
            {day.date}
          </div>
        ))}
      </div>

      {/* Today's outline sits on top of the rail, so the card stays whole
          where the thread arrives at it. */}
      {todayIndex >= 0 && (
        <div
          className="today-edge"
          style={{ left: LABEL_SHIFT + todayIndex * PITCH, width: PITCH }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}