import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import { FONT, productTheme as T } from "../../theme";
import { Band, Head, Phone } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
};

const BADGES = [
  { key: "estreia", label: "ESTREIA", mark: "1" },
  { key: "ofensiva_4", label: "SEMANAS", mark: "4" },
  { key: "primeiro_pr", label: "PR", mark: "PR" },
  { key: "retomada", label: "RETOMADA", mark: "R" },
] as const;

export function Progresso({ token, person, studio }: Props) {
  const accent = studio.accent_color || T.accentFallback;
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
        if (alive) setError("Não deu para abrir o progresso.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const me = data?.league.findIndex((row) => row.me) ?? -1;
  const weeks = Math.min(12, data?.streak.current_count ?? 0);

  return (
    <Phone tab>
      <Head
        kicker={`${person.name} · agora`}
        title="Progresso"
        kickerMuted
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {data ? (
          <>
            <Band>
              <View style={styles.rowBetween}>
                <Text style={[styles.kicker, { color: accent }]}>
                  Ofensiva · {data.streak.current_count}
                </Text>
                <Text style={styles.muted}>
                  {data.streak.protector_available
                    ? "1 protetor"
                    : "protetor usado"}
                </Text>
              </View>
              <View style={styles.grid12}>
                {Array.from({ length: 12 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.sq,
                      {
                        backgroundColor: i < weeks ? accent : T.fill,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.caption}>
                Semana fechada = treinos do compromisso. Você fechou{" "}
                {data.streak.current_count} seguidas.
              </Text>
            </Band>

            <Band>
              <Text style={styles.kickerMuted}>
                {me >= 0 ? `${me + 1}º na liga` : "Liga"}
              </Text>
              <View style={styles.league}>
                {data.league.map((row, i) => (
                  <View
                    key={`${row.name}-${i}`}
                    style={[
                      styles.leagueRow,
                      row.me && { backgroundColor: accent, marginHorizontal: -12, paddingHorizontal: 12 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rank,
                        row.me && { color: T.bg },
                      ]}
                    >
                      {i + 1}
                    </Text>
                    <Text
                      style={[
                        styles.leagueName,
                        row.me && { color: T.bg, fontFamily: FONT },
                      ]}
                    >
                      {row.me ? "Você" : row.name}
                    </Text>
                    <Text
                      style={[
                        styles.leagueXp,
                        row.me && { color: T.bg },
                      ]}
                    >
                      {row.xp_total.toLocaleString("pt-BR")}
                    </Text>
                  </View>
                ))}
              </View>
            </Band>

            <Band>
              <Text style={styles.kickerMuted}>Prontidão · 7 dias</Text>
              <View style={styles.week}>
                {data.readiness_week.map((d, i) => {
                  const pct = Math.max(0, Math.min(1, d.score / 100));
                  const last = i === data.readiness_week.length - 1;
                  return (
                    <View key={d.for_date} style={styles.weekCol}>
                      <View
                        style={[
                          styles.weekBar,
                          {
                            height: Math.max(6, pct * 60),
                            backgroundColor: last && pct > 0 ? accent : T.divider,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
              <Text style={styles.caption}>
                Os dias preenchidos são os que você registrou como estava.
              </Text>
            </Band>

            <Band rule="none">
              <Text style={styles.kickerMuted}>Selos</Text>
              <View style={styles.badges}>
                {BADGES.map((badge) => {
                  const on = earned.has(badge.key);
                  return (
                    <View key={badge.key} style={styles.badgeCol}>
                      <View
                        style={[
                          styles.badge,
                          on
                            ? { backgroundColor: accent }
                            : styles.badgeOff,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeMark,
                            { color: on ? T.bg : T.muted2 },
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
      </ScrollView>
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
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
  muted: { color: T.muted, fontSize: 11 },
  grid12: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 14,
  },
  sq: {
    width: "7.2%",
    aspectRatio: 1,
    flexGrow: 1,
  },
  caption: {
    color: T.muted,
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },
  league: { marginTop: 14, gap: 10 },
  leagueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rank: {
    width: 16,
    color: T.muted,
    fontFamily: FONT,
    fontSize: 12,
  },
  leagueName: {
    flex: 1,
    color: T.ink,
    fontSize: 14,
  },
  leagueXp: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  week: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 60,
    marginTop: 14,
  },
  weekCol: { flex: 1, justifyContent: "flex-end" },
  weekBar: { width: "100%" },
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
  badgeOff: {
    borderWidth: 2,
    borderColor: T.fill,
  },
  badgeMark: {
    fontFamily: FONT,
    fontSize: 15,
  },
  badgeLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    marginTop: 5,
  },
});
