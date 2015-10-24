PriorityQueue = require('js-priority-queue')
Swatch = require('../../swatch')

sort = (arr, lower, upper) ->
  swap = (a, b) ->
    t = arr[a]
    arr[a] = arr[b]
    arr[b] = t

  partition = (pivot, left, right) ->
    index = left
    value = arr[pivot]

    swap(pivot, right)

    for v in [left..right - 1]
      if arr[v] > value
        swap(v, index)
        index++

    swap(right, index)

    index

  if lower < upper
    pivot = lower + Math.ceil((upper - lower) / 2)
    pivot = partition(pivot, lower, upper)

    sort(arr, lower, pivot - 1)
    sort(arr, pivot + 1, upper)


COMPONENT_RED     = -3
COMPONENT_GREEN   = -2
COMPONENT_BLUE    = -1

QUANTIZE_WORD_WIDTH = 5
QUANTIZE_WORD_MASK  = (1 << QUANTIZE_WORD_WIDTH) - 1

# 32bit color order on big-endian machine
RGBAColor =
  red: (c) ->
    c>>24
  green: (c) ->
    c<<8>>24
  blue: (c) ->
    c<<16>>24
  alpha: (c) ->
    c<<24>>24

# 32bit color order on little-endian machine
ABGRColor =
  red: (c) ->
    c<<24>>24
  green: (c) ->
    c<<16>>24
  blue: (c) ->
    c<<8>>24
  alpha: (c) ->
    c>>24

isLittleEndian = ->
  a = new ArrayBuffer(4)
  b = new Uint8Array(a)
  c = new Uint32Array(a)
  b[0] = 0xa1
  b[1] = 0xb2
  b[2] = 0xc3
  b[3] = 0xd4
  if c[0] == 0xd4c3b2a1 then return true
  if c[0] == 0xa1b2c3d4 then return false
  throw new Error("Failed to determin endianness")

Color = if isLittleEndian() then ABGRColor else RGBAColor

modifyWordWidth = (value, current, target) ->
  newValue = 0
  if target > current
    newValue = value << (target - current)
  else
    newValue = value >> (current - target)

  newValue & ((1<<target) - 1)

modifySignificantOctet = (a, dimension, lower, upper) ->
  switch dimension
    when COMPONENT_RED
      break
    when COMPONENT_GREEN
      # RGB -> GRB
      for i in [lower..upper]
        color = a[i]
        a[i] = quantizedGreen(color) << (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) \
          | quantizedRed(color) << QUANTIZE_WORD_WIDTH \
          | quantizedBlue(color)
      break
    when COMPONENT_BLUE
      # RGB -> BGR
      for i in [lower..upper]
        color = a[i]
        a[i] = quantizedBlue(color) << (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) \
          | quantizedGreen(color) << QUANTIZE_WORD_WIDTH \
          | quantizedRed(color)
      break

# Platform dependent
quantizeFromRgb888 = (color) ->
  r = modifyWordWidth Color.red(color), 8, QUANTIZE_WORD_WIDTH
  g = modifyWordWidth Color.green(color), 8, QUANTIZE_WORD_WIDTH
  b = modifyWordWidth Color.blue(color), 8, QUANTIZE_WORD_WIDTH

  r<<(QUANTIZE_WORD_WIDTH+QUANTIZE_WORD_WIDTH)|g<<QUANTIZE_WORD_WIDTH|b

approximateToRgb888 = (r, g, b) ->
  if not (g? and b?)
    color = r
    r = quantizedRed(color)
    g = quantizedGreen(color)
    b = quantizedBlue(color)
  [
    modifyWordWidth(r, QUANTIZE_WORD_WIDTH, 8)
    modifyWordWidth(g, QUANTIZE_WORD_WIDTH, 8)
    modifyWordWidth(b, QUANTIZE_WORD_WIDTH, 8)
  ]

quantizedRed = (color) ->
  color >> (QUANTIZE_WORD_WIDTH + QUANTIZE_WORD_WIDTH) & QUANTIZE_WORD_MASK

quantizedGreen = (color) ->
  color >> QUANTIZE_WORD_WIDTH & QUANTIZE_WORD_MASK

quantizedBlue = (color) ->
  color & QUANTIZE_WORD_MASK


module.exports =
class ColorCutQuantizer
  constructor: (data, @opts) ->
    @hist = new Uint32Array(1 << (QUANTIZE_WORD_WIDTH * 3))
    @pixels = new Uint32Array(data.length)
    for i in [0..data.length - 1]
      @pixels[i] = quantizedColor = quantizeFromRgb888 data[i]
      @hist[quantizedColor]++

    distinctColorCount = 0

    for color in [0..@hist.length - 1]
      # TODO: apply filters
      # if @hist[color] > 0 and @shouldIgnoreColor(color)
      #   @hist[color] = 0
      if @hist[color] > 0
        distinctColorCount++

    @colors = new Uint32Array(distinctColorCount)
    distinctColorIndex = 0

    for color in [0..@hist.length - 1]
      if @hist[color] > 0
        @colors[distinctColorIndex++] = color

    if distinctColorCount <= @opts.colorCount
      @quantizedColors = []
      for i in [0..@colors.length-1]
        c = @colors[i]
        @quantizedColors.push new Swatch approximateToRgb888(c), @hist[c]
    else
      @quantizedColors = @quantizePixels(@opts.colorCount)

  getQuantizedColors: ->
    @quantizedColors

  quantizePixels: (maxColors) ->
    # // Create the priority queue which is sorted by volume descending. This means we always
    # // split the largest box in the queue
    # final PriorityQueue<Vbox> pq = new PriorityQueue<>(maxColors, VBOX_COMPARATOR_VOLUME);
    pq = new PriorityQueue(comparator: Vbox.comparator)

    # // To start, offer a box which contains all of the colors
    # pq.offer(new Vbox(0, mColors.length - 1));
    pq.queue(new Vbox(@colors, @hist, 0, @colors.length - 1))
    #
    # // Now go through the boxes, splitting them until we have reached maxColors or there are no
    # // more boxes to split
    # splitBoxes(pq, maxColors);
    @splitBoxes(pq, maxColors)
    #
    # // Finally, return the average colors of the color b
    @generateAverageColors(pq)

  splitBoxes: (queue, maxSize) ->
    while queue.length < maxSize
      vbox = queue.dequeue()

      if vbox?.canSplit()
        queue.queue vbox.splitBox()
        queue.queue vbox
      else
        return

  generateAverageColors: (vboxes) ->
    colors = []

    while vboxes.length > 0
      colors.push vboxes.dequeue().getAverageColor()
    # colors = []
    #
    # vboxes.forEach (vbox) =>
    #   swatch = vbox.getAverageColor()
    #   if not @shouldIgnoreColor
    #     colors.push swatch

    colors

class Vbox
  @comparator: (lhs, rhs) ->
    lhs.getVolume() - rhs.getVolume()

  constructor: (@colors, @hist, @lowerIndex, @upperIndex) ->
    @fitBox()

  getVolume: ->
    (@maxRed - @minRed + 1) * (@maxGreen - @minGreen + 1) * (@maxBlue - @minBlue + 1)

  canSplit: ->
    @getColorCount() > 1

  getColorCount: ->
    1 + @upperIndex - @lowerIndex

  fitBox: ->
    @minRed = @minGreen = @minBlue = Number.MAX_VALUE
    @maxRed = @maxGreen = @maxBlue = Number.MIN_VALUE
    @population = 0
    count = 0
    for i in [@lowerIndex..@upperIndex]
      color = @colors[i]
      count += @hist[color]

      r = quantizedRed color
      g = quantizedGreen color
      b = quantizedBlue color

      if r > @maxRed then @maxRed = r
      if r < @minRed then @minRed = r
      if g > @maxGreen then @maxGreen = g
      if g < @minGreen then @minGreen = g
      if b > @maxBlue then @maxRed = b
      if b < @minBlue then @minRed = b

    @population = count

  splitBox: ->
    if not @canSplit()
      throw new Error("Cannot split a box with only 1 color")

    splitPoint = @findSplitPoint()

    newBox = new Vbox(@colors, @hist, splitPoint + 1, @upperIndex)

    # Now change this box's upperIndex and recompute the color boundaries
    @upperIndex = splitPoint
    @fitBox()

    newBox

  getLongestColorDimension: ->
    redLength = @maxRed - @minRed
    greenLength = @maxGreen - @minGreen
    blueLength = @maxBlue - @minBlue

    if redLength >= greenLength and redLength >= blueLength
      return COMPONENT_RED
    if greenLength >= redLength and greenLength >= blueLength
      return COMPONENT_GREEN
    return COMPONENT_BLUE

  findSplitPoint: ->
    longestDimension = @getLongestColorDimension()

    modifySignificantOctet @colors, longestDimension, @lowerIndex, @upperIndex

    # // Now sort... Arrays.sort uses a exclusive toIndex so we need to add 1
    # Arrays.sort(colors, mLowerIndex, mUpperIndex + 1);
    sort @colors, @lowerIndex, @upperIndex + 1

    modifySignificantOctet @colors, longestDimension, @lowerIndex, @upperIndex

    midPoint = @population / 2

    count = 0
    for i in [@lowerIndex..@upperIndex]
      count += @hist[@colors[i]]
      if count >= midPoint
        return i

    return @lowerIndex

  getAverageColor: ->
    redSum = greenSum = blueSum = 0
    totalPopulation = 0

    for i in [@lowerIndex..@upperIndex]
      color = @colors[i]
      colorPopulation = @hist[color]

      totalPopulation += colorPopulation

      redSum += colorPopulation * quantizedRed(color)
      greenSum += colorPopulation * quantizedGreen(color)
      blueSum += colorPopulation * quantizedBlue(color)

    redMean = Math.round redSum / totalPopulation
    greenMean = Math.round greenSum / totalPopulation
    blueMean = Math.round blueSum / totalPopulation

    return new Swatch(approximateToRgb888(redMean, greenMean, blueMean), totalPopulation)
