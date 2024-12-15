import Vibrant from "./configs/browser";
import { WorkerPipeline } from "@vibrant/core";

import PipelineWorker from "./pipeline/index.worker?worker";

Vibrant.use(new WorkerPipeline(PipelineWorker));

export default Vibrant;
