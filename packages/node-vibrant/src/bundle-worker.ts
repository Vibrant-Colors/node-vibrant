import Vibrant from "./browser";
import { WorkerPipeline } from "@vibrant/core/src/pipeline/worker/client";

import PipelineWorker from "./pipeline/index.worker?worker";

Vibrant.use(new WorkerPipeline(PipelineWorker));

export default Vibrant;
