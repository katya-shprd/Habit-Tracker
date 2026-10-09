"use client";

import { useId } from "react";

import { currentWeek, dayKey, isFuture } from "../lib/habits";

/**
 * The signature move: a week worked as one length of thread.
 *
 * Two rows. Weekdays sit on top. Under them runs one rail, from Monday to
 * today, carrying a node for every day that has happened: filled and ticked
 * when worked, a dashed open ring when missed, and a bold open ring for today
 * while it is still owed. Days still to come get no node and no rail, only
 * their calendar number, so the future stays quiet.
 *
 * Every measurement below is fixed, so the labels, the numbers and the rail all
 * hang off the same pitch and can never drift from the nodes.
 */
const DAYS = 7;
const NODE = 18;
const PITCH = 32;
const BOX_W = PITCH * (DAYS - 1) + NODE;
const TRACK_X = NODE / 2;
const TRACK_H = 7;
const TRACK_Y = (NODE - TRACK_H) / 2;
const MID_Y = NODE / 2;
/** Label rows are hung on the node pitch, not the box width. */
const LABEL_W = PITCH * DAYS;
const LABEL_SHIFT = TRACK_X - PITCH / 2;
/** Height of the weekday row, and the gap from it down to the node row. */
const LABEL_H = 18;
const ROW_GAP = 10;
/** Where the node row starts inside the strip. */
const NODE_TOP = LABEL_H + ROW_GAP;
const STRIP_H = NODE_TOP + NODE;

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

  // The rail is the chain. It runs from Monday for as long as the days hold,
  // and it stops at the first break. When nothing before today was missed it
  // still reaches today's node, so the thread always arrives at the stitch the
  // person still owes.
  let runEnd = -1;
  for (let i = 0; i < todayIndex; i += 1) {
    if (!checked.has(days[i].key)) break;
    runEnd = i;
  }
  if (runEnd === todayIndex - 1) runEnd = todayIndex;

  const fillW = runEnd < 0 ? 0 : centreX(runEnd) - TRACK_X;
  // The rail stops at today. It does not reach across the days still to come.
  const bedW = todayIndex < 0 ? 0 : centreX(todayIndex) - TRACK_X;

  return (
    <div className="strip" style={{ width: BOX_W, height: STRIP_H }}>
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

        {/* The unwoven length of rail. It runs Monday to today and stops. */}
        {bedW > 0 && (
          <rect
            x={TRACK_X}
            y={TRACK_Y}
            width={bedW}
            height={TRACK_H}
            rx={TRACK_H / 2}
            fill="var(--color-track-bed)"
          />
        )}

        {fillW > 0 && (
          <rect
            className={justWorked ? "rail-fill" : undefined}
            style={{ "--rail-fill": `${fillW}px` } as React.CSSProperties}
            x={TRACK_X}
            y={TRACK_Y}
            width={fillW}
            height={TRACK_H}
            rx={TRACK_H / 2}
            fill="var(--color-thread)"
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

          // A day that has not come yet keeps no node at all.
          if (ahead) return null;

          return (
            <g key={day.key} className={pop ? "node-worked" : undefined}>
              {isDone && (
                <>
                  <circle cx={cx} cy={MID_Y} r={NODE / 2} fill="var(--color-thread)" />
                  <path
                    className={pop ? "check-mark" : undefined}
                    d={`M ${cx - 4} ${MID_Y + 0.2} L ${cx - 1.2} ${MID_Y + 2.9} L ${cx + 4.3} ${MID_Y - 3}`}
                    fill="none"
                    stroke="var(--color-ink-strong)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* A missed day is a dashed ring filled with the rail colour. It reads
                  as a gap in the thread rather than an alarm. */}
              {isMissed && (
                <circle
                  cx={cx}
                  cy={MID_Y}
                  r={NODE / 2 - 1}
                  fill="var(--color-track-bed)"
                  stroke="var(--color-thread)"
                  strokeWidth={2}
                  strokeDasharray="3.5 3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Today, still owed: a bold open ring the rail arrives at. */}
              {!isDone && isToday && (
                <circle
                  cx={cx}
                  cy={MID_Y}
                  r={NODE / 2}
                  fill="var(--color-leaf)"
                  stroke="var(--color-thread)"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* A day still to come keeps no node. It shows its number instead, in
          the node row so it lines up with the circles beside it. */}
      <div
        className="absolute flex items-center"
        style={{
          top: NODE_TOP,
          height: NODE,
          width: LABEL_W,
          marginLeft: LABEL_SHIFT,
        }}
        aria-hidden="true"
      >
        {days.map((day) => (
          <div key={day.key} className="day-num" style={{ width: PITCH }}>
            {isFuture(day.key, todayKey) ? day.date : ""}
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