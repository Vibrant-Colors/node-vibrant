import { rgbToHex, rgbToHsl } from "./converter";

export * from "./converter";

/**
 * @returns `true` if the color is to be kept.
 */
export interface Filter {
	(red: number, green: number, blue: number, alpha: number): boolean;
}

/**
 * 3d floating pointer vector
 */
export type Vec3 = [number, number, number];

/**
 * The layout for a node-vibrant Palette. Allows you to keep track of
 */
export interface Palette {
	Vibrant: Swatch | null;
	Muted: Swatch | null;
	DarkVibrant: Swatch | null;
	DarkMuted: Swatch | null;
	LightVibrant: Swatch | null;
	LightMuted: Swatch | null;
	// ?
	[name: string]: Swatch | null;
}

/**
 * Represents a color swatch generated from an image's palette.
 */
export class Swatch {
	static applyFilters(colors: Swatch[], filters: Filter[]): Swatch[] {
		return filters.length > 0
			? colors.filter(({ r, g, b }) => {
					for (let j = 0; j < filters.length; j++) {
						if (!filters[j]?.(r, g, b, 255)) return false;
					}
					return true;
				})
			: colors;
	}

	/**
	 * Make a value copy of a swatch based on a previous one. Returns a new Swatch instance
	 * @param {Swatch} swatch
	 */
	static clone(swatch: Swatch) {
		return new Swatch(swatch._rgb, swatch._population);
	}
	private _rgb: Vec3;
	private _population: number;
	private _hsl: Vec3 | undefined;
	private _yiq: number | undefined;
	private _hex: string | undefined;

	/**
	 * The red value in the RGB value
	 */
	get r(): number {
		return this._rgb[0];
	}
	/**
	 * The green value in the RGB value
	 */
	get g(): number {
		return this._rgb[1];
	}
	/**
	 * The blue value in the RGB value
	 */
	get b(): number {
		return this._rgb[2];
	}
	/**
	 * The color value as a rgb value
	 */
	get rgb(): Vec3 {
		return this._rgb;
	}
	/**
	 * The color value as a hsl value
	 */
	get hsl(): Vec3 {
		if (!this._hsl) {
			const [r, g, b] = this._rgb;
			this._hsl = rgbToHsl(r, g, b);
		}
		return this._hsl;
	}

	/**
	 * The color value as a hex string
	 */
	get hex(): string {
		if (!this._hex) {
			const [r, g, b] = this._rgb;
			this._hex = rgbToHex(r, g, b);
		}
		return this._hex;
	}

	get population(): number {
		return this._population;
	}

	/**
	 * Get the JSON object for the swatch
	 */
	toJSON(): { rgb: Vec3; population: number } {
		return {
			rgb: this.rgb,
			population: this.population,
		};
	}

	private getYiq(): number {
		if (!this._yiq) {
			const rgb = this._rgb;
			this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		}
		return this._yiq;
	}

	private _titleTextColor: string | undefined;
	private _bodyTextColor: string | undefined;

	/**
	 * Returns an appropriate color to use for any 'title' text which is displayed over this Swatch's color.
	 */
	get titleTextColor() {
		if (!this._titleTextColor) {
			this._titleTextColor = this.getYiq() < 200 ? "#fff" : "#000";
		}
		return this._titleTextColor;
	}

	/**
	 * Returns an appropriate color to use for any 'body' text which is displayed over this Swatch's color.
	 */
	get bodyTextColor() {
		if (!this._bodyTextColor) {
			this._bodyTextColor = this.getYiq() < 150 ? "#fff" : "#000";
		}
		return this._bodyTextColor;
	}

	/**
	 * Internal use.
	 * @param rgb `[r, g, b]`
	 * @param population Population of the color in an image
	 */
	constructor(rgb: Vec3, population: number) {
		this._rgb = rgb;
		this._population = population;
	}
}
