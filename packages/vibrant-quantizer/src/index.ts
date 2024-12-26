import type { Pixels } from "@vibrant/image";
import type { Resolvable } from "@vibrant/types";
import type { Swatch } from "@vibrant/color";

export interface QuantizerOptions {
	/**
	 * Amount of colors in initial palette from which the swatches will be generated
	 * @default 64
	 */
	colorCount: number;
}

export interface Quantizer {
	(pixels: Pixels, opts: QuantizerOptions): Resolvable<Array<Swatch>>;
}
