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
    LightMuted:   "#c9cbce"
  2:
    Vibrant:      "#dbae13"
    Muted:        "#7d8b9a"
    DarkVibrant:  "#2b3ea5"
    DarkMuted:    "#65625c"
    LightVibrant: null
    LightMuted:   "#e2e3e3"
  3:
    Vibrant:      "#cd5050"
    Muted:        "#6b7f6e"
    DarkVibrant:  "#5d3322"
    DarkMuted:    "#254d40"
    LightVibrant: "#faf2ea"
    LightMuted:   "#a4967d"
  4:
    Vibrant:      "#bc9a47"
    Muted:        "#543e5c"
    DarkVibrant:  "#61271e"
    DarkMuted:    "#080504"
    LightVibrant: "#d07ec8"
    LightMuted:   null

expect = require('chai').expect
path = require('path')
http = require('http')
finalhandler = require('finalhandler')
serveStatic = require('serve-static')
Promise = require('bluebird')
Vibrant = require('../')

TEST_PORT = 3444

paletteCallback = (expected, done) ->
  (err, actual) ->
    if (err?) then throw err
    for name, value of expected
      expect(actual).to.have.property name
      expect(actual[name]?.getHex()).to.equal value?.toLowerCase(), "wrong #{name} color"
    done()

testVibrant = (p, i, done) ->
  v = new Vibrant p
  v.getSwatches paletteCallback(expectedSwatches[i], done)
  # (err, actual) ->
  #   if (err?) then throw err
  #   for name, value of expectedSwatches[i]
  #     expect(actual).to.have.property name
  #     expect(actual[name]?.getHex()).to.equal value?.toLowerCase(), "wrong #{name} color"
  #   done()

staticFiles = serveStatic "./examples"
serverHandler = (req, res) ->
  done = finalhandler(req, res)
  staticFiles(req, res, done)

describe "node-vibrant", ->
  describe "Builder", ->
    it "modifies Vibrant options", ->
      NOT_A_FILTER = ->
      v = Vibrant.from path.join __dirname, "../examples/1.jpg"
        .maxColorCount 23
        .quality 7
        .useImage "NOT_AN_IMAGE"
        .useGenerator "NOT_A_GENERATOR"
        .useQuantizer "NOT_A_QUANTIZER"
        .clearFilters()
        .addFilter(NOT_A_FILTER)
        .build()
      expected =
        colorCount: 23
        quality: 7
        Image: "NOT_AN_IMAGE"
        Quantizer: "NOT_A_QUANTIZER"
        generator: "NOT_A_GENERATOR"
        filters: [NOT_A_FILTER]

      expect(v.opts).to.deep.equal(expected)

    it "creates instance from Builder", (done) ->
      Vibrant.from path.join __dirname, "../examples/1.jpg"
        .getPalette paletteCallback(expectedSwatches[1], done)
  describe "process examples/", ->
    [1..4].map (i) -> path.join __dirname, "../examples/#{i}.jpg"
      .forEach (p, i) ->
        i++
        it "#{i}.jpg", (done) ->
          testVibrant p, i, done

  describe "process remote images (http)", ->
    server = null

    before ->
      server = http.createServer serverHandler

      Promise.promisify server.listen
      Promise.promisify server.close

      server.listen(TEST_PORT)

    after ->
      server.close()

    [1..4].map (i) -> "http://localhost:#{TEST_PORT}/#{i}.jpg"
      .forEach (p, i) ->
        i++
        it p, (done) ->
          testVibrant p, i, done
