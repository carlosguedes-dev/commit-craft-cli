/**
 * Zero-dependency Git Utilities for CommitCraft CLI.
 * Executes git commands safely using child_process.spawnSync without shell escaping bugs.
 */
const { spawnSync, execSync } = require('child_process');

class GitUtils {
  /**
   * Run a synchronous git command and return stdout string.
   */
  static exec(args, { silent = true, input = null } = {}) {
    const options = {
      encoding: 'utf8',
      stdio: silent ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'inherit', 'inherit'],
    };
    if (input !== null) {
      options.input = input;
    }
    const res = spawnSync('git', args, options);
    if (res.error) throw res.error;
    if (res.status !== 0) {
      const errMsg = res.stderr ? res.stderr.trim() : `git ${args.join(' ')} failed with exit code ${res.status}`;
      throw new Error(errMsg);
    }
    return res.stdout ? res.stdout.trim() : '';
  }

  /**
   * Check if the current working directory is inside a Git repository.
   */
  static isGitRepo() {
    try {
      this.exec(['rev-parse', '--is-inside-work-tree']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current active git branch name.
   */
  static getCurrentBranch() {
    try {
      return this.exec(['branch', '--show-current']) || this.exec(['rev-parse', '--abbrev-ref', 'HEAD']);
    } catch {
      return 'main';
    }
  }

  /**
   * Get repository status: staged, unstaged, untracked files.
   */
  static getStatus() {
    const staged = this.exec(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
    const unstaged = this.exec(['diff', '--name-only']).split('\n').filter(Boolean);
    const untracked = this.exec(['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
    return { staged, unstaged, untracked };
  }

  /**
   * Check if there are any staged changes ready for commit.
   */
  static hasStagedChanges() {
    const { staged } = this.getStatus();
    return staged.length > 0;
  }

  /**
   * Stage all changes (git add -A).
   */
  static stageAll() {
    return this.exec(['add', '-A']);
  }

  /**
   * Stage specific files.
   */
  static stageFiles(files) {
    if (!files || files.length === 0) return;
    return this.exec(['add', '--', ...files]);
  }

  /**
   * Execute git commit with a formatted message passed via stdin (-F -) to prevent any quote/escape issues.
   * @param {string} fullMessage - Complete commit message (header, body, footer)
   * @returns {string} Git commit output summary
   */
  static commit(fullMessage) {
    // We run commit with inherit stdio so user sees git hook outputs / gpg signing prompts if any
    const res = spawnSync('git', ['commit', '-F', '-'], {
      input: fullMessage,
      encoding: 'utf8',
      stdio: ['pipe', 'inherit', 'inherit']
    });
    if (res.status !== 0) {
      throw new Error(`Git commit failed with status ${res.status}`);
    }
    return true;
  }

  /**
   * Get list of tags sorted by creation date (newest first).
   */
  static getTags() {
    try {
      const out = this.exec(['tag', '--sort=-creatordate']);
      return out.split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  /**
   * Get the latest tag name, or null if no tags exist.
   */
  static getLatestTag() {
    const tags = this.getTags();
    return tags.length > 0 ? tags[0] : null;
  }

  /**
   * Get commits between two references (or from beginning of repo).
   * Parses into structured objects.
   */
  static getCommits(fromRef = null, toRef = 'HEAD') {
    const range = fromRef ? `${fromRef}..${toRef}` : toRef;
    const delimiter = '---COMMIT_DELIMITER_CCRAFT---';
    const formatStr = `%H|%an|%ad|%s|%b${delimiter}`;
    let raw;
    try {
      raw = this.exec(['log', range, `--pretty=format:${formatStr}`, '--date=short']);
    } catch (e) {
      return [];
    }

    if (!raw) return [];

    const rawCommits = raw.split(delimiter).map(c => c.trim()).filter(Boolean);
    return rawCommits.map(c => {
      const parts = c.split('|');
      const hash = parts[0] || '';
      const author = parts[1] || '';
      const date = parts[2] || '';
      const subject = parts[3] || '';
      const body = parts.slice(4).join('|').trim(); // body might contain pipes

      return this.parseConventionalCommit({ hash, author, date, subject, body });
    });
  }

  /**
   * Parse commit subject and body into Conventional Commit components.
   */
  static parseConventionalCommit({ hash, author, date, subject, body }) {
    const regex = /^([a-zA-Z]+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;
    const match = subject.match(regex);

    let type = 'other';
    let scope = null;
    let isBreaking = false;
    let description = subject;

    if (match) {
      type = match[1].toLowerCase();
      scope = match[2] || null;
      isBreaking = !!match[3];
      description = match[4];
    }

    // Check body for breaking change footer
    if (body && (body.includes('BREAKING CHANGE:') || body.includes('BREAKING-CHANGE:'))) {
      isBreaking = true;
    }

    const issueRegex = /(?:#|issues?\/|cr\/)(\d+)/gi;
    const issues = [];
    let issueMatch;
    const combinedText = `${subject} ${body}`;
    while ((issueMatch = issueRegex.exec(combinedText)) !== null) {
      const num = `#${issueMatch[1]}`;
      if (!issues.includes(num)) issues.push(num);
    }

    return {
      hash: hash.slice(0, 7),
      fullHash: hash,
      author,
      date,
      type,
      scope,
      description,
      body,
      isBreaking,
      issues,
      rawSubject: subject
    };
  }

  /**
   * Get primary base branch (main, master, or develop).
   */
  static getBaseBranch() {
    const branches = this.exec(['branch', '--list']).split('\n').map(b => b.replace(/^\*\s*/, '').trim());
    if (branches.includes('main')) return 'main';
    if (branches.includes('master')) return 'master';
    if (branches.includes('develop')) return 'develop';
    return this.getCurrentBranch();
  }

  /**
   * Get local branches that have been merged into the base branch.
   */
  static getMergedBranches(baseBranch = null) {
    const base = baseBranch || this.getBaseBranch();
    const current = this.getCurrentBranch();
    
    // Protected branches that should never be deleted by cleanup
    const protectedBranches = ['main', 'master', 'develop', 'dev', 'staging', 'prod', 'production', current];

    try {
      const out = this.exec(['branch', '--merged', base]);
      const merged = out
        .split('\n')
        .map(b => b.replace(/^\*\s*/, '').trim())
        .filter(b => b && !protectedBranches.includes(b.toLowerCase()) && !protectedBranches.includes(b));
      return { base, branches: merged };
    } catch {
      return { base, branches: [] };
    }
  }

  /**
   * Delete local git branch.
   */
  static deleteBranch(branchName, force = false) {
    const flag = force ? '-D' : '-d';
    return this.exec(['branch', flag, branchName]);
  }
}

module.exports = GitUtils;
