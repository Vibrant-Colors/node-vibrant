examples = [1..4].map (i) ->
  e =
    i: i
    fileName: "#{i}.jpg"
    fileUrl: "base/examples/#{i}.jpg"

expectedSwatches = {}
TARGETS = ['chrome', 'firefox', 'ie']

paletteCallback = (example, done) ->
  (err, palette) ->
    if err? then throw err

    failCount = 0
    testWithTarget = (name, actual, target) ->
      key = example.i.toString()
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
        diff = Vibrant.Util.hexDiff(actualHex, expected)
        result.diff = diff
        result.status = Vibrant.Util.getColorDiffStatus(diff)
        if diff > Vibrant.Util.DELTAE94_DIFF_STATUS.SIMILAR then failCount++

      result

    expect(palette, "Palette should not be null").not.to.be.null

    colorSummary = {}
    for name, actual of palette
      for target in TARGETS
        if not colorSummary[target]?
          colorSummary[target] = {}
        r = testWithTarget(name, actual, target)
        if not colorSummary[target][r.status]?
          colorSummary[target][r.status] = 0
        colorSummary[target][r.status] += 1

    console.log "File #{example.fileName} palette color score"
    for target, summary of colorSummary
      s = "#{target}>\t\t"
      for status, count of summary
        s += "#{status}: #{count}\t\t"
      console.log s
      console.log ""

    expect(failCount, "#{failCount} colors are too diffrent from reference palettes")
      .to.equal(0)
    done()

testVibrant = (example, done) ->
  Vibrant.from example.fileUrl
    .quality(1)
    .clearFilters()
    .getPalette paletteCallback(example, done)

describe "Vibrant", ->
  it "exports to window", ->
    expect(Vibrant).not.to.be.null
    expect(Vibrant.Util).not.to.be.null
    expect(Vibrant.Quantizer).not.to.be.null
    expect(Vibrant.Generator).not.to.be.null
    expect(Vibrant.Filter).not.to.be.null
  describe "Palette Extraction", ->

    before ->
      expectedSwatches['chrome'] = __json__['test/data/chrome-exec-ref']
      expectedSwatches['firefox'] = __json__['test/data/firefox-exec-ref']
      expectedSwatches['ie'] = __json__['test/data/ie11-exec-ref']

    examples.forEach (example) ->
      it example.fileName, (done) ->
        testVibrant example, done

  describe "Browser Image", ->
    loc = window.location
    Image = Vibrant.DefaultOpts.Image
    CROS_URL = "http://example.com/foo.jpg"
    RELATIVE_URL = "foo/bar.jpg"
    SAME_ORIGIN_URL = "#{loc.protocol}//#{loc.host}/foo/bar.jpg"
    it "should set crossOrigin flag for images form foreign origin", ->
      m = new Image(CROS_URL)
      expect(m.img.crossOrigin, "#{CROS_URL} should have crossOrigin === 'anonymous'")
        .to.equal("anonymous")


    it "should not set crossOrigin flag for images from same origin", ->
      m1 = new Image(RELATIVE_URL)
      expect(m1.img.crossOrigin, "#{RELATIVE_URL} should not have crossOrigin set")
        .not.to.equal("anonymous")
      m2 = new Image(SAME_ORIGIN_URL)
      expect(m1.img.crossOrigin, "#{SAME_ORIGIN_URL} should not have crossOrigin set")
        .not.to.equal("anonymous")
