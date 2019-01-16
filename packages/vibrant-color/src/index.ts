import { rgbToHsl, rgbToHex } from './converter'

export interface Filter {
  (red: number, green: number, blue: number, alpha: number): boolean
}

export type Vec3 = [number, number, number]

export interface Palette {
  Vibrant: Swatch | null
  Muted: Swatch | null
  DarkVibrant: Swatch | null
  DarkMuted: Swatch | null
  LightVibrant: Swatch | null
  LightMuted: Swatch | null
  [name: string]: Swatch | null
}

export class Swatch {
  static applyFilters (colors: Swatch[], filters: Filter[]): Swatch[] {
    return filters.length > 0
      ? colors.filter(({ r, g, b }) => {
        for (let j = 0; j < filters.length; j++) {
          if (!filters[j](r, g, b, 255)) return false
        }
        return true
      })
      : colors
  }
  static clone (swatch: Swatch) {
    return new Swatch(swatch._rgb, swatch._population)
  }
  private _hsl: Vec3
  private _rgb: Vec3
  private _yiq: number
  private _population: number
  private _hex: string
  get r (): number {
    return this._rgb[0]
  }
  get g (): number {
    return this._rgb[1]
  }
  get b (): number {
    return this._rgb[2]
  }
  get rgb (): Vec3 {
    return this._rgb
  }
  get hsl (): Vec3 {
    if (!this._hsl) {
      let [r, g, b] = this._rgb
      this._hsl = rgbToHsl(r, g, b)
    }
    return this._hsl
  }
  get hex () {
    if (!this._hex) {
      let [r, g, b] = this._rgb
      this._hex = rgbToHex(r, g, b)
    }
    return this._hex
  }
  get population (): number {
    return this._population
  }

  toJSON () {
    return {
      rgb: this.rgb,
      population: this.population
    }
  }

  // TODO: deprecate internally, use property instead
  getRgb (): Vec3 {
    return this._rgb
  }
  // TODO: deprecate internally, use property instead
  getHsl (): Vec3 {
    return this.hsl
  }
  // TODO: deprecate internally, use property instead
  getPopulation (): number {
    return this._population
  }
  // TODO: deprecate internally, use property instead
  getHex (): string {
    return this.hex
  }

  private getYiq (): number {
    if (!this._yiq) {
      let rgb = this._rgb
      this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
    }
    return this._yiq
  }

  private _titleTextColor: string
  private _bodyTextColor: string

  get titleTextColor () {
    if (this._titleTextColor) {
      this._titleTextColor = this.getYiq() < 200 ? '#fff' : '#000'
    }
    return this._titleTextColor
  }
  get bodyTextColor () {
    if (this._bodyTextColor) {
      this._bodyTextColor = this.getYiq() < 150 ? '#fff' : '#000'
    }
    return this._bodyTextColor
  }
  getTitleTextColor (): string {
    return this.titleTextColor
  }

  getBodyTextColor (): string {
    return this.bodyTextColor
  }

  constructor (rgb: Vec3, population: number) {
    this._rgb = rgb
    this._population = population
  }
}
