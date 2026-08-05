import { iteratePaginatedAPI } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client';
import { notion } from './client';
import { loadState } from './state';

export interface DailyTask {
  pageId: string;
  name: string;
  date: string | null;
  day: number | null;
  durationMinutes: number | null;
  status: string | null;
  category: string | null;
}

export async function getDailyTrackerDataSourceId(): Promise<string> {
  const state = await loadState();
  const entry = state.databases['daily-tracker'];
  if (!entry) {
    throw new Error('Daily Tracker not found in .vertex/state.json — run `npm run generate` first.');
  }
  return entry.dataSourceId;
}

export async function fetchAllDailyTasks(): Promise<DailyTask[]> {
  const dataSourceId = await getDailyTrackerDataSourceId();
  const tasks: DailyTask[] = [];

  for await (const page of iteratePaginatedAPI(notion.dataSources.query, {
    data_source_id: dataSourceId,
  })) {
    if (page.object === 'page' && 'properties' in page) {
      tasks.push(toTask(page));
    }
  }
  return tasks;
}

/** Backfill the derived Day property (Date is the source of truth). */
export async function updateTaskDay(pageId: string, day: number): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: { Day: { number: day } },
  });
}

function toTask(page: PageObjectResponse): DailyTask {
  const props = page.properties;

  const titleProp = props['Task'];
  const dateProp = props['Date'];
  const dayProp = props['Day'];
  const durationProp = props['Duration'];
  const statusProp = props['Status'];
  const categoryProp = props['Category'];

  const durationName =
    durationProp?.type === 'select' ? (durationProp.select?.name ?? null) : null;
  const durationMinutes = durationName === null ? null : Number.parseInt(durationName, 10);

  return {
    pageId: page.id,
    name:
      titleProp?.type === 'title'
        ? titleProp.title.map((t) => t.plain_text).join('') || '(untitled)'
        : '(untitled)',
    date: dateProp?.type === 'date' ? (dateProp.date?.start.slice(0, 10) ?? null) : null,
    day: dayProp?.type === 'number' ? dayProp.number : null,
    durationMinutes: Number.isNaN(durationMinutes) ? null : durationMinutes,
    status: statusProp?.type === 'status' ? (statusProp.status?.name ?? null) : null,
    category: categoryProp?.type === 'select' ? (categoryProp.select?.name ?? null) : null,
  };
}
