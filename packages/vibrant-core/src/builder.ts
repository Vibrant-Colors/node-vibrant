import {
  Options
} from './options'
import {
  Callback
} from '@vibrant/types'
import {
  ImageClass,
  ImageSource
} from '@vibrant/image'

import {
  Filter,
  Palette
} from '@vibrant/color'
import Vibrant from './'
import { assignDeep } from './utils'

export default class Builder {
  private _src: ImageSource
  private _opts: Partial<Options>
  constructor (src: ImageSource, opts: Partial<Options> = {}) {
    this._src = src
    this._opts = assignDeep({}, Vibrant.DefaultOpts, opts)
  }

  maxColorCount (n: number): Builder {
    this._opts.colorCount = n
    return this
  }

  maxDimension (d: number): Builder {
    this._opts.maxDimension = d
    return this
  }

  addFilter (name: string): Builder {
    if (!this._opts.filters) {
      this._opts.filters = [name]
    } else {
      this._opts.filters.push(name)
    }
    return this
  }

  removeFilter (name: string): Builder {
    if (this._opts.filters) {
      let i = this._opts.filters.indexOf(name)
      if (i > 0) this._opts.filters.splice(i)
    }
    return this
  }

  clearFilters (): Builder {
    this._opts.filters = []
    return this
  }

  quality (q: number): Builder {
    this._opts.quality = q
    return this
  }

  useImageClass (imageClass: ImageClass): Builder {
    this._opts.ImageClass = imageClass
    return this
  }

  useGenerator (generator: string, options?: any): Builder {
    if (!this._opts.generators) this._opts.generators = []
    this._opts.generators.push(options ? { name: generator, options } : generator)
    return this
  }

  useQuantizer (quantizer: string, options?: any): Builder {
    this._opts.quantizer = options ? { name: quantizer, options } : quantizer
    return this
  }

  build (): Vibrant {
    return new Vibrant(this._src, this._opts)
  }

  getPalette (cb?: Callback<Palette>): Promise<Palette> {
    return this.build().getPalette(cb)
  }
  getSwatches (cb?: Callback<Palette>): Promise<Palette> {
    return this.build().getPalette(cb)
  }
}
