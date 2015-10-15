var vibrant = require('../lib')
var url = 'http://i.imgur.com/xIPgZNM.jpg'

var v = new vibrant(url)
v.getSwatches(function(e, s) {
  if (e) {
    console.log('test failed')
    console.log(e)
  } else {
    console.log('test passed')
    console.log('swatches:')
    console.log(JSON.stringify(s, null, 2))
  }
})
