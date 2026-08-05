import { notion } from '../notion/client';
import { loadState, saveState, type VertexState } from '../notion/state';
import { databases } from '../schemas';
import { createDatabase } from '../generator';
import { toNotionProperty } from '../generator/properties';
import { diffDatabase, type LiveProperties, type SyncAction } from './diff';

export async function syncWorkspace(dryRun: boolean): Promise<void> {
  const state = await loadState();
  const plan: SyncAction[] = [];

  for (const db of databases) {
    const entry = state.databases[db.key];
    if (!entry) {
      plan.push({ kind: 'create-database', db });
      continue;
    }
    const live = await fetchLiveProperties(entry.dataSourceId);
    plan.push(...diffDatabase(db, live));
  }

  if (plan.length === 0) {
    console.log('Workspace is in sync — no changes needed.');
    return;
  }

  console.log(dryRun ? 'Planned changes (dry run — nothing applied):\n' : 'Applying changes:\n');
  for (const action of plan) {
    console.log(`  ${describe(action)}`);
  }

  if (dryRun) return;

  let applied = 0;
  for (const action of plan) {
    if (await apply(action, state)) applied++;
  }
  console.log(`\nDone — applied ${applied} change(s).`);
}

async function fetchLiveProperties(dataSourceId: string): Promise<LiveProperties> {
  const response = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
  if (!('properties' in response)) {
    throw new Error(`Notion returned a partial response for data source ${dataSourceId}`);
  }

  const live: LiveProperties = {};
  for (const [name, prop] of Object.entries(response.properties)) {
    live[name] = {
      type: prop.type,
      selectOptions:
        prop.type === 'select'
          ? prop.select.options.map((o) => ({ id: o.id, name: o.name }))
          : undefined,
    };
  }
  return live;
}

/** Returns true if a change was applied (type mismatches are report-only). */
async function apply(action: SyncAction, state: VertexState): Promise<boolean> {
  switch (action.kind) {
    case 'create-database': {
      const ids = await createDatabase(action.db);
      state.databases[action.db.key] = ids;
      await saveState(state);
      return true;
    }
    case 'add-property': {
      await notion.dataSources.update({
        data_source_id: state.databases[action.db.key].dataSourceId,
        properties: { [action.property]: toNotionProperty(action.def) },
      });
      return true;
    }
    case 'add-select-options': {
      await notion.dataSources.update({
        data_source_id: state.databases[action.db.key].dataSourceId,
        properties: {
          [action.property]: { select: { options: action.mergedOptions } },
        },
      });
      return true;
    }
    case 'type-mismatch':
      return false;
  }
}

function describe(action: SyncAction): string {
  switch (action.kind) {
    case 'create-database':
      return `create database   ${action.db.name}`;
    case 'add-property':
      return `add property      ${action.db.name} → ${action.property} (${action.def.type})`;
    case 'add-select-options':
      return `add options       ${action.db.name} → ${action.property}: ${action.newOptions
        .map((o) => o.name)
        .join(', ')}`;
    case 'type-mismatch':
      return `⚠ type mismatch   ${action.db.name} → ${action.property}: schema says ${action.expected}, Notion has ${action.actual} (manual migration required, skipped)`;
  }
}
