// src/utils/palette.ts
//
// Derives a full tonal color scale from a single brand hex color, computed
// at build time (no runtime cost, no external API). This is what makes
// "one config value" produce a rich, multi-tone design system rather than
// a single flat color repeated everywhere.
//
// Uses OKLCH (perceptually uniform color space) rather than naive RGB/hex
// math — shifting lightness in OKLCH keeps hue and saturation looking
// correct at every step, which is why Tailwind v4 itself moved to OKLCH
// for its default palette. Doing the same math in plain hex/RGB tends to
// produce muddy or unevenly-spaced shades, especially on saturated brand
// colors.
import { oklch, formatCss, parse, type Oklch } from "culori";

export interface TonalScale {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
}

// Lightness targets roughly matched to Tailwind's own 50-950 scale shape,
// so a generated brand scale sits comfortably alongside Tailwind's slate/
// gray neutrals used elsewhere in the templates.
const LIGHTNESS_STEPS: Record<keyof TonalScale, number> = {
  50: 0.97, 100: 0.94, 200: 0.88, 300: 0.80, 400: 0.70,
  500: 0.60, 600: 0.50, 700: 0.42, 800: 0.34, 900: 0.27, 950: 0.20,
};

// Chroma (saturation) multiplier per step, relative to the input color's
// own chroma. Peaks near 500-600 and falls off toward both white (50) and
// black (950) — this is what makes the 50/100 steps read as soft, pastel
// tints rather than washed-out-but-still-saturated colors. Visually
// verified against several brand hues (blue, red, green, orange) before
// being set as the default curve.
const CHROMA_MULTIPLIER: Record<keyof TonalScale, number> = {
  50: 0.12, 100: 0.22, 200: 0.40, 300: 0.62, 400: 0.84,
  500: 1.0, 600: 0.96, 700: 0.86, 800: 0.72, 900: 0.58, 950: 0.46,
};

/**
 * Generate an 11-step OKLCH tonal scale from a single brand hex color.
 * The input color is treated as roughly the "500" point; lighter and
 * darker steps are derived by adjusting lightness while scaling chroma
 * along the curve above, with hue held constant throughout.
 */
export function generateTonalScale(hex: string): TonalScale {
  const base = oklch(parse(hex)) as Oklch | undefined;
  if (!base) {
    throw new Error(`generateTonalScale: could not parse color "${hex}"`);
  }
  const baseChroma = base.c ?? 0.1;
  const hue = base.h ?? 0;

  const scale = {} as TonalScale;
  for (const step of Object.keys(LIGHTNESS_STEPS) as unknown as Array<keyof TonalScale>) {
    const lightness = LIGHTNESS_STEPS[step];
    const chroma = baseChroma * CHROMA_MULTIPLIER[step];
    scale[step] = formatCss({ mode: "oklch", l: lightness, c: Math.max(chroma, 0), h: hue });
  }
  return scale;
}

/**
 * Generate a small set of CSS custom properties for the brand scale plus a
 * couple of derived semantic tokens (gradient stops, tinted surface) used
 * across the templates. Returned as a single object suitable for Astro's
 * `define:vars`.
 */
export function generateBrandCssVars(hex: string): Record<string, string> {
  const scale = generateTonalScale(hex);
  return {
    brand50: scale[50], brand100: scale[100], brand200: scale[200],
    brand300: scale[300], brand400: scale[400], brand500: scale[500],
    brand600: scale[600], brand700: scale[700], brand800: scale[800],
    brand900: scale[900], brand950: scale[950],
    // Convenience aliases used directly in components:
    brand: scale[600],       // primary action color (buttons, links)
    brandDark: scale[800],   // hover/active states, dark text-on-light accents
    brandSurface: scale[50], // tinted section backgrounds
    brandSurfaceStrong: scale[100],
  };
}
