import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  putReadiness,
  today,
  type Person,
  type Studio,
  type TodayPayload,
} from "../../api";
import type { StudentTabNavigation } from "../../nav/types";
import {
  createSession,
  flush,
  loadCurrent,
  newClientId,
  resumeCursor,
} from "../../offline/sessionQueue";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { ArcGauge } from "../../ui/ArcGauge";
import { IconMark } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { ScaleRow } from "../../ui/ScaleRow";
import { Band, Phone } from "../../ui/Screen";
import { dateShort, plannedSets, weekdayLong } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
};

export function Hoje({ token, person, studio, needsCommitment }: Props) {
  const navigation = useNavigation<StudentTabNavigation>();
  const accent = studio.accent_color || T.accentFallback;
  const [data, setData] = useState<TodayPayload | null>(null);
  const [error, setError] = useState("");
  const [energy, setEnergy] = useState(0);
  const [soreness, setSoreness] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pendingLocal, setPendingLocal] = useState(false);
  const [resume, setResume] = useState(false);
  const [open, setOpen] = useState(false);
  const savingRef = useRef(false);

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
  const ready = inScale(energy) && inScale(soreness) && inScale(sleep);
  const dirty =
    energy !== (data?.readiness.energy ?? 0) ||
    soreness !== (data?.readiness.soreness ?? 0) ||
    sleep !== (data?.readiness.sleep ?? 0);

  useEffect(() => {
    if (!ready || !dirty || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    void (async () => {
      try {
        const readiness = await putReadiness(token, {
          energy,
          soreness,
          sleep,
        });
        setData((prev) => (prev ? { ...prev, readiness } : prev));
        setError("");
      } catch {
        setError("Não deu para registrar como você está.");
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    })();
  }, [dirty, energy, ready, sleep, soreness, token]);

  async function startLocal() {
    if (!prescription || !data) return;
    const base = {
      token,
      studioName: studio.name,
      accent,
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
          accent,
          streakCount:
            finish?.streak.current_count ?? data.streak.current_count + 1,
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

  const score = data?.readiness.score ?? 0;
  const sets = prescription ? plannedSets(prescription.items) : 0;
  const cta = resume
    ? "Continuar"
    : ctaLabel(data?.readiness.label ?? "");
  const now = new Date();

  return (
    <Phone tab>
      <View style={styles.head}>
        <View style={styles.headLeft}>
          <IconMark color={accent} />
          <Text style={styles.headDate}>
            {weekdayLong(now)} · {dateShort(now)}
          </Text>
        </View>
        {data ? (
          <View style={styles.xpRow}>
            <Text style={styles.xpNum}>{data.streak.current_count}</Text>
            <Text style={[styles.xpUnit, { color: accent }]}>OFENSIVA</Text>
            <View style={styles.xpRule} />
            <Text style={styles.xpNum}>{data.xp_total}</Text>
            <Text style={styles.xpUnitMuted}>XP</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Band>
          <Text style={[styles.kicker, { color: accent }]}>
            Prontidão de hoje
          </Text>
          <ArcGauge
            value={score}
            label={data?.readiness.label || "Como você está?"}
            accent={accent}
          />
          <View style={styles.gaugeFoot}>
            <Text style={styles.dim}>0</Text>
            <Text style={styles.muted}>MÉDIA</Text>
            <Text style={styles.dim}>100</Text>
          </View>
          {saving ? <Text style={styles.saving}>Registrando</Text> : null}
          <Pressable onPress={() => setOpen((v) => !v)} style={styles.expand}>
            <Text style={styles.expandLabel}>Sono, carga e dor da semana</Text>
            <Text style={styles.expandAction}>{open ? "FECHAR" : "ABRIR"}</Text>
          </Pressable>
          {open ? (
            <View style={styles.scales}>
              <ScaleRow name="Energia" value={energy} onChange={setEnergy} />
              <ScaleRow name="Dor" value={soreness} onChange={setSoreness} />
              <ScaleRow name="Sono" value={sleep} onChange={setSleep} />
            </View>
          ) : null}
        </Band>

        {pendingLocal ? (
          <View style={[styles.banner, { backgroundColor: accent }]}>
            <Text style={styles.bannerText}>
              Sessão neste celular. Sobe quando tiver rede.
            </Text>
          </View>
        ) : null}

        {prescription && data?.banner ? (
          <View style={[styles.banner, { backgroundColor: accent }]}>
            <Text style={styles.bannerText}>{data.banner.text}</Text>
            <Text style={styles.bannerMeta}>AGORA</Text>
          </View>
        ) : null}

        <Band>
          <Text style={styles.kickerMuted}>
            {prescription
              ? `Hoje · ${prescription.name}`
              : "Hoje"}
          </Text>
          <Text style={styles.heroTitle}>
            {prescription
              ? prescription.name
              : "Ainda não tem ficha hoje."}
          </Text>
          {prescription ? (
            <View style={styles.stats}>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{prescription.items.length}</Text>
                {"  "}exercícios
              </Text>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{sets}</Text>
                {"  "}séries
              </Text>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{prescription.minutes}</Text>
                {"  "}min
              </Text>
            </View>
          ) : null}
          {prescription ? (
            <View style={styles.cta}>
              <AccentCTA
                label={cta}
                meta={prescription.minutes ? `${prescription.minutes} MIN` : undefined}
                onPress={() => {
                  void startLocal();
                }}
                accent={accent}
              />
            </View>
          ) : null}
        </Band>

        {prescription && data?.coach_line ? (
          <Band rule="hair">
            <View style={styles.coachHead}>
              <Initials name={studio.name} size={34} />
              <View style={styles.coachCopy}>
                <Text style={styles.coachName}>
                  {studio.name} revisou sua semana
                </Text>
                <Text style={styles.muted}>hoje</Text>
              </View>
            </View>
            <Text style={styles.coachLine}>{data.coach_line}</Text>
          </Band>
        ) : null}

        {data?.streak.protector_available ? (
          <Band rule="none">
            <View style={styles.prot}>
              <View style={styles.protMark}>
                <Text style={styles.protN}>1</Text>
              </View>
              <Text style={styles.muted}>Protetor disponível esta semana</Text>
            </View>
          </Band>
        ) : null}
      </ScrollView>
    </Phone>
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

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: T.pad,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flexShrink: 1,
  },
  headDate: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  xpNum: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  xpUnit: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 0.9,
  },
  xpUnitMuted: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 0.9,
  },
  xpRule: {
    width: 2,
    height: 14,
    backgroundColor: T.divider,
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
  gaugeFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  dim: { color: T.muted2, fontSize: 11, letterSpacing: 1 },
  muted: { color: T.muted, fontSize: 13 },
  saving: { color: T.muted, fontSize: 13, marginTop: 8 },
  expand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 15,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  expandLabel: { flex: 1, color: T.muted, fontSize: 12 },
  expandAction: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  scales: { marginTop: 10 },
  banner: {
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerText: {
    flex: 1,
    color: T.bg,
    fontFamily: FONT,
    fontSize: 13,
  },
  bannerMeta: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 11,
  },
  heroTitle: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 32,
    letterSpacing: -1.1,
    lineHeight: 34,
    marginTop: 6,
  },
  stats: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
  },
  stat: { color: T.muted, fontSize: 13 },
  statN: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  cta: { marginTop: 18 },
  coachHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coachCopy: { flex: 1 },
  coachName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  coachLine: {
    color: "#d7d3d3",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  prot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  protMark: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: T.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  protN: {
    color: "#d7d3d3",
    fontFamily: FONT,
    fontSize: 11,
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
});
