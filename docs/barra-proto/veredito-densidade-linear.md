# Veredito: densidade-linear
data: 21 ago 2026 (rodada 4)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/01-densidade-linear.md B1/B2/B4/B12 + docs/barra-proto/passada-4-mobbin.md (Linear Mobile Active issues + linha 1 das oito)
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. tipos pior=4; régua pior=0; preenchido 0 cenas > 1; contraste ink 18,16 / mute 5,73 / faint 5,01 / ghost 3,05; superfícies 1,16 / 1,22 / 1,29; escala 0 avulsos, maior salto 1,24. 0 fora não é vitória: o medidor conta classes no corpo da função, não o pixel da dobra, e aceita 1 Thumb por cena.

Afirmação falsificável: o furo B2 da rodada 3 fechou no pixel — a dobra densa do Hoje (chrome incluso, seed com ficha) pinta 1 corpo 17 e exatamente 2 pesos 500/600, 700 ausente. O eixo ainda perde Linear B12 / pack linha 1: a mesma dobra tem 1 botão preenchido (Thumb «Começar»), contra 0 da Active issues e contra «0 botão preenchido na densa».

O que fechou (pixel, não comentário):
- B2 / pack 2 pesos — `t-body` / `t-kicker` / `t-small` / `t-mono` / `quiet` em 500 (`styles.css:122-168`, `399-406`). `.thumb` em 600 (`styles.css:345`). TabBar ativa `font-semibold` 600, inativa `font-medium` 500 (`shell.tsx:63`). Zero `font-weight: 700` no CSS. Rodada 3: 500 / 600 / 700, 700 na primária.
- seção = linha razão 1,00 — `Place` é `t-kicker` (`bits.tsx:16-18`); `t-kicker` usa `--text-body` 17, o mesmo de `t-body` (`styles.css:129-137`, `163-168`). «O de hoje» e o nome da linha medem o mesmo corpo (`hoje.tsx:91-105`).
- 0 régua entre linhas — `<li>` / `<button>` da ficha sem `border-*` (`hoje.tsx:99-112`). Segment perdeu o `border-b` de ponta a ponta (`bits.tsx:490-504`).
- B1 densa em ≤2 corpos — chrome `t-body` 17 (`shell.tsx:34-35`), TabBar `t-body` 17 (`shell.tsx:63`), lista / ofensiva / Raid / placar / Aceito / Quiet (`t-sub` = 17, `styles.css:39,155-160`) todos 17. A Active issues tem 2 (título 22–26 + linha 15–17). A barra 01 B1 pede a densa em 1; 1 não é falha de B1.
- Face 36 e Raid/Scoreboard com kicker+alvo saíram desta dobra (`hoje.tsx:139,163` `size={20}`; `hoje.tsx:178-183` são `<p>` sem `onClick`).

brechas:
- styles.css:334-349 + hoje.tsx:116-120 — B12 / pack linha 1: 0 botão preenchido na densa, soma de tinta de ação = 0. `.thumb` é caixa 54×100% com `background-color: color-mix(… ink 82%, bg)` (~#cbcbcb, L* ~82). «Começar» + «48 min» é a única massa preenchida da dobra. Aceito é contorno (`hoje.tsx:146`). Quiet é texto. A Active issues tem 0.
- styles.css:14-19 — B8: 3–4 superfícies, amplitude ≤ 20 L*. sunk = bg = dock `#0a0a0a` (3 nomes, 1 pixel) + surface `#1c1c1c` + raised `#2c2c2c` + fill `#3d3d3d` = 4. Amplitude fill−sunk ≈ 23 L* (25,8 − 2,7). Vizinhos 7,6 / 7,7 / 7,8 cabem em 3–8; o teto de faixa não.
- bits.tsx:181-194 — NoSheet: `Display` (`t-title` 21) + parágrafo + Thumb + Quiet. B13: ≤ 12% da altura, 0 ilustração, ou o próprio campo da ação. Nunca parágrafo + botão. Fora da dobra com ficha (seed `PRESCRIPTION.items.length === 3`); a barra ainda conta a cena vazia.
- kit.tsx:321-322 — `MarkStrip` pinta `t-display` 25 + `t-micro` 11 no slot do Thumb. Não está no Hoje em repouso; entra na Série depois do toque (`serie.tsx:126-127`). Não reabre o B1 do Hoje.

o que venceria:
- A dobra do Hoje (chrome incluso) com 1 ou 2 corpos, seção = linha 1,00, exatamente 2 pesos, 0 régua entre linhas — isto já está. Falta 0 botão preenchido no mesmo quadro: a primária da densa sem caixa de tinta, marcada por posição e peso, como o «+» fantasma da Active issues.
- Amplitude de superfície ≤ 20 L* entre o pixel mais escuro e o mais claro das faces nomeadas.
