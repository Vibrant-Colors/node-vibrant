Swatch = require('../swatch')
Quantizer = require('./index')
MMCQImpl = require('./impl/mmcq')

module.exports =
class MMCQ extends Quantizer
  initialize: (pixels, @opts) ->
    mmcq = new MMCQImpl()
    @swatches = mmcq.quantize pixels, @opts

  getQuantizedColors: ->
    @swatches
