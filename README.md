# Cursor IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-emerald.svg?style=flat-square)](https://github.com/Suryanshu-Nabheet/cursor)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg?style=flat-square)](#)

A lightweight, from-scratch Electron IDE powered by CodeMirror, with AI completion, LSP, terminal, and OpenVSX extensions. Offline-first by default (Ollama).

![Cursor IDE Demo](/public/demo.png)

Repository: [github.com/Suryanshu-Nabheet/cursor](https://github.com/Suryanshu-Nabheet/cursor)

---

## Features

### Intelligence

- AI inline ghost-text completion from the configured provider
- AI chat sidebar with project tools (read/edit/search/terminal)
- Language Server Protocol for diagnostics, hover, symbols, and definitions
- Command bar (`Cmd/Ctrl + K`) for in-editor generation and edits

### Editor and UI

- CodeMirror 6 editor with Vim/Emacs modes
- Themes including Cursor Dark, with instant switching
- Configurable font family and size
- Sidebars for files, search, git, and extensions

### Tooling

- Multi-tab integrated terminal (`node-pty` + xterm)
- OpenVSX extension browse/install
- Cross-platform packaging via Electron Forge

### Privacy

- Core workflow runs locally
- Cloud AI providers are optional and key-gated in Settings

---

## Quick start

### Prerequisites

- Node.js v18+
- npm v9+
- Git

### Install

```bash
git clone https://github.com/Suryanshu-Nabheet/cursor.git
cd cursor

./scripts/setup.sh       # macOS/Linux
# .\scripts\setup.ps1    # Windows
# or: npm run setup / npm run setup:win

npm start
```

---

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Quick Open | `Cmd/Ctrl + P` |
| Command Palette | `Cmd/Ctrl + Shift + P` |
| Global Search | `Cmd/Ctrl + Shift + F` |
| Toggle Terminal | `` Ctrl + ` `` |
| Save All | `Cmd/Ctrl + Alt + S` |
| AI Command Bar | `Cmd/Ctrl + K` |
| Manual Inline Completion | `Cmd/Ctrl + Shift + Space` or `Alt + \` |

---

## Architecture

- Electron
- React 18 and Tailwind CSS
- Redux Toolkit
- CodeMirror 6
- TypeScript

---

## AI completion

Cursor 1.0.0 uses an AI-first completion stack:

- Ghost text uses provider, editor, diagnostic, and open-file context
- LSP remains for language intelligence (not a lexical completion fallback)

Default provider is Ollama at `http://localhost:11434`. Cloud providers require an API key in Settings. See [docs/completion.md](docs/completion.md).

---

## Language support

- Web: JavaScript, TypeScript, HTML, CSS/SCSS, JSON
- Systems: C, C++, Rust, Go
- Backend: Python, Java, PHP, Ruby
- Data: SQL, YAML, TOML, Markdown

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

Copyright (c) 2026 Suryanshu Nabheet.

Released under the **MIT License**. Full text: [LICENSE](LICENSE).

---

## Author

**Suryanshu Nabheet**

[GitHub](https://github.com/Suryanshu-Nabheet) · [LinkedIn](https://linkedin.com/in/suryanshu-nabheet)
