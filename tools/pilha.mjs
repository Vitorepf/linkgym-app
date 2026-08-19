#!/usr/bin/env node
// node tools/pilha.mjs
//
// Prova de profundidade da pilha durante a sessão. Não é leitura de código: roda o
// StackRouter de verdade — `@react-navigation/routers`, o mesmo pacote que o
// Stack.Navigator do Root usa — e conta quantas rotas ficam montadas depois de 20 séries.
//
// Cada rota da sessão carrega `items` inteiro em params (SessionRoute em src/nav/types.ts),
// então pilha funda é memória parada e é caminho de volta errado: com NAVIGATE, arrastar
// da borda no Descanso anda o treino para trás, série por série.
//
// O comando que cada tela usa para chamar a outra é LIDO DO CÓDIGO. Trocar popTo por
// navigate outra vez faz este script falhar.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CommonActions, StackActions, StackRouter } from "@react-navigation/routers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SERIES = 20;
const TELAS = ["Hoje", "Serie", "Descanso", "Ficha", "ComoFazer", "Feito"];

/** Qual comando a tela usa para chamar a outra, direto da fonte. */
function comando(arquivo, destino) {
  const src = readFileSync(join(ROOT, "src/screens/student", arquivo), "utf8");
  const m = src.match(new RegExp(`navigation\\.(\\w+)\\(\\s*"${destino}"`));
  if (!m) throw new Error(`${arquivo} não chama "${destino}"`);
  return m[1];
}

/** Uma sessão inteira: entra pela Hoje e faz 20 séries, cada uma Série → Descanso. */
function corrida(deSerie, deDescanso) {
  const router = StackRouter({});
  const opts = { routeParamList: {}, routeGetIdList: {} };
  let state = router.getInitialState({ routeNames: TELAS, routeParamList: {} });

  const vai = (como, tela, params) => {
    const action =
      como === "popTo"
        ? StackActions.popTo(tela, params)
        : CommonActions.navigate(tela, params);
    const next = router.getStateForAction(state, action, opts);
    if (!next) throw new Error(`${como}("${tela}") não produziu estado`);
    state = router.getRehydratedState(next, { routeNames: TELAS, routeParamList: {} });
  };

  // A Hoje entra sempre por NAVIGATE — ela é a casa, não faz parte do ciclo.
  vai("navigate", "Serie", { itemIndex: 0, setIndex: 1 });
  for (let n = 1; n <= SERIES; n++) {
    vai(deSerie, "Descanso", { itemIndex: 0, setIndex: n, restSeconds: 90 });
    if (n < SERIES) vai(deDescanso, "Serie", { itemIndex: 0, setIndex: n + 1 });
  }

  const volta = router.getStateForAction(state, CommonActions.goBack(), opts);
  return {
    profundidade: state.routes.length,
    topo: state.routes[state.routes.length - 1].name,
    volta: volta ? volta.routes[volta.index].name : "sai do app",
  };
}

const antes = corrida("navigate", "navigate");
const agora = corrida(comando("Serie.tsx", "Descanso"), comando("Descanso.tsx", "Serie"));

console.log(`${SERIES} séries, entrando pela Hoje:`);
console.log(
  `  ANTES  navigate/navigate  ${antes.profundidade} telas montadas` +
    `  ·  voltar no ${antes.topo} → ${antes.volta}`,
);
console.log(
  `  AGORA  ${comando("Serie.tsx", "Descanso")}/${comando("Descanso.tsx", "Serie")}` +
    `  ${agora.profundidade} telas montadas` +
    `  ·  voltar no ${agora.topo} → ${agora.volta}`,
);

// A pilha da sessão não pode depender do número de séries: Hoje + a tela de agora.
const TETO = 2;
if (agora.profundidade > TETO) {
  console.error(`FALHOU: ${agora.profundidade} telas para ${SERIES} séries (teto ${TETO}).`);
  process.exit(1);
}
if (agora.volta !== "Hoje") {
  console.error(`FALHOU: voltar no ${agora.topo} cai em ${agora.volta}, não na Hoje.`);
  process.exit(1);
}
