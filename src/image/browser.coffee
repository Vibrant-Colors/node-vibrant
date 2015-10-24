Image = require('./index')
module.exports =
class BrowserImage extends Image
  constructor: (path, cb) ->
    @img = document.createElement('img')
    @img.crossOrigin = 'anonymous'
    @img.src = path

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

  clear: ->
    @context.clearRect 0, 0, @width, @height

  getWidth: ->
    @width

  getHeight: ->
    @height

  resize: (w, h, r) ->
    @width = @canvas.width = w
    @height = @canvas.height = h
    @context.scale(r, r)
    @context.drawImage @img, 0, 0

  update: (imageData) ->
    @context.putImageData imageData, 0, 0

  getPixelCount: ->
    @width * @height

  getImageData: ->
    @context.getImageData 0, 0, @width, @height

  removeCanvas: ->
    @canvas.parentNode.removeChild @canvas
