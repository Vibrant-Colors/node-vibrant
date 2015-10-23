module.exports =
class Image
  clear: ->

  update: (imageData) ->

  getPixelCount: ->

  getImageData: ->

  removeCanvas: ->

[
  'Node'
  'Browser'
].forEach (n) ->
  module.exports[n] = require("./#{n.toLowerCase()}")
