import { runPipelineInWorker } from "@vibrant/core";
import { pipeline } from "./pipeline";

runPipelineInWorker(self, pipeline);
