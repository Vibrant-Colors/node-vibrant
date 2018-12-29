/* eslint-env mocha */
import {
  REFERENCE_PALETTE,
  TEST_PORT,
  SAMPLES
} from './common/data'
import {
  testVibrant,
  testVibrantAsPromised
} from './common/helper'

import {
  createSampleServer
} from './common/server'
import Builder from '../builder'

import http = require('http')

import Vibrant = require('../')

describe('Palette Extraction', () => {
  describe('process samples', () =>
    SAMPLES.forEach((sample) => {
      it(`${sample.fileName} (callback)`, testVibrant(Vibrant, sample))
      it(`${sample.fileName} (Promise)`, testVibrantAsPromised(Vibrant, sample))
    })
  )

  describe('process samples (no filters)', () =>
    SAMPLES.forEach((sample) => {
      const builderCallback = (builder: Builder) => builder.clearFilters()

      it(`${sample.fileName} (callback)`, testVibrant(Vibrant, sample, 'filePath', builderCallback, REFERENCE_PALETTE))
      it(`${sample.fileName} (Promise)`, testVibrantAsPromised(Vibrant, sample, 'filePath', builderCallback, REFERENCE_PALETTE))
    })
  )

  describe('process remote images (http)', function () {
    let server: http.Server = null

    before((done) => {
      server = createSampleServer()
      return server.listen(TEST_PORT, done)
    })

    after((done) => server.close(done))

    SAMPLES.forEach((sample) => {
      it(`${sample.url} (callback)`, testVibrant(Vibrant, sample))
      it(`${sample.url} (Promise)`, testVibrantAsPromised(Vibrant, sample))
    })
  })
})
