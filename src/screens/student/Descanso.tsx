import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  flush,
  markFinished,
  nextAfter,
  patchLastSetEffort,
} from "../../offline/sessionQueue";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { useTone } from "../../ui/motion";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

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
  const A = accentSet(accent);
  const [left, setLeft] = useState(restSeconds);
  const [effort, setEffort] = useState<Effort | 0>(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // A régua enche na UI thread: um withTiming linear do descanso inteiro, não um
  // re-render por segundo. O número é que precisa do React; a barra não.
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (restSeconds <= 0) p.value = 1;
    else if (!reduce)
      p.value = withTiming(1, { duration: restSeconds * 1000, easing: Easing.linear });
  }, [p, reduce, restSeconds]);
  useEffect(() => {
    // sem movimento, a régua anda em degraus de um segundo — o mesmo relógio do número.
    if (reduce && restSeconds > 0) p.value = (restSeconds - left) / restSeconds;
  }, [left, p, reduce, restSeconds]);
  const grow = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  // A recompensa acontece na peça que já estava na tela: a mesma régua muda de tom
  // quando o descanso fecha. Nada de overlay, nada muda de lugar.
  const done = useTone(left === 0, T.muted, A.mark);

  const nxt = nextAfter(items, itemIndex, setIndex);
  const ending = last || nxt === "done";
  const item = items[itemIndex];

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
      ? undefined
      : nxt.setIndex > 1
        ? `Série ${nxt.setIndex}`
        : (items[nxt.itemIndex]?.name ?? "Próxima");

  return (
    <Phone>
      <Head
        kicker={
          item
            ? `${item.name} · série ${setIndex} de ${item.planned_sets}`
            : `Série ${setIndex}`
        }
        kickerMuted
        title={item ? `${formatKg(item.load_kg)} kg × ${item.planned_reps}` : "Feita"}
      />

      <View style={styles.grow} />

      <Band rule="none">
        <View
          accessible
          accessibilityLabel={
            left === 0 ? "descanso fechado" : `${left} segundos de descanso`
          }
        >
          <Figure role="mega" label="Descanso" value={left} unit="s" />
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, grow, done]} />
        </View>
        <Txt role="note" tone="dim" style={styles.note}>
          {left === 0
            ? "Descanso fechado. Marca como foi e segue."
            : `O ${studioName} pediu ${restSeconds}s entre as séries deste exercício.`}
        </Txt>
      </Band>

      <View style={styles.grow} />

      <Band rule="none">
        <Txt role="label">Como foi essa série?</Txt>
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
        <Txt role="note" tone="dim" style={styles.note}>
          {effort
            ? noteFor(effort, studioName)
            : "Um toque. O peso de amanhã sai daqui."}
        </Txt>
      </Band>

      <DockFooter>
        <View style={styles.dock}>
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
            meta={ending ? undefined : nextLabel}
            disabled={!effort}
            busy={busy}
            accent={accent}
          />
          {ending ? null : (
            <GhostCTA
              label="Terminar por aqui"
              onPress={() => {
                void goFinish();
              }}
              disabled={!effort || busy}
            />
          )}
        </View>
      </DockFooter>
    </Phone>
  );
}

function noteFor(effort: Effort, studioName: string): string {
  if (effort === 1) return `Sobrou tanque. O ${studioName} sobe a carga na próxima.`;
  if (effort === 2) return "Era esse o treino.";
  return `O ${studioName} vê e não empurra amanhã.`;
}

const styles = StyleSheet.create({
  track: { height: 10, backgroundColor: T.fill, marginTop: 18 },
  fill: { height: 10 },
  note: { marginTop: 14 },
  grow: { flex: 1 },
  words: { flexDirection: "row", gap: 8, marginTop: 12 },
  dock: { gap: 10 },
});
