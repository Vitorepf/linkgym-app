#!/usr/bin/env node
// node tools/shots.mjs [--brands=0,3,7] [--screens=Hoje,Painel] [--out=DIR] [--no-build] [--check]
// --check não escreve PNG e grava .gate/telas.json: é a fonte da catraca `telas`.
// Exporta o app para web uma vez, sobe um servidor estático do dist e tira um PNG por
// (tela, marca) numa PÁGINA NOVA do Chrome. Página nova = estado limpo.
//
// Playwright vem do cache do npx (v1.62.1) — NÃO é dependência do projeto e o
// package.json não é tocado. Sobrescreva com PLAYWRIGHT_DIR=... se o cache mudar.
// O browser é o Chrome do sistema (channel "chrome"), então nada é baixado.
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BRANDS } from "./brands.mjs";
import { impressaoDoCodigo } from "./toques.mjs";

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const WEB_DIR = join(ROOT, "tools/out/web");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

export function loadPlaywright() {
  const dirs = [];
  if (process.env.PLAYWRIGHT_DIR) dirs.push(process.env.PLAYWRIGHT_DIR);
  const cache = join(homedir(), ".npm/_npx");
  if (existsSync(cache)) {
    for (const d of readdirSync(cache)) {
      const p = join(cache, d, "node_modules/playwright");
      if (existsSync(join(p, "package.json"))) dirs.push(p);
    }
  }
  const require_ = createRequire(import.meta.url);
  const scored = dirs
    .map((p) => {
      const v = require_(join(p, "package.json")).version;
      return { p, v, stable: !/alpha|beta|rc/.test(v) };
    })
    .sort((a, b) => Number(b.stable) - Number(a.stable) || b.v.localeCompare(a.v, "en", { numeric: true }));
  if (!scored.length) {
    throw new Error(
      "playwright não encontrado. Rode `npx playwright@1.62.1 --version` uma vez para popular o cache do npx, ou aponte PLAYWRIGHT_DIR.",
    );
  }
  return { ...require_(join(scored[0].p, "index.js")), version: scored[0].v };
}

export function buildWeb() {
  console.log("expo export (EXPO_PUBLIC_SHOT=1)...");
  execFileSync(
    "npx",
    ["expo", "export", "--platform", "web", "--output-dir", WEB_DIR, "--clear"],
    { cwd: ROOT, stdio: "inherit", env: { ...process.env, EXPO_PUBLIC_SHOT: "1" } },
  );
}

export function serve(dir) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(req.url.split("?")[0]);
    let file = join(dir, path === "/" ? "index.html" : path);
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, "index.html");
    res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok({ server, port: server.address().port })));
}

/** Contexto de telefone: 390x844 @2x, dark, pt-BR, movimento reduzido. */
export const PHONE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  reducedMotion: "reduce",
  locale: "pt-BR",
  timezoneId: "America/Sao_Paulo",
};

/** Abre uma página nova, navega, espera o shotHost sinalizar, devolve os problemas. */
export async function openShot(context, base, screen, brandIndex) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await page.goto(`${base}/?screen=${encodeURIComponent(screen)}&brand=${brandIndex}`, {
    waitUntil: "domcontentloaded",
  });
  let flag = "timeout";
  try {
    await page.waitForFunction(
      () => {
        const v = document.documentElement.getAttribute("data-shot");
        return v === "ready" || v === "error" || v === "stuck" ? v : false;
      },
      { timeout: 45000 },
    );
    flag = await page.evaluate(() => document.documentElement.getAttribute("data-shot"));
  } catch {
    /* fica timeout */
  }
  const info = await page.evaluate(() => ({
    misses: globalThis.__shot?.misses ?? ["__shot ausente: o shotHost não carregou"],
    error: globalThis.__shot?.error ?? "",
    text: document.body.innerText.trim().length,
  }));

  const problems = [];
  if (flag !== "ready") problems.push(`montagem sinalizou "${flag}"`);
  if (info.error) problems.push(`erro do React: ${info.error}`);
  if (info.misses.length) problems.push(`rota sem fixture: ${info.misses.join(", ")}`);
  if (info.text === 0) problems.push("tela em branco (nenhum texto renderizado)");
  for (const e of consoleErrors) problems.push(`console: ${e}`);
  return { page, problems };
}

/**
 * A lista de telas vive em tools/fixtures.ts, que é TypeScript porque entra no bundle.
 * ponytail: um parse de 3 linhas em vez de arrastar um transpilador para dentro do gate.
 * Se as chaves de FIXTURES deixarem de ser identificadores simples, isto quebra ruidosamente.
 */
export function screenNames(includeHarness = false) {
  const src = readFileSync(join(ROOT, "tools/fixtures.ts"), "utf8");
  const block = src.slice(src.indexOf("export const FIXTURES"), src.indexOf("export const SCREENS"));
  const names = [...block.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]);
  if (!names.length) throw new Error("não achei nenhuma tela em tools/fixtures.ts");
  const harness = (src.match(/export const HARNESS = \[([^\]]*)\]/)?.[1] ?? "")
    .split(",")
    .map((s2) => s2.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
  return includeHarness ? names : names.filter((n) => !harness.includes(n));
}

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

async function main() {
  const all = screenNames();
  const known = screenNames(true);
  const screens = arg("screens") ? arg("screens").split(",") : all;
  const brands = arg("brands")
    ? arg("brands").split(",").map(Number)
    : BRANDS.map((_, i) => i);
  const out = resolve(ROOT, arg("out", "tools/out/shots"));
  const noBuild = process.argv.includes("--no-build");
  const check = process.argv.includes("--check");

  const unknown = screens.filter((s) => !known.includes(s));
  if (unknown.length) throw new Error(`tela sem fixture: ${unknown.join(", ")}`);

  if (!noBuild || !existsSync(join(WEB_DIR, "index.html"))) buildWeb();

  const { chromium, version } = loadPlaywright();
  const { server, port } = await serve(WEB_DIR);
  const base = `http://127.0.0.1:${port}`;
  console.log(`playwright ${version} · chrome do sistema · ${base}`);
  console.log(`${screens.length} tela(s) x ${brands.length} marca(s) = ${screens.length * brands.length} shots`);

  const browser = await chromium.launch({ channel: "chrome" });
  const failures = [];
  let done = 0;
  try {
    for (const b of brands) {
      const dir = join(out, String(b));
      mkdirSync(dir, { recursive: true });
      const context = await browser.newContext(PHONE);
      for (const screen of screens) {
        const { page, problems } = await openShot(context, base, screen, b);
        if (!check) await page.screenshot({ path: join(dir, `${screen}.png`), animations: "disabled" });
        await page.close();
        done += 1;
        if (problems.length) {
          failures.push({ screen, brand: b, problems });
          console.log(`FALHA  marca ${b} (${BRANDS[b]?.name}) · ${screen}`);
          for (const p of problems) console.log(`       ${p}`);
        }
      }
      await context.close();
      console.log(`marca ${b} ${BRANDS[b]?.name}: ${screens.length} shots`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (check) {
    // A catraca conta TELA QUE MONTOU EM TODA MARCA. Uma tela que passa em 19 e some na
    // marca 13 (acento igual ao fundo) não conta — meia cobertura não é cobertura.
    const quebradas = new Set(failures.map((f) => f.screen));
    const inteiras = screens.filter((s2) => !quebradas.has(s2));
    mkdirSync(join(ROOT, ".gate"), { recursive: true });
    writeFileSync(join(ROOT, ".gate/telas.json"), JSON.stringify({
      telas: inteiras.length, testadas: screens.length, marcas: brands.length,
      quebradas: failures.map((f) => ({ tela: f.screen, marca: f.brand, problemas: f.problems })),
      codigo: impressaoDoCodigo(),
    }, null, 2) + "\n");
    console.log(`\ngravei .gate/telas.json — ${inteiras.length}/${screens.length} tela(s) inteira(s) em ${brands.length} marca(s)`);
  }
  console.log(`\n${done} ${check ? "montagens verificadas" : `shots em ${out}`}`);
  if (failures.length) {
    console.log(`REPROVADO: ${failures.length} par(es) tela x marca com problema.`);
    for (const f of failures) {
      console.log(`  marca ${f.brand} ${BRANDS[f.brand]?.name} · ${f.screen}: ${f.problems.join(" | ")}`);
    }
    process.exit(1);
  }
  console.log("OK: toda tela montou em toda marca.");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(2);
  });
}
