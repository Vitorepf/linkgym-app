import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { draftFromLast, listModels, ownerWeek } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Base">;

export function Base({ navigation, route }: Props) {
  const { token, studioName, accent } = route.params;
  const [personId, setPersonId] = useState(route.params.personId ?? "");
  const [personName, setPersonName] = useState(route.params.personName ?? "");
  const [modelId, setModelId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [models, week] = await Promise.all([
        listModels(token),
        ownerWeek(token),
      ]);
      const treino = models.items.find((m) => m.name === "Treino A");
      if (!treino) {
        setError("Não deu para achar o modelo.");
        return;
      }
      setModelId(treino.id);
      if (!route.params.personId || !route.params.personName) {
        const first = week.items[0];
        if (first) {
          setPersonId((prev) => route.params.personId || prev || first.person_id);
          setPersonName((prev) => route.params.personName || prev || first.name);
        }
      }
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, route.params.personId, route.params.personName]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function start(from: "last" | "model") {
    if (busy || !modelId || !personId) return;
    setBusy(true);
    try {
      const draft = await draftFromLast(token, modelId, personId, from);
      setError("");
      navigation.navigate("Ajustar", {
        token,
        studioName,
        accent,
        prescriptionId: draft.draft_id,
        personId,
        personName,
        items: draft.items,
      });
    } catch {
      setError("Não deu para criar o rascunho.");
    } finally {
      setBusy(false);
    }
  }

  const name = personName || "aluno";

  return (
    <Screen kicker="Nova ficha" title="De onde partir" accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={styles.row}
          onPress={() => void start("last")}
          disabled={busy || !personId}
        >
          <Text style={styles.choice}>{`Último treino de ${name}`}</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => void start("model")}
          disabled={busy || !personId}
        >
          <Text style={styles.choice}>Modelo Treino A</Text>
        </Pressable>
        <Pressable style={[styles.row, styles.off]} disabled>
          <Text style={styles.choice}>Em branco</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
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
    marginTop: 8,
    paddingVertical: 22,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  off: { opacity: 0.35 },
  choice: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 22,
    letterSpacing: -0.4,
  },
});
