benchmark = heap.require('gulp-bench')

gulp.task 'benchmark', benchmark().source(config.benchmark.src, {read: false})
