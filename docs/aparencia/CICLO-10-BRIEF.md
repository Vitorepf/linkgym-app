# CICLO 10 — o arsenal

A meta do dono, na palavra dele:

> "focar em perfil, mais especificamente em **aparencia do APP**... sempre tendo **juizes de
> qualidade, simplicidade e inovaçao** na experiencia, buscando ao maximo a experiencia mais
> **agradavel, prazerosa, surpreendente e simples**... **sem ter que rolar de mais a tela**,
> oferecer uma **variedade enorme e de verdade**, todas absurdamente de altissimo nivel de
> **qualidade, acabamento, empacotamento, fluidez**... oferecer uma variedade enorme de
> **elementos de desing diferentes, tipos de desing, materias de desing**. e uma
> **personalizaçao absurda e enorme**... tem pessoas que preferem mais **minimalista, flat,
> moderno**... literalmente um **arsenal de variedade de elite**, absurdo, e de uma
> qualidade impecavel, **basicamente feito a mão**."

## O que isto pede que o ciclo 9 não deu

O ciclo 9 entregou ALAVANCAS: 27 cores, 6 vozes tipográficas, 6 materiais, 3 tamanhos de
botão — 8.817.984 combinações fechadas, todas medidas. O que ele está pedindo agora é outra
coisa: **LINGUAGENS DE DESIGN INTEIRAS**. "Minimalista", "flat" e "moderno" não são valores
de uma alavanca; são posições coerentes que decidem várias alavancas de uma vez e trazem
regras próprias de acabamento.

Hoje existem seis kits (Ferro, Clínica, Boutique, Vitrine, Garagem, Sereno) e cada um é só
o documento de 14 campos já preenchido. Isso é um atalho, não uma linguagem.

## A regra que decide tudo neste ciclo

**Variedade de verdade.** Se duas opções chegam parecidas na tela, são uma opção com dois
nomes — e vender as duas é o defeito que ele já pegou uma vez (quatro dos quinze pares de
voz eram idênticos nos três canais). Toda opção nova nasce com o par que prova que ela se
separa das outras, ou não nasce.

**Acabamento é medido, não afirmado.** "Feito à mão" não é uma palavra no commit: é o
alinhamento óptico, o degrau que não colide, a entrelinha que cabe o acento, o alvo que o
dedo alcança, a transição que não pisca.

## O estado de agora (medido, não estimado)

- `tools/aparencia.mjs` — **458.239 pares, 0 reprovam**, sobre 490 paletas × 6 vozes × 9 geometrias
- `tools/botao.mjs` — **432 combinações, 0 reprovam**, a mais alta 62pt
- `tools/shots.mjs` — **52 telas × 20 marcas = 1040 montagens**, todas montam
- `tools/taps.mjs` — 3 fluxos fim a fim; a série do aluno custa **2 toques**
- editor: índice de 10 portas + 10 folhas `formSheet` (era 6.333pt de rolagem numa página)
- documento `Aparencia`: 15 campos, **8.817.984** combinações fechadas + cor livre + chão livre

## Catracas (13 eixos, nenhum pode piorar)

- `soltos` = **0**: nenhum literal hex fora de `src/theme.ts`. Conta texto cru, comentário incluído.
- `escala` = **1**: o orçamento EFETIVO é 1, não 2 (`.gate/medidas/escala.json` grava
  `melhor: 1`). **Zero literais novos de `fontSize:`.** Tamanho novo sai de `TYPE`, no tema.
- `contraste` = 0 · `culpa` = 0 · `proibidas` = 0 · `toques_serie` = 2
- Traço delimitador é sempre `divider` ou `ink` (SPEC §3); `aresta` é material.
- **Nenhuma dependência nova.** SDK 54, sem bump. Já em disco e subusados: `expo-blur`,
  `react-native-svg` (LinearGradient, RadialGradient, Pattern, Mask, ClipPath — mas
  **NÃO FeTurbulence**, que existe só na web: os diretórios nativos trazem sete primitivos
  de filtro e nenhum de ruído, então um material de textura seria fotografado lindo pelo
  Chrome do medidor e renderizaria nada no aparelho), Reanimated 4,
  Gesture Handler, 84 faces de `@expo-google-fonts` das quais o app carrega 14.

Arquivos travados: `.gate/*`, `tools/gate.mjs`, `tools/medir.mjs`, `tools/shots.mjs`,
`tools/taps.mjs`, `tools/contrast.mjs`, `tools/palavras.mjs`, `tools/brands.mjs`,
`tools/carga.mjs`, `tools/cobertura.mjs`, `tools/fila.mjs`, `tools/toques.mjs`,
`.claude/hooks/stop-gate.mjs`.

## A fila que já existe e não deve ser reinventada

`docs/erros/FILA.md` — 17 defeitos verificados ainda abertos.
`docs/aparencia/CICLO-9.md` e `CICLO-9-MATERIAL.md` — o que acabou de ser feito e por quê.
`docs/aparencia/SPEC.md` §9 e §10.3 — o que já foi recusado, com o motivo.

---

# Rodada 2 — os juízes, e o que eles acharam

Painel de três juízes cegos um ao outro, mais um sintetizador que **verificou cada
afirmação no código antes de repassar**. Notas: **qualidade 6, simplicidade 5, inovação 5.**

## Os quatro achados em que os três coincidiram sem se falarem

Coincidência entre juízes cegos é o sinal mais forte que existe aqui, e os quatro se
confirmaram na leitura do código.

1. **A lista de cartões encolhia debaixo do dedo.** O pior defeito que embarquei nesta
   rodada. `cartoes` tinha nove itens quando o documento não batia com linguagem nenhuma e
   oito quando batia — então o PRIMEIRO arrasto gravava Ferro, a condição virava, o array
   encolhia, e o deslocamento continuava apontando para a ficha errada. A tela mostrava
   Moderno, a régua acendia FERRO, o documento salvo era Ferro, e "Do seu jeito" sumia
   levando junto todo ajuste feito à mão. **Lista de tamanho variável debaixo de um
   deslocamento em pixels é sempre isso.**
2. **A folha "Estilos prontos" era a mesma sala com duas portas** — os mesmos oito kits,
   sem prévia, exatamente o que O Palco existe para substituir.
3. **A régua nunca rolava até a escolhida**: da sexta linguagem em diante ela ficava fora de
   vista e a fila mostrava só fichas apagadas.
4. **"Ajustar" estava fantasiada de nona linguagem** — mesmo estilo das oito, dentro da
   mesma rolagem. Navegação vestida de rádio.

## A contradição, e o lado escolhido

**Inovação queria A PAREDE** — oito telefones vivos numa grade, o quadro que vai no grupo do
WhatsApp. **Simplicidade queria o contrário**: a cor da marca, que é a tarefa número um do
personal, sair de trás da nona ficha e virar a primeira coisa da régua.

**Ficou com Simplicidade, e a parede é NÃO.** A parede é peça de marketing, não tela de
trabalho; os três juízes disseram que a porta está QUEBRADA, nenhum disse que está chata; e
o brief deste ciclo diz que acabamento é medido, não afirmado — a parede afirma o arsenal,
os consertos o medem. Do lado da inovação ficou o que era barato e deixa a própria catraca
mais esperta: **o eixo `linguagem` nas fixtures**, que transforma "28 pares, 0 reprovam" de
número em oito fotografias que a catraca guarda.

## O que NÃO sobreviveu à checagem

- **Refutado:** "buraco branco no arrasto rápido". O ScrollView é `pagingEnabled`, que avança
  uma página por gesto, e a janela de três aguenta. O buraco era real e a causa era outra —
  o deslocamento de MONTAGEM, não o gesto. O conserto proposto não consertava nada.
- **Corrigido pela metade:** "sete das oito abrem vazia". O defeito é real e é o pior da
  rodada, mas a conta é outra: Ferro abria certo, **Moderno abria mostrando o app do
  Ferro** — pior que vazio, porque mente — e as outras seis num retângulo liso.
- **Plausível, não verificável:** a cena Ficha talvez não caiba num aparelho pequeno. Não há
  captura de SE; o risco é real (`Cena.tsx` não tem rolagem nenhuma) e o número é estimativa.

## A armadilha que nenhum dos três viu

`telas` é uma catraca de "maior é melhor". Apagar a folha "Estilos" derrubaria de 57 para
56 e reprovaria. **Ela só pôde ser apagada no mesmo lote que acrescentou as oito fixturas de
linguagem.**
