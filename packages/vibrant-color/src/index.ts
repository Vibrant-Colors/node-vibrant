import { rgbToHsl, rgbToHex } from './converter'

export interface Filter {
  (red: number, green: number, blue: number, alpha: number): boolean
}

/**
 * 3d floating pointer vector
 */
export type Vec3 = [number, number, number]

/**
 * The layout for a node-vibrant Palette. Allows you to keep track of
 */
export interface Palette {
  Vibrant: Swatch | null
  Muted: Swatch | null
  DarkVibrant: Swatch | null
  DarkMuted: Swatch | null
  LightVibrant: Swatch | null
  LightMuted: Swatch | null
  // ?
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

  /**
   * Make a value copy of a swatch based on a previous one. Returns a new Swatch instance
   * @param {Swatch} swatch
   */
  static clone (swatch: Swatch) {
    return new Swatch(swatch._rgb, swatch._population)
  }
  private _hsl: Vec3
  private _rgb: Vec3
  private _yiq: number
  private _population: number
  private _hex: string

  /**
   * The red value in the RGB value
   */
  get r (): number {
    return this._rgb[0]
  }
  /**
   * The green value in the RGB value
   */
  get g (): number {
    return this._rgb[1]
  }
  /**
   * The blue value in the RGB value
   */
  get b (): number {
    return this._rgb[2]
  }
  /**
   * The color value as a rgb value
   */
  get rgb (): Vec3 {
    return this._rgb
  }
  /**
   * The color value as a hsl value
   */
  get hsl (): Vec3 {
    if (!this._hsl) {
      let [r, g, b] = this._rgb
      this._hsl = rgbToHsl(r, g, b)
    }
    return this._hsl
  }

  /**
   * The color value as a hex string
   */
  get hex (): string {
    if (!this._hex) {
      let [r, g, b] = this._rgb
      this._hex = rgbToHex(r, g, b)
    }
    return this._hex
  }
  get population (): number {
    return this._population
  }

  /**
   * Get the JSON object for the swatch
   */
  toJSON (): {rgb: Vec3, population: number} {
    return {
      rgb: this.rgb,
      population: this.population
    }
  }

  /**
   * Get the color value as a rgb value
   * @deprecated Use property instead
   */
  // TODO: deprecate internally, use property instead
  getRgb (): Vec3 {
    return this._rgb
  }
  /**
   * Get the color value as a hsl value
   * @deprecated Use property instead
   */
  // TODO: deprecate internally, use property instead
  getHsl (): Vec3 {
    return this.hsl
  }
  /**
   * @deprecated Use property instead
   */
  // TODO: deprecate internally, use property instead
  getPopulation (): number {
    return this._population
  }
  /**
   * Get the color value as a hex string
   * @deprecated Use property instead
   */
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
