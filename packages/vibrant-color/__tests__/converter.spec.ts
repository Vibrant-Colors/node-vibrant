import { describe, expect, it } from "vitest";

import { rgbDiff, rgbToCIELab, rgbToXyz } from "../src/converter";

function expectClose(actual: number[], expected: number[], digits = 2) {
	expect(actual).toHaveLength(expected.length);
	actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i]!, digits));
}

describe("converter", () => {
	it("rgbToXyz uses the sRGB transfer function", () => {
		expectClose(rgbToXyz(255, 255, 255), [95.05, 100, 108.9], 1);
		expectClose(rgbToXyz(255, 0, 0), [41.24, 21.26, 1.93]);
		expectClose(rgbToXyz(128, 128, 128), [20.52, 21.59, 23.51]);
		// below the 0.04045 threshold: linear part, unchanged
		expectClose(rgbToXyz(10, 10, 10), [0.29, 0.3, 0.33]);
	});

	it("rgbToCIELab matches reference values", () => {
		expectClose(rgbToCIELab(255, 255, 255), [100, 0, 0], 1);
		expectClose(rgbToCIELab(0, 0, 0), [0, 0, 0]);
		expectClose(rgbToCIELab(255, 0, 0), [53.24, 80.09, 67.2], 1);
		expectClose(rgbToCIELab(128, 128, 128), [53.59, 0, 0], 1);
	});

	it("rgbDiff is 0 for equal colors and > 0 otherwise", () => {
		expect(rgbDiff([12, 34, 56], [12, 34, 56])).toBe(0);
		expect(rgbDiff([255, 255, 255], [0, 0, 0])).toBeCloseTo(100, 1);
	});
});
