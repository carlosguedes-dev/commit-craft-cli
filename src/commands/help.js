/**
 * CommitCraft CLI - Help & Banner Display
 */
const { getBanner, colors, symbols, box, badge } = require('../utils/ui.js');
const pkg = require('../../package.json');

function displayHelp() {
  console.log(getBanner());

  console.log(`  ${badge('v' + pkg.version, 'bgCyan', 'black')} ${colors.dim('Zero-dependency Git workflow supercharger for modern developers.')}\n`);

  console.log(`  ${colors.bold(colors.brightYellow('USAGE'))}`);
  console.log(`    $ ${colors.cyan('commit-craft')} [command] [options]`);
  console.log(`    $ ${colors.cyan('ccraft')} [command] [options] ${colors.dim('— (convenience alias)')}\n`);

  console.log(`  ${colors.bold(colors.brightYellow('COMMANDS'))}`);
  console.log(`    ${colors.green('commit, c')}       ${colors.bold('(Default)')} Launch interactive Conventional Commit wizard.`);
  console.log(`    ${colors.green('changelog, ch')}   Generate Markdown changelog from commit history.`);
  console.log(`    ${colors.green('cleanup, cl')}     Clean up local branches merged into main/master.`);
  console.log(`    ${colors.green('help, -h')}        Display this help banner and command reference.`);
  console.log(`    ${colors.green('version, -v')}     Display CommitCraft CLI version number.\n`);

  console.log(`  ${colors.bold(colors.brightYellow('CHANGELOG OPTIONS'))}`);
  console.log(`    ${colors.dim('--from <tag>')}     Start commit reference (default: previous release tag)`);
  console.log(`    ${colors.dim('--to <tag>')}       End commit reference (default: HEAD)`);
  console.log(`    ${colors.dim('--write, -w')}      Automatically append/prepend to CHANGELOG.md`);
  console.log(`    ${colors.dim('--output <file>')}  Specify custom output changelog file path\n`);

  console.log(`  ${colors.bold(colors.brightYellow('CLEANUP OPTIONS'))}`);
  console.log(`    ${colors.dim('--base <branch>')}  Base branch to check merges against (default: main/master)`);
  console.log(`    ${colors.dim('--force, -f')}      Force delete unmerged or stubborn branches (-D flag)\n`);

  console.log(`  ${colors.bold(colors.brightYellow('EXAMPLES'))}`);
  console.log(`    ${colors.dim('# Start interactive commit wizard')}`);
  console.log(`    $ ccraft commit`);
  console.log(``);
  console.log(`    ${colors.dim('# Generate changelog for recent commits and save to CHANGELOG.md')}`);
  console.log(`    $ ccraft changelog --write`);
  console.log(``);
  console.log(`    ${colors.dim('# Interactive branch cleanup against main')}`);
  console.log(`    $ ccraft cleanup --base main\n`);

  console.log(`  ${symbols.star} ${colors.dim('Star us on GitHub:')} ${colors.underline('https://github.com/carlo/commit-craft-cli')}\n`);
}

module.exports = {
  displayHelp
};
