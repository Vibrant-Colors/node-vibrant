import WorkerPool from './worker/pool'

import {
  Quantizer,
  Pixels,
  ComputedOptions
} from '../typing'
import { Swatch } from '../color'

const quantizeInWorker: Quantizer = (pixels: Pixels, opts: ComputedOptions): Promise<Swatch[]> =>
  WorkerPool.instance.quantize(pixels, opts)

export default quantizeInWorker
