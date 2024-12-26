import { assignDeep } from "./utils";
import { Vibrant } from "./";
import type { ImageClass, ImageSource } from "@vibrant/image";

import type { Palette } from "@vibrant/color";
import type { Options } from "./options";

/**
 * Helper class for change configurations and create a Vibrant instance. Methods of a Builder instance can be chained like:
 *
 * @example
 * ```javascript
 * Vibrant.from(src)
 *   .quality(1)
 *   .clearFilters()
 *   // ...
 *   .getPalette()
 *   .then((palette) => {})
 * ```
 */
export class Builder {
	private _src: ImageSource;
	private _opts: Partial<Options>;

	/**
	 * Arguments are the same as `Vibrant.constructor`.
	 */
	constructor(src: ImageSource, opts: Partial<Options> = {}) {
		this._src = src;
		this._opts = assignDeep({}, Vibrant.DefaultOpts, opts);
	}

	/**
	 * Sets `opts.colorCount` to `n`.
	 * @returns this `Builder` instance.
	 */
	maxColorCount(n: number): Builder {
		this._opts.colorCount = n;
		return this;
	}

	/**
	 * Sets `opts.maxDimension` to `d`.
	 * @returns this `Builder` instance.
	 */
	maxDimension(d: number): Builder {
		this._opts.maxDimension = d;
		return this;
	}

	/**
	 * Adds a filter function
	 * @returns this `Builder` instance.
	 */
	addFilter(name: string): Builder {
		if (!this._opts.filters) {
			this._opts.filters = [name];
		} else {
			this._opts.filters.push(name);
		}
		return this;
	}

	/**
	 * Removes a filter function.
	 * @returns this `Builder` instance.
	 */
	removeFilter(name: string): Builder {
		if (this._opts.filters) {
			const i = this._opts.filters.indexOf(name);
			if (i > 0) this._opts.filters.splice(i);
		}
		return this;
	}

	/**
	 * Clear all filters.
	 * @returns this `Builder` instance.
	 */
	clearFilters(): Builder {
		this._opts.filters = [];
		return this;
	}

	/**
	 * Sets `opts.quality` to `q`.
	 * @returns this `Builder` instance.
	 */
	quality(q: number): Builder {
		this._opts.quality = q;
		return this;
	}

	/**
	 * Specifies which `Image` implementation class to use.
	 * @returns this `Builder` instance.
	 */
	useImageClass(imageClass: ImageClass): Builder {
		this._opts.ImageClass = imageClass;
		return this;
	}

	/**
	 * Sets `opts.generator` to `generator`
	 * @returns this `Builder` instance.
	 */
	useGenerator(generator: string, options?: any): Builder {
		if (!this._opts.generators) this._opts.generators = [];
		this._opts.generators.push(
			options ? { name: generator, options } : generator,
		);
		return this;
	}

	/**
	 * Specifies which `Quantizer` implementation class to use
	 * @returns this `Builder` instance.
	 */
	useQuantizer(quantizer: string, options?: any): Builder {
		this._opts.quantizer = options ? { name: quantizer, options } : quantizer;
		return this;
	}

	/**
	 * Builds and returns a `Vibrant` instance as configured.
	 */
	build(): Vibrant {
		return new Vibrant(this._src, this._opts);
	}

	/**
	 * Builds a `Vibrant` instance as configured and calls its `getPalette` method.
	 */
	getPalette(): Promise<Palette> {
		return this.build().getPalette();
	}
}
