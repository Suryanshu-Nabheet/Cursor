import fs from 'fs'
import path from 'path'
import { app, nativeImage } from 'electron'
import log from 'electron-log'

/**
 * Resolve the app icon for BrowserWindow and macOS dock.
 * Packaged builds embed icons via forge packagerConfig; this also
 * resolves assets during local `electron-forge start`.
 */
export function resolveAppIconPath(): string {
    const fileName = process.platform === 'win32' ? 'icon.ico' : 'icon.png'

    const candidates = [
        // Packaged: forge extraResource copies icon.png / icon.ico here
        app.isPackaged ? path.join(process.resourcesPath, fileName) : null,
        // Dev: forge webpack main compiles to `.webpack/main`
        path.resolve(__dirname, '../../assets/icon', fileName),
        path.join(app.getAppPath(), 'assets', 'icon', fileName),
        path.resolve(process.cwd(), 'assets', 'icon', fileName),
    ].filter((p): p is string => Boolean(p))

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate
        }
    }

    log.warn('App icon not found. Tried:', candidates)
    return candidates[0]
}

export function loadAppIconImage() {
    const iconPath = resolveAppIconPath()
    const image = nativeImage.createFromPath(iconPath)
    if (image.isEmpty()) {
        log.warn('Failed to load app icon from', iconPath)
        return null
    }
    return image
}
