import { runInWorker } from "@vibrant/worker";
import type { Pipeline } from "../index";

/**
 * @private
 */
export function runPipelineInWorker(self: Window, pipeline: Pipeline) {
	runInWorker(self, (imageData, opts) => pipeline.process(imageData, opts));
}
