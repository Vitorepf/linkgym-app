import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TodayItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { formatKg } from "../../ui/format";
import { MaquinaOcupada } from "./MaquinaOcupada";

type Props = NativeStackScreenProps<RootStackParamList, "Ficha">;

export function Ficha({ navigation, route }: Props) {
  const { items, studioName, accent, token, prescriptionId } = route.params;
  return (
    <FichaBody
      token={token}
      studioName={studioName}
      accent={accent}
      items={items}
      prescriptionId={prescriptionId}
      onBack={() => navigation.goBack()}
    />
  );
}

export function FichaBody({
  token,
  studioName,
  accent,
  items,
  prescriptionId,
  error,
  tab,
  onBack,
}: {
  token: string;
  studioName: string;
  accent: string;
  items: TodayItem[];
  prescriptionId: string;
  error?: string;
  tab?: boolean;
  onBack?: () => void;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const ac = accent || T.accentFallback;
  const rows = [...items].sort((a, b) => a.position - b.position);

  return (
    <Phone tab={tab}>
      <Head kicker="Hoje" title="Minha ficha" kickerMuted />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {rows.length === 0 && !error ? (
          <Band>
            <Text style={styles.empty}>Ainda não tem ficha hoje.</Text>
          </Band>
        ) : null}
        {rows.map((item, i) => (
          <View
            key={item.id}
            style={[
              styles.row,
              i === 0 && {
                borderLeftWidth: 3,
                borderLeftColor: ac,
                backgroundColor: T.raised,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                if (!prescriptionId) return;
                navigation.navigate("ComoFazer", {
                  item,
                  items,
                  studioName,
                  accent: ac,
                  token,
                  prescriptionId,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${item.planned_sets} vezes ${item.planned_reps}, ${formatKg(item.load_kg)} kg`}
              style={styles.rowHit}
            >
              <View style={styles.rowBody}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.planned_sets} × {item.planned_reps} · {formatKg(item.load_kg)} kg
                  {item.rest_seconds ? ` · descanso ${item.rest_seconds}s` : ""}
                </Text>
              </View>
              {i === 0 ? (
                <Text style={[styles.now, { color: ac }]}>AGORA</Text>
              ) : null}
            </Pressable>
            {prescriptionId ? (
              <View style={styles.swap}>
                <MaquinaOcupada
                  token={token}
                  studioName={studioName}
                  accent={ac}
                  prescriptionId={prescriptionId}
                  from={item}
                  items={items}
                />
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
      {onBack ? (
        <DockFooter>
          <AccentCTA label="Voltar ao treino" onPress={onBack} accent={ac} />
        </DockFooter>
      ) : null}
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 24 },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 16,
  },
  empty: {
    color: T.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    paddingHorizontal: T.pad,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  rowHit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowBody: { flex: 1 },
  name: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  meta: {
    color: T.muted,
    fontSize: 13,
    marginTop: 3,
  },
  now: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  swap: { marginTop: 10 },
});
