import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { Person, Time } from "../api";
import { Atencao } from "../screens/owner/Atencao";
import { Aluna } from "../screens/owner/Aluna";
import { Ajustar } from "../screens/owner/Ajustar";
import { Aparencia } from "../screens/owner/Aparencia";
import { ComoFunciona } from "../screens/owner/ComoFunciona";
import { Combinado } from "../screens/owner/Combinado";
import { Convite } from "../screens/owner/Convite";
import { Modelo } from "../screens/owner/Modelo";
import { Modelos } from "../screens/owner/Modelos";
import { NovaModelo } from "../screens/owner/NovaModelo";
import { PerfilTime } from "../screens/owner/PerfilTime";
import { Produtos } from "../screens/owner/Produtos";
import { Base } from "../screens/owner/Base";
import { Turma } from "../screens/owner/Turma";
import { Publicar } from "../screens/owner/Publicar";
import { Revisao } from "../screens/owner/Revisao";
import { Retorno } from "../screens/owner/Retorno";
import { ComoFazer } from "../screens/student/ComoFazer";
import { Compromisso } from "../screens/student/Compromisso";
import { Descanso } from "../screens/student/Descanso";
import { Estreia, estreiaSeenKey } from "../screens/student/Estreia";
import { Feito } from "../screens/student/Feito";
import { Ficha } from "../screens/student/Ficha";
import { Pronto } from "../screens/student/Pronto";
import { Recorde } from "../screens/student/Recorde";
import { Serie } from "../screens/student/Serie";
import { SobreVoce } from "../screens/student/SobreVoce";
import { estilos, useTema } from "../ui/tema";
import { OWNER_HOME_ROUTE, OwnerTabs } from "./OwnerTabs";
import { studentHomeTarget, STUDENT_HOME_ROUTE, StudentTabs } from "./StudentTabs";
import type { RootStackParamList } from "./types";

export type { RootStackParamList } from "./types";

export type RootProps = {
  token: string;
  person: Person;
  time: Time;
  onboardingComplete: boolean;
  commitmentComplete: boolean;
  debut: boolean;
  onTimeChange: (next: Time) => void;
  onPersonChange: (next: Person) => void;
  onLeave: () => void;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root({
  token,
  person,
  time,
  onboardingComplete,
  commitmentComplete,
  debut,
  onTimeChange,
  onPersonChange,
  onLeave,
}: RootProps) {
  const styles = usarEstilos();
  const { T, acentoEm } = useTema();
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
  // A Retomada NAO decide mais rota. Ela era uma tela desta pilha, e para saber se
  // apareceria o Root chamava /v1/today aqui — a Hoje entao chamava de novo, dois
  // requests no boot para desenhar um deles. Agora a faixa mora dentro da Hoje e usa o
  // payload que a Hoje ja tem, entao esta camada nao precisa mais esperar por rede
  // nenhuma: o unico portao que sobrou e o da Estreia, que le disco.
  useEffect(() => {
    if (owner) {
      setShowEstreia(false);
      return;
    }
    if (needsOnboarding) {
      setShowEstreia(null);
      return;
    }
    let alive = true;
    (async () => {
      const seen = await AsyncStorage.getItem(estreiaSeenKey(time.id));
      if (alive) setShowEstreia(Boolean(debut && !seen));
    })();
    return () => {
      alive = false;
    };
  }, [debut, time.id, owner, needsOnboarding]);

  if (!owner && !needsOnboarding && showEstreia === null) {
    return (
      <View style={styles.boot}>
        {/* Sem argumento de propósito: o acento do personal já É o tema desta sessão.
            Repassar `time.accent_color` aqui, além de redundante, é o vazamento que
            tools/contrast.mjs acusa — cor crua entrando numa propriedade de cor. */}
        <ActivityIndicator color={acentoEm()} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: T.bg },
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
                time={time}
                onSent={() => navigation.navigate("Pronto")}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Pronto">
            {() => (
              <Pronto
                token={token}
                person={person}
                time={time}
                onContinue={() => setNeedsOnboarding(false)}
              />
            )}
          </Stack.Screen>
        </>
      ) : owner ? (
        <>
          <Stack.Screen name={OWNER_HOME_ROUTE}>
            {() => (
              <OwnerTabs
                token={token}
                person={person}
                time={time}
                onTimeChange={onTimeChange}
                onLeave={onLeave}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Retorno" options={{ animation: "slide_from_right" }}>
            {({ navigation, route }) => (
              <Retorno navigation={navigation} route={route} time={time} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Atencao"
            component={Atencao}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="Convite" options={{ animation: "slide_from_right" }}>
            {() => <Convite token={token} time={time} />}
          </Stack.Screen>
          <Stack.Screen name="PerfilTime" options={{ animation: "slide_from_right" }}>
            {() => (
              <PerfilTime
                token={token}
                time={time}
                onTimeChange={onTimeChange}
                onLeave={onLeave}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Alunos" options={{ animation: "slide_from_right" }}>
            {() => <Turma token={token} timeName={time.name} />}
          </Stack.Screen>
          <Stack.Screen name="Modelos" options={{ animation: "slide_from_right" }}>
            {() => <Modelos token={token} timeName={time.name} />}
          </Stack.Screen>
          <Stack.Screen name="Modelo" options={{ animation: "slide_from_right" }}>
            {({ route }) => <Modelo {...route.params} />}
          </Stack.Screen>
          <Stack.Screen name="NovaModelo" options={{ animation: "slide_from_right" }}>
            {({ route }) => <NovaModelo {...route.params} />}
          </Stack.Screen>
          <Stack.Screen name="Aparencia" options={{ animation: "slide_from_right" }}>
            {() => (
              <Aparencia token={token} time={time} onTimeChange={onTimeChange} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ComoFunciona" options={{ animation: "slide_from_right" }}>
            {() => (
              <ComoFunciona token={token} time={time} onTimeChange={onTimeChange} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Revisao" options={{ animation: "slide_from_right" }}>
            {({ route }) => <Revisao {...route.params} />}
          </Stack.Screen>
          <Stack.Screen
            name="Aluna"
            component={Aluna}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="Combinado" options={{ animation: "slide_from_right" }}>
            {({ route }) => <Combinado {...route.params} />}
          </Stack.Screen>
          <Stack.Screen name="Produtos" options={{ animation: "slide_from_right" }}>
            {({ route }) => <Produtos {...route.params} />}
          </Stack.Screen>
          <Stack.Screen name="Base" options={{ animation: "slide_from_right" }}>
            {({ route }) => <Base {...route.params} />}
          </Stack.Screen>
          <Stack.Screen name="Ajustar" options={{ animation: "slide_from_right" }}>
            {({ navigation, route }) => (
              <Ajustar
                navigation={navigation}
                route={route}
                time={time}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Publicar"
            component={Publicar}
            options={{ animation: "slide_from_right" }}
          />
        </>
      ) : (
        <>
          {showEstreia ? (
            <Stack.Screen name="Estreia">
              {() => (
                <Estreia
                  token={token}
                  time={time}
                  needsCommitment={needsCommitment}
                />
              )}
            </Stack.Screen>
          ) : null}
          <Stack.Screen name={STUDENT_HOME_ROUTE}>
            {() => (
              <StudentTabs
                token={token}
                person={person}
                time={time}
                needsCommitment={needsCommitment}
                onPersonChange={onPersonChange}
                onLeave={onLeave}
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
                time={time}
                onDone={() => {
                  setNeedsCommitment(false);
                  navigation.reset({
                    index: 0,
                    routes: [studentHomeTarget],
                  });
                }}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}

const usarEstilos = estilos(({ T }) =>
  StyleSheet.create({
    boot: {
      flex: 1,
      backgroundColor: T.bg,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);
