{Server} = require('karma')

gulp.task 'browser-test', (done) ->
  new Server(config.karma.opts, done).start()
