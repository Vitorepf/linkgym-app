import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  applyOwnerAttention,
  ownerAttention,
  type OwnerAttention,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Atencao">;

const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function Atencao({ route }: Props) {
  const { token, accent } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Atencao">>();
  const [items, setItems] = useState<OwnerAttention[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const payload = await ownerAttention(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir a atenção.");
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
  const weekday = WEEKDAYS[new Date().getDay()];
  const resolved = 3 - remaining;

  return (
    <Screen
      kicker={`${weekday} · entre uma aula e outra`}
      title={`${remaining} alunos precisam de você`}
      body="Os outros estão no automático."
      accent={accent}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.map((row) => (
          <View key={row.id} style={styles.row}>
            <View style={styles.head}>
              <Text style={styles.name}>{row.name}</Text>
              <Text style={[styles.tag, { color: accent, borderColor: accent }]}>
                {tagFor(row.reason)}
              </Text>
            </View>
            <Text style={styles.why}>{whyFor(row)}</Text>
            <View style={[styles.box, { borderColor: productTheme.divider }]}>
              <Text style={[styles.boxKicker, { color: accent }]}>
                Decisão pronta
              </Text>
              <Text style={styles.decision}>{row.decision}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                style={styles.apply}
                onPress={() => void apply(row.id)}
                disabled={busy === row.id}
              >
                <Text style={styles.applyText}>Aplicar</Text>
              </Pressable>
              <Pressable
                style={styles.ficha}
                hitSlop={8}
                onPress={() =>
                  navigation.navigate("Aluna", {
                    token,
                    personId: row.person_id,
                    studioName: route.params.studioName,
                    accent,
                  })
                }
              >
                <Text style={styles.fichaText}>Ver ficha</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>{resolved} de 3 resolvidos</Text>
      </ScrollView>
    </Screen>
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
  content: { paddingBottom: 32, flexGrow: 1 },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 12,
  },
  row: {
    marginTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    flex: 1,
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 22,
    letterSpacing: -0.4,
  },
  tag: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.2,
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  why: { color: productTheme.muted, fontSize: 14, marginTop: 8 },
  box: {
    marginTop: 14,
    borderWidth: 2,
    padding: 14,
  },
  boxKicker: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  decision: {
    color: productTheme.ink,
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
  apply: {
    backgroundColor: productTheme.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  applyText: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  ficha: { alignSelf: "flex-start" },
  fichaText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  footer: {
    marginTop: 32,
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
