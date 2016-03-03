del = require('del')

gulp.task 'clean', ->
  del config.clean.node

gulp.task 'clean:browser', ->
  del config.clean.browser
