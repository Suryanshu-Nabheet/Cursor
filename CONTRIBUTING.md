# Contributing to Cursor IDE

Thank you for contributing to **Cursor IDE**. Contributions should meet the same bar as the product: correct, maintainable, and intentional.

---

## Standards

- **Quality**: Type-safe, robust, and well-structured code.
- **UI**: Match the existing monochromatic design system; no decorative noise.
- **Performance**: Prefer fast paths; avoid unnecessary work on hot editor/render loops.
- **Privacy**: Prefer offline-first behavior; do not leak secrets or user code.

---

## Getting started

1. Fork the repository and create a feature branch.
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/cursor.git`
3. Add upstream: `git remote add upstream https://github.com/Suryanshu-Nabheet/cursor.git`
4. Install dependencies: `npm install`
5. Bootstrap native deps: `./scripts/setup.sh` (macOS/Linux) or `.\scripts\setup.ps1` (Windows)
6. Run: `npm start`

Before opening a pull request:

```bash
npm run format-check
npm run lint
npm test
npm start
```

---

## Pull requests

1. Use descriptive branch names (`feat/...`, `fix/...`).
2. Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new capability
   - `fix:` bug fix
   - `perf:` performance
   - `refactor:` structure without behavior change
   - `docs:` documentation only
3. Update `README.md` when user-facing behavior changes.
4. Add a short note under `[Unreleased]` in `CHANGELOG.md`.

---

## Issues

- **Bugs**: Steps to reproduce, expected vs actual, OS, and app version (`1.0.0`).
- **Features**: Problem statement and why it belongs in Cursor.

---

## License

By contributing, you agree that your contributions are licensed under the same **MIT License** as the project. Copyright (c) 2026 Suryanshu Nabheet.

---

## Contact

- Discussions: [GitHub Discussions](https://github.com/Suryanshu-Nabheet/cursor/discussions)
- Email: suryanshunab@gmail.com
- Maintainer: Suryanshu Nabheet
