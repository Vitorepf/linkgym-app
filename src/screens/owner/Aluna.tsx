import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ownerStudent, type OwnerStudent } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, errorInk, FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, Head, Phone } from "../../ui/Screen";
import { formatKg } from "../../ui/format";

type Props = NativeStackScreenProps<RootStackParamList, "Aluna">;

export function Aluna({ navigation, route }: Props) {
  const { token, personId, accent } = route.params;
  const A = accentSet(accent, T.raised);
  const [card, setCard] = useState<OwnerStudent | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const payload = await ownerStudent(token, personId);
      setCard(payload);
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const name = card?.name ?? "";
  const effort = effortWord(card?.last_effort ?? null);
  const topLoad = card?.last_loads[0];

  function goBase() {
    if (!card) return;
    navigation.navigate("Base", {
      token,
      studioName: route.params.studioName,
      accent,
      personId: card.person_id,
      personName: card.name,
    });
  }

  const metrics = card
    ? [
        {
          label: "Ofensiva",
          value: card.streak.current_count,
          note: effort || undefined,
        },
        {
          label: "Cargas",
          value: card.last_loads.length,
        },
        topLoad
          ? {
              label: topLoad.exercise_name,
              value: formatKg(topLoad.load_kg),
              unit: "kg",
            }
          : { label: "Carga", value: "—" },
      ]
    : [];

  return (
    <Phone>
      <Head
        kicker={card?.commitment_text ?? undefined}
        title={name || undefined}
        kickerMuted
        accent={accent}
        right={
          name ? (
            <Initials name={name} accent={accent} fill size={46} />
          ) : undefined
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {card ? (
          <>
            <MetricGrid cells={metrics} columns={3} />

            <Band raised accentTop accent={accent}>
              <Text style={[styles.kicker, { color: A.text }]}>
                Ação sugerida
              </Text>
              <View style={styles.cta}>
                <AccentCTA
                  label={primaryCopy(card.suggested)}
                  accent={accent}
                  onPress={() => {
                    if (
                      card.suggested !== "renew" &&
                      card.suggested !== "debut"
                    ) {
                      return;
                    }
                    goBase();
                  }}
                />
              </View>
            </Band>

            {card.last_loads.map((row) => (
              <View key={row.exercise_name} style={styles.loadRow}>
                <Text style={styles.loadName}>{row.exercise_name}</Text>
                <Text style={styles.loadKg}>
                  {formatKg(row.load_kg)} kg
                </Text>
              </View>
            ))}

            <Pressable
              onPress={goBase}
              style={styles.nova}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.novaText}>Nova ficha</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

function primaryCopy(suggested: string): string {
  switch (suggested) {
    case "nudge":
    case "student_stopped":
    case "comeback":
      return "Mandar retomada";
    case "renew":
    case "debut":
      return "Publicar estreia";
    default:
      return "Manter";
  }
}

function effortWord(n: number | null): string {
  if (n === 1) return "Fácil";
  if (n === 3) return "Difícil";
  if (n === 2) return "No ponto";
  return "";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
  error: {
    color: errorInk,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  cta: { marginTop: 10 },
  loadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  loadName: {
    flex: 1,
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  loadKg: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  nova: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  novaText: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  chev: { color: T.muted2, fontSize: 18 },
});
