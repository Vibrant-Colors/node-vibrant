import { runPipelineInWorker } from "@vibrant/core";
import { pipeline } from "./";

runPipelineInWorker(self, pipeline);
