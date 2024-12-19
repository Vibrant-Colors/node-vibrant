import type { Pixels } from "./index";

export interface HistogramOptions {
	sigBits: number;
}

export class Histogram {
	bmin: number;
	bmax: number;
	gmin: number;
	gmax: number;
	rmin: number;
	rmax: number;
	hist: Uint32Array;
	private _colorCount: number;
	get colorCount() {
		return this._colorCount;
	}
	getColorIndex: (r: number, g: number, b: number) => number;
	constructor(
		public pixels: Pixels,
		public opts: HistogramOptions,
	) {
		const { sigBits } = opts;
		const getColorIndex = (r: number, g: number, b: number) =>
			(r << (2 * sigBits)) + (g << sigBits) + b;

		this.getColorIndex = getColorIndex;

		const rshift = 8 - sigBits;
		const hn = 1 << (3 * sigBits);
		const hist = new Uint32Array(hn);
		let rmax: number;
		let rmin: number;
		let gmax: number;
		let gmin: number;
		let bmax: number;
		let bmin: number;
		let r: number;
		let g: number;
		let b: number;
		let a: number;
		rmax = gmax = bmax = 0;
		rmin = gmin = bmin = Number.MAX_VALUE;
		const n = pixels.length / 4;
		let i = 0;

		while (i < n) {
			const offset = i * 4;
			i++;
			r = pixels[offset + 0]!;
			g = pixels[offset + 1]!;
			b = pixels[offset + 2]!;
			a = pixels[offset + 3]!;

			// Ignored pixels' alpha is marked as 0 in filtering stage
			if (a === 0) continue;

			r = r >> rshift;
			g = g >> rshift;
			b = b >> rshift;

			const index = getColorIndex(r, g, b);
			if (hist[index] === undefined) hist[index] = 0;
			hist[index] += 1;

			if (r > rmax) rmax = r;
			if (r < rmin) rmin = r;
			if (g > gmax) gmax = g;
			if (g < gmin) gmin = g;
			if (b > bmax) bmax = b;
			if (b < bmin) bmin = b;
		}
		this._colorCount = hist.reduce(
			(total, c) => (c > 0 ? total + 1 : total),
			0,
		);
		this.hist = hist;
		this.rmax = rmax;
		this.rmin = rmin;
		this.gmax = gmax;
		this.gmin = gmin;
		this.bmax = bmax;
		this.bmin = bmin;
	}
}
