import { Filter } from "@vibrant/color";
import { Histogram } from "@vibrant/image";
import type { Vec3 } from "@vibrant/color";
import type { Pixels } from "@vibrant/image";

interface Dimension {
	r1: number;
	r2: number;
	g1: number;
	g2: number;
	b1: number;
	b2: number;
	[d: string]: number;
}

const SIGBITS = 5;
const RSHIFT = 8 - SIGBITS;

/**
 * @private
 */
export class VBox {
	static build(pixels: Pixels): VBox {
		const h = new Histogram(pixels, { sigBits: SIGBITS });
		const { rmin, rmax, gmin, gmax, bmin, bmax } = h;
		return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, h);
	}

	dimension: Dimension;

	private _volume = -1;
	private _avg: Vec3 | null = null;
	private _count = -1;

	constructor(
		r1: number,
		r2: number,
		g1: number,
		g2: number,
		b1: number,
		b2: number,
		public histogram: Histogram,
	) {
		// NOTE: dimension will be mutated by split operation.
		//       It must be specified explicitly, not from histogram
		this.dimension = { r1, r2, g1, g2, b1, b2 };
	}

	invalidate(): void {
		this._volume = this._count = -1;
		this._avg = null;
	}

	volume(): number {
		if (this._volume < 0) {
			const { r1, r2, g1, g2, b1, b2 } = this.dimension;
			this._volume = (r2 - r1 + 1) * (g2 - g1 + 1) * (b2 - b1 + 1);
		}
		return this._volume;
	}

	count(): number {
		if (this._count < 0) {
			const { hist, getColorIndex } = this.histogram;
			const { r1, r2, g1, g2, b1, b2 } = this.dimension;
			let c = 0;

			for (let r = r1; r <= r2; r++) {
				for (let g = g1; g <= g2; g++) {
					for (let b = b1; b <= b2; b++) {
						const index = getColorIndex(r, g, b);
						if (!hist[index]) {
							continue;
						}
						c += hist[index]!;
					}
				}
			}
			this._count = c;
		}
		return this._count;
	}

	clone(): VBox {
		const { histogram } = this;
		const { r1, r2, g1, g2, b1, b2 } = this.dimension;
		return new VBox(r1, r2, g1, g2, b1, b2, histogram);
	}

	avg(): Vec3 {
		if (!this._avg) {
			const { hist, getColorIndex } = this.histogram;
			const { r1, r2, g1, g2, b1, b2 } = this.dimension;
			let ntot = 0;
			const mult = 1 << (8 - SIGBITS);
			let rsum: number;
			let gsum: number;
			let bsum: number;
			rsum = gsum = bsum = 0;

			for (let r = r1; r <= r2; r++) {
				for (let g = g1; g <= g2; g++) {
					for (let b = b1; b <= b2; b++) {
						const index = getColorIndex(r, g, b);
						const h = hist[index];
						if (!h) continue;
						ntot += h;
						rsum += h * (r + 0.5) * mult;
						gsum += h * (g + 0.5) * mult;
						bsum += h * (b + 0.5) * mult;
					}
				}
			}
			if (ntot) {
				this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
			} else {
				this._avg = [
					~~((mult * (r1 + r2 + 1)) / 2),
					~~((mult * (g1 + g2 + 1)) / 2),
					~~((mult * (b1 + b2 + 1)) / 2),
				];
			}
		}
		return this._avg;
	}

	contains(rgb: Vec3): boolean {
		let [r, g, b] = rgb;
		const { r1, r2, g1, g2, b1, b2 } = this.dimension;
		r >>= RSHIFT;
		g >>= RSHIFT;
		b >>= RSHIFT;

		return r >= r1 && r <= r2 && g >= g1 && g <= g2 && b >= b1 && b <= b2;
	}

	split(): VBox[] {
		const { hist, getColorIndex } = this.histogram;
		const { r1, r2, g1, g2, b1, b2 } = this.dimension;
		const count = this.count();
		if (!count) return [];
		if (count === 1) return [this.clone()];
		const rw = r2 - r1 + 1;
		const gw = g2 - g1 + 1;
		const bw = b2 - b1 + 1;

		const maxw = Math.max(rw, gw, bw);
		let accSum: Uint32Array | null = null;
		let sum: number;
		let total: number;
		sum = total = 0;

		let maxd: "r" | "g" | "b" | null = null;

		if (maxw === rw) {
			maxd = "r";
			accSum = new Uint32Array(r2 + 1);
			for (let r = r1; r <= r2; r++) {
				sum = 0;
				for (let g = g1; g <= g2; g++) {
					for (let b = b1; b <= b2; b++) {
						const index = getColorIndex(r, g, b);
						if (!hist[index]) continue;
						sum += hist[index]!;
					}
				}
				total += sum;
				accSum[r] = total;
			}
		} else if (maxw === gw) {
			maxd = "g";
			accSum = new Uint32Array(g2 + 1);
			for (let g = g1; g <= g2; g++) {
				sum = 0;
				for (let r = r1; r <= r2; r++) {
					for (let b = b1; b <= b2; b++) {
						const index = getColorIndex(r, g, b);
						if (!hist[index]) continue;
						sum += hist[index]!;
					}
				}
				total += sum;
				accSum[g] = total;
			}
		} else {
			maxd = "b";
			accSum = new Uint32Array(b2 + 1);
			for (let b = b1; b <= b2; b++) {
				sum = 0;
				for (let r = r1; r <= r2; r++) {
					for (let g = g1; g <= g2; g++) {
						const index = getColorIndex(r, g, b);
						if (!hist[index]) continue;
						sum += hist[index]!;
					}
				}
				total += sum;
				accSum[b] = total;
			}
		}

		let splitPoint = -1;
		const reverseSum = new Uint32Array(accSum.length);
		for (let i = 0; i < accSum.length; i++) {
			const d = accSum[i];
			if (!d) continue;
			if (splitPoint < 0 && d > total / 2) splitPoint = i;
			reverseSum[i] = total - d;
		}

		const vbox = this;

		function doCut(d: string): VBox[] {
			const dim1 = d + "1";
			const dim2 = d + "2";
			const d1 = vbox.dimension[dim1]!;
			let d2 = vbox.dimension[dim2]!;
			const vbox1 = vbox.clone();
			const vbox2 = vbox.clone();
			const left = splitPoint - d1;
			const right = d2 - splitPoint;

			if (left <= right) {
				d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));
				d2 = Math.max(0, d2);
			} else {
				d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));
				d2 = Math.min(vbox.dimension[dim2]!, d2);
			}

			while (!accSum![d2]) d2++;

			let c2 = reverseSum[d2];
			while (!c2 && accSum![d2 - 1]) c2 = reverseSum[--d2];

			vbox1.dimension[dim2] = d2;
			vbox2.dimension[dim1] = d2 + 1;

			return [vbox1, vbox2];
		}

		return doCut(maxd);
	}
}
