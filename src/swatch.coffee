util = require('./util')
###
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Swatch class
###
module.exports =
class Swatch
  hsl: undefined
  rgb: undefined
  population: 1
  @yiq: 0

  constructor: (rgb, population) ->
    @rgb = rgb
    @population = population

  getHsl: ->
    if not @hsl
      @hsl = util.rgbToHsl @rgb[0], @rgb[1], @rgb[2]
    else @hsl

  getPopulation: ->
    @population

  getRgb: ->
    @rgb

  getHex: ->
    "#" + ((1 << 24) + (@rgb[0] << 16) + (@rgb[1] << 8) + @rgb[2]).toString(16).slice(1, 7);

  getTitleTextColor: ->
    @_ensureTextColors()
    if @yiq < 200 then "#fff" else "#000"

  getBodyTextColor: ->
    @_ensureTextColors()
    if @yiq < 150 then "#fff" else "#000"

  _ensureTextColors: ->
    if not @yiq then @yiq = (@rgb[0] * 299 + @rgb[1] * 587 + @rgb[2] * 114) / 1000
