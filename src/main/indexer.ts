import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron'

import { fileSystem } from './fileSystem'

/**
 * Local project file watcher only.
 * Remote codebase upload / AI index backends were removed (BYOK app).
 */
export class CodebaseIndexer {
    private haveStartedWatcher = false

    constructor(public rootDir: string, private win: BrowserWindow) {}

    isInBadDir(itemPath: string) {
        return (
            (itemPath.includes('node_modules') || itemPath.includes('.git')) &&
            !(itemPath.endsWith('.git') || itemPath.endsWith('node_modules'))
        )
    }

    startWatcher() {
        if (this.haveStartedWatcher) return
        this.haveStartedWatcher = true

        const rootDir = this.rootDir
        fileSystem.startWatcher(
            rootDir,
            (watchPath: string) => {
                return this.isInBadDir(watchPath)
            },
            {
                add: async (watchPath: string) => {
                    if (this.isInBadDir(watchPath)) return
                    this.win.webContents.send('fileWasAdded', watchPath)
                },
                addDir: async (watchPath: string) => {
                    if (this.isInBadDir(watchPath)) return
                    this.win.webContents.send('folderWasAdded', watchPath)
                },
                change: async (watchPath: string) => {
                    if (this.isInBadDir(watchPath)) return
                    this.win.webContents.send('fileWasUpdated', watchPath)
                },
                unlink: async (watchPath: string) => {
                    if (this.isInBadDir(watchPath)) return
                    this.win.webContents.send('fileWasDeleted', watchPath)
                },
                unlinkDir: async (watchPath: string) => {
                    if (this.isInBadDir(watchPath)) return
                    this.win.webContents.send('folderWasDeleted', watchPath)
                },
            }
        )
    }
}

export function setupIndex(win: BrowserWindow) {
    ipcMain.handle(
        'syncProject',
        async function (_event: IpcMainInvokeEvent, rootDir: string) {
            const indexer = new CodebaseIndexer(rootDir, win)
            indexer.startWatcher()
        }
    )

    ipcMain.handle(
        'indexProject',
        async function (_event: IpcMainInvokeEvent, rootDir: string) {
            const indexer = new CodebaseIndexer(rootDir, win)
            indexer.startWatcher()
            return 'local'
        }
    )

    ipcMain.handle(
        'initProject',
        async function (_event: IpcMainInvokeEvent, _rootDir: string) {
            return 'local'
        }
    )
}
