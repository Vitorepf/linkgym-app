#!/usr/bin/env node
// Catraca de ritmo vertical: a PIOR razao (maior vao / mediana) do conjunto de telas.
// Razao alta = tela com um buraco e o resto espremido. Menor e melhor.
// Historico append-only; o melhor sai da mediana de janelas de 3 com a base no pool.
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const DIR = join(ROOT, ".gate");
const ler = (p, d) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };
const pl = (l) => { try { return JSON.parse(l); } catch { return null; } };

const outs = readdirSync(join(ROOT, "tools/out")).map((d) => join(ROOT, "tools/out", d, "0"));
const conj = outs.filter(existsSync).sort((a, b) => readdirSync(b).length - readdirSync(a).length)[0];
if (!conj) { console.error("ritmo: nenhum conjunto de shots em tools/out/*/0"); process.exit(2); }
const saida = execFileSync("node", ["tools/ritmo.mjs", conj], { cwd: ROOT, stdio: "pipe" }).toString();
const m = saida.match(/pior\s+\S+\s+([\d.]+)/);
if (!m) { console.error(`ritmo: nao achei a pior razao na saida:\n${saida.slice(-300)}`); process.exit(2); }
const atual = Number(m[1]);
if (!Number.isFinite(atual)) { console.error(`ritmo: valor nao numerico: ${m[1]}`); process.exit(2); }

const base = (ler(join(DIR, "base.json"), {}) ?? {}).ritmo ?? { melhor: "menor" };
const hist = join(DIR, "medidas", "ritmo.jsonl");
mkdirSync(join(DIR, "medidas"), { recursive: true });
appendFileSync(hist, JSON.stringify({ atual, ts: new Date().toISOString() }) + "\n");
const vals = readFileSync(hist, "utf8").trim().split("\n").filter(Boolean).map(pl).filter(Boolean).map((x) => x.atual);
const med3 = [];
for (let i = 0; i + 2 < vals.length; i++) { const w = [vals[i], vals[i+1], vals[i+2]].sort((x,y)=>x-y); med3.push(w[1]); }
const pool = (med3.length ? med3 : vals).concat(typeof base.valor === "number" ? [base.valor] : []);
const melhor = Math.min(...pool);
writeFileSync(join(DIR, "medidas", "ritmo.json"), JSON.stringify({ atual, melhor }, null, 2) + "\n");
console.log(`ritmo: atual=${atual} melhor=${melhor} (pior razao de ${readdirSync(conj).filter(f=>f.endsWith(".png")).length} telas)`);
if (vals.length > 1 && atual > melhor) { console.error(`CATRACA: ritmo piorou ${melhor} -> ${atual}`); process.exit(1); }
