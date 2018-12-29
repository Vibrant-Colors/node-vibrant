import { Pipeline, ProcessOptions, ProcessResult } from "../index"
import WorkerManager, { TaskWorkerClass } from '@vibrant/worker'
import { Swatch } from '@vibrant/color'
import mapValues = require('lodash/mapValues')

/**
 * Client side (runs in UI thread)
 */
export class WorkerPipeline implements Pipeline {
    private _manager = new WorkerManager()
    constructor(protected PipelineWorker: TaskWorkerClass) {
        this._manager.register('pipeline', PipelineWorker)
    }
    private _rehydrate(result: ProcessResult) {
        let { colors, palettes } = result
        result.colors = colors.map((s) => clone(s))

        result.palettes = mapValues(palettes, (p) => mapValues(p, (c) => clone(c)))
        return result
        function clone(swatch: Swatch) {
            return swatch
                ? Swatch.clone(swatch)
                : null
        }
    }
    process(imageData: ImageData, opts: ProcessOptions): Promise<ProcessResult> {
        return this._manager.invokeWorker('pipeline', [imageData, opts], [imageData.data.buffer])
            .then((result) => this._rehydrate(<ProcessResult>result))
    }
}