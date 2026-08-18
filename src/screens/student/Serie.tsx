import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  defaultReps,
  enqueueSet,
  flush,
  lastLoadForItem,
  loadSession,
  newLocalId,
  nextAfter,
  stepKg,
  type LocalSession,
} from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { HoldTick } from "../../ui/HoldTick";
import { IconPlay } from "../../ui/Icons";
import { Band, DockFooter, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Serie">;


export function Serie({ navigation, route }: Props) {
  const {
    token,
    timeName,
    accent,
    localId,
    items,
    itemIndex,
    setIndex,
  } = route.params;
  const A = accentSet(accent, T.raised);
  const item = items[itemIndex];
  const [load, setLoad] = useState(item?.load_kg ?? 0);
  const reps = item ? defaultReps(item.planned_reps) : 10;
  const [session, setSession] = useState<LocalSession | null>(null);
  const loadSV = useSharedValue(load);
  const startLoad = useSharedValue(load);
  useEffect(() => {
    loadSV.value = load;
  }, [load, loadSV]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          startLoad.value = loadSV.value;
        })
        .onUpdate((e) => {
          const steps = Math.round(-e.translationY / 28);
          const next = Math.max(
            0,
            Math.round((startLoad.value + steps * 2.5) * 2) / 2,
          );
          runOnJS(setLoad)(next);
        }),
    [loadSV, startLoad],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await loadSession(localId);
      if (!alive) return;
      setSession(stored);
      if (item) {
        setLoad(lastLoadForItem(stored, item.id, item.load_kg));
      }
    })();
    return () => {
      alive = false;
    };
  }, [localId, item]);

  const rest = item?.rest_seconds ?? 90;
  const last = nextAfter(items, itemIndex, setIndex) === "done";
  const kg = formatKg(load);
  const [busy, setBusy] = useState(false);

  async function onDone() {
    if (busy || !item) return;
    setBusy(true);
    try {
      const stored = await loadSession(localId);
      const existing = stored?.sets.find(
        (s) => s.prescription_item_id === item.id && s.set_index === setIndex,
      );
      await enqueueSet(localId, {
        local_id: existing?.local_id ?? newLocalId(),
        prescription_item_id: item.id,
        exercise_id: item.exercise_id,
        set_index: setIndex,
        reps,
        load_kg: load,
        rest_seconds: rest,
        performed_at: existing?.performed_at ?? new Date().toISOString(),
      });
      flush(token, localId).catch(() => undefined);
      navigation.navigate("Descanso", {
        ...route.params,
        restSeconds: rest,
        last,
      });
    } finally {
      setBusy(false);
    }
  }

  if (!item) {
    return (
      <Phone>
        <Band>
          <Txt role="body" tone="muted">
            Esta série não está na ficha.
          </Txt>
        </Band>
      </Phone>
    );
  }

  const sets = item.planned_sets;
  const doneSets = session?.sets.filter((s) => s.prescription_item_id === item.id) ?? [];
  // A baseline desta tela é REAL e vive na prescrição: a carga que o personal pediu.
  // A direção sai da FORMA (TrendMark), nunca de matiz.
  // Sem diferença não há direção, e marca sem informação é sujeira: nada é desenhado.
  const asked = item.load_kg;
  const dir = load > asked ? "up" : load < asked ? "down" : undefined;

  return (
    <Phone>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Txt role="label">
            Exercício {itemIndex + 1} de {items.length}
          </Txt>
          <Txt role="label">
            Série {setIndex} de {sets}
          </Txt>
        </View>
        <View style={styles.ticks}>
          {Array.from({ length: sets }, (_, i) => {
            const n = i + 1;
            // A série de agora é mais ALTA, não só de outra cor: no time 13 o acento
            // encosta no traço neutro, e a forma continua dizendo onde o aluno está.
            return (
              <View
                key={n}
                style={[
                  styles.tick,
                  n === setIndex && styles.tickNow,
                  {
                    backgroundColor:
                      n < setIndex ? T.ink : n === setIndex ? A.mark : T.divider,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.ex}>
        <Txt role="title" numberOfLines={1}>
          {item.name}
        </Txt>
        <Txt role="body" style={styles.rhythm}>
          {sets}
          <Txt role="body" tone="muted">
            {"  "}séries ·{"  "}
          </Txt>
          {item.planned_reps}
          <Txt role="body" tone="muted">
            {"  "}reps
          </Txt>
        </Txt>
        <Pressable
          onPress={() =>
            navigation.navigate("ComoFazer", {
              item,
              items,
              timeName,
              accent,
              token,
              prescriptionId: route.params.prescriptionId,
            })
          }
          style={styles.how}
          hitSlop={12}
        >
          <IconPlay color={A.mark} />
          <Txt role="label" color={A.text}>
            Ver como fazer
          </Txt>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <View
          style={styles.loadBlock}
          accessibilityLabel={`${kg} quilogramas. Arrasta para mudar a carga.`}
        >
          <Figure
            role="mega"
            value={kg}
            unit="kg"
            label="Carga"
            dir={dir}
            note={`${timeName} pediu ${formatKg(asked)} kg`}
          />
          <View style={styles.stepRow}>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setLoad((n) => stepKg(n, -2.5))}
                label="− 2,5 kg"
                hint="Menos dois e meio"
              />
            </View>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setLoad((n) => stepKg(n, 2.5))}
                label="+ 2,5 kg"
                hint="Mais dois e meio"
              />
            </View>
          </View>
        </View>
      </GestureDetector>

      {/* ponytail: contentContainer com flexGrow + linhas flex — as séries ESTICAM para
          ocupar o terço de baixo em vez de deixar um vazio que não separa nada, e a
          rolagem só entra quando não cabem. Teto: acima de ~7 séries a lista rola. */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listBody}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: sets }, (_, i) => {
          const n = i + 1;
          const logged = doneSets.find((s) => s.set_index === n);
          const current = n === setIndex;
          const done = n < setIndex || Boolean(logged);
          return (
            <View
              key={n}
              style={[
                styles.setRow,
                current && { backgroundColor: T.raised, borderLeftColor: A.mark },
              ]}
            >
              <Txt role="value" tone={done || current ? "ink" : "dim"}>
                {n}
              </Txt>
              {/* Série que ainda não aconteceu é AUSÊNCIA de marca — não marca de falha. */}
              {logged ? (
                <Txt role="body" tone="muted">
                  {formatKg(logged.load_kg)} kg × {logged.reps}
                </Txt>
              ) : current ? (
                <Txt role="body">
                  {kg} kg × {reps}
                </Txt>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      {item.notes ? (
        <Band raised rule="none">
          <Txt role="label">{timeName} disse</Txt>
          <Txt role="body" style={styles.note}>
            {item.notes}
          </Txt>
        </Band>
      ) : null}

      <DockFooter>
        <View style={styles.dockRow}>
          <GhostCTA
            label="Ficha"
            onPress={() =>
              navigation.navigate("Ficha", {
                token,
                timeName,
                accent,
                items,
                prescriptionId: route.params.prescriptionId,
              })
            }
          />
          <View style={styles.dockCta}>
            <AccentCTA
              label="Fiz essa série"
              meta={`${rest} S`}
              onPress={() => {
                void onDone();
              }}
              accent={accent}
              check
            />
          </View>
        </View>
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingHorizontal: T.pad,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ticks: { flexDirection: "row", gap: 4, marginTop: 12, alignItems: "flex-end" },
  tick: { flex: 1, height: 4 },
  tickNow: { height: 10 },
  ex: {
    paddingHorizontal: T.pad,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  rhythm: { marginTop: 4 },
  how: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
  },
  loadBlock: {
    paddingHorizontal: T.pad,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  stepRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  step: {
    flex: 1,
    borderWidth: 2,
    borderColor: T.divider,
  },
  list: { flex: 1 },
  listBody: { flexGrow: 1 },
  setRow: {
    flex: 1,
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: T.pad,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  note: { marginTop: 6 },
  dockRow: { flexDirection: "row", gap: 10, alignItems: "stretch" },
  dockCta: { flex: 1 },
});
