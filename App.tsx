import {
  Archivo_500Medium,
  Archivo_800ExtraBold,
  Archivo_900Black,
  useFonts,
} from "@expo-google-fonts/archivo";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Nunito_400Regular, Nunito_900Black } from "@expo-google-fonts/nunito";
import { Oswald_400Regular, Oswald_600SemiBold } from "@expo-google-fonts/oswald";
import { PlayfairDisplay_900Black } from "@expo-google-fonts/playfair-display";
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { aparenciaDoTime, logout, me, type MePayload } from "./src/api";
import { Root } from "./src/nav/Root";
import { AccessScreen } from "./src/screens/Access";
import {
  clearToken,
  loadAparencia,
  loadToken,
  saveAparencia,
  saveToken,
} from "./src/session";
import {
  criarTema,
  luminance,
  productTheme,
  type Aparencia,
  type Tema,
} from "./src/theme";
import { TemaDoTime, useTema } from "./src/ui/tema";

type Session = { token: string } & MePayload;

/** O tema da NAVEGAÇÃO segue a aparência do personal. Era constante de módulo lida uma
 *  vez no boot — com chão claro isso pintava de preto o vão entre duas telas, que é o
 *  tipo de defeito que só aparece na transição e ninguém consegue capturar. */
export function criarNavTheme(tema: Tema) {
  return {
    ...DarkTheme,
    // 0,18 é o mesmo limiar que accentOn usa para decidir se o acento clareia ou
    // escurece: um só número decide "este chão é escuro" no app inteiro.
    dark: luminance(tema.T.bg) < 0.18,
    colors: {
      ...DarkTheme.colors,
      background: tema.T.bg,
      card: tema.T.bg,
      text: tema.T.ink,
      border: tema.T.divider,
      primary: tema.primaria,
    },
  };
}

export const navTheme = criarNavTheme(criarTema());

export default function App() {
  // AS SEIS VOZES sobem juntas no boot. A alternativa — carregar só o par do personal
  // depois do /v1/me — trocaria bundle por uma tela de texto sem fonte em toda primeira
  // abertura, que é o defeito que este arquivo já pagou uma vez (D1).
  //
  // Os pacotes trazem 84 faces e o app carregava 10 — todas as dez apertadas na faixa 500
  // a 800, que é literalmente a razão de as seis vozes saírem parecidas. Estas treze
  // ocupam de 300Light a 900Black e incluem um itálico. Nenhuma dependência nova: cada
  // face já estava em disco dentro de um pacote que o app já instala.
  const [loaded] = useFonts({
    Archivo_500Medium,
    Archivo_800ExtraBold,
    Archivo_900Black,
    SpaceGrotesk_300Light,
    SpaceGrotesk_700Bold,
    PlayfairDisplay_900Black,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_600SemiBold,
    Inter_700Bold,
    Nunito_400Regular,
    Nunito_900Black,
    Oswald_400Regular,
    Oswald_600SemiBold,
  });
  const [boot, setBoot] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  // A aparência da ÚLTIMA sessão, lida do disco antes de qualquer rede. É ela que pinta o
  // boot e a porta: sem isso o estúdio de chão claro pisca preto em toda abertura, na tela
  // que ele vende como dele. Some assim que o /v1/me responde com a de verdade.
  const [guardada, setGuardada] = useState<Aparencia | null>(null);

  // A sessão manda; sem ela, o que ficou do disco; sem nada, o padrão de fábrica.
  const aparencia = session ? aparenciaDoTime(session.time) : guardada;

  useEffect(() => {
    let alive = true;
    (async () => {
      // Um único finally por cima de TUDO: nenhum caminho — nem o do cofre — deixa o
      // app parado no spinner.
      try {
        const anterior = await loadAparencia();
        if (alive && anterior) setGuardada(anterior as Aparencia);
        const token = await loadToken();
        if (!token) return;
        try {
          const mine = await me(token);
          if (alive) setSession({ token, ...mine });
          void saveAparencia(aparenciaDoTime(mine.time));
        } catch {
          await clearToken();
        }
      } finally {
        if (alive) setBoot(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!loaded || boot) {
    const inicial = criarTema(aparencia ?? undefined);
    return (
      <View style={[styles.boot, { backgroundColor: inicial.T.bg }]}>
        <ActivityIndicator color={inicial.acentoEm()} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <TemaDoTime aparencia={aparencia ?? aparenciaDoTime(undefined)}>
          <Casca>
          {session ? (
            <Root
              token={session.token}
              person={session.person}
              time={session.time}
              onboardingComplete={session.onboarding_complete}
              commitmentComplete={session.commitment_complete}
              debut={session.debut}
              onTimeChange={(next) => {
                setSession((s) => (s ? { ...s, time: next } : s));
                // A aparência nova vai para o disco no mesmo gesto: quem acabou de
                // escolher o chão claro não pode ver preto na próxima abertura.
                void saveAparencia(aparenciaDoTime(next));
              }}
              onPersonChange={(next) =>
                setSession((s) => (s ? { ...s, person: next } : s))
              }
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
                const mine = await me(next.token);
                setSession({ token: next.token, ...mine });
                void saveAparencia(aparenciaDoTime(mine.time));
              }}
            />
          )}
          </Casca>
        </TemaDoTime>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** A casca que lê o tema: NavigationContainer e barra de status são as duas coisas do
 *  sistema operacional que precisam saber a aparência, e as duas vivem ACIMA das telas. */
function Casca({ children }: { children: ReactNode }) {
  const tema = useTema();
  const nav = useMemo(() => criarNavTheme(tema), [tema]);
  return (
    <>
      <NavigationContainer theme={nav}>{children}</NavigationContainer>
      <StatusBar style={nav.dark ? "light" : "dark"} />
    </>
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
