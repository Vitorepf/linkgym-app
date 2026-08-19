#!/usr/bin/env node
// node tools/lado-a-lado.mjs [--screens=Hoje,Progresso] [--ap='{"chao":"papel"}'] [--out=FILE.png] [--no-build]
//
// A COMPARAÇÃO VISUAL de uma decisão pendente do dono: hoje a `Band` nasce SEM `raised`,
// então a alavanca "superfície" da Aparência só alcança 26 das 88 Bands do app. Virar
// `raised` o padrão faria a alavanca alcançar tudo — e MUDARIA o app de hoje. Quem decide
// é o dono, olhando; este arquivo só produz o que ele olha.
//
// Monta cada tela DUAS vezes na mesma aparência — a de hoje e a com `raised` por padrão —
// e compõe os pares numa imagem só. A versão "raised" não reescreve as 88 chamadas: liga
// `globalThis.__bandRaised` por addInitScript, que a Band lê como valor padrão da prop
// (ver RAISED_PADRAO em src/ui/Screen.tsx). Sem a flag, o bundle é o app de produção.
//
// ponytail: sem lib de composição — a página HTML com dois <img> lado a lado é o próprio
// Chrome que já está aberto. Os PNGs viram data: URI e nunca tocam o disco; o único
// arquivo escrito é a imagem final.
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildWeb, loadPlaywright, openShot, PHONE, ROOT, serve, WEB_DIR } from "./shots.mjs";

const arg = (nome, padrao) => {
  const hit = process.argv.find((a) => a.startsWith(`--${nome}=`));
  return hit ? hit.slice(nome.length + 3) : padrao;
};

const telas = arg("screens", "Hoje,Progresso,Painel,Aluna").split(",").map((s) => s.trim());
const ap = JSON.parse(arg("ap", '{"chao":"carvao"}'));
const titulo = arg("titulo", `chão ${ap.chao ?? "carvao"} · kit de fábrica`);
const out = resolve(ROOT, arg("out", "tools/out/lado-a-lado.png"));
const rotulos = arg("rotulos", "como é hoje,com raised").split(",").map((s) => s.trim());
const noBuild = process.argv.includes("--no-build");

if (!noBuild) buildWeb();

const { chromium } = loadPlaywright();
const { server, port } = await serve(WEB_DIR);
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ channel: "chrome" });

// As DUAS versões, no mesmo contexto de telefone. A única diferença entre elas é a flag.
const hoje = await browser.newContext(PHONE);
// Qual flag de captura está sendo comparada. O arquivo nasceu para `__bandRaised`; a
// segunda pergunta do dono (o peso dos botões da fila) usa o mesmo mecanismo, então o
// nome virou parâmetro em vez de um segundo arquivo quase igual.
const flag = arg("flag", "__bandRaised");
const comRaised = await browser.newContext(PHONE);
await comRaised.addInitScript((f) => {
  globalThis[f] = true;
}, flag);

const pares = [];
const quebradas = [];
try {
  for (const tela of telas) {
    const colunas = [];
    for (const [rotulo, context] of [[rotulos[0], hoje], [rotulos[1], comRaised]]) {
      // ponytail: `openShot` monta a URL com `&brand=${b}` por interpolação, então a
      // aparência entra pendurada no índice da marca. Feio de olhar, mas é o preço de NÃO
      // ter uma segunda régua de espera/console divergindo em silêncio da de shots.mjs.
      const marcaEAparencia = `0&ap=${encodeURIComponent(JSON.stringify(ap))}`;
      const { page, problems } = await openShot(context, base, tela, marcaEAparencia);
      const png = await page.screenshot({ animations: "disabled" });
      await page.close();
      if (problems.length) quebradas.push(`${tela} (${rotulo}): ${problems.join(" | ")}`);
      colunas.push({ rotulo, png: png.toString("base64") });
      console.log(`${tela.padEnd(12)} ${rotulo.padEnd(12)} ${problems.length ? "PROBLEMA" : "ok"}`);
    }
    pares.push({ tela, colunas });
  }

  const html = `<meta charset="utf-8"><style>
    body { margin: 0; padding: 32px; background: silver; font: 14px/1.3 system-ui, sans-serif; color: black; }
    h1 { margin: 0 0 24px; font-size: 20px; font-weight: 700; }
    .grade { display: grid; grid-template-columns: repeat(2, max-content); gap: 24px; }
    .par { background: white; padding: 16px; }
    .colunas { display: flex; gap: 12px; }
    figure { margin: 0; }
    figcaption { padding: 0 0 8px; font-weight: 700; letter-spacing: .04em; }
    img { display: block; width: ${PHONE.viewport.width}px; border: 1px solid dimgray; }
  </style>
  <h1>${titulo} — ${telas.length} tela(s), duas versões</h1>
  <div class="grade">${pares
    .map(
      (p) => `<div class="par"><div class="colunas">${p.colunas
        .map(
          (c) =>
            `<figure><figcaption>${p.tela.toUpperCase()} — ${c.rotulo}</figcaption>` +
            `<img src="data:image/png;base64,${c.png}"></figure>`,
        )
        .join("")}</div></div>`,
    )
    .join("")}</div>`;

  // Largura fixa: dois pares por fileira, cada telefone no tamanho nativo da captura.
  const largura = (PHONE.viewport.width + 2) * 4 + 12 * 2 + 16 * 4 + 24 + 32 * 2;
  const folha = await browser.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 2 });
  const pagina = await folha.newPage();
  await pagina.setContent(html, { waitUntil: "load" });
  mkdirSync(dirname(out), { recursive: true });
  await pagina.screenshot({ path: out, fullPage: true });
  await folha.close();
} finally {
  await browser.close();
  server.close();
}

for (const q of quebradas) console.error(`  QUEBRA ${q}`);
console.log(`\ngravei ${out}`);
process.exit(quebradas.length ? 1 : 0);
