# Veredito: objeto (Airbnb)

data: 21 ago 2026 (crítico cego, rodada 7 — nunca implementou; não julgou r3–r6)
julgamento: empatou
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026) + docs/barra-proto/06-objeto-airbnb.md B1 B15 C1 C5 C15 C19 + docs/barra-proto/passada-4-mobbin.md (Airbnb 3e29c503, card ≤4 linhas, linha 8)
caminho_artefato: proto-aluno/src/screens/post-card.tsx, proto-aluno/src/screens/social.tsx, proto-aluno/src/lib/seed.ts, proto-aluno/src/ui/feed.tsx, proto-aluno/src/app-root.tsx
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora. O 0 não conta linha de card, corte de depoimento nem grandeza inventada.

Default de derrota (comments/thread de volta no card / p1 com mais de 3 linhas / peek do 2º depoimento fora de 20–50%): **não dispara**.

Afirmação falsificável: o `PostCard` do p1 pinta **3 linhas de texto** no `<article>` e **zero** `comments` / `thread` / «falas» dentro dele — teto B1, superar C1, e o default «se voltaram comments/thread, perde» é falso. `post-card.tsx:122–195` monta o p1 (`seed.ts:612–633`) assim: (1) quem+marca+grandeza+data numa só fileira (`t-body` 17 + `t-small` 15); (2) caption em `line-clamp-1`; (3) «N tá pago». Zero `proof.comments`, zero `slice` de falas, zero `thread` no article. O comentário do arquivo diz «Falas moram na Prova, não no card». `DuelOnPost` (`post-card.tsx:157`, `seed.ts:913` `d1.postId === "p1"`) é cartão de ação, não linha de listing — B1/C1 não o contam. C15 ainda pinta dois (`social.tsx:253` `comments.slice(0, 2)`), segundo `w-[88%]` numa fila `overflow-hidden` `gap-3`: numa caixa de 353 pt (393 − 40 de `px-5`), sobra 111,6 pt; 111,6 / 310,6 = **36%**, dentro de 20–50% (B15). Superar C15 (= um depoimento) não: ainda são dois.

## O que o arquivo mostra

- B1 card ≤4 linhas — verdadeiro. Três no p1. Cinco já perderia. Comments/thread **não** voltaram ao card.
- C1 três linhas — verdadeiro no p1. Nota+data na linha do título; caption; preço (tá pago) sozinho. O ganho que 06 C1 nomeia fecha.
- Tipo 17+15 no article — verdadeiro (`t-body` / `t-small`). Sem `t-display` / `t-micro` no listing.
- C5 dois números na primeira dobra da Prova — verdadeiro. `social.tsx:213–220`: `Duo` com `attrs[0]` e `attrs[1]` quando há dois; senão Tá pago + falas. Terceiro número só depois da dobra (`rest`).
- C15 / B15 peek 20–50% — B15 verdadeiro (~36%). C15 falso. Ainda dois cartões.
- C19 atributos da Prova — `attrsOf` (`feed.tsx:51–56`) só empurra item com número. Zero substantivo nu na lista da Prova.
- Memory / `magnitudeOf` — sujo. `feed.tsx:27–35` cai em `pagos` / `cheers` / `"1"` quando o ato não tem kg/min/sets/volume com dígito. C19 pede grandeza medida sem inventar número.
- Página do objeto é a cena — verdadeiro. `PAGES` = prova / pessoa / composer (`app-root.tsx:98`). Título na folha, não no pixel da foto.

## Arbitragem (00 vence)

- Rack full-bleed: o 00 manda. Things B20 / cartão 40–70% não julgam este eixo.
- Folha social (Stripe) não é a página do objeto. `prova` / `pessoa` são `PAGES`.
- Herói 2,4–2,7× e 84 px: não é medida deste eixo.
- Dobra Hoje 25/11: não está neste eixo; o Hoje desta rodada é 17/15.

## Brechas nomeadas

- C15 ainda pinta dois depoimentos (`slice(0, 2)`); superar pede um com o segundo só no corte.
- `magnitudeOf` ainda inventa `"1"` / `pagos` / `cheers` quando o registro não tem carga.

## Por que empatou (não venceu, não perdeu)

Pack linha 8 pedia card ≤4 e página = cena. Os dois fecham. C1 fecha: três linhas, zero falas no card — o default «se voltaram comments/thread, perde» é falso no arquivo. B15 cai na faixa. C15 continua no teto (dois, não um). C19 da Memory continua sujo. C5 (dois números) já estava. Isso é o teto do objeto com o C1 ganho, não ficar acima no eixo inteiro. Empate.
