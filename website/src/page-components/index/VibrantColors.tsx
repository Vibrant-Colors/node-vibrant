import { useCallback, useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { CheckIcon, CopyIcon } from "../../icons";
import { useCopy } from "../../hooks/use-copy";
import styles from "./VibrantColors.module.css";
import type { Swatch } from "@vibrant/color";

interface VibrantColorsProps {
	img: string;
}

const SWATCHES = [
	{ key: "Vibrant", label: "Vibrant" },
	{ key: "DarkVibrant", label: "Dark Vibrant" },
	{ key: "LightVibrant", label: "Light Vibrant" },
	{ key: "Muted", label: "Muted" },
	{ key: "DarkMuted", label: "Dark Muted" },
	{ key: "LightMuted", label: "Light Muted" },
] as const;

type PaletteColors = Record<(typeof SWATCHES)[number]["key"], Swatch | null>;

interface ColorSwatchProps {
	label: string;
	swatch: Swatch | null;
}

const ColorSwatch = ({ label, swatch }: ColorSwatchProps) => {
	const { copied, copy } = useCopy();
	const hex = swatch?.hex;

	const copyColor = () => {
		if (!hex) return;
		void copy(hex);
	};

	return (
		<li>
			<button
				type="button"
				className={styles.swatch}
				style={
					{
						"--bg-color": hex ?? "#000",
						"--color": swatch?.bodyTextColor,
					} as React.CSSProperties
				}
				onClick={copyColor}
				disabled={!hex}
				aria-label={`Copy ${label} ${hex ?? ""}`}
				data-copied={copied || undefined}
			>
				<span className={styles["swatch-label"]}>{label}</span>
				<span className={styles["swatch-hex-row"]}>
					<span className={styles["swatch-hex"]}>{hex}</span>
					<span className={styles["copy-icon"]} aria-live="polite">
						{copied ? (
							<CheckIcon className={styles.icon} />
						) : (
							<CopyIcon className={styles.icon} />
						)}
						<span className={styles.tooltip} role="tooltip">
							{copied ? "Copied!" : "Click to copy"}
						</span>
					</span>
				</span>
			</button>
		</li>
	);
};

const VibrantColors = ({ img }: VibrantColorsProps) => {
	const [colors, setColors] = useState<PaletteColors>({
		DarkMuted: null,
		DarkVibrant: null,
		LightMuted: null,
		LightVibrant: null,
		Muted: null,
		Vibrant: null,
	});

	const runVibrant = useCallback(() => {
		Vibrant.from(img)
			.getPalette()
			.then((palette) =>
				setColors({
					DarkMuted: palette!.DarkMuted,
					DarkVibrant: palette!.DarkVibrant,
					LightMuted: palette!.LightMuted,
					LightVibrant: palette!.LightVibrant,
					Muted: palette!.Muted,
					Vibrant: palette!.Vibrant,
				}),
			);
	}, [img]);

	useEffect(() => runVibrant(), [runVibrant]);

	return (
		<ul
			className={styles.colors}
			aria-label={"Colors for the associated image"}
		>
			{SWATCHES.map(({ key, label }) => (
				<ColorSwatch key={key} label={label} swatch={colors[key]} />
			))}
		</ul>
	);
};

export default VibrantColors;
