import type { Palette, Swatch } from "@vibrant/color";
import type { Resolvable } from "@vibrant/types";

export interface Generator {
	(swatches: Swatch[], opts?: object): Resolvable<Palette>;
}
