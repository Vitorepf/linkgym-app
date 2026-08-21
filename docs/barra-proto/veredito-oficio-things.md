# Veredito: oficio-things
data: 21 ago 2026 (rodada 7, crítico cego)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/02-oficio-things.md B20 B1 + docs/barra-proto/passada-4-mobbin.md (Things flow b1fa3cd6 + linhas 2–3 das oito)
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. escala 0 avulsos, 10 degraus, maior salto 1,24; extremos do sistema 25/11 = 2,27. O medidor lê a escada no CSS, não os corpos visíveis na dobra nem o cartão. 0 fora não é vitória.

Afirmação falsificável: `RACK` em `app-root.tsx:96` contém `serie`. Toque em Começar troca a cena (LiveScene = RackScene); 0 `.sheet` / `.sheet-card`; nenhuma linha do Hoje fica atrás. `CARDS` é o conjunto vazio. Things B20 e o pack linhas 2–3 pedem cartão 40–55% com o Hoje atrás. Não está.

Medido (Vite :5248, 430×844, localStorage limpo):

Hoje, chrome incluso, corpos visíveis {15, 17}, razão 1,13. Things B1 pede extremos 2,0–2,3×. Pack: cinco degraus no fluxo, extremos ~2,15. 1,13 não entra. Sem quarto sistema, Things perde B1. B1 sozinho não decide esta rodada.

Série (toque em Começar, mesma viewport):

- LiveScene vira Serie. O texto vivo começa em «1 de 3 · série 1 de 3 / Supino reto» (y=56). Zero linha do Hoje: «O de hoje», «Começar», «Te pegaram», «Ferro Bruto» = null.
- `.sheet` / `.sheet-card`: 0.
- Thumb «Fiz essa série · 90s»: 152×54, fill oklab 0,82, y=714. Pack linha 3: 1 Save no cartão, FAB 52–56. Isto é primária cheia numa cena 100%, não cartão 40–55%.

`app-root.tsx:96-97`: `RACK = new Set(["serie", "descanso", "feito", "como", "fichaSessao"])`, `CARDS = new Set()`. `store.ts` `startSession` grava `overlay: "serie"`. `app-root.tsx:161` `LiveScene = rackId ? RackScene : TabScene`. Série, Descanso, Feito, Como e Ficha da sessão substituem o Hoje.

Vite serviu o mesmo Set que o disco: `RACK.has("serie")` é verdadeiro. A afirmação de que RACK estava vazio é falsa.

Pack (Creating a new to-do, b1fa3cd6): cartão 40% no piso, When? ≤65%, 0 quadro a 100%, ≥2 linhas do contexto. Linha 2 das oito: Série / Descanso / Feito sobem cartão 40–55% com Hoje atrás. Things B20: 40–70% e o contexto reconhecível. O artefato entrega 100% na Série e apaga o Hoje.

B1 pode perder e o eixo ainda empatar se B20 fechasse e o resto da barra 02 fechasse. B20 não fechou. Default desta rodada: perdeu. Não li um terceiro documento para isentar o rack.

Para eu estar errado: `RACK.has("serie")` teria de ser falso, e Série / Descanso / Feito teriam de ocupar 40–55% da altura com pelo menos duas linhas do Hoje ainda legíveis. O medidor `escala` em 2,27 não refuta: ele não olha a dobra nem o cartão.

brechas que não reabrem B20:
- Começar sem `.thumb` fecha Linear B12. Não vira cartão.
- Face 22×22. Não é o furo.
- Dock `w-fit` no Thumb da Série (152 px). Não vira FAB 52–56 sem rótulo, e não vira cartão.
- `descanso` nunca recebe `overlay` no store — o descanso mora dentro da Série. Continua cena 100%.

o que venceria e não está:
- Série / Descanso / Feito em cartão 40–55% com o Hoje atrás. RACK com `serie` perde sozinho.
