import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { patchPrescriptionItem, type DraftItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Ajustar">;

export function Ajustar({ navigation, route }: Props) {
  const { token, studioName, accent, prescriptionId, personId, personName } =
    route.params;
  const [items, setItems] = useState<DraftItem[]>(route.params.items);
  const [error, setError] = useState("");
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const latest = useRef<DraftItem[]>(route.params.items);

  useEffect(() => {
    latest.current = items;
  }, [items]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach(clearTimeout);
    };
  }, []);

  function schedulePatch(next: DraftItem) {
    const prev = timers.current[next.id];
    if (prev) clearTimeout(prev);
    timers.current[next.id] = setTimeout(() => {
      delete timers.current[next.id];
      void patchPrescriptionItem(token, prescriptionId, next.id, {
        load_kg: next.load_kg,
        planned_sets: next.planned_sets,
        planned_reps: next.planned_reps,
      }).catch(() => setError("Não deu para ajustar."));
    }, 300);
  }

  function change(id: string, patch: Partial<Pick<DraftItem, "load_kg" | "planned_sets">>) {
    setItems((prev) => {
      const row = prev.find((it) => it.id === id);
      if (!row) return prev;
      const next: DraftItem = {
        ...row,
        load_kg:
          patch.load_kg === undefined
            ? row.load_kg
            : Math.max(0, Math.round(patch.load_kg * 10) / 10),
        planned_sets:
          patch.planned_sets === undefined
            ? row.planned_sets
            : Math.max(1, patch.planned_sets),
      };
      schedulePatch(next);
      return prev.map((it) => (it.id === id ? next : it));
    });
  }

  async function flush() {
    const ids = Object.keys(timers.current);
    ids.forEach((id) => {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    });
    const byId = new Map(latest.current.map((it) => [it.id, it]));
    await Promise.all(
      ids.map((id) => {
        const row = byId.get(id);
        if (!row) return Promise.resolve();
        return patchPrescriptionItem(token, prescriptionId, row.id, {
          load_kg: row.load_kg,
          planned_sets: row.planned_sets,
          planned_reps: row.planned_reps,
        });
      }),
    );
  }

  return (
    <Screen title="Ajustar" accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.map((row) => (
          <View key={row.id} style={styles.row}>
            <Text style={styles.name}>{row.name}</Text>
            <Text style={styles.meta}>{row.planned_reps}</Text>
            <Text style={styles.load}>{formatKg(row.load_kg)} kg</Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.fat}
                onPress={() => change(row.id, { load_kg: row.load_kg - 2.5 })}
              >
                <Text style={styles.fatText}>−2.5</Text>
              </Pressable>
              <Pressable
                style={styles.fat}
                onPress={() => change(row.id, { load_kg: row.load_kg + 2.5 })}
              >
                <Text style={styles.fatText}>+2.5</Text>
              </Pressable>
            </View>
            <View style={styles.stepper}>
              <Pressable
                style={styles.step}
                onPress={() =>
                  change(row.id, { planned_sets: row.planned_sets - 1 })
                }
              >
                <Text style={styles.stepText}>−</Text>
              </Pressable>
              <Text style={styles.sets}>{row.planned_sets} séries</Text>
              <Pressable
                style={styles.step}
                onPress={() =>
                  change(row.id, { planned_sets: row.planned_sets + 1 })
                }
              >
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <PrimaryButton
          label="Seguir para publicar"
          onPress={() => {
            void (async () => {
              try {
                await flush();
                setError("");
                navigation.navigate("Publicar", {
                  token,
                  studioName,
                  accent,
                  prescriptionId,
                  personId,
                  personName,
                });
              } catch {
                setError("Não deu para ajustar.");
              }
            })();
          }}
        />
      </ScrollView>
    </Screen>
  );
}

function formatKg(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace(".", ",");
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
    borderRadius: productTheme.radius,
  },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 22,
    letterSpacing: -0.4,
  },
  meta: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 6,
  },
  load: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  fat: {
    backgroundColor: productTheme.ink,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: productTheme.radius,
    alignSelf: "flex-start",
  },
  fatText: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  step: {
    borderWidth: 2,
    borderColor: productTheme.ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: productTheme.radius,
  },
  stepText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
  },
  sets: {
    color: productTheme.ink,
    fontSize: 16,
  },
});
