module.exports =
class Image
  clear: ->

  update: (imageData) ->

  getWidth: ->

  getHeight: ->

  scaleDown: (opts) ->
    width = @getWidth()
    height = @getHeight()

    ratio = 1
    if opts.maxDimension?
      maxSide = Math.max(width, height)
      if maxSide > opts.maxDimension
        ratio = opts.maxDimension / maxSide
    else
      ratio = 1 / opts.quality

    if ratio < 1
      @resize width * ratio, height * ratio, ratio

  resize: (w, h, r) ->


  getPixelCount: ->

  getImageData: ->

  removeCanvas: ->

module.exports.Node = require('./node')
module.exports.Browser = require('./browser')
