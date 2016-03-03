module.exports =
  name: "vibrant"
  coffee:
    src: "./src/**/*.coffee"
    dst: "./lib"
    opts:
      "bare": "true"
  mocha:
    src: "./test/**/*.spec.coffee"
    dst: ""
    opts:
      grep: cli.opts['only']
  benchmark:
    src: "./test/**/*.benchmark.coffee"
    dst: ""
  browserify:
    src: ""
    dst: "./dist"
    opts:
      entries: ["./src/bundle.coffee"]
      extensions: ['.js', '.coffee']
      transform: ['coffeeify']
      debug: true#heap.cli.opts.debug
  karma:
    src: ""
    dst: ""
    opts:
      configFile: __dirname + '/karma.conf.coffee'
      singleRun: true
  clean:
    node: ["./lib/"]
    browser: ["./dist/"]
