import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { draftFromLast, listModels, ownerWeek } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, errorInk, FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { IconCheck } from "../../ui/Icons";
import { DockFooter, Head, Phone } from "../../ui/Screen";

type From = "last" | "model";

type Props = {
  token: string;
  studioName: string;
  accent: string;
  personId?: string;
  personName?: string;
  tab?: boolean;
};

export function Base({
  token,
  studioName,
  accent,
  personId: initialPersonId,
  personName: initialPersonName,
  tab,
}: Props) {
  const A = accentSet(accent, T.raised);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [personId, setPersonId] = useState(initialPersonId ?? "");
  const [personName, setPersonName] = useState(initialPersonName ?? "");
  const [modelId, setModelId] = useState("");
  const [picked, setPicked] = useState<From>("last");
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
      if (!initialPersonId || !initialPersonName) {
        const first = week.items[0];
        if (first) {
          setPersonId((prev) => initialPersonId || prev || first.person_id);
          setPersonName((prev) => initialPersonName || prev || first.name);
        }
      }
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, initialPersonId, initialPersonName]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function start(from: From) {
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
  const options: {
    id: From | "blank";
    title: string;
    body: string;
    disabled?: boolean;
  }[] = [
    {
      id: "last",
      title: `Último treino de ${name}`,
      body: "A ficha nasce do que essa pessoa já fez.",
    },
    {
      id: "model",
      title: "Modelo Treino A",
      body: "Mesma estrutura. Cargas de partida.",
    },
    {
      id: "blank",
      title: "Em branco",
      body: "Montar exercício por exercício.",
      disabled: true,
    },
  ];

  return (
    <Phone tab={tab}>
      <Head
        kicker={personName ? `Nova ficha · ${personName}` : "Nova ficha"}
        title="De onde a gente parte?"
        kickerMuted
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {options.map((opt) => {
          const on = opt.id === picked;
          const off = Boolean(opt.disabled);
          return (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled: off }}
              disabled={off || busy}
              onPress={() => {
                if (opt.id === "blank") return;
                setPicked(opt.id);
              }}
              style={[
                styles.row,
                on && { backgroundColor: T.raised },
                {
                  borderLeftColor: on ? A.mark : "transparent",
                },
                off && styles.off,
              ]}
            >
              <View
                style={[
                  styles.check,
                  on && { backgroundColor: T.ink, borderColor: T.ink },
                ]}
              >
                {on ? <IconCheck color={T.bg} size={14} /> : null}
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.choice}>{opt.title}</Text>
                <Text style={styles.body}>{opt.body}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Continuar"
          accent={accent}
          busy={busy}
          disabled={!personId || !modelId}
          onPress={() => void start(picked)}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: {
    color: errorInk,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
    borderLeftWidth: 3,
  },
  off: { opacity: 0.35 },
  check: {
    width: 22,
    height: 22,
    marginTop: 2,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowBody: { flex: 1, minWidth: 0 },
  choice: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  body: {
    color: T.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },
});
