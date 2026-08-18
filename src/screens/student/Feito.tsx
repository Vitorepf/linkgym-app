import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { formatKg } from "../../offline/sessionQueue";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Phone } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Feito">;

export function Feito({ navigation, route }: Props) {
  const {
    studioName,
    accent,
    streakCount,
    xpGained,
    xpTotal,
    records,
    pending,
    needsCommitment,
  } = route.params;

  function follow() {
    if (records.length > 0) {
      navigation.navigate("Recorde", {
        accent,
        records,
        needsCommitment,
      });
      return;
    }
    if (needsCommitment) {
      navigation.navigate("Compromisso");
      return;
    }
    navigation.reset({
      index: 0,
      routes: [studentHomeTarget],
    });
  }

  return (
    <Phone>
      <View style={[styles.hero, { backgroundColor: accent }]}>
        <Text style={styles.heroKicker}>Ofensiva mantida</Text>
        <Text style={styles.heroNum}>{streakCount}</Text>
        <Text style={styles.heroSub}>
          {streakCount === 1 ? "treino" : "treinos"} na sequência
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MetricGrid
          cells={[
            { label: "XP hoje", value: `+${xpGained}` },
            { label: "XP total", value: xpTotal.toLocaleString("pt-BR") },
          ]}
        />

        {records.length > 0 ? (
          <Band raised accentTop accent={accent}>
            <Text style={[styles.kicker, { color: accent }]}>
              {records.length} recorde{records.length === 1 ? "" : "s"}
            </Text>
            {records.map((row) => (
              <View key={row.exercise_name} style={styles.prRow}>
                <Text style={styles.prName}>{row.exercise_name}</Text>
                <Text style={styles.prKg}>
                  {formatKg(row.load_kg).replace(".", ",")} kg
                </Text>
              </View>
            ))}
          </Band>
        ) : null}

        {pending ? (
          <Band>
            <Text style={styles.caption}>
              Sessão neste celular. Sobe quando tiver rede.
            </Text>
          </Band>
        ) : (
          <Band rule="hair">
            <View style={styles.okRow}>
              <View style={[styles.tick, { backgroundColor: accent }]}>
                <Text style={styles.tickMark}>✓</Text>
              </View>
              <Text style={styles.caption}>
                {studioName} já recebeu o resultado
              </Text>
            </View>
          </Band>
        )}
      </ScrollView>

      <DockFooter>
        <AccentCTA
          label={
            records.length > 0 ? "Ver seu recorde de hoje" : "Seguir"
          }
          onPress={follow}
          accent={accent}
        />
        {records.length > 0 ? (
          <Pressable onPress={follow} style={styles.ghost}>
            <Text style={styles.ghostText}>Seguir</Text>
          </Pressable>
        ) : null}
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: T.pad,
    paddingTop: 20,
    paddingBottom: 22,
  },
  heroKicker: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  heroNum: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 64,
    letterSpacing: -3.2,
    lineHeight: 62,
    marginTop: 6,
  },
  heroSub: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 14,
    marginTop: 8,
  },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  prRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  prName: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  prKg: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  okRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tick: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tickMark: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 12,
  },
  caption: {
    color: T.muted,
    fontSize: 13,
    flex: 1,
  },
  ghost: { paddingTop: 14 },
  ghostText: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
