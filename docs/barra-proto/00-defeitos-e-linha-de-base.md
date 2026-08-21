# Proto do aluno: defeitos e linha de base

Escopo: `proto-aluno/`. Só a conta do aluno. Nada de painel do personal.

**Croma quente no escuro é falha.** Superfície é carbono (H=0). `.plate` é face
plana e fio frio. Degradê que mistura tinta clara na face vira lodo — o júri
recusa, não sugere ajuste.

Medidor: `cd proto-aluno && node tools/medir.mjs tudo`. Um eixo por vez com
`node tools/medir.mjs escala`, `contraste`, `cor`, `primitiva`, `alvo`,
`movimento`.

As barras 01–06 foram restauradas em 21 ago 2026 a partir dos escritos
originais dos batedores (o disco as tinha perdido; sem 06 o eixo Airbnb
nasce `na_barra: false`). Elas descrevem a referência. Quando duas barras
brigam, vence a **Arbitragem** abaixo — não o veredito anterior, não o
implementador.

---

## Arbitragem — 21 ago 2026 (DERIVADO)

Quando duas barras se contradizem, este teto vence. O júri seguinte lê 00
antes de 01–06. Marca: DERIVADO — ninguém decidiu; o loop decidiu.

1. **Escada de tipo / tamanho do herói.** Things + a escada travada no CSS
   vencem. Sem 84 px. O herói Flighty «2,4–2,7× o corpo» e a festa Duolingo
   «2,5×» NÃO são condição de falha numa cena densa. A cena de resultado
   (feito em modo patamar, só ela) pode usar no máximo DOIS degraus: corpo +
   um numeral, razão ≤ 2,3× nessa cena (ex.: 17 e ~21–25). Não acrescente
   degrau no CSS que faça o medidor `escala` vizinho > 1,70 ou avulso > 0.

2. **Primeira dobra do Hoje.** A razão da dobra Linear vence: máximo visível /
   mínimo visível ≤ 1,40 (já 17/13). Things «extremos da dobra 2,0–2,3×» vale
   só na cena de resultado do patamar, não no Hoje.

3. **Rack.** O rack (`serie` / `descanso` / `feito` / `como` / `fichaSessao`)
   É a cena: full-bleed. Things B20 e o diálogo miúdo do Stripe não se
   aplicam ao rack. Sobreposições sociais são a folha (≤ 35% × ≤ 25% se já
   estiver assim).

4. **faint / ghost.** Os pisos do medidor vencem (faint ≥ 4,5, ghost ≥ 3,0).
   As faixas mais estreitas do Linear B3 não são falha se `medir` estiver
   verde.

5. **stamp.** Um job: o ato do carimbo / testemunha ao vivo. Não é cronômetro
   no zero, não é colocação, não é barra.

---

## O que isto deixa de ser falha

O júri seguinte não pode reprovar o proto nestes pontos se o medidor estiver
verde e a arbitragem acima for obedecida:

- Herói Flighty 2,4–2,7× e festa Duolingo 2,5× ausentes numa cena densa
  (Hoje, Série, lista). A escada travada (11 / 13 / 15 / 17 / 21 / 25, sem
  84) é o teto.
- Extremos Things 2,0–2,3× na primeira dobra do Hoje. Lá vale Linear ≤ 1,40.
- Rack full-bleed (Things B20 cartão 40–70%, Stripe diálogo ≤ 35% × ≤ 25%).
  A folha social é que carrega o orçamento de cartão.
- faint / ghost fora das faixas estreitas do Linear B3, desde que faint ≥ 4,5
  e ghost ≥ 3,0 no medidor.
- stamp usado só no ato / testemunha. Cronômetro no zero, colocação e barra
  pintados de vermelho deixam de ser «acento Stripe» e passam a ser job
  errado — isso ainda é falha (ver abaixo).

## O que ainda é falha

- Medidor `tudo` com qualquer eixo fora (escala vizinho > 1,70, avulso > 0,
  faint < 4,5, ghost < 3,0, cena > 5 degraus nomeados, etc.).
- Feito em modo patamar com mais de dois degraus no pixel, ou numeral > 2,3×
  o corpo daquela cena.
- Primeira dobra do Hoje com razão visível > 1,40 (chrome incluso).
- Como / Ficha da sessão como folha ou cartão em vez de rack full-bleed.
- stamp em cronômetro no zero, colocação, barra, contador de caractere ou
  estado vazio.
- Recibo diário cobrando pedágio de tela (`overlay: "feito"` sem patamar).
- Hoje cumprido sem foto + lead do lastProof.
- Deck sumido, academia / unidade / armário / chão na superfície, RPG fora
  do Perfil, clã fechado, uma escada só, duelo sem juiz.
- Explore / chat / world rank.

---

## Linha de base medida

Confirmado 21 ago 2026: `cd proto-aluno && npx tsc --noEmit && node tools/medir.mjs tudo -v` → 0 fora. A catraca do gate do app (fora do proto) é outra história.

| eixo | o que pergunta | alvo |
| --- | --- | --- |
| contraste | ink/mute/faint ≥ 4,5; ghost ≥ 3,0; line ≤ 2,2 | 0 fora |
| escala | 8–11 degraus, 0 avulso, vizinho ≤ 1,70 | 0 fora |
| cor | 0 hex cru fora de `styles.css` | 0 |
| primitiva | faixa à mão ≤ 4; adoção ≥ 90% | 0 fora |
| alvo | 0 botão sem 44 pt | 0 |
| movimento | 0 tela morta; 4 durações | 0 fora |
| tipos | 0 cena > 5 degraus nomeados | 0 |
| régua | 0 cena > 4 | 0 |
| preenchido | 0 cena > 1 thumb/`bg-ink`/`bg-stamp` | 0 |
| acento | 0 cena > 4 stamp | 0 |
| cerimônia | pedágio diário 0 tela 0 toque; patamar 1 tela 1 toque | 0 fora |

## Orçamento por cena

Os medidores de cima olham o repo. Estes olham **cena por cena**. Uma cena é
um componente exportado.

| medidor | de onde vem | alvo |
| --- | --- | --- |
| `tipos` | Linear B1, teto Things | nenhuma acima de 5 |
| `regua` | Linear B4 | no máximo 4 |
| `preenchido` | Stripe B1 | no máximo 1 por cena |
| `acento` | Stripe B13 + arbitragem 5 | no máximo 4, e só no job do stamp |

## Arbitragens de fundação (ainda valem onde 21 ago não fala)

1. Linear B1 «no máximo 2 tamanhos» não transfere ao celular. Teto de
   **contagem**: 5 degraus nomeados por cena. Teto de **pixel na dobra do
   Hoje**: arbitragem 2.
2. Escala no toque só no botão preenchido; linha de lista sem scale.
3. Vermelho não é botão. Primária é tinta cheia. Vermelho é stamp — e stamp
   tem um job (arbitragem 5).

## Produto travado

Aluno só. Sem academia, unidade, armário, chão. Tá pago. RPG (Carga / Motor /
Fundo / Frequência) no Perfil. Clã aberto. Duas escadas. Duelo com juiz.
Deck = pilha nomeada de fichas, mora na Ficha.

Caminho diário: última série publica, Hoje pinta recibo (foto + lead), zero
tela Feito. Patamar (primeiro cruzar 25 / 50 / 75 / 100 da conta que a
sessão acabou de escrever) abre Feito com «É o meu.» Seed: Frequência 90;
fechar uma sessão soma 10 e cruza 100.
