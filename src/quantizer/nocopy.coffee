Swatch = require('../swatch')
Quantizer = require('./index')
quantize = require('../../vendor-mod/quantize')

module.exports =
class NoCopyQuantizer extends Quantizer
  initialize: (pixels, @opts) ->
    cmap = quantize pixels, @opts
    @swatches = cmap.vboxes.map (vbox) =>
      new Swatch vbox.color, vbox.vbox.count()

  getQuantizedColors: ->
    @swatches
