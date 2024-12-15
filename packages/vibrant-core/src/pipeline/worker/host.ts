import runInWorker from "@vibrant/worker";
import { Pipeline } from "../index";

export default function runPipelineInWorker(self: Window, pipeline: Pipeline) {
  runInWorker(self, (imageData, opts) => pipeline.process(imageData, opts));
}
