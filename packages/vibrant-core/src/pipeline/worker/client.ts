import { WorkerManager } from "@vibrant/worker";
import { Swatch } from "@vibrant/color";
import { mapValues } from "../../utils";
import type { TaskWorkerClass } from "@vibrant/worker";
import type { Palette } from "@vibrant/color";
import type { Pipeline, ProcessOptions, ProcessResult } from "../index";

/**
 * @private
 * Client side (runs in UI thread)
 */
export class WorkerPipeline implements Pipeline {
	private _manager = new WorkerManager();

	constructor(protected PipelineWorker: TaskWorkerClass) {
		this._manager.register("pipeline", PipelineWorker);
	}

	private _rehydrate(result: ProcessResult) {
		const { colors, palettes } = result;
		result.colors = colors.map((s) => Swatch.clone(s));

		result.palettes = mapValues(
			palettes,
			(p) => mapValues(p, (c) => (c ? Swatch.clone(c) : null)) as Palette,
		);
		return result;
	}

	async process(
		imageData: ImageData,
		opts: ProcessOptions,
	): Promise<ProcessResult> {
		const result = await this._manager.invokeWorker(
			"pipeline",
			[imageData, opts],
			[imageData.data.buffer],
		);
		return this._rehydrate(result as ProcessResult);
	}
}
