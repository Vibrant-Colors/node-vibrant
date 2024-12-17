import { WorkerPipeline } from "@vibrant/core";
import { Vibrant } from "./configs/browser";

import PipelineWorker from "./pipeline/index.worker?worker";

Vibrant.use(new WorkerPipeline(PipelineWorker as never));

export { Vibrant };
