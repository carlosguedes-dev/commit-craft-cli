#!/usr/bin/env node

/**
 * CommitCraft CLI - Interactive Git Workflow Supercharger & Conventional Commits Assistant
 * Zero heavy external dependencies. Lightning-fast execution.
 */

const { runCLI } = require('../src/index.js');

// Gracefully handle SIGINT (Ctrl+C) and SIGTERM without ugly stack traces
process.on('SIGINT', () => {
  process.stdout.write('\n\x1b[33m✿ CommitCraft session cancelled by user. Goodbye!\x1b[0m\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  process.stderr.write(`\n\x1b[31m✖ Unhandled Error in CommitCraft CLI:\x1b[0m ${err.message}\n`);
  if (process.env.DEBUG) {
    console.error(err.stack);
  }
  process.exit(1);
});

// Run the CLI
runCLI(process.argv.slice(2)).catch((err) => {
  process.stderr.write(`\n\x1b[31m✖ Error:\x1b[0m ${err.message || err}\n`);
  process.exit(1);
});
