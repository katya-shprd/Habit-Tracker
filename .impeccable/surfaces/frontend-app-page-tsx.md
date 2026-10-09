---
version: 1
slug: "frontend-app-page-tsx"
primary_target: "frontend/app/page.tsx"
related_targets: []
---

# Surface brief — dashboard (frontend/app/page.tsx)

## Scope and mode

- Primary target: `frontend/app/page.tsx`
- Related targets: `frontend/components/WeekStrip.tsx`, `frontend/components/HabitRow.tsx`, `frontend/lib/habits.ts`, `frontend/app/globals.css`
- Mode: **Operate**. The visitor came to log a check-in and see whether the chain survived.
- Platform: web, desktop browser assumed. Mobile is not a target of the current build.

## Audience, job, action

- Audience: one person, one or two daily habits, opening the app in the moment of doing the thing.
- Job: log today's check-in in one deliberate click, and read at a glance whether today is done and
  how much chain is at risk.
- Primary action: the Check in button, one click, never behind a confirmation.
- Proof/content: real check-in history from the API. The seed writes 30 days back at 85% completion,
  at random, so it guarantees a mix of worked and missed days and a streak that has been broken
  somewhere in the window, but it does **not** guarantee a perfect week and it never checks in on
  today (`range(30, 0, -1)` stops at yesterday). A "today is already done" row only appears after
  the user checks in during the session, or from a database carried over between runs. Design
  against the random mix; do not assume any single habit's shape.
- Constraints: backend API shape is fixed and stays fixed. `GET /habits` already returns each habit's
  full `checkins` array with `checked_at`, so per-day state is read from the existing response. No
  endpoint, header convention, or response schema changes. Brand orange / beige palette and Inter are
  pinned.

## Direction

The stitched sampler row, rebuilt as a rail. A cream linen ground, one orange thread. The calendar
week runs Monday to Sunday and sits on a single round rail: seven ring nodes, ticked when worked,
a dashed open ring when missed, a bold open ring when today is still owed, and no mark at all when
the day has not come yet. The rail fills with Tiger Thread from Monday for as long as the days hold
and stops dead at the first break, so where it stops is the answer to "what am I about to lose".
A missed day is the one state that costs the user something, so it breaks the thread rather than
carrying it, and it never looks like a day still to come.

Memorable moment: on a check-in, the rail draws itself forward to today's node, the node lands on
it, and the tick is stitched in over it.

## Direction contract

**THESIS.** The week rail is the product, not a stat under a habit list. The category default here is
a row of seven identical grey boxes with a tick in five of them; this surface refuses that and makes
the week read as one continuous length of thread whose rail stops exactly where the chain broke.

**OWN-WORLD.** Flat, unmodulated, no gradients and no gloss. Cream linen ground with a warmer paper
leaf per habit and one soft warm shadow so the leaf sits on the cloth. Exactly two inks: brown ink for
type and rules, tiger orange for thread. Day state is carried by fill level and form, never by hue
alone: a worked node is a solid ticked disc, a miss is a dashed open ring, today-unworked is a bold
open ring inside the one lit column, and a day still to come carries no node at all. Inter throughout, tabular numerals
pulled hard to a right rail, ledger density, one spacing rhythm. Radius stays at the pinned 0.625rem
on the leaf and goes fully round only on the rail and its nodes.

**STORY.** The visitor understands that time here is a thread, not a grid: each day is worked once,
in order, and a gap breaks the line. They read the rail as a bar of light moving left to right and
learn, without instruction, where the chain stopped and which node is the one they owe. A dashed
node and an empty one never look alike, so a day that was lost can never be mistaken for a day that
has not arrived.

**FIRST VIEWPORT.** A standard app shell: a top bar carrying the tiger mark, the product name at the
left, and today's date spelled out in tabular numerals at the right. Below it, the habit list as a
ledger of paper leaves, one leaf per habit, divided by drawn gaps rather than borders. Each leaf reads
left to right in three zones: the habit name with its best streak beneath it (left, growing); the
week rail with the weekday above it and the date number below it (centre, fixed width); then the
current streak in large tabular numerals with "days" set small against its baseline, and the Check in
button hard right. The signature move lives only in the rail. The add-habit form is an inline row
below the list.

**FORM.** Chosen form: the stitched sampler row, grounded candidate 4 of 7. Seed key `c323daae`,
assigned by the roll. Raised by four declined or competitive systems, each as a named line:
- from the reference-manual acetate board: one full-strength hue per habit is the only place a second
  colour may enter the screen.
- from labanotation: day state is encoded as level (solid, hatched, dotted), never as hue alone.
- from the cassette J-card: one ink, one hand, and running figures pulled tight against a right rail.
- from the zoo guide map: flat unmodulated fills, no gradients, and the divider between two habits is
  a drawn gap, never an implied border.
- from the emission-line rail: one calibrated alignment rule governs the strip, and a mark's form and
  weight carry its state.
- from the warm consumer canon: the saturated orange appears only where something can be pressed or
  where today is at stake.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions

- Habit-level accent hue is written into the contract but not yet used; the surface currently ships on
  orange alone. Whether each habit gets its own thread colour is a later step, not this one.
- History beyond the trailing week (a month view, the five-bar tally gate) is deliberately out of scope
  for step 1.
- No loading, error, or empty states existed in the incumbent page. This step adds them.
