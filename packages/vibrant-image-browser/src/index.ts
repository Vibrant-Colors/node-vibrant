import {
  ImageOptions,
  ImageData as VibrantImageData,
  ImageSource,
  ImageCallback,
  ImageBase
} from '@vibrant/image'

function isRelativeUrl (url: string): boolean {
  let u = new URL(url, location.href)
  return u.protocol === location.protocol &&
    u.host === location.host &&
    u.port === location.port
}

function isSameOrigin (a: string, b: string): boolean {
  let ua = new URL(a)
  let ub = new URL(b)

  // https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  return (
    ua.protocol === ub.protocol &&
    ua.hostname === ub.hostname &&
    ua.port === ub.port
  )
}

export default class BrowserImage extends ImageBase {
  image: HTMLImageElement
  private _canvas: HTMLCanvasElement
  private _context: CanvasRenderingContext2D
  private _width: number
  private _height: number
  private _initCanvas (): void {
    const img = this.image
    const canvas = (this._canvas = document.createElement('canvas'))
    const context = (canvas.getContext('2d'))

    if (!context) throw new ReferenceError('Failed to create canvas context')

    this._context = context

    canvas.className = '@vibrant/canvas'
    canvas.style.display = 'none'

    this._width = canvas.width = img.width
    this._height = canvas.height = img.height

    context.drawImage(img, 0, 0)

    document.body.appendChild(canvas)
  }
  load (image: ImageSource): Promise<ImageBase> {
    let img: HTMLImageElement
    let src: string
    if (typeof image === 'string') {
      img = document.createElement('img')
      src = image

      if (!isRelativeUrl(src) && !isSameOrigin(window.location.href, src)) {
        img.crossOrigin = 'anonymous'
      }

      img.src = src
    } else if (image instanceof HTMLImageElement) {
      img = image
      src = image.src
    } else {
      return Promise.reject(
        new Error(`Cannot load buffer as an image in browser`)
      )
    }
    this.image = img

    return new Promise<ImageBase>((resolve, reject) => {
      let onImageLoad = () => {
        this._initCanvas()
        resolve(this)
      }

      if (img.complete) {
        // Already loaded
        onImageLoad()
      } else {
        img.onload = onImageLoad
        img.onerror = e => reject(new Error(`Fail to load image: ${src}`))
      }
    })
  }
  clear (): void {
    this._context.clearRect(0, 0, this._width, this._height)
  }
  update (imageData: VibrantImageData): void {
    this._context.putImageData(imageData as ImageData, 0, 0)
  }
  getWidth (): number {
    return this._width
  }
  getHeight (): number {
    return this._height
  }
  resize (targetWidth: number, targetHeight: number, ratio: number): void {
    let { _canvas: canvas, _context: context, image: img } = this

    this._width = canvas.width = targetWidth
    this._height = canvas.height = targetHeight

    context.scale(ratio, ratio)
    context.drawImage(img, 0, 0)
  }
  getPixelCount (): number {
    return this._width * this._height
  }
  getImageData (): ImageData {
    return this._context.getImageData(0, 0, this._width, this._height)
  }
  remove (): void {
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas)
    }
  }
}
