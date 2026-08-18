import { useFonts, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { logout, me, type Person, type Studio } from "./src/api";
import { AccessScreen } from "./src/screens/Access";
import { StudioHome } from "./src/screens/StudioHome";
import { clearToken, loadToken, saveToken } from "./src/session";
import { productTheme } from "./src/theme";

type Session = { token: string; person: Person; studio: Studio };

export default function App() {
  const [loaded] = useFonts({ Archivo_800ExtraBold });
  const [boot, setBoot] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const token = await loadToken();
      if (!token) {
        if (alive) setBoot(false);
        return;
      }
      try {
        const mine = await me(token);
        if (alive) setSession({ token, ...mine });
      } catch {
        await clearToken();
      } finally {
        if (alive) setBoot(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded || boot) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={productTheme.accentFallback} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {session ? (
        <StudioHome
          person={session.person}
          studio={session.studio}
          onLeave={async () => {
            try {
              await logout(session.token);
            } catch {
              /* still leave */
            }
            await clearToken();
            setSession(null);
          }}
        />
      ) : (
        <AccessScreen
          onEntered={async (next) => {
            await saveToken(next.token);
            setSession(next);
          }}
        />
      )}
      <StatusBar style="light" />
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
});
