mocha = heap.require('gulp-mocha')

gulp.task 'test', mocha(config.mocha.opts).source(config.mocha.src, {read: false})
