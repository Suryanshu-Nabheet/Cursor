#!/usr/bin/env bash
# Deep clean for a fresh setup: build outputs, logs, caches, LSP downloads, node_modules.
# Does NOT delete git history or source.
# Usage: ./scripts/reset.sh
#        ./scripts/reset.sh --with-userdata   # also wipe Cursor Electron userData (settings, extensions)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok() { echo -e "${GREEN}OK:${NC} $1"; }
info() { echo -e "${YELLOW}INFO:${NC} $1"; }
warn() { echo -e "${RED}WARN:${NC} $1"; }

WITH_USERDATA=0
for arg in "$@"; do
    case "$arg" in
        --with-userdata) WITH_USERDATA=1 ;;
        -h|--help)
            echo "Usage: ./scripts/reset.sh [--with-userdata]"
            exit 0
            ;;
    esac
done

echo "================================================"
echo "  Cursor — reset (fresh setup)"
echo "================================================"
echo ""

# Layer 1: normal clean
bash "$ROOT/scripts/clean.sh"

# Layer 2: downloaded language servers (kept under ./lsp)
if [ -d "lsp" ]; then
    info "Clearing LSP downloads (keeping lsp/ directory)..."
    find lsp -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    ok "Cleared lsp/"
else
    mkdir -p lsp
    ok "Created lsp/"
fi

# Layer 3: dependencies
if [ -d "node_modules" ]; then
    info "Removing node_modules (this may take a minute)..."
    rm -rf node_modules
    ok "Removed node_modules"
fi

# Optional: app runtime data (settings, extensions, logs)
if [ "$WITH_USERDATA" -eq 1 ]; then
    info "Removing Cursor / Electron userData..."
    case "$(uname -s)" in
        Darwin)
            remove_ud() {
                [ -d "$1" ] && rm -rf "$1" && ok "Removed $1"
            }
            remove_ud "$HOME/Library/Application Support/Cursor"
            remove_ud "$HOME/Library/Application Support/cursor"
            remove_ud "$HOME/Library/Application Support/Electron"
            remove_ud "$HOME/Library/Logs/Cursor"
            remove_ud "$HOME/Library/Logs/cursor"
            remove_ud "$HOME/Library/Logs/Electron"
            ;;
        Linux)
            remove_ud() {
                [ -d "$1" ] && rm -rf "$1" && ok "Removed $1"
            }
            remove_ud "$HOME/.config/Cursor"
            remove_ud "$HOME/.config/cursor"
            remove_ud "$HOME/.config/Electron"
            remove_ud "$HOME/.config/electron"
            ;;
        *)
            warn "UserData wipe on this OS: close the app and delete Application Support / AppData manually"
            ;;
    esac
else
    info "Skipped userData (pass --with-userdata to wipe settings/extensions/logs)"
fi

echo ""
ok "Reset complete"
echo ""
echo "Fresh setup:"
echo "  npm run setup"
echo "  npm start"
echo ""
