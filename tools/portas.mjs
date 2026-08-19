#!/usr/bin/env node
// node tools/portas.mjs [--no-build]
// Quantas PORTAS do app do personal estão faltando. Sai 1 se faltar alguma.
//
// Porta é caminho que o dedo percorre, então isto não é grep: dirige o build web no
// Chrome, igual a tools/taps.mjs, e a prova de cada porta é o REQUEST que ela dispara.
// `/v1/owner/students/p-camila` só aparece se a tela levou o personal àquela pessoa —
// asserção sobre o texto do cabeçalho passaria de graça, porque a fixture devolve o
// mesmo aluno para qualquer id.
//
// As quatro portas são as que .gate/base.json semeou como `portas: 4`:
//   1 painel_turma   — "N alunos com você" abre a turma
//   2 revisao_aluna  — a linha da Revisão abre a pessoa daquela linha
//   3 fichas_turma   — a aba FICHAS lista a turma, e não a ficha de um aluno arbitrário
//   4 aluna_prescrever — com sinal pendente, a ficha da pessoa ainda tem porta para prescrever
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { buildWeb, loadPlaywright, PHONE, serve, WEB_DIR } from "./shots.mjs";

/** O host de screenshot troca `globalThis.fetch` por um stub que responde de memória e
 *  NÃO vai à rede — o registro de request do playwright nasce vazio. Por isso o espião é
 *  instalado POR CIMA do stub, depois de a tela ficar pronta: `src/api.ts` chama `fetch`
 *  global a cada chamada, então a troca pega. */
async function abrir(context, base, screen) {
  const page = await context.newPage();
  await page.goto(`${base}/?screen=${screen}&brand=0`, { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => document.documentElement.getAttribute("data-shot") === "ready", { timeout: 45000 })
    .catch(() => {});
  await page.evaluate(() => {
    const antes = globalThis.fetch;
    globalThis.__paths = [];
    globalThis.fetch = (input, init) => {
      const url = typeof input === "string" ? input : (input?.url ?? String(input));
      globalThis.__paths.push(url.replace(/^\w+:\/\/[^/]+/, "").split("?")[0]);
      return antes(input, init);
    };
  });
  return page;
}

const at = (page, role, name) => page.getByRole(role, { name }).filter({ visible: true }).first();
const botao = (page, name) => at(page, "button", name);

async function toque(page, locator) {
  await locator.waitFor({ state: "visible", timeout: 15000 });
  await locator.click();
}

const visivel = (page, re) => page.getByText(re).filter({ visible: true }).count();

/** Espera o pedido aparecer: navegar é assíncrono e a lista enche depois do toque. */
async function esperaPedido(page, path, ms = 8000) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {
    const paths = await page.evaluate(() => globalThis.__paths ?? []);
    if (paths.includes(path)) return true;
    await page.waitForTimeout(100);
  }
  return false;
}

// ------------------------------------------------------------------ 1
async function painel_turma(context, base) {
  const page = await abrir(context, base, "Painel");
  try {
    await toque(page, botao(page, /alunos com voc/i));
    await page.getByPlaceholder(/nome/i).first().waitFor({ state: "visible", timeout: 15000 });
    if (await visivel(page, /de onde a gente parte/i)) {
      throw new Error("caiu na origem da ficha, não na turma");
    }
    return null;
  } catch (err) {
    return err.message;
  } finally {
    await page.close();
  }
}

// ------------------------------------------------------------------ 2
async function revisao_aluna(context, base) {
  const page = await abrir(context, base, "Revisao");
  try {
    await toque(page, botao(page, /camila ferreira/i));
    if (!(await esperaPedido(page, "/v1/owner/students/p-camila"))) {
      throw new Error("tocar na linha não abriu a pessoa daquela linha");
    }
    return null;
  } catch (err) {
    return err.message;
  } finally {
    await page.close();
  }
}

// ------------------------------------------------------------------ 3
async function fichas_turma(context, base) {
  const page = await abrir(context, base, "Painel");
  try {
    await toque(page, botao(page, /fichas/i));
    await page.waitForTimeout(600);
    if (await visivel(page, /de onde a gente parte/i)) {
      throw new Error("a aba FICHAS abre a ficha de um aluno arbitrário");
    }
    const busca = page.getByPlaceholder(/nome/i).first();
    await busca.waitFor({ state: "visible", timeout: 15000 });
    await busca.click();
    await busca.pressSequentially("camila");
    await toque(page, botao(page, /camila ferreira/i));
    if (!(await esperaPedido(page, "/v1/owner/students/p-camila"))) {
      throw new Error("a busca por nome não leva à pessoa buscada");
    }
    return null;
  } catch (err) {
    return err.message;
  } finally {
    await page.close();
  }
}

// ------------------------------------------------------------------ 4
async function aluna_prescrever(context, base) {
  const page = await abrir(context, base, "Aluna");
  try {
    // A fixture põe a Ana na fila de hoje com a decisão "Trocar desenvolvimento": é o
    // estado em que o único CTA era a decisão e prescrever não tinha porta.
    await botao(page, /trocar desenvolvimento/i).waitFor({ state: "visible", timeout: 15000 });
    await botao(page, /publicar a pr/i).waitFor({ state: "visible", timeout: 15000 });
    return null;
  } catch (err) {
    return err.message;
  } finally {
    await page.close();
  }
}

const PORTAS = [
  ["painel_turma", painel_turma],
  ["revisao_aluna", revisao_aluna],
  ["fichas_turma", fichas_turma],
  ["aluna_prescrever", aluna_prescrever],
];

export async function portas() {
  if (!process.argv.includes("--no-build") || !existsSync(join(WEB_DIR, "index.html"))) buildWeb();
  const { chromium, version } = loadPlaywright();
  const { server, port } = await serve(WEB_DIR);
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext(PHONE);
  console.log(`playwright ${version} · ${base}`);
  let faltam = 0;
  try {
    for (const [nome, f] of PORTAS) {
      const erro = await f(context, base);
      if (erro) faltam += 1;
      console.log(`  ${erro ? "FALTA" : "ok   "}  ${nome}${erro ? ` · ${erro}` : ""}`);
    }
  } finally {
    await context.close();
    await browser.close();
    server.close();
  }
  console.log(`portas: ${faltam} faltando de ${PORTAS.length}`);
  return faltam;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  portas().then((n) => process.exit(n ? 1 : 0));
}
