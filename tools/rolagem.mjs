#!/usr/bin/env node
// QUANTAS TELAS DE ALTURA TEM CADA TELA. node tools/rolagem.mjs [--json] [--todas]
//
// O dono pediu, com estas palavras, "sem ter que rolar de mais a tela". O ciclo 9 mediu
// isso UMA vez, à mão, no Chrome — 6.333pt no editor de aparência, 8,3 telas, 77 alvos de
// toque numa página — e o número morreu no relatório. Número que não vira régua volta.
//
// Esta régua abre cada tela no MESMO Chrome que tira as fotos, no mesmo aparelho de 390 x
// 844, e pergunta ao DOM duas coisas que ninguém consegue estimar de cabeça:
//   quantas viewports de altura o conteúdo tem, e
//   quantos alvos de toque existem numa página só.
//
// Os dois tetos são de gosto declarado, e o gosto é o do dono:
//   TELAS  — 3 viewports. Acima disso a pessoa não tem mais um mapa do que existe ali; ela
//            tem uma esteira. Vale para tela de AJUSTE, que é onde ele reclamou: uma lista
//            de alunos legitimamente cresce com a turma e por isso a lista é isenta.
//   ALVOS  — 30 numa página. É o dobro do que uma tela de escolha bem desenhada precisa, e
//            menos da metade dos 77 que ele viu e chamou de rolar demais.
import { buildWeb, loadPlaywright, openShot, PHONE, screenNames, serve, WEB_DIR } from "./shots.mjs";
import { gravarMedida } from "./catraca.mjs";
import { existsSync } from "node:fs";

const TETO_TELAS = 3;
const TETO_ALVOS = 30;

/** As telas cuja altura é a do DADO, não a do desenho.
 *
 *  Uma turma de sessenta alunas tem sessenta linhas, e isso não é defeito de tela: é
 *  tamanho de academia. Elas ficam fora dos DOIS tetos, e não só do de altura — foi o
 *  primeiro erro desta régua. Ela acusou a Revisão com 44 alvos como se fosse excesso de
 *  desenho, quando são vinte alunas com duas ações cada. Régua que chama dado de defeito
 *  ensina a ignorar régua.
 *
 *  O teto vale onde o número de controles é ESCOLHA de quem desenhou: telas de ajuste,
 *  de configuração, de escolha. É lá que "rolar demais" é culpa do app. */
const LISTAS_RAIZ = [
  "Turma", "Alunos", "Modelos", "Modelo", "NovaModelo", "Mais", "Semana", "Painel", "Produtos", "Base",
  "Revisao", "Atencao", "Aluna", "Retorno", "Combinado", "Operacao",
];
/** POR PREFIXO, e não por nome exato. A lista era exata e apodreceu em um dia: a outra
 *  sessão acrescentou `OperacaoConcentrada` e `OperacaoEmDia`, e a régua passou a acusar
 *  duas telas de LISTA como se fossem excesso de desenho. É a quarta lista escrita à mão a
 *  apodrecer neste ciclo — as superfícies em seis lugares, as faces com dígito tabular, o
 *  cardápio da API e agora esta. Fixture nova de uma tela que já é lista nasce isenta. */
const ehLista = (tela) => LISTAS_RAIZ.some((r) => tela === r || tela.startsWith(r));

const json = process.argv.includes("--json");
const { chromium: pw } = loadPlaywright();
if (!existsSync(`${WEB_DIR}/index.html`) || process.argv.includes("--build")) buildWeb();

const { server, port } = await serve(WEB_DIR);
const base = `http://127.0.0.1:${port}`;
const browser = await pw.launch({ channel: "chrome" });
const context = await browser.newContext(PHONE);

const linhas = [];
const reprova = [];
for (const tela of screenNames()) {
  const { page, problems } = await openShot(context, base, tela, 0);
  if (problems.length) {
    await page.close();
    continue;
  }
  const m = await page.evaluate(() => {
    // A maior caixa rolável da página é a que carrega o conteúdo. `scrollHeight` dela é o
    // que o dedo tem que percorrer; a viewport é o que ele vê de uma vez.
    let alto = document.documentElement.scrollHeight;
    for (const el of document.querySelectorAll("*")) {
      if (el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 200) {
        alto = Math.max(alto, el.scrollHeight);
      }
    }
    // SÓ O QUE ESTÁ NA TELA. `querySelectorAll` enxerga o que está escondido, e na web o
    // native-stack ignora `presentation` e deixa a tela de baixo montada em `display: none`
    // — então uma folha de escolha vinha somada aos alvos do palco inteiro atrás dela, e a
    // régua acusava 32 onde o dedo alcança 15. Régua que conta pixel que ninguém vê é a
    // mesma família de defeito que este repo persegue desde sempre: medir o objeto que a
    // tela deixou de pintar.
    const visivel = (el) => {
      if (!el.getClientRects().length) return false;
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
      }
      return true;
    };
    const tocaveis = [
      ...document.querySelectorAll(
        '[role="button"],[role="link"],[role="checkbox"],[role="radio"],button,a,input,textarea,select',
      ),
    ].filter(visivel).length;
    return { alto, tocaveis, vh: window.innerHeight };
  });
  await page.close();
  const telas = m.alto / m.vh;
  linhas.push({ tela, telas: Number(telas.toFixed(2)), alvos: m.tocaveis, pt: Math.round(m.alto) });
  if (!ehLista(tela) && telas > TETO_TELAS)
    reprova.push(`${tela}: ${telas.toFixed(1)} telas de rolagem (teto ${TETO_TELAS})`);
  if (!ehLista(tela) && m.tocaveis > TETO_ALVOS)
    reprova.push(`${tela}: ${m.tocaveis} alvos de toque numa página só (teto ${TETO_ALVOS})`);
}

await context.close();
await browser.close();
server.close();

linhas.sort((a, b) => b.telas - a.telas);
if (json) console.log(JSON.stringify({ linhas, reprova }, null, 2));
else {
  console.log(`rolagem: ${linhas.length} telas medidas · ${reprova.length} reprovam`);
  for (const l of linhas.slice(0, 8)) {
    console.log(`  ${l.tela.padEnd(22)} ${String(l.telas).padStart(5)} telas  ${String(l.alvos).padStart(3)} alvos  ${l.pt}pt`);
  }
  for (const r of reprova) console.log("  REPROVA " + r);
}
gravarMedida("rolagem", reprova.length, "menor");
process.exit(reprova.length ? 1 : 0);
