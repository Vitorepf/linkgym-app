#!/usr/bin/env node
// Catraca `telas`: quantas telas montam LIMPAS nas 20 marcas — sem tela branca, sem erro
// de console, sem rota sem fixture. Só sobe.
//
// Conta tela INTEIRA: a que passa em 19 marcas e some na 13 (acento igual ao fundo) não
// entra. Meia cobertura não é cobertura, e a marca 13 é justamente o pior caso que o
// produto promete aguentar.
//
// Como toques.mjs, este medidor RECUSA artefato mais velho que o código em vez de remedir
// sozinho: 30 telas x 20 marcas são 600 montagens, muito além dos 150s que o hook Stop dá
// ao gate. Remedir aqui dentro viraria "gate não pôde rodar", que é bloqueio disfarçado.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { impressaoDoCodigo } from "./toques.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ARTEFATO = join(ROOT, ".gate/telas.json");

export const telas = () => {
  if (!existsSync(ARTEFATO)) {
    throw new Error(".gate/telas.json não existe.\n  Meça: node tools/shots.mjs --check");
  }
  const m = JSON.parse(readFileSync(ARTEFATO, "utf8"));
  if (m.codigo !== impressaoDoCodigo()) {
    throw new Error(".gate/telas.json foi medido sobre outro código.\n  Remeça: node tools/shots.mjs --check");
  }
  console.error(`  ${m.telas}/${m.testadas} tela(s) inteira(s) em ${m.marcas} marca(s)`);
  for (const q of m.quebradas ?? []) console.error(`  QUEBRA marca ${q.marca} · ${q.tela}: ${q.problemas.join(" | ")}`);
  return m.telas;
};

if (process.argv[1]?.endsWith("cobertura.mjs")) {
  try { console.log(`telas: ${telas()}`); } catch (e) { console.error(e.message); process.exit(1); }
}
