module.exports = [
    // Native .node addons
    {
        test: /native_modules[/\\].+\.node$/,
        use: 'node-loader',
    },
    {
        test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
        parser: { amd: false },
        use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        },
    },
    // JSX (non-TS)
    {
        test: /\.jsx?$/,
        use: {
            loader: 'babel-loader',
            options: {
                exclude: /node_modules/,
                presets: ['@babel/preset-react'],
            },
        },
    },
    // TypeScript / TSX
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|.webpack)/,
        loader: 'ts-loader',
    },
    // Static assets
    {
        test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
        type: 'asset/resource',
    },
]
