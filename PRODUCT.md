# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a single-habit daily user. They already have one routine they intend to
keep doing, and they open the app in the moment of doing (or just after) it, often more than once
a day. Their job is to log the check-in with the least possible friction and see that the chain is
still alive.

This is a web app reached in a desktop browser, not a mobile app. There is no native shell and no
app store install; the surface is the single page served by Next.js. Desktop browser is the assumed
viewport for design work, and mobile is not a target of the current build. Responsive behavior was
not specified by the user and no requirement for it is recorded.

The seeded demo data shows a broader set of habits (Morning run, Read 20 pages, Meditate,
Drink water, Yoga), so multi-habit use is the seeded shape even though one habit at a time is
the target scenario. Do not treat the seed list as the primary use case.

## Product Purpose

A small habit tracker where a person holds a set of habits, checks in on them day to day, and
builds a streak. Success means the check-in is near-effortless and the streak is legible at a
glance, so the user can tell at a glance whether today is done and how much chain is at risk.

## Positioning

Streaks are the core mechanic, not a vanity stat bolted onto a logging app. Success is the
streak, and every part of the product exists to protect and grow it. A neighbor product could
copy a habit list with checkmarks; it could not truthfully copy a design whose whole hierarchy
is ordered by "is my chain safe today."

## Operating Context

- Single-page dashboard at `frontend/app/page.tsx`, served by Next.js App Router.
- Data lives in FastAPI + Postgres; Redis carries rate limiting and short-lived TTL state.
- The whole stack runs through Docker Compose. `docker compose up` seeds a demo user with 30
  days of check-in history on first boot.
- Requests are unauthenticated in practice: the frontend reads `/users` and takes the first
  user's id, then sends it as an `X-User-Id` header on every call.
- Check-in is rate limited to 60 attempts per minute per user.

## Capabilities and Constraints

Confirmed capabilities:

- List a user's habits with current and longest streak.
- Create a habit by name.
- Delete a habit (cascades its check-ins).
- Check in on a habit; the streak recomputes from check-in days after each check-in and is
  also recomputed on read, because the cached column can lag.

Binding constraints from the user:

- **Backend API shape is fixed.** FastAPI endpoints, the `X-User-Id` header convention, and the
  response schemas stay as they are. This is a frontend design surface.
- **Brand tokens as-is.** The tiger orange / beige palette and Inter in
  `frontend/tailwind.config.ts` are the committed palette and type. Do not repaint the product.
- **Existing tiger logo asset.** `frontend/public/images/tiger-logo.png` stays the product mark.
- **Existing copy and flows.** Current labels and user-facing flows are incumbent identity to
  refine, not replace.

Open by decision, not by default — a later answer corrected an earlier one here:

- **New visual world, tokens only.** The committed tiger orange / beige palette, Inter, and the
  logo asset are fixed tokens that any new direction must be built from. Everything above the
  tokens — layout, hierarchy, type scale, expression, component design — is open for replacement.
  The current UI is a starting point for the data and the flows, not a reference for how it should
  look; the README's statement that it is intentionally not the quality bar stands.

Undecided product facts, recorded rather than invented:

- No authentication, onboarding, or multi-user story exists yet.
- Habits are name-only. There is no schedule, frequency, category, or time-of-day on a habit,
  so no design may assume "daily at 8am" semantics that the data cannot support.
- Grace days, freezes, and streak repair do not exist in the model. A design that promises them
  would be claiming a capability the API does not have.
- There are no notifications, reminders, history views, or stats beyond the two streak numbers.

## Brand Commitments

- Product name in the interface is "Habit Tracker", set next to the tiger mark.
- The tiger logo asset is the identity anchor and is treated as fixed.
- Palette and type are fixed: brand orange `#ff9327` family (`brand-50` through `brand-900`) over
  beige (`beige-100` page, `beige-900` text family), Inter as the sans stack, 0.625rem default
  radius. These are given, not proposals.

## Evidence on Hand

- Seed data with 30 days of check-in history at roughly 85% completion, plus a deliberate
  late-night pair (00:03 and 23:57 check-ins) on the first user's first habit. This is real
  fixture data to design against, including boundary cases.
- No testimonials, customers, press, benchmarks, pricing, or usage analytics exist. None may be
  invented in future work.
- The README is explicit that the current UI is intentionally minimal and is not the quality
  bar, so visual maturity of the existing UI is not evidence about the target.

## Product Principles

1. **One action to done.** A check-in is the primary action on this surface and must never cost
   more than a single deliberate click, with no confirmation step standing in its way.
2. **Today's state is the headline.** The first read of the screen answers "what still needs
   doing today", not "what is my all-time best".
3. **The chain is precious.** Streak numbers are treated as something to protect, so the risk of
   losing a chain is always legible and never lost silently.
4. **Earn the extras.** Anything beyond check-in and streak visibility has to justify itself
   against the cost it adds to the daily path.
5. **Honest to the data.** Only state what the API can actually support. No invented schedules,
   freezes, reminders, or stats.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established by the user. The baseline that
does apply: a once-a-day personal task reached in a browser, so keyboard operability, focus
visibility, contrast against the beige/brand pairing, and non-color means of reading streak state
are the obvious candidates when a surface is designed. Pointer targets should still meet a
comfortable minimum size, but touch-first conventions are not the governing constraint.

When I say "commit", stage all changes and commit with a short, descriptive message. Never push without approval. 