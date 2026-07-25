<div align="center">

# ⚡️ ★ CommitCraft CLI ★ ⚡️

**An interactive Git workflow supercharger and Conventional Commits assistant.**  
*Um assistente interativo para workflows Git e Conventional Commits, ultrarrápido e sem dependências pesadas.*

[![npm version](https://img.shields.io/npm/v/commit-craft-cli?color=00C9FF&label=version&style=for-the-badge)](https://www.npmjs.com/package/commit-craft-cli)
[![Node.js Version](https://img.shields.io/node/v/commit-craft-cli?color=92FE9D&style=for-the-badge)](https://nodejs.org)
[![Dependencies: Zero](https://img.shields.io/badge/dependencies-ZERO%20%E2%9A%A1%EF%B8%8F-brightgreen?style=for-the-badge)](https://github.com/carlo/commit-craft-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](./CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?style=for-the-badge)](https://conventionalcommits.org)

```
   ____________  __  _____  ___________  ____________  ___ ______
  / ____/ __ \ \/ / / /  |/  /  _/  _/ |/ / ____/ __ \/   | / ____/
 / /   / / / /\  / / / /|_/ // / / // |  / /   / /_/ / /| |/ /_    
/ /___/ /_/ / / / / / /  / // /_/ // /| / /___/ _, _/ ___ / __/    
\____/\____/ /_/ /_/_/  /_/___/___/_/ |_\____/_/ |_/_/  |_/_/      
```

[English Documentation](#-english-documentation) • [Documentação em Português](#-documentação-em-português) • [Architecture](#-why-zero-dependencies) • [Contributing](#-contributing)

</div>

---

## 🚀 Why CommitCraft? | Por Que CommitCraft?

Most developer CLI tools today are bloated with dozens of external dependencies (`chalk`, `inquirer`, `commander`, `boxen`, `gradient-string`), causing slow startup times and potential NPM supply chain security risks. 

**CommitCraft CLI** changes the game: built **100% from scratch using pure Node.js built-in modules** (`readline`, `child_process`, `fs`, `path`, raw TTY ANSI formatting). 
- **⚡️ Instant Execution (<30ms)**: Launches faster than your blink.
- **🛡️ Bulletproof Security**: ZERO third-party NPM dependencies.
- **🎨 Gorgeous Terminal UI**: Custom Unicode boxes, interactive spinners, badges, and gradient headers.
- **🧙‍♂️ Everyday Workflow Automation**: Prevents bad commit messages, generates Markdown changelogs in seconds, and keeps your local branch workspace clean!

---

## 💻 Terminal UI Previews | Demonstração do Terminal

### ✨ 1. Interactive Commit Wizard (`commit-craft commit` or `ccraft`)
Never memorize Conventional Commit syntax or struggle with multiline commit messages again! Guide your commits through types, scopes, breaking changes, and issue references.

```
╭─ Commit Preview ─────────────────────────────────────────────────────────────╮
│ Branch:  feat/user-auth                                                      │
│ Header:  feat(auth): add JWT refresh token rotation                          │
│ Body:    Implements automatic token rotation on 401 API responses.           │
│ Issues:  closes #142, refs #99                                               │
╰──────────────────────────────────────────────────────────────────────────────╯
✔ Execute git commit with this message? [Y/n] y
✔ Commit crafted and executed successfully!
★ Tip: Run git push to publish your changes to remote.
```

### 📜 2. Automated Changelog Generator (`commit-craft changelog` or `ccraft ch`)
Scan commit logs between tags or dates and export beautifully formatted Markdown release notes grouped by change type.

```
╭─ Changelog Preview ──────────────────────────────────────────────────────────╮
│ ## [v1.2.0] - 2026-07-25                                                     │
│                                                                              │
│   🚀 Features                                                                │
│     ▸ [auth] add JWT refresh token rotation (7a8f9c1) (closes #142)          │
│     ▸ [cli] add interactive branch cleanup checklist (3b2e1a0)               │
│                                                                              │
│   🐛 Bug Fixes                                                               │
│     ▸ [ui] resolve ANSI border padding on Windows CMD (9d1c8f4)              │
╰──────────────────────────────────────────────────────────────────────────────╯
✔ Successfully updated CHANGELOG.md in project root!
```

### 🧹 3. Interactive Branch Cleaner (`commit-craft cleanup` or `ccraft cl`)
Stop letting stale branches clutter your local repository. Detect local branches already merged into `main`/`master` and interactive toggle which ones to delete!

```
❯ Select branches to delete (Space to toggle, 'a' to toggle all): (2 selected)
  ❯ ◉ feat/old-login-page (Merged into main)
    ◉ fix/header-typo (Merged into main)
    ◯ refactor/experimental-ui (Merged into main)

ℹ Space to toggle, ↑/↓ to navigate, Enter to confirm.
✔ Successfully deleted 2 merged branch(es)! Workspace is clean.
```

---

<a name="-english-documentation"></a>
## 📖 English Documentation

### 📦 Installation

Install globally via npm to use the `commit-craft` or `ccraft` command anywhere:

```bash
npm install -g commit-craft-cli
```

Or run instantly without installing via `npx`:

```bash
npx commit-craft-cli
```

### ⚡ Commands & Usage

| Command | Alias | Description |
| :--- | :--- | :--- |
| `commit-craft` | `ccraft` | **Default Command.** Launches the interactive Conventional Commit wizard. |
| `commit-craft commit` | `ccraft c` | Explicitly launch the commit wizard. Intelligent staging assistance included. |
| `commit-craft changelog` | `ccraft ch` | Generate formatted Markdown changelogs from git history. |
| `commit-craft cleanup` | `ccraft cl` | Interactive checklist to prune local branches merged into main/master. |
| `commit-craft --help` | `ccraft -h` | Display usage instructions, options, and examples banner. |
| `commit-craft --version` | `ccraft -v` | Display the installed version number. |

#### Advanced Changelog Options:
```bash
# Generate changelog between specific tags and append directly to CHANGELOG.md
ccraft changelog --from v1.0.0 --to v1.1.0 --write

# Output changelog to a custom file
ccraft changelog --output RELEASE_NOTES.md --write
```

#### Advanced Cleanup Options:
```bash
# Check merged branches against 'develop' instead of 'main'/'master'
ccraft cleanup --base develop

# Force delete (-D) stubborn unmerged branches
ccraft cleanup --force
```

---

<a name="-documentação-em-português"></a>
## 🇧🇷 Documentação em Português

### 📦 Instalação

Instale globalmente via npm para utilizar os comandos `commit-craft` ou `ccraft` em qualquer terminal:

```bash
npm install -g commit-craft-cli
```

Ou execute diretamente sem instalar usando `npx`:

```bash
npx commit-craft-cli
```

### ⚡ Comandos e Uso

| Comando | Atalho | Descrição |
| :--- | :--- | :--- |
| `commit-craft` | `ccraft` | **Comando Padrão.** Inicia o assistente interativo de Conventional Commits. |
| `commit-craft commit` | `ccraft c` | Inicia o assistente de commits. Se nada estiver no staging, ele oferece ajuda interativa para adicionar arquivos. |
| `commit-craft changelog` | `ccraft ch` | Gera um changelog em Markdown formatado a partir do histórico de commits do Git. |
| `commit-craft cleanup` | `ccraft cl` | Lista interativa para deletar branches locais que já foram mergeadas na main/master. |
| `commit-craft --help` | `ccraft -h` | Exibe o painel de ajuda com instruções, opções e exemplos. |
| `commit-craft --version` | `ccraft -v` | Exibe a versão atual da CLI instalada. |

#### Opções Avançadas do Changelog:
```bash
# Gerar changelog entre tags específicas e salvar automaticamente no CHANGELOG.md
ccraft changelog --from v1.0.0 --to v1.1.0 --write

# Exportar para um arquivo personalizado
ccraft changelog --output NOTAS_DE_VERSAO.md --write
```

#### Opções Avançadas de Limpeza de Branches (Cleanup):
```bash
# Verificar branches mergeadas em relação à 'develop' em vez da 'main'/'master'
ccraft cleanup --base develop

# Forçar a exclusão (-D) de branches teimosas
ccraft cleanup --force
```

---

<a name="-why-zero-dependencies"></a>
## 🏗️ The Zero-Dependency Philosophy | A Filosofia Zero-Dependências

Why did we build CommitCraft without any external NPM packages?

1. **Supply Chain Immunity**: Modern JavaScript development is plagued by dependency vulnerabilities and bloated node_modules. CommitCraft uses 0 external packages.
2. **Raw TTY Control**: By utilizing Node.js `readline` and setting `process.stdin` to raw mode, we achieve arrow-key navigation (`↑`/`↓`, `j`/`k`), spacebar checklists, and real-time validation without third-party prompt libraries.
3. **Sub-30ms Execution**: No library parsing overhead. Your terminal commands respond instantly.

---

<a name="-contributing"></a>
## 🤝 Contributing | Como Contribuir

We love open-source contributions! Whether you want to add new Conventional Commit types, improve UI themes, or translate documentation, your PRs are extremely welcome.

Please check out our [Contributing Guidelines](./CONTRIBUTING.md) to get started!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes using **CommitCraft itself!** (`node ./bin/commit-craft.js commit`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request!

---

## 📄 License | Licença

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">

**Made with ❤️ by developers, for developers.**  
*Feito com ❤️ por desenvolvedores, para desenvolvedores.*

⭐ **If this tool saves you time, please give it a star on GitHub!** ⭐

</div>
