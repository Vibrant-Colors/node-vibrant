import _ = require('lodash')
import path = require('path')

export const TEST_PORT = 3444

// Values from actual execution in different browsers.
// Qualiy is set to 1 and not filters are used since downsampling are inconsistent
// across browsers.
// Comfirmed visually and established as baseline for future versions
export const REFERENCE_PALETTE: any = {
    chrome: require('../../../data/chrome-exec-ref.json'),
    firefox: require('../../../data/firefox-exec-ref.json'),
    ie: require('../../../data/ie11-exec-ref.json')
}

export const TARGETS = Object.keys(REFERENCE_PALETTE)


export interface Sample {
    i: number
    fileName: string
    filePath: string
    url: string
    relativeUrl: string
}

export type SamplePathKey = 'filePath' | 'url' | 'relativeUrl'

export const SAMPLES: Sample[] = _.range(1, 5).map((i) => ({
    i,
    fileName: `${i}.jpg`,
    filePath: path.join(__dirname, `../../../data/${i}.jpg`),
    url: `http://localhost:${TEST_PORT}/${i}.jpg`,
    relativeUrl: `base/data/${i}.jpg`
}))

