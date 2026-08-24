const test = require('node:test');
const assert = require('node:assert');
const { parseArgs } = require('../src/index.js');

test('parseArgs', async (t) => {
  await t.test('parses positional args correctly', () => {
    const argv = ['commit'];
    const args = parseArgs(argv);
    assert.deepStrictEqual(args._, ['commit']);
  });

  await t.test('parses long flags with values', () => {
    const argv = ['--type', 'feat'];
    const args = parseArgs(argv);
    assert.strictEqual(args.type, 'feat');
  });

  await t.test('parses long flags as boolean if no value provided', () => {
    const argv = ['--help'];
    const args = parseArgs(argv);
    assert.strictEqual(args.help, true);
  });

  await t.test('parses short flags as boolean', () => {
    const argv = ['-v'];
    const args = parseArgs(argv);
    assert.strictEqual(args.v, true);
  });

  await t.test('parses a mix of arguments', () => {
    const argv = ['commit', '--type', 'fix', '-v', '--dry-run'];
    const args = parseArgs(argv);
    assert.deepStrictEqual(args._, ['commit']);
    assert.strictEqual(args.type, 'fix');
    assert.strictEqual(args.v, true);
    assert.strictEqual(args['dry-run'], true);
  });
});
