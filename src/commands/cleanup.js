/**
 * CommitCraft CLI - Branch Cleaner Command
 */
const GitUtils = require('../utils/git.js');
const Prompt = require('../utils/prompt.js');
const { colors, symbols, box, badge, Spinner } = require('../utils/ui.js');

async function runCleanupCommand(args = {}) {
  console.log(`\n  ${badge('CommitCraft', 'bgBrightYellow', 'black')} ${colors.bold('Interactive Merged Branch Cleanup')}\n`);

  if (!GitUtils.isGitRepo()) {
    console.log(`${symbols.cross} ${colors.red('Error: Current directory is not inside a Git repository.')}`);
    process.exit(1);
  }

  const spinner = new Spinner('Scanning local repository branches...').start();
  const baseBranch = args.base || GitUtils.getBaseBranch();
  const { base, branches } = GitUtils.getMergedBranches(baseBranch);

  if (branches.length === 0) {
    spinner.succeed(`Workspace is pristine! No local branches merged into ${colors.bold(colors.cyan(base))} were found.`);
    console.log(`\n  ${symbols.star} ${colors.dim('All clean. Keep up the great workflow!')}\n`);
    return;
  }

  spinner.stop('tick', `Found ${colors.bold(colors.yellow(branches.length))} local branch(es) already merged into ${colors.bold(colors.cyan(base))}.\n`);

  const branchChoices = branches.map(b => ({
    name: b,
    value: b,
    checked: true,
    description: `Merged into ${base}`
  }));

  const selectedToDelete = await Prompt.multiselect(
    `Select branches to delete (Space to toggle, 'a' to toggle all):`,
    branchChoices
  );

  if (!selectedToDelete || selectedToDelete.length === 0) {
    console.log(`\n  ${symbols.info} No branches selected for deletion. Operation cancelled.\n`);
    return;
  }

  console.log('\n  ' + colors.bold(`You are about to delete ${selectedToDelete.length} local branch(es):`));
  selectedToDelete.forEach(b => {
    console.log(`    ${symbols.cross} ${colors.red(b)}`);
  });
  console.log('');

  const confirmDelete = await Prompt.confirm(`Permanently delete ${selectedToDelete.length} selected branch(es)?`, true);
  if (!confirmDelete) {
    console.log(`\n  ${symbols.warn} Branch cleanup aborted by user.\n`);
    return;
  }

  const delSpinner = new Spinner(`Deleting ${selectedToDelete.length} branch(es)...`).start();
  let deletedCount = 0;
  let failedCount = 0;
  const failedBranches = [];

  for (const branch of selectedToDelete) {
    try {
      GitUtils.deleteBranch(branch, args.force);
      deletedCount++;
    } catch (err) {
      failedCount++;
      failedBranches.push({ branch, error: err.message });
    }
  }

  if (failedCount === 0) {
    delSpinner.succeed(`Successfully deleted ${deletedCount} merged branch(es)! Workspace is clean.`);
  } else {
    delSpinner.warn(`Deleted ${deletedCount} branch(es), but ${failedCount} failed.`);
    failedBranches.forEach(({ branch, error }) => {
      console.log(`    ${symbols.cross} Could not delete ${colors.bold(branch)}: ${colors.dim(error)}`);
    });
  }

  console.log(`\n  ${symbols.star} ${colors.brightGreen('Tip:')} Run ${colors.bold('git remote prune origin')} to clean up deleted remote tracking branches too.\n`);
}

module.exports = {
  runCleanupCommand
};
