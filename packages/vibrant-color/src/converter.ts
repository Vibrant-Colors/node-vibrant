import type { Vec3 } from "./";

export const DELTAE94_DIFF_STATUS = {
	NA: 0,
	PERFECT: 1,
	CLOSE: 2,
	GOOD: 10,
	SIMILAR: 50,
};

/**
 * Converts hex string to RGB
 * @param hex - The hex value you with to get the RGB value of
 * @returns an array in the order of `red, green, blue` numerical values
 */
export function hexToRgb(hex: string): Vec3 {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	if (!m) throw new RangeError(`'${hex}' is not a valid hex color`);

	if (!m[1] || !m[2] || !m[3])
		throw new RangeError(`'${hex}' is not a valid hex color`);

	return [m[1], m[2], m[3]].map((s) => parseInt(s, 16)) as Vec3;
}

/**
 * Given values for an RGB color convert to and return a valid HEX string
 * @param r - Red value in RGB
 * @param g - Green value in RGB
 * @param b - Blue value in RGB
 * @returns a valid hex string with pre-pending pound sign
 */
export function rgbToHex(r: number, g: number, b: number): string {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
}

/**
 * Given values for an RGB color convert to and return a valid HSL value
 * @param r - Red value in RGB
 * @param g - Green value in RGB
 * @param b - Blue value in RGB
 * @returns an array in the order of `hue, saturation, light` numerical values
 */
export function rgbToHsl(r: number, g: number, b: number): Vec3 {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}
	return [h, s, l];
}

export function hslToRgb(h: number, s: number, l: number): Vec3 {
	let r: number;
	let g: number;
	let b: number;

	function hue2rgb(p: number, q: number, t: number): number {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}

	if (s === 0) {
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return [r * 255, g * 255, b * 255];
}

export function rgbToXyz(r: number, g: number, b: number): Vec3 {
	r /= 255;
	g /= 255;
	b /= 255;
	r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
	g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
	b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;

	r *= 100;
	g *= 100;
	b *= 100;

	const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
	const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
	const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

	return [x, y, z];
}

export function xyzToCIELab(x: number, y: number, z: number): Vec3 {
	const REF_X = 95.047;
	const REF_Y = 100;
	const REF_Z = 108.883;

	x /= REF_X;
	y /= REF_Y;
	z /= REF_Z;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

	const L = 116 * y - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [L, a, b];
}

export function rgbToCIELab(r: number, g: number, b: number): Vec3 {
	const [x, y, z] = rgbToXyz(r, g, b);
	return xyzToCIELab(x, y, z);
}

/**
 * Computes CIE delta E 1994 diff between `lab1` and `lab2`. The 2 colors are in CIE-Lab color space. Used in tests to compare 2 colors' perceptual similarity.
 */
export function deltaE94(lab1: Vec3, lab2: Vec3): number {
	const WEIGHT_L = 1;
	const WEIGHT_C = 1;
	const WEIGHT_H = 1;

	const [L1, a1, b1] = lab1;
	const [L2, a2, b2] = lab2;
	const dL = L1 - L2;
	const da = a1 - a2;
	const db = b1 - b2;

	const xC1 = Math.sqrt(a1 * a1 + b1 * b1);
	const xC2 = Math.sqrt(a2 * a2 + b2 * b2);

	let xDL = L2 - L1;
	let xDC = xC2 - xC1;
	const xDE = Math.sqrt(dL * dL + da * da + db * db);

	let xDH =
		Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC))
			? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
			: 0;

	const xSC = 1 + 0.045 * xC1;
	const xSH = 1 + 0.015 * xC1;

	xDL /= WEIGHT_L;
	xDC /= WEIGHT_C * xSC;
	xDH /= WEIGHT_H * xSH;

	return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
}

/**
 * Compute CIE delta E 1994 diff between `rgb1` and `rgb2`.
 */
export function rgbDiff(rgb1: Vec3, rgb2: Vec3): number {
	const lab1 = rgbToCIELab.apply(undefined, rgb1);
	const lab2 = rgbToCIELab.apply(undefined, rgb2);
	return deltaE94(lab1, lab2);
}

/**
 * Compute CIE delta E 1994 diff between `hex1` and `hex2`.
 */
export function hexDiff(hex1: string, hex2: string): number {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);

	return rgbDiff(rgb1, rgb2);
}

/**
 * Gets a string to describe the meaning of the color diff. Used in tests.
 *
 * Delta E  | Perception                             | Returns
 * -------- | -------------------------------------- | -----------
 * <= 1.0   | Not perceptible by human eyes.         | `"Perfect"`
 * 1 - 2    | Perceptible through close observation. | `"Close"`
 * 2 - 10   | Perceptible at a glance.               | `"Good"`
 * 11 - 49  | Colors are more similar than opposite  | `"Similar"`
 * 50 - 100 | Colors are exact opposite              | `Wrong`
 */
export function getColorDiffStatus(d: number): string {
	if (d < DELTAE94_DIFF_STATUS.NA) {
		return "N/A";
	}
	// Not perceptible by human eyes
	if (d <= DELTAE94_DIFF_STATUS.PERFECT) {
		return "Perfect";
	}
	// Perceptible through close observation
	if (d <= DELTAE94_DIFF_STATUS.CLOSE) {
		return "Close";
	}
	// Perceptible at a glance
	if (d <= DELTAE94_DIFF_STATUS.GOOD) {
		return "Good";
	}
	// Colors are more similar than opposite
	if (d < DELTAE94_DIFF_STATUS.SIMILAR) {
		return "Similar";
	}
	return "Wrong";
}
