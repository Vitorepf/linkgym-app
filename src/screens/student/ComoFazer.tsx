import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { cuesFor } from "../../exerciseCues";
import type { RootStackParamList } from "../../nav/types";
import { productTheme } from "../../theme";
import { Screen } from "../../ui/Screen";
import { MaquinaOcupada } from "./MaquinaOcupada";

type Props = NativeStackScreenProps<RootStackParamList, "ComoFazer">;

export function ComoFazer({ navigation, route }: Props) {
  const { item, items, studioName, accent, token, prescriptionId } = route.params;
  const { cues, error } = cuesFor(item.name);
  const shown = cues.filter((cue) => cue.length > 0);
  const place = item.notes?.trim()
    ? item.notes.trim()
    : `Pergunte ao ${studioName}`;

  return (
    <Screen kicker="Como fazer" title={item.name} accent={accent}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.video}>
          <Text style={styles.videoText}>
            Vídeo ainda não está neste exercício
          </Text>
        </View>

        <Text style={styles.section}>Onde fica</Text>
        <Text style={styles.body}>{place}</Text>

        {shown.length > 0 ? (
          <View style={styles.cues}>
            {shown.map((cue, i) => (
              <View key={cue} style={styles.cueRow}>
                <Text style={[styles.cueIndex, { color: accent }]}>{i + 1}</Text>
                <Text style={styles.cue}>{cue}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {error ? (
          <>
            <Text style={styles.section}>Erro comum</Text>
            <Text style={styles.body}>{error}</Text>
          </>
        ) : null}

        <MaquinaOcupada
          token={token}
          studioName={studioName}
          accent={accent}
          prescriptionId={prescriptionId}
          from={item}
          items={items}
        />

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

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 32, flexGrow: 1 },
  video: {
    marginTop: 24,
    minHeight: 180,
    borderWidth: 2,
    borderColor: productTheme.divider,
    borderRadius: productTheme.radius,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  videoText: {
    color: productTheme.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 28,
    marginBottom: 10,
    textAlign: "left",
  },
  body: {
    color: productTheme.ink,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "left",
  },
  cues: { marginTop: 28 },
  cueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
  },
  cueIndex: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    minWidth: 16,
  },
  cue: {
    flex: 1,
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: -0.3,
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
