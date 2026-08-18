import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  applyOwnerAttention,
  ownerAttention,
  type OwnerAttention,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { GhostCTA } from "../../ui/GhostCTA";
import { Initials } from "../../ui/Initials";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { weekdayLong } from "../../ui/format";

type Props = NativeStackScreenProps<RootStackParamList, "Atencao">;

export function Atencao({ route }: Props) {
  const { token, accent } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Atencao">>();
  const [items, setItems] = useState<OwnerAttention[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const payload = await ownerAttention(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir a atenção.");
    } finally {
      setLoaded(true);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function apply(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await applyOwnerAttention(token, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  const remaining = items.length;
  const resolved = 3 - remaining;
  const title = loaded
    ? `${remaining} alunos precisam de você`
    : undefined;

  return (
    <Phone>
      <Head
        kicker={`${weekdayLong()} · entre uma aula e outra`}
        title={title}
        body={loaded ? "Os outros estão no automático." : undefined}
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loaded && items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyKicker, { color: T.ok }]}>
              Nada pendente
            </Text>
            <Text style={styles.emptyTitle}>Pode voltar para a aula</Text>
          </View>
        ) : null}

        {items.map((row) => (
          <View key={row.id} style={styles.card}>
            <View style={styles.cardHead}>
              <Initials name={row.name} size={36} />
              <View style={styles.cardCopy}>
                <Text style={styles.name}>{row.name}</Text>
                <Text style={styles.why}>{whyFor(row)}</Text>
              </View>
              <Text style={styles.tag}>{tagFor(row.reason)}</Text>
            </View>
            <View style={[styles.box, { borderLeftColor: accent }]}>
              <Text style={styles.boxKicker}>Decisão pronta</Text>
              <Text style={styles.decision}>{row.decision}</Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.apply}>
                <AccentCTA
                  label="Aplicar"
                  onPress={() => void apply(row.id)}
                  accent={accent}
                  busy={busy === row.id}
                  disabled={busy !== null && busy !== row.id}
                  check
                />
              </View>
              <GhostCTA
                label="Ver ficha"
                disabled={busy !== null}
                onPress={() =>
                  navigation.navigate("Aluna", {
                    token,
                    personId: row.person_id,
                    studioName: route.params.studioName,
                    accent,
                  })
                }
              />
            </View>
          </View>
        ))}
      </ScrollView>
      {loaded ? (
        <DockFooter>
          <View style={styles.dockRow}>
            <Text style={styles.resolved}>
              {Math.max(0, resolved)} de 3 resolvidos
            </Text>
            <GhostCTA
              label="Revisão"
              onPress={() =>
                navigation.navigate("Revisao", {
                  token,
                  studioName: route.params.studioName,
                  accent,
                })
              }
            />
          </View>
        </DockFooter>
      ) : null}
    </Phone>
  );
}

function tagFor(reason: string): string {
  switch (reason) {
    case "student_stopped":
      return "SUMIU";
    case "pain_flag":
      return "DOR";
    case "debut":
      return "ESTREIA";
    case "high_effort":
      return "DIFÍCIL";
    default:
      return reason.toUpperCase();
  }
}

function whyFor(row: OwnerAttention): string {
  switch (row.reason) {
    case "student_stopped":
      return `${row.days ?? 1} dias sem treinar`;
    case "pain_flag":
      return "Marcou dor no onboarding";
    case "debut":
      return "Ainda não fez a estreia";
    case "high_effort":
      return "Última sessão difícil";
    default:
      return row.reason;
  }
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  empty: {
    paddingHorizontal: T.pad,
    paddingVertical: 24,
  },
  emptyKicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  emptyTitle: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 24,
    letterSpacing: -0.6,
    marginTop: 8,
  },
  card: {
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardCopy: { flex: 1, minWidth: 0 },
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  why: {
    color: T.muted,
    fontSize: 13,
    marginTop: 2,
  },
  tag: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 10,
    letterSpacing: 1.1,
    flexShrink: 0,
  },
  box: {
    marginTop: 14,
    backgroundColor: T.raised,
    borderLeftWidth: 3,
    padding: 14,
  },
  boxKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.32,
    textTransform: "uppercase",
  },
  decision: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    marginTop: 14,
  },
  apply: { flex: 1 },
  dockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  resolved: {
    flex: 1,
    color: T.muted,
    fontSize: 13,
  },
});
