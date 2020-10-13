import { ImageData, ImageSource } from '../typing'
import { ImageBase } from './base'
import * as http from 'http'
import * as https from 'https'
import configure from '@jimp/custom'
import types from '@jimp/types'
import resize from '@jimp/plugin-resize'

const Jimp = configure({
  types: [types],
  plugins: [resize]
})

interface ProtocalHandler {
  get(url: string | any, cb?: (res: any) => void): any
}

interface ProtocalHandlerMap {
  [protocolName: string]: ProtocalHandler
}

const URL_REGEX: RegExp = /^(\w+):\/\/.*/i

const PROTOCOL_HANDLERS: ProtocalHandlerMap = {
  http, https
}

type NodeImageSource = string | Buffer

export default class NodeImage extends ImageBase {
  private _image: InstanceType<typeof Jimp>
  private _loadByProtocolHandler (handler: ProtocalHandler, src: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      handler.get(src, (r: any) => {
        let buf = Buffer.alloc(0)
        r.on('data', (data: any) => { buf = Buffer.concat([buf, data]) })
        r.on('end', () => resolve(buf))
        r.on('error', (e: Error) => reject(e))
      }).on('error', (e: Error) => reject(e))
    })
  }
  private _loadFromPath (src: string): Promise<ImageBase> {
    let m = URL_REGEX.exec(src)
    if (m) {
      let protocol = m[1].toLocaleLowerCase()
      let handler = PROTOCOL_HANDLERS[protocol]
      if (!handler) {
        return Promise.reject(new Error(`Unsupported protocol: ${protocol}`))
      }
      return this._loadByProtocolHandler(handler, src)
        .then((buf) => this._loadByJimp(buf))
    } else {
      return this._loadByJimp(src)
    }
  }
  private _loadByJimp (src: NodeImageSource): Promise<ImageBase> {
    // NOTE: TypeScript doesn't support union type to overloads yet
    //       Use type assertion to bypass compiler error
    return Jimp.read(<string>src)
      .then((result) => {
        this._image = result
        return this
      })
  }
  load (image: ImageSource): Promise<ImageBase> {
    if (typeof image === 'string') {
      return this._loadFromPath(image)
    } else if (image instanceof Buffer) {
      return this._loadByJimp(image)
    } else {
      return Promise.reject(new Error('Cannot load image from HTMLImageElement in node environment'))
    }
  }
  clear (): void {

  }
  update (imageData: ImageData): void {

  }
  getWidth (): number {
    return this._image.bitmap.width
  }
  getHeight (): number {
    return this._image.bitmap.height
  }
  resize (targetWidth: number, targetHeight: number, ratio: number): void {
    this._image.resize(targetWidth, targetHeight)
  }
  getPixelCount (): number {
    let bitmap = this._image.bitmap
    return bitmap.width * bitmap.height
  }
  getImageData (): ImageData {
    return this._image.bitmap
  }
  remove (): void {

  }
}
