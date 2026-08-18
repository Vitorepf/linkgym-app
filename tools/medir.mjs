#!/usr/bin/env node
// Catraca do linkgym. node tools/medir.mjs <eixo>
// Imprime o numero, grava .gate/medidas/<eixo>.json, sai 1 se piorou contra melhor.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
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

const calc = { contraste, tipos, escala, soltos }[eixo];
if (!calc) { console.error(`eixo desconhecido: ${eixo}. use: contraste, tipos, escala, soltos`); process.exit(2); }
const atual = calc();
const p = join(ROOT, ".gate/medidas", `${eixo}.json`);
const antes = ler(p, null);
const melhor = antes ? Math.min(antes.melhor, atual) : atual;
mkdirSync(join(ROOT, ".gate/medidas"), { recursive: true });
writeFileSync(p, JSON.stringify({ atual, melhor }, null, 2) + "\n");
console.log(`${eixo}: atual=${atual} melhor=${melhor}`);
if (antes && atual > antes.melhor) { console.error(`CATRACA: ${eixo} piorou ${antes.melhor} -> ${atual}. Nao pode.`); process.exit(1); }
