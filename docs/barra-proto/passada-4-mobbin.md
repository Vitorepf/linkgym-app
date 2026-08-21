# Passada 4 — pack de pixel (Mobbin)

Fonte: MCP `Mobbin` (`search_screens` / `search_flows`). Cada número abaixo foi lido na
captura servida (iOS 299×678 ou 299×680; Stripe web 768×521), não no metadado.
Fator para 393 pt (iPhone 14/15 Pro): **×1,31**. Fator para 430 px: **×1,44**.
Onde o valor é faixa e não pixel exato, o texto diz faixa.

Auth: o server respondeu `ready`. Nenhuma busca pediu login. O ID
`e2f6c0b8` **não** veio em `platform: web` (a URL é Stripe Dashboard **iOS**);
veio na busca iOS. Registrado. Não inventei screenshot que não abriu.

Telas pedidas em `docs/barra-proto/proxima-passada.md`. Furos da rodada 3 em
`docs/barra-proto/veredito-*.md` (21 ago). Este arquivo não julga o proto.

---

## Linear Mobile

[Active issues](https://mobbin.com/screens/30ebc468-06c8-46dd-9503-e197e89a1e5c)
· iOS · captura 299×678 · luma da página ~242–253 do topo aos 90% (cena
plana, zero cartão).

**Corpos na dobra.** Dois. Título da tela «Active issues» ~22–26 pt (captura
~17–20 px ×1,31). Tudo o mais — «In Progress» / «Todo» / «Backlog», ID
`HBT-*`, título da linha — no mesmo corpo de linha, ~15–17 pt. Razão título
÷ linha ≈ **1,45–1,55**. Razão seção ÷ linha = **1,00**. A lista densa roda
em 1 corpo; o segundo corpo é só o título da tela.

**Quantos.** 3 cabeçalhos de grupo + 10 linhas (In Progress 2, Todo 6,
Backlog 2 visíveis). Chrome: back, ícone de vista, `+`, `···`, dock flutuante
de 4 glifos + lupa circular. ~13 slots de conteúdo na dobra útil (título + 3
grupos + 10 linhas cabem porque o grupo custa 1 slot).

**Pesos.** Dois na lista: regular na linha, medium/semibold no rótulo de
seção. O título da tela é o terceiro, bold, e some se a pergunta for só a
lista. Delta seção→linha é peso + cinza, não tamanho.

**Preenchidos.** Zero botões. Massas cromáticas que carregam dado: 2 avatares
cheios (iniciais), 2 círculos de estado meio-amarelo (In Progress), 1 pílula
cinza no ícone ativo do dock, 1 círculo da lupa. Soma de tinta de ação = 0.

**Herói vs riscado/secundário.** Herói = título da issue na linha. Secundário
= ID à esquerda, avatar/ghost à direita, rótulo de seção em cinza. Estado é
glifo, nunca a palavra na linha. A palavra do estado aparece 1× por grupo
(3× na dobra), não 10×.

**Overlay.** Cena. 0% de cartão. Dock flutua no rodapé, não cobre a lista
(luma da faixa 80–90% continua ~240, igual à página).

**Foto.** 0% da dobra. 0 cheia, 0 meia.

**Disabled / erro.** 0 portadores. Backlog = círculo tracejado (pendente), não
desligado. Sem assignee = ghost outline. 0 frase de erro, 0 campo vermelho.

Régua entre linhas: 0. O que separa é o vão do slot (~46–52 pt de passo,
alvo de dedo).

---

## Things 3

[Creating a new to-do](https://mobbin.com/flows/b1fa3cd6-e51a-4c76-9b52-747df82afefe)
· iOS · 18 quadros. Medidos: sidebar (1, 18), menu New (2), cartão vazio (3),
cartão com título (4, 14), When? (5, 10). Captura 299×680.

**Corpos na dobra (cartão New To-Do, quadros 3–4).** Dois no cartão: título
~17–18 pt (semibold quando preenchido), notes ~13–15 pt regular cinza.
Razão ≈ **1,15–1,25**. «Inbox» no rodapé do cartão = mesmo corpo das notes.
No When?: «Today» / «This Evening» / «Someday» em sentence case, ~17 pt
bold branco; grade do mês ~13 pt; «When?» ~17–20 pt. Cinco degraus no fluxo
inteiro, nenhum salto de vizinho acima de 1,30.

**Quantos.** Cartão: 5 zonas (checkbox+título, notes, tags, metadado
when/ícones, barra Inbox+Save). When?: 7 fileiras (título, Today, Evening,
grade, Someday, reminder, Clear/Done). Sidebar: 6 destinos + 1 secundário.

**Pesos.** Dois no cartão (regular / semibold). Três no When? se contar o
bold de «Today». Zero negrito dentro de linha de lista — aqui não há lista
aberta, há cartão.

**Preenchidos.** 1 por quadro de criação: Save azul (quadros 3, 4, 14). When?
com reminder (quadro 10): 2 (Clear vermelho + Done cinza) — o único quadro
do fluxo que quebra «1 preenchido». Menu New (quadro 2): 0 preenchido de
ação; a massa é o cartão escuro. FAB da sidebar: 1 círculo azul, ~52–56 pt,
sem rótulo.

**Herói vs riscado/secundário.** Herói = título do to-do no cartão; no When?
= «Today» / «This Evening» (sentence case, ícone 60–75% da caixa alta).
Secundário = notes, Inbox, quatro glifos outline (calendário / tag / lista /
bandeira). «Cancel» do When? é cinza, sem caixa.

**Overlay.** Cartão, nunca troca de cena.

| quadro | o que sobe | % da altura (luma) | contexto atrás |
| --- | --- | --- | --- |
| 2 menu New | cartão escuro no rodapé | 35% (y 374–612 / 680) | sidebar inteira, sem véu duro |
| 3–4 New To-Do | cartão branco no topo | 40% (y 34–306 / 680) | lista dimida no topo (~5%) + teclado 45–50% |
| 14 cartão cheio | cartão branco no topo | 40–42% | lista dimida abaixo, **sem** teclado — ≥2 linhas do contexto |
| 5 When? | cartão escuro ao centro | 55% (y 136–510 / 680) | título do to-do ainda lê em cima |
| 10 When? + reminder | idem + 2 botões | 55–65% | idem |

Faixa da barra Things B20: 40–70%. O cartão de criação cai no piso. When?
cabe no teto. Nenhum quadro do fluxo é 100%.

**Foto.** 0% em todos os 18.

**Disabled / erro.** 0 no cartão de criação. When?: datas passadas omitidas
(não cinza). Quadro 10: Clear é destrutivo visível **depois** de haver o que
limpar, não em repouso.

«Today» / «This Evening» = sentence case, sem caixa alta, ícone menor que a
letra. A passada pedia exatamente isso.

---

## Stripe Dashboard

[Add a card](https://mobbin.com/screens/e2f6c0b8-bfb7-49e7-ab49-e09e27229cb3)
· **iOS**, não web. Captura 299×680. Luma: fundo dimido L* ~180–200 (0–40%);
folha branca L* ~245–254 (40–95%). Folha = **55–62%** da altura.

Busca `platform: web` + «Add a card» devolveu Melio / Revolut / Pipedrive /
Expedia / Substack / Claude / Rows / Fresha — **zero** `e2f6c0b8`. A URL
abre como «Stripe Dashboard iOS Payment Method Screen», tags Payment Method
+ Error + Adding & Creating.

**Corpos na dobra (folha).** Três. Título «Add a card» ~22–24 pt bold.
Rótulo de seção («Card information», «Billing address») ~13–14 pt cinza.
Campo / erro / Continue ~15–16 pt. Razão título ÷ campo ≈ **1,45–1,55**.
Razão seção ÷ campo ≈ **0,85–0,90** (seção menor, não maior).

**Quantos.** 7 blocos na folha: X+título, cabeçalho Card information + Scan
card, grade do cartão (número / MM·YY / CVC), frase de erro, cabeçalho
Billing address, Country + ZIP, Continue. Fundo: «Create a payment» + cartão
selecionado «Manually Charge Card» ainda lê.

**Pesos.** Dois na folha: bold no título, regular/medium no resto. Continue
semibold branco. Scan card = regular azul, sem caixa.

**Preenchidos.** **1**: Continue azul, largura da folha. Campos = contorno.
Scan card = texto. Fundo: 0 preenchido extra (o método selecionado é borda
roxa, sem fill). A captura tem erro e o Continue **continua preenchido** —
não vira cinza, não some.

**Herói vs riscado/secundário.** Herói = Continue (única massa). O número
inválido é o segundo foco, por cor, não por tamanho. Secundário = rótulos
internos do campo, Scan card, billing.

**Overlay.** Cartão / bottom sheet. **Não** troca a cena. ~55–62% da altura.
X no topo esquerdo. Véu: 1 passo (fundo L* 180 contra folha 250).

**Foto.** 0%. Glifos: câmera (Scan card), ícone de cartão, glifo de CVC.

**Disabled / erro.** Erro: **3 portadores no culpado** (o número):

1. algarismo vermelho dentro do campo
2. glifo `!` vermelho no canto direito do campo
3. frase sob o campo: «Your card number is invalid.»

A borda do campo também tinta de erro — 4º sinal, extra ao mínimo da
passada. Continue **não** é o portador: fica azul. 0 disabled nesta
captura (o quadro é erro, não vazio). Disabled com matiz guardada e
contraste 2,2–3,0:1 **não está neste quadro**; a barra 03 A11 / B4 já
manda copiar isso de outro frame do Dashboard.

---

## Flighty

[AA 6260 landing](https://mobbin.com/screens/d2a15492-9519-4965-826f-649edbfc3521)
· iOS · 299×678. Luma: mapa 0–40% (L* 87–113); folha branca 40–95% (L*
216–242). Folha ≈ **55–60%**. Mapa ≈ **40%** da dobra.

**Corpos na dobra (folha).** Quatro blocos, dois tamanhos de herói. Identidade
«AA 6260 · THU, 25 JUN» ~12–13 pt cinza. Par de cidades ~17–18 pt bold.
Herói de hora «8:31 PM» / «11:14 PM» ~28–32 pt (captura ~22–24 px ×1,31).
Corpo / subtítulo «4m Early · 1h 54m ago» ~13–15 pt. Razão herói ÷ corpo ≈
**2,1–2,4**. Fantasma riscado «8:35 PM» / «10:06 PM» ≈ **40–45%** da altura
do herói, mesma linha, à direita, cinza.

**Quantos.** 4 seções na folha: cabeçalho (ID + cidades + X), faixa «Landing
in 40m», bloco partida, bloco chegada + CTA. No mapa: 1 HUD (768 KM/H ·
altitude) + 1 coluna de 3 glifos.

**Pesos.** Dois no bloco: bold no herói e nas cidades; regular no resto. A
faixa de estado bold só na duração («40m»).

**Preenchidos.** 5 massas cromáticas, 1 de ação: faixa rosa da chegada;
3 pílulas amarelas (↗ 52E, 🧳 5, ↘ B22); 1 Continue/Add azul no rodapé.
Zero fill no herói de hora — a cor é do **tipo**, não da caixa.

**Herói vs riscado/secundário.** Herói = hora viva (verde na partida, vermelho
na chegada). Riscado = hora do plano, 38–48% da altura, mesma linha. Unidade
do herói é relógio (absoluto). A faixa trata atraso em **duração** («Landing
in 40m», «1h 8m late»). O bloco trata em **hora**. Mesmo objeto, duas
unidades. «4m Early» / «1h 8m Late» repetem o desvio em palavra, corpo, na
cor do herói.

**Overlay.** Cartão / bottom sheet sobre o mapa. Não troca a cena. 55–60%
da altura. Mapa continua: avião, rota, HUD.

**Foto.** O mapa **é** a foto: ~40% da dobra, 1 cheia (satélite), 0 meia.
Nenhuma foto de cabine. HUD e glifos pousam em pílula sobre o mapa.

**Disabled / erro.** 0 disabled. 1 portador de estado ruim: a faixa rosa +
texto vermelho (atraso). Partida verde e chegada vermelha convivem — cada
cor é de um evento, não da tela. 0 campo inválido, 0 botão apagado.

---

## Duolingo

[Great job! mid-lesson](https://mobbin.com/screens/12e43447-33df-4196-ba31-8c2fc8deabb9)
· iOS · 299×678. Luma da lição 0–70% ~230–253 (branca, viva). Faixa de
veredito 70–90% (L* cai a ~172 no verde, sobe a ~241 no Continue). Faixa ≈
**22–30%** da altura.

**Corpos na dobra.** Quatro. «12 IN A ROW» versalete ~11–12 pt. «Respond to
Lily» ~17–18 pt semibold. «Great job!» ~18–20 pt bold verde. «Meaning:» +
frase ~14–15 pt. Continue caixa alta ~16 pt. Razão «Great job!» ÷ Meaning ≈
**1,25–1,35**. A lição atrás não muda de tamanho quando a faixa entra.

**Quantos.** 4 andares: chrome (X + barra + ícones), título do exercício,
Lily (~40% da dobra), faixa (check + «Great job!» + Meaning + Continue).
A ilustração continua inteira. A faixa cobre o rodapé, não empurra Lily.

**Pesos.** Dois na faixa: bold no elogio / Meaning / CONTINUE; regular na
tradução. A lição atrás: semibold no título, regular no resto.

**Preenchidos.** 2 massas de ação/estado, 1 de progresso: barra laranja
«12 IN A ROW»; faixa verde-clara; Continue verde saturado largura da faixa.
Lily é ilustração, não botão. 0 segundo Continue.

**Herói vs riscado/secundário.** Herói da cerimônia = a faixa no sítio
(palavra + 1 Continue). Lily é herói visual da **lição**, não da festa — a
festa não troca o palco. Secundário = X, flag, speaker. 0 riscado neste
quadro (é acerto, não correção de valor).

**Overlay.** Cartão ancorado no rodapé. **Não** troca a cena. 22–30% da
altura. Conteúdo de cima desloca **0 px** (luma 0–70% contínua). Um toque
(Continue). A festa é o estado da lição viva, não uma tela nova.

**Foto.** 0 foto. 1 ilustração (Lily) ≈ **40%** da dobra, 1 figura cheia, 0
meia.

**Disabled / erro.** 0. O quadro é acerto. A barra 05 registrou: busca de
faixa vermelha não devolveu Duolingo — não afirmar erro daqui. Continue
nascido desabilitado no slot (visto em outras capturas do eixo, não nesta)
é o slot que a faixa **ocupa**, não um portador extra neste frame.

---

## Airbnb

[Photo gallery](https://mobbin.com/flows/3e29c503-c4be-42cb-80f4-c3c7522adb66)
· iOS · 5 quadros. Medidos: listing (1), photo tour (2–3), grupos (4),
lightbox (5). Captura 299×678.

**Corpos na dobra.**

- Quadro 1, página do listing: título ~22–24 pt bold; qualificação ~13–14 pt
  cinza; prova (4.96 / Guest favorite / 298 Reviews) ~13–15 pt; preço $356
  ~18–20 pt. Razão título ÷ qualificação ≈ **1,65–1,75**. Quatro linhas de
  texto sob a foto antes da faixa de prova.
- Quadro 2–4, galeria: cabeçalho de ambiente ~20–22 pt bold; legenda sob
  miniatura ~13–14 pt regular. Dois corpos. Razão ≈ **1,50–1,60**.
- Quadro 5, lightbox: «Living room» medium + «1 / 27» regular. Um corpo, dois
  pesos.

**Quantos.** Listing: 6 andares (foto, título, prova em 3 colunas, anfitrião,
Rare find, rodapé Reserve). Galeria: 1 índice horizontal + N grupos. Cada
grupo = 1 cabeçalho + 1 cheia + pares de meia (teto 4 fotos / grupo).
Lightbox: 1 foto + chrome.

**Pesos.** Dois por quadro: bold no título/cabeçalho/preço; regular no resto.
Reserve semibold branco.

**Preenchidos.** Listing: **1** — Reserve rosa, ~30–40% da largura, rodapé
fixo. Galeria (2–4): **0** preenchido de ação (ícones outline). Lightbox:
**0**. Rare find = faixa cinza, não tinta de alerta.

**Herói vs riscado/secundário.** Herói = a foto do objeto. Título mora na
**folha branca**, nunca no pixel da foto. Sobre a foto do listing: 3 pílulas
com véu (back, share+heart, «1 / 27») — rótulo curto, não conteúdo.
Secundário = qualificação, prova, anfitrião, Rare find.

**Overlay.**

| quadro | tipo | % altura | troca cena? |
| --- | --- | --- | --- |
| 1 listing | folha de conteúdo sobrepõe a foto ~20–30 px | foto 40%; folha o resto | não — **é a página** |
| 2–4 galeria | cena | 100% | sim, página da galeria |
| 5 lightbox | cena preta | foto 35–40% no centro | sim, viewer |

Rodapé Reserve do listing: overlay persistente ~12% da altura, não modal.

**Foto.**

| quadro | % da dobra | 1 cheia vs meias |
| --- | --- | --- |
| 1 listing | ~40% (luma muda em y 271) | 1 cheia full-bleed; 0 meia |
| 2 photo tour | índice ~25% (2 cheias + 1 fatia); herói Living room ~40–50% | 1 cheia do grupo + tira de meias |
| 4 grupos | herói ~40%; depois 2+2 meias | 1 cheia, depois pares; teto 4 / grupo |
| 5 lightbox | 35–40% centrada no preto | 1 cheia, 0 peek lateral |

**Disabled / erro.** 0 em todos os 5. Heart outline = não salvo, não
desligado. 0 campo, 0 frase de erro.

---

## O que o proto deve copiar amanhã

Oito linhas, uma por furo da rodada 3. Número da referência, não gosto.

1. **Linear / densidade** (`veredito-densidade-linear.md`): dobra densa em
   **2 corpos** (título da tela + linha); seção = linha, razão 1,00; 2 pesos
   na lista; 0 botão preenchido; 0 régua entre linhas; grupo custa 1 slot.
2. **Things / cartão** (`veredito-oficio-things.md`): Série / Descanso /
   Feito sobem **cartão 40–55%** (piso do fluxo Things), ≥2 linhas do Hoje
   ainda legíveis; When?-equivalente ≤65%; 0 cena 100%.
3. **Things / primária** (mesmo veredito): 1 Save preenchido no cartão; FAB
   52–56 pt; a primária **não** é o pixel mais luminoso da dobra (no Things
   claro o título branco-do-cartão ganha do azul; no escuro a barra 02 C0.3
   já mandou o substituto).
4. **Stripe / 1 massa + erro** (`veredito-componentes-stripe.md`): 1 Continue
   preenchido na captura, inclusive com campo inválido; erro com **3
   portadores no culpado** (algarismo + `!` + frase sob o campo) em
   Montar / Oferecer / Descanso — não só desligar o Thumb.
5. **Stripe / disabled**: guarda a matiz, desce para 2,2–3,0:1; 0 cinza novo.
   Este quadro iOS não mostra disabled — copiar de 03 B4 / A11, não inventar.
6. **Flighty / last** (`veredito-informacao-flighty.md`): 100% dos campos de
   execução com o valor anterior **na mesma linha, à direita, riscado,
   38–48%** da altura do herói, inclusive antes do primeiro toque; **1
   herói** por bloco; lista e detalhe em unidades diferentes do mesmo objeto.
7. **Duolingo / pedágio** (`veredito-motion-duolingo.md`): última série
   publica e cai no Hoje; **0 tela cheia, 0 toque** depois do ato; faixa no
   sítio da lição viva (22–30% da altura, 0 px de empurrão); 520 ms e
   **fica**; patamar só no primeiro cruzar 25/50/75/100.
8. **Airbnb / objeto** (`veredito-objeto-airbnb.md`): página do objeto **é a
   cena** (foto 40% da primeira dobra, título na folha, 1 Reserve); galeria =
   1 cabeçalho + 1 cheia + pares de meia, teto 4, 1–2 linhas de grandeza fora
   da imagem; recibo = foto + ≥3 atributos, 0 festa; card ≤4 linhas.
