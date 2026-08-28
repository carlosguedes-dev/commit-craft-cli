/**
 * Zero-dependency UI Components and ASCII Art for CommitCraft CLI.
 */
const colors = require('./colors.js');

const symbols = {
  tick: colors.green(''),
  cross: colors.red(''),
  info: colors.cyan(''),
  warn: colors.yellow(''),
  star: colors.brightYellow('★'),
  arrow: colors.cyan('➜'),
  dot: colors.dim('•'),
  bullet: '▸',
  pointer: colors.brightCyan('❯'),
  checkboxOn: colors.green('◉'),
  checkboxOff: colors.dim('◯'),
  line: '─',
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  vertical: '│',
};

const getBanner = () => {
  const ascii = `
   ____________  __  _____  ___________  ____________  ___ ______
  / ____/ __ \\ \\/ / / /  |/  /  _/  _/ |/ / ____/ __ \\/   | / ____/
 / /   / / / /\\  / / / /|_/ // / / // |  / /   / /_/ / /| |/ /_    
/ /___/ /_/ / / / / / /  / // /_/ // /| / /___/ _, _/ ___ / __/    
\\____/\\____/ /_/ /_/_/  /_/___/___/_/ |_\\____/_/ |_/_/  |_/_/      
`;
  return colors.gradient(ascii, '#00C9FF', '#92FE9D') + 
         '\n  ' + colors.bold(colors.brightWhite('★ CommitCraft CLI ★')) + 
         colors.dim(' — Interactive Git Workflow Supercharger\n');
};

/**
 * Wraps text inside a styled Unicode border box.
 */
const box = (content, { title = '', borderColor = 'cyan', padding = 1 } = {}) => {
  const lines = content.split('\n');
  const termWidth = process.stdout.columns || 80;
  
  const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');
  let maxLen = Math.max(...lines.map(l => stripAnsi(l).length));
  if (title) {
    maxLen = Math.max(maxLen, stripAnsi(title).length + 4);
  }
  
  const width = Math.min(maxLen + (padding * 2), termWidth - 4);
  const colorFn = colors[borderColor] || colors.cyan;
  
  const topBar = symbols.topLeft + symbols.line.repeat(width + 2) + symbols.topRight;
  let top = colorFn(topBar);
  
  if (title) {
    const titleFormatted = ` ${colors.bold(title)} `;
    const leftLen = 2;
    const rightLen = width + 2 - leftLen - stripAnsi(titleFormatted).length;
    top = colorFn(symbols.topLeft + symbols.line.repeat(leftLen)) + 
          titleFormatted + 
          colorFn(symbols.line.repeat(Math.max(0, rightLen)) + symbols.topRight);
  }
  
  const bottom = colorFn(symbols.bottomLeft + symbols.line.repeat(width + 2) + symbols.bottomRight);
  const padLine = colorFn(symbols.vertical) + ' '.repeat(width + 2) + colorFn(symbols.vertical);
  
  const formattedLines = lines.map(line => {
    const cleanLen = stripAnsi(line).length;
    const rightPad = Math.max(0, width - cleanLen - padding);
    return colorFn(symbols.vertical) + 
           ' '.repeat(padding) + 
           line + 
           ' '.repeat(rightPad + padding) + 
           colorFn(symbols.vertical);
  });

  const result = [];
  result.push(top);
  for (let i = 0; i < padding; i++) result.push(padLine);
  result.push(...formattedLines);
  for (let i = 0; i < padding; i++) result.push(padLine);
  result.push(bottom);

  return result.join('\n');
};

/**
 * Creates a visual badge.
 */
const badge = (label, bg = 'bgCyan', fg = 'black') => {
  const bgFn = colors[bg] || colors.bgCyan;
  const fgFn = colors[fg] || colors.black;
  return bgFn(fgFn(colors.bold(` ${label.toUpperCase()} `)));
};

/**
 * Simple spinner for long-running synchronous or asynchronous tasks.
 */
class Spinner {
  constructor(text = 'Loading...') {
    this.text = text;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.frameIdx = 0;
    this.interval = null;
  }

  start(text) {
    if (text) this.text = text;
    if (!colors.isTTY) {
      process.stdout.write(`${symbols.info} ${this.text}...\n`);
      return this;
    }
    process.stdout.write('\x1b[?25l'); // Hide cursor
    this.interval = setInterval(() => {
      const frame = colors.cyan(this.frames[this.frameIdx]);
      process.stdout.write(`\r${frame} ${this.text}`);
      this.frameIdx = (this.frameIdx + 1) % this.frames.length;
    }, 80);
    return this;
  }

  stop(status = 'tick', finalMessage = '') {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (colors.isTTY) {
      process.stdout.write('\r\x1b[K\x1b[?25h'); // Clear line and show cursor
    }
    if (finalMessage) {
      const sym = symbols[status] || symbols.tick;
      console.log(`${sym} ${finalMessage}`);
    }
    return this;
  }

  succeed(message) {
    return this.stop('tick', colors.green(message || this.text));
  }

  fail(message) {
    return this.stop('cross', colors.red(message || 'Failed!'));
  }

  warn(message) {
    return this.stop('warn', colors.yellow(message || 'Warning'));
  }
}

module.exports = {
  symbols,
  getBanner,
  box,
  badge,
  Spinner,
  colors
};
