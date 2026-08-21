# Veredito: oficio-things
data: 21 ago 2026 (rodada 4)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/02-oficio-things.md B1/B15/B20/C0.3 + docs/barra-proto/passada-4-mobbin.md (Things 3 New To-Do + linhas 2–3 das oito)
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. escala 0 avulsos, 10 degraus, maior salto 1,24; tipos pior=4; movimento 4 durações; croma 0 faces > 6%; plate não mistura ink. Extremos do sistema 25/11 = 2,27 são verdade no token. O 25 não pinta no Hoje. 0 fora não é a barra.

Afirmação falsificável: o furo de cena 100% da rodada 3 fechou no pixel — `serie` / `descanso` / `feito` estão em `CARDS` e sobem `.sheet-card` a 55% da área útil, com o Hoje como `LiveScene` atrás e véu 0%. O eixo perde Things B1 no mesmo quadro: extremos visíveis no Hoje são 17÷17 = 1,00×; na Série, 17÷15 = 1,13×. Pack e 02 B1 pedem 2,0–2,3×. Conflito conhecido (Hoje 17+21 = 1,24× acerta Linear 1,15–1,30 e falha Things B1) continua — agora pior, porque o 21 saiu da dobra. Sem quarto sistema. Things perde B1.

O que fechou (pixel, não comentário):
- B20 / pack linha 2 — `RACK` vazio, `CARDS` = serie/descanso/feito/como/fichaSessao (`app-root.tsx:98-99`). `Sheet tall` aplica `.sheet-card` `height: 55%` (`styles.css:258-270`, `app-root.tsx:183`). O comentário em `styles.css:237-239` ainda diz «rack full-bleed»; o pixel é cartão. Véu 0%: o dismiss é `absolute inset-0` sem fundo (`shell.tsx:95`). Topo ~45% da área entre chrome e TabBar mostra Place + data + «O de hoje» + nome + ≥2 linhas da ficha (`hoje.tsx:44-114`). 0 cena 100% nestes três.
- C0.3 / pack linha 3 (luminância) — `.thumb` é `color-mix(ink 82%, bg)` (`styles.css:342`), ~#cbcbcb, L* ~82. O texto `ink` `#f5f5f5` na dobra tem L* 96,5. Existe pixel de conteúdo mais claro que o botão. Rodada 3: face em ink/branco, L* ~96, o mais claro da tela.
- B3 Face — padrão 20, call sites do Hoje em 20 (`bits.tsx:263-264`, `hoje.tsx:139,163`). Faixa 18–22. Rodada 3: 36.
- B7 Segment / Dock — Segment sem `border-b` (`bits.tsx:490-504`). Dock `w-fit min-w-[12rem]` (`shell.tsx:76`). Rodada 3: régua de ponta a ponta e barra 100%.
- B10 Raid/Scoreboard — `<p>` sem título próprio, sem `onClick` (`hoje.tsx:178-183`). Rodada 3: kicker + alvo na dobra.

brechas:
- hoje.tsx:47-51 + shell.tsx:34-35,63 + styles.css:42-43,163-168 — B1 / pack «extremos visíveis 2,0–2,3×». Chrome, Place, título, lista, ofensiva, Raid, placar, TabBar: um corpo 17. Razão 1,00. 21 (`t-title`) não pinta nesta dobra. 17+21 = 1,24× acertaria Linear e ainda falharia Things. 17/17 falha mais. Não há quarto sistema que mude o Hoje para «só Linear».
- serie.tsx:65,90-104 — Série no cartão: nome `t-body` 17, rótulos kg/reps `t-small` 15. Extremos 17/15 = 1,13. Fora de 2,0–2,3. Descanso e Feito-patamar pintam 25 e 11 (`descanso.tsx:65-72,91-92`, `feito.tsx:28-34`) = 2,27× — o item não é teto nessas duas; o Hoje e a Série o derrubam.
- styles.css:334-349 + hoje.tsx:116-120 — B15 / pack «FAB 52–56 pt». No Hoje o Thumb continua `height: 54px; width: 100%` dentro do `Pad` (390 pt úteis), não círculo 52–56. A luminância fechou; a anatomia não. No cartão da Série o Dock é `w-fit`, o Thumb ainda é barra 54×100% do dock, não FAB.
- hoje.tsx:93,102,115 — `mt-4` 16 pt antes da lista, `py-2.5` 10 pt intra-linha, `mt-5` 20 pt antes do Thumb. Razões 1,6× e 2,0×. B5 pede ≥ 2,5× e cabeçalho→primeira linha menor que última→próximo por ≥ 1,8×.
- styles.css:4-7 — o comentário da fundação ainda declara um vermelho para vivo, carimbo, recorde e ofensiva. No pixel da dobra densa o stamp não pinta; `stamp-dim` é `#1a1a1a` (`styles.css:34`). B8 julga o pixel, não o comentário. Não reabre sozinho.
- bits.tsx:181-194 — NoSheet: parágrafo + Thumb + Quiet. B18: ≤ 2 linhas, 0 ilustração, frase nomeia o gesto, sem botão que duplique o da barra.
- kit.tsx:59-62 + styles.css:228-234 + feito.tsx:27 — `plate` ainda leva sombra `40px`. Things C20 no escuro pede elevação ou fio, não derrame de 40. O cartão de 55% existe sem `plate` no wrapper do Sheet; o Feito-patamar põe `plate` dentro.

o que venceria:
- Cartão 40–55% com ≥2 linhas do Hoje atrás, 0 cena 100%, primária que não seja o pixel mais luminoso — isto já está no pixel de Série/Descanso/Feito.
- Extremos visíveis 2,0–2,3× na dobra que o crítico mede (Hoje chrome incluso, ou a Série no cartão). 17+21 = 1,24× acerta Linear e falha este item; 17/17 também. Sem um quarto sistema, este eixo não fecha enquanto a densa do Hoje obedecer Linear.
