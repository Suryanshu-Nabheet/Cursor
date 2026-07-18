# Clean build outputs, logs, and tool caches. Does NOT remove node_modules or LSP servers.
# Usage: .\scripts\clean.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Write-Ok([string]$Message) { Write-Host "OK: $Message" -ForegroundColor Green }
function Write-Info([string]$Message) { Write-Host "INFO: $Message" -ForegroundColor Yellow }

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Cursor — clean" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$removed = 0

function Remove-Target([string]$Path) {
    if (Test-Path $Path) {
        Remove-Item -Recurse -Force $Path
        Write-Ok "Removed $Path"
        $script:removed++
    }
}

Remove-Target ".webpack"
Remove-Target "out"
Remove-Target "dist"
Remove-Target "coverage"
Remove-Target ".nyc_output"
Remove-Target "logs"
Remove-Target ".eslintcache"
Remove-Target ".cache"
Remove-Target "node_modules\.cache"

Get-ChildItem -Path . -Filter "*.log" -File -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Ok "Removed $($_.Name)"
    $script:removed++
}

Write-Host ""
if ($removed -eq 0) {
    Write-Info "Nothing to clean"
} else {
    Write-Ok "Clean finished ($removed items)"
}
Write-Host ""
Write-Host "Next: npm start   |   deeper wipe: npm run reset"
Write-Host ""
