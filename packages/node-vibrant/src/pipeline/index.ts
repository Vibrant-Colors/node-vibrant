import { MMCQ } from "@vibrant/quantizer-mmcq";
import { DefaultGenerator } from "@vibrant/generator-default";

import { BasicPipeline } from "@vibrant/core";

export const pipeline = new BasicPipeline().filter
	.register(
		"default",
		(r: number, g: number, b: number, a: number) =>
			a >= 125 && !(r > 250 && g > 250 && b > 250),
	)
	.quantizer.register("mmcq", MMCQ)
	.generator.register("default", DefaultGenerator);
