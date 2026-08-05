import { promises as fs } from 'node:fs';
import { z } from 'zod';

const configSchema = z.object({
  name: z.string().min(1),
  timezone: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD'),
  totalDays: z.number().int().positive().default(60),
});

export type VertexConfig = z.infer<typeof configSchema>;

export async function loadConfig(): Promise<VertexConfig> {
  const raw = await fs.readFile('config.json', 'utf8');
  return configSchema.parse(JSON.parse(raw));
}
