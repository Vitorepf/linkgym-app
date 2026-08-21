#!/usr/bin/env node
// O TEMPO QUE NINGUÉM GOVERNA. node tools/tempo.mjs [--json]
//
// Este repo tem duas catracas famosas contra número solto: `soltos` conta hexadecimal fora
// do tema e `escala` conta `fontSize` cravado à mão. As duas existem porque um número solto
// é uma decisão que fugiu do único lugar onde ela pode ser medida.
//
// O TEMPO nunca teve essa catraca, e a drenagem já começou: uma constante de mola num
// arquivo, uma SEGUNDA mola diferente no MESMO arquivo, um `FadeIn.duration(180)` e uma
// repetição de 1100ms sem curva declarada. Nenhum deles passa por `MOTION`, então o
// movimento que o personal escolhe não os alcança — a alavanca é vendida e não chega.
//
// Duas contas, as duas lidas do ARQUIVO e não do tema, porque o que importa é o que o
// componente consome:
//
//   SOLTOS  — literal numérico dentro de `duration:`, `.duration(`, `delay:`, `damping`,
//             `stiffness`, `mass`, ou posicional de `withTiming/withDelay/withRepeat`.
//   SEM CURVA — `withTiming(` sem `easing:`. O padrão do Reanimated é `inOut(quad)`, que é
//             a curva de app de template: o olho lê como "não foi escolhido".
import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gravarMedida } from "./catraca.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, "src");

/** Comentário não é código. A mesma limpeza que `tools/aparencia.mjs` §31 faz antes de ler
 *  expressão de estilo — senão um número citado numa explicação vira defeito. */
const semComentario = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/** A CASA DOS NÚMEROS está isenta, e a isenção é por ARQUIVO E MOTIVO, nunca por descuido.
 *  É a mesma isenção que a catraca `soltos` dá ao hexadecimal: número de tempo TEM que
 *  existir em algum lugar, e o trabalho da régua é garantir que exista só ali. `theme.ts`
 *  declara `MOTION`; `ui/motion.ts` é o único módulo que o transforma em animação. */
const RELOGIO = new Map([
  ["theme.ts", "declara MOTION, que é onde o tempo tem que morar"],
  ["ui/motion.ts", "é o único tradutor de MOTION para animação"],
]);

const arquivos = [];
(function anda(dir, rel = "") {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) anda(p, r);
    else if ([".ts", ".tsx"].includes(extname(e.name))) arquivos.push({ p, r });
  }
})(SRC);

const soltos = [];
const semCurva = [];
for (const { p, r } of arquivos) {
  if (RELOGIO.has(r)) continue;
  const txt = semComentario(readFileSync(p, "utf8"));
  txt.split("\n").forEach((linha, i) => {
    const onde = `${r}:${i + 1}`;
    // número cravado onde um token de tempo deveria estar
    for (const re of [
      /\bduration:\s*(\d+)/g,
      /\.duration\(\s*(\d+)/g,
      /\bdelay:\s*(\d+)/g,
      /\b(?:damping|stiffness|mass):\s*([\d.]+)/g,
      /\bwith(?:Timing|Delay|Repeat)\([^,)]*,\s*(\d+)\s*[,)]/g,
    ]) {
      for (const m of linha.matchAll(re)) soltos.push(`${onde}  ${m[0].trim()}`);
    }
    // withTiming sem curva declarada: a linha ou a seguinte tem que trazer `easing:`
    if (/\bwithTiming\(/.test(linha) && !/easing:/.test(linha)) {
      const proxima = txt.split("\n").slice(i, i + 4).join(" ");
      if (!/easing:/.test(proxima)) semCurva.push(onde);
    }
  });
}

const total = soltos.length + semCurva.length;
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ soltos, semCurva }, null, 2));
} else {
  console.log(`tempo: ${soltos.length} literal(is) de tempo solto(s) · ${semCurva.length} sem curva declarada`);
  for (const s of soltos) console.log("  solto   " + s);
  for (const s of semCurva) console.log("  s/curva " + s);
}
gravarMedida("tempo", total, "menor");
process.exit(total ? 1 : 0);
