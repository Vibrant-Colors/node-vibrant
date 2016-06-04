Swatch = require('../swatch')
util = require('../util')
Generator = require('./index')

DefaultOpts =
  targetDarkLuma: 0.26
  maxDarkLuma: 0.45
  minLightLuma: 0.55
  targetLightLuma: 0.74
  minNormalLuma: 0.3
  targetNormalLuma: 0.5
  maxNormalLuma: 0.7
  targetMutesSaturation: 0.3
  maxMutesSaturation: 0.4
  targetVibrantSaturation: 1.0
  minVibrantSaturation: 0.35
  weightSaturation: 3
  weightLuma: 6
  weightPopulation: 1

module.exports =
class DefaultGenerator extends Generator
  HighestPopulation: 0
  constructor: (opts) ->
    @opts = util.defaults(opts, DefaultOpts)
    @VibrantSwatch = null
    @LightVibrantSwatch = null
    @DarkVibrantSwatch = null
    @MutedSwatch = null
    @LightMutedSwatch = null
    @DarkMutedSwatch = null

  generate: (@swatches) ->
    @maxPopulation = @findMaxPopulation

    @generateVarationColors()
    @generateEmptySwatches()

  getVibrantSwatch: ->
    @VibrantSwatch

  getLightVibrantSwatch: ->
    @LightVibrantSwatch

  getDarkVibrantSwatch: ->
    @DarkVibrantSwatch

  getMutedSwatch: ->
    @MutedSwatch

  getLightMutedSwatch: ->
    @LightMutedSwatch

  getDarkMutedSwatch: ->
    @DarkMutedSwatch

  generateVarationColors: ->
    @VibrantSwatch = @findColorVariation(@opts.targetNormalLuma, @opts.minNormalLuma, @opts.maxNormalLuma,
      @opts.targetVibrantSaturation, @opts.minVibrantSaturation, 1);

    @LightVibrantSwatch = @findColorVariation(@opts.targetLightLuma, @opts.minLightLuma, 1,
      @opts.targetVibrantSaturation, @opts.minVibrantSaturation, 1);

    @DarkVibrantSwatch = @findColorVariation(@opts.targetDarkLuma, 0, @opts.maxDarkLuma,
      @opts.targetVibrantSaturation, @opts.minVibrantSaturation, 1);

    @MutedSwatch = @findColorVariation(@opts.targetNormalLuma, @opts.minNormalLuma, @opts.maxNormalLuma,
      @opts.targetMutesSaturation, 0, @opts.maxMutesSaturation);

    @LightMutedSwatch = @findColorVariation(@opts.targetLightLuma, @opts.minLightLuma, 1,
      @opts.targetMutesSaturation, 0, @opts.maxMutesSaturation);

    @DarkMutedSwatch = @findColorVariation(@opts.targetDarkLuma, 0, @opts.maxDarkLuma,
      @opts.targetMutesSaturation, 0, @opts.maxMutesSaturation);

  generateEmptySwatches: ->
    if @VibrantSwatch is null
      # If we do not have a vibrant color...
      if @DarkVibrantSwatch isnt null
        # ...but we do have a dark vibrant, generate the value by modifying the luma
        hsl = @DarkVibrantSwatch.getHsl()
        hsl[2] = @opts.targetNormalLuma
        @VibrantSwatch = new Swatch util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0

    if @DarkVibrantSwatch is null
      # If we do not have a vibrant color...
      if @VibrantSwatch isnt null
        # ...but we do have a dark vibrant, generate the value by modifying the luma
        hsl = @VibrantSwatch.getHsl()
        hsl[2] = @opts.targetDarkLuma
        @DarkVibrantSwatch = new Swatch util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0

  findMaxPopulation: ->
    population = 0
    population = Math.max(population, swatch.getPopulation()) for swatch in @swatches
    population

  findColorVariation: (targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) ->
    max = null
    maxValue = 0

    for swatch in @swatches
      sat = swatch.getHsl()[1];
      luma = swatch.getHsl()[2]

      if sat >= minSaturation and sat <= maxSaturation and
        luma >= minLuma and luma <= maxLuma and
        not @isAlreadySelected(swatch)
          value = @createComparisonValue sat, targetSaturation, luma, targetLuma,
            swatch.getPopulation(), @HighestPopulation
          if max is null or value > maxValue
            max = swatch
            maxValue = value

    max

  createComparisonValue: (saturation, targetSaturation,
      luma, targetLuma, population, maxPopulation) ->
    @weightedMean(
      @invertDiff(saturation, targetSaturation), @opts.weightSaturation,
      @invertDiff(luma, targetLuma), @opts.weightLuma,
      population / maxPopulation, @opts.weightPopulation
    )

  invertDiff: (value, targetValue) ->
    1 - Math.abs value - targetValue

  weightedMean: (values...) ->
    sum = 0
    sumWeight = 0
    i = 0
    while i < values.length
      value = values[i]
      weight = values[i + 1]
      sum += value * weight
      sumWeight += weight
      i += 2
    sum / sumWeight

  isAlreadySelected: (swatch) ->
    @VibrantSwatch is swatch or @DarkVibrantSwatch is swatch or
      @LightVibrantSwatch is swatch or @MutedSwatch is swatch or
      @DarkMutedSwatch is swatch or @LightMutedSwatch is swatch
