import type { CreateDatabaseParameters } from '@notionhq/client';
import { notion, PARENT_PAGE_ID } from '../notion/client';
import { loadState, saveState } from '../notion/state';
import { databases } from '../schemas';
import type { DatabaseDef } from '../schemas/types';
import { toNotionProperty } from './properties';

export async function generateWorkspace(): Promise<void> {
  const state = await loadState();
  let created = 0;

  for (const db of databases) {
    if (state.databases[db.key]) {
      console.log(`  skip   ${db.name} (already exists)`);
      continue;
    }

    const ids = await createDatabase(db);
    state.databases[db.key] = ids;
    // Save after every creation, not at the end: if a later database fails,
    // the ones already created won't be duplicated on the next run.
    await saveState(state);
    created++;
    console.log(`  create ${db.name}`);
  }

  console.log(
    created === 0
      ? '\nWorkspace already up to date — nothing created.'
      : `\nDone — created ${created} database(s).`
  );
}

async function createDatabase(db: DatabaseDef) {
  const properties = Object.fromEntries(
    Object.entries(db.properties).map(([name, def]) => [name, toNotionProperty(def)])
  );

  const response = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: db.name } }],
    icon: db.icon
      ? ({ type: 'emoji', emoji: db.icon } as CreateDatabaseParameters['icon'])
      : undefined,
    initial_data_source: { properties },
  });

  if (!('data_sources' in response) || response.data_sources.length === 0) {
    throw new Error(`Notion returned an unexpected response creating "${db.name}"`);
  }

  return {
    databaseId: response.id,
    dataSourceId: response.data_sources[0].id,
    name: db.name,
  };
}
