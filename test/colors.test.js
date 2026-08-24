const test = require('node:test');
const assert = require('node:assert');
const colors = require('../src/utils/colors.js');

test('colors utility', async (t) => {
  await t.test('hex color conversion', () => {
    const result = colors.hex('#FF0000')('test text');
    if (colors.isTTY) {
      assert.ok(result.includes('\x1b[38;2;255;0;0m'), 'Should include ANSI hex code');
      assert.ok(result.includes('test text'), 'Should include original text');
    } else {
      assert.strictEqual(result, 'test text', 'Should return plain text when NO_COLOR is active or no TTY');
    }
  });

  await t.test('hex short code color conversion', () => {
    const result = colors.hex('#F00')('test text');
    if (colors.isTTY) {
      assert.ok(result.includes('\x1b[38;2;255;0;0m'), 'Should expand shorthand hex and include ANSI hex code');
    } else {
      assert.strictEqual(result, 'test text');
    }
  });

  await t.test('gradient generation', () => {
    const result = colors.gradient('abc');
    if (colors.isTTY) {
      assert.notStrictEqual(result, 'abc', 'Gradient should wrap text with ANSI codes');
      assert.ok(result.includes('\x1b[38;2;'), 'Should include truecolor ANSI codes');
    } else {
      assert.strictEqual(result, 'abc', 'Should return plain text without TTY');
    }
  });

  await t.test('standard color formatting', () => {
    const result = colors.red('error');
    if (colors.isTTY) {
      assert.ok(result.startsWith('\x1b[31m'));
      assert.ok(result.endsWith('\x1b[39m'));
    } else {
      assert.strictEqual(result, 'error');
    }
  });
});
