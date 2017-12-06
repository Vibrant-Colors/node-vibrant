var path = require('path')
var webpack = require("webpack")

var entry = './lib/bundle.js'
var entryWithWorker = './lib/bundle.worker.js'
module.exports = {
    entry: {
        'vibrant': entry,
        'vibrant.min': entry,
        'vibrant.worker': entryWithWorker,
        'vibrant.worker.min': entryWithWorker
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ],
        loaders: [
            // {
            //     test: /\.tsx?$/,
            //     loader: 'ts-loader',
            //     options: {
            //         onlyCompileBundledFiles: true,
            //         configFile: 'tsconfig.browser.json'
            //     }
            // }
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