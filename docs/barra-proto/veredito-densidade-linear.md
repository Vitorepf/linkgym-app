# Veredito: densidade-linear
data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/01-densidade-linear.md
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 1 fora (alvo: 4 botões sem altura de dedo em hoje.tsx:106,146,165,191). tipos pior=4; régua pior=0; preenchido 0 cenas > 1; contraste ink 18,16 / mute 5,73 / faint 5,01 / ghost 3,05 / stamp-hi 6,39; superfícies 1,16 / 1,22 / 1,29. O 0 de tipos não é a barra: `medirTipos` conta classes no corpo da função exportada, não o pixel da dobra com chrome.

O que a passada 74e911d fechou, conferido no arquivo: `.t-kicker` agora é `var(--text-body)` (styles.css:129-137) — o rótulo de seção no mesmo tamanho da linha. `.t-title` desceu de 700 para 600 (styles.css:170-175). Scoreboard e raid deixaram `t-title` e pintam `t-kicker`/`t-body`/`t-small` (bits.tsx:95-104, hoje.tsx:165-168). HoldTick é `bg-transparent` (bits.tsx:252). Nome da linha ganhou `truncate` (hoje.tsx:112). Folha social passou a `var(--color-surface)`, ΔL* 7,5 contra o bg (styles.css:254). Nenhuma dessas linhas vence B1.

Afirmação falsificável: a dobra do Hoje (chrome incluso) ainda viola Linear B1, B2 e B3 ao mesmo tempo — corpos 13 / 15 / 17 / 21, razão 21/13 = 1,62 > 1,40; três pesos com 700 na primária da densa; faint e ghost fora das faixas, stamp-hi é o quinto cinza.

brechas:
- hoje.tsx:50-61 + hoje.tsx:97-98 + bits.tsx:16-17,178-179 + shell.tsx:33-35,63 — corpos no pixel da dobra: 13 (status `t-mono`, meta do Thumb), 15 (`t-small` da ofensiva, da linha, da TabBar), 17 (`t-body`, `t-kicker`/Place, Quiet, rótulo do Thumb), 21 (Display/`t-title` do nome da ficha). São 4. Linear B1 escrito: no máximo 2, densa em 1; quando há 2, razão 1,15–1,30; qualquer razão acima de 1,4 é falha. 21/13 = 1,62. 17/15 = 1,133, abaixo de 1,15. O teto 5 do `medirTipos` é a fundação, não a barra.
- styles.css:37-47 — dez nomes, seis pixels (11 / 13 / 15 / 17 / 21 / 25). display, hero, score e plate valem o mesmo 25. O 25 não pinta na dobra do Hoje: Display é `t-title` 21 (bits.tsx:179). C1 pedia resolver a carga no mesmo tamanho; serie.tsx:65 e serie.tsx:91 põem o nome e o kg em `t-title`, o mesmo 21 de hoje.tsx:98. Um tamanho para três jobs não é densidade, é colapso.
- styles.css:122-209,350 — pesos 500 / 600 / 700. Linear B2: exatamente 2, delta 50–110, 700+ na densa é falha, peso forte ≤ 12% dos glifos. Hoje mistura `t-body`/`t-kicker`/`t-small`/`t-mono` 500, Display `t-title` 600, TabBar `font-semibold` 600 (shell.tsx:63) e `.thumb` 700. O 700 saiu do título e ficou na primária, que é o maior bloco da dobra.
- styles.css:26-29,32 — B3 pede 4 níveis: primário 13–18, secundário 4,5–6,5, terciário 3–4, apagado 2,0–2,6, razão ≥ 2,4, quinto nível é falha. ink 18,16 estoura o teto. mute 5,73 acerta o secundário. faint 5,01 deveria ser terciário e mora no secundário. ghost 3,05 deveria ser apagado. stamp-hi 6,39 é o quinto. Razão 18,16/5,73 = 3,17 ≥ 2,4 — o único número da faixa que passou.
- styles.css:14-19 — seis faces (sunk, bg, dock, surface, raised, fill). B8: 3–4 superfícies, ΔL* 3–8 entre vizinhas, amplitude ≤ 20. dock `#0c0c0c` contra bg `#0a0a0a` é ΔL* 0,6. Amplitude fill–sunk = 24,4.
- hoje.tsx:108 — `gap-3` (12 pt) entre nome e marca. B6: vão contínuo ≥ 15% da largura em 100% das linhas. 12/390 ≈ 3%. O `truncate` (hoje.tsx:112) fechou o transbordo; o vão não.
- hoje.tsx:108 — linha `min-h-[52px]` com duas linhas de tipo (corpo 17 + small 15). B5: passo 1,9–2,2× a altura de uma linha só; cabeçalho de grupo = 1 slot. Place + Display + lista + raid + Scoreboard gastam vários slots. Agrupar custa altura.
- hoje.tsx:165-186 — raid e Scoreboard na primeira dobra, cada um com kicker próprio e `onClick`/`onPress`. B10: objeto secundário sem título, sem navegação, ≤ 18% da dobra, 0 alvo de conclusão. Os dois navegam. B12 na densa: 0 preenchidos; o Thumb (hoje.tsx:124-128) é tinta cheia no meio da dobra.
- styles.css:240-270 + app-root.tsx:93-95,176-191 — `.sheet` agora é surface (ΔL* 7,5, dentro de 4–10) e 35% × 25%. Véu 0% é o único número que acerta B9. Como/Ficha sobem `sheet-card` 55% (app-root.tsx:94). O rack (`RACK` = serie/descanso/feito) ainda substitui a cena: B15 pede empurrar e truncar, não troca total.
- bits.tsx:252 + serie.tsx:107-114 — quatro `HoldTick` em `bg-transparent` + um Thumb. A face cheia saiu. B12 / C12: 0 preenchidos na execução, ou exatamente 1. A Série agora tem 1 massa (o Thumb). A dobra densa do Hoje continua com 1, e a barra da densa pede 0.
- bits.tsx:182-194 — vazio da ficha: título + parágrafo + Thumb + Quiet. B13: ≤ 12% da altura, 0 ilustração, ou o próprio campo da ação. Nunca parágrafo + botão.
- styles.css:363-364,430-431 — `.thumb:active` escala 0,994; `.thumb-line:active` escala 0,985. B14 / C14: pressionado muda só o fundo, ΔL* 3–6, 0 escala, < 100 ms.
- styles.css:343-347 — `.thumb` mistura branco na face (`color-mix(… ink 100%, white)`). 00: degradê que mistura tinta clara na face é recusa, não ajuste.
- hoje.tsx:106,146,165,191 — o medidor de alvo saiu da linha: 4 botões sem classe de 44 pt. A passada trocou `h-12` por `min-h-[52px]` numa linha e tirou altura das outras três. Número 0 → 4.

o que venceria:
- Dobra do Hoje em ≤ 2 corpos no pixel (chrome incluso) com razão 1,15–1,30. Serie/Feito em 1 corpo + numeral tabular no mesmo tamanho.
- Exatamente 2 pesos, 700 ausente da densa. Quatro cinzas nas faixas B3, sem quinto (stamp-hi fora da escada de texto), ink ≤ 18.
- 3 superfícies, ΔL* 3–8, amplitude ≤ 20. Vão do meio ≥ 15% em 100% das linhas. 0 massa preenchida na densa; 1 na execução, HoldTick incluso. Overlay ΔL* 4–10, empurrando; primária sem mistura de branco.
