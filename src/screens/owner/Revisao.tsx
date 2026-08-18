import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  approveOwnerWeek,
  ownerWeek,
  type OwnerWeekItem,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Revisao">;

export function Revisao({ route }: Props) {
  const { token, studioName, accent } = route.params;
  const startedAt = useRef(Date.now());
  const [items, setItems] = useState<OwnerWeekItem[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneSeconds, setDoneSeconds] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const payload = await ownerWeek(token);
      setItems(payload.items);
      const next: Record<string, boolean> = {};
      for (const it of payload.items) {
        next[it.person_id] = it.selected;
      }
      setPicked(next);
      setError("");
    } catch {
      setError("Não deu para abrir a revisão.");
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (doneSeconds !== null) return;
      void load();
    }, [load, doneSeconds]),
  );

  const selectedIds = items
    .filter((it) => picked[it.person_id] !== false)
    .map((it) => it.person_id);
  const count = selectedIds.length;

  async function approve() {
    if (busy || count === 0) return;
    setBusy(true);
    try {
      await approveOwnerWeek(token, selectedIds);
      const seconds = Math.max(
        0,
        Math.round((Date.now() - startedAt.current) / 1000),
      );
      setDoneSeconds(seconds);
      setError("");
      if (__DEV__) {
        console.log(`${studioName} revisou sua semana`);
      }
    } catch {
      setError("Não deu para aprovar.");
    } finally {
      setBusy(false);
    }
  }

  const n = items.length;
  const done = doneSeconds !== null;

  return (
    <Screen
      title={`A semana dos ${n}`}
      body={
        done
          ? undefined
          : "O app já calculou o ajuste. Desmarque o que discordar."
      }
      accent={accent}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {done ? (
          <Text style={styles.done}>
            {`Feito · ${doneSeconds}s · cada um recebe o ajuste com o nome do ${studioName} — não um texto genérico.`}
          </Text>
        ) : (
          <>
            {items.map((row) => {
              const on = picked[row.person_id] !== false;
              return (
                <Pressable
                  key={row.person_id}
                  style={styles.row}
                  onPress={() =>
                    setPicked((prev) => ({
                      ...prev,
                      [row.person_id]: !on,
                    }))
                  }
                >
                  <View
                    style={[
                      styles.check,
                      on && { backgroundColor: productTheme.ink },
                    ]}
                  />
                  <View style={[styles.initials, { borderColor: accent }]}>
                    <Text style={[styles.initialsText, { color: accent }]}>
                      {initials(row.name)}
                    </Text>
                  </View>
                  <View style={styles.rowBody}>
                    <Text style={styles.name}>{row.name}</Text>
                    <Text style={styles.meta}>{row.adherence}</Text>
                    <Text style={styles.suggested}>{row.suggested}</Text>
                  </View>
                </Pressable>
              );
            })}
            <PrimaryButton
              label={`Aprovar ${count} revisões`}
              onPress={() => void approve()}
              disabled={count === 0}
              busy={busy}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 12,
  },
  done: {
    color: productTheme.ink,
    fontSize: 18,
    lineHeight: 26,
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: productTheme.ink,
    marginTop: 4,
  },
  initials: {
    width: 44,
    height: 44,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    letterSpacing: 1,
  },
  rowBody: { flex: 1 },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  meta: { color: productTheme.muted, fontSize: 14, marginTop: 4 },
  suggested: {
    color: productTheme.ink,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
});
