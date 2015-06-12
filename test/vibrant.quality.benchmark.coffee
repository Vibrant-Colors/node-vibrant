Vibrant = require('../')
suits =
  name: 'node-vibrant quality benchmark (colorCount = 64)'
  tests: {}

makeTest = (quality) ->
  test =
    defer: true
    fn: (d) ->
      v = new Vibrant('./examples/3.jpg', {quality: quality})
      v.getSwatches (err, s) ->
        if err? then return d.reject(err)
        d.resolve()


  test

for i in [1..8]
  suits.tests["Quality: #{i}"] = makeTest i

module.exports = suits
