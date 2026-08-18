import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { cuesFor } from "../../exerciseCues";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
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
    <Phone>
      <Head kicker="Como fazer" title={item.name} accent={accent} />
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

        <Band>
          <Text style={styles.section}>Onde fica</Text>
          <Text style={styles.body}>{place}</Text>
        </Band>

        {shown.length > 0
          ? shown.map((cue, i) => (
              <View key={cue} style={styles.cueRow}>
                <Text style={[styles.cueIndex, { color: accent }]}>{i + 1}</Text>
                <Text style={styles.cue}>{cue}</Text>
              </View>
            ))
          : null}

        {error ? (
          <Band>
            <Text style={styles.section}>Erro comum</Text>
            <Text style={styles.body}>{error}</Text>
          </Band>
        ) : null}

        <Band rule="none">
          <MaquinaOcupada
            token={token}
            studioName={studioName}
            accent={accent}
            prescriptionId={prescriptionId}
            from={item}
            items={items}
          />
        </Band>
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Entendi"
          onPress={() => navigation.goBack()}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 8, flexGrow: 1 },
  video: {
    aspectRatio: 16 / 9,
    backgroundColor: T.bg,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: T.pad,
  },
  videoText: {
    color: T.muted,
    fontSize: 15,
    textAlign: "left",
    alignSelf: "stretch",
    lineHeight: 22,
  },
  section: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  body: {
    color: T.ink,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 10,
    textAlign: "left",
  },
  cueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: T.pad,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  cueIndex: {
    fontFamily: FONT,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    minWidth: 16,
  },
  cue: {
    flex: 1,
    color: T.ink,
    fontFamily: FONT,
    fontSize: 18,
    letterSpacing: -0.3,
    textAlign: "left",
  },
});
