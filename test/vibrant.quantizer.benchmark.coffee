Vibrant = require('../')
suits =
  name: 'node-vibrant quantizer benchmark'
  tests: {}

makeTest = (Q) ->
  test =
    defer: true
    fn: (d) ->
      Vibrant.from('./examples/3.jpg')
        # Quantzier should not handle downsampling, unlike Baseline does
        # Before downsampling feature is added, set quality to 1
        # Make sure it's a fair game
        .quality(1)
        .useQuantizer(Q)
        # .addFilter(Vibrant.Filter.Default)
        .getPalette (err, s) ->
          if err? then return d.reject(err)
          d.resolve()


  test

suits.tests["Quantizer: Baseline"] = makeTest require('../lib/quantizer/baseline')
suits.tests["Quantizer: MMCQ"] = makeTest require('../lib/quantizer/mmcq')

module.exports = suits
