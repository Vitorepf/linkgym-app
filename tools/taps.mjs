#!/usr/bin/env node
// node tools/taps.mjs [--no-build] [--flow=1,2,3]
// Conta toques e cronometra os fluxos que a Fase 3 vai medir. Dirige o build web com
// playwright e interage de verdade. O contador NÃO é um número escrito à mão: um
// init-script instala um interceptador em fase de captura na janela, antes de qualquer
// handler do app, e conta cada pointerdown/keydown CONFIÁVEL (isTrusted) — ou seja, o
// toque físico da pessoa, não a intenção do teste.
//
// Os seletores são de ACESSIBILIDADE, não de desenho: papel (`accessibilityRole`) mais
// nome acessível (`accessibilityLabel`, senão o texto do próprio controle), sempre
// comparado por regex sem caixa. O chassi põe rótulo em caixa alta por textTransform —
// no DOM continua "Sair" e na tela lê-se "SAIR" —, então comparar caixa é comparar CSS,
// e CSS é justamente o que o redesenho troca.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { buildWeb, loadPlaywright, PHONE, serve, WEB_DIR } from "./shots.mjs";

const COUNTER = `(() => {
  const c = { taps: 0, keys: 0 };
  globalThis.__taps = c;
  addEventListener("pointerdown", (e) => { if (e.isTrusted) c.taps += 1; }, true);
  addEventListener("keydown", (e) => { if (e.isTrusted) c.keys += 1; }, true);
})()`;

async function open(context, base, screen, brand = 0) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/?screen=${screen}&brand=${brand}`, { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => document.documentElement.hasAttribute("data-shot"), { timeout: 45000 })
    .catch(() => {});
  return { page, errors };
}

const count = (page) => page.evaluate(() => ({ ...globalThis.__taps }));

/** Um controle por PAPEL e NOME ACESSÍVEL, e só o que está na tela.
 *
 *  O `visible` não é zelo: a pilha do react-navigation deixa a tela de baixo MONTADA e
 *  escondida, então "Publicar" de Ajustar e "Publicar" da tela Publicar coexistem no DOM.
 *  Sem o filtro, o de baixo ganha por ordem de documento e o fluxo toca duas vezes o
 *  mesmo botão. */
const at = (page, role, name) =>
  page.getByRole(role, { name }).filter({ visible: true }).first();

const button = (page, name) => at(page, "button", name);

async function tap(page, locator) {
  await locator.waitFor({ state: "visible", timeout: 15000 });
  await locator.click();
}

/** Digita como dedo: um keydown confiável por caractere, senão o contador não vê nada. */
async function typeInto(page, locator, value) {
  await tap(page, locator);
  await locator.pressSequentially(value);
}

// ---------------------------------------------------------------- fluxo 1
// Personal prescreve, do Painel até publicado. Roda duas vezes: um aluno e a turma
// inteira. A tese do produto é a INCLINAÇÃO entre as duas, não o valor de uma delas.
async function flow1(context, base, { lote }) {
  const flow = `1 · personal prescreve (Painel -> publicado) · ${lote ? "turma" : "um aluno"}`;
  const { page, errors } = await open(context, base, "Painel");
  const t0 = Date.now();
  const steps = [];
  let alunos = 0;
  try {
    // Aba do personal. O rótulo é caixa alta por estilo; o nome acessível é o que importa.
    await tap(page, button(page, /fichas/i));
    steps.push("Painel -> aba Fichas");

    if (await page.getByText(/não deu para achar o modelo/i).count()) {
      throw new Error("Base não achou o modelo (ver src/screens/owner/Base.tsx)");
    }

    // Base: a origem já vem marcada, então o dedo só confirma.
    await tap(page, button(page, /continuar/i));
    steps.push("Base -> Ajustar");

    // Ajustar: o único "Publicar" visível é o desta tela — o de Base não existe e o da
    // tela seguinte ainda não montou.
    await tap(page, button(page, /publicar/i));
    steps.push("Ajustar -> Publicar");

    // Âncora da tela Publicar: a caixa de marcar a turma. É `checkbox` de propósito
    // (src/screens/owner/Publicar.tsx), o que a separa das linhas de nome, que são
    // `button`. Esperar por ela é o que garante que Ajustar já saiu de cima.
    const todos = at(page, "checkbox", /todos/i);
    await todos.waitFor({ state: "visible", timeout: 15000 });

    if (lote) {
      // UM toque marca a turma inteira. É aqui que o lote deixa de custar por cabeça.
      await tap(page, todos);
      steps.push("marcou a turma inteira em um toque");
    } else {
      steps.push("não marcou ninguém: só a ficha desta pessoa");
    }

    // O tamanho do lote sai da própria tela ("Publicar · N pessoas"), não de uma
    // constante do teste. `innerText` resolve o textTransform, daí o /i.
    const cta = button(page, /publicar/i);
    await cta.waitFor({ state: "visible", timeout: 15000 });
    alunos = Number((await cta.innerText()).match(/(\d+)\s*pessoa/i)?.[1] ?? 0);
    if (!alunos) throw new Error("a tela Publicar não disse para quantas pessoas vai");

    await tap(page, cta);
    await page.getByText(/no ar/i).first().waitFor({ state: "visible", timeout: 15000 });
    steps.push(`publicado para ${alunos}`);

    const c = await count(page);
    return { flow, status: "ok", taps: c.taps, keys: c.keys, ms: Date.now() - t0, alunos, steps, errors };
  } catch (err) {
    const c = await count(page).catch(() => ({ taps: 0, keys: 0 }));
    return {
      flow,
      status: "incompleto",
      taps: c.taps,
      keys: c.keys,
      ms: Date.now() - t0,
      alunos,
      steps,
      travou: err.message,
      errors,
    };
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------- fluxo 2
// Aluno registra uma série do dia.
async function flow2(context, base) {
  const { page, errors } = await open(context, base, "Hoje");
  const t0 = Date.now();
  const steps = [];
  try {
    // O botão do dia: "Começar", "Começar leve" ou "Continuar", conforme a prontidão.
    await tap(page, button(page, /começar|continuar/i));
    steps.push("Hoje -> Serie");

    await tap(page, button(page, /fiz essa série/i));
    // A série entrou: o app abre o descanso, que se anuncia pela acessibilidade.
    await page
      .getByLabel(/descanso/i)
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
    steps.push("série registrada (abre o descanso)");

    const c = await count(page);
    return {
      flow: "2 · aluno registra uma série do dia",
      status: "ok",
      taps: c.taps,
      keys: c.keys,
      ms: Date.now() - t0,
      steps,
      errors,
    };
  } catch (err) {
    const c = await count(page).catch(() => ({ taps: 0, keys: 0 }));
    return {
      flow: "2 · aluno registra uma série do dia",
      status: "incompleto",
      taps: c.taps,
      keys: c.keys,
      ms: Date.now() - t0,
      steps,
      travou: err.message,
      errors,
    };
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------- fluxo 3
// Do convite até o primeiro valor real do aluno.
// A perna do convite mora em src/screens/Access.tsx, dentro do App. O host monta o App
// inteiro (?screen=Acesso) justamente para NÃO simular esta perna — inclusive o boot.
//
// Os três campos de Access.tsx NÃO têm accessibilityLabel: o nome acessível deles cai no
// placeholder. Por isso aqui a âncora é o placeholder, em regex e sem caixa — e fica
// reportado, em vez de inventarmos um testid no produto.
async function flow3(context, base) {
  const t0 = Date.now();
  const steps = [];
  const { page, errors } = await open(context, base, "Acesso");
  const field = (re) => page.getByPlaceholder(re).filter({ visible: true }).first();
  try {
    await field(/\d{2} \d{5}/)
      .waitFor({ state: "visible", timeout: 15000 })
      .catch(() => {
        throw new Error("a tela de convite não montou: o boot do App.tsx não terminou");
      });

    await typeInto(page, field(/\d{2} \d{5}/), "11987654321");
    await typeInto(page, field(/convite/i), "CONVITE-FRED");
    await tap(page, button(page, /enviar/i));
    await typeInto(page, field(/^0{4}$/), "0000");
    await tap(page, button(page, /entrar/i));
    steps.push("convite + telefone + código");

    // Primeiro valor real: a prescrição do dia na mão, pronta para começar. Registrar a série
    // é o fluxo 2 — aqui a conta fecha quando o aluno VÊ o que o corpo vai fazer hoje.
    await button(page, /começar|continuar/i).waitFor({ state: "visible", timeout: 15000 });
    steps.push("entrou e viu a prescrição do dia");

    const c = await count(page);
    return {
      flow: "3 · do convite ao primeiro valor real do aluno",
      status: "ok",
      taps: c.taps,
      keys: c.keys,
      ms: Date.now() - t0,
      steps,
      errors,
    };
  } catch (err) {
    const c = await count(page).catch(() => ({ taps: 0, keys: 0 }));
    return {
      flow: "3 · do convite ao primeiro valor real do aluno",
      status: "incompleto",
      taps: c.taps,
      keys: c.keys,
      ms: Date.now() - t0,
      steps,
      travou: err.message,
      errors,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const only = (process.argv.find((a) => a.startsWith("--flow=")) ?? "").slice(7);
  const pick = only ? only.split(",") : ["1", "2", "3"];
  if (!process.argv.includes("--no-build") || !existsSync(join(WEB_DIR, "index.html"))) buildWeb();

  const { chromium, version } = loadPlaywright();
  const { server, port } = await serve(WEB_DIR);
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext(PHONE);
  await context.addInitScript(COUNTER);
  console.log(`playwright ${version} · ${base}`);

  const results = [];
  try {
    if (pick.includes("1")) {
      results.push(await flow1(context, base, { lote: false }));
      results.push(await flow1(context, base, { lote: true }));
    }
    if (pick.includes("2")) results.push(await flow2(context, base));
    if (pick.includes("3")) results.push(await flow3(context, base));
  } finally {
    await context.close();
    await browser.close();
    server.close();
  }

  console.log("");
  for (const r of results) {
    console.log(`${r.flow}`);
    console.log(`  status ${r.status} · ${r.taps} toque(s) · ${r.keys} tecla(s) · ${r.ms} ms`);
    if (r.alunos) console.log(`  alunos publicados: ${r.alunos}`);
    for (const s of r.steps) console.log(`  - ${s}`);
    if (r.travou) console.log(`  TRAVOU: ${r.travou}`);
    for (const e of r.errors) console.log(`  erro de página: ${e}`);
    console.log("");
  }

  // A inclinação é o número da tese, e sai de duas medições reais, não de uma conta.
  const [um, turma] = results.filter((r) => r.flow.startsWith("1 ") && r.status === "ok");
  if (um && turma && turma.alunos > um.alunos) {
    const dTap = turma.taps - um.taps;
    const dAluno = turma.alunos - um.alunos;
    console.log(
      `inclinação do lote: ${um.taps} toque(s) para ${um.alunos} aluno(s), ` +
        `${turma.taps} para ${turma.alunos} — ${dTap} toque(s) por ${dAluno} aluno(s) a mais ` +
        `(${(dTap / dAluno).toFixed(2)} por aluno).`,
    );
    console.log("");
  }

  const incompletos = results.filter((r) => r.status === "incompleto");
  if (incompletos.length) {
    console.log(`${incompletos.length} fluxo(s) incompleto(s). Baseline honesto: não foi simulado.`);
    process.exit(1);
  }
  console.log("Todos os fluxos rodaram fim a fim.");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(2);
  });
}
