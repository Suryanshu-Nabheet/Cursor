declare global {
    interface Window {
        connector: import('./preload').default
    }

    // Injected at build time via webpack ProvidePlugin (see src/connector.ts).
    const connector: import('./preload').default
}

export {}
