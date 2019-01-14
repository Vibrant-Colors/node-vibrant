import {
  loadTestSamples
} from 'fixtures/sample/loader'

const expect: Chai.ExpectStatic = (window as any).chai.expect
const Vibrant: any = (window as any).Vibrant

const SAMPLES = loadTestSamples()

import BrowserImage from '@vibrant/image-browser'

describe('Browser Image', () => {
  let loc = window.location
  const CROS_URL = 'https://avatars3.githubusercontent.com/u/922715?v=3&s=460'
  const RELATIVE_URL = SAMPLES[0].relativeUrl
  const SAME_ORIGIN_URL = `${loc.protocol}//${loc.host}/${RELATIVE_URL}`

  it('should set crossOrigin flag for images form foreign origin', () =>
    new BrowserImage().load(CROS_URL)
      .then((m) => {
        expect((m as any).image.crossOrigin, `${CROS_URL} should have crossOrigin === 'anonymous'`)
          .to.equal('anonymous')
        expect(m.getImageData()).to.be.an.instanceOf(ImageData)
      })
  )

  it('should not set crossOrigin flag for images from same origin (relative URL)', () =>
    new BrowserImage().load(RELATIVE_URL)
      .then((m) => {
        expect((m as any).image.crossOrigin, `${RELATIVE_URL} should not have crossOrigin set`)
          .not.to.equal('anonymous')
      })
  )

  it('should not set crossOrigin flag for images from same origin (absolute URL)', () =>
    new BrowserImage().load(SAME_ORIGIN_URL)
      .then((m) => {
        expect((m as any).image.crossOrigin, `${SAME_ORIGIN_URL} should not have crossOrigin set`)
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
      // tslint:disable-next-line:no-floating-promises
      m1.load(img)
        .then(img => done())
    }
  })
})
