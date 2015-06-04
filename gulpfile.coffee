gulp = require 'gulp'
heap = require 'gulp-heap'
coffee = heap.require('gulp-coffee')
mocha = heap.require('gulp-mocha')

gulp.task 'coffee', coffee('./src/**/*.coffee', './lib/', {bare: true})

gulp.task 'test', mocha('./test/**/*.spec.coffee', null)

gulp.task 'default', ['coffee']
