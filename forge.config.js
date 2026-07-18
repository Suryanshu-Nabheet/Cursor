module.exports = {
    packagerConfig: {
        name: 'Cursor',
        executableName: 'cursor',
        appBundleId: 'com.suryanshunabheet.cursor',
        icon: './assets/icon/icon',
        extraResource: ['./lsp', './assets/icon/icon.png', './assets/icon/icon.ico'],
        osxSign: {},
        protocols: [
            {
                name: 'Cursor',
                schemes: ['cursor'],
            },
        ],
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'Cursor',
                setupIcon: './assets/icon/icon.ico',
                iconUrl:
                    'https://raw.githubusercontent.com/Suryanshu-Nabheet/cursor/main/assets/icon/icon.ico',
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
                    productName: 'Cursor',
                    genericName: 'Cursor IDE',
                    description:
                        'A lightweight, from-scratch Electron IDE powered by CodeMirror.',
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
                    productName: 'Cursor',
                    genericName: 'Cursor IDE',
                    description:
                        'A lightweight, from-scratch Electron IDE powered by CodeMirror.',
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
