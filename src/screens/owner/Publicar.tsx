import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ownerWeek,
  publishPrescription,
  type OwnerWeekItem,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { IconCheck } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Publicar">;

export function Publicar({ route }: Props) {
  const { token, accent, prescriptionId, personId, personName } = route.params;
  const [others, setOthers] = useState<OwnerWeekItem[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      const payload = await ownerWeek(token);
      setOthers(payload.items.filter((it) => it.person_id !== personId));
      setError("");
    } catch {
      setError("Não deu para abrir.");
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      if (done) return;
      void load();
    }, [load, done]),
  );

  async function publish() {
    if (busy) return;
    setBusy(true);
    try {
      const also = others
        .filter((it) => picked[it.person_id])
        .map((it) => it.person_id);
      await publishPrescription(token, prescriptionId, also);
      setDone(true);
      setError("");
    } catch {
      setError("Não deu para publicar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head
        kicker={personName}
        title="Publicar"
        kickerMuted
        accent={accent}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!done ? (
          <>
            {others.length > 0 ? (
              <>
                <View style={styles.section}>
                  <Text style={styles.kicker}>Também para</Text>
                </View>
                {others.map((row) => {
                  const on = Boolean(picked[row.person_id]);
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
                      <Text style={styles.name}>{row.name}</Text>
                    </Pressable>
                  );
                })}
              </>
            ) : null}

            <Band>
              <Text style={styles.copy}>
                A estrutura é a mesma. A carga é a de cada um.
              </Text>
            </Band>
          </>
        ) : null}
      </ScrollView>

      {!done ? (
        <DockFooter>
          <AccentCTA
            label="Publicar"
            onPress={() => void publish()}
            busy={busy}
            accent={accent}
          />
        </DockFooter>
      ) : null}

      {done ? (
        <View style={styles.overlay} pointerEvents="auto">
          <View style={[styles.sheet, { borderColor: accent }]}>
            <Text style={styles.sheetKicker}>No celular</Text>
            <Text style={styles.sheetTitle}>
              {personName} já vê no Hoje
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
  section: {
    paddingHorizontal: T.pad,
    paddingTop: 24,
    paddingBottom: 8,
  },
  kicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 24,
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
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  copy: {
    color: T.muted,
    fontSize: 15,
    lineHeight: 22,
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
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  sheetTitle: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 24,
    letterSpacing: -0.6,
    marginTop: 8,
  },
});
