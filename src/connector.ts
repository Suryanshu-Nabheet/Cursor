import type ElectronConnector from './preload'
import { getPlatformInfo } from './platform'

let warnedMissingConnector = false

function createMockConnector(): ElectronConnector {
    const info = getPlatformInfo()
    const noop = () => undefined
    const noopAsync = async () => null

    return new Proxy(info as ElectronConnector, {
        get(target, prop) {
            if (prop in target) {
                return (target as Record<string | symbol, unknown>)[prop]
            }
            if (typeof prop === 'string' && prop.startsWith('register')) {
                return () => undefined
            }
            if (typeof prop === 'string' && prop.startsWith('deregister')) {
                return () => undefined
            }
            return typeof prop === 'string' && prop.endsWith('Async')
                ? noopAsync
                : noop
        },
    })
}

export function getElectronConnector(): ElectronConnector {
    if (typeof window !== 'undefined' && window.connector) {
        return window.connector
    }

    if (!warnedMissingConnector) {
        warnedMissingConnector = true
        console.warn(
            'Electron connector not found. Preload may not have loaded yet — using mock to prevent crash.'
        )
    }

    return createMockConnector()
}

export const connector: ElectronConnector = new Proxy({} as ElectronConnector, {
    get(_target, prop) {
        const liveConnector = getElectronConnector()
        const value = (liveConnector as Record<string | symbol, unknown>)[prop]
        if (typeof value === 'function') {
            return value.bind(liveConnector)
        }
        return value
    },
})
