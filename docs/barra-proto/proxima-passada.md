# Próxima passada — depois que as 6 perdas de 21 ago aterrissarem

Não implementa. Não relança júri. Uma tela Mobbin por eixo, copiada no pixel.
Produto: proto-aluno. Deck = pilha nomeada de fichas. RPG (Carga / Motor / Fundo /
Frequência) mora no Perfil. A aba Ficha é o programa. Quem misturar os dois errou.

Proibido: academia, chão, Explore, chat, world rank, painel de coach.

Furos dos vereditos de 21 ago em `docs/barra-proto/veredito-*.md`. A passada em
curso fecha o que der. Esta é a que vem depois: o mesmo furo, com uma tela
concreta. Não inventar gosto.

---

## 1. densidade-linear

**Copiar:** [Linear Mobile — Active issues](https://mobbin.com/screens/30ebc468-06c8-46dd-9503-e197e89a1e5c)

**Roubar:** lista densa sem régua e no máximo dois corpos no pixel — o rótulo de
seção ("In Progress") é o mesmo tamanho da linha, só o peso e o cinza mudam.

**Furo aberto** (`veredito-densidade-linear.md`): a dobra do Hoje pinta 7 corpos
(11 / 12 / 13 / 17 / 21 / 22 / 24). Escada com dez nomes em 11–25 px, vizinho
1,04–1,05. Três pesos na mesma cena; 700 no título, no placar e na primária.
Quatro `HoldTick` `bg-fill` + um Thumb = 5 massas (o medidor só conta thumb).
Raid + Scoreboard na primeira dobra, cada um com kicker e alvo. `.sheet` com
ΔL* 0 contra a página. Vitória: Hoje ≤ 5 corpos no pixel; Serie/Feito = 1 corpo
+ numeral no mesmo tamanho; 2 pesos; 1 massa preenchida por cena, inclusive
HoldTick.

---

## 2. oficio-things

**Copiar:** [Things 3 — Creating a new to-do](https://mobbin.com/flows/b1fa3cd6-e51a-4c76-9b52-747df82afefe)

**Roubar:** cabeçalho "Today" / "This Evening" em sentence case, ~44 pt, sem
caixa alta; detalhe e "When?" em cartão 40–70% com pelo menos duas linhas do
contexto ainda legíveis.

**Furo aberto** (`veredito-oficio-things.md`): cinco nomes no mesmo 4 px
(21–25); Feito 25/17 = 1,47. Face 36 pt centrada na linha. Dock com `border-t`
de borda a borda. Uma tinta vermelha para vivo, carimbo, recorde e ofensiva.
Série cumprida é a barra mais clara. Raid + Scoreboard passam de 18% da primeira
dobra e os dois navegam. Thumb full-bleed é o pixel mais claro. `serie` /
`descanso` / `feito` / `como` / `fichaSessao` substituem a cena — Things pede
cartão 40–70%, não rack. Vitória: vizinho 1,10–1,35; 0 régua de ponta a ponta;
Como/Ficha não são cena nova; primária que não seja o ponto mais luminoso.

---

## 3. componentes-stripe

**Copiar:** [Stripe Dashboard — Add a card](https://mobbin.com/screens/e2f6c0b8-bfb7-49e7-ab49-e09e27229cb3)

**Roubar:** um único Continue preenchido; número inválido com três portadores no
culpado (algarismo vermelho + glifo + frase sob o campo); desabilitado guarda o
matiz e só desce o contraste.

**Furo aberto** (`veredito-componentes-stripe.md`): quatro HoldTick `bg-fill` +
Thumb = 5 preenchidos. `Chip live` e `outline` sem fill (2 portadores). `done`
fill 1,82:1 e texto 2,75:1. `.thumb:disabled` 3,30–4,68:1 (faixa 2,2–3,0).
`.quiet:disabled` e `Say` viram cinza. `ready` só desliga o Thumb — zero UI de
erro. Folha a 62% × 100% (orçamento ≤35% × ≤25%). Chip exige fill + 1 palavra +
glifo em 100% dos tons. Vitória: 1 preenchido na captura; todo Chip com 3
portadores; disabled na faixa; erro com 3 portadores sob o culpado.

---

## 4. informacao-flighty

**Copiar:** [Flighty — AA 6260, landing](https://mobbin.com/screens/d2a15492-9519-4965-826f-649edbfc3521)

**Roubar:** 8:31 PM vivo e 8:35 PM riscado na mesma linha; um herói de tempo;
lista trata atraso em duração, detalhe trata em hora — unidades diferentes no
mesmo objeto.

**Furo aberto** (`veredito-informacao-flighty.md`): carga 21 e reps 17 no mesmo
bloco; herói 1,62× o corpo (piso 2,4–2,7×). Lista e detalhe repetem kg. `Roll.was`
só em Progresso; na Série o risco some se `last === session.kg`. Unidade do Stat
a 77% do display. Uma cor cromática, três papéis. Feito é total sem série
nomeada. Descanso herói e subtítulo são o mesmo relativo. Vitória: 100% dos
campos de execução mostram o valor da sessão anterior na mesma linha, à
direita, riscado, 38–48% da altura — inclusive antes do primeiro toque. Um
herói por bloco. Quatro superfícies do mesmo exercício com unidades diferentes.

---

## 5. motion-duolingo

**Copiar:** [Duolingo — Great job! no meio da lição](https://mobbin.com/screens/12e43447-33df-4196-ba31-8c2fc8deabb9)

**Roubar:** a cerimônia sobe no sítio (faixa no fundo da lição viva), um toque,
a festa é o número que mudou — 520 ms no slot, sem navegar para tela nova.

**Furo aberto** (`veredito-motion-duolingo.md`): `patamar = stats.pr`; o seed
nasce PR (62,5 > 60), então o caminho diário é descanso + esforço + Terminar +
festa. Dois toques depois do ato. Feito herói 25/17 = 1,47× (piso 2,5×), sem
`.plate`. MarkStrip 520 ms cobre o Thumb e depois `logSet()` manda ao descanso
— inclusive na última. Os 520 ms do duelo rodam ao abrir a Prova e somem.
`feito` ainda está no RACK. Vitória: última série fecha, publica, Hoje. 0 telas
cheias, 0 toques depois do ato. Patamar só no primeiro cruzar 25/50/75/100.
Duelo: 520 ms por cima do Hoje/Descanso vivo, faixa fica, 0 navega.

---

## 6. objeto-airbnb

**Copiar:** [Airbnb — Photo gallery](https://mobbin.com/flows/3e29c503-c4be-42cb-80f4-c3c7522adb66)

**Roubar:** a foto é o objeto (herói ~40% da primeira dobra, depois tour com uma
cheia e pares de meia); a página do listing é página, não gaveta.

**Furo aberto** (`veredito-objeto-airbnb.md`): compositor em 4 fotos `h-12` — a
foto vira chip de 48 px. Memory: um grupo, quatro aberturas cheias. Beat com 3
linhas sob a foto (teto 1–2). Prova e Pessoa moram na folha de 62%; ObjectHead
come 55–65% da folha. Confirmação da sessão é festa de patamar sem foto. Duo no
Perfil inclui colocação (`3º de N`) — ranking na superfície. Vitória: página do
objeto é a cena. Galeria: um cabeçalho, uma cheia, pares de meia, 1–2 linhas de
grandeza. Recibo = foto + ≥ 3 atributos, zero festa. Card ≤ 4 linhas.

---

## Ordem

Não abrir eixo novo. Deck na Ficha; atributos no Perfil. Depois que a passada em
curso aterrissar, uma tela por eixo, nesta ordem: 5 → 4 → 6 → 1 → 3 → 2.
Primeiro o pedágio do ato (Duolingo), depois o número que mente (Flighty),
depois a foto esmagada (Airbnb), depois a escada e a massa (Linear / Stripe /
Things).
