import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
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
import { Pronto } from "../screens/student/Pronto";
import { Recorde } from "../screens/student/Recorde";
import { Serie } from "../screens/student/Serie";
import { SobreVoce } from "../screens/student/SobreVoce";
import { productTheme } from "../theme";
import type { RootStackParamList } from "./types";

export type { RootStackParamList } from "./types";

export type RootProps = {
  token: string;
  person: Person;
  studio: Studio;
  onboardingComplete: boolean;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root({
  token,
  person,
  studio,
  onboardingComplete,
  onLeave,
}: RootProps) {
  const owner = person.role === "owner";
  const [needsOnboarding, setNeedsOnboarding] = useState(
    () => !owner && !onboardingComplete,
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: productTheme.bg },
        animation: "none",
        gestureEnabled: true,
      }}
    >
      {needsOnboarding ? (
        <>
          <Stack.Screen name="SobreVoce">
            {({ navigation }) => (
              <SobreVoce
                token={token}
                studio={studio}
                onSent={() => navigation.navigate("Pronto")}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Pronto">
            {() => (
              <Pronto
                token={token}
                person={person}
                studio={studio}
                onContinue={() => setNeedsOnboarding(false)}
              />
            )}
          </Stack.Screen>
        </>
      ) : owner ? (
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
