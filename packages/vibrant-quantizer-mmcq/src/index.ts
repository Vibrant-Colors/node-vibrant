import { Quantizer } from "@vibrant/quantizer";
import { Filter, Swatch } from "@vibrant/color";
import { VBox } from "./vbox";
import { PQueue } from "./pqueue";
import type { Pixels } from "@vibrant/image";
import type { QuantizerOptions } from "@vibrant/quantizer";

const fractByPopulations = 0.75;

function _splitBoxes(pq: PQueue<VBox>, target: number): void {
	let lastSize = pq.size();
	while (pq.size() < target) {
		const vbox = pq.pop();

		if (vbox && vbox.count() > 0) {
			const [vbox1, vbox2] = vbox.split();

			if (!vbox1) break;

			pq.push(vbox1);
			if (vbox2 && vbox2.count() > 0) pq.push(vbox2);

			// No more new boxes, converged
			if (pq.size() === lastSize) {
				break;
			} else {
				lastSize = pq.size();
			}
		} else {
			break;
		}
	}
}

export const MMCQ = (pixels: Pixels, opts: QuantizerOptions): Array<Swatch> => {
	if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
		throw new Error("Wrong MMCQ parameters");
	}

	const vbox = VBox.build(pixels);
	const colorCount = vbox.histogram.colorCount;
	const pq = new PQueue<VBox>((a, b) => a.count() - b.count());

	pq.push(vbox);

	// first set of colors, sorted by population
	_splitBoxes(pq, fractByPopulations * opts.colorCount);

	// Re-order
	const pq2 = new PQueue<VBox>(
		(a, b) => a.count() * a.volume() - b.count() * b.volume(),
	);
	pq2.contents = pq.contents;

	// next set - generate the median cuts using the (npix * vol) sorting.
	_splitBoxes(pq2, opts.colorCount - pq2.size());

	// calculate the actual colors
	return generateSwatches(pq2);
};

function generateSwatches(pq: PQueue<VBox>) {
	const swatches: Swatch[] = [];
	while (pq.size()) {
		const v = pq.pop()!;
		const color = v.avg();
		const [r, g, b] = color;
		swatches.push(new Swatch(color, v.count()));
	}
	return swatches;
}
