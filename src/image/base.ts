import * as Bluebird from 'bluebird'
import { Image, Options, ImageData, ImageSource } from '../typing'

export abstract class ImageBase implements Image {
    abstract load (image: ImageSource ): Bluebird<ImageBase>
    abstract clear (): void
    abstract update (imageData: ImageData): void
    abstract getWidth (): number
    abstract getHeight (): number
    abstract resize (targetWidth: number, targetHeight: number, ratio: number): void
    abstract getPixelCount () : number
    abstract getImageData (): ImageData
    abstract remove (): void
    
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
} 