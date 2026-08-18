import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FinishRecord } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { formatKg } from "../../offline/sessionQueue";
import { productTheme } from "../../theme";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Recorde">;

export function Recorde({ navigation, route }: Props) {
  const { accent, records, needsCommitment } = route.params;
  const row = records[0];
  const previous = olderLoad(row);

  return (
    <Screen kicker="Recorde" title={row?.exercise_name} accent={accent}>
      <View style={[styles.bar, { backgroundColor: accent }]} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {row ? (
          <>
            <Text
              style={[styles.load, { color: accent }]}
              accessibilityLabel={`${formatKg(row.load_kg)} quilos`}
            >
              {formatKg(row.load_kg)}
            </Text>
            <Text style={styles.unit}>kg</Text>
            {previous !== null ? (
              <Text style={styles.previous}>{formatKg(previous)} kg</Text>
            ) : null}
            <Text style={styles.copy}>O corpo lembra.</Text>
          </>
        ) : null}

        <PrimaryButton
          label="Seguir"
          onPress={() => {
            if (needsCommitment) {
              navigation.navigate("Compromisso");
              return;
            }
            navigation.reset({ index: 0, routes: [{ name: "Hoje" }] });
          }}
        />
      </ScrollView>
    </Screen>
  );
}

function olderLoad(row: FinishRecord | undefined): number | null {
  if (!row || !(row.previous_kg > 0) || row.previous_kg >= row.load_kg) {
    return null;
  }
  return row.previous_kg;
}

const styles = StyleSheet.create({
  bar: {
    height: 2,
    marginHorizontal: -24,
    marginBottom: 12,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  load: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 88,
    letterSpacing: -2,
    lineHeight: 92,
    fontVariant: ["tabular-nums"],
    marginTop: 8,
  },
  unit: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  previous: {
    color: productTheme.muted,
    fontSize: 22,
    marginTop: 12,
    textDecorationLine: "line-through",
  },
  copy: {
    color: productTheme.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 28,
  },
});
