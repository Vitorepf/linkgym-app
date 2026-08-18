import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
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
} from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

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
    streakCount,
    xpTotal,
  } = route.params;
  const item = items[itemIndex];
  const [load, setLoad] = useState(item.load_kg);
  const [reps, setReps] = useState(defaultReps(item.planned_reps));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const session = await loadSession(clientId);
      if (!alive) return;
      setLoad(lastLoadForItem(session, item.id, item.load_kg));
    })();
    return () => {
      alive = false;
    };
  }, [clientId, item.id, item.load_kg]);

  const rest = item.rest_seconds ?? 90;
  const last = nextAfter(items, itemIndex, setIndex) === "done";

  const kg = useMemo(() => formatKg(load), [load]);

  async function onDone() {
    if (busy || !item) return;
    setBusy(true);
    try {
      const session = await loadSession(clientId);
      const existing = session?.sets.find(
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
      <Screen kicker={studioName} title="Série" accent={accent}>
        <Text style={styles.missing}>Esta série não está na ficha.</Text>
      </Screen>
    );
  }

  return (
    <Screen kicker={studioName} accent={accent}>
      <Text style={styles.exercise}>{item.name}</Text>
      <Text style={styles.series}>
        Série {setIndex} de {item.planned_sets}
      </Text>

      <Text style={styles.load} accessibilityLabel={`${kg} quilogramas`}>
        {kg}
      </Text>
      <Text style={styles.unit}>kg</Text>

      <View style={styles.stepRow}>
        <Pressable
          onPress={() => setLoad((n) => stepKg(n, -2.5))}
          accessibilityRole="button"
          accessibilityLabel="Menos dois e meio"
          style={styles.step}
        >
          <Text style={styles.stepText}>− 2.5</Text>
        </Pressable>
        <Pressable
          onPress={() => setLoad((n) => stepKg(n, 2.5))}
          accessibilityRole="button"
          accessibilityLabel="Mais dois e meio"
          style={styles.step}
        >
          <Text style={styles.stepText}>+ 2.5</Text>
        </Pressable>
      </View>

      <View style={styles.repsBlock}>
        <Text style={styles.repsLabel}>Reps · alvo {item.planned_reps}</Text>
        <View style={styles.stepRow}>
          <Pressable
            onPress={() => setReps((n) => Math.max(1, n - 1))}
            accessibilityRole="button"
            accessibilityLabel="Menos uma repetição"
            style={styles.step}
          >
            <Text style={styles.stepText}>−</Text>
          </Pressable>
          <Text style={styles.repsValue}>{reps}</Text>
          <Pressable
            onPress={() => setReps((n) => n + 1)}
            accessibilityRole="button"
            accessibilityLabel="Mais uma repetição"
            style={styles.step}
          >
            <Text style={styles.stepText}>+</Text>
          </Pressable>
        </View>
      </View>

      <PrimaryButton label="Feito" onPress={onDone} busy={busy} />

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
        <Text style={styles.howText}>Como fazer</Text>
      </Pressable>

      <Text style={styles.ghost}>
        Ofensiva {streakCount} · {xpTotal} XP
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  exercise: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
    marginTop: 8,
  },
  series: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 10,
  },
  load: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 72,
    letterSpacing: -2,
    lineHeight: 76,
    fontVariant: ["tabular-nums"],
    marginTop: 20,
  },
  unit: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  step: {
    minHeight: 56,
    minWidth: 56,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: productTheme.ink,
    borderRadius: productTheme.radius,
  },
  stepText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  repsBlock: { marginTop: 28 },
  repsLabel: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  repsValue: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    fontVariant: ["tabular-nums"],
    minWidth: 48,
    textAlign: "center",
  },
  how: { marginTop: 20, alignSelf: "flex-start" },
  howText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  ghost: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: "auto",
    paddingTop: 32,
  },
  missing: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 20,
  },
});
