gulp = require 'gulp'
heap = require 'gulp-heap'
coffee = heap.require('gulp-coffee')

gulp.task 'coffee', coffee('./src/**/*.coffee', './lib/', {bare: true})

gulp.task 'default', ['coffee']
