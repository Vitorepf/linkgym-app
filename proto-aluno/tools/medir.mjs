#!/usr/bin/env node
/**
 * Medidores do proto do aluno. Cada eixo devolve um número, não um adjetivo.
 * Uso: node tools/medir.mjs [escala|contraste|cor|primitiva|alvo|movimento|cerimonia|croma|tudo]
 *
 * O crítico usa isto para não precisar acreditar em quem implementou.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SRC = join(ROOT, "src");
const CSS = join(SRC, "styles.css");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(p)) out.push(p);
  }
  return out;
}

const FILES = walk(SRC).map((p) => ({ path: p, rel: relative(ROOT, p), text: readFileSync(p, "utf8") }));
const cssText = readFileSync(CSS, "utf8");

/* ---------------------------------------------------------------- contraste */

function srgb(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function lum(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

function ratio(a, b) {
  const la = lum(a);
  const lb = lum(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function tokens() {
  const out = {};
  for (const m of cssText.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
    if (!(m[1] in out)) out[m[1]] = m[2];
  }
  return out;
}

/* Texto precisa de 4.5:1. Divisória precisa RECUAR: no máximo 2.2:1, senão a
 * tela vira planilha. E a razão entre o corpo e a divisória mostra se a
 * hierarquia existe: quanto maior, mais o texto manda e a linha obedece. */
function medirContraste() {
  const t = tokens();
  const bg = t.bg;
  const rows = [];
  const textPairs = [
    ["ink", 4.5],
    ["mute", 4.5],
    ["faint", 4.5],
    ["ghost", 3.0],
    ["stamp-hi", 4.5],
  ];
  for (const [name, min] of textPairs) {
    if (!t[name]) continue;
    const r = ratio(t[name], bg);
    rows.push({ o: `texto ${name} sobre bg`, v: r.toFixed(2), alvo: `>= ${min}`, ok: r >= min });
  }
  const rLine = ratio(t.line, bg);
  rows.push({ o: "divisória line sobre bg", v: rLine.toFixed(2), alvo: "<= 2.20", ok: rLine <= 2.2 });
  const rEdge = ratio(t.edge, bg);
  rows.push({ o: "borda edge sobre bg", v: rEdge.toFixed(2), alvo: "1.4 a 3.0", ok: rEdge >= 1.4 && rEdge <= 3.0 });
  const dom = ratio(t.ink, bg) / rLine;
  rows.push({ o: "domínio texto ÷ divisória", v: dom.toFixed(1), alvo: ">= 8.0", ok: dom >= 8 });
  const prim = ratio(t.ink, bg);
  rows.push({ o: "ação primária sobre bg", v: prim.toFixed(2), alvo: ">= 12.0", ok: prim >= 12 });

  // superfícies vizinhas precisam se distinguir sem virar degrau visível
  const ladder = ["bg", "surface", "raised", "fill"];
  for (let i = 0; i < ladder.length - 1; i++) {
    const r = ratio(t[ladder[i]], t[ladder[i + 1]]);
    rows.push({
      o: `superfície ${ladder[i]} → ${ladder[i + 1]}`,
      v: r.toFixed(2),
      alvo: "1.15 a 1.75",
      ok: r >= 1.15 && r <= 1.75,
    });
  }
  return rows;
}

/* ------------------------------------------------------------------ escala */

/* A escada de tipo só governa se ninguém a atropela com tamanho avulso. */
function medirEscala() {
  const arb = new Map();
  for (const f of FILES) {
    for (const m of f.text.matchAll(/text-\[(\d+)px\]/g)) {
      const k = m[1];
      arb.set(k, (arb.get(k) ?? 0) + 1);
    }
  }
  const steps = [...cssText.matchAll(/--text-([a-z]+):\s*(\d+)px/g)].map((m) => Number(m[2]));
  steps.sort((a, b) => a - b);
  const ratios = steps.slice(1).map((v, i) => v / steps[i]);
  const total = [...arb.values()].reduce((a, b) => a + b, 0);
  return {
    rows: [
      { o: "degraus na escada", v: String(steps.length), alvo: "8 a 11", ok: steps.length >= 8 && steps.length <= 11 },
      {
        o: "tamanhos avulsos fora da escada",
        v: String(arb.size),
        alvo: "0",
        ok: arb.size === 0,
      },
      { o: "ocorrências de tamanho avulso", v: String(total), alvo: "0", ok: total === 0 },
      {
        o: "maior salto entre degraus vizinhos",
        v: ratios.length ? Math.max(...ratios).toFixed(2) : "-",
        alvo: "<= 1.70",
        ok: ratios.length > 0 && Math.max(...ratios) <= 1.7,
      },
    ],
    detalhe: [...arb.entries()].sort((a, b) => b[1] - a[1]).map(([px, n]) => `${px}px × ${n}`),
  };
}

/* --------------------------------------------------------------------- cor */

/* Cor crua no componente é cor que ninguém consegue trocar depois. */
function medirCor() {
  const hits = [];
  for (const f of FILES) {
    const lines = f.text.split("\n");
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
        hits.push(`${f.rel}:${i + 1} ${m[0]}`);
      }
    });
  }
  return {
    rows: [{ o: "hex cru fora do styles.css", v: String(hits.length), alvo: "0", ok: hits.length === 0 }],
    detalhe: hits,
  };
}

/* --------------------------------------------------------------- primitiva */

/* Se as telas ainda montam faixa à mão, não existe empacotamento: existe
 * repetição. Mede adoção real das primitivas contra remontagem manual. */
function medirPrimitiva() {
  let manual = 0;
  let prim = 0;
  const detalhe = [];
  for (const f of FILES) {
    if (f.rel.includes("src/ui/")) continue;
    const lines = f.text.split("\n");
    lines.forEach((line, i) => {
      if (/border-(t|b|y|x)?\s*border-line/.test(line) && /px-\d|py-\d|p-\d/.test(line)) {
        manual++;
        detalhe.push(`${f.rel}:${i + 1}`);
      }
    });
    prim += (f.text.match(/<(Band|Card|Row|SectionHead|Chip|Stat|ActionBar|Reveal|Roll)\b/g) ?? []).length;
  }
  const adocao = prim + manual === 0 ? 1 : prim / (prim + manual);
  return {
    rows: [
      { o: "faixa remontada à mão", v: String(manual), alvo: "<= 4", ok: manual <= 4 },
      { o: "uso de primitiva", v: String(prim), alvo: ">= 60", ok: prim >= 60 },
      { o: "adoção", v: `${Math.round(adocao * 100)}%`, alvo: ">= 90%", ok: adocao >= 0.9 },
    ],
    detalhe,
  };
}

/* -------------------------------------------------------------------- alvo */

const SAFE_TARGET =
  /\b(thumb|thumb-line|quiet|h-1[1-9]|h-\[(4[4-9]|[5-9]\d|\d{3})px\]|min-h-\[(4[4-9]|[5-9]\d)px\]|size-1[1-9]|h-1[2-9]|aspect-square|inset-0)\b/;

/* Alvo de dedo abaixo de 44 é defeito, não estilo. */
function medirAlvo() {
  const bad = [];
  let total = 0;
  for (const f of FILES) {
    if (f.rel.includes("src/ui/") || f.rel.includes("components/bits")) continue;
    for (const m of f.text.matchAll(/<button\b[\s\S]{0,420}?>/g)) {
      total++;
      const tag = m[0];
      if (SAFE_TARGET.test(tag)) continue;
      const line = f.text.slice(0, m.index).split("\n").length;
      bad.push(`${f.rel}:${line}`);
    }
  }
  return {
    rows: [
      { o: "botões auditados", v: String(total), alvo: "-", ok: true },
      { o: "sem altura de dedo garantida", v: String(bad.length), alvo: "0", ok: bad.length === 0 },
    ],
    detalhe: bad,
  };
}

/* --------------------------------------------------------------- movimento */

/* Tela sem movimento nenhum é tela morta. Animação infinita em texto é pior:
 * é ruído em cima do que a pessoa está tentando ler. */
function medirMovimento() {
  const mortas = [];
  let infinita = 0;
  for (const f of FILES) {
    if (!/src\/screens\//.test(f.rel)) continue;
    const has = /motion\.|anim-rise|anim-fade|<Reveal|<Roll|press\b/.test(f.text);
    if (!has) mortas.push(f.rel);
  }
  infinita = (cssText.match(/animation:[^;]*infinite/g) ?? []).length;
  const durs = [...cssText.matchAll(/--dur-[a-z]+:\s*(\d+)ms/g)].map((m) => Number(m[1]));
  return {
    rows: [
      { o: "telas sem movimento algum", v: String(mortas.length), alvo: "0", ok: mortas.length === 0 },
      { o: "durações nomeadas", v: String(durs.length), alvo: "4", ok: durs.length === 4 },
      { o: "animação infinita no CSS", v: String(infinita), alvo: "<= 1", ok: infinita <= 1 },
    ],
    detalhe: mortas,
  };
}

/* --------------------------------------------------- orçamento por cena ---
 * Os medidores acima olham o repo inteiro. Estes olham CENA POR CENA, que é
 * como a barra do Linear e a do Stripe são escritas. Uma cena é um componente
 * exportado, porque grupos.tsx carrega oito cenas e social.tsx carrega cinco.
 */

const DEGRAUS = [
  "t-micro", "t-mono", "t-kicker", "t-small", "t-sub",
  "t-body", "t-title", "t-display", "t-hero", "t-score", "t-plate",
];

function cenas() {
  const out = [];
  for (const f of FILES) {
    if (!/src\/screens\//.test(f.rel)) continue;
    const marks = [...f.text.matchAll(/^export function (\w+)/gm)];
    marks.forEach((m, i) => {
      const start = m.index;
      const end = i + 1 < marks.length ? marks[i + 1].index : f.text.length;
      out.push({ nome: `${f.rel.replace("src/screens/", "")}:${m[1]}`, text: f.text.slice(start, end) });
    });
  }
  return out;
}

/* Linear B1: a tela densa dele roda em 1 tamanho. Num app mobile isso não
 * transfere: título de página, corpo, metadado e rótulo já são 4 no piso.
 * A disciplina exigível é 5, território de Things 3. Acima de 5 é descuido. */
function medirTipos() {
  const c = cenas();
  const fora = [];
  let pior = 0;
  for (const cena of c) {
    const usados = new Set(DEGRAUS.filter((d) => new RegExp(`\\b${d}\\b`).test(cena.text)));
    for (const m of cena.text.matchAll(/text-\[(\d+)px\]/g)) usados.add(`avulso:${m[1]}`);
    pior = Math.max(pior, usados.size);
    if (usados.size > 5) fora.push(`${cena.nome} usa ${usados.size}: ${[...usados].join(", ")}`);
  }
  return {
    rows: [
      { o: "cenas auditadas", v: String(c.length), alvo: "-", ok: true },
      { o: "cena acima de 5 degraus", v: String(fora.length), alvo: "0", ok: fora.length === 0 },
      { o: "pior cena", v: String(pior), alvo: "<= 5", ok: pior <= 5 },
    ],
    detalhe: fora,
  };
}

/* Linear B4: no máximo 2 réguas horizontais na tela inteira, não importa
 * quantas linhas a lista tenha. Superar é chegar a 0 na cena densa. */
function medirRegua() {
  const c = cenas();
  const fora = [];
  let pior = 0;
  for (const cena of c) {
    const n = (cena.text.match(/border-(t|b|y)\b/g) ?? []).length;
    pior = Math.max(pior, n);
    if (n > 4) fora.push(`${cena.nome}: ${n} réguas`);
  }
  return {
    rows: [
      { o: "cena com mais de 4 réguas", v: String(fora.length), alvo: "0", ok: fora.length === 0 },
      { o: "pior cena", v: String(pior), alvo: "<= 4", ok: pior <= 4 },
    ],
    detalhe: fora,
  };
}

/* Stripe B1: exatamente 1 botão preenchido por camada. O Stripe quebra a
 * própria regra em três estados vazios; aqui não pode quebrar nenhuma vez. */
function medirPreenchido() {
  const c = cenas();
  const fora = [];
  for (const cena of c) {
    const thumb = (cena.text.match(/className="thumb"|<Thumb\b/g) ?? []).length;
    const outros = (cena.text.match(/\bbg-(ink|stamp)\b/g) ?? []).length;
    const n = thumb + outros;
    if (n > 1) fora.push(`${cena.nome}: ${n} preenchidos (${thumb} thumb, ${outros} avulso)`);
  }
  return {
    rows: [{ o: "cena com mais de 1 preenchido", v: String(fora.length), alvo: "0", ok: fora.length === 0 }],
    detalhe: fora,
  };
}

/* Stripe B13 e C13: no máximo 4 ocorrências de acento na camada base, e
 * superar é chegar a 2. Acento em régua, cromo ou navegação inativa é falha. */
function medirAcento() {
  const c = cenas();
  const fora = [];
  let pior = 0;
  for (const cena of c) {
    const n = (cena.text.match(/\b(text|bg|border|ring)-stamp(-hi|-dim)?\b|tone="stamp"|data-stamp/g) ?? []).length;
    pior = Math.max(pior, n);
    if (n > 4) fora.push(`${cena.nome}: ${n} ocorrências de acento`);
  }
  return {
    rows: [
      { o: "cena com mais de 4 acentos", v: String(fora.length), alvo: "0", ok: fora.length === 0 },
      { o: "pior cena", v: String(pior), alvo: "<= 4", ok: pior <= 4 },
    ],
    detalhe: fora,
  };
}

/* D8: do fim da última série até a tela de decisão, no máximo 2 telas cheias
 * e 1 toque obrigatório. Contamos o que o store abre depois de fechar a
 * sessão e quantos preenchidos o Feito exige para sair. */
function medirCerimonia() {
  const store = FILES.find((f) => f.rel.endsWith("src/lib/store.ts"));
  const feito = FILES.find((f) => f.rel.endsWith("src/screens/feito.tsx"));
  const overlays = [...(store?.text.matchAll(/overlay:\s*"([a-zA-Z]+)"/g) ?? [])]
    .map((m) => m[1])
    .filter((id) => id === "feito" || id === "patamar");
  const telas = new Set(overlays).size;
  const thumbs = (feito?.text.match(/className="thumb"|<Thumb\b/g) ?? []).length;
  const temPatamar = /patamar|É o meu/.test(feito?.text ?? "");
  return {
    rows: [
      { o: "telas cheias após o ato", v: String(telas), alvo: "<= 2", ok: telas <= 2 },
      { o: "preenchidos no Feito", v: String(thumbs), alvo: "<= 1", ok: thumbs <= 1 },
      { o: "festa de patamar no Feito", v: temPatamar ? "sim" : "não", alvo: "modo patamar", ok: temPatamar },
    ],
    detalhe: [`overlays pós-sessão: ${[...new Set(overlays)].join(", ") || "nenhum"}`],
  };
}

/* Croma quente no escuro é falha. Superfície tem que ser carbono (S ≈ 0). */
function hexSat(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function medirCroma() {
  const t = tokens();
  const faces = ["sunk", "bg", "dock", "surface", "raised", "fill", "line", "edge"];
  const fora = [];
  for (const name of faces) {
    if (!t[name]) continue;
    const s = hexSat(t[name]);
    if (s > 0.06) fora.push(`${name} ${t[name]} S=${s.toFixed(2)}`);
  }
  const plateHasMix = /color-mix\(in oklab,\s*var\(--color-surface\).*var\(--color-ink\)/.test(cssText);
  return {
    rows: [
      { o: "faces com croma > 6%", v: String(fora.length), alvo: "0", ok: fora.length === 0 },
      { o: "plate mistura ink na face", v: plateHasMix ? "sim" : "não", alvo: "não", ok: !plateHasMix },
    ],
    detalhe: fora,
  };
}

/* ------------------------------------------------------------------ saída */

const EIXOS = {
  contraste: () => ({ rows: medirContraste(), detalhe: [] }),
  escala: medirEscala,
  tipos: medirTipos,
  regua: medirRegua,
  preenchido: medirPreenchido,
  acento: medirAcento,
  cor: medirCor,
  primitiva: medirPrimitiva,
  alvo: medirAlvo,
  movimento: medirMovimento,
  cerimonia: medirCerimonia,
  croma: medirCroma,
};

function show(name, res, verbose) {
  console.log(`\n── ${name}`);
  for (const r of res.rows) {
    const mark = r.ok ? "ok  " : "FORA";
    console.log(`  ${mark} ${r.o.padEnd(34)} ${String(r.v).padStart(7)}   alvo ${r.alvo}`);
  }
  if (verbose && res.detalhe?.length) {
    for (const d of res.detalhe.slice(0, 40)) console.log(`       · ${d}`);
    if (res.detalhe.length > 40) console.log(`       · ... e mais ${res.detalhe.length - 40}`);
  }
  return res.rows.filter((r) => !r.ok).length;
}

const arg = process.argv[2] ?? "tudo";
const verbose = process.argv.includes("-v") || arg !== "tudo";
let fora = 0;

if (arg === "tudo") {
  for (const [name, fn] of Object.entries(EIXOS)) fora += show(name, fn(), verbose);
} else if (EIXOS[arg]) {
  fora += show(arg, EIXOS[arg](), true);
} else {
  console.error(`eixo desconhecido: ${arg}\neixos: ${Object.keys(EIXOS).join(", ")}, tudo`);
  process.exit(2);
}

console.log(`\n${fora === 0 ? "todos os medidores na linha" : `${fora} medidor(es) fora da linha`}\n`);
process.exit(fora === 0 ? 0 : 1);
