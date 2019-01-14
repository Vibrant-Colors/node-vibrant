import { Palette, Swatch, Filter } from '@vibrant/color'
import { Image, ImageClass, ImageSource, ImageOptions } from '@vibrant/image'
import { Quantizer, QuantizerOptions } from '@vibrant/quantizer'
import { Generator } from '@vibrant/generator'
import { StageOptions, ProcessOptions } from './pipeline'
import defaultsDeep = require('lodash/defaultsDeep')

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
  q.options = defaultsDeep({}, q.options, commonQuantizerOpts)

  return defaultsDeep({}, override, {
    quantizer: q,
    generators,
    filters
  })
}
