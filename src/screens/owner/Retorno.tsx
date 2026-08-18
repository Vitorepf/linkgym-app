import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  applyOwnerReturn,
  ownerReturns,
  type OwnerReturn,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Initials } from "../../ui/Initials";
import { Head, Phone } from "../../ui/Screen";
import { formatKg } from "../../ui/format";

type Bump = 2.5 | 0 | -2.5;

type Props = NativeStackScreenProps<RootStackParamList, "Retorno">;

const BUMPS: { value: Bump; label: string }[] = [
  { value: -2.5, label: "−2,5" },
  { value: 0, label: "0" },
  { value: 2.5, label: "+2,5" },
];

export function Retorno({ route }: Props) {
  const { token, studioName, accent } = route.params;
  const [items, setItems] = useState<OwnerReturn[]>([]);
  const [bumpFor, setBumpFor] = useState<Record<string, Bump>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const payload = await ownerReturns(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir os retornos.");
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function apply(alertId: string, bump: Bump) {
    if (busy) return;
    setBusy(alertId);
    try {
      await applyOwnerReturn(token, alertId, bump);
      setItems((prev) => prev.filter((it) => it.alert_id !== alertId));
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Phone>
      <Head kicker={studioName} title="Retornos" kickerMuted accent={accent} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.length === 0 && !error ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>Nada para retornar.</Text>
          </View>
        ) : null}

        {items.map((row) => {
          const bump = bumpFor[row.alert_id] ?? 0;
          return (
            <View key={row.alert_id} style={styles.card}>
              <View style={styles.cardHead}>
                <Initials name={row.name} size={36} />
                <View style={styles.cardCopy}>
                  <Text style={styles.name}>{row.name}</Text>
                  <Text style={styles.effort}>{effortWord(row.effort)}</Text>
                </View>
              </View>

              {row.records.map((rec) => (
                <View
                  key={rec.exercise_name}
                  style={[styles.banner, { borderLeftColor: accent }]}
                >
                  <Text style={styles.bannerKicker}>PR</Text>
                  <Text style={styles.bannerText}>
                    Elogia o PR de {rec.exercise_name} · {formatKg(rec.load_kg)}{" "}
                    kg
                  </Text>
                </View>
              ))}

              <View style={styles.bumps}>
                {BUMPS.map((b) => (
                  <Choice
                    key={b.label}
                    label={b.label}
                    selected={bump === b.value}
                    flex
                    accent={accent}
                    onPress={() =>
                      setBumpFor((prev) => ({
                        ...prev,
                        [row.alert_id]: b.value,
                      }))
                    }
                  />
                ))}
              </View>

              <View style={styles.cta}>
                <AccentCTA
                  label="Aplicar"
                  accent={accent}
                  check
                  busy={busy === row.alert_id}
                  disabled={busy !== null && busy !== row.alert_id}
                  onPress={() => void apply(row.alert_id, bump)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Phone>
  );
}

function effortWord(n: number): string {
  if (n === 1) return "Fácil";
  if (n === 3) return "Difícil";
  return "No ponto";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
  emptyWrap: {
    paddingHorizontal: T.pad,
    paddingTop: 24,
  },
  empty: {
    color: T.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
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
  effort: {
    color: T.muted,
    fontSize: 13,
    marginTop: 2,
  },
  banner: {
    marginTop: 14,
    paddingLeft: 12,
    borderLeftWidth: 3,
    backgroundColor: T.raised,
    paddingVertical: 12,
    paddingRight: 12,
  },
  bannerKicker: {
    color: T.ok,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.32,
    textTransform: "uppercase",
  },
  bannerText: {
    color: T.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  bumps: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  cta: { marginTop: 12 },
});
