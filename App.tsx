import { useFonts, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { logout, me, type Person, type Studio } from "./src/api";
import { Root } from "./src/nav/Root";
import { AccessScreen } from "./src/screens/Access";
import { clearToken, loadToken, saveToken } from "./src/session";
import { productTheme } from "./src/theme";

type Session = { token: string; person: Person; studio: Studio };

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: productTheme.bg,
    card: productTheme.bg,
    text: productTheme.ink,
    border: productTheme.divider,
    primary: productTheme.accentFallback,
  },
};

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
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          {session ? (
            <Root
              token={session.token}
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
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  boot: {
    flex: 1,
    backgroundColor: productTheme.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
