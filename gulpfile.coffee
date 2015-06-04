gulp = require 'gulp'
heap = require 'gulp-heap'
coffee = heap.require('gulp-coffee')
mocha = heap.require('gulp-mocha')

coffeeSource = './src/**/*.coffee'
testSource = './test/**/*.spec.coffee'
dst = './lib/'

gulp.task 'coffee', coffee(coffeeSource, dst, {bare: true})

gulp.task 'test', mocha(testSource, null)

gulp.task 'watch-and-test', ->
  gulp.watch [coffeeSource, testSource], ['test']

gulp.task 'default', ['coffee']
