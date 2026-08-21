# CICLO 9 — MATERIAL: o defeito 4 do dono

> "não tem elementos visuais diferentes somente cores e poucas cores, sem variedade de
> elementos como o iphone mudou o material dos componentes chamado glass"

Este documento é o relato do lote de MATERIAL. Ele cobre `src/theme.ts` e `src/ui/Screen.tsx`
e mais nada — o cardápio do editor, a lista da API e os kits de fábrica foram feitos em
paralelo por quem é dono daqueles arquivos.

---

## 1. O que estava quebrado: `vidro` não era mentira de desenho, era mentira de encanamento

A máquina do vidro já estava inteira em `src/theme.ts` e não tinha **um leitor sequer**:

- `alfaDoVeu()` resolvia o alfa que compõe exatamente `T.raised` sobre o chão;
- `veuLegivel()` recuava esse alfa até as quatro tintas (`muted2`, `muted`, `ink` a 4,5:1 e
  `divider` a 3:1) limparem o piso contra o pixel composto;
- `VIDRO.vidro = 26` era um raio de desfoque, gravado em toda `Folha` como `vidro:` e
  reexportado como `FORMA.vidro`.

Fora de `theme.ts` esses campos apareciam em exatamente dois lugares: um rótulo de tela e um
comentário. A `Band` calculava a superfície e a desenhava **sem envelope nenhum**. O
personal escolhia Vidro e recebia sombra.

Além disso, `ELEVACAO` (um `Record<Superficie, number>` com 0,18 para o vidro e 0,3 para a
elevada) era **código morto**: nenhum leitor, e os números que ele guardava nem eram os que
`criarTema` usa (0,12). Foi apagado.

---

## 2. O que embarcou

### (a) `vidro` passou a ser vidro

`Band` monta três estratos, nesta ordem, que é a ordem física do material:

1. `BlurView` com `intensity={peca.vidro}` — o desfoque do que passa atrás;
2. o **véu do tema** como filho preenchendo o `BlurView`, com o alfa **intocado**;
3. o conteúdo.

`peca.fundo` deixou de ser pintado por `styles.raised` quando há vidro — dois véus
empilhados não são um material que exista, e o pixel de vidro sobre vidro é um vizinho que
medidor nenhum deste repo sabe olhar.

**Honestidade sobre o alcance:** numa `Band`, que pousa no chão liso, o raio de desfoque não
tem o que desfocar. O que muda o pixel ali é o tint e a saturação do material. O desfoque
vira desfoque de verdade no dia em que uma superfície pousar **por cima de conteúdo**
(o modal do defeito 6, por exemplo) — a folha e a tela já estarão prontas, sem uma linha a
mais. O dock continua **sem** `BlurView`, e isso não é economia: a §10.4 fechou por número
(o rótulo inativo cai de 4,52 para 1,04, e o véu que segurasse 4,5:1 pediria alfa 0,867–0,933,
acima do `VEU_MAX` 0,62 — vidro que exige parede não é vidro).

### (b) `fio` — a moldura dupla

Dois traços que **nunca se encostam**: o delimitador na aresta de fora e o fio de luz numa
caixa interna, afastada dele por `SPACE.hair`.

O delimitador vem no traço **fino** (`FORMA.fio`), e não no forte. É o que faz a família
caber — dois traços grossos em volta do mesmo bloco não leem como moldura, leem como gaiola
— e é também o que separa esta moldura da do `contorno` no PIXEL, e não só no nome.

`fio` **pousa**: `veuComposto` é `chao.raised`, como a sólida. A primeira versão o fez vazado
como o `contorno` e isso reprovou 967 pares (ver §5).

### (c) `vinco` — o avesso da `elevada`

- chão escuro: o fio de luz desce para a aresta **de baixo** — é onde um rebaixo pega a luz
  que vem de cima. Quem carrega isso é o campo novo `Folha.arestaEm`, sem o qual `vinco` e
  `elevada` sairiam byte a byte iguais nos quatro chãos escuros;
- chão claro: `sombraDoVinco` é `sombraDe(elevacao)` com o `shadowOffset.height` invertido —
  mesma peça deitando a sombra para cima. Sai de `sombraDe` para o raio e a opacidade nunca
  divergirem dos de `elevada`;
- moldura (dock): a moldura rebaixada **não pinta degrau próprio**, ela afunda até
  `chao.bg`. É o único movimento disponível — abaixo de `bg` a escada não tem degrau — e
  `bg` é um dos quatro fundos medidos, então nada do que se escreve ali sai da régua;
- peça pequena: ganha o **anel** do poço (`borda` cheia em `divider`) e não um lábio de luz.
  Um fio de meio ponto na aresta de baixo de um chip de 44pt lê como erro de renderização,
  não como rebaixo.

### O perigo da §2.7/§31, e como ele foi evitado

O ciclo 7 pagou 44 de 112 pares (pior 1,22) por usar material como delimitador. As regras
seguidas aqui:

- o delimitador de `fio` continua **sozinho** na aresta de fora, em `chao.divider`, que é
  3:1 contra os quatro fundos por construção da escada;
- o segundo traço mora numa caixa **deslocada** (`styles.moldura`, absoluta, com `margin:
  SPACE.hair`), nunca empilhado na mesma aresta;
- o fio do `vinco` **cede a aresta** a quem já fala nela: `raised && rule === "none" &&
  styles.vinco`. Numa Band com régua, quem fala embaixo é a régua;
- o bloco `dock:` de `Screen.tsx`, que a §31 lê por texto, **não foi tocado**: continua
  `borderTopColor: chrome.corDaBorda`.

---

## 3. A armadilha do tint, e por que ela não quebra a invariante

`expo-blur` pinta um `rgba()` próprio embaixo de todo tint
(`node_modules/expo-blur/build/getBackgroundColor.js`), e na web ele entra **depois** do
estilo declarado (`<View style={[style, blurStyle]}>`): não existe `backgroundColor` que o
sobrescreva. Isso mexeria no pixel composto — que é a invariante inteira desta família.

A saída foi escolher o tint cujo `rgba` é o **extremo puro do lado oposto ao da tinta**:

| chão | tint | `rgba` da tabela | com `intensity` 26 |
|---|---|---|---|
| claro (tinta escura) | `systemChromeMaterialLight` | `255,255,255 × 0,97` | alfa 0,2522 de branco |
| escuro (tinta clara) | `systemChromeMaterialDark` | `0,0,0 × 0,75` | alfa 0,195 de preto |

Assim a contribuição do tint é **monótona e sempre a favor**: ele afasta o composto da
tinta, nunca o aproxima. O número que `veuLegivel` já resolve **sem** o tint vira um **piso**.

Medido, nos sete chãos do cardápio (margem = pior das quatro razões dividida pelo piso dela;
≥ 1 aprova):

| chão | escuro | alfa do véu | composto medido | composto embarcado | margem medida | margem real |
|---|---|---|---|---|---|---|
| carvao | sim | 0,069 | `#1b1a1a` | `#191818` | 1,005 | **1,026** |
| breu | sim | 0,082 | `#151515` | `#151515` | 1,056 | 1,056 |
| grafite | sim | 0,064 | `#1c1d1f` | `#191a1c` | 1,100 | **1,135** |
| tabaco | sim | 0,074 | `#201e1c` | `#1d1b1a` | 1,009 | **1,042** |
| papel | não | 0,620 | `#f9f8f6` | `#fafaf9` | 1,257 | **1,277** |
| neve | não | 0,620 | `#f7f8f9` | `#f9fafa` | 1,253 | **1,274** |
| linho | não | 0,620 | `#f8f8f7` | `#fafaf9` | 1,262 | **1,284** |

E em 8.192 chãos livres (grade RGB de passo 17 x 2 contrastes): o tint **piorou o piso em
0 casos**, melhorou em 8.190, e a pior margem real foi 1,015.

**Este limite é exato na web** — o `rgba` sai da tabela do pacote e o desfoque de um chão
liso é o próprio chão, com `saturate(180%)` preservando luminância por construção. **No iOS
vale só a DIREÇÃO**: lá estes dois nomes viram materiais do `UIVisualEffectView` e a cor
exata é da Apple, não nossa.

`escuro` (o mesmo 0,18 que decide a direção da escada) é quem responde "de que lado está a
tinta". Conferido nos 7 chãos do cardápio e em 4.096 chãos livres x 2 contrastes = 8.206
casos: **0 discordâncias** contra a direção real de `ink`, `muted`, `muted2` e `divider`.

---

## 4. Os dois defeitos do `expo-blur`, e o desenho em volta deles

**`borderRadius` no `BlurView` não é aplicado.** Quem arredonda é um **filho que recorta**
(`styles.vidro`: absoluto, `overflow: "hidden"`, `borderRadius: FORMA.raio - peca.borda`), e
não a própria peça. O motivo de não ser a peça é medido: `overflow: "hidden"` na peça mataria
a sombra do vidro no chão claro (o iOS descarta a sombra de quem recorta os filhos) — e no
claro é a sombra que separa a superfície do chão, porque branco sobre quase-branco tem 6,5
de L\* de curso inteiro. Recortar num filho sem sombra paga as duas contas de uma vez.

**Android exige `experimentalBlurMethod="dimezisBlurView"`, documentado como experimental.**
Não foi ligado, e é decisão e não esquecimento: numa `Band` que pousa no chão liso o
desfoque não tem o que desfocar, então ligar um caminho experimental ali é custo de GPU por
zero pixel de diferença — o mesmo argumento que a §10.4 já usou contra o dock de vidro. Sem
ele o Android cai no `View` semitransparente, que é exatamente o véu que já pintamos, com o
mesmo tint. **Consequência honesta: no Android, hoje, `vidro` não desfoca.** No dia em que
uma superfície pousar sobre conteúdo, ligar a prop é uma linha.

---

## 5. O que está medido, e o que NÃO está

### Antes / depois

| medidor | antes | depois |
|---|---|---|
| `tools/aparencia.mjs` | 328.694 pares · **0 reprovam** | 458.239 pares · **0 reprovam** |
| `medir.mjs contraste` | 0 | **0** |
| `medir.mjs soltos` | 0 | **0** |
| `medir.mjs escala` | 1 | **1** |
| `medir.mjs tipos` (tsc) | 0 | **0** |
| `medir.mjs culpa` / `proibidas` | 0 / 0 | **0 / 0** |

O crescimento de 129.545 pares é das duas famílias novas (a lista de superfícies do medidor
passou a sair de `SUPERFICIES`, em `src/theme.ts`) mais o `porte`, que entrou no mesmo dia.

Houve um degrau intermediário de **2 reprovas que não eram material**: a conta em prosa do
cardápio (`o editor anuncia a conta certa` e `o README anuncia a conta certa`). O produto
cartesiano passou de `1.959.552` para **8.817.984** quando as duas famílias novas entraram
em `SUPERFICIES` (junto com o `porte`, do mesmo dia). Nenhum dos dois arquivos é deste lote,
e os dois já foram corrigidos por quem é dono deles.

### O passo intermediário que prova os dentes

A primeira versão de `fio` era `contorno` com um traço a mais: mesmo ramo de folha no dock e
na peça pequena. O medidor **reprovou 967 pares**, todos `contorno ≠ fio` nos estratos
`chrome` e `miuda`, em 7 chãos do cardápio e na grade de chãos livres. Foi isso que forçou
`fio` a pousar (fundo próprio), a levar o traço FINO na moldura (`borda: emFio ? fio : borda`
no chrome) e a ter ramo próprio em `folhaDe`. **Um par que passasse antes e depois não teria
medido nada; este mediu.**

### O veredito, em uma linha por material

- **`vidro`**: o VALOR da superfície está medido e continua intacto. **O desfoque em si
  embarca sem um par que pegasse a regressão** — se alguém apagar o `BlurView` da `Band`
  amanhã, medidor nenhum deste repo acusa, exatamente como `vidro` passou três ciclos no
  cardápio com zero leitores.
- **`fio`**: as três folhas estão medidas e foi o medidor que corrigiu o desenho (967 → 0).
  **A geometria dos dois traços — o que impede o segundo de encostar no delimitador —
  embarca sem par.**
- **`vinco`**: as três folhas estão medidas. **O fato de a aresta ser a de BAIXO embarca sem
  par**: `arestaEm` não é um campo que o medidor enxergue, então uma troca para a aresta de
  cima passaria calada e `vinco` viraria `elevada` com outro nome.

### Cobertura, material por material

| material | par que o cobre | número |
|---|---|---|
| `vidro` (valor do composto) | §6 `a superfície se afasta do chão`, §16 `folha {peca,chrome,miuda}`, §28 nos chãos livres, `tools/contrast.mjs` | 0 reprovam; véu inalterado |
| `vidro` (o desfoque em si) | **nenhum** | — |
| `fio` (as 3 folhas) | §16 `folha X ≠ Y`, §29 (Campo/Choice), §33 (as duas molduras), §28 nos chãos livres | 0 reprovam (eram 967) |
| `fio` (a geometria dos dois traços) | **nenhum** | — |
| `vinco` (as 3 folhas) | §16, §29, §33, §28 | 0 reprovam |
| `vinco` (a aresta ser a de BAIXO) | **nenhum** | — |

### O que embarca sem medida, dito sem rodeio

1. **O desfoque.** Nenhuma régua deste repo olha para `backdrop-filter`. `telas` só pergunta
   se a tela montou. O que está medido são as ENTRADAS do vidro (`folha.vidro`,
   `folha.fundo`, `veuComposto`), nunca o pixel desfocado.
   *Onde caberia o par:* uma seção que sirva o `dist` da web e leia o estilo computado da
   superfície de uma tela real, cobrando `backdrop-filter` não vazio quando
   `FORMA.folha.peca.vidro > 0`.
2. **A contribuição do tint ao composto.** `tools/contrast.mjs` e a §28 medem `veuComposto`,
   que é o composto **sem** o tint. A tabela da §3 acima é conta minha, feita à mão; régua
   nenhuma a impõe.
   *Onde caberia o par:* uma seção no desenho da §31 — ler a expressão de `tint` do bloco do
   `BlurView` em `Screen.tsx`, resolver o `rgba` pela tabela de `getBackgroundColor`,
   recompor e rodar `PISOS_SOBRE_O_VEU` contra o pixel resultante. Ela reprovaria no ato
   qualquer troca para um tint do meio da tabela (`systemThinMaterial`, `regular`…), que é
   exatamente o erro fácil aqui.
3. **A geometria das duas famílias novas.** `arestaEm` não está em `CAMPOS_DA_FOLHA` (a
   lista é fechada em `tools/aparencia.mjs`), e nenhuma régua lê os blocos `moldura:` e
   `vinco:` de `Screen.tsx` como a §31 lê o `dock:`. Ou seja: hoje **nada impede** alguém de
   empilhar o segundo traço na mesma aresta do delimitador, que é o defeito de 44/112 do
   ciclo 7 voltando pela porta nova.
   *Onde caberia o par:* `arestaEm` entra em `CAMPOS_DA_FOLHA`, e uma seção lê de
   `Screen.tsx` (a) que o bloco `moldura` declara `margin` > 0 e uma `borderColor` que NÃO é
   `T.divider`/`T.ink`, (b) que o bloco `vinco` declara `borderBottom*` e é aplicado sob
   `rule === "none"`. Para o par valer também nas peças pequenas, `Campo.tsx` e `Choice.tsx`
   precisariam consumir `arestaEm` — hoje elas pintam a aresta numa borda fixa.
4. **O caminho Android.** Sem `dimezisBlurView`, e nenhuma régua roda em Android.

---

## 6. O que ficou de fora, e por quê

- **Vidro sobre foto.** Não existe campo de foto no produto: `Time` carrega só `logo_url`,
  renderizado no tamanho 34 em quatro lugares, e o hospedeiro das capturas não vai à rede.
  Fosco sobre foto seria inventar um dado.
- **Vidro no dock e na barra de abas.** Refutado com número na §10.4 (4,52 → 1,04; alfa
  necessário 0,867–0,933 contra o teto 0,62).
- **Ruído / textura.** Não entra: é pixel que medidor nenhum sabe olhar e que não responde a
  nenhuma alavanca do cardápio.
- **Degradê.** Fica **fora deste lote, de propósito**: um fundo que varia dentro da própria
  peça briga com o limiar por linha de `tools/ritmo.mjs`, que mede a borda de cada faixa
  horizontal. Ele precisa da régua antes do material, não depois.

---

## 7. Um pedido ao dono do documento: a SPEC §9 está desatualizada por FATO

`docs/aparencia/SPEC.md:425` recusa o desfoque assim:

> **`expo-blur` / desfoque real / `boxShadow`.** Dependência nova (e `experimentalBlurMethod`
> no Android, sem a qual o Android recebe tinta translúcida e não blur) para uma textura que
> o véu por alfa já entrega dentro do valor medido.

A primeira metade é **factualmente falsa hoje**: `expo-blur` está em `package.json` desde
antes deste ciclo (`~15.0.8`, e o `git show HEAD:package.json` mostra a mesma linha), então
usá-lo não custa dependência nenhuma. Este lote não adicionou pacote algum.

As outras duas metades continuam corretas e foram **obedecidas**, não contornadas:
o Android sem `experimentalBlurMethod` recebe tinta translúcida e não desfoque (§4 acima, e é
a razão de a prop ficar desligada), e a régua velha de que "o véu por alfa já entrega a
textura dentro do valor medido" é justamente por que o véu não foi tocado — o `BlurView`
entrou **embaixo** dele.

**A frase precisa da emenda do dono do documento.** Não editei `SPEC.md`: ele é a régua de
gosto do repo e mudar a razão registrada de uma recusa é ato do humano, não do agente. O
que a emenda precisa dizer, na minha leitura: a recusa por "dependência nova" caiu; o que
sobrevive dela é o alerta de Android e a exigência de que o desfoque não mexa no VALOR da
superfície — as duas condições que este lote cumpre.

---

## 8. O que ficou pendente

1. **As três réguas da §5** — desfoque, tint e geometria — todas em `tools/`, que não é
   deste lote. Enquanto elas não existirem, os três itens do veredito continuam embarcando
   sem par.
2. **A emenda da SPEC §9** (§7 acima): ato do dono do documento.
3. **Android**: `experimentalBlurMethod` desligado por decisão; reavaliar quando uma
   superfície de vidro pousar sobre conteúdo.
4. **A captura**: nenhuma tela foi fotografada por este lote — o harness (`tools/shots.mjs`)
   é de quem coordena o ciclo, e o vidro, o `fio` e o `vinco` ainda não foram vistos num
   PNG. O `expo export --platform web` do bundle passa (exit 0) e o `backdrop-filter`, o
   `saturate(180%)` e os dois nomes de tint estão dentro do JS exportado; o que falta é o
   olho.
