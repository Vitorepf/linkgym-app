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


---

# Barra — eixo3-ritual-aluno · referência: Hevy e Strong (registro de série)

O Duolingo acima cobre o ritual (voltar todo dia, não punir a falta). Ele não cobre
a mecânica que o aluno repete 18 vezes numa sessão: **anotar a série**. Essa barra vem
de dois loggers de musculação que competem entre si — o que os dois fazem igual é ofício,
não gosto.

Mesma regra de sempre: cada afirmação cita o arquivo que a comprova. Regra sem arquivo é
palpite e não entra. Onde eu deduzi em vez de medir, está rotulado como hipótese, com o
experimento que a confirmaria.

## Procedência verificada

Dois `trackId` conferidos pelo `sellerName` antes de baixar — a busca por `hevy` e por
`strong` devolve homônimos (`Gym WP`, `Befit`, `SmartGym`, `Lyfta` etc.), e nenhum deles
é a referência.

| App | trackId | sellerName | trackName | versão / atualizado |
| --- | --- | --- | --- | --- |
| Hevy | **1458862350** | *Hevy Studios S.L.* | `Hevy - Treino de Academia Gym` | 3.1.9 · 2026-08-14 |
| Strong | **464254577** | *Strong Fitness PTE Limited* | `Strong Workout Tracker Gym Log` | 6.5.0 · 2026-08-12 |

Todos os arquivos vieram do campo `screenshotUrls` de
`itunes.apple.com/lookup?id=<trackId>&country=br`, com o sufixo de tamanho trocado para
`1242x0w.png`. `hevy-11` é o único do campo `ipadScreenshotUrls` (justificativa abaixo).

| Arquivo | URL de origem | trackId / sellerName |
| --- | --- | --- |
| `hevy-01-capa-promo-registre-seus-treinos.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/c0/9e/be/c09ebe71-3da2-ea93-ae42-480986c72882/e800d1eb-b233-45ed-ab09-d291e41ffe64_screenshot0-portugues.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-02-registro-serie-previous-e-carga-cinza-nao-confirmada.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/92/e6/57/92e65777-89a8-f55c-ed48-dd1a93481456/44f5f39c-afd3-40c7-b983-2debe4c0b7c9_screenshot1.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-03-exercicio-grafico-carga-maxima-e-selo-pr.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/14/51/5d/14515d65-5d0e-6aec-a104-9132f32cef35/71aea404-aa67-4105-bb9d-7da336ee9e14_screenshot2.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-04-aba-treino-rotinas-e-botao-start-routine.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/02/6c/3a/026c3a7d-261b-7ca8-6821-6b6249ce708e/214923f9-2d00-4c9b-95d0-725a83590025_screenshot3.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-05-feed-post-de-treino-com-curtidas.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2a/d6/26/2ad626ce-b1a1-82d6-8d8f-310d1ab0658c/7bf1f004-0117-4a00-ad69-ed231e34666b_screenshot4.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-06-medidas-corporais-peso-e-fotos.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/81/4b/9f/814b9ffa-f509-0ba2-c83c-5b43aaa4d604/859942f6-c6d1-4bb6-bdb0-2c486268cbec_screenshot5.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-07-comparacao-de-forca-entre-dois-perfis.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b4/30/49/b430499b-aba9-a05c-2497-3c69dab7dfbc/1e458a00-7816-4fbc-906e-92c9bb3a402f_screenshot6.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-08-perfil-horas-na-semana-e-rotinas.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/14/5c/8c/145c8cc4-8d01-df75-51f1-7ee5def7e236/fd1d9459-5972-4f9f-8ce9-3db6e9dd3420_screenshot7.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-09-biblioteca-exercicios-busca-e-filtro.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/fa/59/8d/fa598d57-acf4-433b-f4cd-cded5d7a8ae2/13e0939c-33a8-4ef0-a96a-0f4e4ad8173c_screenshot8.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-10-modo-escuro-feed.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5b/71/1a/5b711a88-8ac7-a949-7cac-0c8fe3e7593d/136d67d4-4010-4f12-9419-81770801475c_screenshot9.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `hevy-11-ipad-tabela-serie-completa-com-aquecimento.png` | `https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/ce/93/18/ce9318a2-199d-1876-8911-17671b2c1c18/b1deaacd-6b60-488f-b06b-773021f02755_screenshot1.png/1242x0w.png` | 1458862350 / Hevy Studios S.L. |
| `strong-01-registro-serie-tabela-set-previous-kg-reps.png` | `https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/12/d1/e9/12d1e965-94eb-7613-9d38-1935386ca666/mzl.xmocyjup.png/1242x0w.png` | 464254577 / Strong Fitness PTE Limited |
| `strong-02-exercicio-abas-about-history-charts-records.png` | `https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/ed/36/3c/ed363cd3-117d-3fa5-da5a-9c6257199f62/mzl.vsnvfchz.png/1242x0w.png` | 464254577 / Strong Fitness PTE Limited |
| `strong-03-calculadora-de-anilhas-sobre-a-sessao.png` | `https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/1a/be/bf/1abebf33-f40a-5ada-f393-05f809ec1fe8/mzl.dqpbhlzy.png/1242x0w.png` | 464254577 / Strong Fitness PTE Limited |
| `strong-04-cronometro-descanso-1-44-de-2-00.png` | `https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/1e/f0/e6/1ef0e6f9-e1d1-61ca-c919-d1cb7fc10b9c/mzl.wfjwxaki.png/1242x0w.png` | 464254577 / Strong Fitness PTE Limited |
| `strong-05-perfil-treinos-por-semana-e-melhor-serie.png` | `https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/6a/3a/27/6a3a27ba-b833-f91b-b1d9-d4aaef88b63d/mzl.mgibvldj.png/1242x0w.png` | 464254577 / Strong Fitness PTE Limited |

O Strong publica **apenas 5** screenshots de iPhone e **zero** de iPad — 5 é tudo que
existe, não é recorte meu.

Do Hevy peguei os 10 de iPhone e **um** de iPad. O de iPad não é enfeite: `hevy-02`
(iPhone) é uma composição com o aparelho inclinado e as linhas da série "explodidas" para
fora da moldura, o que corta colunas. O de iPad mostra **a mesma tela, reta, com a tabela
inteira e os cabeçalhos legíveis**. Os outros 9 de iPad repetem os mesmos temas de
marketing (feed, perfil, medidas) e não acrescentam nada à mecânica de registro — não
baixei, e digo isso em vez de fingir varredura completa.

## Regras medíveis

### 1. A linha da série tem 5 colunas, e uma delas é a sessão passada

| App | Arquivo | Cabeçalho literal |
| --- | --- | --- |
| Hevy | `hevy-11` | `SETS · PREVIOUS · KG · REPS · ✓` |
| Strong | `strong-01` | `Set · Previous · kg · Reps · ✓` |

Dois concorrentes, mesma tabela, mesma ordem, mesmo glifo mudo na última coluna. **A
referência da última vez é coluna fixa na linha de entrada** — não é histórico atrás de um
toque, não é tela separada. O aluno vê o que fez da última vez no mesmo pixel onde vai
escrever o que fez agora.

### 2. A carga vem pré-preenchida, e o valor pré-preenchido é literalmente o da coluna Previous

`hevy-11`, Bench Press, linha 3 (não confirmada): `Previous 70kg × 6` → `KG 70` · `REPS 6`.
Valores idênticos aos da própria coluna de referência.

Que não é coincidência do gerador de mockup, prova a mesma tabela nas linhas **já
confirmadas**: `Previous 62kg × 7` → `KG 65` · `REPS 8`. O atleta sobrescreveu para cima.
**O prefill é ponto de partida, não trava.**

Medido na tinta do glifo (pixel mais escuro da caixa do número):

| Arquivo | valor confirmado | valor pendente | coluna Previous |
| --- | --- | --- | --- |
| `hevy-02` | RGB (25,26,27) | RGB (174,179,183) | RGB (174,179,183) |
| `strong-01` | RGB (32,40,46) | RGB (199,202,203) | RGB (181,195,191) |

Em `hevy-02` o número pendente e o número da coluna Previous têm **exatamente a mesma
tinta**. O campo pendente não é "vazio com placeholder" — é renderizado como **eco visual
da referência**. Ele já mostra a resposta provável, no tom de quem ainda não foi confirmado.

### 3. Nunca existe campo vazio esperando digitação

- `hevy-11`, Overhead Press: coluna `Previous` é `–` (não há sessão anterior) e mesmo assim
  `KG 20` / `REPS 8` e `KG 32` / `REPS 8` já estão nos campos, em cinza.
- `strong-01`: as três linhas dizem `No Previous`, e a linha 3 pendente ainda traz `85` e
  `8` — os mesmos valores das séries 1 e 2 daquela sessão.

Ou seja, a cascata de preenchimento tem fallback: **sessão anterior → série anterior da
mesma sessão → alvo prescrito na rotina**. Em nenhum dos 16 arquivos aparece um campo de
carga em branco.

### 4. O estado da série é o preenchimento da LINHA e do CHECKBOX — não a cor do texto

Esta é a correção honesta da regra 2. O contraste de tinta separa confirmado de pendente em
`hevy-02` e `strong-01`, mas **não** em `hevy-11`: ali os valores confirmados e o pendente
medem lum 174 / 174 / 173, praticamente idênticos.

O que separa os estados nos **três** arquivos, sem exceção:

- fundo da linha: verde nas confirmadas, branco/cinza-claro na pendente;
- checkbox: quadrado verde cheio com check branco vs. contorno ou cinza chapado.

Portanto a única codificação de estado que sobrevive aos três artefatos é **fundo + caixa**.
Contraste de texto é reforço, e nem sempre está lá.

### 5. Confirmar a série é um alvo único, na borda direita

Em `hevy-11` e `strong-01` a coluna `✓` é a última, é a única célula com fundo próprio
dentro da linha, e o cabeçalho dela é o glifo `✓` sem nenhuma palavra. Em `strong-01` a
caixa confirmada mede aproximadamente o dobro da área do numeral da série ao lado.

Quantos toques isso custa é **hipótese** — ver a seção de hipóteses.

### 6. O descanso é atributo do exercício, e a tela dele não tem campo numérico

- Hevy (`hevy-02`, `hevy-11`): `Rest Timer: 1min 30s` é uma linha azul com ícone de
  cronômetro, posicionada **entre o nome do exercício e o cabeçalho da tabela** — uma por
  exercício. A duração pertence ao exercício, não a um ajuste global.
- Strong (`strong-04`): folha `Rest Timer` com anel de progresso, `1:44` em corpo grande e
  `2:00` menor logo abaixo (restante sobre total), e exatamente três controles:
  `−10s`, `+10s`, `Skip`. A instrução na tela é "Adjust duration via the +/− buttons."

**Nenhum teclado, nenhum campo de texto, nenhum seletor de roda.** Ajuste de tempo é
incremento de 10 s por toque, e existe uma saída explícita (`Skip`) para quem não quer
esperar.

### 7. O cabeçalho da sessão é três números e uma saída

- `hevy-11`: `Time 1h 15min` · `Volume 6 800 kg` · `Sets 18`, e o botão `Finish`.
- `strong-01`: nome da sessão (`Monday's Session`), cronômetro `36:58`, e o botão `Finish`.

Em ambos, `Finish` está no topo à direita e é **o único botão cheio da tela inteira**. O
resto da sessão é tabela e linhas de toque. Encerrar nunca compete visualmente com registrar.

### 8. Aquecimento ocupa linha, mas não ganha número

`hevy-11`: a coluna `SETS` traz **`W` em laranja** (RGB 241,163,0) na primeira linha, e só
depois `1`, `2`, `3`. A linha de aquecimento tem `Previous`, tem prefill e tem checkbox
igual às outras — ela só não entra na contagem. A mesma tabela serve dois tipos de série
sem trocar de layout nem abrir modo.

### 9. Traduzir carga em anilha é leitura, não entrada

`strong-03`: `Plate Calculator` abre como folha **por cima da sessão em andamento** (a
sessão continua visível e desfocada atrás, com a linha 3 ainda pendente na base). Mostra
barra de `20 kg`, anilhas por lado com contagem (`20 ×1`, `10 ×1`, `2.5 ×1`) e
`Olympic Bar. Remaining: 0 kg`. É saída de informação a partir da carga já digitada — o
aluno não monta a carga somando anilhas.

### 10. O acervo por exercício fica atrás do nome do exercício, não no caminho da série

`strong-02`: tocar o exercício abre `About · History · Charts · Records` em quatro abas.
`hevy-03`: a mesma ideia com gráfico de `Heaviest Weight` e selo `PR`, e os seletores
`Heaviest Weight` / `One Rep Max` / `Best Volume` / `# of Reps`. **Nada disso está no
caminho crítico de anotar a série** — mora um nível abaixo, alcançado pelo nome do exercício.

_Comparação com o nosso app:_ a tela 9 do spec (Série) precisa da coluna de referência da
última vez **dentro da linha**, com carga já preenchida e sobrescrevível, e confirmar tem
que ser um alvo só na borda direita. O Progresso e o PR ficam atrás do nome do exercício,
nunca no caminho de fechar a série. E o Descanso (tela 11) tem incremento em passo fixo com
saída explícita, não campo de digitação.

## Hipóteses — deduzidas, NÃO medidas

Imagem estática não conta toque. As três abaixo são deduções e estão rotuladas como tal.
Nenhuma pode ser citada como medição.

| # | Hipótese | Experimento que confirmaria |
| --- | --- | --- |
| H1 | Quando o prefill serve, registrar a série custa **1 toque** (só o `✓`). | Instrumentar o app real: abrir a rotina, tocar só o checkbox de uma linha pendente e verificar se o valor persiste sem nenhuma outra interação. |
| H2 | Alterar a carga custa **1 toque no campo + digitação**, com o valor já selecionado. | Tocar o campo `KG` e observar (a) se abre teclado numérico, (b) se o conteúdo entra selecionado — se entrar, sobrescrever é digitar, não apagar. |
| H3 | O cronômetro de descanso **dispara sozinho ao confirmar a série**, sem toque extra. | Confirmar uma série e observar se a folha de descanso sobe sem nova interação, e se o valor inicial é o `Rest Timer` daquele exercício (1min 30s em `hevy-11`). |

A copy da loja em `strong-04` diz "temporizador automático de descanso", o que sugere H3 —
mas **copy de loja não é evidência de UI**, e a imagem não mostra o gatilho. Fica hipótese.

## O que estes arquivos NÃO provam

- **São peças de marketing da App Store.** Moldura de aparelho renderizada, copy
  promocional por cima, fundo de campanha. `hevy-02` é o caso extremo: o telefone está
  inclinado e as linhas da série foram **"explodidas" para fora da moldura** como colagem.
  Aquilo não é captura de tela — é composição. Não dá para medir espaçamento, alinhamento
  nem tamanho de alvo de toque em nenhum destes 16 arquivos.
- **Não dá para contar toque em imagem estática.** Toda a seção de hipóteses existe por
  isso. Se alguém precisar do número de toques do ciclo de registro, o caminho é
  instrumentar o app, não reler estas imagens.
- **Os 5 arquivos do Strong mostram chrome de iOS antigo** — barra de status com bolinhas
  de sinal (`●●●○○`), `9:41 AM` centralizado, moldura com botão físico e canvas 1242×2208
  (iPhone 8 Plus). A ficha da loja diz versão 6.5.0 de 2026-08-12, mas **o asset é bem mais
  velho que a versão**. Vale pela mecânica da tabela, não pelo estilo nem pelo estado atual
  do produto.
- **`hevy-11` é iPad.** A tabela é a mesma, mas largura de coluna e densidade num tablet não
  provam o que acontece na largura de um telefone — que é onde o aluno registra de verdade.
- **A ausência de teclado não prova ausência de digitação.** Nenhum dos 16 arquivos mostra
  teclado aberto, mas marketing nunca mostra teclado. Isso é viés da fonte, não achado.
  Só H2 resolve.
- **Nenhum arquivo mostra erro, série falhada, sessão interrompida ou perda de conexão no
  meio do registro** — e o registro de série é justamente onde o app é usado com a mão suada,
  entre séries, com a tela apagando. Essa lacuna fica declarada: **não tem barra coletada**.
- **Nenhum arquivo mostra o momento da transição de estado** (a linha virando verde, o
  descanso subindo). Timing e curva de animação do ciclo de registro não têm evidência aqui.

---

Imagens de referência interna de pesquisa. Não entram no app, não são republicadas, nenhuma
tela é clonada. Copia-se o ofício, nunca a identidade.
