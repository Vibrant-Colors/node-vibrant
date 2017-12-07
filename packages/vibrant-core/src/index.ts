import {
    Options,
    buildProcessOptions
} from './options'
import {
    Callback,
} from '@vibrant/types'
import {
    Image,
    ImageSource,
} from '@vibrant/image'

import { Filter, Palette, Swatch } from '@vibrant/color'

import Bluebird = require('bluebird')
import defaults = require('lodash/defaults')

import Builder from './builder'
import { Pipeline, ProcessOptions, ProcessResult } from './pipeline'

export interface VibrantStatic {
    from(src: ImageSource): Builder
}

export default class Vibrant {
    private _result: ProcessResult
    private static _pipeline: Pipeline
    static use(pipeline: Pipeline) {
        this._pipeline = pipeline
    }
    static DefaultOpts: Partial<Options> = {
        colorCount: 64,
        quality: 5,
        ImageClass: null,
        filters: []
    }

    static from(src: ImageSource): Builder {
        return new Builder(src)
    }

    get result() { return this._result }

    opts: Options
    constructor(private _src: ImageSource, opts?: Partial<Options>) {
        this.opts = <Options>defaults({}, opts, Vibrant.DefaultOpts)
    }
    private _process(image: Image, opts?: Partial<ProcessOptions>): Bluebird<ProcessResult> {
        let { quantizer } = this.opts

        image.scaleDown(this.opts)

        let processOpts = buildProcessOptions(this.opts, opts)

        return Vibrant._pipeline.process(image.getImageData(), processOpts)
    }
    palette(): Palette {
        return this.swatches()
    }
    swatches(): Palette {
        throw new Error('Method deprecated. Use `Vibrant.result.palettes[name]` instead')
    }

    getPalette(name: string, cb?: Callback<Palette>): Bluebird<Palette>
    getPalette(cb?: Callback<Palette>): Bluebird<Palette>
    getPalette(): Bluebird<Palette> {
        const arg0 = arguments[0],
            arg1 = arguments[1]
        const name = typeof arg0 === 'string'
            ? arg0
            : 'default'
        const cb = typeof arg0 === 'string'
            ? arg1
            : arg0
        let image = new this.opts.ImageClass()
        return image.load(this._src)
            .then((image) => this._process(image, { generators: [name] }))
            .tap((result) => this._result = result)
            .then((result) => result.palettes[name])
            .finally(() => image.remove())
            .asCallback(cb)
    }
    getPalettes(names: string[], cb?: Callback<Palette>): Bluebird<{ [name: string]: Palette }>
    getPalettes(cb?: Callback<Palette>): Bluebird<{ [name: string]: Palette }>
    getPalettes(): Bluebird<{ [name: string]: Palette }> {
        const arg0 = arguments[0],
            arg1 = arguments[1]
        const names = Array.isArray(arg0)
            ? arg0
            : ['*']
        const cb = Array.isArray(arg0)
            ? arg1
            : arg0
        let image = new this.opts.ImageClass()
        return image.load(this._src)
            .then((image) => this._process(image, { generators: names }))
            .tap((result) => this._result = result)
            .then((result) => result.palettes)
            .finally(() => image.remove())
            .asCallback(cb)
    }

}