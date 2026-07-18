# Changelog

All notable changes to **Cursor IDE** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Copyright (c) 2026 Suryanshu Nabheet. Released under the MIT License.

---

## [Unreleased]

### Changed

- Rebranded product identity to **Cursor** (v1.0.0): packaging name, protocol (`cursor://`), themes, menus, docs, and repository links.
- Fixed application icons end-to-end (`icon.icns` / multi-size PNG / ICO) and wired BrowserWindow + macOS dock icons for development and packaged builds.
- Removed emoji and decorative noise from docs, setup scripts, and runtime messages.
- Removed unused empty stub modules (`commentSelectors.ts`, `ssh.ts`).
- Standardized MIT copyright notice: Copyright (c) 2026 Suryanshu Nabheet.
- Canonical repository: [Suryanshu-Nabheet/cursor](https://github.com/Suryanshu-Nabheet/cursor).

### Fixed

- Default Electron icon no longer appears when launching via `npm start` on macOS.

---

## [1.0.0] - 2026-01-01

### Added

- Initial Cursor IDE release by Suryanshu Nabheet.
- AI inline completion, chat sidebar with tools, and command bar.
- CodeMirror 6 editor, LSP integration, multi-tab terminal, OpenVSX extensions.
- Cross-platform builds for macOS, Windows, and Linux.
