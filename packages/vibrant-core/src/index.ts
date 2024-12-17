import { buildProcessOptions } from "./options";
import { Builder } from "./builder";
import { assignDeep } from "./utils";
import type { Options } from "./options";
import type { Callback } from "@vibrant/types";
import type { Image, ImageSource } from "@vibrant/image";

import type { Palette } from "@vibrant/color";

import type { Pipeline, ProcessOptions, ProcessResult } from "./pipeline";

export interface VibrantStatic {
	from(src: ImageSource): Builder;
}

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

	palette(): Palette {
		return this.swatches();
	}

	swatches(): Palette {
		throw new Error(
			"Method deprecated. Use `Vibrant.result.palettes[name]` instead",
		);
	}

	async getPalette(name: string, cb?: Callback<Palette>): Promise<Palette>;
	async getPalette(cb?: Callback<Palette>): Promise<Palette>;
	async getPalette(): Promise<Palette> {
		const arg0 = arguments[0];
		const arg1 = arguments[1];
		const name = typeof arg0 === "string" ? arg0 : "default";
		const cb = typeof arg0 === "string" ? arg1 : arg0;
		const image = new this.opts.ImageClass();
		try {
			const image1 = await image.load(this._src);
			const result1: ProcessResult = await this._process(image1, {
				generators: [name],
			});
			this._result = result1;
			const res = result1.palettes[name];
			if (!res) {
				throw new Error(`Palette with name ${name} not found`);
			}
			image.remove();
			if (cb) {
				cb(undefined, res);
			}
			return res;
		} catch (err) {
			image.remove();
			if (cb) {
				cb(err);
			}
			return Promise.reject(err);
		}
	}

	async getPalettes(
		names: string[],
		cb?: Callback<Palette>,
	): Promise<{ [name: string]: Palette }>;
	async getPalettes(
		cb?: Callback<Palette>,
	): Promise<{ [name: string]: Palette }>;
	async getPalettes(): Promise<{ [name: string]: Palette }> {
		const arg0 = arguments[0];
		const arg1 = arguments[1];
		const names = Array.isArray(arg0) ? arg0 : ["*"];
		const cb = Array.isArray(arg0) ? arg1 : arg0;
		const image = new this.opts.ImageClass();
		try {
			const image1 = await image.load(this._src);
			const result1: ProcessResult = await this._process(image1, {
				generators: names,
			});
			this._result = result1;
			const res: any = result1.palettes;
			image.remove();
			if (cb) {
				cb(undefined, res);
			}
			return res;
		} catch (err) {
			image.remove();
			if (cb) {
				cb(err);
			}
			return Promise.reject(err);
		}
	}
}

export { BasicPipeline } from "./pipeline";
export { WorkerPipeline } from "./pipeline/worker/client";
export { runPipelineInWorker } from "./pipeline/worker/host";
export { Builder };
