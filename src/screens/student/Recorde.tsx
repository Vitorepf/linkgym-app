import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FinishRecord } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { formatKg } from "../../offline/sessionQueue";
import { accentSet, FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { DockFooter, Phone } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Recorde">;

export function Recorde({ navigation, route }: Props) {
  const { accent, records, needsCommitment } = route.params;
  const A = accentSet(accent);
  const row = records[0];
  const previous = olderLoad(row);

  return (
    <Phone>
      {row ? (
        <View style={styles.hero}>
          <Text style={[styles.kicker, { color: A.text }]}>Recorde</Text>
          <Text
            style={styles.load}
            accessibilityLabel={`${formatKg(row.load_kg)} quilos`}
          >
            {formatKg(row.load_kg)}
          </Text>
          <Text style={styles.unit}>kg</Text>
          {previous !== null ? (
            <Text style={styles.previous}>{formatKg(previous)} kg</Text>
          ) : null}
          <Text style={styles.copy}>O corpo lembra.</Text>
        </View>
      ) : null}

      <View style={styles.grow} />

      <DockFooter>
        <AccentCTA
          label="Seguir"
          onPress={() => {
            if (needsCommitment) {
              navigation.navigate("Compromisso");
              return;
            }
            navigation.reset({
              index: 0,
              routes: [studentHomeTarget],
            });
          }}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

function olderLoad(row: FinishRecord | undefined): number | null {
  if (!row || !(row.previous_kg > 0) || row.previous_kg >= row.load_kg) {
    return null;
  }
  return row.previous_kg;
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: T.pad,
    paddingTop: 20,
    paddingBottom: 28,
  },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
    opacity: 0.8,
    textAlign: "left",
  },
  load: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 8,
    textAlign: "left",
  },
  unit: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 4,
    opacity: 0.75,
    textAlign: "left",
  },
  previous: {
    color: T.muted,
    fontSize: 22,
    marginTop: 12,
    textDecorationLine: "line-through",
    opacity: 0.55,
    textAlign: "left",
  },
  copy: {
    color: T.ink,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 28,
    opacity: 0.85,
    textAlign: "left",
  },
  grow: { flex: 1 },
});
