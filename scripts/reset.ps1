# Deep clean for a fresh setup.
# Usage: .\scripts\reset.ps1
#        .\scripts\reset.ps1 -WithUserData

param(
    [switch]$WithUserData
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Write-Ok([string]$Message) { Write-Host "OK: $Message" -ForegroundColor Green }
function Write-Info([string]$Message) { Write-Host "INFO: $Message" -ForegroundColor Yellow }

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Cursor — reset (fresh setup)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

& "$Root\scripts\clean.ps1"

if (Test-Path "lsp") {
    Write-Info "Clearing LSP downloads..."
    Get-ChildItem "lsp" -Force | Remove-Item -Recurse -Force
    Write-Ok "Cleared lsp/"
} else {
    New-Item -ItemType Directory -Path "lsp" | Out-Null
    Write-Ok "Created lsp/"
}

if (Test-Path "node_modules") {
    Write-Info "Removing node_modules..."
    Remove-Item -Recurse -Force "node_modules"
    Write-Ok "Removed node_modules"
}

if ($WithUserData) {
    Write-Info "Removing Cursor / Electron userData..."
    $paths = @(
        "$env:APPDATA\Cursor",
        "$env:APPDATA\cursor",
        "$env:APPDATA\Electron",
        "$env:LOCALAPPDATA\Cursor",
        "$env:LOCALAPPDATA\cursor",
        "$env:LOCALAPPDATA\Electron"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) {
            Remove-Item -Recurse -Force $p
            Write-Ok "Removed $p"
        }
    }
} else {
    Write-Info "Skipped userData (pass -WithUserData to wipe settings/extensions/logs)"
}

Write-Host ""
Write-Ok "Reset complete"
Write-Host ""
Write-Host "Fresh setup:"
Write-Host "  npm run setup:win"
Write-Host "  npm start"
Write-Host ""
