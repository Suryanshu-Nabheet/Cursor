export function getPlatformInfo(): {
    PLATFORM_DELIMITER: string
    PLATFORM_META_KEY: string
    PLATFORM_CM_KEY: string
    IS_WINDOWS: boolean
} {
    if (process.platform === 'win32') {
        return {
            PLATFORM_DELIMITER: '\\',
            PLATFORM_META_KEY: 'Ctrl+',
            PLATFORM_CM_KEY: 'Ctrl',
            IS_WINDOWS: true,
        }
    }

    if (process.platform === 'darwin') {
        return {
            PLATFORM_DELIMITER: '/',
            PLATFORM_META_KEY: '⌘',
            PLATFORM_CM_KEY: 'Cmd',
            IS_WINDOWS: false,
        }
    }

    return {
        PLATFORM_DELIMITER: '/',
        PLATFORM_META_KEY: 'Ctrl+',
        PLATFORM_CM_KEY: 'Ctrl',
        IS_WINDOWS: false,
    }
}
