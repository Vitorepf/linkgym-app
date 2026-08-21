#!/usr/bin/env node
// node tools/kits.mjs [--kits=Ferro,Vitrine] [--screens=Hoje,Painel] [--out=DIR] [--check] [--no-build]
//
// A PROVA VISUAL DA FÁBRICA DE APARÊNCIA. `tools/aparencia.mjs` prova o número — contraste,
// alvo de dedo, separação de cores — em 245 paletas. Isto prova o PIXEL: monta o app de
// verdade em cada kit e confere que nenhuma tela quebra, some ou grita no console.
//
// Não duplica o host nem o servidor: reusa `tools/shots.mjs` (buildWeb/serve/loadPlaywright)
// e só acrescenta o parâmetro `ap` na URL, que o `tools/shotHost.tsx` já sabe ler. Uma
// segunda régua discordando em silêncio é o que este repo inteiro existe para evitar.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { gravarMedida } from "./catraca.mjs";
import { join } from "node:path";
import { buildWeb, loadPlaywright, ROOT, screenNames, serve, WEB_DIR } from "./shots.mjs";
import { impressaoDoCodigo } from "./toques.mjs";

/** Os kits de fábrica — os MESMOS de src/screens/owner/Aparencia.tsx. Ficam repetidos aqui
 *  de propósito: se alguém mexer num kit na tela e esquecer do medidor, a divergência tem
 *  que aparecer como kit não medido, e não como medição fantasma de algo que sumiu. */
const KITS = {
  Ferro: { acao: "linha", voz: "bloco", chao: "carvao", porte: "padrao", forma: "reta", superficie: "solida", peso: "medio", densidade: "normal", movimento: "normal", hierarquia: "salto", anel: "resgate", numero: "empilhado", contraste: "normal" },
  Moderno: { acao: "empilhada", voz: "neutra", chao: "grafite", porte: "padrao", forma: "macia", superficie: "elevada", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" },
  Minimalista: { acao: "centro", voz: "neutra", chao: "linho", porte: "justo", forma: "reta", superficie: "nenhuma", peso: "fino", densidade: "arejada", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "normal" },
  Cartaz: { acao: "caixa", voz: "condensada", chao: "papel", porte: "folgado", forma: "reta", superficie: "carimbo", peso: "grosso", densidade: "compacta", movimento: "seco", hierarquia: "parelha", anel: "sempre", numero: "empilhado", contraste: "alto" },
  Vitrine: { acao: "linha", voz: "tecnica", chao: "breu", porte: "padrao", forma: "pilula", superficie: "vidro", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "parelha", anel: "sempre", numero: "cartaz", contraste: "normal" },
  Boutique: { acao: "centro", voz: "editorial", chao: "papel", porte: "folgado", forma: "macia", superficie: "elevada", peso: "fino", densidade: "arejada", movimento: "normal", hierarquia: "salto", anel: "sempre", numero: "cartaz", contraste: "normal" },
  Clinica: { acao: "centro", voz: "tecnica", chao: "neve", porte: "justo", forma: "macia", superficie: "fio", peso: "medio", densidade: "compacta", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "alto" },
  Sereno: { acao: "centro", voz: "suave", chao: "tabaco", porte: "folgado", forma: "pilula", superficie: "solida", peso: "fino", densidade: "arejada", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" },
};

const arg = (nome, padrao) => {
  const hit = process.argv.find((a) => a.startsWith(`--${nome}=`));
  return hit ? hit.slice(nome.length + 3) : padrao;
};

const alvo = arg("kits", "").trim();
const kits = alvo ? alvo.split(",").map((k) => k.trim()) : Object.keys(KITS);
const telasArg = arg("screens", "").trim();
const telas = telasArg ? telasArg.split(",").map((t) => t.trim()) : screenNames();
const check = process.argv.includes("--check");

// --catraca: LÊ o artefato, não remede. O gate tem 150s antes de o hook Stop matá-lo, e
// uma corrida de 216 montagens no Chrome não cabe nisso — mas ler um JSON cabe. É o mesmo
// desenho de `tools/toques.mjs`, e pela mesma razão: RECUSAR número velho dá a garantia
// inteira (artefato medido sobre outro código nunca passa) e devolve o comando exato em
// vez de um travamento.
if (process.argv.includes("--catraca")) {
  const artefato = join(ROOT, ".gate/kits.json");
  if (!existsSync(artefato)) {
    console.error(".gate/kits.json não existe.\n  Meça: node tools/kits.mjs --check");
    process.exit(1);
  }
  const m = JSON.parse(readFileSync(artefato, "utf8"));
  if (m.codigo !== impressaoDoCodigo()) {
    console.error(".gate/kits.json foi medido sobre outro código.\n  Remeça: node tools/kits.mjs --check");
    process.exit(1);
  }
  const quebradas = (m.quebradas ?? []).length;
  console.log(`kits: ${m.kits}/${m.testadas} telas inteiras · ${quebradas} quebradas`);
  gravarMedida("kits", quebradas);
  process.exit(quebradas ? 1 : 0);
}
const out = join(ROOT, arg("out", "tools/out/kits"));

async function abrir(context, base, screen, ap) {
  const page = await context.newPage();
  const erros = [];
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });
  page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
  const url = `${base}/?screen=${encodeURIComponent(screen)}&brand=0&ap=${encodeURIComponent(JSON.stringify(ap))}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  let flag = "timeout";
  try {
    await page.waitForFunction(
      () => {
        const v = document.documentElement.getAttribute("data-shot");
        return v === "ready" || v === "error" || v === "stuck" ? v : false;
      },
      { timeout: 45000 },
    );
    flag = await page.evaluate(() => document.documentElement.getAttribute("data-shot"));
  } catch {
    /* timeout */
  }
  const info = await page.evaluate(() => {
    // O FIM DA ROLAGEM. O contêiner de telas do Tab.Navigator encosta no dock (medido:
    // termina no mesmo pixel em que a barra começa), e a tela empilhada encosta no
    // indicador de home — nos dois casos o único respiro embaixo do último item é o
    // padding do próprio conteúdo. Era literal em nove telas (28, 16, 8 ... e um ZERO) e
    // a densidade não alcançava nenhum. Aqui só o PISO é cobrado: quem manda no valor é
    // `espacos()` em src/theme.ts, e uma segunda régua repetindo a escala seria a
    // divergência silenciosa que este medidor existe para evitar.
    const PISO = 8;
    const colados = [...document.querySelectorAll("*")]
      .filter((e) => {
        const s = getComputedStyle(e);
        if (s.overflowY !== "auto" && s.overflowY !== "scroll") return false;
        // Irmão abaixo = DockFooter: ali quem paga o fim da tela é o rodapé, e cobrar o
        // padding da rolagem também seria cobrar duas vezes. Sem irmão, a rolagem É o fim.
        return e.firstElementChild && !e.nextElementSibling;
      })
      .map((e) => parseFloat(getComputedStyle(e.firstElementChild).paddingBottom) || 0)
      .filter((v) => v < PISO);
    return {
      misses: globalThis.__shot?.misses ?? ["__shot ausente"],
      error: globalThis.__shot?.error ?? "",
      text: document.body.innerText.trim().length,
      colados,
    };
  });
  const problemas = [];
  if (flag !== "ready") problemas.push(`montagem sinalizou "${flag}"`);
  if (info.error) problemas.push(`erro do React: ${info.error}`);
  if (info.misses.length) problemas.push(`rota sem fixture: ${info.misses.join(", ")}`);
  if (info.text === 0) problemas.push("tela em branco");
  for (const v of info.colados) problemas.push(`fim da rolagem colado: ${v}px (piso 8)`);
  for (const e of erros) problemas.push(`console: ${e}`);
  return { page, problemas };
}

const noBuild = process.argv.includes("--no-build");
if (!noBuild || !existsSync(join(WEB_DIR, "index.html"))) buildWeb();

const { chromium } = loadPlaywright();
const { server, port } = await serve(WEB_DIR);
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 2,
});

let inteiras = 0;
let testadas = 0;
const quebradas = [];
try {
  for (const kit of kits) {
    const ap = KITS[kit];
    if (!ap) {
      console.error(`kit desconhecido: ${kit}. use: ${Object.keys(KITS).join(", ")}`);
      process.exit(2);
    }
    const dir = join(out, kit);
    if (!check) mkdirSync(dir, { recursive: true });
    let ok = 0;
    for (const screen of telas) {
      testadas += 1;
      const { page, problemas } = await abrir(context, base, screen, ap);
      if (!check) await page.screenshot({ path: join(dir, `${screen}.png`), animations: "disabled" });
      await page.close();
      if (problemas.length) quebradas.push({ kit, tela: screen, problemas });
      else {
        ok += 1;
        inteiras += 1;
      }
    }
    console.log(`kit ${kit.padEnd(9)} ${ok}/${telas.length} telas inteiras`);
  }
} finally {
  await browser.close();
  server.close();
}

for (const q of quebradas) console.error(`  QUEBRA ${q.kit} · ${q.tela}: ${q.problemas.join(" | ")}`);
console.log(`\n${testadas} montagens em ${kits.length} kit(s) · ${inteiras} inteiras · ${quebradas.length} quebradas`);
if (check) {
  mkdirSync(join(ROOT, ".gate"), { recursive: true });
  writeFileSync(
    join(ROOT, ".gate/kits.json"),
    JSON.stringify({ kits: inteiras, testadas, quebradas, codigo: impressaoDoCodigo() }, null, 2) + "\n",
  );
  console.log("gravei .gate/kits.json");
}
gravarMedida("kits", quebradas.length);
process.exit(quebradas.length ? 1 : 0);
