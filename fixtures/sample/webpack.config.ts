const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
import { promisify, map } from 'bluebird'

import { readdir } from 'fs'

import Vibrant = require('../../src')

const readdirAsync = promisify(readdir)

async function listSampleFiles() {
  return (<string[]>await readdirAsync('./images'))
    .filter(f => /.jpg/i.test(f))
}

function prepareSamples() {
  return map(listSampleFiles(), (name: string) =>
    Vibrant.from(path.join(__dirname, 'images', name))
      .quality(1)
      .getPalette()
      .then(nodePalette => ({ name, nodePalette }))
  )
}

module.exports = prepareSamples()
  .then(samples => {
    return {
      entry: {
        main: './index.tsx'
      },
      mode: 'development',
      devtool: 'inline-module-source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
              }
            ]
          }
        ]
      },
      resolve: {
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.css'
        ],
        plugins: [
          new TsconfigPathsPlugin()
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          chunks: ['main'],
          template: 'index.html',
          title: 'node-vibrant sample viewer'
        }),
        new webpack.DefinePlugin({
          CONTEXT: JSON.stringify({
            samples
          })
        })
      ],
      devServer: {
        contentBase: path.resolve('images')
      }
    }
  })