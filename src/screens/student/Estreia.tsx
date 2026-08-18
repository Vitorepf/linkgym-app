import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { today, type Person, type Studio, type TodayPayload } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { plannedSets } from "../../ui/format";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";

type Props = {
  token: string;
  studio: Studio;
  needsCommitment: boolean;
  person?: Person;
};

export function estreiaSeenKey(studioId: string): string {
  return `estreia.seen.${studioId}`;
}

export function Estreia({ token, studio, needsCommitment, person }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Estreia">>();
  const accent = studio.accent_color || T.accentFallback;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<TodayPayload | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await today(token);
        if (alive) setPayload(data);
      } catch {
        if (alive) setPayload(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const name =
    person?.name.trim() || payload?.person.name.trim() || "";
  const prescription = payload?.prescription ?? null;

  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = payload ?? (await today(token));
      setPayload(data);
      await AsyncStorage.setItem(estreiaSeenKey(studio.id), "1");
      const next = data.prescription;
      if (!next) {
        navigation.reset({
          index: 0,
          routes: [studentHomeTarget],
        });
        return;
      }
      const session = await createSession(next.id, newClientId());
      navigation.reset({
        index: 1,
        routes: [
          studentHomeTarget,
          {
            name: "Serie",
            params: {
              token,
              studioName: studio.name,
              accent,
              clientId: session.client_id,
              prescriptionId: next.id,
              items: next.items,
              itemIndex: 0,
              setIndex: 1,
              streakCount: data.streak.current_count,
              xpTotal: data.xp_total,
              needsCommitment,
            },
          },
        ],
      });
    } catch {
      setError("Não deu para começar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head
        kicker="Primeiro treino"
        title={name ? `Bem-vindo, ${name}` : "Seu primeiro treino"}
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {prescription ? (
          <Band>
            <Text style={styles.workout}>{prescription.name}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{prescription.items.length}</Text>
                {"  "}exercícios
              </Text>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{plannedSets(prescription.items)}</Text>
                {"  "}séries
              </Text>
              <Text style={styles.stat}>
                <Text style={styles.statN}>{prescription.minutes}</Text>
                {"  "}min
              </Text>
            </View>
          </Band>
        ) : null}

        <Band>
          <View style={styles.callout}>
            <Text style={[styles.callKicker, { color: accent }]}>Estreia</Text>
            <Text style={styles.callBody}>Curto de propósito.</Text>
            <Text style={styles.callMuted}>
              A barra já anda quando você começa.
            </Text>
          </View>
        </Band>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Começar"
          onPress={() => void start()}
          busy={busy}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  workout: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 34,
    letterSpacing: -1.2,
    lineHeight: 36,
    textAlign: "left",
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
  callout: {
    borderWidth: 2,
    borderColor: T.divider,
    padding: 16,
  },
  callKicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  callBody: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 18,
    letterSpacing: -0.3,
    marginTop: 10,
    textAlign: "left",
  },
  callMuted: {
    color: T.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 16,
  },
});
