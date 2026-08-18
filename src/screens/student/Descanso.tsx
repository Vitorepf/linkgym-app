import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  flush,
  markFinished,
  nextAfter,
  patchLastSetEffort,
} from "../../offline/sessionQueue";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Band, DockFooter, Phone } from "../../ui/Screen";

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
  const item = items[itemIndex];
  const blocks = 8;
  const filled =
    restSeconds <= 0
      ? blocks
      : Math.round(((restSeconds - left) / restSeconds) * blocks);

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
          studentHomeTarget,
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
    if (nxt === "done") {
      await goFinish();
      return;
    }
    navigation.navigate("Serie", {
      ...route.params,
      itemIndex: nxt.itemIndex,
      setIndex: nxt.setIndex,
    });
  }

  const nextLabel =
    nxt === "done"
      ? "Fim do treino"
      : nxt.setIndex > 1
        ? `Série ${nxt.setIndex}`
        : (items[nxt.itemIndex]?.name ?? "Próxima");

  return (
    <Phone>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Text style={styles.topKicker}>
            {item?.name ?? "Série"} · série {setIndex} feita
          </Text>
        </View>
      </View>

      <View style={styles.doneRow}>
        <View style={styles.check}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.doneLoad}>
          {item ? `${item.load_kg} kg × ${item.planned_reps}` : ""}
        </Text>
        <Text style={styles.ok}>
          {effort === 0 ? "" : WORDS.find((w) => w.effort === effort)?.label.toUpperCase()}
        </Text>
      </View>

      <Band>
        <Text style={[styles.kicker, { color: accent }]}>Descanso</Text>
        <Text
          style={[styles.timer, left === 0 && { color: accent }]}
          accessibilityLabel={`${left} segundos`}
        >
          {left === 0 ? "Pode ir" : left}
        </Text>
        <View style={styles.blocks}>
          {Array.from({ length: blocks }, (_, i) => (
            <View
              key={i}
              style={[
                styles.block,
                { backgroundColor: i < filled ? accent : T.divider },
              ]}
            />
          ))}
        </View>
        <Text style={styles.note}>
          {left === 0
            ? "Descanso fechado. Marca como foi e segue."
            : `Ainda ${left}s. A série já está registrada.`}
        </Text>
      </Band>

      <View style={styles.grow} />

      <Band>
        <Text style={styles.kickerMuted}>Como foi essa série?</Text>
        <View style={styles.words}>
          {WORDS.map((w) => (
            <Choice
              key={w.effort}
              label={w.label}
              selected={effort === w.effort}
              flex
              accent={accent}
              onPress={() => void pick(w.effort)}
            />
          ))}
        </View>
        {effort ? (
          <Text style={styles.note}>{noteFor(effort, studioName)}</Text>
        ) : null}
      </Band>

      <Band rule="none">
        <View style={styles.nextRow}>
          <View>
            <Text style={styles.kickerMuted}>A seguir</Text>
            <Text style={styles.nextName}>{nextLabel}</Text>
          </View>
        </View>
      </Band>

      <DockFooter>
        <AccentCTA
          label={
            ending
              ? "Terminar treino"
              : left === 0
                ? "Próxima série"
                : "Pular descanso"
          }
          onPress={() => {
            void goNext();
          }}
          disabled={!effort}
          busy={busy}
          accent={accent}
        />
        {!ending ? (
          <Pressable
            onPress={() => {
              void goFinish();
            }}
            disabled={!effort || busy}
            style={styles.finish}
          >
            <Text
              style={[
                styles.finishText,
                (!effort || busy) && styles.off,
              ]}
            >
              Terminar
            </Text>
          </Pressable>
        ) : null}
      </DockFooter>
    </Phone>
  );
}

function noteFor(effort: Effort | 0, studioName: string): string {
  if (effort === 1) {
    return `Sobrou tanque. O ${studioName} sobe a carga na próxima.`;
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
  top: {
    paddingHorizontal: T.pad,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  topKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  check: {
    width: 22,
    height: 22,
    backgroundColor: T.ok,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 13,
  },
  doneLoad: {
    flex: 1,
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  ok: {
    color: T.ok,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1,
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  kickerMuted: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  timer: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 92,
    letterSpacing: -5.5,
    lineHeight: 84,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  blocks: { flexDirection: "row", gap: 3, marginTop: 18 },
  block: { flex: 1, height: 10 },
  note: {
    color: T.muted,
    fontSize: 13,
    marginTop: 14,
    lineHeight: 18,
  },
  grow: { flex: 1 },
  words: { flexDirection: "row", gap: 8, marginTop: 12 },
  nextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    marginTop: 4,
  },
  finish: { paddingTop: 14 },
  finishText: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  off: { opacity: 0.35 },
});
