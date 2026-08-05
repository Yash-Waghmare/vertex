import { promises as fs } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const stateSchema = z.object({
  databases: z.record(
    z.string(),
    z.object({
      databaseId: z.string(),
      dataSourceId: z.string(),
      name: z.string(),
    })
  ),
});

export type VertexState = z.infer<typeof stateSchema>;

const STATE_DIR = '.vertex';
const STATE_PATH = path.join(STATE_DIR, 'state.json');

export async function loadState(): Promise<VertexState> {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8');
    return stateSchema.parse(JSON.parse(raw));
  } catch (err) {
    // First run: no state file yet.
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { databases: {} };
    }
    throw err;
  }
}

export async function saveState(state: VertexState): Promise<void> {
  await fs.mkdir(STATE_DIR, { recursive: true });
  await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
}
