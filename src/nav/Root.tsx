import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { Person, Studio, TodayPayload } from "../api";
import { today } from "../api";
import { Painel } from "../screens/owner/Painel";
import { Atencao } from "../screens/owner/Atencao";
import { Retorno } from "../screens/owner/Retorno";
import { ComoFazer } from "../screens/student/ComoFazer";
import { Compromisso } from "../screens/student/Compromisso";
import { Descanso } from "../screens/student/Descanso";
import { Estreia, estreiaSeenKey } from "../screens/student/Estreia";
import { Feito } from "../screens/student/Feito";
import { Ficha } from "../screens/student/Ficha";
import { Hoje } from "../screens/student/Hoje";
import { Perfil } from "../screens/student/Perfil";
import { Progresso } from "../screens/student/Progresso";
import { Pronto } from "../screens/student/Pronto";
import { Recorde } from "../screens/student/Recorde";
import { Retomada } from "../screens/student/Retomada";
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
  commitmentComplete: boolean;
  debut: boolean;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root({
  token,
  person,
  studio,
  onboardingComplete,
  commitmentComplete,
  debut,
  onLeave,
}: RootProps) {
  const owner = person.role === "owner";
  const [needsOnboarding, setNeedsOnboarding] = useState(
    () => !owner && !onboardingComplete,
  );
  const [needsCommitment, setNeedsCommitment] = useState(
    () => !owner && !commitmentComplete,
  );
  const [showEstreia, setShowEstreia] = useState<boolean | null>(
    owner ? false : null,
  );
  const [comeback, setComeback] = useState<
    TodayPayload["comeback"] | undefined
  >(owner ? null : undefined);

  useEffect(() => {
    if (owner) {
      setShowEstreia(false);
      setComeback(null);
      return;
    }
    if (needsOnboarding) {
      setShowEstreia(null);
      setComeback(undefined);
      return;
    }
    let alive = true;
    (async () => {
      const seen = await AsyncStorage.getItem(estreiaSeenKey(studio.id));
      if (alive) setShowEstreia(Boolean(debut && !seen));
    })();
    (async () => {
      try {
        const payload = await today(token);
        if (alive) setComeback(payload.comeback);
      } catch {
        if (alive) setComeback(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [debut, studio.id, owner, needsOnboarding, token]);

  if (
    !owner &&
    !needsOnboarding &&
    (showEstreia === null || comeback === undefined)
  ) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator
          color={studio.accent_color || productTheme.accentFallback}
        />
      </View>
    );
  }

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
          <Stack.Screen
            name="Atencao"
            component={Atencao}
            options={{ animation: "slide_from_right" }}
          />
        </>
      ) : (
        <>
          {comeback ? (
            <Stack.Screen name="Retomada">
              {() => (
                <Retomada
                  token={token}
                  person={person}
                  studio={studio}
                  needsCommitment={needsCommitment}
                  comeback={comeback}
                />
              )}
            </Stack.Screen>
          ) : showEstreia ? (
            <Stack.Screen name="Estreia">
              {() => (
                <Estreia
                  token={token}
                  studio={studio}
                  needsCommitment={needsCommitment}
                />
              )}
            </Stack.Screen>
          ) : null}
          <Stack.Screen name="Hoje">
            {() => (
              <Hoje
                token={token}
                person={person}
                studio={studio}
                needsCommitment={needsCommitment}
              />
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
          <Stack.Screen name="Compromisso">
            {({ navigation }) => (
              <Compromisso
                token={token}
                studio={studio}
                onDone={() => {
                  setNeedsCommitment(false);
                  navigation.reset({ index: 0, routes: [{ name: "Hoje" }] });
                }}
              />
            )}
          </Stack.Screen>
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

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: productTheme.bg,
    alignItems: "center",
    justifyContent: "center",
  },
});
