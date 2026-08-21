# Veredito: densidade-linear
data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/01-densidade-linear.md
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/perfil.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/ui/kit.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. tipos pior=4 (teto adotado 5); régua pior=0; preenchido 0 cenas > 1; contraste mute 7.85, faint 5.01, ghost 3.05, ink 18.16; superfícies bg→surface 1.16 / 1.22 / 1.29. O medidor de tipos conta classes no corpo da função exportada, não o que a dobra pinta: Hoje importa Display (22) e Scoreboard (24) e convive com TabBar (11) e status (12). A barra julga a tela, não o recorte do parser.
brechas:
- hoje.tsx:45-180 + bits.tsx:178-179 + bits.tsx:95-102 + shell.tsx:34,63 — tela densa pinta 7 corpos (11 / 12 / 13 / 17 / 21 / 22 / 24). Linear B1 pede 1 na densa, 2 no resto, razão ≤ 1,30. A fundação (00 §1) afrouxou para 5. Mesmo o teto frouxo cai quando se conta o que o olho vê, não o que `medirTipos` enxerga no arquivo.
- styles.css:37-47 — dez nomes em 11–25 px. Os cinco de cima (21 / 22 / 23 / 24 / 25) têm vizinho 1,04–1,05. Linear B1: razão acima de 1,4 é falha; abaixo de 1,15 também não é escada, é o mesmo corpo com cinco apelidos. C1 pedia resolver a carga sem crescer o tipo: serie.tsx:94 põe o kg em `t-title`, o mesmo 21 de hoje.tsx:161 (marca da raid).
- styles.css:122-208,327 — pesos 500 / 600 / 700. Linear B2: exatamente 2, delta 50–110, 700+ em tela densa é falha. Hoje mistura `t-body` 500, TabBar `font-semibold` 600, `t-title`/`t-score`/`.thumb` 700. O 700 cobre título da ficha, placar e a primária — acima de 12% dos glifos.
- styles.css:26-29 — ink 18,16 (B3 primário 13–18, estoura o teto), mute 7,85 (secundário 4,5–6,5), faint 5,01 (terciário 3–4), ghost 3,05 (apagado 2,0–2,6). Razão 18,16 / 7,85 = 2,31 < 2,4. stamp-hi 6,39 é o quinto nível.
- styles.css:14-19 — seis faces (sunk, bg, dock, surface, raised, fill). B8 pede 3–4, ΔL* 3–8 entre vizinhas. dock `#0c0c0c` contra bg `#0a0a0a` é degrau invisível; a quantidade quebra a faixa.
- hoje.tsx:92-106 — `justify-between gap-3`, título sem `truncate`. B6: vão contínuo ≥ 15% da largura em 100% das linhas. 12 pt não é 15% de 390. Nome longo fecha o vão. kit.tsx:139 usa o mesmo `gap-3`.
- hoje.tsx:85-110 — passo de linha é `h-12` com duas linhas de tipo (corpo + small). B5 pede 1,9–2,2× a altura de uma linha só. Cabeçalho ("O de hoje" + Display + lista + raid + placar) custa vários slots. Agrupar custa altura.
- perfil.tsx:240 — palavra de estado ("aberta" / "aceita") por linha. B7: no máximo 1 vez por grupo; razão linhas:palavra ≥ 5:1.
- styles.css:240-254 + app-root.tsx:144-188 — `.sheet` pinta `background: var(--color-bg)`, ΔL* = 0 contra a página. B9 pede exatamente 1 passo (ΔL* 4–10), borda ≤ 1,6:1 e sombra. Véu 0% é o único número que acerta. O rack (`RACK` em app-root.tsx:93) substitui a cena inteira: B15 pede empurrar e truncar, não reflow nem troca total.
- bits.tsx:182-194 — vazio da ficha: título + parágrafo + Thumb + Quiet. B13: ≤ 12% da altura, 0 ilustração, ou o próprio campo da ação. Nunca parágrafo + botão. ui/feed.tsx:196-205: glifo em caixa 32 pt + título + linha, `max-h-[136px]` (~16% de 844).
- bits.tsx:246-255 + serie.tsx:103-109 — quatro `HoldTick` em `bg-fill` + um Thumb. B12: 0 preenchidos na densa; C12 da fundação: exatamente 1 por cena. O medidor só conta `thumb` e `bg-ink`/`bg-stamp`, então Serie "passa" com 5 massas cheias.
- styles.css:340-341,407-409 — `.thumb:active` escala 0,994; `.thumb-line:active` escala 0,985. B14 e 00 §2: escala só no preenchido; linha muda só o fundo, ΔL* 3–6, 0 escala. C14: < 100 ms, 0 escala.
- styles.css:311-324 — `.thumb` mistura branco na face (`color-mix(… ink 100%, white)`). 00: degradê que mistura tinta clara na face é recusa, não ajuste.
- hoje.tsx:159-180 — raid e Scoreboard com kicker próprio e alvo. Densidade da primeira dobra é parágrafo de mecanismo, não token. B10 vizinho: objeto secundário sem título e sem navegação.
o que venceria:
- A dobra do Hoje em ≤ 5 corpos distintos no pixel (chrome incluso), Serie/Feito em 1 corpo + numeral tabular no mesmo tamanho; 2 pesos, 700+ ausente da lista; 4 cinzas nas faixas B3 com razão ≥ 2,4.
- Vão do meio ≥ 15% em 100% das linhas; passo de grupo = passo de linha ± 5%; 0 régua entre linhas (já); exatamente 1 massa preenchida por cena, inclusive HoldTick.
- Overlay com ΔL* 4–10 e véu 0%, empurrando e truncando; tab sem régua (já); primária sem mistura de branco na face.
