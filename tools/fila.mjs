#!/usr/bin/env node
// Catraca `fila`: casos em que a Atenção do dia acumulou mais de 3 nomes num dia.
//
// O CONTEXT.md diz, no verbete Atenção do dia: "Fila curta de alunos daquele time que
// precisam de um toque agora. Nunca a turma inteira. O protótipo cabe em 3."
//
// POR QUE ISTO NÃO MEDE A SAÍDA DA TELA. `loadAttention` corta com `LIMIT 3` no SQL, então
// a lista que chega na tela tem no máximo 3 nomes SEMPRE, e um medidor sobre ela leria 0
// para sempre sem medir nada — mediria o LIMIT, não o produto. O número que importa é
// quantos candidatos a REGRA gerou antes do corte: aí é que se vê gente sumindo em
// silêncio. É o modo de falha que a MFIT expõe no `Resolver todos (11)` — ver
// docs/barra/eixo2-operacao-personal/RESSALVAS.md §2. Piso 0 quer dizer: o corte é regra,
// não truncamento.
import { execFileSync } from "node:child_process";

const PG = process.env.GATE_PG ?? "linkgym-api-postgres-1";

/** Piso de pressão. Abaixo disto o seed não tem o que a catraca promete medir e o 0 seria
 *  falso verde — o erro que já custou caro neste repo: rodar a ferramenta não é validar o
 *  que ela mede. Recusar é a única leitura honesta. */
const MINIMO_ALUNOS = 20;

const sql = (q) => {
  try {
    return execFileSync("docker", ["exec", PG, "psql", "-U", "linkgym", "-d", "linkgym", "-tAc", q],
      { stdio: "pipe", timeout: 20000 }).toString().trim();
  } catch (e) {
    throw new Error(
      `não deu para falar com o Postgres em '${PG}': ${`${e.stderr ?? e.message}`.trim().split("\n")[0]}\n` +
      `  Suba o banco: (cd ../linkgym-api && docker compose up -d postgres && make seed)\n` +
      `  Banco fora do ar não é catraca verde — é catraca que não rodou.`);
  }
};

export const fila = () => {
  // role='student': o vinculo do proprio dono tambem e 'active' e inflava a conta em 1.
  // O rotulo dizia "vinculos ativos" e o numero era outro — pequeno, mas e assim que
  // medidor comeca a mentir.
  const alunos = Number(sql(`SELECT count(*) FROM bonds WHERE status = 'active' AND role = 'student'`));
  if (!Number.isFinite(alunos) || alunos < MINIMO_ALUNOS) {
    throw new Error(
      `seed sem pressão: ${alunos} vínculo(s) ativo(s), mínimo ${MINIMO_ALUNOS}.\n` +
      `  Com turma pequena a fila nunca passa de 3 e a catraca leria 0 por falta de dado.\n` +
      `  Semeie de verdade: (cd ../linkgym-api && make seed)`);
  }
  // PESSOAS DESCARTADAS no pior dia, nao dias em que a fila estourou.
  //
  // A primeira versao contava dias com mais de 3 candidatos, e ela subiu de 1 para 2
  // sozinha: o banco e UTC, cruzou a meia-noite no meio do trabalho e o seed rodou dos
  // dois lados da virada. Nada no produto piorou — o relogio andou. Catraca que sobe
  // porque o tempo passou e catraca que todo mundo aprende a ignorar.
  //
  // Este numero nao anda com o calendario e diz a coisa que importa: quantas pessoas
  // entraram na fila e nao aparecem para o personal. Piso 0 quer dizer que o corte virou
  // REGRA — o que sobrar de fora sobra porque a regra decidiu, nao porque o LIMIT cortou.
  const pior = Number(sql(
    `SELECT COALESCE(MAX(n), 0) FROM (SELECT count(*) AS n FROM attention_items GROUP BY studio_id, for_date) q`));
  const n = Math.max(0, pior - 3);
  console.error(`  ${alunos} vínculo(s) ativo(s) · pior dia com ${pior} candidato(s) · ${n} pessoa(s) descartada(s) em silêncio`);
  return n;
};

if (process.argv[1]?.endsWith("fila.mjs")) {
  try { console.log(`fila: ${fila()}`); } catch (e) { console.error(e.message); process.exit(1); }
}
