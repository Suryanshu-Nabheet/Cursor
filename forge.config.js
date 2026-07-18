const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const APP_NAME = 'Cursor'
const APP_ID = 'com.suryanshunabheet.cursor'

/**
 * During `npm start`, macOS Dock reads the name from Electron.app's Info.plist
 * (always "Electron" by default). Packaged builds get a real Cursor.app from
 * packagerConfig below. This hook only patches the local Electron binary so
 * Dock / menu bar show "Cursor" while developing.
 */
function brandDevElectron() {
    if (process.platform !== 'darwin') return

    const electronApp = path.join(
        __dirname,
        'node_modules',
        'electron',
        'dist',
        'Electron.app'
    )
    const infoPlist = path.join(electronApp, 'Contents', 'Info.plist')
    if (!fs.existsSync(infoPlist)) return

    for (const [key, value] of [
        ['CFBundleName', APP_NAME],
        ['CFBundleDisplayName', APP_NAME],
        ['CFBundleIdentifier', APP_ID],
    ]) {
        execFileSync('plutil', ['-replace', key, '-string', value, infoPlist])
    }

    const srcIcon = path.join(__dirname, 'assets', 'icon', 'icon.icns')
    const destIcon = path.join(
        electronApp,
        'Contents',
        'Resources',
        'electron.icns'
    )
    if (fs.existsSync(srcIcon)) {
        fs.copyFileSync(srcIcon, destIcon)
    }

    try {
        const lsregister =
            '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister'
        if (fs.existsSync(lsregister)) {
            execFileSync(lsregister, ['-f', electronApp], { stdio: 'ignore' })
        }
    } catch {
        // Dock may need a relaunch: killall Dock
    }
}

module.exports = {
    // Runs before every `electron-forge start`
    hooks: {
        preStart: async () => {
            brandDevElectron()
        },
    },

    // Real Cursor.app / Cursor.exe when you run `npm run package` or `npm run make`
    packagerConfig: {
        name: APP_NAME,
        executableName: 'cursor',
        appBundleId: APP_ID,
        icon: './assets/icon/icon',
        extraResource: [
            './lsp',
            './assets/icon/icon.png',
            './assets/icon/icon.ico',
        ],
        osxSign: {},
        protocols: [
            {
                name: APP_NAME,
                schemes: ['cursor'],
            },
        ],
    },

    rebuildConfig: {},

    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: APP_NAME,
                setupIcon: './assets/icon/icon.ico',
            },
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    name: 'cursor',
                    productName: APP_NAME,
                    genericName: 'Cursor IDE',
                    description:
                        'Cursor IDE — Electron + CodeMirror editor with AI and LSP.',
                    categories: ['Development'],
                    icon: './assets/icon/icon.png',
                    mimeType: ['x-scheme-handler/cursor'],
                },
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                options: {
                    name: 'cursor',
                    productName: APP_NAME,
                    genericName: 'Cursor IDE',
                    description:
                        'Cursor IDE — Electron + CodeMirror editor with AI and LSP.',
                    categories: ['Development'],
                    icon: './assets/icon/icon.png',
                },
            },
        },
    ],

    plugins: [
        {
            name: '@electron-forge/plugin-webpack',
            config: {
                mainConfig: './webpack.main.config.js',
                devContentSecurityPolicy:
                    "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: file: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/index.html',
                            js: './src/index.ts',
                            name: 'main_window',
                            preload: {
                                js: './src/preload.ts',
                            },
                        },
                    ],
                },
            },
        },
    ],
}
