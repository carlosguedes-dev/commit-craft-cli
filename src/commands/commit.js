/**
 * CommitCraft CLI - Interactive Commit Builder Command
 */
const GitUtils = require('../utils/git.js');
const Prompt = require('../utils/prompt.js');
const { colors, symbols, box, badge, Spinner } = require('../utils/ui.js');

const COMMIT_TYPES = [
  { name: 'feat', value: 'feat', badge: '', description: 'A new feature for the user or API' },
  { name: 'fix', value: 'fix', badge: '', description: 'A bug fix for the user or API' },
  { name: 'docs', value: 'docs', badge: '', description: 'Documentation only changes (README, JSDoc)' },
  { name: 'style', value: 'style', badge: '', description: 'Code style, formatting, linting (no logic change)' },
  { name: 'refactor', value: 'refactor', badge: '', description: 'Code restructuring without changing external behavior' },
  { name: 'perf', value: 'perf', badge: '', description: 'A code change that improves performance' },
  { name: 'test', value: 'test', badge: '', description: 'Adding missing tests or correcting existing tests' },
  { name: 'build', value: 'build', badge: '', description: 'Changes affecting build system or external dependencies' },
  { name: 'ci', value: 'ci', badge: '', description: 'Changes to CI/CD configuration files and scripts' },
  { name: 'chore', value: 'chore', badge: '', description: 'Other maintenance tasks, versioning, release chores' },
  { name: 'revert', value: 'revert', badge: '', description: 'Reverts a previous git commit' }
];

async function runCommitCommand() {
  console.log(`\n  ${badge('CommitCraft', 'bgBrightCyan', 'black')} ${colors.bold('Interactive Conventional Commit Wizard')}\n`);

  // 1. Verify Git Repository
  if (!GitUtils.isGitRepo()) {
    console.log(`${symbols.cross} ${colors.red('Error: Current directory is not inside a Git repository.')}`);
    console.log(`  ${colors.dim('Run "git init" to initialize a new repository.')}\n`);
    process.exit(1);
  }

  const currentBranch = GitUtils.getCurrentBranch();
  console.log(`  ${symbols.info} Active Branch: ${colors.brightCyan(colors.bold(currentBranch))}`);

  // 2. Check Staged Changes
  if (!GitUtils.hasStagedChanges()) {
    console.log(`\n  ${symbols.warn} ${colors.yellow('No staged changes detected in staging area!')}`);
    const { unstaged, untracked } = GitUtils.getStatus();
    const allUnstaged = [...new Set([...unstaged, ...untracked])];

    if (allUnstaged.length === 0) {
      console.log(`  ${symbols.cross} ${colors.red('Working directory is completely clean. Nothing to commit!')}\n`);
      return;
    }

    console.log(`  ${colors.dim(`Found ${allUnstaged.length} modified/untracked file(s).`)}`);

    const stageAction = await Prompt.select('How would you like to proceed?', [
      { name: 'Stage ALL changes (git add -A)', value: 'all', description: 'Add all modified and untracked files to staging' },
      { name: 'Select specific files to stage...', value: 'select', description: 'Choose individual files from a checklist' },
      { name: 'Cancel commit', value: 'cancel', description: 'Abort wizard without making changes' }
    ]);

    if (stageAction === 'cancel') {
      console.log(`\n  ${symbols.info} Commit aborted by user.\n`);
      return;
    }

    if (stageAction === 'all') {
      const spinner = new Spinner('Staging all files...').start();
      GitUtils.stageAll();
      spinner.succeed('All modified files staged successfully!');
    } else if (stageAction === 'select') {
      const fileChoices = allUnstaged.map(file => ({
        name: file,
        value: file,
        checked: true,
        description: unstaged.includes(file) ? 'Modified' : 'Untracked'
      }));
      const selectedFiles = await Prompt.multiselect('Select files to stage for commit:', fileChoices);
      if (selectedFiles.length === 0) {
        console.log(`\n  ${symbols.warn} No files selected. Commit aborted.\n`);
        return;
      }
      const spinner = new Spinner(`Staging ${selectedFiles.length} file(s)...`).start();
      GitUtils.stageFiles(selectedFiles);
      spinner.succeed(`Staged ${selectedFiles.length} file(s)!`);
    }
  }

  // 3. Gather Conventional Commit Metadata
  console.log(`\n${colors.dim(symbols.line.repeat(60))}`);
  console.log(`  ${colors.bold('Step 1/6:')} Choose the commit type that best describes your changes`);
  const type = await Prompt.select('Commit Type:', COMMIT_TYPES, 0);

  console.log(`\n  ${colors.bold('Step 2/6:')} Scope of the change (optional, e.g. auth, api, cli, ui)`);
  const scopeInput = await Prompt.input('Scope', { placeholder: 'leave empty if global/not applicable' });
  const scope = scopeInput ? scopeInput.toLowerCase().replace(/[^a-z0-9-_]/g, '') : '';

  console.log(`\n  ${colors.bold('Step 3/6:')} Short summary (imperative mood, e.g. "add user login endpoint")`);
  const description = await Prompt.input('Short Description', {
    required: true,
    validate: (val) => {
      if (val.length < 3) return 'Description is too short (min 3 characters).';
      if (val.length > 72) return `Description is too long (${val.length}/72 characters). Keep it concise!`;
      return true;
    }
  });

  console.log(`\n  ${colors.bold('Step 4/6:')} Detailed explanation of WHY the change was made (optional)`);
  const body = await Prompt.input('Detailed Body', { placeholder: 'leave empty if summary is self-explanatory' });

  console.log(`\n  ${colors.bold('Step 5/6:')} Are there any BREAKING CHANGES in this commit?`);
  const hasBreaking = await Prompt.confirm('Breaking Changes?', false);
  let breakingDesc = '';
  if (hasBreaking) {
    breakingDesc = await Prompt.input('Describe the breaking change & migration instructions', {
      required: true,
      placeholder: 'e.g. auth token parameter changed from string to object'
    });
  }

  console.log(`\n  ${colors.bold('Step 6/6:')} Reference related issue tickets (optional)`);
  const issues = await Prompt.input('Issue References', { placeholder: 'e.g. #123, closes #456, fixes #789' });

  // 4. Build Conventional Commit Message
  let header = type;
  if (scope) header += `(${scope})`;
  if (hasBreaking) header += '!';
  header += `: ${description}`;

  const messageParts = [header];
  if (body) {
    messageParts.push('');
    messageParts.push(body);
  }
  if (hasBreaking) {
    messageParts.push('');
    messageParts.push(`BREAKING CHANGE: ${breakingDesc}`);
  }
  if (issues) {
    messageParts.push('');
    messageParts.push(issues);
  }

  const fullMessage = messageParts.join('\n');

  // 5. Render Preview Box
  const previewContent = [
    `${colors.dim('Branch:')}  ${colors.brightCyan(currentBranch)}`,
    `${colors.dim('Header:')}  ${colors.bold(colors.green(header))}`,
    body ? `${colors.dim('Body:')}    ${body}` : '',
    hasBreaking ? `${colors.red(colors.bold('BREAKING:'))} ${breakingDesc}` : '',
    issues ? `${colors.dim('Issues:')}  ${issues}` : '',
  ].filter(Boolean).join('\n');

  console.log('\n' + box(previewContent, { title: 'Commit Preview', borderColor: 'green', padding: 1 }));

  // 6. Confirm and Execute Commit
  const confirmCommit = await Prompt.confirm('Execute git commit with this message?', true);
  if (!confirmCommit) {
    console.log(`\n  ${symbols.warn} ${colors.yellow('Commit aborted by user. No changes were committed.')}\n`);
    return;
  }

  const spinner = new Spinner('Committing changes...').start();
  try {
    GitUtils.commit(fullMessage);
    spinner.succeed('Commit crafted and executed successfully!');
    console.log(`\n  ${symbols.star} ${colors.brightGreen('Tip:')} Run ${colors.bold('git push')} to publish your changes to remote.\n`);
  } catch (err) {
    spinner.fail(`Commit failed: ${err.message}`);
  }
}

module.exports = {
  runCommitCommand,
  COMMIT_TYPES
};
