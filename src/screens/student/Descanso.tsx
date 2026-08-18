import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  flush,
  markFinished,
  nextAfter,
  patchLastSetEffort,
} from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Effort = 1 | 2 | 3;

type Props = NativeStackScreenProps<RootStackParamList, "Descanso">;

const WORDS: { effort: Effort; label: string }[] = [
  { effort: 1, label: "Fácil" },
  { effort: 2, label: "No ponto" },
  { effort: 3, label: "Difícil" },
];

export function Descanso({ navigation, route }: Props) {
  const {
    token,
    studioName,
    accent,
    clientId,
    items,
    itemIndex,
    setIndex,
    restSeconds,
    last,
    streakCount,
    xpTotal,
  } = route.params;
  const [left, setLeft] = useState(restSeconds);
  const [effort, setEffort] = useState<Effort | 0>(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const nxt = nextAfter(items, itemIndex, setIndex);
  const ending = last || nxt === "done";
  const note = noteFor(effort, studioName);

  async function pick(n: Effort) {
    setEffort(n);
    await patchLastSetEffort(clientId, n);
  }

  async function goFinish() {
    if (!effort || busy) return;
    setBusy(true);
    try {
      await markFinished(clientId, effort);
      const result = await flush(token, clientId);
      const finish = result.ok ? result.finish : undefined;
      navigation.reset({
        index: 1,
        routes: [
          { name: "Hoje" },
          {
            name: "Feito",
            params: {
              studioName,
              accent,
              streakCount: finish?.streak.current_count ?? streakCount + 1,
              xpGained: finish?.xp_gained ?? 10,
              xpTotal: finish?.xp_total ?? xpTotal + 10,
              records: finish?.records ?? [],
              pending: !result.ok,
              needsCommitment: route.params.needsCommitment,
            },
          },
        ],
      });
    } finally {
      setBusy(false);
    }
  }

  async function goNext() {
    if (!effort || busy) return;
    if (ending) {
      await goFinish();
      return;
    }
    navigation.navigate("Serie", {
      ...route.params,
      itemIndex: nxt.itemIndex,
      setIndex: nxt.setIndex,
    });
  }

  return (
    <Screen kicker={studioName} accent={accent}>
      <Text style={styles.kicker}>Descanso</Text>
      <Text
        style={[styles.timer, left === 0 && { color: accent }]}
        accessibilityLabel={`${left} segundos`}
      >
        {left}
      </Text>
      <Text style={styles.unit}>{left === 0 ? "Pode ir" : "segundos"}</Text>

      <Text style={styles.ask}>Como foi</Text>
      <View style={styles.words}>
        {WORDS.map((w) => {
          const on = effort === w.effort;
          return (
            <Pressable
              key={w.effort}
              onPress={() => pick(w.effort)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={w.label}
              style={[
                styles.word,
                on && { borderColor: accent },
              ]}
            >
              <Text style={[styles.wordText, on && { color: accent }]}>
                {w.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {note ? <Text style={styles.note}>{note}</Text> : null}

      <PrimaryButton
        label={ending ? "Terminar" : "Próxima série"}
        onPress={goNext}
        disabled={!effort}
        busy={busy}
      />

      {!ending ? (
        <Pressable
          onPress={() => {
            void goFinish();
          }}
          disabled={!effort || busy}
          style={styles.finish}
          hitSlop={8}
        >
          <Text style={[styles.finishText, (!effort || busy) && styles.finishOff]}>
            Terminar
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

function noteFor(effort: Effort | 0, studioName: string): string {
  if (effort === 1) {
    return `Sobrou tanque — o ${studioName} sobe a carga na próxima.`;
  }
  if (effort === 2) {
    return "Era esse o treino.";
  }
  if (effort === 3) {
    return `O ${studioName} vê e não empurra amanhã.`;
  }
  return "";
}

const styles = StyleSheet.create({
  kicker: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
    marginTop: 8,
  },
  timer: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 12,
  },
  unit: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 4,
  },
  ask: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 32,
    marginBottom: 10,
  },
  words: { gap: 8 },
  word: {
    minHeight: 56,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: productTheme.divider,
    borderRadius: productTheme.radius,
    alignSelf: "stretch",
  },
  wordText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  note: {
    color: productTheme.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 16,
  },
  finish: { marginTop: 20, alignSelf: "flex-start" },
  finishText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  finishOff: { opacity: 0.35 },
});
