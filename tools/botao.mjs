#!/usr/bin/env node
// A ALTURA REAL DO BOTÃO. node tools/botao.mjs [--json]
//
// O dono olhou três botões empilhados e escreveu: "o botão continuo tendo um tamanho
// extraordinariamente grande, sem sentido... nunca que isso aqui e ultra premium".
//
// Esta régua existe porque o pecado recorrente deste repo é medir o OBJETO que a tela
// deixou de pintar: `FORMA.alturaAcao` é o que o TEMA oferece, e não é a altura que o
// dedo encontra — o componente soma o próprio `paddingVertical` por cima. Medir
// `alturaAcao` responderia 56 numa tela que desenha 72.
//
// Então ela LÊ os dois arquivos de botão, extrai o degrau de espaço que cada um consome,
// e só então resolve a altura contra o tema. Trocar `SPACE.step` por outro degrau move
// este número; mexer só no tema, não.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gravarMedida } from "./catraca.mjs";
import { ALVO, APARENCIA_PADRAO, PORTES, criarTema } from "../src/theme.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BOTOES = ["src/ui/AccentCTA.tsx", "src/ui/GhostCTA.tsx"];

/** O PISO E O TETO do que é premium, em pontos.
 *
 *  O piso não é gosto: 44pt é o alvo de dedo com que a Apple e o Material concordam, e
 *  `ALVO.minimo` guarda o mesmo número. O teto é: as ações principais de Linear, Things,
 *  Whoop e Oura medem entre 48 e 52pt, e nenhum app que se vende como premium empilha
 *  lajes de 70. Damos folga de um degrau de rótulo para a anatomia de DUAS linhas, que
 *  legitimamente carrega uma caixa de texto a mais. */
const PISO = ALVO.minimo;
const TETO_UMA_LINHA = 56;
const TETO_DUAS_LINHAS = 68;

/** O degrau de espaço que o COMPONENTE consome no eixo vertical. Lido do arquivo, e não
 *  do tema: é a única leitura que quebra quando alguém troca o degrau de volta. */
function degrauVertical(rel) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  const m = src.match(/paddingVertical:\s*SPACE\.(\w+)/);
  if (!m) throw new Error(`${rel}: nenhum paddingVertical em degrau de SPACE — a régua ficou cega`);
  return m[1];
}

const reprova = [];
const linhas = [];
for (const rel of BOTOES) {
  const degrau = degrauVertical(rel);
  for (const acao of ["linha", "centro", "caixa", "empilhada"]) {
    for (const densidade of ["compacta", "normal", "arejada"]) {
      for (const voz of ["bloco", "neutra", "tecnica", "editorial", "suave", "condensada"]) {
        // O PORTE entra na varredura, e é ele que dá dentes aos dois lados: `justo` é quem
        // pode raspar o piso do dedo, `folgado` é quem pode estourar o teto premium. Uma
        // alavanca de tamanho medida só num valor não é medida.
        for (const porte of Object.keys(PORTES)) {
        const T = criarTema({ ...APARENCIA_PADRAO, acao, densidade, voz, porte });
        const duas = acao === "empilhada";
        // A caixa de linha que o texto realmente ocupa, na face que a voz escolheu.
        const caixa = T.LEAD.body + (duas ? T.LEAD.label : 0);
        const altura = Math.max(T.FORMA.alturaAcao, 2 * T.SPACE[degrau] + caixa);
        const teto = duas ? TETO_DUAS_LINHAS : TETO_UMA_LINHA;
        const onde = `${rel.split("/").pop()} ${acao}/${densidade}/${voz}/${porte}`;
        if (altura < PISO) reprova.push(`${onde}: ${altura.toFixed(1)}pt abaixo do alvo do dedo (${PISO})`);
        else if (altura > teto) reprova.push(`${onde}: ${altura.toFixed(1)}pt acima do teto premium (${teto})`);
        linhas.push({ onde, altura: Number(altura.toFixed(1)), teto });
        }
      }
    }
  }
}

const json = process.argv.includes("--json");
if (json) console.log(JSON.stringify({ pares: linhas.length, reprova }, null, 2));
else {
  const alto = linhas.reduce((a, b) => (b.altura > a.altura ? b : a));
  console.log(`botao: ${linhas.length} combinações · ${reprova.length} reprovam · mais alta ${alto.altura}pt (${alto.onde})`);
  for (const r of reprova.slice(0, 12)) console.log("  " + r);
  if (reprova.length > 12) console.log(`  ... e mais ${reprova.length - 12}`);
}
gravarMedida("botao", reprova.length, "menor");
process.exit(reprova.length ? 1 : 0);
