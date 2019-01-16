import { Options, buildProcessOptions } from './options'
import { Callback } from '@vibrant/types'
import { Image, ImageSource } from '@vibrant/image'

import { Filter, Palette, Swatch } from '@vibrant/color'

import Builder from './builder'
import { Pipeline, ProcessOptions, ProcessResult } from './pipeline'
import { assignDeep } from './utils'

export interface VibrantStatic {
  from (src: ImageSource): Builder
}

export default class Vibrant {
  private _result: ProcessResult
  private static _pipeline: Pipeline
  static use (pipeline: Pipeline) {
    this._pipeline = pipeline
  }
  static DefaultOpts: Partial<Options> = {
    colorCount: 64,
    quality: 5,
    filters: []
  }

  static from (src: ImageSource): Builder {
    return new Builder(src)
  }

  get result () {
    return this._result
  }

  opts: Options
  constructor (private _src: ImageSource, opts?: Partial<Options>) {
    this.opts = assignDeep({}, Vibrant.DefaultOpts, opts)
  }
  private _process (
    image: Image,
    opts?: Partial<ProcessOptions>
  ): Promise<ProcessResult> {
    let { quantizer } = this.opts

    image.scaleDown(this.opts)

    let processOpts = buildProcessOptions(this.opts, opts)

    return Vibrant._pipeline.process(image.getImageData(), processOpts)
  }
  palette (): Palette {
    return this.swatches()
  }
  swatches (): Palette {
    throw new Error(
      'Method deprecated. Use `Vibrant.result.palettes[name]` instead'
    )
  }

  getPalette (name: string, cb?: Callback<Palette>): Promise<Palette>
  getPalette (cb?: Callback<Palette>): Promise<Palette>
  getPalette (): Promise<Palette> {
    const arg0 = arguments[0]
    const arg1 = arguments[1]
    const name = typeof arg0 === 'string' ? arg0 : 'default'
    const cb = typeof arg0 === 'string' ? arg1 : arg0
    let image = new this.opts.ImageClass()
    return image
      .load(this._src)
      .then(image => this._process(image, { generators: [name] }))
      .then(result => {
        this._result = result
        return result.palettes[name]
      })
      .then(res => {
        image.remove()
        if (cb) {
          cb(undefined, res)
        }
        return res
      })
      .catch(err => {
        image.remove()
        if (cb) {
          cb(err)
        }
        return Promise.reject(err)
      })
  }
  getPalettes (
    names: string[],
    cb?: Callback<Palette>
  ): Promise<{ [name: string]: Palette }>
  getPalettes (cb?: Callback<Palette>): Promise<{ [name: string]: Palette }>
  getPalettes (): Promise<{ [name: string]: Palette }> {
    const arg0 = arguments[0]
    const arg1 = arguments[1]
    const names = Array.isArray(arg0) ? arg0 : ['*']
    const cb = Array.isArray(arg0) ? arg1 : arg0
    let image = new this.opts.ImageClass()
    return image
      .load(this._src)
      .then(image =>
        this._process(image, {
          generators: names
        })
      )
      .then(result => {
        this._result = result
        return result.palettes
      })
      .then(res => {
        image.remove()
        if (cb) {
          cb(undefined, res)
        }
        return res
      })
      .catch(err => {
        image.remove()
        if (cb) {
          cb(err)
        }
        return Promise.reject(err)
      })
  }
}
