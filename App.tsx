import { useFonts, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { productTheme } from "./src/theme";

export default function App() {
  const [loaded] = useFonts({ Archivo_800ExtraBold });

  if (!loaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={productTheme.accentFallback} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.kicker}>Convite</Text>
        <Text style={styles.title}>Entre com o código do seu personal.</Text>
        <Text style={styles.body}>
          Sem convite não há conta. Depois do login, a cara do app é a marca
          dele.
        </Text>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: productTheme.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: productTheme.bg,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    color: productTheme.accentFallback,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
  },
  body: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 14,
    lineHeight: 22,
  },
});
