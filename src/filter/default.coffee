module.exports = (r, g, b, a) ->
  a >= 125 and not (r > 250 and g > 250 and b > 250)
