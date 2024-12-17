import type { Pixels } from "@vibrant/image";
import type { Resolvable } from "@vibrant/types";
import type { Swatch } from "@vibrant/color";

export interface QuantizerOptions {
	colorCount: number;
}
export interface Quantizer {
	(pixels: Pixels, opts: QuantizerOptions): Resolvable<Array<Swatch>>;
}
