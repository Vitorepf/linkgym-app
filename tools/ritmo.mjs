#!/usr/bin/env node
// node tools/ritmo.mjs <arquivo.png|diretório>... [--min=6] [--scale=2] [--json] [--top=3]
//
// Mede o RITMO VERTICAL de um PNG de tela: os vãos entre uma coisa e a próxima.
// Devolve, em PONTOS: menor vão, mediana, maior vão e a razão maior/mediana.
// Razão alta = uma tela com um buraco e o resto espremido. Razão baixa = respiro
// distribuído. É o número do diagnóstico do dono: "maior vazio único 247pt, piso 3pt".
//
// Lê o pixel. Sem dependência: PNG cor 2/6 (RGB/RGBA), 8 bits, não entrelaçado —
// que é exatamente o que tools/shots.mjs escreve — desenrolado com zlib da stdlib.
import { crc32, deflateSync, inflateSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { productTheme as T } from "../src/theme.ts";

/** Distância de canal. Cru de propósito: os tokens do produto são chapados e exatos
 *  (#0b0a0a, #141312, #1c1a19), então 6/255 já separa fundo de fundo sem inventar. */
const INK = 8; // pixel que difere do fundo DA LINHA = tinta
const EDGE = 6; // fundo da linha mudou = borda (fio, topo de superfície) = marca

export function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("não é PNG");
  let width = 0, height = 0, channels = 0;
  const idat = [];
  for (let o = 8; o + 8 <= buf.length; ) {
    const len = buf.readUInt32BE(o);
    const type = buf.toString("latin1", o + 4, o + 8);
    const data = buf.subarray(o + 8, o + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const depth = data[8], color = data[9], interlace = data[12];
      if (depth !== 8 || interlace !== 0 || (color !== 2 && color !== 6)) {
        throw new Error(`PNG fora do previsto: depth ${depth} cor ${color} entrelace ${interlace}`);
      }
      channels = color === 2 ? 3 : 4;
    } else if (type === "IDAT") idat.push(Buffer.from(data));
    else if (type === "IEND") break;
    o += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const up = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0;
      const b = up ? up[i] : 0;
      const c = up && i >= channels ? up[i - channels] : 0;
      let v = line[i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[i] = v & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

/** Uma linha é MARCA se tem tinta sobre o próprio fundo, ou se o fundo dela mudou em
 *  relação à vizinha — um fio de 2px e o topo de uma superfície são a mesma coisa para o
 *  olho, e o medidor trata os dois igual para não favorecer nenhum dos dois desenhos. */
export function rowsWithMark({ width, height, channels, data }, modeOut) {
  const stride = width * channels;
  const mode = new Int32Array(height);
  const inked = new Uint8Array(height);
  const count = new Map();
  for (let y = 0; y < height; y++) {
    count.clear();
    const base = y * stride;
    let best = 0, bestN = -1;
    for (let x = 0; x < width; x++) {
      const i = base + x * channels;
      const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
      const n = (count.get(key) ?? 0) + 1;
      count.set(key, n);
      if (n > bestN) { bestN = n; best = key; }
    }
    mode[y] = best;
    const [mr, mg, mb] = [(best >> 16) & 255, (best >> 8) & 255, best & 255];
    let ink = 0;
    for (let x = 0; x < width && !ink; x++) {
      const i = base + x * channels;
      if (Math.abs(data[i] - mr) > INK || Math.abs(data[i + 1] - mg) > INK || Math.abs(data[i + 2] - mb) > INK) ink = 1;
    }
    inked[y] = ink;
  }
  const far = (a, b) =>
    Math.abs(((a >> 16) & 255) - ((b >> 16) & 255)) > EDGE ||
    Math.abs(((a >> 8) & 255) - ((b >> 8) & 255)) > EDGE ||
    Math.abs((a & 255) - (b & 255)) > EDGE;
  const mark = new Uint8Array(height);
  for (let y = 0; y < height; y++) {
    mark[y] =
      inked[y] || (y > 0 && far(mode[y], mode[y - 1])) || (y + 1 < height && far(mode[y], mode[y + 1])) ? 1 : 0;
  }
  if (modeOut) modeOut.mode = mode;
  return mark;
}

// O CHÃO NU: exatamente o token `bg`, o mesmo de app.json. Um vão pintado com ele não
// pertence a ninguém — é o buraco do diagnóstico. Qualquer outro fundo (superfície, doca,
// massa de acento) é padding de alguém e lê como intenção. O medidor não julga: separa.
const CHAO = ((c) => {
  const h = c.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
})(T.bg);

function noChao(key) {
  return (
    Math.abs(((key >> 16) & 255) - CHAO[0]) <= EDGE &&
    Math.abs(((key >> 8) & 255) - CHAO[1]) <= EDGE &&
    Math.abs((key & 255) - CHAO[2]) <= EDGE
  );
}

/** Vãos INTERNOS: entre a primeira e a última marca. O que sobra antes/depois é relatado
 *  à parte (`topo`/`rabo`) porque margem de tela não é vão entre duas coisas. */
export function ritmo(buf, { scale = 2, min = 6 } = {}) {
  const img = decodePng(buf);
  const box = {};
  const mark = rowsWithMark(img, box);
  const first = mark.indexOf(1);
  let last = -1;
  for (let y = img.height - 1; y >= 0; y--) if (mark[y]) { last = y; break; }
  if (first < 0) return { vaos: [], util: 0, topo: 0, rabo: 0, alturaPt: img.height / scale };

  const vaos = [];
  let run = 0;
  for (let y = first; y <= last; y++) {
    if (mark[y]) {
      if (run) {
        const meio = y - 1 - ((run / 2) | 0);
        vaos.push({ pt: run / scale, emPt: (y - run) / scale, nu: noChao(box.mode[meio]) });
      }
      run = 0;
    } else run++;
  }
  const grandes = vaos.filter((v) => v.pt >= min).sort((a, b) => a.pt - b.pt);
  const pts = grandes.map((v) => v.pt);
  const mediana = pts.length ? (pts.length % 2 ? pts[(pts.length - 1) / 2] : (pts[pts.length / 2 - 1] + pts[pts.length / 2]) / 2) : 0;
  const maior = pts.length ? pts[pts.length - 1] : 0;
  const nus = grandes.filter((v) => v.nu).map((v) => v.pt);
  return {
    vaos: grandes,
    menor: pts.length ? pts[0] : 0,
    mediana,
    maior,
    razao: mediana ? maior / mediana : 0,
    soma: pts.reduce((a, b) => a + b, 0),
    // buraco: o maior vão que cai no CHÃO NU. É o número do diagnóstico do dono — vazio
    // sem dono. `respiro` é a contraparte: vazio dentro de uma superfície.
    buraco: nus.length ? Math.max(...nus) : 0,
    nuSoma: nus.reduce((a, b) => a + b, 0),
    util: (last - first + 1) / scale,
    topo: first / scale,
    rabo: (img.height - 1 - last) / scale,
    alturaPt: img.height / scale,
  };
}

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function main() {
  const alvos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!alvos.length) {
    console.error("uso: node tools/ritmo.mjs <arquivo.png|diretório>... [--min=6] [--top=3] [--json]");
    process.exit(2);
  }
  const min = Number(arg("min", 6));
  const scale = Number(arg("scale", 2));
  const top = Number(arg("top", 3));
  const json = process.argv.includes("--json");

  const files = [];
  for (const a of alvos) {
    if (statSync(a).isDirectory()) {
      for (const n of readdirSync(a).sort()) if (extname(n) === ".png") files.push(join(a, n));
    } else files.push(a);
  }

  const linhas = files.map((f) => ({ tela: basename(f, ".png"), ...ritmo(readFileSync(f), { scale, min }) }));
  if (json) {
    console.log(JSON.stringify(linhas.map(({ vaos, ...r }) => ({ ...r, vaos: vaos.map((v) => v.pt) })), null, 2));
    return;
  }
  const w = Math.max(...linhas.map((l) => l.tela.length));
  for (const l of linhas) {
    const maiores = [...l.vaos].reverse().slice(0, top).map((v) => `${v.pt}${v.nu ? "nu" : ""}@${v.emPt}`).join(" ");
    console.log(
      `${l.tela.padEnd(w)}  menor ${String(l.menor).padStart(5)}  mediana ${String(l.mediana).padStart(5)}` +
        `  maior ${String(l.maior).padStart(6)}  razão ${l.razao.toFixed(1).padStart(5)}` +
        `  buraco ${String(l.buraco).padStart(6)}  vãos ${String(l.vaos.length).padStart(3)}` +
        `  soma ${String(l.soma).padStart(5)}  nu ${String(l.nuSoma).padStart(5)}  ${maiores}`,
    );
  }
  if (linhas.length > 1) {
    const med = (xs) => [...xs].sort((a, b) => a - b)[(xs.length - 1) >> 1];
    const pior = linhas.reduce((a, b) => (b.razao > a.razao ? b : a));
    console.log(
      `\n${linhas.length} tela(s) · razão mediana ${med(linhas.map((l) => l.razao)).toFixed(1)}` +
        ` · pior ${pior.tela} ${pior.razao.toFixed(1)}` +
        ` · maior vão do conjunto ${Math.max(...linhas.map((l) => l.maior))}pt` +
        ` · maior buraco ${Math.max(...linhas.map((l) => l.buraco))}pt` +
        ` · buraco mediano ${med(linhas.map((l) => l.buraco))}pt`,
    );
  }
}

// --------------------------------------------------------------------------- autoteste
// `node tools/ritmo.mjs --autoteste`. Uma tela SINTÉTICA com três vãos conhecidos, escrita
// em PNG de verdade e lida pelo mesmo caminho das telas: se o decodificador, a detecção de
// marca ou a conta de mediana derrapar, os números não batem e o processo sai 1.
function png(width, height, paint) {
  const px = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = paint(x, y);
      const i = y * (width * 3 + 1) + 1 + x * 3;
      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = b;
    }
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
    chunk("IDAT", deflateSync(px)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function autoteste() {
  const hex = (c) => {
    const h = c.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const CHAO_RGB = hex(T.bg);
  const SUP = hex(T.raised);
  const TINTA = hex(T.ink);
  // y 0-1 marca · 2-21 chão (20px = 10pt) · 22-23 marca · 24-63 chão (40px = 20pt)
  // 64-65 marca · 66-165 superfície (bordas em 66 e 165, vão interno 98px = 49pt)
  // 166-167 marca · 168-199 rabo.
  const buf = png(40, 200, (x, y) => {
    if (y >= 66 && y <= 165) return SUP;
    const marca = y <= 1 || (y >= 22 && y <= 23) || (y >= 64 && y <= 65) || (y >= 166 && y <= 167);
    return marca && x < 10 ? TINTA : CHAO_RGB;
  });
  const r = ritmo(buf, { scale: 2, min: 1 });
  const got = r.vaos.map((v) => `${v.pt}${v.nu ? "nu" : "sup"}`).join(" ");
  const esperado = "10nu 20nu 49sup";
  const checks = [
    [got === esperado, `vãos ${got} (esperava ${esperado})`],
    [r.menor === 10, `menor ${r.menor} (esperava 10)`],
    [r.mediana === 20, `mediana ${r.mediana} (esperava 20)`],
    [r.maior === 49, `maior ${r.maior} (esperava 49)`],
    [r.buraco === 20, `buraco ${r.buraco} (esperava 20)`],
    [r.rabo === 16, `rabo ${r.rabo} (esperava 16)`],
  ];
  const ruins = checks.filter(([ok]) => !ok);
  for (const [, msg] of ruins) console.log(`  FALHOU: ${msg}`);
  console.log(ruins.length ? `autoteste REPROVADO: ${ruins.length} de ${checks.length}` : "autoteste OK: 3 vãos, 1 com dono, 2 no chão nu");
  process.exit(ruins.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  if (process.argv.includes("--autoteste")) autoteste();
  else main();
}
