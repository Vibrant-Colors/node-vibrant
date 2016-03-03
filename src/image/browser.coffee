Image = require('./index')
Url = require('url')

isRelativeUrl = (url) ->
  u = Url.parse(url)

  u.protocol == null && u.host == null && u.port == null

isSameOrigin = (a, b) ->
  ua = Url.parse(a)
  ub = Url.parse(b)

  # https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  ua.protocol == ub.protocol && ua.hostname == ub.hostname && ua.port == ub.port

module.exports =
class BrowserImage extends Image

  constructor: (path, cb) ->
    if typeof path == 'object' and path instanceof HTMLImageElement
      @img = path
      path = @img.src
    else
      @img = document.createElement('img')
      @img.src = path

    if not isRelativeUrl(path) && not isSameOrigin(window.location.href, path)
      @img.crossOrigin = 'anonymous'

    @img.onload = =>
      @_initCanvas()
      cb?(null, @)

    # Alreayd loaded
    if @img.complete
      @img.onload()

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
