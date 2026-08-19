# Ciclo 7 — oito defeitos que o medidor de 93.840 pares não via

O ciclo passado alargou o cardápio para 1.959.552 aparências. Um crítico adversarial mediu o
resultado e achou **oito defeitos reais**. Nenhum deles reprovava em `tools/aparencia.mjs`, e
em três casos pelo motivo mais caro possível: **o par aferia um objeto que a tela tinha
deixado de pintar.** A régua media a folha que o tema declara; a tela pintava outra coisa.

Este ciclo não acrescentou uma linha de cardápio. Cada conserto veio com a régua que o teria
pego, e cada régua veio com o número de quantos pares REPROVAM sob a regra velha — porque par
que passa antes e depois do conserto não mede nada.

**Estado final medido:** `node tools/aparencia.mjs` → **119.103 pares, 0 reprovam**
(eram 93.840 no início do ciclo; sete seções novas, 26 a 32). `npx tsc --noEmit` limpo.
`criarTema()` sem argumento sai **byte a byte idêntico** — snapshot JSON do tema inteiro
contra o tema pré-conserto: **0 linhas diferentes**.

**A prova agregada.** As sete réguas novas rodadas contra o `src/theme.ts` de antes dos três
consertos de tema: **2.284 de 119.103 pares reprovam**. Contra o código de hoje: 0. A regra
velha aqui não é uma segunda conta escrita à mão — é o próprio arquivo com os consertos
revertidos.

---

## A doutrina que este ciclo escreveu

Uma frase, e ela é a razão de quatro das sete seções novas lerem o TEXTO do arquivo de tela:

> **A régua mede o pixel que a tela pinta, não o token que o tema declara.**

A seção 16 compara o objeto `Folha`: ela prova que `solida` e `elevada` são objetos
diferentes. Isso é verdade e é insuficiente — se a peça descarta o único campo em que as duas
diferem, o cardápio cobra a alavanca mais cara e a tela não muda um pixel. Foi exatamente o
defeito 4. As seções 29, 30, 31 e 32 abrem o arquivo, descobrem o que a peça CONSOME, e cobram
isso. Esconder um token atrás de um helper importado cega o medidor: por isso o snippet do fio
está duplicado em Campo e Choice **de propósito**, e está anotado como tal no código.

---

## Defeito 1 — o aviso não se lia em três dos quatro fundos

**O número.** `errorInk` era a única tinta do sistema resolvida contra `T.bg`. As outras
resolvem contra o **chão difícil** — o pior dos quatro fundos. No carvão, no padrão de
fábrica: **4,42:1 sobre `surface` e 4,13:1 sobre `raised`**, contra um piso de 4,5. O aviso é
escrito dentro de uma Band em PerfilTime e em Aparencia, ou seja, sobre `surface`/`raised`, e
não sobre `bg`.

A seção 21 media o par certo e no fundo errado: ela pergunta se o aviso se separa da marca, e
resolve os dois contra `T.bg` — o mesmo fundo contra o qual a tinta era calculada. **A régua
velha confirmava a própria conta.**

**O conserto.** `src/theme.ts`: `errorInk = accentOn(PERIGO, chaoDificil(productTheme), 4.5)`,
e dentro de `criarTema` um `const dificil = chaoDificil(T)` alimentando o piso do `accentOn` e
o piso do `afastar`. A marca continua comparada como a tela a escreve (contra `T.bg`): quem
muda de chão é o PISO do aviso, não o par que decide se as duas cores são duas. A seção 21
continua medindo o mesmo objeto.

**A régua nova — §26, O AVISO PINTA NOS QUATRO FUNDOS.** `errorInk` contra bg/dock/surface/
raised em 7 chãos × 52 marcas × 2 contrastes, mais o aviso sobre `folha.peca` e `folha.chrome`
(os dois sítios reais, que são `<Txt>` dentro de Band) e a borda de erro do Campo sobre
`folha.miuda` no piso de UI.

**Dentes.** 1.519 pares reprovam sob a regra velha — dock 462, raised 384, surface 288, folha
chrome 209, folha peça 132, borda de erro do Campo 44. Contra `bg`: **zero**. Em laço isolado
(7 chãos × 30 marcas × 4 fundos): 636 de 1.680 abaixo de 4,5, pior **3,94**; depois do
conserto, 0 de 1.680.

---

## Defeito 2 — o segundo botão desligado escolhia a tinta na peça

**O número.** `GhostCTA.tsx` decidia sozinho pintar `T.muted` no estado desligado. Na
hierarquia `parelha` — em que o segundo botão é preenchido e a tinta ativa dele já vale
exatamente 4,5:1 contra o preenchimento — a tinta desligada media **1,00:1** contra o pixel em
que pousa. **441 de 630 combinações (70%)** de chão × marca × superfície ficavam abaixo do
piso. Nenhuma régua via: as seções 18 e 23 medem o par de ações LIGADO.

**O conserto.** A tinta desligada passa a vir do par de ações, não da peça.
`acaoSecundaria` ganhou `apagada(pousa, ligada) = accentOn(T.muted, pousa, 4.5)`, devolvida
como `desligada` nos três ramos, e `Tema.secundario` declara o campo. `GhostCTA.tsx:38` lê
`s.desligada`. Onde `muted` já limpa o piso — todo `salto`, todo `eco`, o app de hoje inteiro
— ela **é** `muted`, sem andar um centésimo.

A régua nova cobrou um segundo defeito dentro do próprio conserto: em **21 paletas de chão
claro** a tinta apagada chegava 0,04 mais FORTE que a ligada (parelha garante 4,5 e não mais
que isso). `apagada` devolve a ligada nesses casos — degradação contínua, sem `if` de exceção.

**A régua nova — §27, O SEGUNDO BOTÃO DESLIGADO.** `s.desligada` contra o pixel real (chão,
peça, moldura) nas três hierarquias, mais o par "desligado não grita mais que ligado".

**Dentes.** 735 pares reprovam sob a regra velha. Em laço isolado: salto 0/630, eco 0/630,
parelha **441/630**, pior 1,00; depois do conserto, 0/630 nos três.

**O que este conserto NÃO resolve, e está registrado como tal:** `eco` desligado é idêntico a
`eco` ligado. A tinta ativa de `eco` já É `T.muted`, e não existe degrau abaixo dela que ainda
limpe 4,5:1 — o piso de legibilidade come o único sinal de estado que a hierarquia mais
discreta tinha. O par §27 mede que o desligado não GRITA mais que o ligado; ninguém mede que
ele é DISTINTO. Consertar pede um segundo sinal (largura ou opacidade da borda no desligado),
que seria alavanca nova, e este ciclo é de conserto.

---

## Defeito 3 — o véu do vidro não respeitava `muted2`

**O número.** `alfaDoVeu` resolvia a opacidade contra `ink` e `muted`, e ignorava `muted2` — a
tinta de apoio que a Figure e as legendas escrevem. Em chão livre, `muted2` sobre o composto
do vidro media **3,36:1** no pior caso: 9 de 224 chãos livres amostrados em `peca` e 9 em
`chrome`, **todos em `vidro`**.

**O conserto.** `veuLegivel(chao, tinta, alfa)` recua a opacidade enquanto
`contrast(muted2, compor(veu, alfa, bg)) < 4.5`, aplicado nos dois retornos de `alfaDoVeu`. A
opacidade é monótona, então o véu perde translucidez antes de o texto perder legibilidade.

**Não troquei defeito por defeito, e o número prova:** só **9 dos 224** chãos livres
amostrados andam, e a PIOR separação de L\* do véu depois do conserto é **6,12** — acima dos 5
em que uma superfície começa a existir.

**A régua nova — §28, A FOLHA NO CHÃO LIVRE COM AS TINTAS DO PRODUTO.** 224 chãos livres
(8 matizes × 4 cromas × 7 claridades) × 4 superfícies × 2 contrastes, medindo `muted2` /
`muted` / `ink` e o `divider` contra o composto de `peca` e `chrome`. A seção 22 só perguntava
pela tinta que a própria folha declara.

**Dentes.** 30 pares reprovam sob a regra velha (18 em `muted2`, 12 no `divider`).

**Deixado de fora de propósito, e escrito no comentário da §28:** `muted2` sobre
`folha.miuda` no chão livre tem 642 de 5.376 abaixo de 4,5. A peça pequena não recebe `muted2`
de tela nenhuma — ela declara `folha.miuda.tinta`, e `preenchimentoMiudo` a resolve contra
`muted`. Cobrar `muted2` ali seria cobrar uma tinta que ninguém pinta. Se um dia uma tela
escrever `tone="dim"` dentro de um chip, o par nasce junto.

---

## Defeito 4 — `elevada` era idêntica a `solida` em 24 dos 34 sítios da folha miúda

**O número.** `folha.miuda.aresta` é o **único** campo em que `elevada` difere de `solida` na
peça pequena (ali a folha zera a sombra). `Campo.tsx` lia fundo/borda/corDaBorda/tinta;
`Choice.tsx` lia fundo/corDaBorda. Os dois descartavam `aresta`. Resultado: a alavanca mais
cara do cardápio não mudava um pixel em **nenhum dos 7 chãos**, em **24 sítios** (12 `<Campo>`
+ 12 `<Choice>`, contados por grep).

A seção 16 passava, e passava corretamente: lá o objeto `Folha` difere em `aresta`. É o caso
canônico de medir um objeto que a tela deixou de pintar.

**O conserto.** As duas peças consomem `folha.miuda.aresta`, no mesmo desenho que
`Metric.tsx:168` já usava: `f.aresta && !f.borda ? { borderTopWidth: FORMA.fio, borderTopColor: f.aresta } : {}`.
Inline em cada arquivo, de propósito (ver a doutrina acima). Em Campo o fio não entra no estado
de `erro` — ali o traço carrega informação, e `borderTopWidth` venceria o `borderWidth` do
aviso num lado só. Em Choice o fio entra DEPOIS do `borderColor` de estado: o fio é do
material, não do estado.

**Bônus medido no mesmo laço:** `Choice.tsx` cravava `borderWidth: FORMA.borda` — o traço da
superfície GRANDE — enquanto `Campo.tsx:79` já lia `folha.miuda.borda`. No vidro a folha miúda
declara `fio` (metade de `borda`), então chip e campo desenhavam o fio de luz com espessuras
diferentes na mesma fila. Passou a `f.borda`. Em sólida/elevada a folha pede 0, e o anel que
sumiu era invisível de qualquer jeito (`borderColor` == `fill` == fundo animado). `minHeight`
no RN é border-box: a geometria não muda, `toques_serie` fica igual.

**A régua nova — §29, O QUE A TELA PINTA DA FOLHA.** Mesmo desenho da §13, que lê da Figure o
alinhamento declarado. Ela abre os dois arquivos, tira comentários, descobre os identificadores
ligados a `folha.miuda` (`const f = …`, `const repouso = …`) mais o acesso direto
`FORMA.folha.miuda.x` — é isso que separa `FORMA.borda`, o traço da superfície grande, de
`folha.miuda.borda`, o da peça — e monta o conjunto CONSUMIDO. Depois, por chão, projeta
`folha.miuda` sobre esse conjunto e cobra que as quatro superfícies difiram duas a duas. Mais
dois pares por peça: "a espessura do traço vem da folha" e "a peça lê mais de um campo da
folha".

**Dentes.** Sob os conjuntos consumidos de ANTES: **15 de 86 reprovam** — 7 `Campo
solida=elevada`, 7 `Choice solida=elevada`, 1 `Choice espessura`. Sob a regra nova: 0 de 86.
Nenhum dos 15 aparecia na §16.

---

## Defeito 5 — a legenda da Figure cravava a tinta mais fraca dentro da célula preenchida

**O número.** `Figure.tsx` escrevia `tone="dim"` (= `T.muted2`) nos dois sítios de `note`, e
essa legenda pousa dentro da célula preenchida do MetricGrid. Medido: **14 de 84 pares**
abaixo de 4,5:1, pior **3,34** (breu/sólida, folha miúda). **As 14 na folha MIÚDA** — o pixel
que a §16 isenta de `muted2` de propósito, porque `preenchimentoMiudo` calibra o preenchimento
contra `muted`, não contra `muted2`.

**O conserto — raiz, não sintoma.** O papel `note` do `Txt` já nasce em `muted`
(`Txt.tsx:33`), e `muted` é a única das três tintas que TODA folha suporta por construção:
`preenchimentoMiudo` (`theme.ts:1690`) só devolve um preenchimento enquanto
`contrast(T.muted, cand) >= 4.5`, e quando não devolve, a peça cai no ramo transparente onde o
composto é um dos quatro fundos. O conserto é a **remoção** do `tone="dim"` em
`Figure.tsx:102` e `:127`. Uma peça só, e as sete chamadas de MetricGrid com `note` vêm juntas
— Aparencia, Aluna, Operacao, ComoFunciona, Retorno e as duas da ofensiva do aluno em
`student/Perfil.tsx`.

**A régua nova — §30(a).** Lê de `src/ui/Txt.tsx` o mapa `tone` → token (da própria folha de
estilo) e o tom PADRÃO do papel `note`; lê de `src/ui/Figure.tsx` o tom que cada sítio de
`note` DECLARA (ou cala). Cobrar `muted` direto seria cobrar disciplina de quem escreve a
tela — cobrar o tom LIDO cobra o pixel. Depois exige 4,5:1 contra os TRÊS pixels que a Figure
alcança: o chão (grade solta na rolagem), `folha.peca.composto` (dentro de uma Band) e
`folha.miuda.composto` (dentro da célula, 11 das 12 geometrias). 7 chãos × 4 superfícies ×
3 pousos = 84 pares.

**Dentes.** Regra velha (`dim` → `muted2`): **14 de 84**, pior 3,34. Regra nova: 0 de 84.

---

## Defeito 6 — `FORMA.celula.tinta` era medido e não era pintado

**O número.** A §9 media o token nos TRÊS modos de célula. A tela o pintava só nas bordas da
grade de fios (`right`/`bottom`); nos modos `caixa` e `cartao` a peça re-derivava tudo de
`folha.miuda`. **21 de 28 pares reprovam** a identidade "o separador medido é o pintado" no
modo `caixa` (7 chãos × 3 formas).

**O conserto.** No modo `caixa` os dois valem o MESMO pixel (`chao.divider` nas duas pontas),
então a tela volta a usá-lo sem mexer em pixel nenhum:
`borderColor: modo === "caixa" ? tinta : f.corDaBorda`.

**A régua nova — §30(b).** Lê `src/ui/Metric.tsx` (sem comentários) e cobra que o separador que
a §9 MEDE seja o que a tela PINTA, modo a modo. No `cartao` — único modo em que o token
honestamente não é separador — cobra a IDENTIDADE `celula.tinta === folha.peca.composto`, que
é o que ele realmente vale ali, em vez de fingir que a tela o pinta.

**Dentes.** Regra velha: 21 de 28 reprovam. Regra nova: 0 de 28. Par do cartão: 0 de 56
reprovam — a identidade vale nos 56 casos, o que PROVA que ali o token é substrato.

**O ramo `cartao` continua morto, e o pedido está registrado:** nos 56 casos `celula.tinta` é
exatamente o pixel em que o cartão pousa. Quem separa duas vizinhas ali é a folha miúda, cuja
separação ≥5 L\* já é garantida por construção e já é medida pelas §16 e §29. Consequência: o
par da §9 "duas células vizinhas se separam", no modo `cartao`, mede a SUPERFÍCIE contra o
CHÃO — uma coisa real, mas não a que o par diz medir. **Pedido ao dono do tema:** encolher
`celula.tinta` para os modos `fio` e `caixa` (nos outros o campo deixa de existir e o
TypeScript recusa quem o leia), ou mover o par da §9 para `folha.miuda` no modo cartão.
Enquanto isso, o par novo trava a identidade: se ela deixar de valer, a régua acusa.

---

## Defeito 7 — regressão: material usado como delimitador nas duas molduras de chrome

**O número.** `src/ui/Screen.tsx` (bloco `dock`, o rodapé das 20 telas empilhadas) e
`src/nav/tabChrome.tsx` (bloco `bar`, a barra de abas dos dois navegadores) tinham passado a
`borderTopColor: T.divider || chrome.aresta`. `aresta` é o fio de LUZ — material, alfa de
tinta, ≥5 de L\* e nenhuma informação. `divider` é o delimitador, 3:1 contra os quatro fundos.
Trocar um pelo outro é o que a SPEC §2.7 proíbe desde o ciclo 6, e custou:
**44 de 112 pares abaixo de 3:1**, ou seja **11 dos 28** pares chão × superfície perdem a
régua, pior **1,22** (linho/vidro contra o conteúdo). Amostra: carvão/elevada 1,51 e 1,48;
carvão/vidro 1,60 e 1,48.

**O conserto.** As duas linhas voltaram a `borderTopColor: T.divider`. O comentário acima de
cada uma deixou de mentir: ele nomeia a doutrina da §2.7 e traz o número medido.

**A régua nova — §31, TRAÇO QUE DELIMITA ≠ TRAÇO QUE É MATERIAL.** Ela LÊ O ARQUIVO: extrai a
expressão de `borderTopColor` do bloco de estilo de cada moldura, resolve contra o tema vivo
(compondo alfa sobre o lado que está sendo medido) e cobra 3:1 contra OS DOIS lados — o
composto da moldura e o chão. 114 pares. Trocar a expressão por qualquer material volta a
reprovar no ato.

**Dentes.** Regra velha: 44/112, 11/28 pares chão×superfície, pior 1,22. Regra de hoje:
0/112, 0/28.

---

## Defeito 8 — peças pintando um degrau do chão dentro de uma Band

**O número.** Cinco sítios pintavam `T.raised` ou `T.fill` — tokens calibrados contra `T.bg`
— dentro de uma `<Band>`. Com a Band no chão eles funcionam. Com a Band LEVANTADA (a decisão
do dono que está aberta desde o ciclo 5, item 2), **42 de 140 combinações caem abaixo do piso
de ΔL\* 5, e 30 SOMEM POR COMPLETO — ΔL\* 0,0**, a peça e o fundo dela no mesmo pixel. Todos
os 56 casos de `T.raised` estão nas falhas, e 30 deles caem exatamente em zero. Pior caso: a
linha "Você" da Liga, em Progresso.

Este é o pré-requisito que o ciclo 5 mediu e nomeou, e que bloqueava a alavanca inteira.

**O conserto.** Um export novo em `Screen.tsx`:

```ts
export const neutroNaBand = (t: Tema): string =>
  neutroSobre(RAISED_PADRAO ? t.FORMA.folha.peca.composto : t.T.bg, t.T);
```

Um ponto só, funciona em folha de estilo e inline, e **hoje devolve exatamente `T.fill`** —
84 dos 140 pixels ficam idênticos byte a byte. Convertidos: Progresso `rowMe` (a linha "Você",
era `T.raised`) e `selo` (era `T.fill`); Painel a calha da semana e o `acento(secundaria, …)`
que pousa nela (era `T.fill`); PerfilTime a primeira `amostra` da aparência (era `T.raised`);
Aparencia `chaoOn` (era `T.fill`).

**A régua nova — §32, NINGUÉM PINTA UM DEGRAU DO CHÃO DENTRO DE UMA BAND.** Duas metades:
(a) varredura de texto que calcula a profundidade de `<Band>` linha a linha em toda tela e
reprova qualquer `backgroundColor: T.raised|fill|hairline` que caia dentro — é o que pega o
sítio NOVO que alguém escrever amanhã; (b) medição de que `neutroSobre(folha.peca.composto)`
separa ≥5 de L\* do fundo da Band levantada nas 28 combinações, e que no chão ele continua
sendo `T.fill`. 78 pares.

**Dentes.** Metade (b): regra velha (token fixo do chão) 42/140 abaixo de 5, 30 em ΔL\* 0,0,
pior 0,0; regra de hoje 0/140. Hoje, com a Band no chão: 84/140 pixels IDÊNTICOS; os 56 que
mudam são os que eram `T.raised`, que sobem de ΔL\* 6,6 para 14,9 contra o chão. Metade (a),
a mesma varredura sobre o código velho: **5 sítios em 4 telas reprovam**; hoje 0.

**Duas notas honestas:**

1. O crítico nomeou "os chips de ação no Painel" como o segundo sítio. **Eles não existem** —
   `grep` não acha um `T.raised` em `Painel.tsx`, e o único degrau dentro de uma Band ali é a
   calha da semana (`T.fill`), que foi o que se converteu. A nota é de um estado anterior do
   arquivo.
2. `degrauNeutro(fundo, alvo, p)` é privado em `theme.ts`; só `neutroSobre` (degrau do tamanho
   de `fill`, ΔL\* 15,2) é exportado. Por isso a linha "Você" da Liga passou de ΔL\* 6,6 para
   14,9: **não existe forma de pedir um degrau MENOR que `fill`**. Pela régua o comportamento
   é o correto — a peça existe nas 28 combinações — mas se o dono do tema achar que o destaque
   de linha de lista quer ser mais discreto que a calha de um cronômetro, exportar
   `degrauNeutro` (ou um `neutroSobre` com alvo opcional) resolve sem alavanca nova.

**Cinco peças que pintam `T.raised` e ficaram intocadas de propósito**, porque NÃO estão dentro
de uma Band — elas pousam no chão e a decisão do dono não as alcança: Ajustar `hero`, Retorno
`swap`, Criacao `canvas`, Serie `setRow` da série corrente, Base `useTone(selected, T.bg, T.raised)`.
As amostras de paleta de `Aparencia.tsx` (`CHAOS[c].raised`) também ficaram: ali a cor é o
CONTEÚDO — a escada daquele chão — e não um destaque.

---

## O aparelho

Conferido no simulador (iPhone 17 Pro, iOS 26.5, Expo Go SDK 54, API local), app do personal
Fred, aparência `Breu · pílula · vidro`:

| captura | o que mostra |
|---|---|
| `ciclo7-02-painel-fila.png` | a fila do Painel: 3 alunos, o CTA de acento no primeiro e os dois `parelha` preenchidos abaixo — o rótulo do segundo botão sobre o preenchimento real dele (defeito 2) |
| `ciclo7-03-perfiltime.png` | Perfil do personal: a primeira `amostra` da aparência agora é `neutroNaBand` dentro da Band (defeito 8) |
| `ciclo7-04-aparencia.png` | Perfil → Aparência, topo: kits, cor da marca, segunda cor |
| `ciclo7-05b-aparencia-chao.png` | a seção CHÃO: o chip "Breu" selecionado com `chaoOn` visível contra a Band, ao lado de "Carvão" não selecionado (defeito 8) |
| `ciclo7-07-comofunciona.png` | Perfil → Como o app funciona: os Choice com o fio da folha miúda (defeito 4) e o par de ações no rodapé, "Salvar" desligado com `s.desligada` legível sobre o preenchimento (defeito 2) |
| `ciclo7-08-comofunciona-metric.png` | as células de número e os chips de dias por semana, com o separador que a §30(b) agora cobra (defeito 6) |

Caminho completo:
`/private/tmp/claude-501/-Users-vitorepf-develop-linkgym-linkgym-app/cda26644-4119-478f-b2af-ecd2f4789c0a/scratchpad/`

---

## O que NÃO foi feito, e por quê

- **Nenhuma alavanca nova.** Este ciclo é de conserto e os oito defeitos couberam nos tokens
  que já existiam. Onde faltou mecanismo — o degrau menor que `fill`, o sinal de estado do
  `eco` desligado, o encolhimento de `celula.tinta` — está escrito acima como pedido ao dono
  do tema, não implementado por conta própria.
- **`aparencia` continua FORA de `.gate/config.json:eixos`.** Registrar eixo é ato do humano.
  O número está aqui: **aparencia = 0 em 119.103 pares**. `tools/catraca.mjs` já grava a
  medida no formato que o `.gate` espera, então no dia do registro a catraca nasce com
  histórico.
- **`toques_serie` está STALE** porque `GhostCTA.tsx` mudou. Não rodei `tools/taps.mjs`: ele
  importa `buildWeb`/`WEB_DIR` de `tools/shots.mjs` e compartilha `tools/out/web` — a colisão
  que a regra proíbe. É do orquestrador. A mudança é uma COR (`T.muted` → `s.desligada`), não
  muda alvo nem contagem de toque; a catraca de 2 não deve andar.
- **Não rodei `shots.mjs` nem `kits.mjs`** (mesma colisão), nem `gate.mjs` inteiro. As catracas
  de texto foram medidas e nenhuma piorou: contraste 0, escala 1, soltos 0, tipos 0, culpa 0,
  proibidas 0, fila 6, carga_perdida 0.
- **Cinco dos oito defeitos do crítico** não têm raiz no tema e foram consertados na tela; os
  três que têm raiz no tema estão nos defeitos 1, 2 e 3 acima. Nenhum ficou sem número.
- **§32 tem um teto declarado no código** com `ponytail:` — a varredura só olha arquivos que
  contêm `<Band>`. Peça definida em `src/ui` e renderizada dentro de uma Band alheia (Campo,
  Choice, Metric) escapa dela, e não precisa: aquelas leem `FORMA.folha.miuda`, que a §29 já
  cobra.
- **O `errorInk` exportado** (o estático, lido por `tools/contrast.mjs`) mudou de tom no
  padrão: era a própria `PERIGO`, agora anda até limpar `raised`. `contrast.mjs` continua 0.
  Nenhuma tela importa esse export — todas leem `useTema().errorInk`.
