import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  putReadiness,
  today,
  type Person,
  type Studio,
  type TodayPayload,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import {
  createSession,
  flush,
  loadCurrent,
  newClientId,
  resumeCursor,
} from "../../offline/sessionQueue";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
};

export function Hoje({ token, studio, needsCommitment }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Hoje">>();
  const accent = studio.accent_color || productTheme.accentFallback;
  const [data, setData] = useState<TodayPayload | null>(null);
  const [error, setError] = useState("");
  const [energy, setEnergy] = useState(0);
  const [soreness, setSoreness] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pendingLocal, setPendingLocal] = useState(false);
  const [resume, setResume] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) {
          setData(payload);
          setEnergy(payload.readiness.energy);
          setSoreness(payload.readiness.soreness);
          setSleep(payload.readiness.sleep);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o hoje.");
      }
      const result = await flush(token);
      if (!alive) return;
      const leftover = await loadCurrent();
      setPendingLocal(!result.ok);
      setResume(leftover !== null && leftover.finished === undefined);
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const prescription = data?.prescription ?? null;
  const kicker = prescription ? `Hoje · ${prescription.name}` : "Hoje";
  const empty = data !== null && prescription === null;
  const ready =
    inScale(energy) && inScale(soreness) && inScale(sleep);
  const dirty =
    energy !== (data?.readiness.energy ?? 0) ||
    soreness !== (data?.readiness.soreness ?? 0) ||
    sleep !== (data?.readiness.sleep ?? 0);

  async function startLocal() {
    if (!prescription || !data) return;
    const accentColor = accent;
    const base = {
      token,
      studioName: studio.name,
      accent: accentColor,
      prescriptionId: prescription.id,
      items: prescription.items,
      streakCount: data.streak.current_count,
      xpTotal: data.xp_total,
      needsCommitment,
    };
    const existing = await loadCurrent();
    if (existing && existing.prescription_id === prescription.id) {
      if (existing.finished) {
        const result = await flush(token, existing.client_id);
        const finish = result.ok ? result.finish : undefined;
        navigation.navigate("Feito", {
          studioName: studio.name,
          accent: accentColor,
          streakCount: finish?.streak.current_count ?? data.streak.current_count + 1,
          xpGained: finish?.xp_gained ?? 10,
          xpTotal: finish?.xp_total ?? data.xp_total + 10,
          records: finish?.records ?? [],
          pending: !result.ok,
          needsCommitment,
        });
        return;
      }
      const cursor = resumeCursor(prescription.items, existing.sets);
      if (cursor === "done") {
        navigation.navigate("Descanso", {
          ...base,
          clientId: existing.client_id,
          itemIndex: Math.max(0, prescription.items.length - 1),
          setIndex:
            prescription.items[prescription.items.length - 1]?.planned_sets ?? 1,
          restSeconds:
            prescription.items[prescription.items.length - 1]?.rest_seconds ??
            90,
          last: true,
        });
        return;
      }
      navigation.navigate("Serie", {
        ...base,
        clientId: existing.client_id,
        itemIndex: cursor.itemIndex,
        setIndex: cursor.setIndex,
      });
      return;
    }
    const session = await createSession(prescription.id, newClientId());
    navigation.navigate("Serie", {
      ...base,
      clientId: session.client_id,
      itemIndex: 0,
      setIndex: 1,
    });
  }

  async function saveReadiness() {
    if (!ready || saving) return;
    setSaving(true);
    setError("");
    try {
      const readiness = await putReadiness(token, { energy, soreness, sleep });
      setData((prev) => (prev ? { ...prev, readiness } : prev));
    } catch {
      setError("Não deu para registrar como você está.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen kicker={kicker} accent={accent} title={studio.name}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {data ? (
          <>
            <Text style={styles.score}>{data.readiness.score}</Text>
            <Text style={styles.label}>{data.readiness.label}</Text>

            <View style={styles.scales}>
              <Scale
                name="Energia"
                value={energy}
                accent={accent}
                onChange={setEnergy}
              />
              <Scale
                name="Dor"
                value={soreness}
                accent={accent}
                onChange={setSoreness}
              />
              <Scale
                name="Sono"
                value={sleep}
                accent={accent}
                onChange={setSleep}
              />
            </View>

            {ready && dirty ? (
              <Pressable
                onPress={saveReadiness}
                disabled={saving}
                style={[styles.save, saving && styles.saveOff]}
              >
                <Text style={styles.saveText}>Registrar</Text>
              </Pressable>
            ) : null}

            <View style={styles.strip}>
              <Text style={styles.stripItem}>
                Ofensiva {data.streak.current_count}
              </Text>
              <Text style={[styles.stripItem, { color: accent }]}>·</Text>
              <Text style={styles.stripItem}>{data.xp_total} XP</Text>
            </View>

            {empty ? (
              <Text style={styles.empty}>Ainda não tem ficha hoje.</Text>
            ) : null}

            {pendingLocal ? (
              <Text style={[styles.banner, { borderLeftColor: accent }]}>
                Sessão neste celular. Sobe quando tiver rede.
              </Text>
            ) : null}

            {prescription && data.coach_line ? (
              <Text style={styles.coach}>{data.coach_line}</Text>
            ) : null}

            {prescription && data.banner ? (
              <Text style={[styles.banner, { borderLeftColor: accent }]}>
                {data.banner.text}
              </Text>
            ) : null}

            {prescription ? (
              <Pressable
                onPress={() =>
                  navigation.navigate("Ficha", {
                    token,
                    studioName: studio.name,
                    accent,
                    items: prescription.items,
                    prescriptionId: prescription.id,
                  })
                }
                style={styles.ficha}
                hitSlop={8}
              >
                <Text style={styles.fichaText}>Ficha</Text>
              </Pressable>
            ) : null}

            {prescription ? (
              <PrimaryButton
                label={resume ? "Continuar" : ctaLabel(data.readiness.label)}
                onPress={() => {
                  void startLocal();
                }}
              />
            ) : null}
          </>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate("Progresso")}
          style={styles.link}
          hitSlop={8}
        >
          <Text style={styles.linkText}>Progresso</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Perfil")}
          style={styles.link}
          hitSlop={8}
        >
          <Text style={styles.linkText}>Perfil</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function inScale(n: number): boolean {
  return n >= 1 && n <= 5;
}

function ctaLabel(label: string): string {
  if (label === "Hoje não é dia de PR" || label === "Versão leve") {
    return "Começar leve";
  }
  return "Começar";
}

function Scale({
  name,
  value,
  accent,
  onChange,
}: {
  name: string;
  value: number;
  accent: string;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.scale}>
      <Text style={styles.scaleName}>{name}</Text>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n === value;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              accessibilityRole="button"
              accessibilityLabel={`${name} ${n}`}
              accessibilityState={{ selected: on }}
              style={[
                styles.tick,
                on && { borderColor: accent },
              ]}
            >
              <Text style={[styles.tickText, on && { color: accent }]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  score: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 8,
  },
  label: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 4,
  },
  scales: {
    marginTop: 24,
    borderTopWidth: 2,
    borderColor: productTheme.divider,
  },
  scale: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  scaleName: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  scaleRow: { flexDirection: "row", gap: 8 },
  tick: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  tickText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    fontVariant: ["tabular-nums"],
  },
  save: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: productTheme.ink,
    borderRadius: productTheme.radius,
  },
  saveOff: { opacity: 0.35 },
  saveText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
    paddingVertical: 14,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  stripItem: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  coach: {
    color: productTheme.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 24,
  },
  banner: {
    color: productTheme.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  empty: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 20,
    lineHeight: 22,
  },
  ficha: { marginTop: 24, alignSelf: "flex-start" },
  fichaText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 8,
  },
  link: { marginTop: 20, alignSelf: "flex-start" },
  linkText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
