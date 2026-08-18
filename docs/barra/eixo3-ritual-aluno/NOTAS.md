# Barra — eixo3-ritual-aluno · referência: Duolingo

Pesquisa de ofício. Imagens são referência interna: não entram no app, não são
republicadas, não viram vocabulário de tela do LinkGym. O que se copia aqui é a
**regra** que a tela obedece, nunca a identidade dela.

Vocabulário: escrevo em termos do CONTEXT.md (Ofensiva, Protetor, Retomada,
Sessão). Onde a referência usa outra palavra na tela, eu descrevo o mecanismo em
vez de citar o rótulo.

## Arquivos e procedência

| Arquivo | Fonte |
| --- | --- |
| `duolingo-01`..`duolingo-08` | App Store oficial (`itunes.apple.com/search`, trackId **570060128**, seller *Duolingo, Inc*), campo `screenshotUrls`, baixadas em `1242x0w.png` |
| `duolingo-09`, `10`, `11`, `12`, `13` | `blog.duolingo.com` — três posts sobre a sequência de dias (hábito, melhoria da regra, animação de marco), imagens hospedadas em `storage.ghost.io` |
| `duolingo-14`..`duolingo-18` | `blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo`, imagens em `s3.us-east-1.amazonaws.com/content.duolingo.com` |
| `duolingo-19` | `pageflows.com/screens/fba1112a-…` (captura Android, mar/2024) |
| `duolingo-20` | `digia.tech/post/duolingo-habit-forming-reminders-retention-architecture` — **UI antiga** (marca de assinatura já descontinuada). Vale pelo layout do erro, não pelo estilo. |

Descartado: um composto de marketing com o mascote sobre fundo aquarela
(`c35e1a91…png` do mesmo post da `20`) — não é UI, não foi salvo.

---

## 1. Onboarding: quantas telas até o primeiro valor real

**Medido** nas barras de progresso de `duolingo-14`, `-15`, `-16` (contagem de
pixels verdes / cinza da mesma barra, y=154 num arquivo de 750×1624):

| Arquivo | Tela | Barra preenchida |
| --- | --- | --- |
| `duolingo-14` | escolher o que estudar | **6,2 %** |
| `duolingo-15` | pedir permissão de notificação | **68,4 %** |
| `duolingo-16` | de onde partir (do zero / achar meu nível) | **90,2 %** |

6,2 % bate com 1/16 (6,25 %) e 68,4 % com 11/16 (68,75 %). Ou seja: o caminho
até a primeira lição é da ordem de **~16 passos**, e **a barra está visível em
todos eles** — o usuário sempre sabe quanto falta.

Regras de ofício que essas três telas obedecem:

- **Nenhuma delas pede conta.** Escolha, permissão e nível vêm antes de
  qualquer identificação. O primeiro valor é a primeira lição (`duolingo-02`,
  `-04`, `-07`), não a conta criada.
- **Um passo = uma pergunta = um botão.** Em `-14`, `-15` e `-16` há exatamente
  um botão primário na base, sempre no mesmo lugar, sempre com o mesmo rótulo.
  Voltar é uma seta pequena e cinza no topo — reversível, mas discreto.
- **A permissão de notificação é emoldurada antes de o sistema perguntar**
  (`duolingo-15`): o personagem diz o motivo ("vou te lembrar para virar
  hábito") na tela do app, e só então o diálogo do iOS aparece. Uma seta aponta
  para o botão de permitir.

_Implicação LinkGym:_ Convite → 3 perguntas → Pronto → Estreia já é curto; o que
falta copiar é (a) a barra de progresso presente nas 4 telas do D0, e (b)
emoldurar o pedido de push na tela do personal antes do diálogo do sistema.

## 2. O gesto diário: quantos toques

`duolingo-17` (home) é o único arquivo que mostra a entrada do dia.

- Chrome do topo: **4 itens**, sem uma palavra — bandeira, contador de dias,
  moeda, assinatura.
- Chrome de baixo: **6 ícones, zero texto**. Três deles com bolinha vermelha.
- Corpo: faixa da unidade + **6 nós de exercício + 1 baú** numa rolagem.

Contagem de toques até estar respondendo: **home → nó → começar → 1º toque de
resposta**. Nos arquivos de lição (`-02`, `-04`, `-07`) cada exercício se resolve
com **1 a 4 toques** e nenhum campo de texto: alvo de imagem (`-02`, 4 opções),
banco de palavras (`-04`), montagem de peças (`-07`). Não há teclado em nenhuma
das oito capturas oficiais.

**A observação mais forte da `duolingo-17`:** o contador de dias no topo está
**cinza**, não laranja — o dia ainda não fechou. O mesmo número, quando o dia
fecha, é laranja (`duolingo-19`, `-06`). O medidor não muda de forma nem de
posição; muda só de saturação. Estado é cor, não é tela nova.

_Implicação LinkGym:_ Hoje deve carregar o número da Ofensiva já no chrome, em
cinza, e ele acende quando a Sessão fecha. Zero toque para saber se hoje está
pendente. E a Série (tela 9 do spec) deve resolver com toque, nunca com digitação
de carga no caminho crítico.

## 3. Como a sequência é mostrada, e o que acontece quando cresce

`duolingo-06` — **3 tamanhos de texto na tela inteira** (medidos no arquivo
1242×2688):

| Elemento | Altura | % da tela |
| --- | --- | --- |
| Número | **388 px** | 14,4 % |
| Rótulo abaixo do número | **93 px** | 3,5 % |
| Letras dos dias da semana | **35 px** | 1,3 % |

Razão **4,2 : 1 : 0,38**. O número é a tela. A linha de 7 dias tem **3 marcados
(preenchidos) e 4 vazios (cinza)**, e a letra do dia de hoje é a única colorida.

`duolingo-09` (GIF do blog, **150 quadros × 50 ms = 7,50 s**, medido nos blocos
de controle gráfico do próprio GIF):

- **0,00 s → 3,65 s**: fundo branco. Número e mascote fazem a ação.
- **3,70 s**: o fundo inteiro vira laranja de borda a borda; o número passa de
  laranja para branco. Nenhum elemento muda de lugar — muda o fundo em volta.
- **5,90 s**: só então aparecem os dois botões (um cheio, um em texto).
- **7,50 s**: fim.

`duolingo-13` (**175 quadros × 40 ms = 7,00 s**) mostra o mesmo momento com o
número em 365: o valor **anterior** aparece pequeno e cinza e é substituído pelo
novo, grande e colorido. A conquista é literalmente o número trocando.

**O que anima:** o número, o mascote, o fundo.
**O que NÃO anima:** o rótulo de texto (mesmo corpo e mesma posição do primeiro
ao último quadro) e os botões (aparecem, não saltam).

_Implicação LinkGym:_ tela 12 do spec (Ofensiva + XP) é um número gigante, um
rótulo pequeno, uma linha de dias — e nada mais. A comemoração pode durar
~6 s **antes** de qualquer botão aparecer; Reanimated 4 na UI thread dá isso sem
travar. No Modernist a virada de fundo branco→laranja vira `#0b0a0a` → cor do
personal, que é exatamente o acento único do design.

## 4. O que aparece quando o aluno falha um dia (tom)

`duolingo-19` (detalhe da sequência, calendário do mês, mar/2024) é a evidência
mais limpa do eixo:

- Dois dias cumpridos aparecem **preenchidos**.
- Todos os outros dias do mês — inclusive os que o usuário perdeu — são
  **numeral cinza idêntico ao de qualquer dia futuro**.
- **Nenhum X, nenhum vermelho, nenhuma marca de falta.**

A falha é representada por **ausência de marca**, nunca por marca de falha. O
histórico não acusa; ele só registra o que aconteceu.

`duolingo-10` mostra a outra metade da regra: o protetor é **oferecido antes**
da falha, com o número de dias já em risco no título, **2 slots** visíveis
(0 de 2 equipados), preço e uma saída em texto simples. O seguro nunca é vendido
depois do estrago.

_Implicação LinkGym:_ o Protetor do CONTEXT.md ("primeira falha não zera, gasta
sozinho") já é mais generoso que a referência, porque não cobra e não precisa ser
equipado. O que falta copiar é o **calendário sem marca de falta** e o aviso
antecipado. E: nada de vermelho na tela do aluno para dia não cumprido.

## 5. Quando a sequência zera

`duolingo-20` (UI antiga, mas o layout do erro é o achado):

- É uma **faixa no topo da home**, não um modal, não uma tela bloqueante.
- Tem **X para fechar**.
- O caminho de exercícios continua rolável e clicável logo abaixo — o app não
  fica refém do erro.
- O contador no chrome do topo mostra **0**. O fato é dito uma vez, no número.
- Conteúdo da faixa: mascote com lágrima + **uma linha** + **um botão**.
- Tom: sem a palavra culpa, sem "você falhou", sem número de dias perdidos
  repetido em corpo grande. O único elemento emocional é o desenho.

_Implicação LinkGym:_ Retomada (tela 16, D11) deve ser **cartão dentro de Hoje
com fechar**, nunca uma tela que trava a entrada. O CONTEXT.md já diz que a
Retomada não apaga PR nem carga — a referência confirma o formato: o acervo fica
visível e utilizável atrás do aviso.

## 6. Celebração de conclusão

`duolingo-11` (duas telas em sequência, do post do blog):

1. **Fim da lição**: mascote, barra de meta, **um ganho numérico** e uma linha
   dizendo o que ainda falta hoje. Um botão.
2. **Sequência**: número grande, linha de 7 dias marcados, uma linha de texto,
   um botão.

Regra: **uma tela = um número = um botão.** O ganho da sessão e a sequência não
dividem a mesma tela; cada um tem a sua, na ordem.

`duolingo-08` mostra a versão barata da mesma coisa dentro da lição: o acerto
troca o enunciado por uma palavra verde **no mesmo slot**, sem modal, sem
overlay. `duolingo-04` mostra a outra: quando o aluno acerta em série, a **barra
de progresso do topo muda de verde para dourada com faíscas** — a recompensa
acontece num componente que já estava na tela. Zero navegação.

_Implicação LinkGym:_ tela 11 (Descanso + esforço) e tela Feito não precisam de
overlay novo; a barra da Sessão pode acender. E o retorno da sessão deve separar
"o que você fez hoje" de "sua Ofensiva" em duas telas curtas, não empilhar.

## 7. Como pede o próximo passo sem cobrar

`duolingo-12` (regra antiga) × `duolingo-11` (regra nova) documentam a mudança
com a UI dos dois lados:

- **Antes** (`-12`): o dia só contava se o aluno batesse a meta diária.
- **Depois** (`-11`): **uma lição** fecha o dia, e a meta virou uma barra
  separada, mostrada logo abaixo, com a frase do quanto ainda falta.

O critério que sustenta o ritual passou a ser **o menor ato possível**; a
ambição foi movida para um segundo medidor que não pune quem não chega lá. O
pedido de "faça mais" é uma frase de apoio embaixo do ganho, nunca um botão.

`duolingo-18` (configuração de lembretes) mostra o mesmo cuidado no push:
**6 categorias separadas**, com canal escolhível por linha; o horário fixo
(17:00) fica **desabilitado em cinza** quando o agendamento automático está
ligado; e existe categoria própria para "o protetor foi usado" e para "salvar o
dia" — eventos distintos, não uma notificação genérica de engajamento.

_Implicação LinkGym:_ o push do CONTEXT.md ("aluno parado → retomada") deveria
ser um evento próprio, separado de "treino publicado". E a meta combinada com o
personal (que define a Ofensiva) tem que poder ser cumprida com **um ato
mínimo** — fechar a Sessão do dia — com a ambição (volume, PR) num medidor
paralelo que não zera nada.

## 8. Outras regras que os arquivos oficiais entregam de graça

- **`duolingo-02`, `-03`, `-04`, `-07`, `-08`**: toda tela de exercício tem a
  mesma moldura — X à esquerda, barra de progresso no meio, medidor de recurso
  à direita. Quatro tipos de conteúdo completamente diferentes (idioma, xadrez,
  matemática, música) dentro de **um único chassi**. O conteúdo varia; o chrome
  nunca.
- **`duolingo-03` e `-05`**: quando existe instrução, ela vem por um personagem
  em balão, curta, com **uma palavra destacada em cor**. Nunca um parágrafo.
- **`duolingo-01` / `-14`**: a mesma lista aparece em dois pesos — linha de
  catálogo (`-01`, denso, com seta) e cartão de escolha (`-14`, alto,
  selecionável). Escolha é cartão; navegação é linha.

---

## O que eu NÃO consegui ver

1. **Tela de retomada depois de vários dias fora.** Não achei nenhuma captura
   verificável. A única descrição pública que encontrei é copy citada num post
   de rede social ("não liga para as lágrimas, ele está feliz que você voltou"),
   sem imagem de UI que eu pudesse abrir e conferir. **Não salvei e não descrevo
   layout que não vi.**
2. **Escalonamento visual da falta ao longo dos dias** (ícone do app "doente" no
   dia 1–3 e depois). A única imagem que encontrei era composição de marketing,
   não UI — descartada.
3. **Duração real das animações no app.** Os 7,50 s e 7,00 s são medidos nos
   GIFs do blog da própria empresa (contagem de quadros e delays no arquivo),
   não numa captura instrumentada do app. GIF de blog pode ter sido cortado ou
   reamostrado. Trate como ordem de grandeza confiável, não como spec.
4. **Contagem exata de telas do onboarding.** Deduzida da fração da barra
   (1/16 encaixa em 6,2 %), não contada tela a tela. Só 3 das ~16 estão em disco.
5. **Tempo real do gesto diário em segundos.** Não instrumentei; contei toques
   por exercício nos arquivos, não a duração de uma lição inteira.
6. **`duolingo-20` é UI antiga.** O mecanismo (faixa fechável na home, contador
   em 0, caminho utilizável atrás) é o que vale. O estilo daquela captura não
   representa o app atual.
