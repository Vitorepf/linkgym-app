import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { putCommitment, type Studio } from "../../api";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Days = 2 | 3 | 4 | 5 | 6;

type Props = {
  token: string;
  studio: Studio;
  onDone: () => void;
};

const DAYS: Days[] = [2, 3, 4, 5, 6];

export function Compromisso({ token, studio, onDone }: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;
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
      <Screen
        kicker={studio.name}
        title={`${studio.name} vai cobrar isso.`}
        accent={accent}
      >
        <PrimaryButton label="Seguir" onPress={onDone} />
      </Screen>
    );
  }

  return (
    <Screen
      kicker={studio.name}
      title="Quantos dias na semana ruim?"
      accent={accent}
    >
      <View style={styles.wrap}>
        {DAYS.map((n) => (
          <Pressable
            key={n}
            onPress={() => setDays(n)}
            accessibilityRole="button"
            accessibilityState={{ selected: days === n }}
            style={[styles.chip, days === n && { borderColor: accent }]}
          >
            <Text style={[styles.chipText, days === n && { color: accent }]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardKicker, { color: accent }]}>Quem vai saber</Text>
        <Text style={styles.cardName}>{studio.name}</Text>
        {days !== null ? (
          <Text style={styles.cardBody}>
            {days} dias. Se furar duas semanas, ele te chama — não o app.
          </Text>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Combinado"
        onPress={() => void send()}
        disabled={days === null}
        busy={busy}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 28,
  },
  chip: {
    minWidth: 52,
    alignItems: "center",
    borderWidth: 2,
    borderColor: productTheme.divider,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chipText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
  },
  card: {
    marginTop: 28,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: productTheme.divider,
  },
  cardKicker: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  cardName: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
    marginTop: 8,
  },
  cardBody: {
    color: productTheme.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 16,
  },
});
