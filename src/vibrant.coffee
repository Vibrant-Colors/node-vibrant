###
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Color algorithm class that finds variations on colors in an image.

  Credits
  --------
  Lokesh Dhakar (http://www.lokeshdhakar.com) - Created ColorThief
  Google - Palette support library in Android
###
Swatch = require('./swatch')
util = require('./util')
DefaultGenerator = require('./generator').Default

module.exports =
class Vibrant
  quantize: require('quantize')

  _swatches: []

  DefaultOpts =
    colorCount: 64
    quality: 5
    generator: new DefaultGenerator()

  constructor: (@sourceImage, opts = {}) ->
    @opts = util.defaults(opts, DefaultOpts)
    @generator = @opts.generator

  getSwatches: (cb) ->
    image = new @constructor.Image @sourceImage, (err, image) =>
      if err? then return cb(err)
      try
        @_process image, @opts
        cb null, @swatches()
      catch error
        return cb(error)


  _process: (image, opts) ->
    imageData = image.getImageData()
    pixels = imageData.data
    pixelCount = image.getPixelCount()

    allPixels = []
    i = 0

    while i < pixelCount
      offset = i * 4
      r = pixels[offset + 0]
      g = pixels[offset + 1]
      b = pixels[offset + 2]
      a = pixels[offset + 3]
      # If pixel is mostly opaque and not white
      if a >= 125
        if not (r > 250 and g > 250 and b > 250)
          allPixels.push [r, g, b]
      i = i + @opts.quality


    cmap = @quantize allPixels, @opts.colorCount
    swatches = cmap.vboxes.map (vbox) =>
      new Swatch vbox.color, vbox.vbox.count()

    @generator.generate(swatches)
    # Clean up
    image.removeCanvas()

  swatches: =>
      Vibrant:      @generator.getVibrantSwatch()
      Muted:        @generator.getMutedSwatch()
      DarkVibrant:  @generator.getDarkVibrantSwatch()
      DarkMuted:    @generator.getDarkMutedSwatch()
      LightVibrant: @generator.getLightVibrantSwatch()
      LightMuted:   @generator.getLightMutedSwatch()
