import {
  Callback,
  ImageClass,
  ImageSource,
  Options,
  Filter,
  Quantizer,
  Generator
} from './typing'

import { Palette } from './color'
import Vibrant from './vibrant'

import clone = require('lodash/clone')

export default class Builder {
  private _src: ImageSource
  private _opts: Partial<Options>
  constructor(src: ImageSource, opts: Partial<Options> = {}) {
    this._src = src
    this._opts = opts
    this._opts.filters = clone(Vibrant.DefaultOpts.filters)
  }

  maxColorCount(n: number): Builder {
    this._opts.colorCount = n
    return this
  }

  maxDimension(d: number): Builder {
    this._opts.maxDimension = d
    return this
  }

  addFilter(f: Filter): Builder {
    this._opts.filters!.push(f)
    return this
  }

  removeFilter(f: Filter): Builder {
    let i = this._opts.filters!.indexOf(f)
    if (i > 0) this._opts.filters!.splice(i)
    return this
  }

  clearFilters(): Builder {
    this._opts.filters = []
    return this
  }

  quality(q: number): Builder {
    this._opts.quality = q
    return this
  }

  useImageClass(imageClass: ImageClass): Builder {
    this._opts.ImageClass = imageClass
    return this
  }

  useGenerator(generator: Generator): Builder {
    this._opts.generator = generator
    return this
  }

  useQuantizer(quantizer: Quantizer): Builder {
    this._opts.quantizer = quantizer
    return this
  }

  build(): Vibrant {
    return new Vibrant(this._src, this._opts)
  }

  getPalette(cb?: Callback<Palette>): Promise<Palette> {
    return this.build().getPalette(cb)
  }
  getSwatches(cb?: Callback<Palette>): Promise<Palette> {
    return this.build().getPalette(cb)
  }
}
