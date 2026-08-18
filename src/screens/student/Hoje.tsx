import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { today, type Person, type Studio, type TodayPayload } from "../../api";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

export function Hoje({ token, studio, onLeave }: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;
  const [data, setData] = useState<TodayPayload | null>(null);
  const [error, setError] = useState("");
  // Task 5 persists client_id; Começar must not POST /v1/sessions.
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) {
          setData(payload);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o hoje.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const prescription = data?.prescription ?? null;
  const kicker = prescription ? `Hoje · ${prescription.name}` : "Hoje";
  const empty = data !== null && prescription === null;

  function startLocal() {
    if (!clientId) setClientId(newClientId());
  }

  return (
    <Screen kicker={kicker} accent={accent} title={studio.name}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {empty ? (
          <Text style={styles.empty}>Ainda não tem ficha hoje.</Text>
        ) : null}

        {data && prescription ? (
          <>
            <Text style={styles.score}>{data.readiness.score}</Text>
            <Text style={styles.label}>{data.readiness.label}</Text>

            <View style={styles.strip}>
              <Text style={styles.stripItem}>
                Ofensiva {data.streak.current_count}
              </Text>
              <Text style={[styles.stripItem, { color: accent }]}>·</Text>
              <Text style={styles.stripItem}>{data.xp_total} XP</Text>
            </View>

            {data.coach_line ? (
              <Text style={styles.coach}>{data.coach_line}</Text>
            ) : null}

            {data.banner ? (
              <Text style={[styles.banner, { borderLeftColor: accent }]}>
                {data.banner.text}
              </Text>
            ) : null}

            <PrimaryButton
              label={ctaLabel(data.readiness.label)}
              onPress={startLocal}
            />
          </>
        ) : null}

        <Pressable onPress={onLeave} style={styles.leave} hitSlop={8}>
          <Text style={styles.leaveText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function ctaLabel(label: string): string {
  if (label === "Versão leve") return "Começar leve";
  return "Começar";
}

function newClientId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const n = (Math.random() * 16) | 0;
    const v = ch === "x" ? n : (n & 0x3) | 0x8;
    return v.toString(16);
  });
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
    marginTop: 12,
    lineHeight: 22,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 8,
  },
  leave: { marginTop: "auto", paddingTop: 40, alignSelf: "flex-start" },
  leaveText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
