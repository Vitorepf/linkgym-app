#!/usr/bin/env node
// Catraca `carga_perdida`: itens de ficha em que o corpo TINHA o numero e a ficha nao usou.
//
// E a tese do produto em um numero. O dono do produto: "depois que o aluno ja esta usando,
// o app ja tem a estrutura do peso que ele pega em cada exercicio; ao trocar de treino ou
// mudar variacao, ja pega o peso que o proprio aluno esta fazendo".
//
// O QUE ISTO NAO MEDE, de proposito: quantos itens vem do corpo. Esse numero e refem de
// quanto os alunos treinaram, entao subiria e desceria sozinho e nao diria nada sobre o
// codigo. Aluno novo legitimamente tem zero historico.
//
// O que isto mede e uma FALHA DE TRANSFERENCIA: existe serie executada daquela pessoa
// naquele exercicio, e mesmo assim a ficha dela ficou com 'starter' — o chute do Modelo.
// Isso e sempre defeito, nunca circunstancia. Piso 0.
//
// 'manual' NAO conta como falha: e a excecao que o dono do produto exigiu que existisse —
// o personal cravou o numero de proposito, e mandar no proprio aluno e o trabalho dele.
import { execFileSync } from "node:child_process";

const PG = process.env.GATE_PG ?? "linkgym-api-postgres-1";

const sql = (q) => {
  try {
    return execFileSync("docker", ["exec", PG, "psql", "-U", "linkgym", "-d", "linkgym", "-tAc", q],
      { stdio: "pipe", timeout: 20000 }).toString().trim();
  } catch (e) {
    throw new Error(
      `nao deu para falar com o Postgres em '${PG}': ${`${e.stderr ?? e.message}`.trim().split("\n")[0]}\n` +
      `  Suba o banco: (cd ../linkgym-api && docker compose up -d postgres && make seed)`);
  }
};

const PERDIDAS = `
  SELECT count(*)
  FROM prescription_items pi
  JOIN prescriptions pr ON pr.id = pi.prescription_id AND pr.status = 'published'
  WHERE pi.load_source = 'starter'
    AND EXISTS (
      SELECT 1 FROM workout_sets ws
      JOIN workout_sessions s ON s.id = ws.session_id
      WHERE s.person_id = pr.person_id
        AND ws.exercise_id = pi.exercise_id
        AND ws.load_kg IS NOT NULL
    )`;

export const carga_perdida = () => {
  const total = Number(sql(`SELECT count(*) FROM prescription_items pi
    JOIN prescriptions pr ON pr.id = pi.prescription_id AND pr.status = 'published'`));
  const doCorpo = Number(sql(`SELECT count(*) FROM prescription_items pi
    JOIN prescriptions pr ON pr.id = pi.prescription_id AND pr.status = 'published'
    WHERE pi.load_source = 'history'`));
  const n = Number(sql(PERDIDAS));
  console.error(`  ${total} item(ns) publicado(s) · ${doCorpo} com carga do corpo · ${n} perdida(s)`);
  return n;
};

if (process.argv[1]?.endsWith("carga.mjs")) {
  try { console.log(`carga_perdida: ${carga_perdida()}`); } catch (e) { console.error(e.message); process.exit(1); }
}
