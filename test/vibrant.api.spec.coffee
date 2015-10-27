if not (Window? and this instanceof Window)
  Vibrant = require('../')
  expect = require('chai').expect

describe "API", ->
  describe "Builder", ->
    it "modifies Vibrant options", ->
      NOT_A_FILTER = ->
      v = Vibrant.from 'NOT_A_PATH'
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
