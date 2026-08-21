# Veredito: objeto (Airbnb)

data: 21 ago 2026 (crítico cego, rodada 6)
julgamento: empatou
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 3) + docs/duelo-e-juiz.md §11 + docs/ficha-de-atributos.md §7 + docs/barra-proto/06-objeto-airbnb.md B1 B15 C1 C5 C15 C19 + docs/barra-proto/passada-4-mobbin.md (Airbnb 3e29c503, card ≤4 linhas, linha 8)
caminho_artefato: proto-aluno/src/screens/post-card.tsx, proto-aluno/src/screens/social.tsx, proto-aluno/src/screens/perfil.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/ui/photo.tsx, proto-aluno/src/app-root.tsx, proto-aluno/src/lib/seed.ts
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora. O 0 não conta linha de card, corte de depoimento nem grandeza sob foto.

Default de derrota (p1 pinta 5+ linhas de texto via `thread` / `comments.slice` / «falas» no `<article>`): não dispara. `post-card.tsx` tem ZERO `thread`, ZERO `comments.slice`, ZERO «falas».

Afirmação falsificável: o `PostCard` do feed pinta **no máximo 4 linhas de texto** no artigo — o teto B1 / pack linha 8. O p1 (`seed.ts:611–627`) monta quem+quando, marca+grandeza, caption, «N tá pago». C1 (três linhas com a mesma informação) não fecha: o p1 ainda usa as quatro. Duo na Prova entrega 2 números (C5). O segundo depoimento está em `w-[88%]` depois de um `w-[65%]` (`social.tsx:253–259`) — o corte visível cai na faixa B15 de 20–50%. C15 superar (= um depoimento) não: `slice(0, 2)` ainda pinta dois. B1 fecha; C1 e C15 não. Empate no teto do card, sem superar.

## O que o arquivo mostra

- B1 card ≤4 linhas — verdadeiro. Contagem no p1 como `post-card.tsx:121–200` monta o `<article>`:
  1. quem + quando (`who` + `metaOf`, mesma linha)
  2. marca + grandeza (`mark` + `attr`, mesma linha)
  3. legenda (`caption`, `line-clamp-1`)
  4. «N tá pago»
  `thread` / `comments.slice` / «falas» **não** moram no `<article>`. Cinco linhas de texto já perderia (C1 / default). Quatro é o teto. `DuelOnPost` (`post-card.tsx:163`, `d1.postId === "p1"`) é cartão de ação, não linha de texto do listing — B1 não o conta. «Te pego» é botão na mesma fileira do tá pago.
- C1 três linhas — falso no p1. A caption ainda ocupa linha própria. Superar pedia nota+data na linha do título e preço sozinho; aqui quem+quando já compartilham, e ainda sobram marca, caption e tá pago.
- C5 dois números na primeira dobra da página — verdadeiro. `social.tsx:213–220`: `Duo` com `attrs[0]` e `attrs[1]` quando `attrs.length >= 2`; senão Tá pago + falas. Faixa única. Terceiro número só depois da dobra (`rest`, `social.tsx:226–230`). 06 C5: dois no lugar de três.
- C15 / B15 peek 20–50% — B15 verdadeiro no número; C15 falso. `social.tsx:251–266`: primeiro `w-[65%]`, segundo `w-[88%] shrink-0`, fila `overflow-hidden`. O segundo espiando existe; o corte visível é ~32–36% da largura do container (sobra após 65% + `gap-3`), dentro de 20–50%. O botão traz o absoluto (`{n} falas`). C15 superar (= um depoimento) não: `slice(0, 2)` ainda pinta dois.
- Memory grandeza — verdadeiro como rótulo, sujo como C19. `Memory` (`feed.tsx:329–385`): 1 cheia (`Beat`) + até 2 meias, teto 3 ≤ 4. Toda foto visível imprime `magnitudeOf`. `magnitudeOf` (`feed.tsx:27–35`) cai em `pagos` / `cheers` / `"1"` quando não há kg/min/sets/volume com dígito. C19 pede grandeza medida sem inventar número onde o ato não tem.
- C19 atributos da Prova — verdadeiro por construção. `attrsOf` (`feed.tsx:51–56`) só empurra item com número (sets / kg / min). Zero substantivo nu na lista.
- Página do objeto é a cena — verdadeiro. `PAGES` = prova / pessoa / composer (`app-root.tsx:96`). `ObjectHead` com foto e título na folha, não no pixel (`social.tsx:202–217`). 00 arb. 3: rack é a cena; a página do objeto também é cena, não folha.
- RACK — `RACK` = serie / descanso (`app-root.tsx:94`). `feito` / `como` / `fichaSessao` foram para `CARDS`. Default «RACK vazio» não é falha deste eixo. 00 arb. 3 sobre feito é job do eixo motion, não do card.

## Arbitragem (00 vence)

- Rack full-bleed: o 00 manda. Things B20 / cartão 40–70% não julgam serie / descanso.
- Folha social (Stripe) não é a página do objeto. `prova` / `pessoa` são `PAGES`.
- Herói 2,4–2,7× e 84 px: não é medida deste eixo.

## Por que empatou (não venceu, não perdeu)

Pack linha 8 pedia card ≤4 e página = cena. Os dois fecham. O default 5+ (thread / falas no article) é falso no arquivo. C5 (dois números) é o ganho que 06 C-final nomeia, e está no arquivo. B15 agora cai na faixa. C1 ainda pede 3 linhas no p1; C15 ainda pede um depoimento; Memory ainda rotula foto sem carga com Tá pago. Isso é o teto do card, não ficar acima. Empate.
