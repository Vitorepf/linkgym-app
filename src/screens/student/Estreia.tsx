import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { today, type Studio } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  studio: Studio;
  needsCommitment: boolean;
};

export function estreiaSeenKey(studioId: string): string {
  return `estreia.seen.${studioId}`;
}

export function Estreia({ token, studio, needsCommitment }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Estreia">>();
  const accent = studio.accent_color || productTheme.accentFallback;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const payload = await today(token);
      await AsyncStorage.setItem(estreiaSeenKey(studio.id), "1");
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
      title="Seu primeiro treino"
      body="Curto de propósito."
      accent={accent}
    >
      <View
        style={styles.bar}
        accessibilityRole="progressbar"
        accessibilityLabel="Ofensiva 1 de 4"
      >
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.seg,
              i === 0
                ? { backgroundColor: accent, borderColor: accent }
                : styles.segEmpty,
            ]}
          />
        ))}
      </View>
      <Text style={styles.copy}>A barra já anda quando você começa.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="Começar" onPress={() => void start()} busy={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    gap: 6,
    marginTop: 36,
  },
  seg: {
    flex: 1,
    height: 12,
    borderWidth: 2,
    borderRadius: productTheme.radius,
  },
  segEmpty: {
    backgroundColor: "transparent",
    borderColor: productTheme.divider,
  },
  copy: {
    color: productTheme.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 14,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 16,
  },
});
