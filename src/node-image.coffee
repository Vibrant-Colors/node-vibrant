Image = require('./image')
Jimp = require('jimp')

class JimpImage extends Image
  constructor: (path, cb) ->
    new Jimp path, (err, image) =>
      if err? then return cb?(err)
      @img = image
      cb?(null, @)

  clear: ->

  update: (imageData) ->

  getPixelCount: ->
    @img.bitmap.width * @img.bitmap.height

  getImageData: ->
    data: @img.bitmap.data

  removeCanvas: ->


module.exports = JimpImage
