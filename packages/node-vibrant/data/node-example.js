var vibrant = require('../lib')
var url = 'http://i.imgur.com/xIPgZNM.jpg'
var localImage = './1.jpg'

var v = new vibrant(url)
v.getSwatches(function(e, s) {
  if (e) {
    console.log(e)
  } else {
    console.log('swatches for remote url:')
    console.log(JSON.stringify(s, null, 2))
  }
})

var v2 = new vibrant(localImage)
v2.getSwatches(function(e, s) {
  if (e) {
    console.log(e)
  } else {
    console.log('swatches for local file:')
    console.log(JSON.stringify(s, null, 2))
  }
})
