import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { patchPrescriptionItem, type DraftItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { formatKg } from "../../ui/format";

type Props = NativeStackScreenProps<RootStackParamList, "Ajustar">;

export function Ajustar({ navigation, route }: Props) {
  const { token, studioName, accent, prescriptionId, personId, personName } =
    route.params;
  const [items, setItems] = useState<DraftItem[]>(route.params.items);
  const [focusedId, setFocusedId] = useState(
    route.params.items[0]?.id ?? "",
  );
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

  function change(
    id: string,
    patch: Partial<Pick<DraftItem, "load_kg" | "planned_sets">>,
  ) {
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

  const focused = items.find((it) => it.id === focusedId) ?? items[0];

  return (
    <Phone>
      <Head
        kicker={personName}
        title="Confere e ajusta"
        kickerMuted
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.map((row) => {
          const on = focused?.id === row.id;
          if (on) {
            return (
              <View
                key={row.id}
                style={[styles.hero, { borderLeftColor: accent }]}
              >
                <Text style={styles.name}>{row.name}</Text>
                <View style={styles.stepper}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Menos 2,5 kg"
                    style={styles.sq}
                    onPress={() =>
                      change(row.id, { load_kg: row.load_kg - 2.5 })
                    }
                  >
                    <Text style={styles.sqText}>−</Text>
                  </Pressable>
                  <View style={styles.loadBlock}>
                    <Text style={styles.load}>
                      {formatKg(row.load_kg)} kg
                    </Text>
                    <Text style={styles.meta}>
                      {row.planned_sets} × {row.planned_reps}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Mais 2,5 kg"
                    style={[
                      styles.sq,
                      { backgroundColor: accent, borderColor: accent },
                    ]}
                    onPress={() =>
                      change(row.id, { load_kg: row.load_kg + 2.5 })
                    }
                  >
                    <Text style={[styles.sqText, { color: T.bg }]}>+</Text>
                  </Pressable>
                </View>
                <View style={styles.setsRow}>
                  <Pressable
                    style={styles.setBtn}
                    onPress={() =>
                      change(row.id, { planned_sets: row.planned_sets - 1 })
                    }
                  >
                    <Text style={styles.setBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.sets}>{row.planned_sets} séries</Text>
                  <Pressable
                    style={styles.setBtn}
                    onPress={() =>
                      change(row.id, { planned_sets: row.planned_sets + 1 })
                    }
                  >
                    <Text style={styles.setBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            );
          }
          return (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              onPress={() => setFocusedId(row.id)}
              style={styles.row}
            >
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{row.name}</Text>
                <Text style={styles.rowMeta}>
                  {row.planned_sets} × {row.planned_reps} ·{" "}
                  {formatKg(row.load_kg)} kg
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Publicar"
          accent={accent}
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
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  hero: {
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    backgroundColor: T.raised,
    borderLeftWidth: 3,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  sq: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: T.divider,
    backgroundColor: T.fill,
    flexShrink: 0,
  },
  sqText: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 22,
  },
  loadBlock: { flex: 1, alignItems: "center" },
  load: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 28,
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
  },
  meta: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.1,
    marginTop: 2,
  },
  setsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  setBtn: {
    borderWidth: 2,
    borderColor: T.ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  setBtnText: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 18,
  },
  sets: {
    color: T.ink,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  rowBody: { flex: 1 },
  rowName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  rowMeta: {
    color: T.muted,
    fontSize: 13,
    marginTop: 3,
  },
});
