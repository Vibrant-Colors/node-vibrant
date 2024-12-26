import {useCallback, useEffect, useState} from 'react';
import {Vibrant} from 'node-vibrant/browser';
import styles from './VibrantColors.module.css';
import type {Swatch} from "@vibrant/color";

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
        <ul className={styles.colors} aria-label={"Colors for the associated image"}>
            <li className={styles.swatch} style={{"--bg-color": colors.Vibrant?.hex ?? "#000", "--color": colors.Vibrant?.bodyTextColor} as React.CSSProperties}>Vibrant</li>
            <li className={styles.swatch} style={{"--bg-color": colors.DarkVibrant?.hex ?? "#000", "--color": colors.DarkVibrant?.bodyTextColor} as React.CSSProperties}>Dark Vibrant</li>
            <li className={styles.swatch} style={{"--bg-color": colors.LightVibrant?.hex ?? "#000", "--color": colors.LightVibrant?.bodyTextColor} as React.CSSProperties}>Light Vibrant</li>
            <li className={styles.swatch} style={{"--bg-color": colors.Muted?.hex ?? "#000", "--color": colors.Muted?.bodyTextColor} as React.CSSProperties}>Muted</li>
            <li className={styles.swatch} style={{"--bg-color": colors.DarkMuted?.hex ?? "#000", "--color": colors.DarkMuted?.bodyTextColor} as React.CSSProperties}>Dark Muted</li>
            <li className={styles.swatch} style={{"--bg-color": colors.LightMuted?.hex ?? "#000", "--color": colors.LightMuted?.bodyTextColor} as React.CSSProperties}>Light Muted</li>
        </ul>
    )
}

export default VibrantColors;
