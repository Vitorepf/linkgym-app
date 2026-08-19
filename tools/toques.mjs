#!/usr/bin/env node
// Fonte das catracas de DEDO: toques_serie, inclinacao_lote, toques_convite.
//
// Os números vêm de .gate/toques.json, que quem produz é tools/taps.mjs dirigindo o app
// de verdade no Chrome. Aqui não se calcula toque nenhum — só se lê, e se RECUSA ler
// número velho.
//
// A recusa é o ponto. Já aconteceu neste repo de um número de toque ser reportado como
// verificado depois de as telas terem mudado por baixo dele: rodar a ferramenta não é
// medir o produto se o produto andou desde então. Artefato mais velho que o código é
// mentira, e mentira aqui reprova em vez de passar.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ARTEFATO = join(ROOT, ".gate/toques.json");

/** Impressao digital do CONTEUDO de tudo que entra no bundle que o taps.mjs dirige.
 *
 *  Era mtime, e mtime mente: o Metro observando os arquivos, o git, e qualquer ferramenta
 *  que abra para escrever mexem na data sem mexer numa letra. O gate ficou vermelho com
 *  App.tsx e src/session.ts "alterados" e `git diff` vazio nos dois — medicao invalidada
 *  por motivo que nao e codigo e a mesma doenca da catraca que andava com o calendario.
 *
 *  sha256 do caminho + conteudo de cada arquivo, em ordem. Muda quando o codigo muda, e
 *  so entao. E o mesmo criterio que .gate/lock.json ja usa para os arquivos protegidos. */
export function impressaoDoCodigo() {
  const arquivos = [];
  const anda = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/node_modules|\.git/.test(e.name)) anda(p); }
      else if (/\.tsx?$/.test(e.name)) arquivos.push(p);
    }
  };
  anda(join(ROOT, "src"));
  for (const f of ["tools/fixtures.ts", "tools/shotHost.tsx", "App.tsx", "index.ts"]) {
    const p = join(ROOT, f);
    if (existsSync(p)) arquivos.push(p);
  }
  const h = createHash("sha256");
  for (const p of arquivos.sort()) {
    h.update(p.slice(ROOT.length));
    h.update(readFileSync(p));
  }
  return h.digest("hex");
}

export function medidas() {
  // RECUSA, não remede sozinho. O hook Stop mata o gate em 150s e uma corrida do taps
  // custa ~90s: remedir aqui dentro estouraria o relógio e o gate viraria "não pôde
  // rodar", que é bloqueio permanente disfarçado de falha. Recusar dá a mesma garantia
  // (número velho nunca passa) e devolve o comando exato em vez de um travamento.
  if (!existsSync(ARTEFATO)) {
    throw new Error(".gate/toques.json não existe.\n  Meça: node tools/taps.mjs --json");
  }
  const m = JSON.parse(readFileSync(ARTEFATO, "utf8"));
  if (m.codigo !== impressaoDoCodigo()) {
    throw new Error(".gate/toques.json foi medido sobre outro código.\n  Remeça: node tools/taps.mjs --json");
  }
  if (m.incompleto?.length) {
    throw new Error(`fluxo não rodou fim a fim: ${m.incompleto.join(" · ")}. Número de fluxo travado não é medição.`);
  }
  return m;
}

/** Um toque fecha a série. O teclado não abre — por isso `teclas` entra na conta: se um
 *  redesenho trocar o toque por digitação, a catraca tem que enxergar a troca. */
export const toques_serie = () => {
  const { serie } = medidas();
  console.error(`  série: ${serie.toques} toque(s) + ${serie.teclas} tecla(s)`);
  return serie.toques + serie.teclas;
};

/** Toques por aluno adicional ao publicar. É a tese do lote em um número: publicar para
 *  20 não pode custar 20 vezes publicar para 1. Valor absoluto não serve — ver
 *  docs/barra/eixo2-operacao-personal/RESSALVAS.md §4. */
export const inclinacao_lote = () => {
  const { lote } = medidas();
  console.error(`  lote: ${lote.um.toques} toque(s) p/ ${lote.um.alunos} · ${lote.turma.toques} p/ ${lote.turma.alunos}`);
  return lote.inclinacao;
};

/** Do convite à prescrição na mão. Toque e tecla SOMADOS, de propósito: são as duas
 *  moedas do mesmo dedo, e separar as duas deixaria passar um redesenho que troca um
 *  toque por vinte teclas e se declara melhor. */
export const toques_convite = () => {
  const { convite } = medidas();
  console.error(`  convite: ${convite.toques} toque(s) + ${convite.teclas} tecla(s)`);
  return convite.toques + convite.teclas;
};
