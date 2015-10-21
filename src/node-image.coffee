Image = require('./image')
Jimp = require('jimp')

URL_REGEX = /^(\w+):\/\/.*/i

ProtocolHandler =
  http:   require('http')
  https:  require('https')

class JimpImage extends Image
  constructor: (path, cb) ->
    m = URL_REGEX.exec path
    if m
      protocol = m[1].toLowerCase()
      handler = ProtocolHandler[protocol]
      if not handler?
        throw new Error("Unsupported protocol: '#{protocol}'")

      handler.get path, (r) =>
        buff = new Buffer ''
        r.on 'data', (data) =>
          buff = Buffer.concat [buff, data]
        r.on 'end', () =>
          new Jimp buff, (err, image) =>
            if err? then return cb?(err)
            @img = image
            cb?(null, @)
            
    else
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
