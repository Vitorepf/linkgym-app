#!/usr/bin/env node
// node tools/palavras.mjs culpa|proibidas
// Duas catracas de LÍNGUA sobre src/, com o COMENTÁRIO APAGADO antes de medir.
//
// Apagar comentário não é frouxidão, é o oposto: a primeira versão media o texto cru e
// acusou 37 vezes — quase todas em comentários que existem PARA não acusar ("falha é
// AUSÊNCIA de marca", "não existe a palavra culpa"). Uma catraca que exige apagar o
// raciocínio que a sustenta mede o avesso do que promete. O que sobra depois do corte é
// código e string, e string é o que a pessoa lê.
//
// O corte preserva a coluna (comentário vira espaço), então file:line continua exato.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CONTEXT = join(ROOT, "../linkgym-api/CONTEXT.md");

function arquivos(dir, acc = [], ext = /\.tsx?$/) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.git|^out$/.test(e.name)) arquivos(p, acc, ext); }
    else if (ext.test(e.name)) acc.push(p);
  }
  return acc;
}

/** O Go da API, sem teste. A frase que o aluno lê nem sempre nasce no app: `coach_line` e
 *  a linha da Retomada saem daqui. Varrer só src/ deixava esse texto sem catraca — e foi
 *  assim que "Sem culpa..." viveu numa constante sem ninguém medir. */
const goDaApi = (semOwner) =>
  arquivos(join(ROOT, "../linkgym-api/internal"), [], /\.go$/)
    .concat(arquivos(join(ROOT, "../linkgym-api/cmd"), [], /\.go$/))
    .filter((p) => !/_test\.go$/.test(p))
    .filter((p) => !semOwner || !/[/\\]internal[/\\]owner[/\\]/.test(p));

/** Sem acento e sem caixa: "Inadimplência" e "inadimplencia" são a mesma proibição. */
const nu = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Apaga comentário mantendo tamanho e quebra de linha. Serve para TS e para Go: os
 *  dois usam as mesmas duas formas de comentario e as mesmas aspas.
 *  Precisa de maquina de estados de
 *  verdade: `"https://media.invalido/x.mp4"` tem `//` dentro de string e um regex ingênuo
 *  comeria o resto da linha. */
export function semComentario(src) {
  let out = "", i = 0, st = "codigo", aspas = "";
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (st === "codigo") {
      if (c === "/" && d === "/") { st = "linha"; out += "  "; i += 2; continue; }
      if (c === "/" && d === "*") { st = "bloco"; out += "  "; i += 2; continue; }
      if (c === '"' || c === "'" || c === "`") { st = "texto"; aspas = c; }
      out += c; i += 1; continue;
    }
    if (st === "texto") {
      if (c === "\\") { out += c + (d ?? ""); i += 2; continue; }
      if (c === aspas) st = "codigo";
      out += c; i += 1; continue;
    }
    // dentro de comentário: só a quebra de linha sobrevive, para o número da linha bater.
    if (st === "linha" && c === "\n") { st = "codigo"; out += c; i += 1; continue; }
    if (st === "bloco" && c === "*" && d === "/") { st = "codigo"; out += "  "; i += 2; continue; }
    out += c === "\n" ? c : " "; i += 1;
  }
  return out;
}

/** Acha o termo como PALAVRA, não como pedaço, e nunca como método de objeto.
 *
 *  Sem o limite de palavra, "plano" casa em `planned_sets`. Sem o `(?<!\\.)`, o `split` de
 *  pagamento (proibido pela Mensalidade) casa em `name.split(" ")` — sete vezes, todas
 *  falsas. Catraca que não pode chegar a zero não é catraca, é ruído que todo mundo
 *  aprende a ignorar. */
function ocorrencias(files, termos) {
  const hits = [];
  const res = termos.map((t) => ({ t, re: new RegExp(`(?<![a-z0-9_.])${nu(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s_-]+")}(?![a-z0-9_])`, "g") }));
  for (const p of files) {
    const linhas = semComentario(readFileSync(p, "utf8")).split("\n");
    for (let i = 0; i < linhas.length; i++) {
      const cru = nu(linhas[i]);
      for (const { t, re } of res) {
        re.lastIndex = 0;
        if (re.test(cru)) hits.push({ file: relative(ROOT, p), line: i + 1, termo: t, texto: linhas[i].trim().slice(0, 110) });
      }
    }
  }
  return hits;
}

// ------------------------------------------------------------------ culpa
// Palavra que ACUSA o aluno. Ele tem 15 a 75 anos e some por vergonha: a tela dele nunca
// diz o que ele deixou de ser. Lista curada à mão, não derivada — o CONTEXT.md descreve o
// domínio, não o tom.
//
// Fora da lista de propósito, e cada um por um motivo:
//   "falta"  — em "faltam 2 séries" é contagem do que resta, não acusação.
//   "zerada" — Ofensiva zerada é ESTADO do domínio, e é como a barra mostra
//              (docs/barra/eixo3-ritual-aluno/duolingo-20-ofensiva-zerada-faixa-na-home.jpg).
//   "ruim", "fraco", "pior" — adjetivo sobre a SEMANA não é rótulo sobre a PESSOA. O
//              Compromisso pergunta "quantos dias na semana ruim?" para achar o piso que
//              ele cumpre sempre; isso é o contrário de acusar. A lista guarda palavra que
//              vira CRACHÁ de pessoa — falhou, atrasado, pendente, inadimplente —, não
//              adjetivo de circunstância.
export const CULPA = [
  "falhou", "falhei", "falhas", "falha", "fracasso", "fracassou",
  "perdeu", "perdido", "perdidos", "perdida", "perdidas",
  "atrasado", "atrasada", "atraso", "pendente", "pendentes", "pendencia",
  "inadimplente", "inadimplencia", "devedor", "caloteiro",
  "desistiu", "desistente", "abandonou", "abandono", "sumiu", "sumido", "sumida",
  "faltou", "faltoso", "ausente", "ausencia",
  "preguica", "preguicoso", "desculpa", "desculpas", "negligenciou", "negligencia",
  "culpa", "culpado", "vergonha", "decepcionou", "decepcao", "frustrou",
  "puniu", "punicao", "castigo", "cobranca", "cobrar",
  "esqueceu", "deveria", "devia", "precisava",
];

/** Só o que o ALUNO lê. A tela do personal PODE dizer "9 dias sem treinar": é fato de
 *  trabalho para quem decide, e não chega nos olhos de quem sumiu. src/ui entra porque é
 *  compartilhado — na dúvida, o lado severo. */
export const olhosDoAluno = () =>
  arquivos(join(ROOT, "src"))
    .filter((p) => !/[/\\]screens[/\\]owner[/\\]/.test(p) && !/[/\\]nav[/\\]OwnerTabs\.tsx$/.test(p))
    .concat(goDaApi(true));

export const culpa = () => ocorrencias(olhosDoAluno(), CULPA);

// -------------------------------------------------------------- proibidas
// A lista vem do CONTEXT.md, que é lei: as linhas `_Avoid_:` de cada verbete. Derivar em
// vez de copiar é o que impede a lista de envelhecer — palavra nova no CONTEXT.md vira
// catraca sozinha.
export function avoidDoContext() {
  const md = readFileSync(CONTEXT, "utf8");
  const termos = new Set();
  for (const m of md.matchAll(/^_Avoid_:\s*(.+)$/gm)) {
    for (const t of m[1].split(",")) { const s = t.trim(); if (s) termos.add(s); }
  }
  return [...termos];
}

/** O CONTEXT.md usa algumas destas palavras POSITIVAMENTE em outros verbetes. Avoid ali
 *  quer dizer "não use como sinônimo DESTE termo", não "a palavra está banida". Cada
 *  exceção cita onde o próprio CONTEXT.md a usa de bom grado. Sem isto a catraca nasce
 *  em centenas e nunca chega a zero. */
export const EXCECOES = {
  ficha: "Vínculo: 'o vínculo ativo escolhe nome na tela, ficha atual'",
  treino: "Cumprimento e Prontidão falam de treino como o ato, não como o Modelo",
  turma: "Vínculo: 'turma é a lista de alunos daquele time'",
  conta: "Pessoa: 'conta humana identificada por telefone'",
  marca: "Time: 'cor de acento'; marca é a palavra do gate para o Time fictício",
  equipe: "só é proibida como sinônimo de Time; não aparece como tal",
  casa: "idem",
  hábito: "proibida como sinônimo de Ofensiva",
  liga: "Vínculo usa 'liga' como o agrupamento de XP",
};
// FORA das exceções, e a prova de por que: "plano" e "whoop" estiveram aqui e deixaram
// passar `"Plano Premium no checkout"` e `<Txt>Whoop</Txt>` — o produto vendido que a
// Mensalidade proíbe e o nome que a Prontidão não pode usar. Apagar o comentário antes de
// medir já resolve os dois usos legítimos (namespace de disco e citação da barra), então
// exceção para eles só servia para furar a catraca. `planned_sets` segue seguro pelo
// limite de palavra.

export const proibidas = () => {
  const termos = avoidDoContext().filter((t) => !(nu(t) in EXCECOES) && !EXCECOES[t]);
  // "LinkGym" não está em nenhuma lista Avoid porque não é sinônimo de nada: é o nome que
  // NUNCA aparece. Na tela vai só o nome do Time.
  //
  // O nome do ARTEFATO DE SOFTWARE fica: `linkgym-api` e `linkgym-app` são caminho de
  // módulo Go, nome de serviço no health-check e linha de log; `linkgym.` é namespace de
  // chave em disco. Nada disso pode ser visto por uma pessoa, e renomear a chave
  // deslogaria todo mundo que já tem o app. A proibição é o nome do produto aparecendo
  // para alguém — `<Txt>LinkGym</Txt>` continua reprovando, e há prova disso no histórico
  // desta catraca.
  const identificador = /linkgym[-.](api|app|[a-z])/i;
  return ocorrencias([...arquivos(join(ROOT, "src")), ...goDaApi(false)], [...termos, "LinkGym"])
    .filter((h) => !(h.termo === "LinkGym" && identificador.test(h.texto)));
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const qual = process.argv[2];
  const f = { culpa, proibidas }[qual];
  if (!f) { console.error("use: culpa | proibidas"); process.exit(2); }
  const hits = f();
  for (const h of hits) console.log(`${h.file}:${h.line}  [${h.termo}]  ${h.texto}`);
  console.log(`${qual}: ${hits.length}`);
}
