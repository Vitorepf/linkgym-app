# Tokens Modernist (produto). A cor de acento do personal sobrescreve `accent` depois do login.
export const productTheme = {
  bg: "#0b0a0a",
  ink: "#f3f2f2",
  muted: "#9b9797",
  divider: "#444141",
  radius: 0,
  accentFallback: "#ec3013",
} as const;

export type StudioTheme = {
  name: string;
  accent: string;
  logoUrl?: string;
};
