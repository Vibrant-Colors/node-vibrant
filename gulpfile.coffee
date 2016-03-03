GLOBAL.gulp = require('gulp')
GLOBAL.heap = require('gulp-heap')
GLOBAL.cli = heap.cli
GLOBAL.config = require('./gulpconfig')

require('./gulp-task/coffee')
require('./gulp-task/mocha')
require('./gulp-task/benchmark')
require('./gulp-task/browserify')
require('./gulp-task/karma')
require('./gulp-task/clean')

gulp.task 'watch-and-test', ->
  gulp.watch [coffeeSource, testSource], ['test']

gulp.task 'default', ['coffee', 'browser']
