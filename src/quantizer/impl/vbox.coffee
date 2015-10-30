{getColorIndex, SIGBITS, RSHIFT} = util = require('../../util')

module.exports =
class VBox
  @build: (pixels, shouldIgnore) ->
    hn = 1<<(3*SIGBITS)
    hist = new Uint32Array(hn)
    rmax = gmax = bmax = 0
    rmin = gmin = bmin = Number.MAX_VALUE
    n = pixels.length / 4
    i = 0

    while i < n
      offset = i * 4
      i++
      r = pixels[offset + 0]
      g = pixels[offset + 1]
      b = pixels[offset + 2]
      a = pixels[offset + 3]
      # TODO: use result from hist
      if shouldIgnore(r, g, b, a) then continue

      r = r >> RSHIFT
      g = g >> RSHIFT
      b = b >> RSHIFT


      index = getColorIndex(r, g, b)
      hist[index] += 1

      if r > rmax
        rmax = r
      if r < rmin
        rmin = r
      if g > gmax
        gmax = g
      if g < gmin
        gmin = g
      if b > bmax
        bmax = b
      if b < bmin
        bmin = b

    new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist)

  constructor: (@r1, @r2, @g1, @g2, @b1, @b2, @hist) ->
    # @_initBox()

  invalidate: ->
    delete @_count
    delete @_avg
    delete @_volume

  volume: ->
    if not @_volume?
      @_volume = (@r2 - @r1 + 1) * (@g2 - @g1 + 1) * (@b2 - @b1 + 1)
    @_volume

  count: ->
    if not @_count?
      hist = @hist
      c = 0
      `
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            c += hist[index];
          }
        }
      }
      `
      # for r in [@r1..@r2]
      #   for g in [@g1..@g2]
      #     for b in [@b1..@b2]
      #       index = getColorIndex(r, g, b)
      #       c += hist[index]
      @_count = c
    @_count

  clone: ->
    new VBox(@r1, @r2, @g1, @g2, @b1, @b2, @hist)

  avg: ->
    if not @_avg?
      hist = @hist
      ntot = 0
      mult = 1 << (8 - SIGBITS)
      rsum = gsum = bsum = 0
      `
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            var h = hist[index];
            ntot += h;
            rsum += (h * (r + 0.5) * mult);
            gsum += (h * (g + 0.5) * mult);
            bsum += (h * (b + 0.5) * mult);
          }
        }
      }
      `
      # NOTE: CoffeeScript will screw things up when @r1 > @r2
      # for r in [@r1..@r2]
      #   for g in [@g1..@g2]
      #     for b in [@b1..@b2]
      #       index = getColorIndex(r, g, b)
      #       h = hist[index]
      #       ntot += h
      #       rsum += (h * (r + 0.5) * mult)
      #       gsum += (h * (g + 0.5) * mult)
      #       bsum += (h * (b + 0.5) * mult)

      if ntot
        @_avg = [
          ~~(rsum / ntot)
          ~~(gsum / ntot)
          ~~(bsum / ntot)
        ]
      else
        @_avg = [
          ~~(mult * (@r1 + @r2 + 1) / 2)
          ~~(mult * (@g1 + @g2 + 1) / 2)
          ~~(mult * (@b1 + @b2 + 1) / 2)
        ]
    @_avg

  split: ->
    hist = @hist
    if !@count()
      return null
    if @count() == 1
      return [@clone()]

    rw = @r2 - @r1 + 1
    gw = @g2 - @g1 + 1
    bw = @b2 - @b1 + 1

    maxw = Math.max(rw, gw, bw)
    accSum = null
    sum = total = 0

    maxd = null
    switch maxw
      when rw
        maxd = 'r'
        accSum = new Uint32Array(@r2 + 1)
        `
        for (var r = this.r1; r <= this.r2; r++) {
          sum = 0
          for (var g = this.g1; g <= this.g2; g++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[r] = total;
        }
        `
        # for r in [@r1..@r2]
        #   sum = 0
        #   for g in [@g1..@g2]
        #     for b in [@b1..@b2]
        #       index = getColorIndex(r, g, b)
        #       sum += hist[index]
        #   total += sum
        #   accSum[r] = total
      when gw
        maxd = 'g'
        accSum = new Uint32Array(@g2 + 1)
        `
        for (var g = this.g1; g <= this.g2; g++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[g] = total;
        }
        `
        # for g in [@g1..@g2]
        #   sum = 0
        #   for r in [@r1..@r2]
        #     for b in [@b1..@b2]
        #       index = getColorIndex(r, g, b)
        #       sum += hist[index]
        #   total += sum
        #   accSum[g] = total
      when bw
        maxd = 'b'
        accSum = new Uint32Array(@b2 + 1)
        `
        for (var b = this.b1; b <= this.b2; b++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var g = this.g1; g <= this.g2; g++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[b] = total;
        }
        `
        # for b in [@b1..@b2]
        #   sum = 0
        #   for r in [@r1..@r2]
        #     for g in [@g1..@g2]
        #       index = getColorIndex(r, g, b)
        #       sum += hist[index]
        #   total += sum
        #   accSum[b] = total

    splitPoint = -1
    reverseSum = new Uint32Array(accSum.length)
    for i in [0..accSum.length-1]
      d = accSum[i]
      if splitPoint < 0 && d > total / 2
        splitPoint = i
      reverseSum[i] = total - d

    vbox = this
    doCut = (d) ->
      dim1 = d + "1"
      dim2 = d + "2"
      d1 = vbox[dim1]
      d2 = vbox[dim2]
      vbox1 = vbox.clone()
      vbox2 = vbox.clone()
      left = splitPoint - d1
      right = d2 - splitPoint
      if left <= right
        d2 = Math.min(d2 - 1, ~~ (splitPoint + right / 2))
        d2 = Math.max(0, d2)
      else
        d2 = Math.max(d1, ~~ (splitPoint - 1 - left / 2))
        d2 = Math.min(vbox[dim2], d2)


      while !accSum[d2]
        d2++


      c2 = reverseSum[d2]
      while !c2 and accSum[d2 - 1]
        c2 = reverseSum[--d2]

      vbox1[dim2] = d2
      vbox2[dim1] = d2 + 1
      # vbox.invalidate()

      return [vbox1, vbox2]

    doCut maxd

  contains: (p) ->
    r = p[0]>>RSHIFT
    g = p[1]>>RSHIFT
    b = p[2]>>RSHIFT

    r >= @r1 and r <= @r2 and g >= @g1 and g <= @g2 and b >= @b1 and b <= @b2
