import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  putOnboarding,
  type OnboardingBody,
  type Studio,
} from "../../api";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  studio: Studio;
  onSent: () => void;
};

const EXPERIENCE: { value: OnboardingBody["experience"]; label: string }[] = [
  { value: "never", label: "Nunca treinei" },
  { value: "before", label: "Já treinei antes" },
  { value: "training", label: "Treino hoje" },
];

const DAYS: OnboardingBody["days_per_week"][] = [2, 3, 4, 5, 6];

export function SobreVoce({ token, studio, onSent }: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;
  const [experience, setExperience] =
    useState<OnboardingBody["experience"] | null>(null);
  const [days, setDays] = useState<OnboardingBody["days_per_week"] | null>(
    null,
  );
  const [pain, setPain] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ready = experience !== null && days !== null && pain !== null;

  async function send() {
    if (!ready || busy || experience === null || days === null || pain === null) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await putOnboarding(token, {
        experience,
        days_per_week: days,
        pain,
      });
      onSent();
    } catch {
      setError("Não deu para enviar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      kicker="3 perguntas · 30 segundos"
      title="Sobre você"
      body={`${studio.name} usa isso para ajustar a ficha.`}
      accent={accent}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.q}>Você já treinou musculação?</Text>
        <View style={styles.wrap}>
          {EXPERIENCE.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              on={experience === opt.value}
              accent={accent}
              onPress={() => setExperience(opt.value)}
            />
          ))}
        </View>

        <Text style={styles.q}>Quantos dias por semana você consegue?</Text>
        <View style={styles.wrap}>
          {DAYS.map((n) => (
            <Chip
              key={n}
              label={String(n)}
              on={days === n}
              accent={accent}
              onPress={() => setDays(n)}
            />
          ))}
        </View>
        <Text style={styles.caption}>
          Pense numa semana ruim, não numa semana boa.
        </Text>

        <Text style={styles.q}>Sente dor em alguma articulação?</Text>
        <View style={styles.wrap}>
          <Chip
            label="Não"
            on={pain === false}
            accent={accent}
            onPress={() => setPain(false)}
          />
          <Chip
            label="Sim, tenho"
            on={pain === true}
            accent={accent}
            onPress={() => setPain(true)}
          />
        </View>
        <Text style={styles.caption}>
          Se marcar sim, o {studio.name} te liga antes de montar a ficha.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={`Enviar para ${studio.name}`}
          onPress={send}
          disabled={!ready}
          busy={busy}
        />
      </ScrollView>
    </Screen>
  );
}

function Chip({
  label,
  on,
  accent,
  onPress,
}: {
  label: string;
  on: boolean;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={[styles.chip, on && { borderColor: accent }]}
    >
      <Text style={[styles.chipText, on && { color: accent }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 40, flexGrow: 1 },
  q: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    marginTop: 28,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    borderWidth: 2,
    borderColor: productTheme.divider,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
  },
  caption: {
    color: productTheme.muted,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 16,
  },
});
