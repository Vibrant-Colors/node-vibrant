import { runInWorker } from "@vibrant/worker";
import type { Pipeline } from "../index";

export function runPipelineInWorker(self: Window, pipeline: Pipeline) {
	runInWorker(self, (imageData, opts) => pipeline.process(imageData, opts));
}
