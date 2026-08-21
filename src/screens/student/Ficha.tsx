import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TodayItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg, plannedSets } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Props = NativeStackScreenProps<RootStackParamList, "Ficha">;

export function Ficha({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { acento } = useTema();
  const { items, timeName, token, prescriptionId } = route.params;
  const A = acento();
  const rows = [...items].sort((a, b) => a.position - b.position);

  return (
    <Phone>
      {/* O nome do personal é CONTEXTO, não ação: mudo, como nas quatro abas. */}
      <Head kicker={timeName} title="Minha ficha" kickerMuted />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {rows.length === 0 ? (
          <Band>
            <Txt role="body" tone="muted">
              Ainda não tem ficha hoje.
            </Txt>
          </Band>
        ) : (
          <>
            <Band>
              <Figure
                value={plannedSets(rows)}
                label="Séries previstas"
                note={spread(rows)}
                role="hero"
              />
            </Band>

            <View style={styles.colHead}>
              <Txt role="label" style={styles.colName}>
                Exercício
              </Txt>
              <Txt role="label" style={styles.colKg}>
                Carga kg
              </Txt>
            </View>

            {rows.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (!prescriptionId) return;
                  navigation.navigate("ComoFazer", {
                    item,
                    items,
                    timeName,
                    token,
                    prescriptionId,
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${item.planned_sets} vezes ${item.planned_reps}, ${formatKg(item.load_kg)} kg`}
                style={[styles.row, i === rows.length - 1 && styles.last]}
              >
                <View style={styles.line}>
                  <Txt role="label" tone="dim" style={styles.ord}>
                    {String(i + 1).padStart(2, "0")}
                  </Txt>
                  <Txt role="body" style={styles.name}>
                    {item.name}
                  </Txt>
                  <Txt role="body" style={styles.kg}>
                    {formatKg(item.load_kg)}
                  </Txt>
                </View>
                <Txt role="note" tone="dim" style={styles.meta}>
                  {item.planned_sets} × {item.planned_reps}
                  {item.rest_seconds ? ` · descanso ${item.rest_seconds}s` : ""}
                </Txt>
                {item.notes ? (
                  <Txt
                    role="note"
                    style={[styles.said, { borderLeftColor: A.mark }]}
                  >
                    {item.notes}
                  </Txt>
                ) : null}
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Voltar à sessão"
          onPress={() => navigation.goBack()}
        />
      </DockFooter>
    </Phone>
  );
}

/** Legenda do número: o que a coluna da direita abrange, com valor real dos dois lados.
 *  ponytail: prosa, não Baseline — baseline exige eixo e um número contra o qual comparar,
 *  e a ficha não traz nenhum. Faixa inventada seria pior que faixa nenhuma. */
function spread(rows: TodayItem[]): string {
  const n = rows.length;
  const loads = rows.map((r) => r.load_kg).filter((kg) => kg > 0);
  const parts = [`${n} exercício${n > 1 ? "s" : ""}`];
  if (loads.length) {
    const lo = Math.min(...loads);
    const hi = Math.max(...loads);
    parts.push(
      lo === hi ? `${formatKg(lo)} kg` : `${formatKg(lo)} a ${formatKg(hi)} kg`,
    );
  }
  return parts.join(" · ");
}

const ORD = 26;

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    // ponytail: sem folga no pé — a última régua encosta no dock. Vazio que não separa
    // nada é defeito, e aqui ele só empurrava um hairline para longe de um divider.
    content: { flexGrow: 1 },
    colHead: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: T.pad,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: T.divider,
    },
    colName: { flex: 1, marginLeft: ORD + 8 },
    colKg: { width: 78, textAlign: "right" },
    // A linha CRESCE: com 3 exercícios reais a sobra da tela se divide entre as linhas em
    // vez de virar buraco órfão; com 6+ o conteúdo enche e o flexGrow é inerte.
    row: {
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
      flexGrow: 1,
      justifyContent: "center",
    },
    // ponytail: a última linha não fecha com régua própria — quem fecha a lista é o divider
    // do dock. Duas réguas paralelas a 20pt uma da outra leem como acidente.
    last: { borderBottomWidth: 0 },
    line: { flexDirection: "row", alignItems: "baseline", gap: 8 },
    ord: { width: ORD },
    name: { flex: 1 },
    kg: {
      width: 78,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },
    meta: { marginLeft: ORD + 8, marginTop: 2 },
    said: {
      marginLeft: ORD + 8,
      marginTop: SPACE.tight,
      paddingLeft: SPACE.tight,
      borderLeftWidth: 2,
    },
  }),
);
