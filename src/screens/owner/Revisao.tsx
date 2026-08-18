import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  approveOwnerWeek,
  ownerWeek,
  type OwnerWeekItem,
} from "../../api";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { IconCheck } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { weekdayLong } from "../../ui/format";

type Props = {
  token: string;
  studioName: string;
  accent: string;
  tab?: boolean;
};

export function Revisao({ token, studioName, accent, tab }: Props) {
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
  const title = n > 0 ? `A semana dos ${n}` : "A semana";

  return (
    <Phone tab={tab}>
      <Head
        kicker={weekdayLong()}
        title={title}
        body={
          done
            ? undefined
            : "O app já calculou o ajuste. Desmarque o que discordar."
        }
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!done
          ? items.map((row) => {
              const on = picked[row.person_id] !== false;
              return (
                <Pressable
                  key={row.person_id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
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
                      on && { backgroundColor: T.ink, borderColor: T.ink },
                    ]}
                  >
                    {on ? <IconCheck color={T.bg} size={14} /> : null}
                  </View>
                  <Initials name={row.name} size={34} />
                  <View style={styles.rowBody}>
                    <Text style={styles.name}>
                      {row.name}
                      <Text style={styles.adh}> · {row.adherence}</Text>
                    </Text>
                    <Text style={styles.suggested}>{row.suggested}</Text>
                  </View>
                </Pressable>
              );
            })
          : null}

        {!done && n > 0 ? (
          <Band>
            <Text style={styles.kickerMuted}>O que cada um recebe</Text>
            <View style={styles.note}>
              <Text style={styles.noteTitle}>
                {`"${studioName} revisou sua semana"`}
              </Text>
              <Text style={styles.noteBody}>
                Com o ajuste dele em uma linha. Não é notificação automática
                genérica. É a decisão que você acabou de tomar.
              </Text>
            </View>
          </Band>
        ) : null}
      </ScrollView>

      {!done ? (
        <DockFooter>
          <AccentCTA
            label={`Aprovar ${count} revisões`}
            onPress={() => void approve()}
            disabled={count === 0}
            busy={busy}
            accent={accent}
          />
        </DockFooter>
      ) : null}

      {done ? (
        <View style={styles.overlay} pointerEvents="auto">
          <View style={[styles.sheet, { borderColor: accent }]}>
            <Text style={[styles.sheetKicker, { color: accent }]}>Feito</Text>
            <Text style={styles.sheetNum}>{doneSeconds}s</Text>
            <Text style={styles.sheetBody}>
              {count} alunos revisados. Cada um recebe o ajuste com o nome do{" "}
              {studioName}.
            </Text>
          </View>
        </View>
      ) : null}
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowBody: { flex: 1, minWidth: 0 },
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  adh: {
    color: T.muted,
  },
  suggested: {
    color: T.muted,
    fontSize: 13,
    marginTop: 2,
  },
  kickerMuted: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  note: {
    borderWidth: 2,
    borderColor: T.divider,
    padding: 14,
    marginTop: 12,
  },
  noteTitle: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  noteBody: {
    color: T.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,10,10,0.86)",
    justifyContent: "flex-end",
    paddingHorizontal: T.pad,
    paddingBottom: 24,
  },
  sheet: {
    backgroundColor: T.surface,
    borderWidth: 2,
    paddingHorizontal: T.pad,
    paddingTop: 24,
    paddingBottom: 22,
  },
  sheetKicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  sheetNum: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 44,
    letterSpacing: -1.8,
    lineHeight: 44,
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },
  sheetBody: {
    color: T.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
});
