import {useEffect, useState, useCallback} from 'react';
import {Vibrant} from 'node-vibrant/browser';
import type {Swatch, Vec3} from "@vibrant/color";
import {rgbToHex} from "@vibrant/color";
import styles from './VibrantColors.module.css';

const defaultRgb = [0, 0, 0] as Vec3;

interface VibrantColorsProps {
    img: string;
}

const VibrantColors = ({img}: VibrantColorsProps) => {

    const [colors, setColors] = useState({
        DarkMuted: null as Swatch | null,
        DarkVibrant: null as Swatch | null,
        LightMuted: null as Swatch | null,
        LightVibrant: null as Swatch | null,
        Muted: null as Swatch | null,
        Vibrant: null as Swatch | null,
    })

    const runVibrant = useCallback(() => {
        Vibrant.from(img).getPalette()
            .then(palette => setColors({
                DarkMuted: palette!.DarkMuted,
                DarkVibrant: palette!.DarkVibrant,
                LightMuted: palette!.LightMuted,
                LightVibrant: palette!.LightVibrant,
                Muted: palette!.Muted,
                Vibrant: palette!.Vibrant
            }))
    }, [img])

    useEffect(() => runVibrant(), [runVibrant])

    return (
        <div className={styles.colors}>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.Vibrant?.rgb ?? defaultRgb)) ?? "", "--color": colors.Vibrant?.bodyTextColor} as React.CSSProperties}>Vibrant</p>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.DarkVibrant?.rgb ?? defaultRgb)) ?? "", "--color": colors.DarkVibrant?.bodyTextColor} as React.CSSProperties}>Dark Vibrant</p>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.LightVibrant?.rgb ?? defaultRgb)) ?? "", "--color": colors.LightVibrant?.bodyTextColor} as React.CSSProperties}>Light Vibrant</p>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.Muted?.rgb ?? defaultRgb)) ?? "", "--color": colors.Muted?.bodyTextColor} as React.CSSProperties}>Muted</p>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.DarkMuted?.rgb ?? defaultRgb)) ?? "", "--color": colors.DarkMuted?.bodyTextColor} as React.CSSProperties}>Dark Muted</p>
                <p className={styles.swatch} style={{"--bg-color": rgbToHex(...(colors.LightMuted?.rgb ?? defaultRgb)) ?? "", "--color": colors.LightMuted?.bodyTextColor} as React.CSSProperties}>Light Muted</p>
            </div>
    )
}

export default VibrantColors;
