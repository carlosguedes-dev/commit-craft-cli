/**
 * CommitCraft CLI - Changelog Generator Command
 */
const fs = require('fs');
const path = require('path');
const GitUtils = require('../utils/git.js');
const Prompt = require('../utils/prompt.js');
const { colors, symbols, box, badge, Spinner } = require('../utils/ui.js');

const TYPE_GROUPS = [
  { title: '💥 Breaking Changes', types: ['breaking'], color: 'red' },
  { title: '🚀 Features', types: ['feat'], color: 'green' },
  { title: '🐛 Bug Fixes', types: ['fix'], color: 'yellow' },
  { title: '⚡ Performance Improvements', types: ['perf'], color: 'cyan' },
  { title: '♻️ Code Refactoring', types: ['refactor'], color: 'magenta' },
  { title: '📚 Documentation', types: ['docs'], color: 'blue' },
  { title: '🧪 Tests & Quality', types: ['test'], color: 'brightCyan' },
  { title: '🛠️ Build & CI/CD', types: ['build', 'ci'], color: 'brightYellow' },
  { title: '🧹 Chores & Maintenance', types: ['chore', 'style', 'revert', 'other'], color: 'dim' }
];

async function runChangelogCommand(args = {}) {
  console.log(`\n  ${badge('CommitCraft', 'bgBrightGreen', 'black')} ${colors.bold('Automated Conventional Changelog Generator')}\n`);

  if (!GitUtils.isGitRepo()) {
    console.log(`${symbols.cross} ${colors.red('Error: Current directory is not inside a Git repository.')}`);
    process.exit(1);
  }

  const tags = GitUtils.getTags();
  const latestTag = GitUtils.getLatestTag();
  let fromRef = args.from || null;
  let toRef = args.to || 'HEAD';
  let titleVersion = args.version || (latestTag ? `Unreleased (${latestTag} -> HEAD)` : 'Initial Release (All History)');

  // If no flags provided, ask user interactively for range
  if (!args.from && !args.to && !args.all && process.stdin.isTTY) {
    const rangeChoices = [];
    if (latestTag) {
      rangeChoices.push({
        name: `Unreleased changes since ${latestTag}`,
        value: { from: latestTag, to: 'HEAD', title: `[Unreleased] - ${new Date().toISOString().slice(0, 10)}` },
        description: `Commits from ${latestTag} up to current HEAD`
      });
    }
    if (tags.length >= 2) {
      rangeChoices.push({
        name: `Between two specific tags... (${tags[1]} -> ${tags[0]})`,
        value: 'select_tags',
        description: 'Choose start and end tags from repository history'
      });
    }
    rangeChoices.push({
      name: 'Entire repository history (All commits)',
      value: { from: null, to: 'HEAD', title: `Full History - ${new Date().toISOString().slice(0, 10)}` },
      description: 'Generate changelog from the very first commit'
    });

    const selectedRange = await Prompt.select('Select commit range for changelog generation:', rangeChoices);
    
    if (selectedRange === 'select_tags') {
      const tagChoices = tags.map(t => ({ name: t, value: t }));
      fromRef = await Prompt.select('Select starting (older) tag:', tagChoices, Math.min(1, tagChoices.length - 1));
      toRef = await Prompt.select('Select ending (newer) tag:', tagChoices, 0);
      titleVersion = `[${toRef}] - ${new Date().toISOString().slice(0, 10)}`;
    } else {
      fromRef = selectedRange.from;
      toRef = selectedRange.to;
      titleVersion = selectedRange.title;
    }
  }

  const spinner = new Spinner('Scanning git commit history...').start();
  const commits = GitUtils.getCommits(fromRef, toRef);
  
  if (commits.length === 0) {
    spinner.warn(`No commits found in range ${fromRef || 'Start'}..${toRef}`);
    return;
  }
  spinner.succeed(`Analyzed ${commits.length} commit(s) in range ${colors.bold(fromRef || 'Initial')}..${colors.bold(toRef)}!`);

  // Group Commits
  const grouped = {};
  TYPE_GROUPS.forEach(g => { grouped[g.title] = []; });

  commits.forEach(commit => {
    if (commit.isBreaking) {
      grouped['💥 Breaking Changes'].push(commit);
    }
    const targetGroup = TYPE_GROUPS.find(g => g.types.includes(commit.type)) || TYPE_GROUPS[TYPE_GROUPS.length - 1];
    // Don't duplicate in feature/fix if already in breaking, or do include for completeness
    if (!commit.isBreaking || targetGroup.title !== '💥 Breaking Changes') {
      grouped[targetGroup.title].push(commit);
    }
  });

  // Build Markdown Output
  const mdLines = [`## ${titleVersion}`, ''];
  const terminalLines = [`  ${colors.bold(colors.brightWhite(`## ${titleVersion}`))}\n`];

  let hasEntries = false;
  TYPE_GROUPS.forEach(group => {
    const list = grouped[group.title];
    if (list && list.length > 0) {
      hasEntries = true;
      mdLines.push(`### ${group.title}`, '');
      const groupColorFn = colors[group.color] || colors.white;
      terminalLines.push(`  ${groupColorFn(colors.bold(group.title))}`);

      list.forEach(c => {
        const scopeStr = c.scope ? `**${c.scope}**: ` : '';
        const issuesStr = c.issues.length > 0 ? ` (${c.issues.join(', ')})` : '';
        const authorStr = c.author ? ` — *@${c.author}*` : '';
        
        mdLines.push(`- ${scopeStr}${c.description} ([${c.hash}](../../commit/${c.fullHash}))${issuesStr}${authorStr}`);

        const termScope = c.scope ? colors.cyan(`[${c.scope}] `) : '';
        const termIssues = c.issues.length > 0 ? colors.yellow(` (${c.issues.join(', ')})`) : '';
        const termHash = colors.dim(`(${c.hash})`);
        terminalLines.push(`    ${symbols.bullet} ${termScope}${c.description} ${termHash}${termIssues}`);
      });
      mdLines.push('');
      terminalLines.push('');
    }
  });

  if (!hasEntries) {
    console.log(`\n  ${symbols.info} No Conventional Commits found in this range.\n`);
    return;
  }

  // Display Terminal Preview
  console.log('\n' + box(terminalLines.join('\n'), { title: 'Changelog Preview', borderColor: 'green', padding: 1 }));

  const mdContent = mdLines.join('\n') + '\n';

  // Check if user wants to write to CHANGELOG.md
  const defaultWrite = args.write || args.output ? true : await Prompt.confirm('Write / Prepend this release to CHANGELOG.md?', true);

  if (defaultWrite) {
    const filePath = path.resolve(process.cwd(), args.output || 'CHANGELOG.md');
    let existingContent = '';
    let newFileContent = '';

    const headerTitle = '# Changelog\n\nAll notable changes to this project will be documented in this file.\nThe format is based on [Keep a Changelog](https://keepachangelog.com/) and adheres to [Conventional Commits](https://www.conventionalcommits.org/).\n\n---\n\n';

    if (fs.existsSync(filePath)) {
      existingContent = fs.readFileSync(filePath, 'utf8');
      // If file already has # Changelog header, insert right below the first horizontal rule or header
      if (existingContent.includes('---')) {
        const parts = existingContent.split('---');
        newFileContent = `${parts[0]}---\n\n${mdContent}${parts.slice(1).join('---')}`;
      } else if (existingContent.startsWith('# ')) {
        const firstLineEnd = existingContent.indexOf('\n');
        newFileContent = `${existingContent.slice(0, firstLineEnd + 1)}\n${mdContent}\n${existingContent.slice(firstLineEnd + 1)}`;
      } else {
        newFileContent = `${headerTitle}${mdContent}\n${existingContent}`;
      }
    } else {
      newFileContent = `${headerTitle}${mdContent}`;
    }

    fs.writeFileSync(filePath, newFileContent, 'utf8');
    console.log(`\n  ${symbols.tick} ${colors.green('Successfully updated')} ${colors.bold(path.basename(filePath))} ${colors.green('in project root!')}\n`);
  } else {
    console.log(`\n  ${symbols.info} Changelog generated in terminal only (not saved to disk).\n`);
  }
}

module.exports = {
  runChangelogCommand
};
