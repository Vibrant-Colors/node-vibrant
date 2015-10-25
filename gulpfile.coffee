gulp = require 'gulp'
heap = require 'gulp-heap'
coffee = heap.require('gulp-coffee')
mocha = heap.require('gulp-mocha')
benchmark = heap.require('gulp-bench')
source = heap.require('vinyl-source-stream')
buffer = heap.require('vinyl-buffer')
uglify = heap.require('gulp-uglify')
coffeeify = require('coffeeify')
browserify = heap.convert((opts) -> require('browserify')(opts).transform(coffeeify).bundle()).toTask()


coffeeSource = './src/**/*.coffee'
browserifyEntry = './src/bundle.coffee'
testSource = './test/**/*.spec.coffee'
benchmarkSource = './test/**/*.benchmark.coffee'
dst = './lib/'
dist = './dist/'

browserifyOpts =
  entries: [browserifyEntry]
  extensions: ['.js', '.coffee']
  debug: true#heap.cli.opts.debug

gulp.task 'coffee', coffee(coffeeSource, dst, {bare: true})

gulp.task 'browser',
  browserify(browserifyOpts)
    .then(source('vibrant.js'))
    .then(buffer()).dest(dist)
    .next(uglify())
    .rename('vibrant.min.js')
    .write(dist)

gulp.task 'test', ['coffee'], mocha().source(testSource, {read: false})

gulp.task 'benchmark', ['coffee'], benchmark().source(benchmarkSource, {read: false})

gulp.task 'watch-and-test', ->
  gulp.watch [coffeeSource, testSource], ['test']

gulp.task 'default', ['browser']
