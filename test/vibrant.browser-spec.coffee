examples = [1..4].map (i) ->
  e =
    i: i
    fileName: "#{i}.jpg"
    fileUrl: "base/examples/#{i}.jpg"

testVibrant = (example, done) ->
  Vibrant.from example.fileUrl
    .quality(1)
    .clearFilters()
    .getPalette (err, palette) ->
      if err? then throw err
      expect(palette, "Palette should not be null").not.to.be.null
      done()

describe "Vibrant", ->
  it "exports to window", ->
    expect(Vibrant).not.to.be.null
    expect(Vibrant.Util).not.to.be.null
    expect(Vibrant.Quantizer).not.to.be.null
    expect(Vibrant.Generator).not.to.be.null
    expect(Vibrant.Filter).not.to.be.null
  describe "Palette Extraction", ->
    examples.forEach (example) ->
      it example.fileName, (done) ->
        testVibrant example, done
