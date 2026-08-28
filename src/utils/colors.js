/**
 * Zero-dependency ANSI Color & Styling Utility for CommitCraft CLI.
 * Supports NO_COLOR environment variable and checks TTY.
 */

const isTTY = process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== 'dumb';

const format = (open, close, text) => {
  if (!isTTY) return text;
  return `\x1b[${open}m${text}\x1b[${close}m`;
};

const colors = {
  reset: (text) => format(0, 0, text),
  bold: (text) => format(1, 22, text),
  dim: (text) => format(2, 22, text),
  italic: (text) => format(3, 23, text),
  underline: (text) => format(4, 24, text),
  inverse: (text) => format(7, 27, text),

  // Standard Foreground Colors
  black: (text) => format(30, 39, text),
  red: (text) => format(31, 39, text),
  green: (text) => format(32, 39, text),
  yellow: (text) => format(33, 39, text),
  blue: (text) => format(34, 39, text),
  magenta: (text) => format(35, 39, text),
  cyan: (text) => format(36, 39, text),
  white: (text) => format(37, 39, text),
  gray: (text) => format(90, 39, text),

  // Bright Foreground Colors
  brightRed: (text) => format(91, 39, text),
  brightGreen: (text) => format(92, 39, text),
  brightYellow: (text) => format(93, 39, text),
  brightBlue: (text) => format(94, 39, text),
  brightMagenta: (text) => format(95, 39, text),
  brightCyan: (text) => format(96, 39, text),
  brightWhite: (text) => format(97, 39, text),

  bgBlack: (text) => format(40, 49, text),
  bgRed: (text) => format(41, 49, text),
  bgGreen: (text) => format(42, 49, text),
  bgYellow: (text) => format(43, 49, text),
  bgBlue: (text) => format(44, 49, text),
  bgMagenta: (text) => format(45, 49, text),
  bgCyan: (text) => format(46, 49, text),
  bgWhite: (text) => format(47, 49, text),

  hex: (hexCode) => (text) => {
    if (!isTTY) return text;
    let hex = hexCode.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m`;
  },

  bgHex: (hexCode) => (text) => {
    if (!isTTY) return text;
    let hex = hexCode.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `\x1b[48;2;${r};${g};${b}m${text}\x1b[49m`;
  },

  // Gradient effect for banners and titles
  gradient: (text, startHex = '#00F2FE', endHex = '#4FACFE') => {
    if (!isTTY) return text;
    const chars = text.split('');
    const len = chars.length;
    
    const sR = parseInt(startHex.slice(1, 3), 16);
    const sG = parseInt(startHex.slice(3, 5), 16);
    const sB = parseInt(startHex.slice(5, 7), 16);
    
    const eR = parseInt(endHex.slice(1, 3), 16);
    const eG = parseInt(endHex.slice(3, 5), 16);
    const eB = parseInt(endHex.slice(5, 7), 16);

    return chars.map((char, idx) => {
      if (char === ' ' || char === '\n') return char;
      const ratio = len > 1 ? idx / (len - 1) : 0;
      const r = Math.round(sR + (eR - sR) * ratio);
      const g = Math.round(sG + (eG - sG) * ratio);
      const b = Math.round(sB + (eB - sB) * ratio);
      return `\x1b[38;2;${r};${g};${b}m${char}\x1b[39m`;
    }).join('');
  },

  isTTY
};

module.exports = colors;
