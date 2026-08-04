# Vertex

Personal interview prep OS — generates a Notion workspace from code and runs your day from the terminal.

Notion holds the data. Vertex is the layer on top: schema-driven databases, sync, and a daily CLI (`today` / `done`). No web UI.

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

Personal settings live in `config.json` (name, timezone, prep start date, total days).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run generate` | Create the full Notion workspace from local schemas |
| `npm run sync` | Update an existing workspace to match schemas (additive) |
| `npm run sync -- --dry-run` | Preview sync changes without applying |
| `npm run today` | Print the daily briefing (markdown in the terminal) |
| `npm run done -- <task>` | Mark a task done by name or list number |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint on `src/` |
| `npm run format` | Prettier write |

## Workspace databases

Schemas in `src/schemas/` define six Notion databases:

- Daily Tracker
- DSA Tracker
- React Revision
- System Design
- Weekly Goals
- Job Applications

## Project layout

```
src/
  cli/        # Commander entry — generate, sync, today, done
  notion/     # Notion client + env validation
  schemas/    # Zod database definitions
config.json   # Personal prep settings
.vertex/      # Local workspace state (created by generate/sync)
```

## Tech stack

TypeScript · Commander · Zod · Notion SDK · dotenv · tsx · ESLint · Prettier

## Status

Phase 1 (foundation) is in progress: CLI stubs, Notion client, and Zod schemas for all six databases. Generator, daily OS, and sync are next — see the development order in [`PROJECT.md`](./PROJECT.md).
