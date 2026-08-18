import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Person, Studio } from "../api";
import { Painel } from "../screens/owner/Painel";
import { Hoje } from "../screens/student/Hoje";
import { productTheme } from "../theme";

export type RootProps = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator();

export function Root({ token, person, studio, onLeave }: RootProps) {
  const owner = person.role === "owner";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: productTheme.bg },
        animation: "none",
      }}
    >
      {owner ? (
        <Stack.Screen name="Painel">
          {() => (
            <Painel
              token={token}
              person={person}
              studio={studio}
              onLeave={onLeave}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Hoje">
          {() => (
            <Hoje
              token={token}
              person={person}
              studio={studio}
              onLeave={onLeave}
            />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
