// Host de screenshot: monta o app REAL (Root dentro de NavigationContainer), roteia pela
// prop initialState e serve rede/relógio/aleatoriedade congelados. Cada carga de página é
// um estado limpo — nada vaza entre telas porque cada tela é uma página nova.
// Só entra no bundle quando EXPO_PUBLIC_SHOT está setada (ver index.ts).
import { Archivo_800ExtraBold, useFonts } from "@expo-google-fonts/archivo";
import { NavigationContainer } from "@react-navigation/native";
import { Component, useEffect, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App, { navTheme } from "../App";
import { Root } from "../src/nav/Root";
import { Criacao } from "../src/screens/student/Criacao";
import { MaquinaOcupada } from "../src/screens/student/MaquinaOcupada";
import { productTheme as T } from "../src/theme";
import { Phone } from "../src/ui/Screen";
import { brand } from "./brands.mjs";
import {
  ALUNA,
  apiRoutes,
  directProps,
  FIXTURES,
  params,
  PERSONAL,
  TOKEN,
  type Fixture,
} from "./fixtures";

type ShotState = {
  screen: string;
  brand: number;
  calls: number;
  misses: string[];
  error: string;
};

const qs = new URLSearchParams(globalThis.location?.search ?? "");
const SCREEN = qs.get("screen") ?? "Hoje";
const BRAND = Number(qs.get("brand") ?? 0);

const state: ShotState = { screen: SCREEN, brand: BRAND, calls: 0, misses: [], error: "" };
(globalThis as unknown as { __shot: ShotState }).__shot = state;

// ---- relógio e aleatoriedade congelados: o shot tem que ser bit-idêntico entre rodadas.
const FROZEN = Date.parse("2026-08-18T14:00:00.000Z");
const RealDate = Date;
class FrozenDate extends RealDate {
  constructor(...args: ConstructorParameters<typeof Date> | []) {
    // @ts-expect-error repassa a assinatura variádica do Date real
    super(...(args.length ? args : [FROZEN]));
  }
  static now() {
    return FROZEN;
  }
}
globalThis.Date = FrozenDate as unknown as DateConstructor;

let seed = 0x9e3779b9;
Math.random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

let uuid = 0;
if (globalThis.crypto) {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    configurable: true,
    value: () => {
      uuid += 1;
      return `00000000-0000-4000-8000-${String(uuid).padStart(12, "0")}` as `${string}-${string}-${string}-${string}-${string}`;
    },
  });
}

// AsyncStorage no web é localStorage e é do ORIGEM, não da página: sem isto a Estreia
// "já vista" e a sessão offline vazariam de um shot para o próximo.
globalThis.localStorage?.clear();

// ---- rede determinística, instalada ANTES de montar.
const FX: Fixture = FIXTURES[SCREEN] ?? {};
const B = brand(BRAND);
const STUDIO = { id: "t-shot", name: B.name, accent_color: B.accent };
const ROUTES = apiRoutes(STUDIO, FX.api);
const realFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const path = url.replace(/^\w+:\/\/[^/]+/, "").split("?")[0];
  if (!path.startsWith("/v1")) return realFetch(input as RequestInfo, init);
  state.calls += 1;
  const hit = ROUTES.find(([re]) => re.test(path));
  if (!hit) {
    state.misses.push(`${init?.method ?? "GET"} ${path}`);
    return new Response(JSON.stringify({ error: "sem_fixture" }), {
      status: 599,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(hit[1]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) as typeof fetch;

// ---- rotas
const OWNER_TABS = ["Painel", "Semana", "Fichas"];
const STUDENT_TABS = ["Hoje", "MinhaFicha", "Progresso", "Perfil"];

function initialState() {
  if (FX.tab) {
    const owner = FX.role === "owner";
    const tabs = owner ? OWNER_TABS : STUDENT_TABS;
    const index = Math.max(0, tabs.indexOf(FX.tab));
    return {
      index: 0,
      routes: [
        {
          name: owner ? "Painel" : "Hoje",
          state: { index, routes: tabs.map((name) => ({ name })) },
        },
      ],
    };
  }
  if (!FX.route) return undefined;
  return {
    index: 0,
    routes: [{ name: FX.route.name, params: params(FX.route.name, STUDIO) }],
  };
}

class Boundary extends Component<{ children: ReactNode }, { err: string }> {
  state = { err: "" };
  static getDerivedStateFromError(err: unknown) {
    return { err: err instanceof Error ? `${err.message}\n${err.stack ?? ""}` : String(err) };
  }
  componentDidCatch(err: unknown) {
    state.error = err instanceof Error ? err.message : String(err);
    signal("error");
  }
  render() {
    if (this.state.err) {
      return (
        <View style={styles.err}>
          <Text style={styles.errText}>{this.state.err}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function signal(value: string) {
  globalThis.document?.documentElement.setAttribute("data-shot", value);
}

const frame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Sinaliza pronto quando a fonte carregou e a rede assentou (duas passadas de frame sem
 * fetch novo). Nada de timeout arbitrário; se travar, sinaliza "stuck" e o gate reprova.
 */
function useSettle(fontsLoaded: boolean) {
  useEffect(() => {
    if (!fontsLoaded) return;
    let alive = true;
    (async () => {
      await globalThis.document?.fonts?.ready;
      for (let i = 0; i < 400; i += 1) {
        const before = state.calls;
        await frame();
        if (!alive) return;
        if (state.calls === before) {
          if (globalThis.document?.documentElement.getAttribute("data-shot") !== "error") {
            signal("ready");
          }
          return;
        }
      }
      if (alive) signal("stuck");
    })();
    return () => {
      alive = false;
    };
  }, [fontsLoaded]);
}

export function ShotHost() {
  const [loaded] = useFonts({ Archivo_800ExtraBold });
  useSettle(loaded);

  if (!loaded) return <View style={styles.blank} />;

  // Porta de entrada: o App inteiro, com sua própria decisão de boot.
  if (FX.direct === "App") {
    return (
      <Boundary>
        <App />
      </Boundary>
    );
  }

  if (FX.direct) {
    const props = directProps(FX.direct, STUDIO);
    return (
      <GestureHandlerRootView style={styles.flex}>
        <SafeAreaProvider>
          <Boundary>
            <View style={styles.flex}>
              <Phone>
                <View style={styles.directPad}>
                  {FX.direct === "Criacao" ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <Criacao {...(props as any)} />
                  ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <MaquinaOcupada {...(props as any)} />
                  )}
                </View>
              </Phone>
            </View>
          </Boundary>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  const owner = FX.role === "owner";
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme} initialState={initialState()}>
          <Boundary>
            <Root
              token={TOKEN}
              person={owner ? PERSONAL : ALUNA}
              studio={STUDIO}
              onboardingComplete={FX.onboardingComplete ?? true}
              commitmentComplete={FX.commitmentComplete ?? true}
              debut={FX.debut ?? false}
              onLeave={() => {}}
            />
          </Boundary>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: T.bg },
  blank: { flex: 1, backgroundColor: T.bg },
  directPad: { flex: 1, paddingHorizontal: T.pad, paddingTop: 24 },
  err: { flex: 1, backgroundColor: T.bg, padding: 16 },
  errText: { color: T.accentFallback, fontSize: 12 },
});
