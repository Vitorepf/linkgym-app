# Veredito: oficio-things
data: 21 ago 2026 (rodada 6, crítico cego)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/02-oficio-things.md B1 B20 + docs/barra-proto/passada-4-mobbin.md (Things flow b1fa3cd6 + linhas 2–3 das oito)
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. escala 0 avulsos, 10 degraus, maior salto 1,24; extremos do sistema 25/11 = 2,27. O medidor lê a escada no CSS, não os corpos visíveis na dobra nem o cartão. 0 fora não é vitória.

Afirmação falsificável: `RACK` em `app-root.tsx:94` ainda contém `serie` e `descanso`. Toque em Começar troca a cena (LiveScene = RackScene); 0 `.sheet` / `.sheet-card`; nenhuma linha do Hoje fica atrás. `CARDS` é só `como` / `fichaSessao` / `feito` — não Série, não Descanso. Things B20 e o pack linhas 2–3 pedem cartão 40–55% com o Hoje atrás. Não está. A afirmação de que RACK estava vazio é falsa.

Medido (Vite :5248, 430×844, localStorage limpo):

Hoje, chrome incluso:

| y | texto | classe | px |
| --- | --- | --- | --- |
| 11–141 | 18:04 / Ferro Bruto / O de hoje / A · Superior | t-body | 17 |
| 56 | ofensiva 4 / 1 protetor | t-small | 15 |
| 184–328 | nomes da ficha 17 · 3×8 15 | t-body + t-small | 17 / 15 |
| 437 | Começar 17 · 48 min 15 | t-body + t-small | 17 / 15 |
| 786–811 | Hoje Ficha Rede Progresso Perfil | t-body | 17 |

Corpos visíveis: {15, 17}. Razão 1,13. Things B1: extremos entre 2,0× e 2,3×. Pack: cinco degraus no fluxo, extremos ~2,15. 1,13 não entra na faixa. Não inventei quarto sistema: a dobra densa continua em dois corpos de Linear. O conflito com Linear B1 (≤1,40 / 2 corpos) segue no mesmo sítio. Sem quarto sistema, Things perde B1.

Série (toque em Começar, mesma viewport):

- LiveScene vira Serie. O texto vivo começa em «1 de 3 · série 1 de 3 / Supino reto». Zero linha do Hoje («O de hoje», «Começar», «Te pegaram» somem).
- Corpos amostrados: 7,14 e 10,5 (strike), 15, 17, 25. Razão com strike: 3,50. Sem strike: 25/15 = 1,67. Nenhum dos dois é 2,0–2,3 com vizinho ≤ 1,35.
- `.sheet` / `.sheet-card`: 0. `RACK` = serie, descanso. `CARDS` = como, fichaSessao, feito.
- Thumb «Fiz essa série · 90s»: 152×54, fill oklab 0,82, y=714. Pack linha 3: 1 Save no cartão, FAB 52–56. Isto é primária cheia numa cena 100%, não cartão 40–55%.

`app-root.tsx:94-96`: `RACK = new Set(["serie", "descanso"])`, `CARDS = new Set(["como", "fichaSessao", "feito"])`. `store.ts:554-567` `startSession` grava `overlay: "serie"`. `app-root.tsx:159` `LiveScene = rackId ? RackScene : TabScene`. Série e Descanso substituem o Hoje. Feito / Como / Ficha da sessão sobem `sheet-card` 55% — três de cinco, e nenhum deles é a Série.

Pack (Creating a new to-do, b1fa3cd6): cartão 40% no piso, When? ≤65%, 0 quadro a 100%, ≥2 linhas do contexto. Linha 2 das oito: Série / Descanso / Feito sobem cartão 40–55% com Hoje atrás. Things B20: 40–70% e o contexto reconhecível. O artefato entrega 100% na Série e apaga o Hoje.

00 (`docs/barra-proto/00-defeitos-e-linha-de-base.md`) tenta isentar rack full-bleed e extremos 2,0–2,3× no Hoje. A medida desta rodada é a barra 02 + o pack: cartão 40–55% e, se o conflito de extremos no Hoje continuar, Things perde B1 sem quarto sistema. Os dois furos estão no pixel. Isenção de 00 não é a medida declarada.

Para eu estar errado: `RACK` teria de estar vazio (ou sem `serie` / `descanso`), e Série / Descanso / Feito teriam de ocupar 40–55% da altura com pelo menos duas linhas do Hoje ainda legíveis; e a dobra do Hoje teria de mostrar extremos de tipo entre 2,0× e 2,3× (dois corpos nomeados, não strike) sem inventar um quarto sistema. O medidor `escala` em 2,27 não refuta: ele não olha a dobra.

brechas que não reabrem B1 nem B20:
- Começar sem `.thumb` fecha Linear B12. Não vira cartão.
- Feito / Como / Ficha em `CARDS` 55%. A Série não está em `CARDS`.
- Face 22×22. Não é o furo.
- Dock `w-fit` no Thumb da Série (152 px). Não vira FAB 52–56 sem rótulo, e não vira cartão.

o que venceria e não está:
- Extremos 2,0–2,3× visíveis na dobra que o pack mede, e Série / Descanso / Feito em cartão 40–55% com o Hoje atrás. Os dois. Um só não basta. RACK com `serie` perde sozinho.
