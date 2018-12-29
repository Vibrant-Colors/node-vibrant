import { Filter, Image, Options, ImageData, ImageSource } from '../typing'

export abstract class ImageBase implements Image {
  abstract load(image: ImageSource): Promise<ImageBase>
  abstract clear(): void
  abstract update(imageData: ImageData): void
  abstract getWidth(): number
  abstract getHeight(): number
  abstract resize(targetWidth: number, targetHeight: number, ratio: number): void
  abstract getPixelCount(): number
  abstract getImageData(): ImageData
  abstract remove(): void

  scaleDown (opts: Options): void {
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

  applyFilter (filter: Filter): Promise<ImageData> {
    let imageData = this.getImageData()

    if (typeof filter === 'function') {
      let pixels = imageData.data
      let n = pixels.length / 4
      let offset, r, g, b, a
      for (let i = 0; i < n; i++) {
        offset = i * 4
        r = pixels[offset + 0]
        g = pixels[offset + 1]
        b = pixels[offset + 2]
        a = pixels[offset + 3]
        // Mark ignored color
        if (!filter(r, g, b, a)) pixels[offset + 3] = 0
      }
    }

    return Promise.resolve(imageData)
  }
}
