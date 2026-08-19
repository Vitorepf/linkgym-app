import { StyleSheet, Text, type TextProps } from "react-native";
import { estilos } from "./tema";

/** DUAS FACES, UM PAPEL CADA. `label`, `note` e `body` — o que se LÊ — usam a face de
 *  texto; `title`, `value`, `hero` e `mega` — o que se VÊ — usam a de display. Numa voz de
 *  face única (o padrão) as duas são a mesma e nada muda; nas outras é isso que faz o app
 *  ter personalidade sem perder legibilidade, porque a face que carrega parágrafo nunca é
 *  a mesma que carrega um número de 92pt.
 *
 *  `value`, `hero` e `mega` — os degraus que existem para NÚMERO — usam uma terceira
 *  face, a que tem dígito de largura fixa. Sem ela, três das cinco vozes entregavam
 *  cronômetro e recorde dançando a cada dígito, porque o `tabular-nums` pedido aqui não
 *  existe em Playfair, Nunito nem Oswald.
 *
 *  A raiz do defeito D1: 73 blocos com fontSize e sem fontFamily caíam na fonte do
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
  const styles = usarEstilos();
  const TONE = usarTons();
  const t: Tone = tone ?? (role === "label" || role === "note" ? "muted" : "ink");
  return <Text {...rest} style={[styles[role], TONE[t], color ? { color } : null, style]} />;
}

const usarTons = estilos(({ T }) =>
  StyleSheet.create({
    ink: { color: T.ink },
    muted: { color: T.muted },
    dim: { color: T.muted2 },
  }),
);

/** Números do produto são de CAIXA ALTA e de largura fixa, em qualquer voz. `tabular-nums`
 *  já travava a largura — o que faltava era `lining-nums`: faces editoriais (Playfair, e
 *  boa parte das serifadas) entregam algarismo ANTIGO por padrão, com o 3, o 4 e o 7
 *  descendo abaixo da linha. Num app cujo herói é um número de 92pt, isso lê como baseline
 *  quebrada. Uma palavra, e a voz muda o desenho da letra sem mexer na do número. */
const num = { fontVariant: ["lining-nums" as const, "tabular-nums" as const] };

const usarEstilos = estilos(({ TYPE, TRACK, LEAD, FONTES }) =>
  StyleSheet.create({
    label: {
      fontFamily: FONTES.texto,
      fontSize: TYPE.label,
      lineHeight: LEAD.label,
      letterSpacing: TRACK.label,
      textTransform: "uppercase",
    },
    // A LEGENDA. Mesmo corpo, mesma entrelinha e mesma face do `label` — de propósito: é o
    // rodapé do mesmo objeto. O que a separa do rótulo são DOIS canais, e este bloco
    // declara os dois:
    //   caixa — `label` transforma, `note` não;
    //   tracking — `TRACK.label` (1,3 a 1,7 conforme a voz, com o `ajuste` do par de fontes)
    //   contra este `0`.
    // O `0` NÃO é omissão: é o segundo canal, e é o único que sobrevive quando a legenda é
    // numérica (`+2,5 kg`, em Recorde), onde a caixa alta quase não tem letra em que pegar.
    // Copiar `TRACK.label` para cá "por consistência" mata o par. O tom NÃO é canal aqui, e
    // não pode voltar a ser: `dim` é `muted2`, calibrado contra os quatro fundos e não
    // contra o pixel da peça preenchida, onde esta legenda pousa (§30 de tools/aparencia.mjs).
    note: {
      fontFamily: FONTES.texto,
      fontSize: TYPE.label,
      lineHeight: LEAD.label,
      letterSpacing: 0,
    },
    body: {
      fontFamily: FONTES.texto,
      fontSize: TYPE.body,
      lineHeight: LEAD.body,
      letterSpacing: TRACK.body,
    },
    title: {
      fontFamily: FONTES.display,
      fontSize: TYPE.title,
      lineHeight: LEAD.title,
      letterSpacing: TRACK.title,
    },
    value: {
      fontFamily: FONTES.numero,
      fontSize: TYPE.value,
      lineHeight: LEAD.value,
      letterSpacing: TRACK.value,
      ...num,
    },
    hero: {
      fontFamily: FONTES.numero,
      fontSize: TYPE.hero,
      lineHeight: LEAD.hero,
      letterSpacing: TRACK.hero,
      ...num,
    },
    mega: {
      fontFamily: FONTES.numero,
      fontSize: TYPE.mega,
      lineHeight: LEAD.mega,
      letterSpacing: TRACK.mega,
      ...num,
    },
  }),
);
