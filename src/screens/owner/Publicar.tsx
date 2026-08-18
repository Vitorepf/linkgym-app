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
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

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
    <Screen title="Publicar" accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {done ? (
          <Text style={styles.done}>{`${personName} já vê no Hoje.`}</Text>
        ) : (
          <>
            {others.length > 0 ? (
              <>
                <Text style={styles.kicker}>Também para</Text>
                {others.map((row) => {
                  const on = Boolean(picked[row.person_id]);
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
                      <Text style={styles.name}>{row.name}</Text>
                    </Pressable>
                  );
                })}
              </>
            ) : null}
            <Text style={styles.copy}>
              A estrutura é a mesma. A carga é a de cada um.
            </Text>

            <PrimaryButton
              label="Publicar agora"
              onPress={() => void publish()}
              busy={busy}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
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
  kicker: {
    marginTop: 28,
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: productTheme.ink,
  },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  copy: {
    color: productTheme.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 20,
  },
});
