import { expect } from "vitest";
import { VibrantStatic } from "@vibrant/core";
import { Builder } from "@vibrant/core";
import type { Palette, Swatch } from "@vibrant/color";
import * as util from "@vibrant/color";
import type {
	TestSample,
	SamplePathKey,
} from "../../../../fixtures/sample/loader";

import { table, getBorderCharacters } from "table";

const TABLE_OPTS = {
	border: getBorderCharacters("void"),
};

const displayColorDiffTable = (diff: string[][]) => {
	console.log(table(diff, TABLE_OPTS));
};

const assertPalette = (reference: Palette, palette: Palette) => {
	expect(palette, "palette should be returned").not.to.be.null;

	let failCount = 0;
	const compare = (
		name: string,
		expected: Swatch | null,
		actual: Swatch | null,
	) => {
		const result = {
			status: "N/A",
			diff: -1,
		};

		if (expected === null) {
			if (actual !== null) {
				console.warn(`WARN: ${name} color was not expected. Got ${actual.hex}`);
			}
		} else {
			expect(actual, `${name} color was expected`).not.to.be.null;
			const diff = util.rgbDiff(actual!.rgb, expected.rgb);
			result.diff = diff;
			result.status = util.getColorDiffStatus(diff);
			if (diff > util.DELTAE94_DIFF_STATUS.SIMILAR) {
				failCount++;
			}
		}

		return result;
	};

	const names = Object.keys(palette);
	const nameRow = [""].concat(names);
	const actualRow = ["Actual"];
	const expectedRow = ["Expected"];
	const scoreRow = ["Score"];
	for (const name of names) {
		const actual = palette[name];
		const expected = reference[name];
		actualRow.push(actual ? actual.hex : "null");
		expectedRow.push(expected ? util.rgbToHex(...expected.rgb) : "null");
		const r = compare(name, expected, actual);
		scoreRow.push(`${r.status}(${r.diff.toPrecision(2)})`);
	}

	// Display diff table only when necessary
	if (failCount > 0) {
		displayColorDiffTable([nameRow, actualRow, expectedRow, scoreRow]);
	}

	expect(
		failCount,
		`${failCount} colors are too diffrent from reference palettes`,
	).to.equal(0);
};

const paletteCallback =
	(references: any, done: () => void) => (err: Error, palette: Palette) => {
		setTimeout(() => {
			expect(err, `should not throw error '${err}'`).to.be.undefined;
			assertPalette(references, palette);

			done();
		});
	};

export const testVibrant = (
	Vibrant: VibrantStatic,
	sample: TestSample,
	pathKey: SamplePathKey,
	env: "node" | "browser",
	builderCallback: ((b: Builder) => Builder) | null = null,
) => {
	return async () => {
		let builder = Vibrant.from(sample[pathKey]).quality(1);

		if (typeof builderCallback === "function")
			builder = builderCallback(builder);

		await new Promise<void>((resolve) => {
			builder.getPalette(
				paletteCallback(sample.palettes[env], () => {
					resolve();
				}),
			);
		});
	};
};

export const testVibrantAsPromised = (
	Vibrant: VibrantStatic,
	sample: TestSample,
	pathKey: SamplePathKey,
	env: "node" | "browser",
	builderCallback: ((b: Builder) => Builder) | null = null,
) => {
	return async () => {
		let builder = Vibrant.from(sample[pathKey]).quality(1);

		if (typeof builderCallback === "function")
			builder = builderCallback(builder);

		const palette = await builder.getPalette();

		assertPalette(sample.palettes[env], palette);
	};
};
