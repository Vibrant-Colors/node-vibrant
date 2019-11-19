import {
  Image,
  ImageSource,
  Options,
  ComputedOptions,
  Callback,
  Filter
} from './typing'

import { Palette, Swatch } from './color'

import Builder from './builder'

import * as Util from './util'

import * as Quantizer from './quantizer'
import * as Generator from './generator'
import * as Filters from './filter'

import defaults = require('lodash/defaults')

class Vibrant {
  static Builder = Builder
  static Quantizer = Quantizer
  static Generator = Generator
  static Filter = Filters
  static Util = Util
  static Swatch = Swatch

  static DefaultOpts: Partial<Options> = {
    colorCount: 64,
    quality: 5,
    generator: Generator.Default,
    ImageClass: null!,
    quantizer: Quantizer.MMCQ,
    filters: [Filters.Default]
  }

  static from(src: ImageSource): Builder {
    return new Builder(src)
  }

  opts: ComputedOptions
  private _palette: Palette
  constructor(private _src: ImageSource, opts?: Partial<Options>) {
    this.opts = <ComputedOptions>defaults({}, opts, Vibrant.DefaultOpts)
    this.opts.combinedFilter = Filters.combineFilters(this.opts.filters)!
  }
  private _process(image: Image, opts: ComputedOptions): Promise<Palette> {
    let { quantizer, generator } = opts

    image.scaleDown(opts)

    return image.applyFilter(opts.combinedFilter)
      .then((imageData) => quantizer(imageData.data, opts))
      .then((colors) => Swatch.applyFilter(colors, opts.combinedFilter))
      .then((colors) => Promise.resolve(generator!(colors)))
  }

  palette(): Palette {
    return this.swatches()
  }
  swatches(): Palette {
    return this._palette
  }

  getPalette(cb?: Callback<Palette>): Promise<Palette> {
    let image = new this.opts.ImageClass()
    const result = image.load(this._src)
      .then((image) => this._process(image, this.opts))
      .then((palette) => {
        this._palette = palette
        image.remove()
        return palette
      }, (err) => {
        image.remove()
        throw err
      })
    if (cb) result.then((palette) => cb(null!, palette), (err) => cb(err))
    return result
  }
}

export default Vibrant
