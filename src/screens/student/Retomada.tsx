import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  completeComeback,
  today,
  type Person,
  type Studio,
  type TodayPayload,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

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
  const accent = studio.accent_color || productTheme.accentFallback;
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
        navigation.reset({ index: 0, routes: [{ name: "Hoje" }] });
        return;
      }
      const session = await createSession(prescription.id, newClientId());
      navigation.reset({
        index: 1,
        routes: [
          { name: "Hoje" },
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
    <Screen
      kicker={studio.name}
      title="9 minutos."
      body="Nenhuma culpa."
      accent={accent}
    >
      <Text style={styles.line}>{comeback.coach_line}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton
        label="Fazer agora"
        onPress={() => void startNow()}
        busy={busy}
      />
      <Pressable
        onPress={() => navigation.navigate("Hoje")}
        hitSlop={8}
        style={styles.skip}
      >
        <Text style={styles.skipText}>Agora não</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: {
    color: productTheme.ink,
    fontSize: 18,
    lineHeight: 26,
    marginTop: 20,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 16,
  },
  skip: { marginTop: 20, alignSelf: "flex-start" },
  skipText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
