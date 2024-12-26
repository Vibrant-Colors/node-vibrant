import { buildProcessOptions } from "./options";
import { Builder } from "./builder";
import { assignDeep } from "./utils";
import type { Options } from "./options";
import type { Image, ImageSource } from "@vibrant/image";

import type { Palette } from "@vibrant/color";

import type { Pipeline, ProcessOptions, ProcessResult } from "./pipeline";

/**
 * Main class of `node-vibrant`.
 */
export class Vibrant {
	private _result: ProcessResult | undefined;
	private static _pipeline: Pipeline;

	static use(pipeline: Pipeline) {
		this._pipeline = pipeline;
	}

	static DefaultOpts: Partial<Options> = {
		colorCount: 64,
		quality: 5,
		filters: [],
	};

	static from(src: ImageSource): Builder {
		return new Builder(src);
	}

	get result() {
		return this._result;
	}

	opts: Options;

	/**
	 *
	 * @param _src Path to image file (supports HTTP/HTTPs)
	 * @param opts Options (optional)
	 */
	constructor(
		private _src: ImageSource,
		opts?: Partial<Options>,
	) {
		this.opts = assignDeep({}, Vibrant.DefaultOpts, opts);
	}

	private _process(
		image: Image,
		opts?: Partial<ProcessOptions>,
	): Promise<ProcessResult> {
		image.scaleDown(this.opts);

		const processOpts = buildProcessOptions(this.opts, opts);

		return Vibrant._pipeline.process(image.getImageData(), processOpts);
	}

	async getPalette(): Promise<Palette> {
		const image = new this.opts.ImageClass();
		try {
			const image1 = await image.load(this._src);
			const result1: ProcessResult = await this._process(image1, {
				generators: ["default"],
			});
			this._result = result1;
			const res = result1.palettes["default"];
			if (!res) {
				throw new Error(
					`Something went wrong and a palette was not found, please file a bug against our GitHub repo: https://github.com/vibrant-Colors/node-vibrant/`,
				);
			}
			image.remove();
			return res;
		} catch (err) {
			image.remove();
			return Promise.reject(err);
		}
	}

	async getPalettes(): Promise<{ [name: string]: Palette }> {
		const image = new this.opts.ImageClass();
		try {
			const image1 = await image.load(this._src);
			const result1: ProcessResult = await this._process(image1, {
				generators: ["*"],
			});
			this._result = result1;
			const res: any = result1.palettes;
			image.remove();
			return res;
		} catch (err) {
			image.remove();
			return Promise.reject(err);
		}
	}
}

export { BasicPipeline } from "./pipeline";
export { WorkerPipeline } from "./pipeline/worker/client";
export { runPipelineInWorker } from "./pipeline/worker/host";
export { Builder };
