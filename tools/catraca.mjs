// Grava a medida de um eixo no formato que o `.gate` já espera.
//
// Por que isto existe: `tools/medir.mjs` é ARQUIVO TRAVADO e despacha os eixos por um mapa
// escrito à mão. Um medidor novo — `aparencia.mjs`, `kits.mjs` — não tem como entrar nesse
// mapa por dentro do loop, e não deve: registrar eixo é ato do humano. Mas o gate sabe ler
// medidor legado, que é o que escreve só `<eixo>.json` e deixa o histórico com ele
// ("Medidor que so escreve <eixo>.json ... tem o historico completado aqui").
//
// Então o medidor novo faz exatamente a metade que lhe cabe: mede e grava. No dia em que o
// humano acrescentar o eixo em `.gate/config.json` e `.gate/base.json` e rodar `--lock`, a
// catraca nasce com histórico de verdade em vez de nascer vazia — e histórico vazio é o
// único caso que o gate trata como integridade quebrada.
//
// Criar o `.jsonl` é passo de INSTALAÇÃO e só acontece quando ele não existe. Depois disso
// quem acrescenta linha é o gate, nunca este arquivo: medidor que reescreve o próprio
// histórico é catraca que se solta sozinha.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.CLAUDE_PROJECT_DIR ?? dirname(dirname(fileURLToPath(import.meta.url)));

export function gravarMedida(eixo, atual, melhorEh = "menor") {
  if (typeof atual !== "number" || !Number.isFinite(atual)) return;
  const dir = join(ROOT, ".gate/medidas");
  mkdirSync(dir, { recursive: true });
  const alvo = join(dir, `${eixo}.json`);
  let antes = null;
  try {
    antes = JSON.parse(readFileSync(alvo, "utf8"));
  } catch {
    /* primeira medição deste eixo */
  }
  const escolher = melhorEh === "maior" ? Math.max : Math.min;
  const melhor = antes && Number.isFinite(antes.melhor) ? escolher(antes.melhor, atual) : atual;
  writeFileSync(alvo, JSON.stringify({ atual, melhor }, null, 2) + "\n");

  const hist = join(dir, `${eixo}.jsonl`);
  if (!existsSync(hist)) {
    appendFileSync(hist, JSON.stringify({ atual, ts: new Date().toISOString(), via: "instalacao" }) + "\n");
  }
  console.error(`  catraca: ${eixo}=${atual} (melhor ${melhor}, ${melhorEh} é melhor) — ainda NÃO registrado no gate`);
}
