import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  defaultReps,
  enqueueSet,
  flush,
  formatKg,
  lastLoadForItem,
  loadSession,
  newClientId,
  nextAfter,
  stepKg,
  type LocalSession,
} from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { GhostCTA } from "../../ui/GhostCTA";
import { HoldTick } from "../../ui/HoldTick";
import { IconPlay } from "../../ui/Icons";
import { Band, DockFooter, Phone } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Serie">;

export function Serie({ navigation, route }: Props) {
  const {
    token,
    studioName,
    accent,
    clientId,
    items,
    itemIndex,
    setIndex,
  } = route.params;
  const item = items[itemIndex];
  const [load, setLoad] = useState(item?.load_kg ?? 0);
  const [reps, setReps] = useState(item ? defaultReps(item.planned_reps) : 10);
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
      const stored = await loadSession(clientId);
      if (!alive) return;
      setSession(stored);
      if (item) {
        setLoad(lastLoadForItem(stored, item.id, item.load_kg));
      }
    })();
    return () => {
      alive = false;
    };
  }, [clientId, item]);

  const rest = item?.rest_seconds ?? 90;
  const last = nextAfter(items, itemIndex, setIndex) === "done";
  const kg = useMemo(() => formatKg(load).replace(".", ","), [load]);
  const [busy, setBusy] = useState(false);

  async function onDone() {
    if (busy || !item) return;
    setBusy(true);
    try {
      const stored = await loadSession(clientId);
      const existing = stored?.sets.find(
        (s) => s.prescription_item_id === item.id && s.set_index === setIndex,
      );
      await enqueueSet(clientId, {
        client_set_id: existing?.client_set_id ?? newClientId(),
        prescription_item_id: item.id,
        exercise_id: item.exercise_id,
        set_index: setIndex,
        reps,
        load_kg: load,
        rest_seconds: rest,
        performed_at: existing?.performed_at ?? new Date().toISOString(),
      });
      flush(token, clientId).catch(() => undefined);
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
          <Text style={styles.missing}>Esta série não está na ficha.</Text>
        </Band>
      </Phone>
    );
  }

  const sets = item.planned_sets;
  const doneSets = session?.sets.filter((s) => s.prescription_item_id === item.id) ?? [];

  return (
    <Phone>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Text style={styles.topKicker}>
            Exercício {itemIndex + 1} de {items.length}
          </Text>
          <Text style={styles.topKicker}>
            Série {setIndex} de {sets}
          </Text>
        </View>
        <View style={styles.ticks}>
          {Array.from({ length: sets }, (_, i) => {
            const n = i + 1;
            return (
              <View
                key={n}
                style={[
                  styles.tick,
                  {
                    backgroundColor:
                      n < setIndex ? T.ink : n === setIndex ? accent : T.divider,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.ex}>
        <View style={styles.thumb} />
        <View style={styles.exCopy}>
          <Text style={styles.exName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.exMeta}>
            {item.planned_reps} · descanso {rest}s
          </Text>
          <Pressable
            onPress={() =>
              navigation.navigate("ComoFazer", {
                item,
                items,
                studioName,
                accent,
                token,
                prescriptionId: route.params.prescriptionId,
              })
            }
            style={styles.how}
            hitSlop={8}
          >
            <IconPlay color={accent} />
            <Text style={[styles.howText, { color: accent }]}>
              VER COMO FAZER
            </Text>
          </Pressable>
        </View>
      </View>

      <GestureDetector gesture={pan}>
        <View
          style={styles.loadBlock}
          accessibilityLabel={`${kg} quilogramas. Arrasta para mudar a carga.`}
        >
          <Text style={styles.setKicker}>
            Série {setIndex} de {sets}
          </Text>
          <View style={styles.loadRow}>
            <Text style={styles.load}>{kg}</Text>
            <Text style={styles.unit}>kg</Text>
          </View>
          <Text style={styles.repsLine}>{reps} repetições</Text>
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

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
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
                current && { backgroundColor: T.raised, borderLeftColor: accent },
              ]}
            >
              <Text
                style={[
                  styles.setMark,
                  { color: done ? T.ok : current ? accent : T.muted },
                ]}
              >
                {done ? "✓" : current ? "·" : ""}
              </Text>
              <Text style={styles.setN}>{n}</Text>
              <Text style={styles.setLabel}>
                {logged
                  ? `${formatKg(logged.load_kg).replace(".", ",")} kg × ${logged.reps}`
                  : current
                    ? `${kg} kg × ${reps}`
                    : `${formatKg(item.load_kg).replace(".", ",")} kg`}
              </Text>
              <Text
                style={[
                  styles.setStatus,
                  { color: done ? T.ok : current ? accent : T.muted2 },
                ]}
              >
                {done ? "FEITA" : current ? "AGORA" : "—"}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {item.notes ? (
        <Band raised rule="none">
          <Text style={styles.noteKicker}>{studioName} disse</Text>
          <Text style={styles.note}>{item.notes}</Text>
        </Band>
      ) : null}

      <DockFooter>
        <View style={styles.dockRow}>
          <GhostCTA
            label="Ficha"
            onPress={() =>
              navigation.navigate("Ficha", {
                token,
                studioName,
                accent,
                items,
                prescriptionId: route.params.prescriptionId,
              })
            }
          />
          <View style={styles.dockCta}>
            <AccentCTA
              label="Fiz essa série"
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
  topKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  ticks: { flexDirection: "row", gap: 4, marginTop: 10 },
  tick: { flex: 1, height: 5 },
  ex: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  thumb: {
    width: 76,
    height: 76,
    backgroundColor: "#201e1d",
  },
  exCopy: { flex: 1, minWidth: 0 },
  exName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  exMeta: {
    color: T.muted,
    fontSize: 13,
    marginTop: 4,
  },
  how: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingTop: 8,
  },
  howText: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  loadBlock: {
    paddingHorizontal: T.pad,
    paddingTop: 22,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  setKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  loadRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 16,
    marginTop: 8,
  },
  load: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 84,
    letterSpacing: -5,
    lineHeight: 72,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 20,
  },
  repsLine: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 28,
    letterSpacing: -0.8,
    marginTop: 8,
  },
  stepRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  step: {
    flex: 1,
    borderWidth: 2,
    borderColor: T.divider,
  },
  list: { flex: 1 },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  setMark: {
    width: 18,
    fontFamily: FONT,
    fontSize: 13,
  },
  setN: {
    flex: 1,
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  setLabel: {
    color: T.ink,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  setStatus: {
    width: 72,
    textAlign: "right",
    fontFamily: FONT,
    fontSize: 10,
    letterSpacing: 1,
  },
  noteKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  note: {
    color: "#d7d3d3",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  dockRow: { flexDirection: "row", gap: 10, alignItems: "stretch" },
  dockCta: { flex: 1 },
  missing: { color: T.muted, fontSize: 16 },
});
