import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Person, Studio } from "../api";

type Props = {
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

export function StudioHome({ person, studio, onLeave }: Props) {
  const accent = studio.accent_color || "#ec3013";
  return (
    <View style={styles.screen}>
      <Text style={[styles.kicker, { color: accent }]}>
        {person.role === "owner" ? "Personal" : "Aluno"}
      </Text>
      <Text style={styles.title}>{studio.name || "Seu time"}</Text>
      <Text style={styles.body}>{person.name}</Text>
      <Pressable onPress={onLeave} style={styles.leave}>
        <Text style={styles.leaveText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b0a0a",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: "#f3f2f2",
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 36,
    letterSpacing: -0.8,
  },
  body: { color: "#9b9797", fontSize: 16, marginTop: 12 },
  leave: { marginTop: 40, alignSelf: "flex-start" },
  leaveText: {
    color: "#9b9797",
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
