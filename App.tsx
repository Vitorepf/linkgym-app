import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { productTheme } from "./src/theme";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>Convite</Text>
      <Text style={styles.title}>Entre com o código do seu personal.</Text>
      <Text style={styles.body}>
        Sem convite não há conta. Depois do login, a cara do app é a marca dele.
      </Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: productTheme.bg,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    color: productTheme.accentFallback,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "800",
    marginBottom: 12,
  },
  title: {
    color: productTheme.ink,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  body: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 14,
    lineHeight: 22,
  },
});
