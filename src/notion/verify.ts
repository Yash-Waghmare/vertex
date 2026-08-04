import { notion, PARENT_PAGE_ID } from './client';

// Check 1: is the token valid?
const me = await notion.users.me({});
console.log(`Token OK — connected as integration "${me.name}"`);

// Check 2: is the parent page shared with the integration?
const page = await notion.pages.retrieve({ page_id: PARENT_PAGE_ID });

let title = '(untitled)';
if ('properties' in page) {
  const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
  if (titleProp && titleProp.type === 'title' && titleProp.title.length > 0) {
    title = titleProp.title.map((t) => t.plain_text).join('');
  }
}
console.log(`Parent page OK — "${title}" (${page.id})`);
