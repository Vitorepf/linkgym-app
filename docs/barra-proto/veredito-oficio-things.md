# Veredito: oficio-things
data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/02-oficio-things.md
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 1 fora (alvo 4 em hoje.tsx). escala 0 avulsos, 10 degraus, maior salto 1,24; tipos pior=4; movimento 4 durações; croma das 8 faces nomeadas 0 > 6%; plate não mistura ink (o medidor só pergunta isso). Vizinhos 1,13–1,24 e extremos do sistema 25/11 = 2,27 são verdade. O 25 não pinta no Hoje. Não são a barra.

O que a passada 74e911d fechou, conferido no arquivo: a escada restaurou o 25 (styles.css:37-47, comentário 2,27×). Como/Ficha saíram do RACK e sobem `sheet-card` 55% sobre o rack vivo (app-root.tsx:93-94,176-191; styles.css:258-270). Dock perdeu a régua de ponta a ponta (shell.tsx:71-80). Série cumprida é `bg-line`, mais escura que o ativo `bg-edge` (serie.tsx:80-83). HoldTick sem face (bits.tsx:252). `.t-title` é 600 (styles.css:172). Feito de patamar usa `t-display` 25 (feito.tsx:28). As duas primeiras são vitórias parciais de B20 e C0.1. Não empata o eixo.

Afirmação falsificável: a escada visível do Hoje tem extremos 21/13 = 1,62, abaixo do piso Things B1 de 2,0–2,3×; serie / descanso / feito ainda substituem a cena inteira, contra B20 (cartão 40–70% com ≥ 2 linhas do contexto atrás).

brechas:
- styles.css:37-47 — únicos pixels 11 / 13 / 15 / 17 / 21 / 25. Vizinhos 13/11 = 1,18, 15/13 = 1,15, 17/15 = 1,13, 21/17 = 1,24, 25/21 = 1,19: todos dentro de 1,10–1,35. Extremos do sistema 25/11 = 2,27, dentro de 2,0–2,3. Na dobra do Hoje o 11 e o 25 não pintam: extremos 21/13 = 1,62. B1: ≤ 5 corpos por tela (o count passou: 13/15/17/21), extremos 2,0–2,3×. C1 pedia o 40–56 só no recibo; feito.tsx:28 usa `t-display` 25, e o corpo ao lado é 17. 25/15 = 1,67 se a data `t-small` entra.
- styles.css:122-209,350,494-495 — pesos 500 / 600 / 700, e `.led` 800 ainda no CSS. B2: ≤ 3 por tela, um peso por função, zero negrito dentro de linha. `t-title` 600 e `.thumb` 700 convivem com `t-body` 500 na mesma dobra (Hoje, Serie, Feito). TabBar acrescenta `font-semibold` 600 (shell.tsx:63).
- bits.tsx:263-320 — Face padrão 36 pt; iniciais caem em 10 ou 11 px, fora da escada. hoje.tsx:147 Face 36, hoje.tsx:194 Face 28, ambas `items-center`. B3: ícone de linha 18–22 pt, centro óptico ±1 pt da maiúscula do título, nunca no centro da linha quando há subtítulo.
- hoje.tsx:99,123 — `mt-4` (16 pt) da lista e `mt-5` (20 pt) antes do Thumb; respiro intra-lista é `py-2.5` (10 pt). Razão 2,0×. B5 pede ≥ 2,5× e a distância cabeçalho→primeira linha menor que última→próximo cabeçalho por ≥ 1,8×. C5: constante, variação < 2 pt. Não é.
- bits.tsx:492 — Segment nasce com `border-b border-line` de borda a borda, ativo com `border-b-2`. B7: ≤ 1 pt, contraste local < 8% do delta fundo→corpo, recuo ≥ largura do rótulo. C0.2: no escuro, 1 px a 8–10% de branco ou nenhuma régua e só o vão. O Dock (shell.tsx:72-80) acertou a ausência de régua; o Segment não.
- styles.css:4-7,31-35 — um vermelho para vivo, carimbo, recorde e ofensiva em risco. B8: cada cor, um significado, ≤ 3 aparições. bits.tsx:426 Stamp em `text-stamp`; serie.tsx:91 pinta carga vazia `text-stamp`; stamp-dim `#3a1109` S=0,84 (00: croma quente no escuro é falha; o medidor de croma não olha stamp-dim).
- serie.tsx:80-83 — série cumprida é `bg-line`, corrente `bg-edge`, futura `bg-raised`. A cumprida agora é a mais escura. C0.1 no escuro (0 promoção de fundo; luminância do feito < a do ativo) passou. kit.tsx:169-171 — Chip `quiet` / `live` / `done` continuam o mesmo `bg-raised text-ink`; o feito não rebaixa. B9 pede ≥ 3 marcas independentes; no Chip as três são uma.
- hoje.tsx:165-186 — raid + Scoreboard na primeira dobra, cada um com kicker e alvo. B10: objeto secundário sem título, sem navegação, sem alvo de conclusão, ≤ 18% da primeira dobra. Os dois juntos passam de 18% e os dois navegam. B11: ≥ 2 formas, 0 rota de primeiro nível; cada um abre overlay.
- kit.tsx:272-282 e shell.tsx:72-80 — ActionBar/Dock de borda a borda, opacos. B13: largura pelo conteúdo, ≤ 4 ações, ≤ 2 com rótulo, altura 48–56, lista visível e rolável atrás. A barra come 100% da largura. No rack a lista do Hoje some.
- styles.css:334-364 — Thumb full-bleed, face `#f5f5f5` com degradê para branco, o pixel mais claro da tela (ink L*=96,5). B15 pede FAB 52–60 pt que não se move. C0.3: no escuro o preenchido nunca é o ponto mais luminoso; tem de existir conteúdo mais claro que o botão. Não existe. 00: mistura de tinta clara na face é recusa.
- bits.tsx:182-194 — NoSheet: parágrafo + Thumb + Quiet. B18: ≤ 2 linhas, 0 ilustração, frase nomeia o gesto, sem botão que duplique o da barra.
- app-root.tsx:93,157,176 — `serie` / `descanso` / `feito` substituem a cena. B20: cartão 40–70% da altura, ≥ 2 linhas do contexto ainda legíveis. Como/Ficha (app-root.tsx:94) acertam o número no `sheet-card` 55%. A folha social (styles.css:246-248, 25%) acerta o orçamento Stripe e mente no Things: 25% < 40%. "Rack de propósito" é o opposite de B20. serie.tsx:67-73 e 115-120: "Ficha" e "Como fazer" agora abrem cartão, não cena — B19 / C19 daqueles dois fechou. O caminho diário (Série) continua troca total. TabBar (shell.tsx:48, app-root.tsx:194) não some: verdade, e não empata B1, B13, B15, B18 nem B20.
- kit.tsx:59-62 — `plate` liga em `onPress` **ou** `tone === "raised"`. `.plate` (styles.css:228-234) ainda leva sombra de 40 px. Things B20/C20 separam por elevação; 00 pede face plana e fio frio.

o que venceria:
- Escada real no pixel da dobra: ≤ 5 corpos, extremos 2,0–2,3× (o 25 do sistema tem de pintar, ou o 13 tem de sair), vizinho 1,10–1,35. Degrau 40–56 só no recibo, uma vez. ≤ 3 pesos.
- 0 régua de borda a borda; separação só por vão ≥ 2,5× constante. Face 18–22 pt ancorada na maiúscula.
- Uma cor de estado, um significado, ≤ 2 aparições; no escuro, 0 face mais clara no item feito e 0 mistura de branco na primária.
- Dock/ação com largura pelo conteúdo e lista atrás; detalhe em cartão 40–70% também no rack (Série/Descanso/Feito não são cena nova); primária que não seja o pixel mais luminoso.
