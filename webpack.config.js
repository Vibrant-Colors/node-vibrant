var path = require('path')
var webpack = require("webpack")

var entry = './src/bundle.ts'
module.exports = {
    entry: {
        'vibrant': entry,
        'vibrant.min': entry
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFileName: 'tsconfig.browser.json'
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
}