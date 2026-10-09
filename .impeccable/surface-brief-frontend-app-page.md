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
- Proof/content: real check-in history from the API. The seed carries every state this surface must
  handle: a perfect week (Drink water, Yoga), a chain broken on Monday (Morning run, streak 1), two
  misses (Read 20 pages, streak 2), and a today that is already done.
- Constraints: backend API shape is fixed and stays fixed. `GET /habits` already returns each habit's
  full `checkins` array with `checked_at`, so per-day state is read from the existing response. No
  endpoint, header convention, or response schema changes. Brand orange / beige palette and Inter are
  pinned.

## Direction

The stitched sampler row. A cream linen ground, one orange thread. Each day of the trailing week is
one stitch worked along a hard rule; a missed day is bare canvas with the needle's holes left in it.
The lead-in thread runs from the last worked stitch to the next empty one and lands on today, so the
chain always shows where the thread is waiting.

Memorable moment: the loose thread that points at today's stitch, which tightens into a tied loop the
moment the check-in lands.

## Direction contract

**THESIS.** The week strip is the product, not a stat under a habit list. The category default here is
a row of seven identical grey boxes with a tick in five of them; this surface refuses that and makes
the week read as one continuous worked line whose thread physically points at the only stitch left.

**OWN-WORLD.** Flat, unmodulated, no gradients and no gloss. Cream linen ground with a warmer paper
leaf per habit and one soft warm shadow so the leaf sits on the cloth. Exactly two inks: brown ink for
type and rules, tiger orange for thread. Day state is carried by fill level, never by hue alone: a
worked stitch is a solid orange bar, a miss is bare canvas with two punched holes, today-unworked is
an empty slot the thread arrives at. Inter throughout, tabular numerals pulled hard to a right rail,
ledger density, one spacing rhythm. Radius stays at the pinned 0.625rem on the leaf and goes fully
round only on a stitch.

**STORY.** The visitor understands that time here is a thread, not a grid: each day is worked once,
in order, and a gap breaks the line. They read the strip as a bar of light moving left to right and
learn, without instruction, which stitch is the one they owe. The lead-in thread is the invitation and
the tied loop is the receipt.

**FIRST VIEWPORT.** A standard app shell: a top bar carrying the tiger mark, the product name at the
left, and today's date spelled out in tabular numerals at the right. Below it, the habit list as a
ledger of paper leaves, one leaf per habit, divided by drawn gaps rather than borders. Each leaf reads
left to right in three zones: the habit name with its best streak beneath it (left, growing); the
seven-stitch strip with weekday initials beneath it (centre, fixed width); then the current streak in
large tabular numerals with "days" set small against its baseline, and the Check in button hard
right. The signature move lives only in the strip. The add-habit form is an inline row below the list.

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