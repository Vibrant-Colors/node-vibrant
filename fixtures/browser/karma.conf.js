const path = require('path');

module.exports = function (config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['detectBrowsers', 'mocha', 'chai'],

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-detect-browsers',
      'karma-mocha-reporter'
    ],

    browserNoActivityTimeout: 30000,

    detectBrowsers: {
      usePhantomJS: false,
      postDetection: function (browserList) {
        let results = [];

        if (browserList.indexOf('Chrome') > -1) {
          results.push('Chrome');
        }

        if (browserList.indexOf('Firefox') > -1) {
          results.push('Firefox');
        }

        return results;
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'src/test/index.browser-spec.ts',
      { pattern: 'fixtures/sample/images/**/*.jpg', watched: false, included: false, served: true }
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/index.browser-spec.ts': ['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,



    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    webpackMiddleware: {
    },
    webpack: {
      devtool: 'none',
      mode: 'none',
      optimization: {
        splitChunks: false,
        runtimeChunk: false,
        minimize: false
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|tsx|ts)$/,
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, '../../tsconfig.browser.json')
            },
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.ts']
      },
    }
  }

  config.set(configuration)
}
