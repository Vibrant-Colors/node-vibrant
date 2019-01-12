import _ = require('lodash')
import path = require('path')

export const TEST_PORT = 3444

import { Sample } from '../../../fixtures/sample/types'
export const SNAPSHOT: Sample[] = require('../../../fixtures/sample/images/palettes.json')

export interface TestSample extends Sample {
  url: string
  relativeUrl: string
}

export type SamplePathKey = Exclude<keyof TestSample, 'palettes'>

export const SAMPLES: TestSample[] = _.map(SNAPSHOT, (s) => _.assign(s, {
  filePath: path.join(__dirname, '../../../fixtures/sample/images/', s.name),
  url: `http://localhost:${TEST_PORT}/${s.name}`,
  relativeUrl: `base/fixtures/sample/images/${s.name}`
}))
