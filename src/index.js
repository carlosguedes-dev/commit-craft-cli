/**
 * CommitCraft CLI - Core Router & Entry Point
 */
const { runCommitCommand } = require('./commands/commit.js');
const { runChangelogCommand } = require('./commands/changelog.js');
const { runCleanupCommand } = require('./commands/cleanup.js');
const { displayHelp } = require('./commands/help.js');
const { colors, symbols } = require('./utils/ui.js');
const pkg = require('../package.json');

/**
 * Parse CLI arguments into positional command and key-value flags.
 */
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = argv[i + 1];
      if (nextArg && !nextArg.startsWith('-')) {
        args[key] = nextArg;
        i++;
      } else {
        args[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      args[key] = true;
    } else {
      args._.push(arg);
    }
  }
  return args;
}

async function runCLI(argv) {
  const args = parseArgs(argv);
  const command = args._[0] || 'commit'; // Default command is commit!

  if (args.version || args.v || command === 'version') {
    console.log(`CommitCraft CLI v${pkg.version}`);
    return;
  }

  if (args.help || args.h || command === 'help') {
    displayHelp();
    return;
  }

  switch (command.toLowerCase()) {
    case 'commit':
    case 'c':
      await runCommitCommand(args);
      break;

    case 'changelog':
    case 'log':
    case 'ch':
      await runChangelogCommand(args);
      break;

    case 'cleanup':
    case 'clean':
    case 'cl':
      await runCleanupCommand(args);
      break;

    default:
      console.log(`\n  ${symbols.cross} ${colors.red(`Unknown command:`)} ${colors.bold(command)}`);
      console.log(`  ${symbols.info} Run ${colors.bold('commit-craft --help')} to see available commands and usage.\n`);
      process.exit(1);
  }
}

module.exports = {
  runCLI,
  parseArgs
};
