# AGENTS.md

Operational reference for AI coding assistants working in this repo. For what the app is, see [README.md](./README.md).

## Running the stack

Everything runs through Docker Compose, no local Python or Node install needed.

- `docker compose up` — starts Postgres, Redis, the FastAPI backend (auto-reload), and the Next.js frontend (auto-reload). Bind-mounted, so edits hot-reload without a rebuild.
- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>
- `docker compose logs -f backend` / `frontend` — tail logs for one service.
- `docker compose exec backend bash` — shell into the backend container.
- `docker compose exec postgres psql -U habit -d habit_tracker` — psql into the database.
- `docker compose down` — stop everything. Add `-v` to also wipe the Postgres volume (full reset; re-seeds automatically on the next `up`).

## Database migrations (Alembic)

Migrations are hand-written raw SQL via `op.execute(sa.text("..."))` in `backend/alembic/versions/`, not `op.create_table` / `op.add_column`. Autogenerate is not used.

- Create a new revision: `docker compose exec backend alembic revision -m "short description"`, then write `upgrade()` / `downgrade()` by hand.
- Apply migrations: `docker compose exec backend alembic upgrade head` (the backend container also runs this automatically on startup, so a fresh `docker compose up` is always on the latest schema).
- Give every migration a working `downgrade()` that structurally reverses `upgrade()` — don't leave it empty.

## Re-seeding data

Seed data is idempotent, it skips itself if the `users` table isn't empty.

- Re-run the seed script: `docker compose exec backend python -m app.seed`.
- Force a full reset first if you want fresh data: `docker compose exec postgres psql -U habit -d habit_tracker -c "TRUNCATE checkins, habits, users RESTART IDENTITY CASCADE;"`, then re-run the seed command above.
- Or just `docker compose down -v && docker compose up`, which wipes the volume and reseeds automatically.

### ASD-STE100 (Simplified Technical English)

Default to ASD-STE100 for human-readable text.

* Sentences: Keep short with one idea each. Avoid nested clauses.
* Grammar: Use active voice and present tense.
* Vocabulary: Use simple words. Avoid idioms, slang, and filler (*leverage*, *utilize*, *note that*).
* Consistency: Stick to one term per technical concept.

## Frontend conventions
- Use Tailwind and the brand colors/fonts from `frontend/tailwind.config.ts`. Don't hardcode hex values.
- Use shadcn components where possible.
- The main UI is in `frontend/app/page.tsx`.
- Always handle empty, loading, and error states.

## How to work
- Keep changes small and focused. One step at a time.
- Before changing anything non-trivial, tell me which files you'll touch.
- Explain what you changed in plain language after each step.
- Don't add new dependencies without asking.
- Any DB change needs an Alembic migration.