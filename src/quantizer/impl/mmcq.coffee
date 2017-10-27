# SIGBITS = 5
# RSHIFT = 8 - SIGBITS
#
# getColorIndex = (r, g, b) ->
#   (r<<(2*SIGBITS)) + (g << SIGBITS) + b

{getColorIndex, SIGBITS, RSHIFT} = util = require('../../util')
Swatch = require('../../swatch')
VBox = require('./vbox')
PQueue = require('./pqueue')

module.exports =
class MMCQ
  @DefaultOpts:
    maxIterations: 1000
    fractByPopulations: 0.75

  constructor: (opts) ->
    @opts = util.defaults opts, @constructor.DefaultOpts
  quantize: (pixels, opts) ->
    if pixels.length == 0 or opts.colorCount < 2 or opts.colorCount > 256
      throw new Error("Wrong MMCQ parameters")

    shouldIgnore = -> false

    if Array.isArray(opts.filters) and opts.filters.length > 0
      shouldIgnore = (r, g, b, a) ->
        for f in opts.filters
          if not f(r, g, b, a) then return true
        return false


    vbox = VBox.build(pixels, shouldIgnore)
    hist = vbox.hist
    colorCount = Object.keys(hist).length
    pq = new PQueue (a, b) -> a.count() - b.count()

    pq.push(vbox)

    # first set of colors, sorted by population
    @_splitBoxes(pq, @opts.fractByPopulations * opts.colorCount)

    # Re-order
    pq2 = new PQueue (a, b) -> a.count() * a.volume() - b.count() * b.volume()
    pq2.contents = pq.contents

    # next set - generate the median cuts using the (npix * vol) sorting.
    @_splitBoxes(pq2, opts.colorCount - pq2.size())

    # calculate the actual colors
    swatches = []
    @vboxes = []
    while pq2.size()
      v = pq2.pop()
      color = v.avg()
      if not shouldIgnore?(color[0], color[1], color[2], 255)
        @vboxes.push v
        swatches.push new Swatch color, v.count()

    swatches

  _splitBoxes: (pq, target) ->
    colorCount = 1
    iteration = 0
    maxIterations = @opts.maxIterations
    while iteration < maxIterations
      iteration++
      vbox = pq.pop()
      if !vbox || !vbox.count()
        continue

      [vbox1, vbox2] = vbox.split()

      pq.push(vbox1)
      if vbox2
        pq.push(vbox2)
        colorCount++
      if colorCount >= target or iteration > maxIterations
        return
