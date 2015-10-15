Image = require('./image')
Jimp = require('jimp')
https = require('https')
http = require('http')

class JimpImage extends Image
  constructor: (path, cb) ->
    if path.indexOf('https') == 0
      https.get path, (r) =>
        buff = new Buffer ''
        r.on 'data', (data) =>
          buff = Buffer.concat [buff, data]
        r.on 'end', () =>
          new Jimp buff, (err, image) =>
            if err? then return cb?(err)
            @img = image
            cb?(null, @)
    else if path.indexOf('http') == 0
      http.get path, (r) =>
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
