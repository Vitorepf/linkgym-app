# Ciclo 9 — a nota 6

O dono olhou as telas e reprovou, item por item. Este documento é a resposta, e cada
resposta tem um número — porque "melhorei" sem medida foi exatamente o que produziu a
nota 6.

## O que ele escreveu, e o que aconteceu

| # | a reclamação, na palavra dele | o que era, medido | o que é |
|---|---|---|---|
| 1 | "o botão continuo tendo um tamanho extraordinariamente grande" | **100 de 144** combinações acima do teto premium; a mais alta **100pt** | **0 de 144** |
| 2 | "as cores extremamente baixo a variedade, horrivel" | 10 cores soltas | **27**, medidas, em dois passos |
| 3 | "chao, quem vai saber o que e chao?" | 15 rótulos de designer | 15 rótulos de quem treina gente |
| 4 | "sem variedade de elementos... glass" | `vidro` no cardápio com **zero leitores** | 6 materiais; `contorno ≠ fio` de **967** pares reprovando para **0** |
| 5 | "letras, todas basicamente iguais" | **4 dos 15 pares** de voz colidiam nos três canais | **0** |
| 6 | "invez de ter que rolar a tela massivamente... abrir um modal" | **6.333pt** de rolagem, **77** alvos numa página | índice + 10 folhas |
| 7 | "olha os 3 botoes" | rabo de **379–469pt**, 45–56% da viewport | uma ação de largura cheia |

E o espaço que ele pode percorrer: **1.959.552 → 8.817.984** aparências fechadas, com
**458.239** pares medidos (eram 316.578) e nenhum reprovando.

## 4 — o material, e a mentira de encanamento

O achado que reenquadra o item: **a máquina do vidro já estava construída e inteira dentro
de `src/theme.ts`, e nenhum componente lia uma linha dela.** `alfaDoVeu()` resolvia o alfa
canal a canal, `veuLegivel()` andava com ele para trás até as quatro tintas passarem no
piso, `VIDRO.vidro` guardava um raio de desfoque de 26 e a folha o reexportava em
`FORMA.vidro`. Fora do arquivo, dois usos: um rótulo e um comentário.

Ou seja, `vidro` não era mentira de desenho, era mentira de encanamento — vendido no
cardápio desde o ciclo 6, e quem tocasse nele ganhava uma sombra. `expo-blur` já estava
instalado e não era importado em lugar nenhum.

O que entrou: o desfoque de verdade, mais dois materiais novos (`fio`, o traço duplo em
arestas deslocadas; `vinco`, o inverso do elevado). E os dois nasceram com o defeito que a
régua pegou: **`fio` chegava idêntico a `contorno` no dock e nas peças miúdas — 967 pares
reprovando**, dois nomes de cardápio desenhando a mesma coisa, que é exatamente a
reclamação do dono reproduzida pelo conserto dela. Corrigido, 0.

**E a régua só viu isso porque parou de acreditar numa lista.** A varredura de superfícies
estava escrita à mão em SEIS lugares de `tools/aparencia.mjs`, todos ainda com os quatro
materiais antigos: os dois novos entraram no cardápio e o medidor continuou dizendo "0
reprovam" sem nunca ter olhado para eles. Silêncio lido como aprovação. Agora a lista sai
de `SUPERFICIES`, no tema, com `satisfies` — material fora dela não compila. É a terceira
vez neste ciclo que uma lista escrita à mão apodreceu (a das faces com dígito tabular e a
do cardápio da API foram as outras duas), e as três viraram leitura da fonte.

O limite honesto: numa Band que pousa no chão liso, o desfoque não tem o que desfocar — o
que muda o pixel ali é o tint e a saturação do material. Vidro de verdade precisa de algo
atrás, e o lugar onde isso passa a existir é a folha que este mesmo ciclo criou: um modal
sobre o app vivo é a "folha sobre scrim" que a §10.4 nomeou como o único caminho medido.

## 1 — o botão, e a régua que faltava

`tools/botao.mjs` é nova e existe por causa do pecado recorrente deste repo: medir o
objeto que a tela deixou de pintar. `FORMA.alturaAcao` é o que o TEMA oferece, e não era a
altura que o dedo encontrava — o componente somava o próprio `paddingVertical` por cima.
Medir o token responderia 56 numa tela que desenhava 100.

Então a régua LÊ `AccentCTA.tsx` e `GhostCTA.tsx`, extrai o degrau de espaço que cada um
consome, e só então resolve contra o tema. O conserto foi alinhar orçamento e pagamento no
mesmo degrau: os dois CTAs pagavam `SPACE.step` enquanto `alturaAcao` orçava `2*tight`.

Piso e teto, os dois medidos: nada abaixo de 44 (o alvo de dedo com que Apple e Material
concordam), nada acima de 56 numa linha e 68 em duas. Linear, Things, Whoop e Oura
desenham a ação principal entre 48 e 52.

## 5 — a letra, e a régua que media o contrário

O defeito mais caro do ciclo, porque a régua estava do lado errado.

`tools/aparencia.mjs` §7 exigia que o herói de toda voz tivesse o **mesmo tamanho
aparente**, dentro de 3%. A intenção era boa — trocar a voz não pode mexer no corpo do
texto sem querer — e o efeito era o oposto do produto: com o tamanho travado sobrava só o
desenho da letra para separar seis opções, e o desenho de um dígito de 40pt em Archivo,
Inter e Space Grotesk é a mesma imagem para qualquer olho.

Três causas, todas verificadas contra o arquivo:

1. **A amostra do editor escondia a face de DISPLAY.** Ela mostrava `value` e `body`, que
   desenham nas faces de número e de texto. A Playfair da editorial e o Oswald da
   condensada só existem no display — as duas vozes mais distintas eram as duas invisíveis.
2. **`cap` corrigia os degraus errados.** `value`, `hero` e `mega` desenham na face do
   NÚMERO e eram escalados pela caixa alta do DISPLAY. Na condensada isso encolhia dígitos
   de Archivo em 15%, e a voz lia como "bloco, só que menor".
3. **`bloco` desenhava o app inteiro em ExtraBold** — rótulo, corpo e legenda na mesma face
   do herói. Uma face de texto tem que ter para onde o título subir.

O que entrou: `capNumero` (a métrica da face que o degrau realmente desenha), `grau` (o
tamanho aparente, que agora é canal e não erro), `caixa` e `trackRotulo`. E a régua
inverteu: em vez de exigir que as vozes sejam iguais, exige que **se separem** — três
canais, e basta um abrir. As faces vieram de 84 já em disco, das quais o app carregava 10,
todas apertadas entre 500 e 800.

| | antes | depois |
|---|---|---|
| herói | 60–63pt (todas) | **53–73pt** |
| razão herói:rótulo | ≈5,1 (todas) | **4,2–6,6** |
| faces de número distintas | 3 | **6** |
| pares que colidem nos 3 canais | **4 de 15** | **0** |

E o `tnum` deixou de ser uma lista escrita à mão: a régua abre o TTF e procura a tag na
FeatureList do GSUB. A lista tinha congelado no dia em que foi escrita, e duas faces do
MESMO Archivo e do MESMO Inter reprovaram por não estarem nela — não por não terem a
feature. Lista à mão é suposição com data de validade.

## 2 — a cor, e por que "mais cores" era a resposta errada

A resposta óbvia à falta de variedade é pôr cinquenta cores. Foi medida, e é pior:

```
10 cores (o de antes) .... 1 colisão no pior chão
12 matizes ............... 6
12 matizes x 2 tons ...... 19
24 matizes x 3 tons ...... 173
```

`separadas` exige 40° de matiz, e 360/40 = **9 é o teto de famílias**. Acima disso a fila
cresce e a escolha não. Mas a 45° entre famílias, 100% das colisões acontecem DENTRO de
uma família — família é de graça, tom é o que custa, e o tom para em três. Daí **8×3+3 =
27, zero colisão nos sete chãos**, alcançadas em dois passos: oito fichas de família,
depois três tons. Ele vê onze coisas e alcança vinte e sete.

**E um defeito medido que ninguém tinha visto:** a segunda cor. Nas 1.400 combinações de
sete chãos × vinte marcas × dez escolhas, o app **moveu a cor escolhida 277 vezes —
19,8%** —, distância média de 26 em L\* e pior caso 53,6. O personal tocava no vermelho e
recebia salmão, sem uma palavra na tela. O movimento está certo (a segunda cor tem que se
afastar da marca e do vermelho do aviso); o errado era oferecer o que ia ser recusado.
`segundaValida()` filtra o cardápio pelo que o app consegue manter: sobram **24,5 de 27 em
média e 24 no pior caso** — mais escolha de verdade do que as dez de antes, das quais
metade era promessa quebrada.

## 6 e 7 — o editor

Medido no Chrome contra o bundle: **6.333pt de rolagem (8,3 telas) e 77 alvos de toque**
numa página. O rabo — a prévia, o Salvar e o Voltar — comia 379–469pt, **45 a 56% da
viewport**, em três retângulos de largura cheia empilhados.

O que entrou:

- **Um índice de dez portas.** Cada porta diz o nome em palavra simples, o valor de agora
  em palavra simples, e mostra a miniatura viva do que está escolhido. Altura `ALVO.linha`
  — o degrau de 64 que este app declara desde sempre e que nada consumia.
- **Uma folha por decisão**, em `presentation: "formSheet"` do próprio native-stack (já em
  disco, nenhuma dependência nova). Com `sheetLargestUndimmedDetentIndex: 0` a metade de
  cima **não escurece**: é o app rodando, em tamanho real, repintando a cada toque. Ele
  toca em "Pílula" e a tela do aluno atrás do polegar arredonda. Prévia dentro do modal
  seria gastar os pontos que faltam para desenhar, menor e pior, o que o fundo já mostra.
- **A prévia virou o herói**, de largura cheia e no topo. Ela era um cartão de 120pt no pé
  de 6.333 de rolagem: a única coisa que responde "como fica" só aparecia depois de sete
  telas.
- **A saída voltou para o cabeçalho** e o Descartar virou o que sempre foi — um desfazer,
  não uma laje. A regra que sai daqui: **uma ação de largura cheia por tela; a saída mora
  no cabeçalho; uma terceira ação não existe.**

A pilha é LOCAL porque o rascunho mora em `useState` e `src/nav/types.ts` proíbe passar
isso por parâmetro de rota. Cada folha fecha sobre `doc` e `muda`: zero parâmetro, zero
contexto, zero serialização.

**E a Aparência passou a ser fotografada.** Ela não tinha uma fixture sequer — o lugar onde
o personal decide como o app dele se parece nunca apareceu em montagem nenhuma. Agora são
onze: o índice e as dez folhas.

## O que continua sendo do humano

Três medidores rodam, medem e **não travam nada**, porque registrar eixo é ato do dono:

- `botao` — 0 de 144
- `aparencia` — 0 de 328.694
- `kits` — as 216 montagens

Enquanto não forem registrados, nada impede o botão de voltar a 100pt no próximo ciclo.
