{expect} = require('chai')
path = require('path')
Swatch = require('../lib/swatch')
MMCQ = require('../lib/quantizer/impl/mmcq')
VBox = require('../lib/quantizer/impl/vbox')
PQueue = require('../lib/quantizer/impl/pqueue')
{Node} = Image = require('../lib/image')
{getAll, splitBox} = quantize = require('../vendor-mod/quantize')

compareVBoxes = (expected, actual) ->
  expect(actual.hist, "should have identical hist").to.deep.equal(expected.histo)
  ['r', 'g', 'b'].forEach (d) ->
    dim1 = d + '1'
    dim2 = d + '2'
    expect(actual[dim1], "should have identical #{dim1}").to.equal(expected[dim1])
    expect(actual[dim2], "should have identical #{dim2}").to.equal(expected[dim2])
  expect(actual.avg(), "should have identical average").to.deep.equal(expected.avg())
  expect(actual.count(), "should have identical count").to.deep.equal(expected.count())
  expect(actual.volume(), "should have identical volume").to.deep.equal(expected.volume())

describe "MMCQ", ->
  describe "PQueue", ->
    data = [5, 3, 2, 4, 1]
    q = null
    beforeEach ->
      q = new PQueue((a, b) -> a - b)
      data.forEach (d) ->
        q.push(d)
    it "peek", ->
      expect(q.peek()).to.equal(5)
      expect(q.peek(0)).to.equal(1)
    it "size", ->
      expect(q.size()).to.equal(data.length)
    it "pop", ->
      expect(q.pop()).to.equal(5)
      expect(q.pop()).to.equal(4)
      expect(q.pop()).to.equal(3)
      expect(q.pop()).to.equal(2)
      expect(q.pop()).to.equal(1)

    it "map", ->
      expect(q.map((p) -> p)).to.deep.equal([1, 2, 3, 4, 5])

  describe "VBox (comparing to reference implementation)", ->
    data = null
    expected = null
    actual = null
    vbox = null

    beforeEach (done) ->
      img = new Node path.join(__dirname, '../examples/2.jpg'), (err, cb) ->
        if err?
          throw err
        data = img.getImageData().data
        expected = getAll(data, null)
        actual = VBox.build(data, -> false)
        vbox = expected.vbox
        done()

    it "should be identical", ->
      compareVBoxes vbox, actual

    it "should clone identical boxes", ->
      cloned = actual.clone()
      expect(cloned.hist, "should have identical hist").to.deep.equal(actual.hist)
      ['r', 'g', 'b'].forEach (d) ->
        dim1 = d + '1'
        dim2 = d + '2'
        expect(cloned[dim1], "should have identical #{dim1}").to.equal(actual[dim1])
        expect(cloned[dim2], "should have identical #{dim2}").to.equal(actual[dim2])
      expect(cloned.avg(), "should have identical average").to.deep.equal(actual.avg())
      expect(cloned.count(), "should have identical count").to.deep.equal(actual.count())
      expect(cloned.volume(), "should have identical volume").to.deep.equal(actual.volume())



    it "should split identical vboxes", ->
      [expected1, expected2] = splitBox expected.histo, vbox
      [actual1, actual2] = actual.split()
      compareVBoxes actual1, expected1
      compareVBoxes actual2, expected2

  describe "Quantize", ->
    data = null
    cmap = null
    mmcq = null
    expected = null
    actual = null
    opts = colorCount: 64

    before (done) ->
      img = new Node path.join(__dirname, '../examples/2.jpg'), (err, cb) ->
        if err?
          throw err
        data = img.getImageData().data
        cmap = quantize data, opts
        expected = cmap.vboxes.map (vbox) =>
          new Swatch vbox.color, vbox.vbox.count()
        mmcq = new MMCQ()
        actual = mmcq.quantize data, opts
        done()

    it "should generate identical palette", ->
      expect(actual).to.deep.equal(expected)
