import { ImageBase, ImageData, ImageSource } from "@vibrant/image";
import configure from "@jimp/custom";
import types from "@jimp/types";
import resize from "@jimp/plugin-resize";

const Jimp = configure({
  types: [types],
  plugins: [resize],
});

interface ProtocalHandler {
  get(url: string | any, cb?: (res: any) => void): any;
}

interface ProtocalHandlerMap {
  [protocolName: string]: ProtocalHandler;
}

const URL_REGEX = /^(\w+):\/\/.*/i;

type NodeImageSource = string | Buffer;

export default class NodeImage extends ImageBase {
  private _image: InstanceType<typeof Jimp>;

  private async _loadByProtocolHandler(src: string): Promise<Buffer> {
    const res = await fetch(src, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${src}`);
    }

    const stream = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const { value, done: doneValue } = await stream.read();
      if (value) {
        chunks.push(value);
      }
      done = doneValue;
    }

    return Buffer.concat(chunks);
  }

  private _loadFromPath(src: string): Promise<ImageBase> {
    const m = URL_REGEX.exec(src);
    if (m) {
      const protocol = m[1].toLocaleLowerCase();
      return this._loadByProtocolHandler(src).then((buf) =>
        this._loadByJimp(buf)
      );
    } else {
      return this._loadByJimp(src);
    }
  }

  private _loadByJimp(src: NodeImageSource): Promise<ImageBase> {
    // NOTE: TypeScript doesn't support union type to overloads yet
    //       Use type assertion to bypass compiler error
    return Jimp.read(src as Buffer).then((result) => {
      this._image = result;
      return this;
    });
  }

  load(image: ImageSource): Promise<ImageBase> {
    if (typeof image === "string") {
      return this._loadFromPath(image);
    } else if (image instanceof Buffer) {
      return this._loadByJimp(image);
    } else {
      return Promise.reject(
        new Error("Cannot load image from HTMLImageElement in node environment")
      );
    }
  }

  clear(): void {}

  update(imageData: ImageData): void {}

  getWidth(): number {
    return this._image.bitmap.width;
  }

  getHeight(): number {
    return this._image.bitmap.height;
  }

  resize(targetWidth: number, targetHeight: number, ratio: number): void {
    this._image.resize(targetWidth, targetHeight);
  }

  getPixelCount(): number {
    const bitmap = this._image.bitmap;
    return bitmap.width * bitmap.height;
  }

  getImageData(): ImageData {
    return this._image.bitmap;
  }

  remove(): void {}
}
