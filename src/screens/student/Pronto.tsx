import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { today, type Person, type Studio } from "../../api";
import { accentSet, FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onContinue: () => void;
};

const BEATS = [
  { kicker: "Hoje", line: (name: string) => `${name} vê o corpo e as respostas.` },
  { kicker: "Quando publicar", line: () => "Você recebe o Hoje com a ficha." },
  { kicker: "Primeiro treino", line: () => "Curto. Impossível de falhar." },
] as const;

export function Pronto({ token, person, studio, onContinue }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
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
    <Phone>
      <Head kicker="Enviado" title={`Bem-vindo, ${name}`} accent={accent} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {BEATS.map((beat) => (
          <Band key={beat.kicker}>
            <Text style={[styles.beatKicker, { color: A.text }]}>
              {beat.kicker}
            </Text>
            <Text style={styles.beatLine}>{beat.line(studio.name)}</Text>
          </Band>
        ))}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label={hasFicha ? "Ver o Hoje" : "Entendi"}
          onPress={onContinue}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  beatKicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  beatLine: {
    color: T.ink,
    fontSize: 18,
    lineHeight: 24,
    marginTop: 8,
    textAlign: "left",
  },
});
