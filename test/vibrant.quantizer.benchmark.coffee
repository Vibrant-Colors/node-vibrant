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
        .getPalette (err, s) ->
          if err? then return d.reject(err)
          d.resolve()


  test

['Baseline', 'ColorCut'].forEach (n) ->
  suits.tests["Quantizer: #{n}"] = makeTest require('../lib/quantizer')[n]

module.exports = suits
