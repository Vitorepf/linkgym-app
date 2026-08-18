// Modernist tokens from LinkGym v2 prototype (dark phone invert).
export const FONT = "Archivo_800ExtraBold";

export const productTheme = {
  bg: "#0b0a0a",
  surface: "#141312",
  dock: "#0f0e0e",
  raised: "#1c1a19",
  ink: "#f3f2f2",
  muted: "#9b9797",
  muted2: "#7d7979",
  hairline: "#232120",
  divider: "#444141",
  fill: "#2d2b2b",
  ok: "#7ee0a1",
  radius: 0,
  accentFallback: "#ec3013",
  pad: 20,
} as const;

export type StudioTheme = {
  name: string;
  accent: string;
  logoUrl?: string;
};
