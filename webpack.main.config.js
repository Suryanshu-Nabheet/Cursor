module.exports = {
    // Electron main process entry
    entry: './src/main/index.ts',
    module: {
        rules: require('./webpack.rules'),
    },
    // Keep native PTY module outside the bundle
    externals: 'node-pty',
    cache: {
        type: 'filesystem',
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
}
