# Vertex

Personal interview prep OS — generates a Notion workspace from code and runs your day from the terminal.

Notion holds the data. Vertex is the layer on top: schema-driven databases, additive sync, and a daily CLI (`today` / `done`). No web UI.

> Built for one workflow (not a product). Full vision and scope: [`PROJECT.md`](./PROJECT.md).

## Prerequisites

- Node.js 20+
- A [Notion integration](https://www.notion.so/my-integrations) with access to a parent page

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Internal integration secret |
| `NOTION_PARENT_PAGE_ID` | 32-char ID of the page that will own the workspace (share the page with the integration via **Connections**) |

Edit `config.json` for personal settings:

| Field | Description |
|-------|-------------|
| `name` | Greeting name in `today` |
| `timezone` | IANA timezone (e.g. `Asia/Kolkata`) for “today” and streak |
| `startDate` | Prep day 1 (`YYYY-MM-DD`) |
| `totalDays` | Length of the prep cycle (default 60) |

## Quick start

```bash
# 1. Create the six Notion databases under your parent page
npm run generate

# 2. Add today's tasks in Notion (Daily Tracker — set Date to today)

# 3. Print the daily briefing
npm run today

# 4. Mark work done (by list number or name)
npm run done -- 1
npm run done -- "Graph Problems"
```

When you change local schemas later:

```bash
npm run sync:dry   # preview
npm run sync       # apply (additive only)
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run generate` | Create Notion databases from local schemas (skips ones already in `.vertex/state.json`) |
| `npm run sync` | Add missing databases, properties, and select options |
| `npm run sync:dry` | Preview sync changes without applying |
| `npm run today` | Print daily briefing (day count, streak, focus, estimated time) |
| `npm run done -- <task>` | Mark a task done by name or list number |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint on `src/` |
| `npm run format` | Prettier write |

### Sync safety

- **Additive only** — creates missing databases/properties/options; never deletes rows or properties
- **Type mismatches** — reported and skipped (manual migration in Notion)
- **Idempotent** — a second sync with no schema changes is a no-op
- **State** — workspace IDs live in `.vertex/state.json`

## Workspace databases

Schemas in `src/schemas/` define six Notion databases:

- Daily Tracker — source of truth for `today` / `done`
- DSA Tracker
- React Revision
- System Design
- Weekly Goals
- Job Applications

## Project layout

```
src/
  cli/         # Commander entry + today / done handlers
  generator/   # Workspace creation from schemas
  sync/        # Schema diff + additive apply
  notion/      # Client, state, Daily Tracker queries
  schemas/     # Zod database definitions
  progress/    # Day numbers and streak
  render/      # Markdown templates for the today view
  config.ts    # Loads and validates config.json
config.json    # Personal prep settings
.vertex/       # Local workspace state (generate / sync)
```

## Tech stack

TypeScript · Commander · Zod · Notion SDK · dotenv · tsx · ESLint · Prettier

## Status

Working end-to-end for v1 core paths: `generate`, additive `sync` (with dry-run), `today`, and `done` (with streak). Still out of scope for later: readiness scores, seed data, property renames, and templates — see [`PROJECT.md`](./PROJECT.md).
