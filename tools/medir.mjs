#!/usr/bin/env node
// Catraca do linkgym. node tools/medir.mjs <eixo>
// Imprime o numero, grava .gate/medidas/<eixo>.json, sai 1 se piorou contra melhor.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { culpa as culpaHits, proibidas as proibidasHits } from "./palavras.mjs";
import { telas } from "./cobertura.mjs";
import { carga_perdida } from "./carga.mjs";
import { fila } from "./fila.mjs";
import { inclinacao_lote, toques_convite, toques_serie } from "./toques.mjs";
const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const eixo = process.argv[2];
const ler = (p, d) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };

const fontes = (d, acc = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.git/.test(e.name)) fontes(p, acc); }
    else if (/\.(tsx?|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
};
const src = () => fontes(join(ROOT, "src")).map((p) => readFileSync(p, "utf8")).join("\n");

// contraste: pares que reprovam WCAG. Zero hoje, tem que continuar zero.
const contraste = () => {
  const s = execFileSync("node", ["tools/contrast.mjs"], { cwd: ROOT, stdio: "pipe" }).toString();
  return Number(s.match(/(\d+)\s+reprovam\s*$/m)?.[1] ?? s.match(/·\s*(\d+)\s+reprovam/)?.[1] ?? 0);
};
// tipos: erros de typecheck.
const tipos = () => { try { execFileSync("npx", ["tsc", "--noEmit"], { cwd: ROOT, stdio: "pipe" }); return 0; } catch (e) { return (`${e.stdout ?? ""}`.match(/error TS/g) ?? []).length || 1; } };
// escala: tamanhos de fonte distintos no app inteiro. Sistema apertado = numero baixo.
const escala = () => new Set([...src().matchAll(/fontSize:\s*(\d+(?:\.\d+)?)/g)].map((m) => m[1])).size;
// soltos: cor literal fora de src/theme.ts. Marca trocavel exige zero.
const soltos = () => {
  let n = 0;
  for (const p of fontes(join(ROOT, "src"))) {
    if (/theme\.ts$/.test(p)) continue;
    n += (readFileSync(p, "utf8").match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).length;
  }
  return n;
};

// culpa: palavra que vira crachá de pessoa no que o aluno lê. proibidas: as listas
// _Avoid_ do CONTEXT.md mais "LinkGym". Os dois cospem file:line em stderr, porque
// medidor que só devolve um numero manda ler o repo inteiro atras da causa.
const listar = (f) => () => { const h = f(); for (const x of h) console.error(`  ${x.file}:${x.line} [${x.termo}] ${x.texto}`); return h.length; };
const culpa = listar(culpaHits);
const proibidas = listar(proibidasHits);

const EIXOS = { contraste, tipos, escala, soltos, culpa, proibidas, toques_serie, inclinacao_lote, toques_convite, fila, telas, carga_perdida };
const calc = EIXOS[eixo];
if (!calc) { console.error(`eixo desconhecido: ${eixo}. use: ${Object.keys(EIXOS).join(", ")}`); process.exit(2); }

// A DIREÇÃO vem de .gate/base.json, nao de suposicao. `telas` so sobe; todo o resto so
// desce. Antes disto a catraca era menor-e-melhor cravada no codigo, e um medidor
// maior-e-melhor teria reprovado ao melhorar e passado ao piorar — gate invertido em
// silencio, que e pior que gate ausente.
const base = ler(join(ROOT, ".gate/base.json"), {})[eixo];
const maiorMelhor = base?.melhor === "maior";
const pior = (a, b) => (maiorMelhor ? a < b : a > b);
const otimo = (a, b) => (maiorMelhor ? Math.max(a, b) : Math.min(a, b));

const atual = calc();
const p = join(ROOT, ".gate/medidas", `${eixo}.json`);
const antes = ler(p, null);
const melhor = antes ? otimo(antes.melhor, atual) : atual;
mkdirSync(join(ROOT, ".gate/medidas"), { recursive: true });
writeFileSync(p, JSON.stringify({ atual, melhor }, null, 2) + "\n");
console.log(`${eixo}: atual=${atual} melhor=${melhor} (${maiorMelhor ? "maior" : "menor"} e melhor)`);
if (antes && pior(atual, antes.melhor)) { console.error(`CATRACA: ${eixo} piorou ${antes.melhor} -> ${atual}. Nao pode.`); process.exit(1); }
