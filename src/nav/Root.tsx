import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Person, Studio } from "../api";
import { Painel } from "../screens/owner/Painel";
import { Retorno } from "../screens/owner/Retorno";
import { ComoFazer } from "../screens/student/ComoFazer";
import { Descanso } from "../screens/student/Descanso";
import { Feito } from "../screens/student/Feito";
import { Ficha } from "../screens/student/Ficha";
import { Hoje } from "../screens/student/Hoje";
import { Perfil } from "../screens/student/Perfil";
import { Progresso } from "../screens/student/Progresso";
import { Recorde } from "../screens/student/Recorde";
import { Serie } from "../screens/student/Serie";
import { productTheme } from "../theme";
import type { RootStackParamList } from "./types";

export type { RootStackParamList } from "./types";

export type RootProps = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root({ token, person, studio, onLeave }: RootProps) {
  const owner = person.role === "owner";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: productTheme.bg },
        animation: "none",
        gestureEnabled: true,
      }}
    >
      {owner ? (
        <>
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
          <Stack.Screen
            name="Retorno"
            component={Retorno}
            options={{ animation: "slide_from_right" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Hoje">
            {() => (
              <Hoje token={token} person={person} studio={studio} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Ficha"
            component={Ficha}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="ComoFazer"
            component={ComoFazer}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Serie"
            component={Serie}
            options={{ animation: "slide_from_right", gestureEnabled: false }}
          />
          <Stack.Screen
            name="Descanso"
            component={Descanso}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="Feito"
            component={Feito}
            options={{ animation: "slide_from_right", gestureEnabled: false }}
          />
          <Stack.Screen
            name="Recorde"
            component={Recorde}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="Progresso">
            {() => (
              <Progresso token={token} person={person} studio={studio} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Perfil">
            {() => (
              <Perfil
                token={token}
                person={person}
                studio={studio}
                onLeave={onLeave}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
