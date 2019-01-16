import Vibrant = require('./browser')
import { WorkerPipeline } from '@vibrant/core/lib/pipeline/worker/client'

const PipelineWorker = require('./pipeline/index.worker')

Vibrant.use(new WorkerPipeline(PipelineWorker))

export = Vibrant
