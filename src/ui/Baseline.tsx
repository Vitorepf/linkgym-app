import { StyleSheet, View } from "react-native";
import { productTheme as T } from "../theme";
import { Txt } from "./Txt";

/** BASELINE DE VERDADE.
 *
 *  Dois juízes independentes bateram no mesmo ponto: sob o medidor da Hoje havia uma
 *  régua `0 — MÉDIA — 100` com a palavra MÉDIA CENTRALIZADA, ou seja, exatamente onde o
 *  eixo lê 50. Lia-se "a média é 50". Média de quem? Ninguém sabia, porque não havia
 *  número nenhum atrás daquilo.
 *
 *  Uma baseline falsa é PIOR que nenhuma. Então esta peça:
 *    - EXIGE um número real (`value`), tipado, não uma string de prosa;
 *    - ancora esse número na POSIÇÃO real dele no eixo, não no meio;
 *    - DIZ o número junto do rótulo, para a âncora poder ser conferida;
 *    - e, se o chamador não tiver o valor, ele não passa `baseline` e nada é desenhado.
 *      Não desenhar é a resposta certa — não existe placeholder de baseline.
 *
 *  Hoje é o caso vivo disso: /v1/today devolve `readiness.score` e mais nada com que
 *  comparar, então a Prontidão fica SEM baseline até a API mandar uma. A camada continua
 *  faltando; o que sumiu foi a mentira. */
export type BaselineSpec = {
  /** o número contra o qual a métrica está sendo comparada. Sem ele, sem baseline. */
  value: number;
  /** de quem é este número: "SUA MÉDIA DE 30 DIAS", "COMBINADO COM O PERSONAL". */
  label: string;
  min?: number;
  max?: number;
  unit?: string;
};

export function Baseline({ value, label, min = 0, max = 100, unit }: BaselineSpec) {
  // ponytail: fora do eixo não é baseline, é ruído — some, mesmo com valor.
  if (!Number.isFinite(value) || value < min || value > max || max <= min) return null;
  const t = (value - min) / (max - min);

  return (
    <View style={styles.wrap}>
      <View style={styles.axis}>
        <Txt role="label" tone="dim">
          {min}
        </Txt>
        <Txt role="label" tone="dim">
          {max}
        </Txt>
      </View>
      <View style={styles.rule} />
      <View style={[styles.anchor, { left: `${t * 100}%` }]}>
        <View style={styles.tick} />
        <Txt role="label" style={styles.num}>
          {value}
          {unit ?? ""}
        </Txt>
        <Txt role="label" tone="dim" numberOfLines={1}>
          {label}
        </Txt>
      </View>
    </View>
  );
}

// ponytail: caixa de largura fixa centrada na fração, em vez de medir o texto com
// onLayout. Teto conhecido: com o valor muito perto de 0 ou de 100 o rótulo passa da
// margem da faixa. Upgrade quando incomodar: onLayout na régua e no rótulo, e grudar o
// rótulo na ponta em vez de centrar.
const ANCHOR = 160;

const styles = StyleSheet.create({
  wrap: { marginTop: 14, paddingBottom: 38 },
  axis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  rule: { height: 1, backgroundColor: T.hairline },
  anchor: {
    position: "absolute",
    top: 22,
    width: ANCHOR,
    marginLeft: -ANCHOR / 2,
    alignItems: "center",
  },
  tick: { width: 2, height: 9, backgroundColor: T.divider },
  num: { color: T.ink, letterSpacing: 0 },
});
