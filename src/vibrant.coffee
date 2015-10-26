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
Filter = require('./filter')

module.exports =
class Vibrant
  @DefaultOpts:
    colorCount: 64
    quality: 5
    generator: new DefaultGenerator()
    Image: null
    Quantizer: require('./quantizer').NoCopy
    filters: [Filter.Default]

  @from: (src) ->
    new Builder(src)

  quantize: require('quantize')

  _swatches: []

  constructor: (@sourceImage, opts = {}) ->
    @opts = util.defaults(opts, @constructor.DefaultOpts)
    @generator = @opts.generator

  getPalette: (cb) ->
    image = new @opts.Image @sourceImage, (err, image) =>
      if err? then return cb(err)
      try
        @_process image, @opts
        cb null, @swatches()
      catch error
        return cb(error)

  getSwatches: (cb) ->
    @getPalette cb

  _process: (image, opts) ->
    image.scaleDown(@opts)
    imageData = image.getImageData()

    quantizer = new @opts.Quantizer()
    quantizer.initialize(imageData.data, @opts)

    swatches = quantizer.getQuantizedColors()

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

module.exports.Builder =
class Builder
  constructor: (@src, @opts = {}) ->
    @opts.filters = util.clone Vibrant.DefaultOpts.filters

  maxColorCount: (n) ->
    @opts.colorCount = n
    @

  maxDimension: (d) ->
    @opts.maxDimension = d
    @

  addFilter: (f) ->
    if typeof f == 'function'
      @opts.filters.push f
    @

  removeFilter: (f) ->
    if (i = @opts.filters.indexOf(f)) > 0
      @opts.filters.splice(i)
    @

  clearFilters: ->
    @opts.filters = []
    @

  quality: (q) ->
    @opts.quality = q
    @

  useImage: (image) ->
    @opts.Image = image
    @

  useGenerator: (generator) ->
    @opts.generator = generator
    @

  useQuantizer: (quantizer) ->
    @opts.Quantizer = quantizer
    @

  build: ->
    if not @v?
      @v = new Vibrant(@src, @opts)
    @v

  getPalette: (cb) ->
    @build().getPalette cb

  from: (src) ->
    new Vibrant(src, @opts)
