/* eslint-env mocha */
import { expect } from 'chai'

import Builder from '@vibrant/core/lib/builder'

import omit = require('lodash/omit')

describe('builder', () => {
  it('modifies Vibrant options', () => {
    const NOT_A_FILTER = () => { }
    let v = new Builder('NOT_A_PATH')
      .maxColorCount(23)
      .quality(7)
      .useImageClass(<any>'NOT_AN_IMAGE')
      .useGenerator(<any>'NOT_A_GENERATOR')
      .useQuantizer(<any>'NOT_A_QUANTIZER')
      .clearFilters()
      .addFilter(<any>NOT_A_FILTER)
      .build()
    const expected = {
      colorCount: 23,
      quality: 7,
      ImageClass: 'NOT_AN_IMAGE',
      quantizer: 'NOT_A_QUANTIZER',
      generator: 'NOT_A_GENERATOR',
      filters: [NOT_A_FILTER]
    }


    expect(v.opts).to.deep.equal(expected)
  })
})
