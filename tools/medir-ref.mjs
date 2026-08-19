#!/usr/bin/env node
// Referencia de medidor-catraca. Copie e troque calc() pelo seu numero.
// O melhor sai do historico append-only .gate/medidas/<eixo>.jsonl, nunca de campo mutavel.
// Valor nao-numerico e RECUSADO na entrada: uma linha envenenada desligava a catraca inteira.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const DIR = join(ROOT, ".gate");
const eixo = process.argv[2];
const ler = (p, d) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };
const parse = (l) => { try { return JSON.parse(l); } catch { return null; } };

const calc = () => { throw new Error("troque calc() pelo seu numero"); };

const dir = join(DIR, "medidas");
const hist = join(dir, `${eixo}.jsonl`);
const base = (ler(join(DIR, "base.json"), {}) ?? {})[eixo];
if (!base) { console.error(`${eixo} nao esta em .gate/base.json`); process.exit(2); }
const maior = base.melhor === "maior";

const atual = calc();
if (typeof atual !== "number" || !Number.isFinite(atual)) {
  console.error(`${eixo}: calc() devolveu ${JSON.stringify(atual)}, que nao e numero finito. Nao gravo.`);
  process.exit(2);
}

mkdirSync(dir, { recursive: true });
appendFileSync(hist, JSON.stringify({ atual, ts: new Date().toISOString() }) + "\n");

const vals = readFileSync(hist, "utf8").trim().split("\n").filter(Boolean).map(parse).filter(Boolean).map((x) => x.atual);
const ruins = vals.filter((v) => typeof v !== "number" || !Number.isFinite(v));
if (ruins.length) { console.error(`${eixo}: historico tem ${ruins.length} valor(es) nao-numerico(s). Catraca invalida ate consertar.`); process.exit(2); }

// Mesma regra do gate: mediana de janela de 3, para outlier de sorte nao virar teto.
const med3 = [];
for (let i = 0; i + 2 < vals.length; i++) { const w = [vals[i], vals[i + 1], vals[i + 2]].sort((x, y) => x - y); med3.push(w[1]); }
// A base declarada entra no pool: sem ela, um valor ruim repetido 3x vira a propria
// mediana e apaga a linha de base. A catraca so pode ficar mais dura, nunca mais frouxa.
const pool = (med3.length ? med3 : vals).concat(typeof base?.valor === "number" ? [base.valor] : []);
const ruido = Number(base.ruido ?? 0);
const melhor = maior ? Math.max(...pool) : Math.min(...pool);
writeFileSync(join(dir, `${eixo}.json`), JSON.stringify({ atual, melhor }, null, 2) + "\n");
console.log(`${eixo}: atual=${atual} melhor=${melhor}`);
if (vals.length > 1 && (maior ? atual < melhor - ruido : atual > melhor + ruido)) {
  console.error(`CATRACA: ${eixo} piorou ${melhor} -> ${atual}. Nao pode.`);
  process.exit(1);
}
