{Server} = require('karma')

gulp.task 'test:browser', (done) ->
  new Server(config.karma.opts, done).start()
