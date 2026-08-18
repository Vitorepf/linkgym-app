#!/usr/bin/env node
// Régua de contraste do app. WCAG 2.x de verdade, zero dependência: sRGB linearizado ->
// luminância relativa -> razão. Importa src/theme.ts direto (node ≥22.18 tira o tipo),
// então mede o MESMO código que a tela usa — sem cópia manual de token nem de fórmula.
//
// Três seções, e o gate é honesto sobre cada uma:
//   produto   — os tokens fixos (tinta, traço, aviso) contra os quatro fundos.
//   cru       — o acento do personal desenhado DIRETO por uma tela ou pelo nav. Isso não
//               pode existir: quem desenha pede o tom ao sistema. A seção varre a fonte e
//               cada lugar que ainda passa o acento cru é uma reprova, com o número da
//               pior marca. Nenhum vazamento = nada a medir = zero reprova.
//   derivado  — o que accentOn/accentFill/pressedFill entregam para as 20 marcas. É o
//               que de fato chega no pixel.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  accentFill,
  accentOn,
  contrast as ratio,
  dockActiveMin,
  errorInk,
  pressedFill,
  productTheme as T,
} from "../src/theme.ts";
import { BRANDS } from "./brands.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const TEXT = 4.5; // AA texto normal
const UI = 3; // AA elemento de interface / borda

const GROUNDS = [
  ["bg", T.bg],
  ["surface", T.surface],
  ["raised", T.raised],
  ["dock", T.dock],
];

// --------------------------------------------------------------------------- cru
// Uma propriedade de COR cujo valor menciona o acento. Uma chamada ao sistema é apagada
// antes da varredura: ali o acento está ENTRANDO no sistema, não saindo dele.
const SISTEMA = /accent(?:On|Fill|Set)\([^)]*\)/g;
const LEAK =
  /\b\w*(?:[Cc]olor|fill|stroke|tint)\w*\s*(?::|=)\s*\{?[^;{},]{0,120}?\baccent\w*\b/g;
const SCAN = ["src/screens", "src/nav"];

function* sources(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* sources(p);
    else if (/\.tsx?$/.test(name)) yield p;
  }
}

function leaksIn(text) {
  const src = text.replace(SISTEMA, "SISTEMA");
  return [...src.matchAll(LEAK)].map((m) => ({
    line: src.slice(0, m.index).split("\n").length,
    code: m[0].replace(/\s+/g, " ").trim(),
  }));
}

function leaks(root = ROOT) {
  const out = [];
  for (const dir of SCAN) {
    for (const file of sources(join(root, dir))) {
      for (const hit of leaksIn(readFileSync(file, "utf8"))) {
        out.push({ where: `${relative(root, file)}:${hit.line}`, code: hit.code });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
function rows() {
  const out = [];
  const par = (section, who, pair, fg, bg, min) =>
    out.push({ section, who, pair, got: ratio(fg, bg), min, how: `${fg} sobre ${bg}` });

  for (const [gn, g] of GROUNDS) {
    for (const [name, ink] of [
      ["ink", T.ink],
      ["muted", T.muted],
      ["muted2", T.muted2],
    ]) {
      par("produto", "(token)", `${name} sobre ${gn}`, ink, g, TEXT);
    }
    par("produto", "(token)", `divider sobre ${gn}`, T.divider, g, UI);
  }
  par("produto", "(token)", "ok sobre bg", T.ok, T.bg, TEXT);
  // o aviso de erro é escrito no chão da tela, nunca dentro de um bloco levantado
  par("produto", "(token)", "errorInk sobre bg", errorInk, T.bg, TEXT);

  // A pior marca é o argumento do vazamento: se o acento cru chega no StyleSheet, ela chega.
  const pior = BRANDS.map((b, i) => ({ i, b, r: ratio(b.accent, T.bg) })).sort(
    (a, b) => a.r - b.r,
  )[0];
  for (const l of leaks()) {
    out.push({
      section: "cru",
      who: l.where,
      pair: l.code.slice(0, 38),
      got: pior.r,
      min: UI,
      how: `marca ${pior.i} ${pior.b.name} sobre bg`,
    });
  }

  BRANDS.forEach((b, i) => {
    const who = `${i} ${b.name}`;
    for (const [gn, g] of GROUNDS) {
      par("derivado", who, `marca sobre ${gn}`, accentOn(b.accent, g, UI), g, UI);
      par("derivado", who, `texto sobre ${gn}`, accentOn(b.accent, g, TEXT), g, TEXT);
    }
    const { fill, ink } = accentFill(b.accent);
    par("derivado", who, "tinta sobre preenchimento", ink, fill, TEXT);
    // o preenchimento tem que EXISTIR contra o chão, senão o botão é retângulo invisível
    for (const [gn, g] of GROUNDS) {
      par("derivado", who, `preenchimento sobre ${gn}`, fill, g, UI);
    }
    par("derivado", who, "tinta sobre o toque", ink, pressedFill(fill, ink), TEXT);
    // A aba ativa do dock tem que DOMINAR as inativas, não empatar. O exigido não é 4,5:1:
    // é o contraste do muted2 das inativas vezes √2. Com 4,5 as marcas quase-fundo (13, 6,
    // 10, 11, 18) entregavam 4,53 na ativa contra 5,02 nas inativas — hierarquia invertida.
    par(
      "derivado",
      who,
      "aba ativa domina a inativa",
      accentOn(b.accent, T.dock, dockActiveMin),
      T.dock,
      dockActiveMin,
    );
  });
  return out;
}

function run() {
  const all = rows();
  const bad = all.filter((r) => r.got + 1e-9 < r.min);
  const w = (s, n) => String(s).padEnd(n);
  if (bad.length) {
    console.log(`${w("SEÇÃO", 10)}${w("ONDE", 30)}${w("PAR", 40)}${w("MEDIDO", 34)}EXIGIDO`);
    for (const r of bad) {
      console.log(
        `${w(r.section, 10)}${w(r.who, 30)}${w(r.pair, 40)}${w(`${r.how} = ${r.got.toFixed(2)}:1`, 34)}${r.min}:1`,
      );
    }
    console.log("");
  }
  for (const s of ["produto", "cru", "derivado"]) {
    const sec = all.filter((r) => r.section === s);
    const ruim = sec.filter((r) => bad.includes(r)).length;
    console.log(`${w(s, 10)}${String(sec.length).padStart(4)} pares · ${ruim} reprovam`);
  }
  console.log(`\n${all.length} pares medidos · ${bad.length} reprovam`);
  process.exit(bad.length ? 1 : 0);
}

// Autoteste do varredor: cinco formas de vazar e três de fazer certo. Roda sem preparo,
// `node tools/contrast.mjs --autoteste`, e é o que quebra se a expressão regular derrapar.
const FIXTURE = `
  <Text style={[s.k, { color: accent }]} />
  style={[s.i, focused && { borderTopColor: accent }]}
  { backgroundColor: i < filled ? accent : T.divider }
  const color = focused ? accent : T.muted2;
  error: { color: T.accentFallback, fontSize: 14 },
  <Initials name={n} size={34} fill={i === 0} accent={accent} />
  <Text style={{ color: accentOn(accent, T.bg, 4.5) }} />
  const A = accentSet(accent, T.raised);
`;

if (process.argv.includes("--autoteste")) {
  const hits = leaksIn(FIXTURE);
  for (const h of hits) console.log(`  linha ${h.line}  ${h.code}`);
  const ok = hits.length === 5;
  console.log(ok ? "autoteste OK: 5 vazamentos, 3 usos limpos" : `FALHOU: achou ${hits.length}, esperava 5`);
  process.exit(ok ? 0 : 1);
} else {
  run();
}
