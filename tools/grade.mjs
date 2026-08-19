#!/usr/bin/env node
// node tools/grade.mjs <arquivo.png|diretório>... [--scale=2] [--json]
//
// Mede a GRADE HORIZONTAL de um PNG de tela: as linhas divididas por fios verticais
// (MetricGrid e afins). O fio pode dividir a largura em partes geometricamente iguais e a
// linha ainda LER torta — foi o defeito do dono na fila ENERGIA · DOR · SONO: célula de
// largura igual com conteúdo à esquerda deixa 36px antes da tinta e ~90px depois, e o olho
// lê "SONO sobra à direita, ENERGIA cola na esquerda".
//
// O número: para cada célula entre fios, |folga esquerda − folga direita| da tinta, em
// PONTOS. O desvio da tela é o pior desvio das células. Zero = cada coluna oticamente
// centrada na parte que o fio lhe dá. Menor é melhor.
//
// Lê o pixel pelo MESMO decodificador de tools/ritmo.mjs. Sem dependência.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { crc32, deflateSync } from "node:zlib";
import { decodePng } from "./ritmo.mjs";
import { productTheme as T } from "../src/theme.ts";

const INK = 8; // mesmo limiar do ritmo: token difere de token por mais que isto

const px = (img, x, y) => {
  const i = (y * img.width + x) * img.channels;
  return [img.data[i], img.data[i + 1], img.data[i + 2]];
};
const diff = (a, b) =>
  Math.abs(a[0] - b[0]) > INK || Math.abs(a[1] - b[1]) > INK || Math.abs(a[2] - b[2]) > INK;

// Um FIO define a própria faixa: coluna fina que difere do fundo por um trecho contínuo
// ≥ MIN_FIO, com o MESMO fundo a 5px dos dois lados. Borda de caixa (Choice, GhostCTA,
// avatar) é mais curta que MIN_FIO; tinta de texto é mais gorda que 10px ou não segura o
// trecho; borda de massa tem fundos DIFERENTES dos dois lados. Nada disso entra.
const MIN_FIO = 120; // px = 60pt

function fioCond(img, x, y) {
  const c = px(img, x, y);
  const l = px(img, x - 5, y);
  const r = px(img, x + 5, y);
  return diff(c, l) && diff(c, r) && !diff(l, r);
}

/** Todos os fios da tela: {x, y0, y1}. */
function fios(img) {
  const segs = [];
  for (let x = 5; x < img.width - 5; x++) {
    let run = 0;
    for (let y = 0; y <= img.height; y++) {
      if (y < img.height && fioCond(img, x, y)) run++;
      else {
        if (run >= MIN_FIO) segs.push({ x, y0: y - run, y1: y });
        run = 0;
      }
    }
  }
  // colunas vizinhas (fio de 2px) viram um fio só. A lista intercala segmentos de linhas
  // de células diferentes no mesmo x, então a fusão olha os últimos fios, não só o último.
  const out = [];
  for (const s of segs) {
    let merged = false;
    for (let k = out.length - 1; k >= Math.max(0, out.length - 6); k--) {
      const o = out[k];
      if (s.x - o.xEnd <= 2 && s.y0 < o.y1 && s.y1 > o.y0) {
        o.xEnd = Math.max(o.xEnd, s.x);
        o.y0 = Math.max(o.y0, s.y0);
        o.y1 = Math.min(o.y1, s.y1);
        merged = true;
        break;
      }
    }
    if (!merged) out.push({ xStart: s.x, xEnd: s.x, y0: s.y0, y1: s.y1 });
  }
  return out.map((f) => ({ x: (f.xStart + f.xEnd) / 2, y0: f.y0, y1: f.y1 }));
}

/** Agrupa fios com faixa vertical em comum numa GRADE. Fios a menos de 80px um do outro
 *  são caixa, não grade: o grupo é descartado. */
function grades(img) {
  const all = fios(img).sort((a, b) => a.x - b.x);
  const used = new Set();
  const out = [];
  for (let i = 0; i < all.length; i++) {
    if (used.has(i)) continue;
    const grupo = [all[i]];
    used.add(i);
    for (let j = i + 1; j < all.length; j++) {
      if (used.has(j)) continue;
      const g = grupo[grupo.length - 1];
      const overlap = Math.min(g.y1, all[j].y1) - Math.max(g.y0, all[j].y0);
      if (overlap >= (g.y1 - g.y0) * 0.8) {
        grupo.push(all[j]);
        used.add(j);
      }
    }
    const y0 = Math.max(...grupo.map((f) => f.y0));
    const y1 = Math.min(...grupo.map((f) => f.y1));
    let perto = false;
    for (let k = 1; k < grupo.length; k++) if (grupo[k].x - grupo[k - 1].x < 80) perto = true;
    if (perto) continue;
    // fundo da faixa: cor mais comum
    const count = new Map();
    for (let y = y0; y < y1; y += 2)
      for (let x = 0; x < img.width; x += 2) {
        const [r, g, b] = px(img, x, y);
        const k = (r << 16) | (g << 8) | b;
        count.set(k, (count.get(k) ?? 0) + 1);
      }
    const bgKey = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const bg = [(bgKey >> 16) & 255, (bgKey >> 8) & 255, bgKey & 255];
    const centers = grupo.map((f) => f.x);
    // Limites horizontais da grade: a borda da PRÓPRIA grade (o traço horizontal contíguo
    // logo acima ou abaixo dos fios), não a borda da tela — uma grade dentro de uma faixa
    // com padding tem células que começam no padding, e medi-las até a tela inflaria a
    // folga externa. Sem traço, a grade é sangrada e a tela é o limite.
    let left = 0;
    let right = img.width;
    let best = null;
    const linhas = [];
    for (let y = Math.max(0, y0 - 8); y < Math.min(img.height, y0 + 2); y++) linhas.push(y);
    for (let y = Math.max(0, y1 - 2); y < Math.min(img.height, y1 + 8); y++) linhas.push(y);
    for (const y of linhas) {
      let run = 0;
      let x0 = 0;
      for (let x = 0; x <= img.width; x++) {
        const on = x < img.width && diff(px(img, x, y), bg);
        if (on) {
          if (!run) x0 = x;
          run++;
        } else {
          if (run >= img.width * 0.6 && (!best || run > best.len)) best = { len: run, x0, x1: x - 1 };
          run = 0;
        }
      }
    }
    if (best && best.x0 < Math.min(...centers) && best.x1 > Math.max(...centers)) {
      left = best.x0;
      right = best.x1 + 1;
    }
    out.push({ centers, y0, y1, left, right, bg });
  }
  return out;
}

/** Desvio de uma célula: |folga esquerda − folga direita| da tinta, em px. */
function desvioDaCelula(img, y0, y1, x0, x1, bg) {
  let inkMin = -1, inkMax = -1;
  for (let x = x0 + 3; x <= x1 - 3; x++) {
    let has = false;
    for (let y = y0; y < y1 && !has; y++) if (diff(px(img, x, y), bg)) has = true;
    if (has) {
      if (inkMin < 0) inkMin = x;
      inkMax = x;
    }
  }
  if (inkMin < 0) return null; // célula vazia não é desvio
  return Math.abs(inkMin - x0 - (x1 - 1 - inkMax));
}

export function grade(buf, { scale = 2 } = {}) {
  const img = decodePng(buf);
  const faixas = [];
  for (const g of grades(img)) {
    const cortes = [g.left, ...g.centers, g.right];
    const celulas = [];
    for (let c = 1; c < cortes.length; c++) {
      const d = desvioDaCelula(img, g.y0, g.y1, Math.ceil(cortes[c - 1]), Math.floor(cortes[c]), g.bg);
      if (d !== null) celulas.push(d / scale);
    }
    if (celulas.length) faixas.push({ emPt: g.y0 / scale, desvio: Math.max(...celulas), celulas });
  }
  return {
    faixas,
    desvio: faixas.length ? Math.max(...faixas.map((f) => f.desvio)) : 0,
  };
}

function main() {
  const alvos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!alvos.length) {
    console.error("uso: node tools/grade.mjs <arquivo.png|diretório>... [--scale=2] [--json]");
    process.exit(2);
  }
  const json = process.argv.includes("--json");
  const files = [];
  for (const a of alvos) {
    if (statSync(a).isDirectory()) {
      for (const n of readdirSync(a).sort()) if (extname(n) === ".png") files.push(join(a, n));
    } else files.push(a);
  }
  const linhas = files.map((f) => ({ tela: basename(f, ".png"), ...grade(readFileSync(f)) }));
  if (json) {
    console.log(JSON.stringify(linhas, null, 2));
    return;
  }
  const w = Math.max(...linhas.map((l) => l.tela.length));
  for (const l of linhas) {
    const det = l.faixas
      .map((f) => `${f.desvio.toFixed(1)}@${f.emPt}(${f.celulas.map((c) => c.toFixed(0)).join("/")})`)
      .join(" ");
    console.log(`${l.tela.padEnd(w)}  grades ${String(l.faixas.length).padStart(2)}  desvio ${l.desvio.toFixed(1).padStart(6)}  ${det}`);
  }
  if (linhas.length > 1) {
    const pior = linhas.reduce((a, b) => (b.desvio > a.desvio ? b : a));
    console.log(`\n${linhas.length} tela(s) · pior ${pior.tela} ${pior.desvio.toFixed(1)}pt`);
  }
}

// --------------------------------------------------------------------------- autoteste
// Uma grade sintética de 3 células entre duas bordas, com desvios CONHECIDOS por célula:
// 0 (centrada), 30px (esquerda) e 16px (direita). Se a detecção de borda, de fio ou a
// conta de folga derrapar, os números não batem e o processo sai 1.
function png(width, height, paint) {
  const raw = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint(x, y);
      const i = y * (width * 3 + 1) + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function autoteste() {
  const hex = (c) => {
    const h = c.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const CHAO = hex(T.bg);
  const TINTA = hex(T.ink);
  const FIO = hex(T.divider);
  // 600x400: fios em x 200 e 400 (y 44..357, 314px ≥ MIN_FIO); uma borda de caixa CURTA
  // em x 300 (30px) que NÃO pode virar fio.
  // célula 1 (0..200): tinta 60..139 → folgas 60/60, desvio 0
  // célula 2 (200..400): tinta 220..299 → folgas 20/100, desvio 80px = 40pt
  // célula 3 (400..600): tinta 480..563 → folgas 80/36, desvio 44px = 22pt
  const buf = png(600, 400, (x, y) => {
    if (y > 43 && y < 358 && (x === 200 || x === 400)) return FIO;
    if (x === 300 && y >= 365 && y < 395) return FIO;
    const texto =
      y > 150 && y < 250 &&
      ((x >= 60 && x < 140) || (x >= 220 && x < 300) || (x >= 480 && x < 564));
    return texto ? TINTA : CHAO;
  });
  const r = grade(buf, { scale: 2 });
  const got = r.faixas.map((f) => f.celulas.map((c) => c.toFixed(0)).join("/")).join(" ");
  const checks = [
    [r.faixas.length === 1, `faixas ${r.faixas.length} (esperava 1)`],
    [got === "0/40/22", `células ${got} (esperava 0/40/22)`],
    [r.desvio === 40, `desvio ${r.desvio} (esperava 40)`],
  ];
  const ruins = checks.filter(([ok]) => !ok);
  for (const [, msg] of ruins) console.log(`  FALHOU: ${msg}`);
  console.log(
    ruins.length
      ? `autoteste REPROVADO: ${ruins.length} de ${checks.length}`
      : "autoteste OK: 1 grade, 3 células, desvios 0/40/22",
  );
  process.exit(ruins.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (process.argv.includes("--autoteste")) autoteste();
  else main();
}
