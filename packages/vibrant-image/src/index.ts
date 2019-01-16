import { Callback } from '@vibrant/types'
import { Filter } from '@vibrant/color'

export type ImageCallback = Callback<Image>

export type ImageSource = string | HTMLImageElement | Buffer

export type Pixels = Uint8ClampedArray | Buffer
export interface ImageData {
  data: Pixels,
  width: number,
  height: number
}

export interface ImageOptions {
  quality: number
  maxDimension: number
}

export interface Image {
  load (image: ImageSource): Promise<Image>
  clear (): void
  update (imageData: ImageData): void
  getWidth (): number
  getHeight (): number
  resize (targetWidth: number, targetHeight: number, ratio: number): void
  getPixelCount (): number
  getImageData (): ImageData
  remove (): void
  scaleDown (opts: ImageOptions): void
}

export interface ImageClass {
  new(): Image
}

export abstract class ImageBase implements Image {
  abstract load (image: ImageSource): Promise<ImageBase>
  abstract clear (): void
  abstract update (imageData: ImageData): void
  abstract getWidth (): number
  abstract getHeight (): number
  abstract resize (targetWidth: number, targetHeight: number, ratio: number): void
  abstract getPixelCount (): number
  abstract getImageData (): ImageData
  abstract remove (): void

  scaleDown (opts: ImageOptions): void {
    let width: number = this.getWidth()
    let height: number = this.getHeight()

    let ratio: number = 1

    if (opts.maxDimension > 0) {
      let maxSide: number = Math.max(width, height)
      if (maxSide > opts.maxDimension) ratio = opts.maxDimension / maxSide
    } else {
      ratio = 1 / opts.quality
    }

    if (ratio < 1) this.resize(width * ratio, height * ratio, ratio)
  }
}

export function applyFilters (imageData: ImageData, filters: Filter[]) {
  if (filters.length > 0) {
    let pixels = imageData.data
    let n = pixels.length / 4
    let offset
    let r
    let g
    let b
    let a
    for (let i = 0; i < n; i++) {
      offset = i * 4
      r = pixels[offset + 0]
      g = pixels[offset + 1]
      b = pixels[offset + 2]
      a = pixels[offset + 3]
      // Mark ignored color
      for (let j = 0; j < filters.length; j++) {
        if (!filters[j](r, g, b, a)) {
          pixels[offset + 3] = 0
          break
        }
      }
    }
  }

  return imageData
}
