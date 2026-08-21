#!/usr/bin/env node
// O VÃO QUE NÃO ESTÁ NA ESCADA. node tools/vaos.mjs [--json]
//
// `src/theme.ts` declara o PISO 8 com todas as letras: "Nada no app encosta a menos disto
// em outra coisa... Abaixo de 8 não existe separação, existe defeito de renderização." E
// declara a escada inteira em seis degraus.
//
// Um crítico de acabamento mediu as capturas e achou o contrário: quatro irmãos numa
// coluna com quatro margens diferentes, duas delas fora da escada; um `gap: 2`, que é um
// quarto do piso, dentro da amostra que vende o sistema de tipografia; um `paddingVertical`
// cravado em 22 na célula de número, que a densidade nunca alcança; e um `marginTop: 5`
// para a mesma relação que o cabeçalho resolve com `SPACE.hair`.
//
// Isso não se conserta com revisão. `soltos` conta hexadecimal, `escala` conta `fontSize`,
// `tempo` conta duração — e o VÃO, que é a metade do acabamento que o olho lê primeiro,
// não tinha ninguém contando.
//
// A régua conta literais numéricos em propriedades de ESPAÇO fora dos degraus. Não conta
// tamanho (largura, altura, raio): esses respondem a alvo de dedo e a canto, que têm
// réguas próprias.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gravarMedida } from "./catraca.mjs";
import { SPACE } from "../src/theme.ts";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEGRAUS = new Set(Object.values(SPACE));

const semComentario = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/** As propriedades que são VÃO: distância entre duas coisas, ou respiro dentro de uma. */
const VAO = new RegExp(
  "\\b(gap|rowGap|columnGap|margin|marginTop|marginBottom|marginLeft|marginRight|" +
    "marginHorizontal|marginVertical|padding|paddingTop|paddingBottom|paddingLeft|" +
    "paddingRight|paddingHorizontal|paddingVertical):\\s*(-?\\d+(?:\\.\\d+)?)\\b",
  "g",
);

/** ZERO é ausência de vão, não um vão fora da escada — e negativo é compensação óptica
 *  declarada (puxar um glifo de volta para o eixo), que é acabamento e não descuido. */
const naEscada = (n) => n === 0 || n < 0 || DEGRAUS.has(n);

const arquivos = [];
(function anda(dir, rel = "") {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) anda(p, r);
    else if ([".ts", ".tsx"].includes(extname(e.name))) arquivos.push({ p, r });
  }
})(join(ROOT, "src"));

const fora = [];
for (const { p, r } of arquivos) {
  // `theme.ts` é a casa da escada, como em `soltos` e em `tempo`.
  if (r === "theme.ts") continue;
  semComentario(readFileSync(p, "utf8"))
    .split("\n")
    .forEach((linha, i) => {
      for (const m of linha.matchAll(VAO)) {
        const n = Number(m[2]);
        if (!naEscada(n)) fora.push({ onde: `${r}:${i + 1}`, o: m[0].trim() });
      }
    });
}

const porArquivo = new Map();
for (const f of fora) {
  const a = f.onde.split(":")[0];
  porArquivo.set(a, (porArquivo.get(a) ?? 0) + 1);
}
if (process.argv.includes("--json")) console.log(JSON.stringify(fora, null, 2));
else {
  console.log(`vaos: ${fora.length} vão(s) fora da escada em ${porArquivo.size} arquivo(s)`);
  for (const [a, n] of [...porArquivo].sort((x, y) => y[1] - x[1]).slice(0, 12)) {
    console.log(`  ${String(n).padStart(3)}  ${a}`);
  }
}
gravarMedida("vaos", fora.length, "menor");
process.exit(fora.length ? 1 : 0);
