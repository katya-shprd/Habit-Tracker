---
name: Habit Tracker
description: One orange thread worked across a cream linen ledger, day by day.
colors:
  linen: "#f6ece2"
  leaf: "#fbf6ef"
  ink: "#5a4632"
  ink-strong: "#3f3020"
  ink-muted: "#7a6249"
  thread: "#ff9327"
  thread-dark: "#8b3a0e"
  rule: "#d6c1a5"
  hole: "#9c7c55"
  track-bed: "#ffe0c7"
  miss: "#8b3a0e"
typography:
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.25
  data:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1"
rounded:
  DEFAULT: "0.625rem"
  node: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.875rem"
  lg: "1.25rem"
  xl: "1.5rem"
  leaf-pad: "1.375rem 1.5rem"
  zone-gap: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.thread}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.DEFAULT}"
    height: "2.5rem"
    padding: "0 1.125rem"
  button-primary-hover:
    backgroundColor: "{colors.thread-dark}"
    textColor: "#fff5ea"
    rounded: "{rounded.DEFAULT}"
    height: "2.5rem"
  button-primary-done:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.DEFAULT}"
    height: "2.5rem"
  button-outline:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    height: "2.5rem"
    padding: "0 1.125rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  field:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    height: "2.5rem"
    padding: "0 0.875rem"
  card-leaf:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "{spacing.leaf-pad}"
---

# Design System: Habit Tracker

## Overview

**Creative North Star: "The Stitched Sampler"**

A habit tracker is usually drawn as a row of seven identical boxes with a tick in five of
them. That layout says "form", and it makes the streak a number you have to trust rather than a
thing you can see. This system draws the week as one continuous worked length: seven days sit on a
single orange rail as rings, the rail fills for as long as the days hold and stops dead at the
first break, and a miss cuts the line. The rail is the chain, so where it stops is the answer to
"what am I about to lose".

The material is deliberately plain. Cream linen ground, warm paper leaves, one orange thread, brown
ink for type. Nothing is textured, glossy, or shaded for effect: the whole system is flat fills and
one soft warm shadow, because the world is cloth and thread, not glass and chrome. Density is
ledger-tight and everything sits on one ruled baseline, so a person who checks in several times a
day reads this in seconds and never hunts.

**Key Characteristics:**
- Day state is carried by mark *form* and *fill level*, never by hue alone.
- The saturated orange appears only where something can be pressed, or where today is at stake.
- Numerals are tabular and pulled against a hard right rail, so figures align down a column.
- Flat, unmodulated fills. No gradients, no gloss, no decorative motion.
- One authored moment: the rail drawing itself to today's node, the node landing, the tick going in.

## Colors

The palette is two inks on cloth: a warm brown for type and rules, a single saturated orange
reserved for the thread. Pinned brand tokens (`beige-100` linen, `brand-500` thread, `brand-900`
thread-dark, `beige-900` ink) are unchanged from `tailwind.config.ts`; the remaining values are
derived from those same hues.

### Primary
- **Tiger Thread** (`#ff9327`): the thread itself. The worked rail and its ticked nodes, today's
  open waiting ring, and the primary button fill. It is never decoration.

### Secondary
- **Deep Thread** (`#8b3a0e`): the thread's own shadow and the system's one "stop" colour. Primary
  button hover, focus rings, the `Remove` hover, the check-in error notice, and the weekday and
  date of today. This is the colour the product uses to mark where you are and what went wrong,
  so it is never spent on anything else.

### Neutral
- **Linen** (`#f6ece2`): the page ground the whole product is worked on.
- **Paper Leaf** (`#fbf6ef`): the warmer card surface a leaf sits on, so it lifts off the linen
  without a border.
- **Brown Ink** (`#5a4632`): primary type, habit names, and the large streak figure.
- **Deep Ink** (`#3f3020`): the ink used *on* the thread. Text on `#ff9327` fails contrast at white;
  near-black brown holds 5.6:1. It is the tick inside every worked node.
- **Faded Ink** (`#7a6249`): secondary type — "best 12", the weekday and date rows, "Remove", the
  streak unit. Holds 5.3:1 on paper leaf. Never a neutral grey; always a tint of the brown ink.
- **Rail Bed** (`#ffe0c7`, brand-100): the unwoven length of the week rail, and the lit column
  behind today. It is the only place a lighter orange appears and it never marks anything a
  person can press.
- **Sampler Rule** (`#d6c1a5`): the printed field the components sit on: the input's resting inset,
  the disabled button's inset, the scrollbar. Structural only; never carries state.
- **Needle Hole** (`#9c7c55`): the marks that locate rather than state — the input's hover inset
  and the scrollbar's hover. 3.6:1 against the leaf, above the 3:1 floor for a non-text mark.

### Named Rules

**The One Thread Rule.** The saturated orange appears on a screen only where a person can act
(right now: the primary button) or where today is at stake (the waiting ring, the worked rail).
Adding orange anywhere else spends the only loud colour the product has.

**The Form-Not-Hue Rule.** No state in this system is distinguishable only by colour. A worked day,
a missed day, an owed day, and a day still to come differ in shape and fill level as well as hue,
so the rail still reads in greyscale and to a colourblind reader.

## Typography

**Display Font:** Inter (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Inter (with the same fallback)

**Character:** One workhorse family, no display pairing. This is a tool a person opens in the
morning to do one thing, so the type has to be quiet, dense, and legible at 11px; Inter at these
sizes with tabular figures is exactly that. Scale steps are tight (roughly 1.125) because product
UI punishes exaggerated contrast with noise.

### Hierarchy
- **Data** (600, 1.75rem, tabular, -0.02em): the current streak figure. The largest thing on the row,
  because the chain is the point.
- **Title** (600, 0.9375rem): habit names in a row, and the product name in the top bar.
- **Body** (400, 0.875rem / 1.625): empty-state and error-state prose. 65–75ch, held to about 34rem
  by the panel's max-width.
- **Label** (500, 0.6875rem): "best 12", weekday initials, the streak unit, "Remove".
- **Ledger rule:** every figure that can be compared down a column uses `font-variant-numeric:
  tabular-nums` — the streak column, the weekday row, and the date in the top bar.

### Named Rules

**The Hard Right Rail Rule.** Figures that a person compares across rows align to the right edge.
No centred numerals, no proportional figures inside a data column.

## Layout

A single ledger column, `max-width: 44rem`, centred, with `2rem` of side padding and a `2.5rem`
gap between a heading and the list below it. One spacing rhythm runs the whole surface: `0.25`,
`0.5`, `0.875`, `1.25`, `1.5rem`.

A habit row is a four-zone grid on one ruled baseline: `minmax(0, 1fr) auto auto auto` with a
`2.5rem` column gap. The first zone grows (habit name and best streak), the week rail and the
streak figure size to content, and the actions sit hard right. The row is a paper leaf at
`1.375rem` vertical and `1.5rem` horizontal padding.

Below `48rem` the row becomes a two-column grid in three bands: name and streak figure share the
first line, the week rail centres itself on a full-width line of its own, and the actions sit on
the third with the primary button left and `Remove` right. The rail never wraps or overflows; its
geometry is computed in fixed pixels, so it is identical at every width.

## Elevation & Depth

Hybrid, and almost entirely tonal. Depth comes from the value step between linen and paper leaf,
not from a shadow stack: a leaf is lighter than the cloth it sits on, and one very soft warm shadow
plus a one-pixel contact shadow gives it just enough lift to read as a separate piece of paper.

### Shadow Vocabulary
- **Leaf** (`0 1px 1px rgba(90,70,50,0.05), 0 10px 22px -14px rgba(90,70,50,0.45)`): every paper leaf
  and panel. Wide, blurred, strongly negative-spread — a paper edge lifting off cloth, never a
  block offset.

### Named Rules

**The No-Offset-Shadow Rule.** Shadows carry a real offset and a real blur. A hard `4px 4px 0` block
is a costume and does not appear in this system.

## Shapes

Radius is 0.625rem on every rectangular surface: leaves, panels, buttons, and the text field. The
week rail and its nodes are the one exception — they are fully round, because thread laid in a loop
is not a chip. Buttons never become pills. Nothing is clipped into an exotic silhouette; the only
shapes on the surface are the rounded leaf, the round node, and the rail.

## Components

### Buttons

Flat, 2.5rem tall, 0.625rem radius, 0.8125rem semibold, `white-space: nowrap`. Tactile and plain:
a button is a pressed surface, not a chrome object.

- **Primary (`btn-primary`)** — Tiger Thread fill with Deep Ink text (5.6:1). The only saturated
  fill in the interface. Hover drops it to Deep Thread with `brand-50` text (7.1:1). Active
  translates down 1px, so pressing is felt.
- **Primary, done (`btn-primary:disabled`)** — the fill is removed entirely: transparent with a
  1px Sampler Rule inset and Faded Ink text, and the label reads "Checked in". An inactive action
  loses the colour; it does not go pale orange.
- **Outline (`btn-outline`)** — Paper Leaf with a 1px Needle Hole inset. Secondary actions
  (`Add habit`, `Try again`) live here so the check-in keeps the only orange.
- **Quiet (`btn-quiet`)** — Faded Ink at 0.6875rem, no fill, no border. Destructive text actions
  (`Remove`) only.

Transitions are 160ms on `cubic-bezier(0.16, 1, 0.3, 1)`.

### Inputs / Fields

Paper Leaf fill with a 1px Sampler Rule inset (not a border), 2.5rem tall, 0.875rem body text. The
placeholder is Faded Ink at full opacity, not a browser default grey. Hover deepens the inset to
Needle Hole; focus deepens it to Deep Thread and drops the focus ring, because the inset change is
the ring.

### Cards / Containers

- **Leaf (`leaf`)** — the habit row grid. Paper Leaf, 0.625rem radius, the Leaf shadow, no border.
  Rows are separated by drawn space, never by a divider line.
- **Panel (`panel`)** — the same surface for prose: empty state, error state, 1.5rem padding,
  `max-width: 34rem`.

### The Week Rail

The signature component, and the only place the product's metaphor lives. One round rail runs the
width of the week and seven nodes sit on it, on a fixed 32px pitch with 18px nodes and a 7px rail.
The week is the calendar week, Monday to Sunday, so the strip never slides and the last day is
always Sunday. Above the rail sit the three-letter weekday; below it sit the date numbers. Both
label rows hang on the node pitch, not the box width, so a label can never drift off its node.

The rail is the chain. It fills with Tiger Thread from Monday for as long as the days hold and
stops dead at the first break. When nothing before today was missed it still reaches today's node,
so the thread always arrives at the one stitch the person still owes.

Four states, distinguished by shape before colour:

- **Worked** — a solid Tiger Thread disc with a Deep Ink tick laid in it.
- **Missed** — an 8px Tiger Thread ring broken into dashes and filled with Rail Bed, so the thread
  reads as unwoven at that day rather than carried through. The day keeps its row, its weekday and
  its date; nothing is erased, so a miss stays accounted for without being made into an alarm.
- **Owed (today)** — a bold 2px open Tiger Thread ring, the stitch not worked yet. Today is also
  the one column lit from behind: a Rail Bed band carrying a 1.5px Tiger Thread outline, running
  from above the weekday row to below the date, so the eye lands on it without reading anything.
  Its weekday and its date both go to Deep Thread.
- **Ahead** — no node and no rail at all. A day that has not happened keeps its weekday and its
  calendar number and nothing else, so the future stays as quiet as it is empty.

**The rail.** Unwoven lengths are Rail Bed, a brand-100 peach. Worked lengths are Tiger Thread.

The rail's bed and today's lit band are the same value, so the band is found by its Tiger Thread
outline rather than by its fill. Both sit *under* the rail, which is why the thread reads as one
unbroken length passing in front of a column of light. An outline drawn over the rail would cut
the line at today, and a cut line is the system's own language for a miss.

Every day in the week carries its calendar number under the rail, so the strip is a calendar week
and not a row of marks. The numbers are quiet ink except today's, which takes Deep Thread.

The rail bed is the only place a lighter orange appears, and it is never used for anything a person
can press.

Each row also carries a screen-reader sentence stating the habit name, the current streak, which
weekdays were worked, which were missed, whether today is done, and how many days are still to come.

The one authored moment plays on a check-in only: the rail draws itself forward to today's node,
the node lands on it, and the tick is stitched in over it.

## Do's and Don'ts

### Do:
- **Do** make a missed day *accounted for* without turning it into an alarm. A break in the thread
  says the chain stopped; the dashed node and the date that stays in its row say which day it was.
- **Do** tell a day that has not happened apart from a day that was lost. Form first: no mark at
  all against a dashed open ring.
- **Do** give every state a distinct shape as well as a distinct colour.
- **Do** keep the rail's geometry in fixed pixels (`PITCH`, `NODE`, `TRACK_H`, `NODE_TOP`,
  `NUM_TOP`) and hang all three rows off that same pitch, so nothing can drift out of register.
- **Do** start the week on Monday and end it on Sunday. A sliding window makes every day a
  different comparison and hides which day of the week the user is actually in.

### Don't:
- **Don't** add a second saturated colour. The screen has one thread.
- **Don't** add gradients, gloss, glass, or blur-as-decoration. The cloth is flat.
- **Don't** put a label above a heading, or an eyebrow over the top bar.
- **Don't** draw the row divider as a line. The gap between leaves is the divider.
- **Don't** use a progress ring, a sparkline, or seven identical grey boxes as the week view.
- **Don't** disable the check-in with a pale orange fill. Disabled means the colour is gone.
- **Don't** let the rail carry a day it does not have. It stops at the first break, always.
- **Don't** draw today's lit column over the rail. It cuts the thread at the one stitch the person
  has not worked yet, and the strip already uses a cut thread to mean a missed day.