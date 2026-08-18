import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Person, Studio } from "../api";
import { productTheme } from "../theme";
import { Screen } from "../ui/Screen";

export type RootProps = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator();

export function Root({ person, studio, onLeave }: RootProps) {
  const accent = studio.accent_color || productTheme.accentFallback;
  const kicker = person.role === "owner" ? "Personal" : "Aluno";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: productTheme.bg },
        animation: "none",
      }}
    >
      <Stack.Screen name="Home">
        {() => (
          <Screen kicker={kicker} title={studio.name} accent={accent}>
            <Pressable onPress={onLeave} style={styles.leave}>
              <Text style={styles.leaveText}>Sair</Text>
            </Pressable>
          </Screen>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  leave: { marginTop: 40, alignSelf: "flex-start" },
  leaveText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
