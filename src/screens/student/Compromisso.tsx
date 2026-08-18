import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { putCommitment, type Studio } from "../../api";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Initials } from "../../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";

type Days = 2 | 3 | 4 | 5 | 6;

type Props = {
  token: string;
  studio: Studio;
  onDone: () => void;
};

const DAYS: Days[] = [2, 3, 4, 5, 6];

export function Compromisso({ token, studio, onDone }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const [days, setDays] = useState<Days | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(false);

  async function send() {
    if (days === null || busy) return;
    setBusy(true);
    setError("");
    try {
      await putCommitment(token, days);
      setReceipt(true);
    } catch {
      setError("Não deu para enviar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  if (receipt) {
    return (
      <Phone>
        <Head kicker="Combinado" accent={accent} />
        <Band rule="none">
          <Text style={styles.giant}>{studio.name} vai cobrar isso.</Text>
        </Band>
        <View style={styles.grow} />
        <DockFooter>
          <AccentCTA label="Seguir" onPress={onDone} accent={accent} />
        </DockFooter>
      </Phone>
    );
  }

  return (
    <Phone>
      <Head
        kicker="1 pergunta"
        title="Quantos dias na semana ruim?"
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Band>
          <View style={styles.days}>
            {DAYS.map((n) => (
              <Choice
                key={n}
                label={String(n)}
                selected={days === n}
                flex
                accent={accent}
                onPress={() => setDays(n)}
              />
            ))}
          </View>
        </Band>

        <Band raised>
          <View style={styles.cardHead}>
            <Initials name={studio.name} accent={accent} fill size={34} />
            <View style={styles.cardCopy}>
              <Text style={[styles.cardKicker, { color: accent }]}>
                Quem vai saber
              </Text>
              <Text style={styles.cardName}>{studio.name}</Text>
            </View>
          </View>
          {days !== null ? (
            <Text style={styles.cardBody}>
              {days} dias. Se furar duas semanas, ele te chama — não o app.
            </Text>
          ) : null}
        </Band>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Combinado"
          onPress={() => void send()}
          disabled={days === null}
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
  grow: { flex: 1 },
  days: {
    flexDirection: "row",
    gap: 8,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardCopy: { flex: 1, minWidth: 0 },
  cardKicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  cardName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 28,
    letterSpacing: -0.6,
    marginTop: 4,
    textAlign: "left",
  },
  cardBody: {
    color: T.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  giant: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 40,
    letterSpacing: -1.4,
    lineHeight: 44,
    textAlign: "left",
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 8,
  },
});
