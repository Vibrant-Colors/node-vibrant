import { rgbToHsl, rgbToHex } from './util'

export interface Vec3 extends Array<number> {
    0: number,
    1: number,
    2: number
}

export interface Palette {
    Vibrant?: Swatch,
    Muted?: Swatch,
    DarkVibrant?: Swatch,
    DarkMuted?: Swatch,
    LightVibrant?: Swatch,
    LightMuted?: Swatch
    [name: string]: Swatch
}


export class Swatch {
    private _hsl: Vec3
    private _rgb: Vec3
    private _yiq: number
    private _population: number
    private _hex: string
    getRgb(): Vec3 { return this._rgb }
    getHsl(): Vec3 {
        if (!this._hsl) {
            let [r, g, b] = this._rgb
            this._hsl = rgbToHsl(r, g, b)
        }
        return this._hsl
    }
    getPopulation(): number { return this._population }

    getHex(): string {
        if (!this._hex) {
            let [r, g, b] = this._rgb
            this._hex = rgbToHex(r, g, b)
        }
        return this._hex
    }

    private getYiq(): number {
        if (!this._yiq) {
            let rgb = this._rgb
            this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
        }
        return this._yiq
    }

    getTitleTextColor(): string {
        return this.getYiq() < 200 ? '#fff' : '#000'
    }

    getBodyTextColor(): string {
        return this.getYiq() < 150 ? '#fff' : '#000'
    }

    constructor(rgb: Vec3, population: number) {
        this._rgb = rgb
        this._population = population
    }
}