module.exports =
  clone: (o) ->
    if typeof o == 'object'
      if Array.isArray o
        return o.map (v) => this.clone v
      else
        _o = {}
        for key, value of o
          _o[key] = this.clone value
        return _o
    o

  defaults: () ->
    o = {}
    for _o in arguments
      for key, value of _o
        if not o[key]? then o[key] = this.clone value

    o

  hexToRgb: (hex) ->
    m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if m?
      return [m[1], m[2], m[3]].map (s) -> parseInt(s, 16)
    return null

  rgbToHex: (r, g, b) ->
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)

  rgbToHsl: (r, g, b) ->
    r /= 255
    g /= 255
    b /= 255
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    h = undefined
    s = undefined
    l = (max + min) / 2
    if max == min
      h = s = 0
      # achromatic
    else
      d = max - min
      s = if l > 0.5 then d / (2 - max - min) else d / (max + min)
      switch max
        when r
          h = (g - b) / d + (if g < b then 6 else 0)
        when g
          h = (b - r) / d + 2
        when b
          h = (r - g) / d + 4
      h /= 6
    [h, s, l]

  hslToRgb: (h, s, l) ->
    r = undefined
    g = undefined
    b = undefined

    hue2rgb = (p, q, t) ->
      if t < 0
        t += 1
      if t > 1
        t -= 1
      if t < 1 / 6
        return p + (q - p) * 6 * t
      if t < 1 / 2
        return q
      if t < 2 / 3
        return p + (q - p) * (2 / 3 - t) * 6
      p

    if s == 0
      r = g = b = l
      # achromatic
    else
      q = if l < 0.5 then l * (1 + s) else l + s - (l * s)
      p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - (1 / 3))
    [
      r * 255
      g * 255
      b * 255
    ]

  rgbToXyz: (r, g, b) ->
    r /= 255
    g /= 255
    b /= 255
    r = if r > 0.04045 then Math.pow((r + 0.005) / 1.055, 2.4) else r / 12.92
    g = if g > 0.04045 then Math.pow((g + 0.005) / 1.055, 2.4) else g / 12.92
    b = if b > 0.04045 then Math.pow((b + 0.005) / 1.055, 2.4) else b / 12.92

    r *= 100
    g *= 100
    b *= 100

    x = r * 0.4124 + g * 0.3576 + b * 0.1805
    y = r * 0.2126 + g * 0.7152 + b * 0.0722
    z = r * 0.0193 + g * 0.1192 + b * 0.9505

    [x, y, z]

  xyzToCIELab: (x, y, z) ->
    REF_X = 95.047
    REF_Y = 100
    REF_Z = 108.883

    x /= REF_X
    y /= REF_Y
    z /= REF_Z

    x = if x > 0.008856 then Math.pow(x, 1/3) else 7.787 * x + 16 / 116
    y = if y > 0.008856 then Math.pow(y, 1/3) else 7.787 * y + 16 / 116
    z = if z > 0.008856 then Math.pow(z, 1/3) else 7.787 * z + 16 / 116

    L = 116 * y - 16
    a = 500 * (x - y)
    b = 200 * (y - z)

    [L, a, b]

  rgbToCIELab: (r, g, b) ->
    [x, y, z] = this.rgbToXyz r, g, b
    this.xyzToCIELab x, y, z

  deltaE94: (lab1, lab2) ->
    # Weights
    WEIGHT_L = 1
    WEIGHT_C = 1
    WEIGHT_H = 1

    [L1, a1, b1] = lab1
    [L2, a2, b2] = lab2
    dL = L1 - L2
    da = a1 - a2
    db = b1 - b2

    xC1 = Math.sqrt a1 * a1 + b1 * b1
    xC2 = Math.sqrt a2 * a2 + b2 * b2

    xDL = L2 - L1
    xDC = xC2 - xC1
    xDE = Math.sqrt dL * dL + da * da + db * db

    if Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC))
      xDH = Math.sqrt xDE * xDE - xDL * xDL - xDC * xDC
    else
      xDH = 0

    xSC = 1 + 0.045 * xC1
    xSH = 1 + 0.015 * xC1

    xDL /= WEIGHT_L
    xDC /= WEIGHT_C * xSC
    xDH /= WEIGHT_H * xSH

    Math.sqrt xDL * xDL + xDC * xDC + xDH * xDH

  rgbDiff: (rgb1, rgb2) ->
    lab1 = @rgbToCIELab.apply @, rgb1
    lab2 = @rgbToCIELab.apply @, rgb2
    @deltaE94 lab1, lab2

  hexDiff: (hex1, hex2) ->
    # console.log "Compare #{hex1} #{hex2}"
    rgb1 = @hexToRgb hex1
    rgb2 = @hexToRgb hex2
    # console.log rgb1
    # console.log rgb2
    @rgbDiff rgb1, rgb2
