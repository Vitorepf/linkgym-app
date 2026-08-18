import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  completeComeback,
  today,
  type Person,
  type Studio,
  type TodayPayload,
} from "../../api";
import { studentHomeTarget, STUDENT_HOME_ROUTE } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { GhostCTA } from "../../ui/GhostCTA";
import { Initials } from "../../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
  comeback: NonNullable<TodayPayload["comeback"]>;
};

export function Retomada({
  token,
  studio,
  needsCommitment,
  comeback,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Retomada">>();
  const accent = studio.accent_color || T.accentFallback;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startNow() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await completeComeback(token, comeback.id);
      const payload = await today(token);
      const prescription = payload.prescription;
      if (!prescription) {
        navigation.reset({
          index: 0,
          routes: [studentHomeTarget],
        });
        return;
      }
      const session = await createSession(prescription.id, newClientId());
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
              prescriptionId: prescription.id,
              items: prescription.items,
              itemIndex: 0,
              setIndex: 1,
              streakCount: payload.streak.current_count,
              xpTotal: payload.xp_total,
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
        kicker="Retomada"
        title={`${comeback.minutes} minutos.`}
        body="Nenhuma culpa."
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Band>
          <View style={styles.coachHead}>
            <Initials name={studio.name} size={34} />
            <Text style={styles.coachName}>{studio.name}</Text>
          </View>
          <Text style={styles.line}>{comeback.coach_line}</Text>
        </Band>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Fazer agora"
          onPress={() => void startNow()}
          busy={busy}
          accent={accent}
        />
        <View style={styles.ghost}>
          <GhostCTA
            label="Agora não"
            onPress={() => navigation.navigate(STUDENT_HOME_ROUTE)}
          />
        </View>
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  coachHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coachName: {
    flex: 1,
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  line: {
    color: T.ink,
    fontSize: 18,
    lineHeight: 26,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 16,
  },
  ghost: { marginTop: 10 },
});
