// This webpack config requires this to run:
require("tsconfig-paths/register");

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

import { SampleManager } from "./manager";

const SAMPLE_FOLDER = path.join(__dirname, "./images");

const manager = new SampleManager(SAMPLE_FOLDER);

const tsconfigFilePath = path.join(__dirname, "tsconfig.json");
module.exports = manager.getContext().then((context) => {
  return {
    entry: {
      main: "./index.tsx",
    },
    mode: "development",
    devtool: "inline-module-source-map",
    module: {
      rules: [
        {
          test: /\.worker.ts$/,
          loader: "worker-loader",
        },
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: tsconfigFilePath,
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsconfigFilePath,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunks: ["main"],
        template: "index.html",
        title: "node-vibrant sample viewer",
      }),
      new webpack.DefinePlugin({
        CONTEXT: JSON.stringify(context),
      }),
    ],
    devServer: {
      contentBase: path.resolve("images"),
      after: manager.buildMiddleware(),
    },
  };
});
