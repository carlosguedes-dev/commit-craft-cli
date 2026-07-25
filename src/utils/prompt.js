/**
 * Zero-dependency Interactive Prompt Engine for CommitCraft CLI.
 * Uses native Node.js readline and process.stdin in raw mode for arrow-key navigation.
 */
const readline = require('readline');
const { colors, symbols } = require('./ui.js');

class Prompt {
  /**
   * Helper to clean up raw stdin listeners and restore terminal state.
   */
  static cleanup(rl) {
    if (rl) rl.close();
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.resume();
    }
  }

  /**
   * Single-selection interactive list prompt with arrow keys.
   * @param {string} message - Question to ask the user
   * @param {Array<{name: string, value: any, description?: string, badge?: string}>} choices - Options to choose from
   * @param {number} defaultIndex - Default selected index
   * @returns {Promise<any>} Selected value
   */
  static async select(message, choices, defaultIndex = 0) {
    if (!process.stdin.isTTY) {
      // Fallback for non-TTY environments
      console.log(`${symbols.pointer} ${message} (Default: ${choices[defaultIndex].name})`);
      return choices[defaultIndex].value;
    }

    return new Promise((resolve) => {
      let selected = defaultIndex;
      const total = choices.length;
      let firstRender = true;

      const render = () => {
        if (!firstRender) {
          // Clear previous render lines (total choices + 1 line for prompt + optional description line)
          const linesToClear = total + 2;
          for (let i = 0; i < linesToClear; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
          }
        }
        firstRender = false;

        process.stdout.write(`${symbols.pointer} ${colors.bold(message)}\n`);
        choices.forEach((choice, idx) => {
          const isSelected = idx === selected;
          const cursor = isSelected ? colors.brightCyan('❯') : ' ';
          const badgeStr = choice.badge ? ` ${choice.badge}` : '';
          const nameStr = isSelected ? colors.brightCyan(colors.bold(choice.name)) : choice.name;
          const descStr = choice.description ? colors.dim(` - ${choice.description}`) : '';
          
          process.stdout.write(`  ${cursor} ${nameStr}${badgeStr}${descStr}\n`);
        });
        
        const currentDesc = choices[selected].description || 'Press ↑/↓ to navigate, Enter to select.';
        process.stdout.write(`  ${colors.dim('ℹ ' + currentDesc)}\n`);
      };

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdout.write('\x1b[?25l'); // Hide cursor
      render();

      const onData = (key) => {
        // Ctrl+C
        if (key === '\u0003') {
          process.stdout.write('\x1b[?25h\n\x1b[33m✿ Cancelled.\x1b[0m\n');
          process.exit(0);
        }
        // Enter / Return
        if (key === '\r' || key === '\n') {
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\x1b[?25h'); // Show cursor
          
          // Clear menu and print selected summary
          const linesToClear = total + 2;
          for (let i = 0; i < linesToClear; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
          }
          const chosen = choices[selected];
          console.log(`${symbols.tick} ${colors.bold(message)} ${colors.cyan(chosen.name)}`);
          resolve(chosen.value);
          return;
        }
        // Up Arrow or k
        if (key === '\u001B\u005B\u0041' || key === 'k') {
          selected = (selected - 1 + total) % total;
          render();
        }
        // Down Arrow or j
        if (key === '\u001B\u005B\u0042' || key === 'j') {
          selected = (selected + 1) % total;
          render();
        }
      };

      process.stdin.on('data', onData);
    });
  }

  /**
   * Multi-selection interactive checklist with spacebar to toggle.
   * @param {string} message - Question to ask the user
   * @param {Array<{name: string, value: any, checked?: boolean, description?: string}>} choices
   * @returns {Promise<Array<any>>} Array of selected values
   */
  static async multiselect(message, choices) {
    if (!process.stdin.isTTY || choices.length === 0) {
      return choices.filter(c => c.checked).map(c => c.value);
    }

    return new Promise((resolve) => {
      let cursor = 0;
      const items = choices.map(c => ({ ...c, checked: !!c.checked }));
      const total = items.length;
      let firstRender = true;

      const render = () => {
        if (!firstRender) {
          const linesToClear = total + 2;
          for (let i = 0; i < linesToClear; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
          }
        }
        firstRender = false;

        const count = items.filter(i => i.checked).length;
        process.stdout.write(`${symbols.pointer} ${colors.bold(message)} ${colors.dim(`(${count} selected)`)}\n`);
        
        items.forEach((item, idx) => {
          const isAtCursor = idx === cursor;
          const arrow = isAtCursor ? colors.brightCyan('❯') : ' ';
          const checkbox = item.checked ? symbols.checkboxOn : symbols.checkboxOff;
          const nameStr = isAtCursor ? colors.brightWhite(colors.bold(item.name)) : (item.checked ? colors.green(item.name) : item.name);
          const descStr = item.description ? colors.dim(` (${item.description})`) : '';
          
          process.stdout.write(`  ${arrow} ${checkbox} ${nameStr}${descStr}\n`);
        });

        process.stdout.write(`  ${colors.dim('ℹ Space to toggle, ↑/↓ to navigate, ' + colors.bold('Enter') + ' to confirm.')}\n`);
      };

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdout.write('\x1b[?25l');
      render();

      const onData = (key) => {
        if (key === '\u0003') {
          process.stdout.write('\x1b[?25h\n\x1b[33m✿ Cancelled.\x1b[0m\n');
          process.exit(0);
        }
        if (key === '\r' || key === '\n') {
          process.stdin.removeListener('data', onData);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\x1b[?25h');
          
          const linesToClear = total + 2;
          for (let i = 0; i < linesToClear; i++) {
            process.stdout.write('\x1b[1A\x1b[2K');
          }
          const selectedItems = items.filter(i => i.checked);
          console.log(`${symbols.tick} ${colors.bold(message)} ${colors.cyan(`${selectedItems.length} items selected`)}`);
          resolve(selectedItems.map(i => i.value));
          return;
        }
        if (key === ' ') {
          items[cursor].checked = !items[cursor].checked;
          render();
        }
        if (key === '\u001B\u005B\u0041' || key === 'k') {
          cursor = (cursor - 1 + total) % total;
          render();
        }
        if (key === '\u001B\u005B\u0042' || key === 'j') {
          cursor = (cursor + 1) % total;
          render();
        }
        // Select All (a)
        if (key === 'a' || key === 'A') {
          const allChecked = items.every(i => i.checked);
          items.forEach(i => i.checked = !allChecked);
          render();
        }
      };

      process.stdin.on('data', onData);
    });
  }

  /**
   * Text input prompt with validation and placeholder support.
   * @param {string} message - Question to ask the user
   * @param {object} options - { defaultVal, placeholder, validate, required }
   * @returns {Promise<string>} Answer string
   */
  static async input(message, { defaultVal = '', placeholder = '', validate = null, required = false } = {}) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const displayDefault = defaultVal ? colors.dim(` (${defaultVal})`) : (placeholder ? colors.dim(` [e.g., ${placeholder}]`) : '');
    const promptStr = `${symbols.pointer} ${colors.bold(message)}${displayDefault}: `;

    const ask = () => new Promise((resolve) => {
      rl.question(promptStr, async (answer) => {
        let val = answer.trim();
        if (!val && defaultVal) val = defaultVal;
        
        if (required && !val) {
          console.log(`  ${symbols.cross} ${colors.red('This field is required. Please provide a value.')}`);
          resolve(await ask());
          return;
        }

        if (validate) {
          const res = await validate(val);
          if (res !== true) {
            console.log(`  ${symbols.cross} ${colors.red(typeof res === 'string' ? res : 'Invalid input.')}`);
            resolve(await ask());
            return;
          }
        }
        resolve(val);
      });
    });

    try {
      const result = await ask();
      rl.close();
      return result;
    } catch (err) {
      rl.close();
      throw err;
    }
  }

  /**
   * Instant Y/N confirmation prompt.
   * @param {string} message - Question to ask
   * @param {boolean} defaultVal - Default boolean value
   * @returns {Promise<boolean>}
   */
  static async confirm(message, defaultVal = true) {
    const hint = defaultVal ? '[Y/n]' : '[y/N]';
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const promptStr = `${symbols.pointer} ${colors.bold(message)} ${colors.dim(hint)} `;

    return new Promise((resolve) => {
      rl.question(promptStr, (answer) => {
        rl.close();
        const cleaned = answer.trim().toLowerCase();
        if (!cleaned) return resolve(defaultVal);
        if (cleaned === 'y' || cleaned === 'yes') return resolve(true);
        if (cleaned === 'n' || cleaned === 'no') return resolve(false);
        resolve(defaultVal);
      });
    });
  }
}

module.exports = Prompt;
