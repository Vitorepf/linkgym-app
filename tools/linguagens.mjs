#!/usr/bin/env node
// AS OITO LINGUAGENS SÃO OITO? node tools/linguagens.mjs [--json]
//
// O dono escreveu a regra deste ciclo com todas as letras: "oferecer uma variedade enorme e
// de VERDADE". E este repo já aprendeu na pele o que acontece sem régua: seis vozes
// tipográficas embarcaram com quatro dos quinze pares colidindo nos três canais — duas
// opções de cardápio desenhando a mesma imagem.
//
// `tools/aparencia.mjs` julga separação de VOZ (§7a) e de MATERIAL (§16). Uma LINGUAGEM
// não tinha ninguém: ela decide quatorze campos de uma vez, e nada perguntava se duas
// delas chegam diferentes na tela.
//
// SEIS CANAIS GROSSOS — os que uma ficha de 64pt e um relance carregam:
//   polaridade  o chão é escuro ou claro (o canal mais alto que existe)
//   material    a folha da peça inteira, comparada como a §16 compara
//   canto       o raio
//   voz         os três canais da §7a; conta como um
//   densidade   a escada de espaço resolvida
//   traço       a espessura da borda
//
// O PISO É TRÊS, e não um. Um é o piso da VOZ, e está certo lá: uma voz é UMA alavanca. Uma
// linguagem promete decidir muitas; se ela decide muitas e só uma aterrissa diferente, é um
// preset de uma alavanca com um nome caro.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gravarMedida } from "./catraca.mjs";
import { criarTema, APARENCIA_PADRAO, VOZES } from "../src/theme.ts";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** As linguagens saem do ARQUIVO DA TELA, e não de uma cópia aqui. É a lição que este
 *  ciclo pagou três vezes: lista escrita à mão apodrece — a das superfícies em seis
 *  lugares, a das faces com dígito tabular, a do cardápio da API. Se alguém acrescentar uma
 *  linguagem no editor e esquecer da régua, a régua acha sozinha. */
const TELA = readFileSync(join(ROOT, "src/screens/owner/Aparencia.tsx"), "utf8");
const LINGUAGENS = [...TELA.matchAll(/\{ nome: "([^"]+)", doc: (\{[^}]+\}) \}/g)].map((m) => ({
  nome: m[1],
  doc: JSON.parse(m[2].replace(/(\w+):/g, '"$1":').replace(/"(\w+)": "/g, '"$1": "')),
}));
if (LINGUAGENS.length < 2) {
  console.error("linguagens: não achei o cardápio em src/screens/owner/Aparencia.tsx — a régua ficou cega");
  process.exit(2);
}

const PISO = 3;
const tema = (d) => criarTema({ ...APARENCIA_PADRAO, ...d });

/** Os três canais da §7a, dobrados em um: duas vozes se separam, ou não. */
function vozSepara(a, b) {
  if (a.voz === b.voz) return false;
  const [fa, fb] = [VOZES[a.voz], VOZES[b.voz]];
  const [ta, tb] = [tema(a), tema(b)];
  const [apA, apB] = [ta.TYPE.hero * fa.capNumero, tb.TYPE.hero * fb.capNumero];
  return (
    Math.abs(apA - apB) / Math.max(apA, apB) >= 0.08 ||
    fa.numero !== fb.numero ||
    fa.caixa !== fb.caixa
  );
}

const canais = (a, b) => {
  const [ta, tb] = [tema(a.doc), tema(b.doc)];
  return [
    ["polaridade", ta.escuro !== tb.escuro],
    ["material", JSON.stringify(ta.FORMA.folha.peca) !== JSON.stringify(tb.FORMA.folha.peca)],
    ["canto", ta.FORMA.raio !== tb.FORMA.raio],
    ["voz", vozSepara(a.doc, b.doc)],
    ["densidade", JSON.stringify(ta.SPACE) !== JSON.stringify(tb.SPACE)],
    ["traço", ta.FORMA.borda !== tb.FORMA.borda],
  ].filter(([, sim]) => sim).map(([n]) => n);
};

const pares = [];
const reprova = [];
for (let i = 0; i < LINGUAGENS.length; i++) {
  for (let j = i + 1; j < LINGUAGENS.length; j++) {
    const [a, b] = [LINGUAGENS[i], LINGUAGENS[j]];
    const c = canais(a, b);
    pares.push({ par: `${a.nome} × ${b.nome}`, n: c.length, canais: c });
    if (c.length < PISO) {
      reprova.push(`${a.nome} × ${b.nome}: ${c.length} de 6 canais (piso ${PISO}) — ${c.join(", ") || "nenhum"}`);
    }
  }
}

pares.sort((x, y) => x.n - y.n);
if (process.argv.includes("--json")) console.log(JSON.stringify({ pares, reprova }, null, 2));
else {
  const min = pares[0];
  console.log(
    `linguagens: ${LINGUAGENS.length} linguagens · ${pares.length} pares · ${reprova.length} reprovam · ` +
      `o par mais próximo é ${min.par} com ${min.n} de 6`,
  );
  for (const p of pares.slice(0, 5)) console.log(`  ${String(p.n)}  ${p.par.padEnd(26)} ${p.canais.join(", ")}`);
  for (const r of reprova) console.log("  REPROVA " + r);
}
gravarMedida("linguagens", reprova.length, "menor");
process.exit(reprova.length ? 1 : 0);
