module.exports =
  defaults: () ->
    o = {}
    for _o in arguments
      for key, value of _o
        if not o[key]? then o[key] = value

    o

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
