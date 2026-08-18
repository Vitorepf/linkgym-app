import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TodayItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg, plannedSets } from "../../ui/format";

type Props = NativeStackScreenProps<RootStackParamList, "Ficha">;

export function Ficha({ navigation, route }: Props) {
  const { items, studioName, accent, token, prescriptionId } = route.params;
  return (
    <FichaBody
      token={token}
      studioName={studioName}
      accent={accent}
      items={items}
      prescriptionId={prescriptionId}
      onBack={() => navigation.goBack()}
    />
  );
}

export function FichaBody({
  token,
  studioName,
  accent,
  items,
  prescriptionId,
  error,
  tab,
  onBack,
}: {
  token: string;
  studioName: string;
  accent: string;
  items: TodayItem[];
  prescriptionId: string;
  error?: string;
  tab?: boolean;
  onBack?: () => void;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const ac = accent || T.accentFallback;
  const A = accentSet(ac);
  const rows = [...items].sort((a, b) => a.position - b.position);

  return (
    <Phone tab={tab}>
      <Head kicker={studioName} title="Minha ficha" accent={ac} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sem vermelho de erro para o aluno: a falha é dita, não acusada. */}
        {error ? (
          <Band rule="hair">
            <Txt role="body" tone="muted">
              {error}
            </Txt>
          </Band>
        ) : null}

        {rows.length === 0 ? (
          error ? null : (
            <Band>
              <Txt role="body" tone="muted">
                Ainda não tem ficha hoje.
              </Txt>
            </Band>
          )
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
                    studioName,
                    accent: ac,
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
      {onBack ? (
        <DockFooter>
          <AccentCTA label="Voltar à sessão" onPress={onBack} accent={ac} />
        </DockFooter>
      ) : null}
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

const styles = StyleSheet.create({
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
  row: {
    paddingHorizontal: T.pad,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
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
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
});
