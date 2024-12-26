import { applyFilters } from "@vibrant/image";
import type { ImageData } from "@vibrant/image";
import type { Quantizer } from "@vibrant/quantizer";
import type { Generator } from "@vibrant/generator";
import type { Filter, Palette, Swatch } from "@vibrant/color";

/**
 * @private
 */
export class Stage<T> {
	private _map: { [name: string]: T } = {};
	constructor(protected pipeline: BasicPipeline) {}
	names() {
		return Object.keys(this._map);
	}
	has(name: string) {
		return !!this._map[name];
	}
	get(name: string) {
		return this._map[name];
	}
	register(name: string, stageFn: T) {
		this._map[name] = stageFn;
		return this.pipeline;
	}
}

/**
 * @private
 */
export interface ProcessResult {
	colors: Swatch[];
	palettes: { [name: string]: Palette };
}

/**
 * @private
 */
export interface StageOptions {
	name: string;
	options?: any;
}

/**
 * @private
 */
export interface ProcessOptions {
	filters: string[];
	quantizer: string | StageOptions;
	generators: (string | StageOptions)[];
}

/**
 * @private
 */
interface StageTask<Q> {
	name: string;
	fn: Q;
	options?: any;
}

/**
 * @private
 */
interface ProcessTasks {
	filters: StageTask<Filter>[];
	quantizer: StageTask<Quantizer>;
	generators: StageTask<Generator>[];
}

/**
 * @private
 */
export interface Pipeline {
	// quantizer: Stage<Quantizer>
	// generator: Stage<Generator>
	process(imageData: ImageData, opts: ProcessOptions): Promise<ProcessResult>;
}

/**
 * @private
 */
export class BasicPipeline implements Pipeline {
	private _buildProcessTasks({
		filters,
		quantizer,
		generators,
	}: ProcessOptions): ProcessTasks {
		// Support wildcard for generators
		if (generators.length === 1 && generators[0] === "*") {
			generators = this.generator.names();
		}
		return {
			filters: filters.map((f) => createTask(this.filter, f)),
			quantizer: createTask(this.quantizer, quantizer),
			generators: generators.map((g) => createTask(this.generator, g)),
		};
		function createTask<Q>(
			stage: Stage<Q>,
			o: string | StageOptions,
		): StageTask<Q> {
			let name: string;
			let options: any;
			if (typeof o === "string") {
				name = o;
			} else {
				name = o.name;
				options = o.options;
			}

			return {
				name,
				fn: stage.get(name)!,
				options,
			};
		}
	}
	filter: Stage<Filter> = new Stage(this);
	quantizer: Stage<Quantizer> = new Stage(this);
	generator: Stage<Generator> = new Stage(this);
	async process(
		imageData: ImageData,
		opts: ProcessOptions,
	): Promise<ProcessResult> {
		const { filters, quantizer, generators } = this._buildProcessTasks(opts);
		const imageFilterData = await this._filterColors(filters, imageData);
		const colors = await this._generateColors(quantizer, imageFilterData);
		const palettes = await this._generatePalettes(generators, colors);
		return {
			colors,
			palettes,
		};
	}
	private _filterColors(filters: StageTask<Filter>[], imageData: ImageData) {
		return Promise.resolve(
			applyFilters(
				imageData,
				filters.map(({ fn }) => fn),
			),
		);
	}
	private _generateColors(
		quantizer: StageTask<Quantizer>,
		imageData: ImageData,
	) {
		return Promise.resolve(quantizer.fn(imageData.data, quantizer.options));
	}
	private async _generatePalettes(
		generators: StageTask<Generator>[],
		colors: Swatch[],
	) {
		// Make a promise map that will run them "concurrently" (but return in expected result)
		const promiseArr = await Promise.all(
			generators.map(({ fn, options }) => Promise.resolve(fn(colors, options))),
		);
		// Map the values to the expected name
		return Promise.resolve(
			promiseArr.reduce(
				(promises, promiseVal, i) => {
					promises[generators[i]!.name] = promiseVal;
					return promises;
				},
				{} as { [name: string]: Palette },
			),
		);
	}
}
