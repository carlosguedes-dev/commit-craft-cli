const test = require('node:test');
const assert = require('node:assert');
const GitUtils = require('../src/utils/git.js');

test('GitUtils', async (t) => {
  await t.test('parseConventionalCommit parses a simple commit correctly', () => {
    const input = {
      hash: 'abc1234',
      author: 'John Doe',
      date: '2023-01-01',
      subject: 'feat: add new feature',
      body: ''
    };
    const parsed = GitUtils.parseConventionalCommit(input);
    assert.strictEqual(parsed.type, 'feat');
    assert.strictEqual(parsed.scope, null);
    assert.strictEqual(parsed.description, 'add new feature');
    assert.strictEqual(parsed.isBreaking, false);
    assert.strictEqual(parsed.hash, 'abc1234');
    assert.strictEqual(parsed.fullHash, 'abc1234');
  });

  await t.test('parseConventionalCommit parses a scoped commit correctly', () => {
    const input = {
      hash: 'abc1234',
      author: 'John Doe',
      date: '2023-01-01',
      subject: 'fix(ui): resolve button alignment',
      body: ''
    };
    const parsed = GitUtils.parseConventionalCommit(input);
    assert.strictEqual(parsed.type, 'fix');
    assert.strictEqual(parsed.scope, 'ui');
    assert.strictEqual(parsed.description, 'resolve button alignment');
  });

  await t.test('parseConventionalCommit parses breaking change via bang', () => {
    const input = {
      hash: 'abc1234',
      author: 'John Doe',
      date: '2023-01-01',
      subject: 'feat(api)!: drop v1 support',
      body: ''
    };
    const parsed = GitUtils.parseConventionalCommit(input);
    assert.strictEqual(parsed.type, 'feat');
    assert.strictEqual(parsed.isBreaking, true);
  });

  await t.test('parseConventionalCommit parses breaking change via footer', () => {
    const input = {
      hash: 'abc1234',
      author: 'John Doe',
      date: '2023-01-01',
      subject: 'chore: update dependencies',
      body: 'BREAKING CHANGE: requires node 18'
    };
    const parsed = GitUtils.parseConventionalCommit(input);
    assert.strictEqual(parsed.isBreaking, true);
  });

  await t.test('parseConventionalCommit parses issue references from subject and body', () => {
    const input = {
      hash: 'abc1234',
      author: 'John Doe',
      date: '2023-01-01',
      subject: 'feat: implement login (#123)',
      body: 'This closes #456 and fixes issue/789'
    };
    const parsed = GitUtils.parseConventionalCommit(input);
    assert.deepStrictEqual(parsed.issues, ['#123', '#456', '#789']);
  });
});
