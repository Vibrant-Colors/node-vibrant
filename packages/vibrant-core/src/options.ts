import { Filter, Palette, Swatch } from "@vibrant/color";
import { Image, ImageSource } from "@vibrant/image";
import { Quantizer } from "@vibrant/quantizer";
import { Generator } from "@vibrant/generator";
import { assignDeep } from "./utils";
import type { ProcessOptions, StageOptions } from "./pipeline";
import type { QuantizerOptions } from "@vibrant/quantizer";
import type { ImageClass, ImageOptions } from "@vibrant/image";

export interface Options extends ImageOptions, QuantizerOptions {
	useWorker: boolean;
	ImageClass: ImageClass;
	quantizer: string | StageOptions;
	generators: (string | StageOptions)[];
	filters: string[];
}

export function buildProcessOptions(
	opts: Options,
	override?: Partial<ProcessOptions>,
): ProcessOptions {
	const { colorCount, quantizer, generators, filters } = opts;
	// Merge with common quantizer options
	const commonQuantizerOpts = { colorCount };
	const q =
		typeof quantizer === "string"
			? { name: quantizer, options: {} }
			: quantizer;
	q.options = assignDeep({}, commonQuantizerOpts, q.options);

	return assignDeep(
		{},
		{
			quantizer: q,
			generators,
			filters,
		},
		override,
	);
}
