/* eslint-env mocha */
import {
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
      it(`${sample.name} (callback)`, testVibrant(Vibrant, sample, 'filePath', 'node'))
      it(`${sample.name} (Promise)`, testVibrantAsPromised(Vibrant, sample, 'filePath', 'node'))
    })
  )

  describe('process remote images (http)', function () {
    let server: http.Server = null!

    before((done) => {
      server = createSampleServer()
      return server.listen(TEST_PORT, done)
    })

    after((done) => server.close(done))

    SAMPLES.forEach((sample) => {
      it(`${sample.url} (callback)`, testVibrant(Vibrant, sample, 'url', 'node'))
      it(`${sample.url} (Promise)`, testVibrantAsPromised(Vibrant, sample, 'url', 'node'))
    })
  })
})
