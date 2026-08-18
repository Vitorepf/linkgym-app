import { StyleSheet, Text, type TextProps } from "react-native";
import { FONT, LEAD, productTheme as T, TRACK, TYPE } from "../theme";

/** A raiz do defeito D1: 73 blocos com fontSize e sem fontFamily caíam na fonte do
 *  SISTEMA, e o app virava duas famílias por acidente. Nenhum remendo resolve isso —
 *  um componente que SEMPRE injeta a família, sim. Todo texto passa por aqui.
 *
 *  Sete papéis sobre SEIS corpos. Um letter-spacing e um lineHeight por corpo.
 *  `label` é o rótulo do eixo 1: caixa alta, tracked, mudo — o valor é que tem cor. */
type Role = "label" | "note" | "body" | "title" | "value" | "hero" | "mega";
type Tone = "ink" | "muted" | "dim";

// `role` é prop reservada do RN (papel ARIA). Omitida de propósito: aqui role é o papel
// TIPOGRÁFICO. Quem precisar do ARIA usa accessibilityRole.
type Props = Omit<TextProps, "role"> & {
  role?: Role;
  tone?: Tone;
  color?: string;
};

export function Txt({ role = "body", tone, color, style, ...rest }: Props) {
  const t: Tone = tone ?? (role === "label" || role === "note" ? "muted" : "ink");
  return <Text {...rest} style={[styles[role], TONE[t], color ? { color } : null, style]} />;
}

const TONE = StyleSheet.create({
  ink: { color: T.ink },
  muted: { color: T.muted },
  dim: { color: T.muted2 },
});

const num = { fontVariant: ["tabular-nums" as const] };

const styles = StyleSheet.create({
  label: {
    fontFamily: FONT,
    fontSize: TYPE.label,
    lineHeight: LEAD.label,
    letterSpacing: TRACK.label,
    textTransform: "uppercase",
  },
  note: {
    fontFamily: FONT,
    fontSize: TYPE.label,
    lineHeight: LEAD.label,
    letterSpacing: 0,
  },
  body: {
    fontFamily: FONT,
    fontSize: TYPE.body,
    lineHeight: LEAD.body,
    letterSpacing: TRACK.body,
  },
  title: {
    fontFamily: FONT,
    fontSize: TYPE.title,
    lineHeight: LEAD.title,
    letterSpacing: TRACK.title,
  },
  value: {
    fontFamily: FONT,
    fontSize: TYPE.value,
    lineHeight: LEAD.value,
    letterSpacing: TRACK.value,
    ...num,
  },
  hero: {
    fontFamily: FONT,
    fontSize: TYPE.hero,
    lineHeight: LEAD.hero,
    letterSpacing: TRACK.hero,
    ...num,
  },
  mega: {
    fontFamily: FONT,
    fontSize: TYPE.mega,
    lineHeight: LEAD.mega,
    letterSpacing: TRACK.mega,
    ...num,
  },
});
