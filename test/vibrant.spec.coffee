# Values from actual execution in different browsers.
# Qualiy is set to 1 and not filters are used since downsampling are inconsistent
  # across browsers.
# Comfirmed visually and established as baseline for future versions
expectedSwatches =
  chrome: require('./data/chrome-exec-ref.json')
  firefox: require('./data/firefox-exec-ref.json')
  ie: require('./data/ie11-exec-ref.json')

TARGETS = Object.keys(expectedSwatches)

expect = require('chai').expect
path = require('path')
http = require('http')
finalhandler = require('finalhandler')
serveStatic = require('serve-static')
Promise = require('bluebird')
Vibrant = require('../')
util = require('../lib/util')

TEST_PORT = 3444

examples = [1..4].map (i) ->
  e =
    i: i
    fileName: "#{i}.jpg"
    filePath: path.join __dirname, "../examples/#{i}.jpg"
    fileUrl: "http://localhost:#{TEST_PORT}/#{i}.jpg"

Table = require('cli-table')
colors = require('colors')
displayColorDiffTable = (p, diff) ->
  console.log ""
  console.log "Palette Diffrence of #{p}".inverse
  head = ["Swatch", "Actual"]
  TARGETS.forEach (t) ->
    head.push t
    head.push 'Status'
  opts =
    head: head
    chars:
      'mid': ''
      'left': ''
      'left-mid': ''
      'mid-mid': ''
      'right-mid': ''
      'top': ''
      'top-mid': ''
      'bottom-mid': ''
      'top-left': ''
      'top-right': ''
      'bottom-left': ''
      'bottom-right': ''
      'bottom': ''
  table = new Table opts
  for row in diff
    table.push row
  console.log table.toString()

DELTAE94 =
  NA: 0
  PERFECT: 1
  CLOSE: 2
  GOOD: 10
  SIMILAR: 50
getColorDiffStatus = (d) ->
  if d < DELTAE94.NA
    return "N/A".grey
  # Not perceptible by human eyes
  if d <= DELTAE94.PERFECT
    return "Perfect".green
  # Perceptible through close observation
  if d <= DELTAE94.CLOSE
    return "Close".cyan
  # Perceptible at a glance
  if d <= DELTAE94.GOOD
    return "Good".blue
  # Colors are more similar than opposite
  if d < DELTAE94.SIMILAR
    return "Similar".yellow
  return "Wrong".red

paletteCallback = (p, i, done) ->
  (err, palette) ->
    if (err?) then throw err
    expect(palette, "palette should be returned").not.to.be.null

    failCount = 0
    testWithTarget = (name, actual, target) ->
      key = i.toString()
      expected = expectedSwatches[target][key][name]
      result =
        target: target
        expected: expected ? "null"
        status: "N/A"
        diff: -1

      if actual == null
        expect(expected, "#{name} color from '#{target}' was expected").to.be.null
      if expected == null
        expect(actual, "#{name} color form '#{target}' was not expected").to.be.null
      else
        actualHex = actual.getHex()
        diff = util.hexDiff(actualHex, expected)
        result.diff = diff
        result.status = getColorDiffStatus(diff)
        if diff > DELTAE94.SIMILAR then failCount++

      result

    diffTable = []
    for name, actual of palette
      colorDiff = [name, actual?.getHex() ? "null"]
      for target in TARGETS
        r = testWithTarget(name, actual, target)
        colorDiff.push r.expected
        colorDiff.push "#{r.status}(#{r.diff.toPrecision(2)})"
      diffTable.push colorDiff

    displayColorDiffTable p, diffTable

    expect(failCount, "#{failCount} colors are too diffrent from reference palettes")
      .to.equal(0)

    done()

testVibrant = (p, i, done) ->
  Vibrant.from p
    .quality(1)
    .clearFilters()
    .getPalette paletteCallback(p, i, done)

staticFiles = serveStatic "./examples"
serverHandler = (req, res) ->
  done = finalhandler(req, res)
  staticFiles(req, res, done)

describe "Palette Extraction", ->
  describe "process examples/", ->
    examples.forEach (example) ->
      it "#{example.fileName}", (done) ->
        testVibrant example.filePath, example.i, done

  describe "process remote images (http)", ->
    server = null

    before ->
      server = http.createServer serverHandler

      Promise.promisify server.listen
      Promise.promisify server.close

      server.listen(TEST_PORT)

    after ->
      server.close()

    examples.forEach (example) ->
      it "#{example.fileUrl}", (done) ->
        testVibrant example.fileUrl, example.i, done
