const expect: Chai.ExpectStatic = (<any>window).chai.expect
const Vibrant: any = (<any>window).Vibrant

import {
  ImageClass
} from '../typing'

import {
  SAMPLES,
  Sample,
  TARGETS,
  REFERENCE_PALETTE
} from './common/data'
import {
  testVibrant,
  testVibrantAsPromised
} from './common/helper'

describe("Vibrant", () => {
  it("exports to window", () => {
    expect(Vibrant).not.to.be.null
    expect(Vibrant.Util).not.to.be.null
    expect(Vibrant.Quantizer).not.to.be.null
    expect(Vibrant.Generator).not.to.be.null
    expect(Vibrant.Filter).not.to.be.null
  })
  describe("Palette Extraction", () => {
    SAMPLES.forEach((example) => {
      it(`${example.fileName} (callback)`, done => testVibrant(Vibrant, example, done, 'relativeUrl'))
      it(`${example.fileName} (Promise)`, () => testVibrantAsPromised(Vibrant, example, 'relativeUrl'))
    })
  })

  describe("Browser Image", () => {
    let loc = window.location
    let BrowserImage: ImageClass = Vibrant.DefaultOpts.ImageClass
    let CROS_URL = "http://example.com/foo.jpg"
    let RELATIVE_URL = "foo/bar.jpg"
    let SAME_ORIGIN_URL = `${loc.protocol}//${loc.host}/foo/bar.jpg`
    it("should set crossOrigin flag for images form foreign origin", () => {
      let m = new BrowserImage()
      m.load(CROS_URL)
      expect((<any>m).image.crossOrigin, `${CROS_URL} should have crossOrigin === 'anonymous'`)
        .to.equal("anonymous")
    })


    it("should not set crossOrigin flag for images from same origin", () => {
      let m1 = new BrowserImage()
      m1.load(RELATIVE_URL)
      expect((<any>m1).image.crossOrigin, `${RELATIVE_URL} should not have crossOrigin set`)
        .not.to.equal("anonymous")
      let m2 = new BrowserImage()
      m2.load(SAME_ORIGIN_URL)
      expect((<any>m2).image.crossOrigin, `${SAME_ORIGIN_URL} should not have crossOrigin set`)
        .not.to.equal("anonymous")
    })

    it("should accept HTMLImageElement as input", () => {
      let img = document.createElement('img')
      img.src = SAMPLES[0].relativeUrl

      let m1 = new BrowserImage()
      return m1.load(img) 
    })

    it("should accept HTMLImageElement that is already loaded as input", (done) => {
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
