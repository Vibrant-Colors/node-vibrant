import { Palette, Swatch, Filter } from '@vibrant/color'
import { Image, ImageClass, ImageSource, ImageOptions } from '@vibrant/image'
import { Quantizer, QuantizerOptions } from '@vibrant/quantizer'
import { Generator } from '@vibrant/generator'
import { StageOptions, ProcessOptions } from './pipeline'
import { assignDeep } from './utils'

export interface Options extends ImageOptions, QuantizerOptions {
  useWorker: boolean
  ImageClass: ImageClass
  quantizer: string | StageOptions
  generators: (string | StageOptions)[]
  filters: string[]
}

export function buildProcessOptions (opts: Options, override?: Partial<ProcessOptions>): ProcessOptions {
  let { colorCount, quantizer, generators, filters } = opts
  // Merge with common quantizer options
  let commonQuantizerOpts = { colorCount }
  let q = typeof quantizer === 'string'
    ? { name: quantizer, options: {} }
    : quantizer
  q.options = assignDeep({}, commonQuantizerOpts, q.options)

  return assignDeep({}, {
    quantizer: q,
    generators,
    filters
  }, override)
}
