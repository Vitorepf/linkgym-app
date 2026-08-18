import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import { accentSet, errorInk, FONT, productTheme as T } from "../../theme";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, Phone } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

const BADGES = [
  { key: "estreia", label: "ESTREIA", mark: "1" },
  { key: "ofensiva_4", label: "SEMANAS", mark: "4" },
  { key: "primeiro_pr", label: "PR", mark: "PR" },
  { key: "retomada", label: "RETOMADA", mark: "R" },
] as const;

export function Perfil({ token, person, studio, onLeave }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
  const [data, setData] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await progress(token);
        if (alive) {
          setData(payload);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o perfil.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const name = person.name.trim() || "Você";
  const place = data ? data.league.findIndex((row) => row.me) + 1 : 0;
  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const nextWeek = Math.max(0, 4 - (data?.streak.current_count ?? 0));
  const weekPct = Math.min(1, (data?.streak.current_count ?? 0) / 4);

  return (
    <Phone tab>
      <View style={styles.head}>
        <Initials name={name} accent={accent} fill size={54} />
        <View style={styles.headCopy}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sub}>
            Com o {studio.name}
            {place > 0 ? ` · ${place}º na liga` : ""}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {data ? (
          <>
            <MetricGrid
              cells={[
                {
                  label: "Ofensiva atual",
                  value: data.streak.current_count,
                  note: "sequência",
                },
                {
                  label: "Recorde",
                  value: data.streak.current_count,
                  note: "você está nele agora",
                },
                {
                  label: "XP total",
                  value: data.xp_total.toLocaleString("pt-BR"),
                },
                {
                  label: "Liga",
                  value: place > 0 ? `${place}º` : "—",
                  note: studio.name,
                },
              ]}
            />

            <Band>
              <Text style={[styles.kicker, { color: A.text }]}>Quanto falta</Text>
              <View style={styles.goal}>
                <View style={styles.goalRow}>
                  <Text style={styles.goalName}>Selo · 4 semanas</Text>
                  <Text style={styles.goalFrac}>
                    {Math.min(4, data.streak.current_count)}/4
                  </Text>
                </View>
                <View style={styles.bar}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${weekPct * 100}%`, backgroundColor: T.muted },
                    ]}
                  />
                </View>
                <Text style={styles.caption}>
                  {nextWeek === 0
                    ? "Selo de 4 semanas fechado."
                    : `${nextWeek} semana${nextWeek === 1 ? "" : "s"} e ele é seu.`}
                </Text>
              </View>
            </Band>

            <Band>
              <Text style={styles.kickerMuted}>Selos</Text>
              <View style={styles.badges}>
                {BADGES.map((badge) => {
                  const on = earned.has(badge.key);
                  return (
                    <View key={badge.key} style={styles.badgeCol}>
                      <View
                        style={[
                          styles.badge,
                          on ? styles.badgeOn : styles.badgeOff,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeMark,
                            { color: on ? T.ink : T.muted2 },
                          ]}
                        >
                          {badge.mark}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.badgeLabel,
                          { color: on ? T.muted : T.muted2 },
                        ]}
                      >
                        {badge.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Band>
          </>
        ) : null}

        <Pressable onPress={onLeave} style={styles.leave} hitSlop={12}>
          <Text style={styles.leaveText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </Phone>
  );
}

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: T.pad,
    paddingTop: 8,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  headCopy: { flex: 1, minWidth: 0 },
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  sub: {
    color: T.muted,
    fontSize: 13,
    marginTop: 3,
  },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
  error: {
    color: errorInk,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  kickerMuted: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  goal: { marginTop: 4 },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  goalFrac: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  bar: {
    height: 8,
    backgroundColor: T.fill,
    marginTop: 8,
  },
  barFill: { height: 8 },
  caption: {
    color: T.muted,
    fontSize: 13,
    marginTop: 7,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  badgeCol: { flex: 1 },
  badge: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeOn: { backgroundColor: T.fill },
  badgeOff: {
    borderWidth: 2,
    borderColor: T.fill,
  },
  badgeMark: { fontFamily: FONT, fontSize: 15 },
  badgeLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    marginTop: 5,
  },
  leave: {
    paddingHorizontal: T.pad,
    paddingVertical: 24,
  },
  leaveText: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
