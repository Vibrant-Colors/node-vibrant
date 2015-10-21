# Note: the following colors came from https://jariz.github.io/vibrant.js/
#       however the browser version only samples visible region, not the full
#       source. Thus its output is nondeterministic and cannot be used as
#       baseline.
# expectedSwatches =
#   1:
#     Vibrant:      "#6174CD"
#     Muted:        "#6C5758"
#     DarkVibrant:  "#423C8D"
#     DarkMuted:    "#12151E"
#     LightVibrant: "#C7B060"
#     LightMuted:   "#C9C4CA"
#   2:
#     Vibrant:      "#2C41A7"
#     Muted:        "#7D8B9B"
#     DarkVibrant:  "#CF9D13"
#     DarkMuted:    "#66635C"
#     LightVibrant: "#E2E2E1"
#     LightMuted:   null
#   3:
#     Vibrant:      "#E34C4A"
#     Muted:        "#646A50"
#     DarkVibrant:  "#06362A"
#     DarkMuted:    "#557B69"
#     LightVibrant: "#FBF2EA"
#     LightMuted:   "#AF9E82"
#   4:
#     Vibrant:      "#BA9945"
#     Muted:        "#847C8C"
#     DarkVibrant:  "#3C1E18"
#     DarkMuted:    "#080604"
#     LightVibrant: "#DE56B8"
#     LightMuted:   null

# Values from actual execution
# Comfirmed visually and established as baseline for future versions
expectedSwatches =
  1:
    Vibrant:      "#c7b060"
    Muted:        "#6C5758" # *
    DarkVibrant:  "#423d8d"
    DarkMuted:    "#11141e"
    LightVibrant: "#6873cf"
    LightMuted:   null
  2:
    Vibrant:      "#dbae13"
    Muted:        "#7d8b9a"
    DarkVibrant:  "#2b3ea5"
    DarkMuted:    "#65625c"
    LightVibrant: null
    LightMuted:   null
  3:
    Vibrant:      "#cd5050"
    Muted:        "#6b7f6e"
    DarkVibrant:  "#5d3322"
    DarkMuted:    "#254d40"
    LightVibrant: "#faf2ea"
    LightMuted:   null
  4:
    Vibrant:      "#bc9a47"
    Muted:        "#543e5c"
    DarkVibrant:  "#61271e"
    DarkMuted:    "#080504"
    LightVibrant: "#d07ec8"
    LightMuted:   null

expect = require('chai').expect
path = require('path')
Vibrant = require('../')

testVibrant = (i, done) ->
  p = path.join __dirname, "../examples/#{i}.jpg"
  v = new Vibrant p
  v.getSwatches (err, actual) ->
    if (err?) then throw err
    for name, value of expectedSwatches[i]
      expect(actual).to.have.property name
      expect(actual[name]?.getHex()).to.equal value?.toLowerCase(), "wrong #{name} color"
    done()

describe "node-vibrant", ->
  describe "process examples/", ->
    makeTest = (i) ->
      it "#{i}.jpg", (done) ->
        testVibrant i, done

    for i in [1..4]
      makeTest i
