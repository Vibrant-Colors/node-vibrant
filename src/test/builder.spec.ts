import { expect } from 'chai'

import Vibrant = require('../index')

// if (typeof Window !== undefined && this instanceof Window) {
//     Vibrant = this.Vibrant
// } else {
//     Vibrant = require('../index')
// }
//   Vibrant = require('../')
//   expect = require('chai').expect

describe('builder', () => {
    it('modifies Vibrant options', () => {
        const NOT_A_FILTER = () => { }
        let v = Vibrant.from('NOT_A_PATH')
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
