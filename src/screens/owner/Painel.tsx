import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  applyOwnerAttention,
  ownerHome,
  type OwnerHome,
  type Person,
  type Studio,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function Painel({ token, person, studio, onLeave }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Painel">>();
  const accent = studio.accent_color || productTheme.accentFallback;
  const [data, setData] = useState<OwnerHome | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    const payload = await ownerHome(token);
    setData(payload);
    setError("");
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await ownerHome(token);
        if (alive) {
          setData(payload);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o painel.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  async function apply(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await applyOwnerAttention(token, id);
      await refresh();
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  const count = data?.student_count ?? 0;
  const weekday = WEEKDAYS[new Date().getDay()];
  const kicker = `${weekday} · ${count} alunos`;
  const title = data?.greeting ?? `Bom dia, ${person.name}`;
  const attention = data?.attention ?? [];
  const empty = data !== null && attention.length === 0;

  return (
    <Screen kicker={kicker} title={title} accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {empty ? (
          <Text style={styles.empty}>Nada pendente. Pode voltar para a aula.</Text>
        ) : null}

        {attention.map((row) => (
          <View key={row.id} style={styles.row}>
            <View style={[styles.initials, { borderColor: accent }]}>
              <Text style={[styles.initialsText, { color: accent }]}>
                {initials(row.name)}
              </Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.name}>{row.name}</Text>
              <Text style={styles.why}>{whyFor(row.reason)}</Text>
              <Text style={styles.decision}>{row.decision}</Text>
            </View>
            <Pressable
              style={styles.apply}
              onPress={() => void apply(row.id)}
              disabled={busy === row.id}
            >
              <Text style={styles.applyText}>Aplicar</Text>
            </Pressable>
          </View>
        ))}

        {data ? (
          <View style={styles.fio}>
            <View style={styles.bars}>
              {data.fio.week.map((d) => {
                const pct =
                  d.prescribed === 0 ? 0 : Math.min(1, d.done / d.prescribed);
                return (
                  <View key={d.for_date} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: pct === 0 ? 0 : Math.max(4, pct * 52),
                            backgroundColor: accent,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            <Text style={styles.fioCaption}>
              {data.fio.done} feitos · {data.fio.prescribed} prescritos
            </Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            onPress={() =>
              navigation.navigate("Retorno", {
                token,
                studioName: studio.name,
                accent,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.footerLink}>
              {data && data.unread_returns > 0
                ? `Retornos · ${data.unread_returns}`
                : "Retornos"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("Atencao", {
                token,
                studioName: studio.name,
                accent,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.footerLink}>Atenção do dia</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("Revisao", {
                token,
                studioName: studio.name,
                accent,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.footerLink}>Revisão da semana</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("Base", {
                token,
                studioName: studio.name,
                accent,
              })
            }
            hitSlop={8}
          >
            <Text style={styles.footerLink}>Nova ficha</Text>
          </Pressable>
        </View>

        <Pressable onPress={onLeave} style={styles.leave} hitSlop={8}>
          <Text style={styles.leaveText}>Sair</Text>
        </Pressable>
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

function whyFor(reason: string): string {
  switch (reason) {
    case "student_stopped":
      return "Parou de treinar";
    case "pain_flag":
      return "Marcou dor no onboarding";
    case "debut":
      return "Ainda não fez a estreia";
    case "high_effort":
      return "Última sessão difícil";
    default:
      return reason;
  }
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  empty: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 20,
    lineHeight: 22,
  },
  error: {
    color: productTheme.accentFallback,
    fontSize: 14,
    marginTop: 12,
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
  why: { color: productTheme.muted, fontSize: 14, marginTop: 4 },
  decision: {
    color: productTheme.ink,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  apply: {
    backgroundColor: productTheme.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  applyText: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  fio: { marginTop: 36 },
  bars: { flexDirection: "row", gap: 8, height: 56, alignItems: "flex-end" },
  barCol: { flex: 1, height: 56, justifyContent: "flex-end" },
  barTrack: {
    height: 56,
    borderWidth: 2,
    borderColor: productTheme.divider,
    justifyContent: "flex-end",
  },
  barFill: { width: "100%" },
  fioCaption: {
    color: productTheme.muted,
    fontSize: 13,
    marginTop: 12,
  },
  footer: {
    marginTop: 40,
    gap: 14,
  },
  footerLink: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  leave: { marginTop: 32, alignSelf: "flex-start" },
  leaveText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
