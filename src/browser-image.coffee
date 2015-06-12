Image = require('./image')
module.exports =
class BrowserImage extends Image
  constructor: (path, cb) ->
    @img = document.createElement('img')
    @img.src= path

    @img.onload = =>
      @_initCanvas()
      cb?(null, @)

    @img.onerror = (e) =>
      err = new Error("Fail to load image: " + path);
      err.raw = e;
      cb?(err)

  _initCanvas: ->
    @canvas = document.createElement('canvas')
    @context = @canvas.getContext('2d')
    document.body.appendChild @canvas
    @width = @canvas.width = @img.width
    @height = @canvas.height = @img.height
    @context.drawImage @img, 0, 0, @width, @height
    console.log @width, @height

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
