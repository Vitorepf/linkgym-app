import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import type { StudentTabNavigation } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
};

const BADGES = [
  { key: "estreia", label: "Estreia" },
  { key: "ofensiva_4", label: "Ofensiva 4" },
  { key: "primeiro_pr", label: "Primeiro PR" },
  { key: "retomada", label: "Retomada" },
] as const;

export function Progresso({ token, studio }: Props) {
  const navigation = useNavigation<StudentTabNavigation>();
  const accent = studio.accent_color || productTheme.accentFallback;
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

  return (
    <Screen kicker="Progresso" title={studio.name} accent={accent} tab>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {data ? (
          <>
            <Text style={styles.kicker}>Ofensiva</Text>
            <Text
              style={[styles.streak, { color: accent }]}
              accessibilityLabel={`Ofensiva ${data.streak.current_count}`}
            >
              {data.streak.current_count}
            </Text>
            <Text style={styles.protector}>
              {data.streak.protector_available
                ? "Protetor disponível"
                : "Protetor usado"}
            </Text>

            <Text style={styles.section}>Liga</Text>
            {data.league.map((row, i) => (
              <View key={row.name} style={styles.leagueRow}>
                <Text style={[styles.rank, row.me && { color: accent }]}>
                  {i + 1}º
                </Text>
                <Text style={[styles.leagueName, row.me && { color: accent }]}>
                  {row.name}
                </Text>
                <Text style={[styles.leagueXp, row.me && { color: accent }]}>
                  {row.xp_total} XP
                </Text>
              </View>
            ))}

            <Text style={styles.section}>Prontidão</Text>
            <View style={styles.ticks}>
              {data.readiness_week.map((d) => {
                const on = d.score > 0;
                return (
                  <View key={d.for_date} style={styles.tickCol}>
                    <View
                      style={[
                        styles.tick,
                        on && {
                          borderColor: accent,
                          backgroundColor: accent,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>

            <Text style={styles.section}>Selos</Text>
            {BADGES.map((badge) => {
              const on = earned.has(badge.key);
              return (
                <Text
                  key={badge.key}
                  style={[styles.badge, !on && styles.badgeOff]}
                >
                  {badge.label}
                </Text>
              );
            })}
          </>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate("Hoje")}
          style={styles.back}
          hitSlop={8}
        >
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 8,
  },
  kicker: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 20,
  },
  streak: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  protector: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 4,
  },
  section: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 32,
    marginBottom: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderColor: productTheme.divider,
  },
  leagueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  rank: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    width: 36,
  },
  leagueName: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
    flex: 1,
  },
  leagueXp: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1,
  },
  ticks: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  tickCol: { flex: 1 },
  tick: {
    height: 28,
    borderWidth: 2,
    borderColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  badge: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    letterSpacing: -0.2,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  badgeOff: {
    color: productTheme.muted,
    opacity: 0.45,
  },
  back: { marginTop: 32, alignSelf: "flex-start" },
  backText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
