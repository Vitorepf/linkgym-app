import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  applyOwnerReturn,
  ownerReturns,
  type OwnerReturn,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Retorno">;

export function Retorno({ route }: Props) {
  const { token, studioName, accent } = route.params;
  const [items, setItems] = useState<OwnerReturn[]>([]);
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

  async function apply(alertId: string, bump: 2.5 | 0 | -2.5) {
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
    <Screen kicker={studioName} title="Retornos" accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.length === 0 && !error ? (
          <Text style={styles.empty}>Nada para retornar.</Text>
        ) : null}

        {items.map((row) => (
          <View key={row.alert_id} style={styles.card}>
            <Text style={styles.name}>{row.name} · sessão de hoje</Text>
            <Text style={styles.effort}>{effortWord(row.effort)}</Text>

            {row.records.map((rec) => (
              <Text
                key={rec.exercise_name}
                style={[styles.banner, { borderLeftColor: accent }]}
              >
                Elogia o PR de {rec.exercise_name}
              </Text>
            ))}

            <View style={styles.actions}>
              <Pressable
                onPress={() => {
                  void apply(row.alert_id, 2.5);
                }}
                disabled={busy === row.alert_id}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Subir 2,5 kg</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  void apply(row.alert_id, 0);
                }}
                disabled={busy === row.alert_id}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Manter</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  void apply(row.alert_id, -2.5);
                }}
                disabled={busy === row.alert_id}
                style={styles.btn}
              >
                <Text style={styles.btnText}>Descer 2,5 kg</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function effortWord(n: number): string {
  if (n === 1) return "Fácil";
  if (n === 3) return "Difícil";
  return "No ponto";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  empty: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 20,
    lineHeight: 22,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 12,
  },
  card: {
    marginTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 20,
    letterSpacing: -0.3,
  },
  effort: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 6,
  },
  banner: {
    color: productTheme.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  actions: { marginTop: 18, gap: 10 },
  btn: {
    alignSelf: "flex-start",
    backgroundColor: productTheme.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: productTheme.radius,
  },
  btnText: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
