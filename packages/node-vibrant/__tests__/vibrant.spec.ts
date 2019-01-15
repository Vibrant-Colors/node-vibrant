const TEST_PORT = 3444

import {
  loadTestSamples
} from 'fixtures/sample/loader'

import {
  testVibrant,
  testVibrantAsPromised
} from './common/helper'

import {
  createSampleServer
} from 'fixtures/sample/server'

import http = require('http')

import Vibrant = require('node-vibrant')

const SAMPLES = loadTestSamples(TEST_PORT)

describe('Palette Extraction', () => {
  describe('process samples', () =>
    SAMPLES.forEach((sample) => {
      it(`${sample.name} (callback)`, testVibrant(Vibrant, sample, 'filePath', 'node'))
      it(`${sample.name} (Promise)`, testVibrantAsPromised(Vibrant, sample, 'filePath', 'node'))
    })
  )

  describe('process remote images (http)', function () {
    let server: http.Server | null = null

    before((done) => {
      server = createSampleServer()
      return server.listen(TEST_PORT, done)
    })

    after((done) => server!.close(done))

    SAMPLES.forEach((sample) => {
      it(`${sample.url} (callback)`, testVibrant(Vibrant, sample, 'url', 'node'))
      it(`${sample.url} (Promise)`, testVibrantAsPromised(Vibrant, sample, 'url', 'node'))
    })
  })
})
