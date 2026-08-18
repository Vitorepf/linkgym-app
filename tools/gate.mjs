#!/usr/bin/env node
// gate.mjs — o único lugar com direito de dizer "passou".
//
//   node tools/gate.mjs           roda as checagens de .gate/config.json
//   node tools/gate.mjs --lock    (HUMANO) grava .gate/lock.json com o sha256 dos protegidos
//
// exit 0 = mecânica ok   1 = checagem reprovou ou veto de estado   2 = integridade quebrada
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const DIR = join(ROOT, ".gate");
const CFG = join(DIR, "config.json");
const LOCK = join(DIR, "lock.json");
const ESTADO = join(DIR, "estado.json");
const SEIS = ["em_andamento", "aprovado", "aguardando_humano", "bloqueado", "esgotado", "estagnado"];

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const ler = (p, d) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return d; } };
const morre = (msg, code) => { console.error(msg); process.exit(code); };

if (!existsSync(CFG)) morre("GATE: SEM-CONFIG · falta .gate/config.json", 2);
const cfg = ler(CFG, null);
if (!cfg) morre("GATE: CONFIG-ILEGIVEL · .gate/config.json não é JSON válido", 2);
const checks = cfg.checks ?? [];
const eixos = cfg.eixos ?? [];
const protegidos = cfg.protegidos ?? [];

// A régua inclui o arquivo que define a régua. Sem isto, reescrever config.json
// com {"protegidos":[],"checks":[]} zerava o gate inteiro numa linha.
for (const obrigatorio of [".gate/config.json", "tools/gate.mjs", ".claude/hooks/stop-gate.mjs"]) {
  if (!protegidos.includes(obrigatorio)) protegidos.push(obrigatorio);
}

if (process.argv.includes("--lock")) {
  const l = {};
  for (const rel of protegidos) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) morre(`GATE: LOCK · protegido inexistente: ${rel}`, 2);
    l[rel] = sha(p);
  }
  mkdirSync(DIR, { recursive: true });
  writeFileSync(LOCK, JSON.stringify(l, null, 2) + "\n");
  console.log(`GATE: LOCK gravado · ${protegidos.length} arquivo(s) protegido(s)`);
  process.exit(0);
}

if (!checks.length) morre("GATE: SEM-CHECKS · config sem nenhuma checagem não mede nada", 2);
if (!eixos.length) morre("GATE: SEM-EIXOS · config sem eixo não tem o que julgar", 2);

// Integridade: quem mexe na régua perde o direito de dizer que passou.
const lock = ler(LOCK, null);
if (!lock) morre("GATE: SEM-LOCK · o humano roda `node tools/gate.mjs --lock`", 2);
for (const rel of protegidos) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) morre(`GATE: INTEGRIDADE · ${rel} sumiu`, 2);
  if (sha(p) !== lock[rel]) {
    morre(`GATE: INTEGRIDADE · ${rel} não bate com .gate/lock.json — a régua foi trocada.\nRestaure o arquivo. Adulterar o medidor não é permissão para parar.`, 2);
  }
}

const falhas = [];
for (const c of checks) {
  try {
    execFileSync(c.cmd, c.args ?? [], { cwd: ROOT, stdio: "pipe", timeout: (c.timeout_s ?? 60) * 1000 });
  } catch (e) {
    const cauda = `${e.stdout ?? ""}${e.stderr ?? ""}`.toString().trim().split("\n").slice(-8).join("\n");
    falhas.push(`  [${c.nome}] ${c.cmd} ${(c.args ?? []).join(" ")}\n${cauda || e.message}`);
  }
}

const st = ler(ESTADO, {}) ?? {};
const estado = st.estado ?? "ausente";

if (falhas.length) morre(`GATE: REPROVA ${falhas.length}/${checks.length} · estado=${estado}\n${falhas.join("\n")}`, 1);

if (estado !== "ausente" && !SEIS.includes(estado)) {
  morre(`GATE: VETO · estado="${estado}" não é um dos seis: ${SEIS.join(", ")}`, 1);
}

// O gate não vota "aprovado". Ele veta um "aprovado" sem lastro.
if (estado === "aprovado") {
  const v = st.vereditos ?? {};
  const semVeredito = eixos.filter((e) => !["venceu", "empatou"].includes(v[e]?.resultado));
  if (semVeredito.length) morre(`GATE: VETO · aprovado sem veredito venceu|empatou em: ${semVeredito.join(", ")}`, 1);

  const semLastro = eixos.filter((e) => !v[e]?.referencia || !v[e]?.artefato);
  if (semLastro.length) morre(`GATE: VETO · veredito sem caminho de referência E de artefato em: ${semLastro.join(", ")}\nVeredito sem caminho de arquivo é opinião.`, 1);

  const fantasma = eixos.filter((e) => !existsSync(join(ROOT, v[e].referencia)) || !existsSync(join(ROOT, v[e].artefato)));
  if (fantasma.length) morre(`GATE: VETO · caminho citado no veredito não existe em disco: ${fantasma.join(", ")}`, 1);

  const mesmo = eixos.filter((e) => join(ROOT, v[e].referencia) === join(ROOT, v[e].artefato));
  if (mesmo.length) morre(`GATE: VETO · referência e artefato são o mesmo arquivo em: ${mesmo.join(", ")}`, 1);

  // Terceira camada: veredito refutado nao conta, e veredito fora da barra nao conta.
  const refutados = eixos.filter((e) => v[e].refutado === true);
  if (refutados.length) morre(`GATE: VETO · veredito DESCARTADO pelo refutador em: ${refutados.join(", ")}`, 1);
  const foraDaBarra = eixos.filter((e) => v[e].na_barra !== true);
  if (foraDaBarra.length) morre(`GATE: VETO · veredito sem na_barra=true em: ${foraDaBarra.join(", ")}\nUm veredito pode ser verdadeiro e invalido: julgar fora da medida declarada nao vale.`, 1);

  // Nenhum número duro se moveu = o crítico aprovou sozinho. É a falha documentada.
  const base = ler(join(DIR, "base.json"), null);
  if (!base || !Object.keys(base).length) {
    morre("GATE: VETO · falta .gate/base.json com a linha de base da Fase 0.\nSem linha de base, melhora é opinião.", 1);
  }
  const agora = st.medidores ?? {};
  const moveu = Object.entries(base).filter(([k, b]) => {
    const n = agora[k];
    return typeof n === "number" && (b.melhor === "maior" ? n > b.valor : n < b.valor);
  });
  if (!moveu.length) {
    morre(`GATE: VETO · nenhum medidor saiu da linha de base: ${Object.keys(base).join(", ")}\nCrítico dizendo "venceu" com todo número parado foi exatamente o que falhou. Meça ou não aprove.`, 1);
  }

  // 11 críticos de contexto fresco erraram na mesma direção por 3 rodadas.
  const hist = ler(join(DIR, "historico.json"), []);
  for (const e of eixos) {
    const dir = hist.filter((r) => r?.[e]?.resultado === "perdeu").slice(-3);
    if (dir.length === 3 && new Set(dir.map((r) => r[e].motivo)).size === 1) {
      morre(`GATE: VETO · eixo ${e}: 3 reprovações seguidas com o MESMO motivo ("${dir[0][e].motivo}").\nConfira contra o medidor antes de obedecer de novo — o errado pode ser o crítico.`, 1);
    }
  }
}

if (["aguardando_humano", "bloqueado", "estagnado"].includes(estado) && (st.motivo ?? "").length < 20) {
  morre(`GATE: VETO · estado=${estado} exige motivo com 20+ caracteres nomeando a decisão e o dono`, 1);
}

console.log(`GATE: MECANICA-OK ${checks.length}/${checks.length} · estado=${estado}`);
process.exit(0);
