/* tslint:disable:no-unused-expression */
import {
  loadTestSamples
} from 'fixtures/sample/loader'

import {
  testVibrant,
  testVibrantAsPromised
} from './common/helper'

import Vibrant = require('node-vibrant')

const expect: Chai.ExpectStatic = (window as any).chai.expect

const SAMPLES = loadTestSamples()

describe('Vibrant', () => {
  it('Async import', () =>
    import('node-vibrant').then((v: any) => {
      expect(v, 'Vibrant').not.to.be.undefined
    })
  )
  describe('Palette Extraction', () => {
    SAMPLES.forEach((example) => {
      it(`${example.name} (callback)`, testVibrant(Vibrant, example, 'relativeUrl', 'browser'))
      it(`${example.name} (Promise)`, testVibrantAsPromised(Vibrant, example, 'relativeUrl', 'browser'))
    })
  })
})
