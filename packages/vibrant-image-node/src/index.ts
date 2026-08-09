import { ImageBase } from "@vibrant/image";
import { createJimp } from "@jimp/core";
import bmp, { msBmp } from "@jimp/js-bmp";
import gif from "@jimp/js-gif";
import jpeg from "@jimp/js-jpeg";
import png from "@jimp/js-png";
import tiff from "@jimp/js-tiff";
import * as resize from "@jimp/plugin-resize";
import type { ImageData, ImageSource } from "@vibrant/image";

// Only decoding and resizing are ever used, so the class is composed from those
// pieces rather than importing the `jimp` bundle, which would add every other
// plugin to the dependents of this package.
const Jimp = createJimp({
	formats: [bmp, msBmp, gif, jpeg, png, tiff],
	plugins: [resize.methods],
});

// Taken from the loaders rather than written as InstanceType<typeof Jimp>. The
// two are structurally different, because `write` resolves its extension and
// mime generics differently on the class than on what the loaders return.
type LoadedImage = Awaited<
	ReturnType<typeof Jimp.read | typeof Jimp.fromBuffer>
>;

const URL_REGEX = /^(\w+):\/\/.*/i;

type NodeImageSource = string | Buffer;

export class NodeImage extends ImageBase {
	private _image: LoadedImage | undefined;

	private _getImage() {
		if (!this._image) {
			throw new Error("Image not loaded");
		}
		return this._image;
	}

	private async _loadByProtocolHandler(src: string): Promise<Buffer> {
		const res = await fetch(src, {
			method: "GET",
		});

		if (!res.ok || !res.body) {
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
			return this._loadByProtocolHandler(src).then((buf) =>
				this._loadByJimp(buf),
			);
		} else {
			return this._loadByJimp(src);
		}
	}

	private _loadByJimp(src: NodeImageSource): Promise<ImageBase> {
		const read =
			typeof src === "string" ? Jimp.read(src) : Jimp.fromBuffer(src);

		return read.then((result) => {
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
				new Error(
					"Cannot load image from HTMLImageElement in node environment",
				),
			);
		}
	}

	clear(): void {}

	update(_imageData: ImageData): void {}

	getWidth(): number {
		return this._getImage().bitmap.width;
	}

	getHeight(): number {
		return this._getImage().bitmap.height;
	}

	resize(targetWidth: number, targetHeight: number, _ratio: number): void {
		// ImageBase.scaleDown passes fractional dimensions. Jimp 0.x rounded them
		// internally; keep that explicit so the resized bitmap is unchanged.
		this._getImage().resize({
			w: Math.round(targetWidth) || 1,
			h: Math.round(targetHeight) || 1,
		});
	}

	getPixelCount(): number {
		const bitmap = this._getImage().bitmap;
		return bitmap.width * bitmap.height;
	}

	getImageData(): ImageData {
		return this._getImage().bitmap;
	}

	remove(): void {}
}
