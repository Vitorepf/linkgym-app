import { StyleSheet, View } from "react-native";
import { productTheme as T, TYPE } from "../theme";
import { TrendMark } from "./Icons";
import { Txt } from "./Txt";

/** As camadas que o número do eixo 1 carrega e o nosso não carregava. O ArcGauge entregava
 *  DUAS (número + rótulo); esta peça entrega CINCO e não inventa tela nenhuma:
 *    número · unidade · rótulo · direção · legenda
 *  (decomposição = uma fila de Figures; causa e ação são prosa e botão, da Fase 2.)
 *
 *  A UNIDADE é um nível tipográfico próprio, nunca parte da string do número, e SOME
 *  quando não existe — `85 %` leva unidade, `14.2` não leva. Ela cai exatamente dois
 *  degraus abaixo do número, o que a escala de razão 1,5 entrega de graça (≈45%).
 *
 *  A BASELINE de verdade NÃO mora aqui: ela exige um número real ancorado na posição real
 *  do eixo, e isso é `src/ui/Baseline.tsx`. O que sobra aqui é `note` — legenda muda ao pé
 *  do número, prosa e nada mais. O slot antigo chamava-se `baseline` e aceitava string
 *  solta: era por ali que "MÉDIA" entrava sem nenhum número atrás. */
type Props = {
  value: string | number;
  label: string;
  unit?: string;
  note?: string;
  dir?: "up" | "down" | "flat";
  role?: "value" | "hero" | "mega";
  labelBelow?: boolean;
  center?: boolean;
};

const UNIT_OF = { value: "body", hero: "title", mega: "value" } as const;

export function Figure({
  value,
  label,
  unit,
  note,
  dir,
  role = "value",
  labelBelow,
  center,
}: Props) {
  const line = (
    <View style={[styles.line, center && styles.center]}>
      <Txt role={role}>{value}</Txt>
      {unit ? (
        <Txt role={UNIT_OF[role]} tone="muted">
          {unit}
        </Txt>
      ) : null}
      {dir ? (
        <View style={{ paddingBottom: Math.round(TYPE[role] * 0.18) }}>
          <TrendMark dir={dir} color={T.muted} size={Math.round(TYPE[role] * 0.28)} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={center ? styles.center : undefined}>
      {labelBelow ? null : <Txt role="label">{label}</Txt>}
      {line}
      {labelBelow ? <Txt role="label">{label}</Txt> : null}
      {note ? (
        <Txt role="note" tone="dim" style={styles.note}>
          {note}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  center: { alignItems: "center" },
  note: { marginTop: 4 },
});
