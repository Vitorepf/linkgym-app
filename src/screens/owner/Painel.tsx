import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  applyOwnerAttention,
  ownerHome,
  type OwnerHome,
  type Person,
  type Studio,
} from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { Initials } from "../../ui/Initials";
import { Band, Head, Phone } from "../../ui/Screen";
import { weekdayLong } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

export function Painel({ token, person, studio, onLeave }: Props) {
  const navigation = useNavigation<OwnerTabNavigation>();
  const accent = studio.accent_color || T.accentFallback;
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

  const attention = data?.attention ?? [];
  const ratio =
    data && data.fio.prescribed > 0
      ? Math.min(1, data.fio.done / data.fio.prescribed)
      : 0;

  return (
    <Phone tab>
      <Head
        kicker={`${weekdayLong()} · ${data?.student_count ?? 0} alunos`}
        title={data?.greeting ?? `Bom dia, ${person.name}`}
        kickerMuted
        right={<Initials name={person.name} size={38} />}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {data ? (
          <Band>
            <Text style={[styles.kicker, { color: accent }]}>
              Treinos da semana
            </Text>
            <View style={styles.heroRow}>
              <Text style={styles.heroNum}>{data.fio.done}</Text>
              <Text style={styles.heroOf}>/ {data.fio.prescribed}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.trackFill,
                  { width: `${ratio * 100}%`, backgroundColor: accent },
                ]}
              />
              <View style={styles.trackMark} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaK}>{Math.round(ratio * 100)}% FEITO</Text>
              <Text style={styles.metaK}>
                META {data.fio.prescribed}
              </Text>
            </View>
            <View style={styles.stats}>
              <View>
                <Text style={styles.statN}>{data.student_count}</Text>
                <Text style={styles.statL}>ALUNOS</Text>
              </View>
              <View>
                <Text style={styles.statN}>{attention.length}</Text>
                <Text style={styles.statL}>PENDÊNCIAS</Text>
              </View>
              <View>
                <Text style={[styles.statN, { color: accent }]}>
                  {data.unread_returns}
                </Text>
                <Text style={styles.statL}>RETORNOS</Text>
              </View>
            </View>
          </Band>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={styles.kickerMuted}>
            {attention.length === 0
              ? "Nada pendente"
              : `${attention.length} ações de hoje`}
          </Text>
        </View>

        {attention.length === 0 && data ? (
          <Band>
            <Text style={styles.empty}>Pode voltar para a aula.</Text>
          </Band>
        ) : null}

        {attention.map((row, i) => (
          <Pressable
            key={row.id}
            onPress={() =>
              navigation.navigate("Aluna", {
                token,
                personId: row.person_id,
                studioName: studio.name,
                accent,
              })
            }
            style={[
              styles.action,
              i === attention.length - 1 && styles.actionLast,
            ]}
          >
            <Initials name={row.name} size={34} fill={i === 0} accent={accent} />
            <View style={styles.actionBody}>
              <Text style={styles.actionName}>
                {row.name} · {whyFor(row.reason)}
              </Text>
              <Text style={styles.actionWhy}>{row.decision}</Text>
            </View>
            <Pressable
              onPress={() => void apply(row.id)}
              disabled={busy === row.id}
              hitSlop={8}
            >
              <Text style={[styles.verb, { color: accent }]}>
                {verbFor(row.reason)}
              </Text>
            </Pressable>
          </Pressable>
        ))}

        {data ? (
          <Band>
            <View style={styles.rowBetween}>
              <Text style={styles.kickerMuted}>O fio da carteira</Text>
              <Text style={styles.metaK}>SEG A DOM</Text>
            </View>
            <View style={styles.fio}>
              {data.fio.week.map((d) => {
                const pct =
                  d.prescribed === 0 ? 0 : Math.min(1, d.done / d.prescribed);
                return (
                  <View key={d.for_date} style={styles.fioCol}>
                    <View style={styles.fioTrack}>
                      <View
                        style={[
                          styles.fioFill,
                          {
                            height: pct === 0 ? 0 : Math.max(4, pct * 76),
                            backgroundColor: accent,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            <Text style={styles.caption}>
              {data.fio.prescribed} prescritos · {data.fio.done} feitos
            </Text>
          </Band>
        ) : null}

        <Pressable
          onPress={() =>
            navigation.navigate("Retorno", {
              token,
              studioName: studio.name,
              accent,
            })
          }
          style={styles.linkRow}
        >
          <Text style={styles.link}>
            {data && data.unread_returns > 0
              ? `Retornos · ${data.unread_returns}`
              : "Retornos"}
          </Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("Atencao", {
              token,
              studioName: studio.name,
              accent,
            })
          }
          style={styles.linkRow}
        >
          <Text style={styles.link}>Atenção do dia</Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>
        <Pressable onPress={onLeave} style={styles.linkRow}>
          <Text style={styles.leave}>Sair</Text>
        </Pressable>
      </ScrollView>
    </Phone>
  );
}

function whyFor(reason: string): string {
  switch (reason) {
    case "student_stopped":
      return "parou de treinar";
    case "pain_flag":
      return "marcou dor";
    case "debut":
      return "estreia pendente";
    case "high_effort":
      return "última sessão difícil";
    default:
      return reason;
  }
}

function verbFor(reason: string): string {
  switch (reason) {
    case "student_stopped":
      return "CHAMAR";
    case "debut":
      return "MONTAR";
    case "pain_flag":
      return "VER";
    default:
      return "APLICAR";
  }
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 12,
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  kickerMuted: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 9,
    marginTop: 8,
  },
  heroNum: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 52,
    letterSpacing: -2.4,
    lineHeight: 52,
    fontVariant: ["tabular-nums"],
  },
  heroOf: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 22,
  },
  track: {
    height: 8,
    backgroundColor: T.fill,
    marginTop: 14,
    position: "relative",
  },
  trackFill: { height: 8 },
  trackMark: {
    position: "absolute",
    right: 0,
    top: -4,
    bottom: -4,
    width: 2,
    backgroundColor: T.ink,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaK: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  stats: {
    flexDirection: "row",
    gap: 18,
    marginTop: 16,
  },
  statN: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 17,
    fontVariant: ["tabular-nums"],
  },
  statL: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 0.9,
    marginTop: 2,
  },
  sectionHead: {
    paddingHorizontal: T.pad,
    paddingTop: 18,
    paddingBottom: 10,
  },
  empty: { color: T.muted, fontSize: 15, lineHeight: 22 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  actionLast: {
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  actionBody: { flex: 1, minWidth: 0 },
  actionName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  actionWhy: {
    color: T.muted,
    fontSize: 13,
    marginTop: 2,
  },
  verb: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  },
  fio: {
    flexDirection: "row",
    gap: 6,
    height: 80,
    alignItems: "flex-end",
    marginTop: 12,
  },
  fioCol: { flex: 1, height: 80, justifyContent: "flex-end" },
  fioTrack: {
    height: 80,
    borderWidth: 1,
    borderColor: "#4a4645",
    justifyContent: "flex-end",
  },
  fioFill: { width: "100%" },
  caption: {
    color: T.muted,
    fontSize: 13,
    marginTop: 10,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  link: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
  },
  chev: { color: T.muted2, fontSize: 18 },
  leave: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
