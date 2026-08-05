---
name: vertex-schema
description: Safely add or change Notion database schemas in Vertex (databases, properties, select options). Use when editing files in src/schemas/, adding a tracker database, adding a property or select option, or when the user mentions schema changes, sync, or the Notion workspace structure.
---

# Vertex Schema Changes

Schemas in `src/schemas/` are the single source of truth: the generator, sync engine, and CLI all read them. Never change the Notion workspace structure by hand or with ad-hoc API calls — edit the schema and let sync apply it.

## Workflow

1. Edit the schema file (one file per database; register new databases in `src/schemas/index.ts`).
2. Preview: `npm run sync:dry` — review the planned actions.
3. Apply: `npm run sync`.
4. Verify idempotency: run `npm run sync` again; it must report "in sync".

**Never** run `npm run sync -- --dry-run`: npm consumes `--dry-run` as its own global flag (even after `--`) and the sync applies for real. Always use `npm run sync:dry`.

## Schema rules

- Property definitions must satisfy the Zod meta-schema in `src/schemas/types.ts` (validated at import time). Exactly one `title` property per database.
- Supported property types: `title`, `rich_text`, `number`, `date`, `url`, `select`, `status`.
- `select` requires `options` with names (and optional Notion colors). `status` takes no options — see limitations.
- Database `key` is the stable identifier used in `.vertex/state.json`; never change an existing key (sync would create a duplicate database).

## What sync can and cannot do

Sync is additive-only:

- CAN: create missing databases, add missing properties, add missing select options.
- CANNOT: delete anything, rename properties, change a property's type (reported as a warning; requires manual migration in Notion), remove or rename select options.

## Notion API limitations to remember

- `status` property options cannot be customized via the API — a created status property always gets Notion defaults (Not started / In progress / Done). Use `select` for custom progressions (e.g. Todo / Solved / Revisit).
- Databases are containers around data sources: properties and row queries use the `dataSourceId`, database-level changes (title, icon) use the `databaseId`. Both are stored per database in `.vertex/state.json`.
- When updating select options, existing options must be included by `id` in the options array or Notion drops them. `src/sync/diff.ts` already handles this — reuse it rather than calling `dataSources.update` directly.

## Conventions

- Duration-style selects store bare minutes as option names (`15`, `30`, `60`) so the CLI can parse them numerically.
- The `Day` number property in Daily Tracker is derived (Date − config.startDate + 1) and backfilled by the CLI; `Date` is the source of truth.
- The `Category` select options (DSA / React / System Design / Applications / Other) are duplicated in Daily Tracker and Weekly Goals — keep them in sync manually if edited.
