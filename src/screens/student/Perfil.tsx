import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

export function Perfil({ token, person, studio, onLeave }: Props) {
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
        if (alive) setError("Não deu para abrir o perfil.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const place = data ? data.league.findIndex((row) => row.me) + 1 : 0;

  return (
    <Screen kicker="Perfil" title={person.name} accent={accent} tab>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.studio}>{studio.name}</Text>

        {data ? (
          <>
            <Text style={styles.kicker}>Ofensiva</Text>
            <Text style={[styles.stat, { color: accent }]}>
              {data.streak.current_count}
            </Text>
            <Text style={styles.kicker}>XP</Text>
            <Text style={styles.stat}>{data.xp_total}</Text>
            {place > 0 ? (
              <Text style={styles.liga}>
                {place}º com o {studio.name}
              </Text>
            ) : null}
          </>
        ) : null}

        <Pressable onPress={onLeave} style={styles.leave} hitSlop={8}>
          <Text style={styles.leaveText}>Sair</Text>
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
  studio: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 8,
  },
  kicker: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 32,
  },
  stat: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 48,
    letterSpacing: -1,
    lineHeight: 52,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  liga: {
    color: productTheme.ink,
    fontSize: 16,
    marginTop: 28,
    lineHeight: 22,
  },
  leave: { marginTop: "auto", paddingTop: 48, alignSelf: "flex-start" },
  leaveText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
