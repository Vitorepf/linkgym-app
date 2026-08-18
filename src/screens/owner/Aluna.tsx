import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ownerStudent, type OwnerStudent } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Aluna">;

export function Aluna({ navigation, route }: Props) {
  const { token, personId, accent } = route.params;
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

  return (
    <Screen title={name} accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {card ? (
          <>
            <PrimaryButton
              label={primaryCopy(card.suggested)}
              onPress={() => {
                if (
                  card.suggested !== "renew" &&
                  card.suggested !== "debut"
                ) {
                  return;
                }
                navigation.navigate("Base", {
                  token,
                  studioName: route.params.studioName,
                  accent,
                  personId: card.person_id,
                  personName: card.name,
                });
              }}
            />

            {card.last_loads.map((row) => (
              <Text key={row.exercise_name} style={styles.line}>
                {row.exercise_name} · {formatKg(row.load_kg)} kg
              </Text>
            ))}

            <Text style={styles.section}>Ofensiva</Text>
            <Text style={[styles.streak, { color: accent }]}>
              {card.streak.current_count}
            </Text>

            {effort ? <Text style={styles.line}>{effort}</Text> : null}

            <Pressable
              onPress={() =>
                navigation.navigate("Base", {
                  token,
                  studioName: route.params.studioName,
                  accent,
                  personId: card.person_id,
                  personName: card.name,
                })
              }
              style={styles.nova}
              hitSlop={8}
            >
              <Text style={styles.novaText}>Nova ficha</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </Screen>
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

function formatKg(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace(".", ",");
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 12,
  },
  section: {
    marginTop: 28,
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  line: {
    color: productTheme.ink,
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  streak: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 48,
    letterSpacing: -1,
    marginTop: 8,
  },
  nova: { marginTop: 32, alignSelf: "flex-start" },
  novaText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
