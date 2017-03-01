import WorkerPool from './worker/pool'

import Bluebird = require('bluebird')
import {
    Quantizer,
    Pixels,
    ComputedOptions
} from '../typing'
import { Swatch } from '../color'

const quantizeInWorker: Quantizer = (pixels: Pixels, opts: ComputedOptions): Bluebird<Swatch[]> =>
    WorkerPool.instance.quantize(pixels, opts)

export default quantizeInWorker
