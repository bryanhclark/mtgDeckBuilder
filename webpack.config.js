'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {
    resolve
} = require('path')

module.exports = {
    entry: './app/main',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    context: __dirname,
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /jsx?$/,
                include: resolve(__dirname, './app'),
                use: [{
                    loader: 'babel-loader',
                    query: { presets: ['react', 'es2015', "stage-2"] }
                }]
            },
            {
                test: /(\.global\.css$|react-select.css)/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /^((?!\.global|react-select).)*\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                ]
            }]
    }
}
