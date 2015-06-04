Image = require('./image')
###
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  (Browser enviroment code. Not used. For reference)

  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
  Stolen from https://github.com/lokesh/color-thief
###
module.exports =
class CanvasImage extends Image
  constructor: (image) ->
    @canvas = document.createElement('canvas')
    @context = @canvas.getContext('2d')
    document.body.appendChild @canvas
    @width = @canvas.width = image.width
    @height = @canvas.height = image.height
    @context.drawImage image, 0, 0, @width, @height

  clear: ->
    @context.clearRect 0, 0, @width, @height

  update: (imageData) ->
    @context.putImageData imageData, 0, 0

  getPixelCount: ->
    @width * @height

  getImageData: ->
    @context.getImageData 0, 0, @width, @height

  removeCanvas: ->
    @canvas.parentNode.removeChild @canvas
