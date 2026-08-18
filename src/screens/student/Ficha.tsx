import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TodayItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";

type Props = NativeStackScreenProps<RootStackParamList, "Ficha">;

export function Ficha({ navigation, route }: Props) {
  const { items, studioName, accent } = route.params;
  const rows = [...items].sort((a, b) => a.position - b.position);

  return (
    <Screen kicker="Ficha" title={studioName} accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              navigation.navigate("ComoFazer", {
                item,
                studioName,
                accent,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.planned_sets} vezes ${item.planned_reps}, ${item.load_kg} kg`}
            style={styles.row}
          >
            <Text style={[styles.position, { color: accent }]}>
              {item.position}
            </Text>
            <View style={styles.rowBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.planned_sets} × {item.planned_reps} · {formatLoad(item)}
              </Text>
            </View>
          </Pressable>
        ))}

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.back}
          hitSlop={8}
        >
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function formatLoad(item: TodayItem): string {
  return `${item.load_kg} kg`;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    borderRadius: productTheme.radius,
  },
  position: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    minWidth: 20,
    marginTop: 2,
  },
  rowBody: { flex: 1 },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: "left",
  },
  meta: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 4,
    textAlign: "left",
  },
  back: { marginTop: "auto", paddingTop: 40, alignSelf: "flex-start" },
  backText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
