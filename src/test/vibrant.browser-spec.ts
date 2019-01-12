/* eslint-env mocha, browser */
/* eslint-disable no-unused-expressions */

import {
  ImageClass
} from '../typing'

import {
  SAMPLES
} from './common/data'
import {
  testVibrant,
  testVibrantAsPromised
} from './common/helper'

const expect: Chai.ExpectStatic = (<any>window).chai.expect
const Vibrant: any = (<any>window).Vibrant

describe('Vibrant', () => {
  it('Async import', () =>
    import('../browser').then((v: any) => {
      expect(v, 'Vibrant').not.to.be.undefined
      expect(v.Util, 'Vibrant.Util').not.to.be.undefined
      expect(v.Quantizer, 'Vibrant.Quantizer').not.to.be.undefined
      expect(v.Generator, 'Vibrant.Generator').not.to.be.undefined
      expect(v.Filter, 'Vibrant.Filter').not.to.be.undefined
    })
  )
  it('exports to window', () => {
    expect(Vibrant, 'Vibrant').not.to.be.undefined
    expect(Vibrant.Util, 'Vibrant.Util').not.to.be.undefined
    expect(Vibrant.Quantizer, 'Vibrant.Quantizer').not.to.be.undefined
    expect(Vibrant.Generator, 'Vibrant.Generator').not.to.be.undefined
    expect(Vibrant.Filter, 'Vibrant.Filter').not.to.be.undefined
  })
  describe('Palette Extraction', () => {
    SAMPLES.forEach((example) => {
      it(`${example.name} (callback)`, testVibrant(Vibrant, example, 'relativeUrl', 'browser'))
      it(`${example.name} (Promise)`, testVibrantAsPromised(Vibrant, example, 'relativeUrl', 'browser'))
    })
  })

  describe('Browser Image', () => {
    let loc = window.location
    let BrowserImage: ImageClass = Vibrant.DefaultOpts.ImageClass
    const CROS_URL = 'https://avatars3.githubusercontent.com/u/922715?v=3&s=460'
    const RELATIVE_URL = SAMPLES[0].relativeUrl
    const SAME_ORIGIN_URL = `${loc.protocol}//${loc.host}/${RELATIVE_URL}`

    it('should set crossOrigin flag for images form foreign origin', () =>
      new BrowserImage().load(CROS_URL)
        .then((m) => {
          expect((<any>m).image.crossOrigin, `${CROS_URL} should have crossOrigin === 'anonymous'`)
            .to.equal('anonymous')
          expect(m.getImageData()).to.be.an.instanceOf(ImageData)
        })
    )

    it('should not set crossOrigin flag for images from same origin (relative URL)', () =>
      new BrowserImage().load(RELATIVE_URL)
        .then((m) => {
          expect((<any>m).image.crossOrigin, `${RELATIVE_URL} should not have crossOrigin set`)
            .not.to.equal('anonymous')
        })
    )

    it('should not set crossOrigin flag for images from same origin (absolute URL)', () =>
      new BrowserImage().load(SAME_ORIGIN_URL)
        .then((m) => {
          expect((<any>m).image.crossOrigin, `${SAME_ORIGIN_URL} should not have crossOrigin set`)
            .not.to.equal('anonymous')
        })
    )

    it('should accept HTMLImageElement as input', () => {
      let img = document.createElement('img')
      img.src = SAMPLES[0].relativeUrl

      let m1 = new BrowserImage()
      return m1.load(img)
    })

    it('should accept HTMLImageElement that is already loaded as input', (done) => {
      let img = document.createElement('img')
      img.src = SAMPLES[0].relativeUrl

      img.onload = () => {
        let m1 = new BrowserImage()
        m1.load(img)
          .then(img => done())
      }
    })
  })
})
