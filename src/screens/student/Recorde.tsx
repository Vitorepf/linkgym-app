import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FinishRecord } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Recorde">;

/** O PR é DA PESSOA num EXERCÍCIO. A tela antiga dizia `127.5 / KG` e mais nada: número
 *  sem dono (que exercício?) e sem baseline conferível — o recorde anterior aparecia
 *  riscado, que é marca de falha justo na tela de comemoração.
 *
 *  As cinco camadas do número moram aqui: exercício (título), número (mega), unidade,
 *  direção (forma, nunca matiz) e a baseline com o valor dito — o recorde ANTERIOR da
 *  pessoa. Sem valor anterior, a baseline não é desenhada: em vez dela, o fato honesto
 *  ("primeiro neste exercício"), que é ausência de marca, não marca inventada.
 *
 *  ponytail: `src/ui/Baseline.tsx` não serve AQUI e não é esquecimento. O eixo dela é
 *  min..max e o recorde anterior de um PR fica sempre a um passo do novo (120 de 127,5 =
 *  94%), então a âncora nasceria colada na borda direita — o teto que o próprio arquivo
 *  declara. A baseline vira o rótulo sob o número, com o número dito. */
export function Recorde({ navigation, route }: Props) {
  const { accent, records, needsCommitment } = route.params;
  // O herói é o MAIOR número da lista, não o primeiro: com a ordem do servidor, um PR de
  // 127,5 podia cair na lista de baixo com 62,5 no corpo mega. Hierarquia invertida.
  const [top, ...rest] = [...records].sort((a, b) => b.load_kg - a.load_kg);
  const before = olderLoad(top);
  const gain = before === null ? null : Math.round((top.load_kg - before) * 10) / 10;
  const baseline =
    before === null ? "Primeiro neste exercício" : `Antes: ${formatKg(before)} kg`;

  return (
    <Phone>
      <Head
        kicker="Recorde"
        title={top ? top.exercise_name : "Nada novo hoje"}
        accent={accent}
      />

      {/* O vazio é dividido em dois: o número flutua no meio da folga e a lista + o botão
          ficam ancorados embaixo. Uma folga só, de um lado, lê como terço perdido. */}
      <View style={styles.grow} />

      {top ? (
        <View
          style={styles.hero}
          accessible
          accessibilityLabel={`${formatKg(top.load_kg)} quilos. ${baseline}.`}
        >
          <Figure
            role="mega"
            value={formatKg(top.load_kg)}
            unit="kg"
            dir={before === null ? undefined : "up"}
            labelBelow
            label={baseline}
            note={gain === null ? undefined : `+${formatKg(gain)} kg`}
          />
        </View>
      ) : null}

      <Txt role="body" tone="muted" style={styles.copy}>
        O corpo lembra. Este recorde é seu — ele não fica para trás.
      </Txt>

      <View style={styles.grow} />

      {rest.length > 0 ? (
        <View style={styles.also}>
          <Txt role="label">Também hoje</Txt>
          {rest.map((row) => {
            const older = olderLoad(row);
            return (
              <View key={row.exercise_name} style={styles.row}>
                <View style={styles.rowName}>
                  <Txt role="body">{row.exercise_name}</Txt>
                  {older !== null ? (
                    <Txt role="note" tone="dim">
                      Antes: {formatKg(older)} kg
                    </Txt>
                  ) : null}
                </View>
                <Txt role="body">{formatKg(row.load_kg)} kg</Txt>
              </View>
            );
          })}
        </View>
      ) : null}

      <DockFooter>
        {/* ponytail: o acento em ÁREA desta tela é este botão, e ele basta. A virada de
            fundo da comemoração já aconteceu na Feito, um toque atrás; repetir aqui seria
            o segundo reivindicante do orçamento. */}
        <AccentCTA
          label="Seguir"
          onPress={() => {
            if (needsCommitment) {
              navigation.navigate("Compromisso");
              return;
            }
            navigation.reset({
              index: 0,
              routes: [studentHomeTarget],
            });
          }}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

function olderLoad(row: FinishRecord | undefined): number | null {
  if (!row || !(row.previous_kg > 0) || row.previous_kg >= row.load_kg) {
    return null;
  }
  return row.previous_kg;
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  hero: { paddingHorizontal: T.pad },
  copy: { paddingHorizontal: T.pad, marginTop: 20 },
  also: {
    paddingHorizontal: T.pad,
    paddingTop: 16,
    // a última linha não pode raspar o dock: folga própria, não a do botão.
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  rowName: { flex: 1, minWidth: 0 },
});
