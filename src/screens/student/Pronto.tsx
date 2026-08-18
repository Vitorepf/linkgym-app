import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { today, type Person, type Studio } from "../../api";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onContinue: () => void;
};

const BEATS = [
  { kicker: "Hoje", line: (name: string) => `${name} vê suas respostas.` },
  { kicker: "Quando publicar", line: () => "Você recebe o Hoje com a ficha." },
  { kicker: "Primeiro treino", line: () => "Curto. Impossível de falhar." },
] as const;

export function Pronto({ token, person, studio, onContinue }: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;
  const name = person.name.trim() || "você";
  const [hasFicha, setHasFicha] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) setHasFicha(payload.prescription !== null);
      } catch {
        if (alive) setHasFicha(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <Screen
      kicker="Tudo enviado"
      title={`Bem-vindo, ${name}`}
      accent={accent}
    >
      <View style={styles.beats}>
        {BEATS.map((beat) => (
          <View key={beat.kicker} style={styles.beat}>
            <Text style={[styles.beatKicker, { color: accent }]}>
              {beat.kicker}
            </Text>
            <Text style={styles.beatLine}>{beat.line(studio.name)}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label={hasFicha ? "Ver o Hoje" : "Entendi"}
        onPress={onContinue}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  beats: { marginTop: 32, gap: 22 },
  beat: { gap: 6 },
  beatKicker: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  beatLine: {
    color: productTheme.ink,
    fontSize: 18,
    lineHeight: 24,
  },
});
