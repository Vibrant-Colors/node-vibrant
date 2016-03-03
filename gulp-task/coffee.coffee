coffee = heap.require('gulp-coffee')

gulp.task 'coffee', ->
  coffee(config.coffee.src, config.coffee.dst, config.coffee.opts)()
