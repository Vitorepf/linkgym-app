/** D4: exatamente 3 intensidades. Zero em rolagem, navegação ou abertura. */
const MS = { light: 12, confirm: 32, feast: 56 } as const;

export type Tap = keyof typeof MS;

export function vibrate(kind: Tap) {
  const nav = typeof navigator === "undefined" ? undefined : navigator;
  if (nav && typeof nav.vibrate === "function") nav.vibrate(MS[kind]);
}
