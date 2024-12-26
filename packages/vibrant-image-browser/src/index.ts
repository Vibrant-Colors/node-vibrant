import { ImageBase } from "@vibrant/image";
import type {
	ImageSource,
	ImageData as VibrantImageData,
} from "@vibrant/image";

function isRelativeUrl(url: string): boolean {
	const u = new URL(url, location.href);
	return (
		u.protocol === location.protocol &&
		u.host === location.host &&
		u.port === location.port
	);
}

function isSameOrigin(a: string, b: string): boolean {
	const ua = new URL(a);
	const ub = new URL(b);

	// https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
	return (
		ua.protocol === ub.protocol &&
		ua.hostname === ub.hostname &&
		ua.port === ub.port
	);
}

export class BrowserImage extends ImageBase {
	image: HTMLImageElement | undefined;
	private _canvas: HTMLCanvasElement | undefined;
	private _context: CanvasRenderingContext2D | undefined;
	private _width: number | undefined;
	private _height: number | undefined;

	private _getCanvas() {
		if (!this._canvas) {
			throw new Error("Canvas is not initialized");
		}

		return this._canvas;
	}
	private _getContext() {
		if (!this._context) {
			throw new Error("Context is not initialized");
		}

		return this._context;
	}
	private _getWidth() {
		if (!this._width) {
			throw new Error("Width is not initialized");
		}

		return this._width;
	}
	private _getHeight() {
		if (!this._height) {
			throw new Error("Height is not initialized");
		}

		return this._height;
	}

	private _initCanvas(): void {
		const img = this.image;
		if (!img) {
			throw new Error("Image is not initialized");
		}
		const canvas = (this._canvas = document.createElement("canvas"));
		const context = canvas.getContext("2d");

		if (!context) throw new ReferenceError("Failed to create canvas context");

		this._context = context;

		canvas.className = "@vibrant/canvas";
		canvas.style.display = "none";

		this._width = canvas.width = img.width;
		this._height = canvas.height = img.height;

		context.drawImage(img, 0, 0);

		document.body.appendChild(canvas);
	}

	load(image: ImageSource): Promise<this> {
		let img: HTMLImageElement;
		let src: string;
		if (typeof image === "string") {
			img = document.createElement("img");
			src = image;

			if (!isRelativeUrl(src) && !isSameOrigin(window.location.href, src)) {
				img.crossOrigin = "anonymous";
			}

			img.src = src;
		} else if (image instanceof HTMLImageElement) {
			img = image;
			src = image.src;
		} else {
			return Promise.reject(
				new Error(`Cannot load buffer as an image in browser`),
			);
		}
		this.image = img;

		return new Promise<this>((resolve, reject) => {
			const onImageLoad = () => {
				this._initCanvas();
				resolve(this);
			};

			if (img.complete) {
				// Already loaded
				onImageLoad();
			} else {
				img.onload = onImageLoad;
				img.onerror = (_e) => reject(new Error(`Fail to load image: ${src}`));
			}
		});
	}

	clear(): void {
		this._getContext().clearRect(0, 0, this._getWidth(), this._getHeight());
	}

	update(imageData: VibrantImageData): void {
		this._getContext().putImageData(imageData as ImageData, 0, 0);
	}

	getWidth(): number {
		return this._getWidth();
	}

	getHeight(): number {
		return this._getHeight();
	}

	resize(targetWidth: number, targetHeight: number, ratio: number): void {
		if (!this.image) {
			throw new Error("Image is not initialized");
		}
		this._width = this._getCanvas().width = targetWidth;
		this._height = this._getCanvas().height = targetHeight;

		this._getContext().scale(ratio, ratio);
		this._getContext().drawImage(this.image, 0, 0);
	}

	getPixelCount(): number {
		return this._getWidth() * this._getHeight();
	}

	getImageData(): ImageData {
		return this._getContext().getImageData(
			0,
			0,
			this._getWidth(),
			this._getHeight(),
		);
	}

	remove(): void {
		if (this._canvas && this._canvas.parentNode) {
			this._canvas.parentNode.removeChild(this._canvas);
		}
	}
}
