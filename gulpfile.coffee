gulp = require 'gulp'
heap = require 'gulp-heap'
coffee = heap.require('gulp-coffee')
mocha = heap.require('gulp-mocha')
benchmark = heap.require('gulp-bench')

coffeeSource = './src/**/*.coffee'
testSource = './test/**/*.spec.coffee'
benchmarkSource = './test/**/*.benchmark.coffee'
dst = './lib/'

gulp.task 'coffee', coffee(coffeeSource, dst, {bare: true})

gulp.task 'test', mocha().source(testSource, {read: false})

gulp.task 'benchmark', benchmark().source(benchmarkSource, {read: false})

gulp.task 'watch-and-test', ->
  gulp.watch [coffeeSource, testSource], ['test']

gulp.task 'default', ['coffee']
