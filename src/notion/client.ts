import 'dotenv/config';
import { Client } from '@notionhq/client';
import { z } from 'zod';

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1, 'NOTION_TOKEN is missing — fill it in .env'),
  NOTION_PARENT_PAGE_ID: z
    .string()
    .min(32, 'NOTION_PARENT_PAGE_ID looks wrong — expected the 32-char ID from the page URL'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.message}`);
  }
  process.exit(1);
}

export const notion = new Client({ auth: parsed.data.NOTION_TOKEN });
export const PARENT_PAGE_ID = parsed.data.NOTION_PARENT_PAGE_ID;
