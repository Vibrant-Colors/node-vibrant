source = heap.require('vinyl-source-stream')
buffer = heap.require('vinyl-buffer')
uglify = heap.require('gulp-uglify')
browserify = heap.convert((opts) ->
  require('browserify')(opts).bundle()).toTask()

gulp.task 'browser',
  browserify(config.browserify.opts)
    .then(source("#{config.name}.js"))
    .then(buffer()).dest(config.browserify.dst)
    .next(uglify())
    .rename("#{config.name}.min.js")
    .write(config.browserify.dst)
