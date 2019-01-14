import { Palette, Swatch } from '@vibrant/color'
import { Resolvable } from '@vibrant/types'

export interface Generator {
  (swatches: Swatch[], opts?: Object): Resolvable<Palette>
}
