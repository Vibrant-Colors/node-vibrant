Swatch = require('../swatch')
Quantizer = require('./index')
quantize = require('quantize')

module.exports =
class BaselineQuantizer extends Quantizer
  initialize: (pixels, @opts) ->
    pixelCount = pixels.length / 4

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


    cmap = quantize allPixels, @opts.colorCount
    @swatches = cmap.vboxes.map (vbox) =>
      new Swatch vbox.color, vbox.vbox.count()

  getQuantizedColors: ->
    @swatches
