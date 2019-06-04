import { Filter } from './typing'
import { rgbToHsl, rgbToHex } from './util'
import filter = require('lodash/filter')

export type Vec3 = [number, number, number]

export interface Palette {
  Vibrant?: Swatch,
  Muted?: Swatch,
  DarkVibrant?: Swatch,
  DarkMuted?: Swatch,
  LightVibrant?: Swatch,
  LightMuted?: Swatch
  [name: string]: Swatch | undefined
}

export class Swatch {
  static applyFilter(colors: Swatch[], f: Filter): Swatch[] {
    return typeof f === 'function'
      ? filter(colors, ({ r, g, b }) => f(r, g, b, 255))
      : colors
  }
  private _hsl: Vec3
  private _rgb: Vec3
  private _yiq: number
  private _population: number
  private _hex: string
  get r() { return this._rgb[0] }
  get g() { return this._rgb[1] }
  get b() { return this._rgb[2] }
  get rgb() { return this._rgb }
  get hsl() {
    if (!this._hsl) {
      let [r, g, b] = this._rgb
      this._hsl = rgbToHsl(r, g, b)
    }
    return this._hsl
  }
  get hex() {
    if (!this._hex) {
      let [r, g, b] = this._rgb
      this._hex = rgbToHex(r, g, b)
    }
    return this._hex
  }
  get population() { return this._population }

  toJSON() {
    return {
      rgb: this.rgb,
      population: this.population
    }
  }

  // TODO: deprecate internally, use property instead
  getRgb(): Vec3 { return this._rgb }
  // TODO: deprecate internally, use property instead
  getHsl(): Vec3 { return this.hsl }
  // TODO: deprecate internally, use property instead
  getPopulation(): number { return this._population }
  // TODO: deprecate internally, use property instead
  getHex(): string { return this.hex }

  private getYiq(): number {
    if (!this._yiq) {
      let rgb = this._rgb
      this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
    }
    return this._yiq
  }
  private _titleTextColor: string
  private _bodyTextColor: string

  get titleTextColor() {
    if (!this._titleTextColor) {
      this._titleTextColor = this.getYiq() < 200 ? '#fff' : '#000'
    }
    return this._titleTextColor
  }
  get bodyTextColor() {
    if (!this._bodyTextColor) {
      this._bodyTextColor = this.getYiq() < 150 ? '#fff' : '#000'
    }
    return this._bodyTextColor
  }
  getTitleTextColor(): string {
    return this.titleTextColor
  }

  getBodyTextColor(): string {
    return this.bodyTextColor
  }

  constructor(rgb: Vec3, population: number) {
    this._rgb = rgb
    this._population = population
  }
}
