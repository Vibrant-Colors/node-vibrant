const path = require('path')
const webpack = require("webpack")

const entry = './src/bundle.ts'
const entryWithWorker = './src/bundle-worker.ts'
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const tsconfigFilePath = path.join(__dirname, 'tsconfig.browser.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env) => {
  const config = {
    plugins: [],
    entry: {
      'vibrant': entry,
      'vibrant.min': entry,
      'vibrant.worker': entryWithWorker,
      'vibrant.worker.min': entryWithWorker
    },
    devtool: "source-map",
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsconfigFilePath
        })
      ]
    },
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          include: /\.min\.js$/
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.worker.ts$/,
          loader: 'worker-loader',
          options: { inline: true }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            configFile: tsconfigFilePath
          }
        }
      ]
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      library: 'Vibrant',
      libraryTarget: 'umd'
    }
  }

  if (env && env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin())
  }

  return config
}
