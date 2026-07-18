#!/usr/bin/env bash
# Clean build outputs, logs, and tool caches. Does NOT remove node_modules or LSP servers.
# Usage: ./scripts/clean.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}OK:${NC} $1"; }
info() { echo -e "${YELLOW}INFO:${NC} $1"; }

REMOVED=0

remove_path() {
    local target="$1"
    if [ -e "$target" ]; then
        rm -rf "$target"
        ok "Removed $target"
        REMOVED=$((REMOVED + 1))
    fi
}

echo "================================================"
echo "  Cursor — clean"
echo "================================================"
echo ""

remove_path ".webpack"
remove_path "out"
remove_path "dist"
remove_path "coverage"
remove_path ".nyc_output"
remove_path "logs"
remove_path ".eslintcache"
remove_path ".cache"
remove_path "node_modules/.cache"

# Root-level log files
shopt -s nullglob
for f in ./*.log ./npm-debug.log* ./yarn-error.log*; do
    [ -e "$f" ] || continue
    rm -f "$f"
    ok "Removed $f"
    REMOVED=$((REMOVED + 1))
done
shopt -u nullglob

# TypeScript incremental caches in project (not node_modules)
while IFS= read -r -d '' f; do
    rm -f "$f"
    ok "Removed $f"
    REMOVED=$((REMOVED + 1))
done < <(find . -maxdepth 3 -type f -name '*.tsbuildinfo' ! -path './node_modules/*' -print0 2>/dev/null || true)

echo ""
if [ "$REMOVED" -eq 0 ]; then
    info "Nothing to clean"
else
    ok "Clean finished ($REMOVED items)"
fi
echo ""
echo "Next: npm start   |   deeper wipe: npm run reset"
echo ""
