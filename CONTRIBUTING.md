# Contributing to CommitCraft CLI 

First off, thank you for considering contributing to **CommitCraft CLI**! It's people like you that make open-source such a fantastic community to learn, inspire, and create.

##  Our Golden Rule: Zero External Dependencies!

The core philosophy of **CommitCraft CLI** is lightning-fast execution and total immunity to NPM supply chain issues through **zero heavy external dependencies**. 

When adding new features or bug fixes, **please do not add external npm packages** (like `chalk`, `inquirer`, `commander`, `boxen`, `lodash`, etc.) to `package.json`. Everything must be built using Node.js native built-in modules (`fs`, `path`, `readline`, `child_process`, `os`, `util`, `events`, raw ANSI strings, etc.).

---

##  Local Development Setup

1. **Fork & Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/commit-craft-cli.git
   cd commit-craft-cli
   ```

2. **Link the package locally:**
   By linking, you can use the `ccraft` or `commit-craft` command anywhere on your machine while developing:
   ```bash
   npm link
   ```
   *Alternatively, you can run the CLI directly from source during development:*
   ```bash
   node ./bin/commit-craft.js --help
   ```

3. **Run tests (if applicable):**
   We use Node.js built-in test runner (`node --test`):
   ```bash
   npm test
   ```

---

##  Making Commits

We practice what we preach! When submitting pull requests to this repository, please format your commit messages using **Conventional Commits**.

You can use CommitCraft CLI itself to guide you:
```bash
# Run the local commit wizard
node ./bin/commit-craft.js commit
# OR if linked:
ccraft commit
```

### Commit Type Reference:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style, formatting (no logic change)
- `refactor`: Restructuring code without changing behavior
- `perf`: Performance optimizations
- `test`: Adding or updating tests
- `build` / `ci`: Changes to build system or CI/CD configuration
- `chore`: Maintenance tasks

---

##  Pull Request Process

1. Ensure your branch is updated with the latest `main` branch.
2. Test your changes across terminal environments if possible (standard terminals, Windows PowerShell/CMD, VS Code integrated terminal).
3. Ensure that your changes do not introduce any new npm dependencies.
4. Open a PR with a clear description of the problem solved or feature added. Include screenshots or terminal output if modifying UI elements!

Thank you for helping us make Git workflows faster and more delightful for developers around the world! 
