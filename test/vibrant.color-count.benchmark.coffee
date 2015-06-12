Vibrant = require('../')
suits =
  name: 'node-vibrant colorCount benchmark (quality = 5)'
  tests: {}

makeTest = (count) ->
  test =
    defer: true
    fn: (d) ->
      v = new Vibrant('./examples/3.jpg', {colorCount: count})
      v.getSwatches (err, s) ->
        if err? then return d.reject(err)
        d.resolve()


  test

for i in [1..8]
  count = Math.pow 2, i
  suits.tests["Color count: #{count}"] = makeTest count

module.exports = suits
