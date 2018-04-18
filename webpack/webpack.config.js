const path = require('path');

const PATHS = {
  root: path.resolve(__dirname, ".."),
  nodeModules: path.resolve(__dirname, "../node_modules"),
  src: path.resolve(__dirname, "../src"),
  dist: path.resolve(__dirname, "../build/dist")
}

module.exports = {
    // mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: PATHS.dist,
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: ['src', 'node_modules']
    },
    devServer: {
        contentBase: PATHS.dist,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: PATHS.src,
                loader: 'ts-loader'
            },
            {
                test: /\.(css)$/,
                include: PATHS.src,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    }
};