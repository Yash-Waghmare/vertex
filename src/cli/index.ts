import { Command } from 'commander';

const program = new Command();

program
  .name('vertex')
  .description('Personal interview prep OS — Notion workspace generator + daily CLI')
  .version('1.0.0');

program
  .command('generate')
  .description('Create the complete Notion workspace')
  .action(() => {
    console.log('generate: not implemented yet');
  });

program
  .command('sync')
  .description('Update the existing workspace to match local schemas')
  .option('--dry-run', 'preview changes without applying them')
  .action((options: { dryRun?: boolean }) => {
    console.log(`sync: not implemented yet${options.dryRun ? ' (dry run)' : ''}`);
  });

program
  .command('today')
  .description('Print the daily briefing')
  .action(() => {
    console.log('today: not implemented yet');
  });

program
  .command('done')
  .description('Mark a task done by name or list number')
  .argument('<task>', 'task name or number from the today list')
  .action((task: string) => {
    console.log(`done: not implemented yet (task: ${task})`);
  });

program.parse();
