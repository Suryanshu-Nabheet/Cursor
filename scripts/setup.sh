#!/bin/bash

# Cursor IDE Setup Script for macOS/Linux
# Run from anywhere: ./scripts/setup.sh

set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "================================================"
echo "  Cursor IDE Setup - macOS/Linux"
echo "================================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}OK: $1${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_info() {
    echo -e "${YELLOW}INFO: $1${NC}"
}

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js 16 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) detected"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi
print_success "npm $(npm -v) detected"

if ! command -v git &> /dev/null; then
    print_error "git is not installed!"
    exit 1
fi
print_success "git $(git --version | awk '{print $3}') detected"

print_info "Cleaning old build artifacts..."
if [ -d .webpack ] || [ -d dist ] || [ -d out ]; then
    rm -rf .webpack dist out
    print_success "Cleaned old builds"
else
    print_info "No build artifacts to clean"
fi

print_info "Installing npm dependencies..."
if npm ci; then
    print_success "Dependencies installed successfully"
elif npm install; then
    print_success "Dependencies installed successfully (fallback)"
else
    print_error "Failed to install dependencies"
    echo "Try running 'rm -rf node_modules package-lock.json && npm install'"
    exit 1
fi

print_info "Setting up Language Server Protocol (LSP) directory..."
mkdir -p lsp

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        print_info "Creating .env file from template..."
        cp .env.example .env
        print_success ".env file created"
    else
        print_info "No .env.example found; skipping .env creation"
    fi
else
    print_info ".env file already exists"
fi

print_info "Branding Electron binary as Cursor (Dock / menu name)..."
if node scripts/brand-electron-dev.js; then
    print_success "Electron binary branded as Cursor"
else
    print_info "Brand step skipped or failed (packaged builds still use forge icons)"
fi

echo ""
echo "================================================"
print_success "Cursor IDE setup completed successfully!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Review and update .env file if needed"
echo "  2. Quit any running Electron/Cursor instances"
echo "  3. Run 'npm start' to launch Cursor IDE"
echo ""
echo "For more information, see README.md"
echo ""
