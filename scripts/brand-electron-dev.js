#!/usr/bin/env node
/**
 * Brand the local Electron binary used by `npm start` / electron-forge.
 *
 * Packaged builds already use forge packagerConfig (name + icon).
 * During development, macOS reads CFBundleName / icon from
 * node_modules/electron/dist/Electron.app — which defaults to "Electron".
 *
 * This script patches that bundle so Dock, menu bar, and Cmd-Tab show "Cursor".
 * Safe to re-run; idempotent.
 */

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const APP_NAME = 'Cursor'
const APP_ID = 'com.suryanshunabheet.cursor'
const ICON_ICNS = path.join(ROOT, 'assets', 'icon', 'icon.icns')
const ICON_ICO = path.join(ROOT, 'assets', 'icon', 'icon.ico')

function exists(p) {
    try {
        fs.accessSync(p)
        return true
    } catch {
        return false
    }
}

function brandMac() {
    const electronApp = path.join(
        ROOT,
        'node_modules',
        'electron',
        'dist',
        'Electron.app'
    )
    const infoPlist = path.join(electronApp, 'Contents', 'Info.plist')
    if (!exists(infoPlist)) {
        console.warn('[brand] Electron.app Info.plist not found — skip macOS brand')
        return false
    }

    const sets = [
        ['CFBundleName', APP_NAME],
        ['CFBundleDisplayName', APP_NAME],
        ['CFBundleIdentifier', APP_ID],
    ]

    for (const [key, value] of sets) {
        execFileSync('/usr/bin/plutil', [
            '-replace',
            key,
            '-string',
            value,
            infoPlist,
        ])
    }

    // Replace the dock/app icon used by the Electron binary in development
    if (exists(ICON_ICNS)) {
        const dest = path.join(
            electronApp,
            'Contents',
            'Resources',
            'electron.icns'
        )
        fs.copyFileSync(ICON_ICNS, dest)
        // Keep CFBundleIconFile pointing at electron.icns (filename unchanged)
    }

    // Helper apps inherit identity from the main process for Dock; still align names
    const frameworks = path.join(electronApp, 'Contents', 'Frameworks')
    if (exists(frameworks)) {
        for (const entry of fs.readdirSync(frameworks)) {
            if (!entry.endsWith('.app')) continue
            const helperPlist = path.join(
                frameworks,
                entry,
                'Contents',
                'Info.plist'
            )
            if (!exists(helperPlist)) continue
            try {
                execFileSync('/usr/bin/plutil', [
                    '-replace',
                    'CFBundleName',
                    '-string',
                    APP_NAME,
                    helperPlist,
                ])
                execFileSync('/usr/bin/plutil', [
                    '-replace',
                    'CFBundleDisplayName',
                    '-string',
                    APP_NAME,
                    helperPlist,
                ])
            } catch {
                // Helpers may omit some keys; ignore
            }
        }
    }

    console.log('[brand] macOS Electron.app branded as Cursor')
    return true
}

function brandWindows() {
    // Dev still launches electron.exe; AppUserModelId is set at runtime.
    // Copy ico next to electron.exe for tools that look for a sibling icon.
    const electronDir = path.join(ROOT, 'node_modules', 'electron', 'dist')
    if (!exists(electronDir) || !exists(ICON_ICO)) return false
    const dest = path.join(electronDir, 'cursor.ico')
    fs.copyFileSync(ICON_ICO, dest)
    console.log('[brand] Windows electron dist icon staged')
    return true
}

function main() {
    if (!exists(path.join(ROOT, 'node_modules', 'electron'))) {
        console.warn('[brand] electron not installed — run npm install first')
        process.exit(0)
    }

    if (process.platform === 'darwin') {
        brandMac()
    } else if (process.platform === 'win32') {
        brandWindows()
    } else {
        console.log('[brand] Linux: packaged builds use forge icons; nothing to patch for npm start')
    }
}

main()
