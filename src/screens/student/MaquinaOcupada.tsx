import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { swapExercise, type TodayItem } from "../../api";
import {
  ensureServerSession,
  loadCurrent,
  rememberSwap,
} from "../../offline/sessionQueue";
import { productTheme } from "../../theme";

type Props = {
  token: string;
  studioName: string;
  accent: string;
  prescriptionId: string;
  from: TodayItem;
  items: TodayItem[];
};

export function MaquinaOcupada({
  token,
  studioName,
  accent,
  prescriptionId,
  from,
  items,
}: Props) {
  const others = items.filter((item) => item.exercise_id !== from.exercise_id);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirm(to: TodayItem) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const sessionId = await ensureServerSession(token, prescriptionId);
      const current = await loadCurrent();
      if (current) {
        await rememberSwap(current.client_id, from.exercise_id, to.exercise_id);
      }
      await swapExercise(token, sessionId, from.exercise_id, to.exercise_id);
      setNotice(`${studioName} foi avisado. A ofensiva não quebra.`);
      setOpen(false);
    } catch {
      setError("Não deu para avisar.");
    } finally {
      setBusy(false);
    }
  }

  if (others.length === 0) return null;

  return (
    <View>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.control}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Máquina ocupada"
      >
        <Text style={[styles.controlText, { color: accent }]}>Máquina ocupada</Text>
      </Pressable>

      {open ? (
        <View style={styles.list}>
          {others.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                void confirm(item);
              }}
              disabled={busy}
              style={styles.row}
              accessibilityRole="button"
              accessibilityLabel={`Trocar por ${item.name}`}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.planned_sets} × {item.planned_reps} · {item.load_kg} kg
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={() => setOpen(false)} style={styles.cancel} hitSlop={8}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      ) : null}

      {notice ? (
        <Text style={[styles.notice, { borderLeftColor: accent }]}>{notice}</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  control: { marginTop: 12, alignSelf: "flex-start" },
  controlText: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  list: { marginTop: 8 },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  meta: { color: productTheme.muted, fontSize: 14, marginTop: 4 },
  cancel: { marginTop: 12, alignSelf: "flex-start" },
  cancelText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
  notice: {
    color: productTheme.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 8,
  },
});
