import { Pixels } from '@vibrant/image'
import { Resolvable } from '@vibrant/types'
import { Swatch } from '@vibrant/color'

export interface QuantizerOptions {
  colorCount: number
}
export interface Quantizer {
  (pixels: Pixels, opts: QuantizerOptions): Resolvable<Array<Swatch>>
}
