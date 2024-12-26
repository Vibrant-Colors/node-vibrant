/* eslint-disable prefer-const, @typescript-eslint/no-unnecessary-condition */
import { Swatch, hslToRgb } from "@vibrant/color";
import type { Generator } from "@vibrant/generator";
import type { Palette } from "@vibrant/color";

export interface GeneratorOptions {
	targetDarkLuma: number;
	maxDarkLuma: number;
	minLightLuma: number;
	targetLightLuma: number;
	minNormalLuma: number;
	targetNormalLuma: number;
	maxNormalLuma: number;
	targetMutesSaturation: number;
	maxMutesSaturation: number;
	targetVibrantSaturation: number;
	minVibrantSaturation: number;
	weightSaturation: number;
	weightLuma: number;
	weightPopulation: number;
}

export const DefaultOpts: GeneratorOptions = {
	targetDarkLuma: 0.26,
	maxDarkLuma: 0.45,
	minLightLuma: 0.55,
	targetLightLuma: 0.74,
	minNormalLuma: 0.3,
	targetNormalLuma: 0.5,
	maxNormalLuma: 0.7,
	targetMutesSaturation: 0.3,
	maxMutesSaturation: 0.4,
	targetVibrantSaturation: 1.0,
	minVibrantSaturation: 0.35,
	weightSaturation: 3,
	weightLuma: 6.5,
	weightPopulation: 0.5,
};

function _findMaxPopulation(swatches: Array<Swatch>): number {
	let p = 0;

	swatches.forEach((s) => {
		p = Math.max(p, s.population);
	});

	return p;
}

function _isAlreadySelected(palette: Palette, s: Swatch): boolean {
	return (
		palette.Vibrant === s ||
		palette.DarkVibrant === s ||
		palette.LightVibrant === s ||
		palette.Muted === s ||
		palette.DarkMuted === s ||
		palette.LightMuted === s
	);
}

function _createComparisonValue(
	saturation: number,
	targetSaturation: number,
	luma: number,
	targetLuma: number,
	population: number,
	maxPopulation: number,
	opts: GeneratorOptions,
): number {
	function weightedMean(...values: number[]) {
		let sum = 0;
		let weightSum = 0;
		for (let i = 0; i < values.length; i += 2) {
			const value = values[i];
			const weight = values[i + 1];
			if (!value || !weight) continue;
			sum += value * weight;
			weightSum += weight;
		}

		return sum / weightSum;
	}

	function invertDiff(value: number, targetValue: number): number {
		return 1 - Math.abs(value - targetValue);
	}

	return weightedMean(
		invertDiff(saturation, targetSaturation),
		opts.weightSaturation,
		invertDiff(luma, targetLuma),
		opts.weightLuma,
		population / maxPopulation,
		opts.weightPopulation,
	);
}

function _findColorVariation(
	palette: Palette,
	swatches: Array<Swatch>,
	maxPopulation: number,
	targetLuma: number,
	minLuma: number,
	maxLuma: number,
	targetSaturation: number,
	minSaturation: number,
	maxSaturation: number,
	opts: GeneratorOptions,
): Swatch | null {
	let max: Swatch | null = null;
	let maxValue = 0;

	swatches.forEach((swatch) => {
		const [, s, l] = swatch.hsl;

		if (
			s >= minSaturation &&
			s <= maxSaturation &&
			l >= minLuma &&
			l <= maxLuma &&
			!_isAlreadySelected(palette, swatch)
		) {
			const value = _createComparisonValue(
				s,
				targetSaturation,
				l,
				targetLuma,
				swatch.population,
				maxPopulation,
				opts,
			);

			if (max === null || value > maxValue) {
				max = swatch;
				maxValue = value;
			}
		}
	});

	return max;
}

function _generateVariationColors(
	swatches: Array<Swatch>,
	maxPopulation: number,
	opts: GeneratorOptions,
): Palette {
	const palette: Palette = {
		Vibrant: null,
		DarkVibrant: null,
		LightVibrant: null,
		Muted: null,
		DarkMuted: null,
		LightMuted: null,
	};
	// mVibrantSwatch = findColor(TARGET_NORMAL_LUMA, MIN_NORMAL_LUMA, MAX_NORMAL_LUMA,
	//     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f)
	palette.Vibrant = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetNormalLuma,
		opts.minNormalLuma,
		opts.maxNormalLuma,
		opts.targetVibrantSaturation,
		opts.minVibrantSaturation,
		1,
		opts,
	);
	// mLightVibrantSwatch = findColor(TARGET_LIGHT_LUMA, MIN_LIGHT_LUMA, 1f,
	//     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f)
	palette.LightVibrant = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetLightLuma,
		opts.minLightLuma,
		1,
		opts.targetVibrantSaturation,
		opts.minVibrantSaturation,
		1,
		opts,
	);
	// mDarkVibrantSwatch = findColor(TARGET_DARK_LUMA, 0f, MAX_DARK_LUMA,
	//     TARGET_VIBRANT_SATURATION, MIN_VIBRANT_SATURATION, 1f)
	palette.DarkVibrant = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetDarkLuma,
		0,
		opts.maxDarkLuma,
		opts.targetVibrantSaturation,
		opts.minVibrantSaturation,
		1,
		opts,
	);
	// mMutedSwatch = findColor(TARGET_NORMAL_LUMA, MIN_NORMAL_LUMA, MAX_NORMAL_LUMA,
	//     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION)
	palette.Muted = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetNormalLuma,
		opts.minNormalLuma,
		opts.maxNormalLuma,
		opts.targetMutesSaturation,
		0,
		opts.maxMutesSaturation,
		opts,
	);
	// mLightMutedColor = findColor(TARGET_LIGHT_LUMA, MIN_LIGHT_LUMA, 1f,
	//     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION)
	palette.LightMuted = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetLightLuma,
		opts.minLightLuma,
		1,
		opts.targetMutesSaturation,
		0,
		opts.maxMutesSaturation,
		opts,
	);
	// mDarkMutedSwatch = findColor(TARGET_DARK_LUMA, 0f, MAX_DARK_LUMA,
	//     TARGET_MUTED_SATURATION, 0f, MAX_MUTED_SATURATION)
	palette.DarkMuted = _findColorVariation(
		palette,
		swatches,
		maxPopulation,
		opts.targetDarkLuma,
		0,
		opts.maxDarkLuma,
		opts.targetMutesSaturation,
		0,
		opts.maxMutesSaturation,
		opts,
	);
	return palette;
}

function _generateEmptySwatches(
	palette: Palette,
	_maxPopulation: number,
	opts: GeneratorOptions,
): void {
	if (!palette.Vibrant && !palette.DarkVibrant && !palette.LightVibrant) {
		if (!palette.DarkVibrant && palette.DarkMuted) {
			let [h, s, l] = palette.DarkMuted.hsl;
			l = opts.targetDarkLuma;
			palette.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
		}
		if (!palette.LightVibrant && palette.LightMuted) {
			let [h, s, l] = palette.LightMuted.hsl;
			l = opts.targetDarkLuma;
			palette.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
		}
	}
	if (!palette.Vibrant && palette.DarkVibrant) {
		let [h, s, l] = palette.DarkVibrant.hsl;
		l = opts.targetNormalLuma;
		palette.Vibrant = new Swatch(hslToRgb(h, s, l), 0);
	} else if (!palette.Vibrant && palette.LightVibrant) {
		let [h, s, l] = palette.LightVibrant.hsl;
		l = opts.targetNormalLuma;
		palette.Vibrant = new Swatch(hslToRgb(h, s, l), 0);
	}
	if (!palette.DarkVibrant && palette.Vibrant) {
		let [h, s, l] = palette.Vibrant.hsl;
		l = opts.targetDarkLuma;
		palette.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
	}
	if (!palette.LightVibrant && palette.Vibrant) {
		let [h, s, l] = palette.Vibrant.hsl;
		l = opts.targetLightLuma;
		palette.LightVibrant = new Swatch(hslToRgb(h, s, l), 0);
	}
	if (!palette.Muted && palette.Vibrant) {
		let [h, s, l] = palette.Vibrant.hsl;
		l = opts.targetMutesSaturation;
		palette.Muted = new Swatch(hslToRgb(h, s, l), 0);
	}
	if (!palette.DarkMuted && palette.DarkVibrant) {
		let [h, s, l] = palette.DarkVibrant.hsl;
		l = opts.targetMutesSaturation;
		palette.DarkMuted = new Swatch(hslToRgb(h, s, l), 0);
	}
	if (!palette.LightMuted && palette.LightVibrant) {
		let [h, s, l] = palette.LightVibrant.hsl;
		l = opts.targetMutesSaturation;
		palette.LightMuted = new Swatch(hslToRgb(h, s, l), 0);
	}
}

export const DefaultGenerator: Generator = ((
	swatches: Array<Swatch>,
	opts?: GeneratorOptions,
): Palette => {
	opts = Object.assign({}, DefaultOpts, opts);
	const maxPopulation = _findMaxPopulation(swatches);

	const palette = _generateVariationColors(swatches, maxPopulation, opts);
	_generateEmptySwatches(palette, maxPopulation, opts);

	return palette;
}) as never;
