import { Command } from 'commander';

const program = new Command();

program
  .name('vertex')
  .description('Personal interview prep OS — Notion workspace generator + daily CLI')
  .version('1.0.0');

program
  .command('generate')
  .description('Create the complete Notion workspace')
  .action(async () => {
    // Imported lazily so `vertex --help` works without a configured .env
    // (the Notion client validates env vars the moment it is imported).
    const { generateWorkspace } = await import('../generator/index');
    await generateWorkspace();
  });

program
  .command('sync')
  .description('Update the existing workspace to match local schemas')
  .option('--dry-run', 'preview changes without applying them')
  .action(async (options: { dryRun?: boolean }) => {
    const { syncWorkspace } = await import('../sync/index');
    await syncWorkspace(options.dryRun ?? false);
  });

program
  .command('today')
  .description('Print the daily briefing')
  .action(async () => {
    const { runToday } = await import('./today');
    await runToday();
  });

program
  .command('done')
  .description('Mark a task done by name or list number')
  .argument('<task>', 'task name or number from the today list')
  .action(async (task: string) => {
    const { runDone } = await import('./done');
    await runDone(task);
  });

program.parse();
