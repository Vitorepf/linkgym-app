#!/usr/bin/env node
// Gate de zero mudança visual: sha256 por arquivo. Igual = passa.
// ponytail: hash resolve "bit-idêntico". Se algum dia precisarmos SABER QUAL REGIÃO mudou,
// é aqui que entra o decode do PNG e a varredura por pixel (nova dependência, ou zlib+
// unfilter à mão). Até então, hash é o gate honesto e custa 20 linhas.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

function walk(dir, base = dir, out = new Map()) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else out.set(relative(base, p).split(sep).join("/"), createHash("sha256").update(readFileSync(p)).digest("hex"));
  }
  return out;
}

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error("uso: node tools/pixeldiff.mjs <dirA> <dirB>");
  process.exit(2);
}

let A, B;
try {
  A = walk(a);
  B = walk(b);
} catch (err) {
  console.error(`não deu para ler: ${err.message}`);
  process.exit(2);
}

const onlyA = [...A.keys()].filter((k) => !B.has(k));
const onlyB = [...B.keys()].filter((k) => !A.has(k));
const changed = [...A.keys()].filter((k) => B.has(k) && A.get(k) !== B.get(k));

for (const k of onlyA) console.log(`SÓ EM A   ${k}`);
for (const k of onlyB) console.log(`SÓ EM B   ${k}`);
for (const k of changed) console.log(`MUDOU     ${k}  ${A.get(k).slice(0, 12)} -> ${B.get(k).slice(0, 12)}`);

const fail = onlyA.length + onlyB.length + changed.length;
console.log(
  `\n${A.size} arquivo(s) em A · ${B.size} em B · ${changed.length} mudou · ${onlyA.length} só em A · ${onlyB.length} só em B`,
);
if (fail) console.log("REPROVADO: o conjunto de shots não é bit-idêntico.");
else console.log("OK: bit-idêntico.");
process.exit(fail ? 1 : 0);
