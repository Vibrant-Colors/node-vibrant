import Vibrant = require('./browser')
import { WorkerPipeline } from '@vibrant/core/lib/pipeline/worker/client'

// const MMCQWorker = require('worker-loader?inline=true!vibrant-quantizer-mmcq/lib/index.worker.js')
const PipelineWorker = require('worker-loader?publicPath=/dist/!./pipeline/index.worker.js')

Vibrant.use(new WorkerPipeline(PipelineWorker))

// Vibrant.Worker.register('quantize', MMCQWorker)
;
((ns: any) => {
    ns.Vibrant = Vibrant
    // Vibrant.Quantizer.WebWorker = WebWorker
})((typeof window === 'object' && window instanceof Window) ? window: module.exports)