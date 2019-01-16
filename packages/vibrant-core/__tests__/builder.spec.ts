/* eslint-env mocha */
import { expect } from 'chai'

import Builder from '@vibrant/core/lib/builder'

describe('builder', () => {
  it('modifies Vibrant options', () => {
    // tslint:disable-next-line:no-empty
    const NOT_A_FILTER = () => { }
    let v = new Builder('NOT_A_PATH')
      .maxColorCount(23)
      .quality(7)
      .useImageClass('NOT_AN_IMAGE' as any)
      .useGenerator('NOT_A_GENERATOR' as any)
      .useQuantizer('NOT_A_QUANTIZER' as any)
      .clearFilters()
      .addFilter(NOT_A_FILTER as any)
      .build()
    const expected = {
      colorCount: 23,
      quality: 7,
      ImageClass: 'NOT_AN_IMAGE',
      quantizer: 'NOT_A_QUANTIZER',
      generators: [
        'default',
        'NOT_A_GENERATOR'
      ],
      filters: [NOT_A_FILTER]
    }

    expect(v.opts).to.deep.equal(expected)
  })
})
