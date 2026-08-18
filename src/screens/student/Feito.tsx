import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { formatKg } from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

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
  } = route.params;

  return (
    <Screen kicker={studioName} accent={accent}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>Ofensiva</Text>
        <Text
          style={[styles.streak, { color: accent }]}
          accessibilityLabel={`Ofensiva ${streakCount}`}
        >
          {streakCount}
        </Text>

        <Text style={styles.xp}>+{xpGained} XP</Text>
        <Text style={styles.total}>{xpTotal} XP</Text>

        {pending ? (
          <Text style={styles.pending}>
            Sessão neste celular. Sobe quando tiver rede.
          </Text>
        ) : null}

        {records.length > 0 ? (
          <View style={styles.records}>
            <Text style={styles.recordKicker}>Recorde</Text>
            {records.map((row) => (
              <View key={row.exercise_name} style={styles.recordRow}>
                <Text style={styles.recordName}>{row.exercise_name}</Text>
                <Text style={styles.recordKg}>
                  {formatKg(row.load_kg)} kg
                </Text>
                {row.previous_kg > 0 ? (
                  <Text style={styles.previous}>
                    {formatKg(row.previous_kg)} kg
                  </Text>
                ) : (
                  <Text style={styles.first}>Primeiro registro</Text>
                )}
              </View>
            ))}
            <Pressable
              onPress={() => navigation.navigate("Recorde", { accent, records })}
              style={styles.recordeLink}
              hitSlop={8}
            >
              <Text style={styles.recordeLinkText}>Recorde</Text>
            </Pressable>
          </View>
        ) : null}

        <PrimaryButton
          label="Seguir"
          onPress={() => {
            if (records.length > 0) {
              navigation.navigate("Recorde", { accent, records });
              return;
            }
            navigation.reset({ index: 0, routes: [{ name: "Hoje" }] });
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 2,
    marginHorizontal: -24,
    marginBottom: 20,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  kicker: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  streak: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  xp: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  total: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 4,
  },
  pending: {
    color: productTheme.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: productTheme.divider,
  },
  records: {
    marginTop: 32,
    borderTopWidth: 2,
    borderColor: productTheme.divider,
  },
  recordKicker: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
  },
  recordRow: {
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  recordName: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
  },
  recordKg: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  previous: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 4,
    textDecorationLine: "line-through",
  },
  first: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 4,
  },
  recordeLink: { marginTop: 16, alignSelf: "flex-start" },
  recordeLinkText: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
