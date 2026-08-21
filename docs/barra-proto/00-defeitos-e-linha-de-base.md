# Proto do aluno: defeitos e linha de base

Escopo: `proto-aluno/`. Só a conta do aluno. Nada de painel do personal.

**Croma quente no escuro é falha.** Superfície é carbono (H=0). `.plate` é face
plana e fio frio. Degradê que mistura tinta clara na face vira lodo — o júri
recusa, não sugere ajuste.

Medidor: `cd proto-aluno && node tools/medir.mjs tudo`. Um eixo por vez com
`node tools/medir.mjs escala`, `contraste`, `cor`, `primitiva`, `alvo`, `movimento`.

## Linha de base medida

Tirada depois da passada de sistema (tokens, escada de tipo, movimento,
primitivas) e antes de qualquer fatia de tela. Quem mexer nas telas tem que
mover estes números para baixo, nunca para cima.

| eixo | medidor | base | alvo |
| --- | --- | --- | --- |
| contraste | 12 medidas | todas na linha | manter |
| escala | tamanhos avulsos fora da escada | 7 | 0 |
| escala | ocorrências de tamanho avulso | 36 | 0 |
| cor | hex cru fora do `styles.css` | 52 | 0 |
| primitiva | faixa remontada à mão | 37 | no máximo 4 |
| primitiva | uso de primitiva | 4 | pelo menos 60 |
| primitiva | adoção | 10% | pelo menos 90% |
| alvo | botão sem altura de dedo garantida | 61 de 62 | 0 |
| movimento | tela sem movimento algum | 9 | 0 |

Os 12 medidores de contraste já passam porque a passada de sistema arrumou os
tokens. Os outros 21 estão fora porque as telas ainda não foram tocadas.

## Orçamento por cena

Os medidores acima olham o repo inteiro. Os quatro abaixo olham **cena por
cena**, que é como as barras do Linear e do Stripe são escritas. Uma cena é um
componente exportado, porque `grupos.tsx` carrega oito cenas e `social.tsx`
carrega cinco. São 29 cenas no proto.

| medidor | de onde vem | base | alvo |
| --- | --- | --- | --- |
| `tipos` | Linear B1 | 7 cenas acima do teto, pior com 7 degraus | nenhuma acima de 5 |
| `regua` | Linear B4 | pior cena com 8 réguas | no máximo 4 |
| `preenchido` | Stripe B1 | 5 cenas com mais de 1, `Serie` com 4 | exatamente 1 por cena |
| `acento` | Stripe B13 | `Progresso` com 5 | no máximo 4 |

## Três arbitragens que a barra forçou

A barra tem eixos que se contradizem. Quem decide não pode ser quem implementa,
mas o implementador também não pode ficar parado esperando. Estas são as
decisões tomadas na fundação, registradas para o júri poder derrubá-las.

**1. Linear B1 (no máximo 2 tamanhos de tipo por tela) não transfere.** O Linear
roda a lista densa em 1 tamanho porque é um app web de produtividade em monitor,
onde tudo é texto de 13 px. Um app de celular tem título de página, corpo,
metadado e rótulo de seção: quatro no piso, antes de qualquer luxo. E o nosso
tem um número herói (a carga, o cronômetro) que é o assunto da tela. Forçar 2
degraus aqui produziria uma tela pior, não melhor. **Teto adotado: 5 degraus por
cena**, que é território de Things 3. O batedor do Linear já registrou em C1 que
superar por contagem é impossível e apontou o ganho real: resolver o número
grande sem crescer o tipo, com numeral tabular e peso. É esse o caminho.

**2. Linear B14 (zero mudança de escala no toque) briga com o ofício iOS.** A
barra do Linear diz que o pressionado deve mudar só o fundo, sem escala, e que a
maioria dos apps de celular falha aí com escala e sombra. Mas o ofício iOS,
que é o eixo 2, usa recuo sutil como retorno físico, e o eixo 5 é justamente
movimento. A fundação hoje usa `scale(0.975)` no botão preenchido e
`scale(0.985)` em superfície clicável. **Decisão: manter a escala apenas no
botão preenchido, onde ela é o retorno do ato, e tirar de linha de lista, onde
o Linear está certo e escala em linha de lista é ruído.** O júri pode derrubar,
e se derrubar é uma edição de duas linhas em `styles.css`.

**3. O vermelho deixou de ser botão.** Stripe B13 pede no máximo 4 ocorrências
de acento por tela com exatamente 1 preenchida, e C13 pede chegar a 2. O proto
usava vermelho como cor de botão primário dentro do rack e cinza morto fora
dele. Como o vermelho também é o carimbo, o vivo e o recorde, ele não podia ser
as duas coisas. **A primária virou tinta cheia em 100% das telas e o vermelho
virou exclusivamente estado.** Consequência: `.tone-iron` foi deletado, porque
existia só para trocar a cor do botão do rack.

## O que já foi feito na passada de sistema

Dono único, antes das fatias, para as fatias não brigarem por fundação.

1. **Tokens mortos removidos.** `--color-steel`, `--color-live` e
   `--color-amber` valiam `#f3f2f2`, idênticos a `--color-ink`: três nomes
   semânticos colapsados numa cor. `text-steel` prometia um cinza e entregava
   branco puro em `ficha.tsx`, `serie.tsx` e `descanso.tsx`. `--font-cond` e
   `--font-mono` apontavam para Archivo, igual a `--font-sans`: dois nomes de
   família para uma família.
2. **A divisória recuou.** `--color-line` era `#696565`, que dá 4,3:1 contra o
   fundo. Uma linha nesse nível grita tanto quanto o texto, e ela aparece 47
   vezes no proto: é exatamente isso que transforma tela em planilha. Agora
   vale `#2b2827`, 1,35:1. O domínio do texto sobre a divisória saiu de 4,1
   para 13,2. Uma edição de token consertou as 47 ocorrências de uma vez.
3. **Superfície virou escada de verdade.** `surface` e `raised` existiam e quase
   não eram usados, e os degraus originais tinham 1,06 / 1,08 / 1,14 de
   contraste entre vizinhos, ou seja, degrau invisível. Agora 1,19 / 1,20 /
   1,21, e existe `sunk` para o que fica atrás do aparelho.
4. **A ação primária ficou visível.** `.thumb` nascia `background: var(--color-fill)`,
   `#2d2b2b` sobre `#0b0a0a`. A primária só virava vermelha dentro de
   `.tone-iron`, ou seja, apenas no rack: no Hoje, na Ficha, no Feito e no
   Perfil o botão principal era um retângulo cinza morto. Agora a primária é
   tinta cheia, 17,8:1, igual em todo lugar. **O vermelho deixou de ser botão e
   virou estado**: vivo, carimbo, recorde, ofensiva em risco. Um acento, um
   significado. `.tone-iron` foi removido porque só existia para trocar a cor
   do botão.
5. **A escada de tipo ganhou os degraus que faltavam.** Era 12 / 13 / 17 / 40 /
   52 / 96, com um buraco entre 17 e 40 que as telas preenchiam à mão com 20,
   28, 32, 36, 40, 52, 56 e 88. Agora são 10 degraus: 11 / 12 / 13 / 15 / 17 /
   21 / 30 / 40 / 52 / 84, com salto máximo de 1,62 entre vizinhos. Entraram
   `t-sub` (15, a prosa secundária que faltava e obrigava texto corrido a cair
   no 13 de metadado) e `t-title` (21).
6. **Kicker e small deixaram de ser a mesma coisa.** As duas classes eram 13px,
   peso 500, cor mute, diferindo só em `letter-spacing` e `line-height`: dois
   nomes, um papel. Agora `t-kicker` é 12 em caixa alta com entrelinha aberta, o
   único lugar do app com caixa alta, e `t-small` é o metadado de 13.
7. **Existe sistema de movimento.** Antes o app tinha exatamente uma transição
   no total (`.thumb:active { scale(0.98) }`) e uma animação, que era o
   algarismo do cronômetro pulsando opacidade em loop infinito, ou seja, ruído
   em cima do número que a pessoa está tentando ler. Agora há 5 durações e 3
   curvas nomeadas, troca de cena animada por tipo (aba atravessa, sobreposição
   sobe, rack avança de lado), `.press` universal, e o anel do descanso respira
   em vez do algarismo.
8. **O foco parou de parecer depuração.** Era `outline: 2px solid ink` com
   deslocamento, que desenhava um retângulo branco em volta da aba inteira.
   Agora é anel duplo que respeita o raio do alvo.
9. **Nasceram as primitivas.** `src/ui/kit.tsx`: `Band`, `Card`, `Row`,
   `SectionHead`, `Chip`, `Stat`, `Roll`, `Reveal`, `ActionBar`, `Scroll`.
   Antes não existia uma única primitiva de superfície e cada tela remontava
   `border-t border-line px-5 py-5` à mão, 37 vezes.
10. **A barra de abas ganhou ofício.** Marca ativa que desliza com mola em vez
    de aparecer e desaparecer, peso de traço do ícone mudando com o estado,
    `aria-current`, e o rótulo no degrau de 11.

## Defeitos abertos, por fatia

### Fatia A: Hoje + rack (Série, Descanso, Feito)

- `hoje.tsx:46` o cabeçalho da tela rola junto com o conteúdo. Nenhuma tela do
  proto tem cabeçalho que se comprime nem título que migra para a barra.
- `hoje.tsx:53` "ofensiva 4" e "1 protetor" empilhados com `<br />` num
  parágrafo de metadado, no canto. A ofensiva é o mecanismo de retenção do
  produto e está tratada como rodapé.
- `hoje.tsx:128`, `hoje.tsx:146` faixa remontada à mão. Vira `Band`.
- `hoje.tsx:148` `text-[32px]` avulso.
- `hoje.tsx:150` "A semana é o caminho. Raid não é cartão de 4 sessões." A tela
  explica o mecanismo em vez de mostrar o estado. Cortar.
- `hoje.tsx:93` linha de exercício clicável sem retorno de toque.
- `serie.tsx:55`, `:117`, `:149` `text-[36px]` avulso, três vezes.
- `serie.tsx:78` `text-[40px]` avulso dentro do prato de carga.
- `bits.tsx:252` os quatro `HoldTick` usam `bg-fill`, a mesma massa visual, e a
  primária embaixo competia com eles. Revisar peso agora que a primária é tinta.
- `descanso.tsx:67-73` o anel escreve `#1c1a19`, `#ec3013` e `#f3f2f2` crus, e
  usa `276.46` como número mágico de perímetro.
- `descanso.tsx:87` "O cronômetro fica aqui." Legenda que descreve o óbvio.
- `feito.tsx` o recibo é a cena mais importante do app e não tem uma única
  entrada animada, nem substituição de número na ofensiva. É onde o eixo do
  ritual se ganha ou se perde.
- `feito.tsx:78` "Seguir" como saída silenciosa não diz para onde vai.

### Fatia B: Ficha + Progresso

- `ficha.tsx:82` linha de exercício remontada à mão, sem alvo de dedo garantido.
- `progresso.tsx:37` linha de histórico com `py-2.5`, alvo abaixo de 44.
- `progresso.tsx:39` `text-[32px]` avulso.
- `progresso.tsx:98` borda tracejada como estado vazio.
- `bits.tsx:349-357` `WeekChart` com três `text-[32px]` e as barras escrevendo
  `#f3f2f2` e `#2a2727` crus, sendo que `#2a2727` não é token nenhum.
- `bits.tsx:388` `MonthGrid` escreve `#f3f2f2` e `#1c1a19` crus.
- Nenhum dos dois gráficos anima entrada nem tem estado vazio desenhado.

### Fatia C: Rede + grupos, guerra, unidade, raid

- `grupos.tsx` nove faixas remontadas à mão nas linhas 52, 60, 144, 205, 216,
  266, 308, 462.
- `grupos.tsx:55`, `:310`, `:355` avulsos de 28, 32 e 36.
- `rede.tsx:131` `text-[28px]` avulso.
- `rede.tsx:68` fila horizontal com `py-2.5`, alvo abaixo de 44.
- `bits.tsx:98`, `:102` o placar usa `text-[52px]` e `text-[36px]` avulsos e o
  número não anima quando o marcador muda, que é justamente o eixo da
  informação viva.
- `bits.tsx:118` `Tally` desenha sessões repetindo o caractere `●`. Texto fazendo
  trabalho de forma.
- `bits.tsx:467` `StampHold` referencia a classe `stamp-mark`, que **nunca
  existiu** no CSS. Foi definida agora na passada de sistema, mas o componente
  precisa de revisão: segurar por 380 ms sem nenhum retorno visual durante o
  gesto é gesto cego.

### Fatia D: Perfil + social (feed, composer, prova, pessoa, bora, zap)

- `social.tsx:84-91` e `:89` as bolhas do Zap escrevem `#1a3a30`, `#8fb8a8`,
  `#e7ffee`, `#5d7f73`, `#005c4b`, `#99c7b8` crus. Seis cores fora de token numa
  tela só.
- `post-card.tsx:109`, `:149` `text-[56px]` avulso, o maior fora da escada.
- `post-card.tsx:305` `text-[20px]` avulso, entre dois degraus existentes.
- `post-card.tsx` seis avulsos de 28 e um de 36.
- `perfil.tsx:54` `text-[40px]`, `:216` `text-[28px]`.
- `perfil.tsx:59-129` sete faixas remontadas à mão em sequência.
- `perfil.tsx:148` e `social.tsx:374` chip de filtro com `h-8` e `h-9`, abaixo
  do alvo de dedo, e desenhado com `border` em vez de `Chip`.
- `MediaGrid` em `bits.tsx:396` não tem estado vazio: retorna `null` e a seção
  desaparece sem explicação.

## Defeitos de estrutura que atravessam tudo

- `bits.tsx:5` `Screen` não reserva folga no fim: o conteúdo termina encostado
  na barra de abas em todas as cinco abas.
- `shell.tsx` toda sobreposição é tela cheia e a barra de abas some. Nenhuma é
  folha. Não existe hierarquia de profundidade: tudo é substituição total, o que
  faz o app inteiro parecer plano.
- `bits.tsx:509-552` os cinco ícones de aba são SVG à mão que não compartilham
  grade óptica, e não existe versão preenchida para o estado ativo.
- `bits.tsx:296` o `Avatar` decide a cor do texto comparando a string do hex por
  igualdade. Contraste calculado por comparação de string.
- `store.ts:342` `avatarColor` inicial é `#ec3013`, o mesmo vermelho do acento
  de estado. A pessoa e o estado dividem a cor.
