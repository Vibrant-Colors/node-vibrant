Swatch = require('../swatch')
Quantizer = require('./index')
ColorCut = require('./impl/color-cut')

module.exports =
class ColorCutQuantizer extends Quantizer
  initialize: (pixels, @opts) ->
    buf = new ArrayBuffer(pixels.length)
    buf8 = new Uint8ClampedArray(buf)
    data = new Uint32Array(buf)
    buf8.set(pixels)

    @quantizer = new ColorCut(data, @opts)


  getQuantizedColors: ->
    @quantizer.getQuantizedColors()
