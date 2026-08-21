# Veredito: objeto (Airbnb)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, DERIVADO) + docs/barra-proto/06-objeto-airbnb.md B1 C1 + docs/barra-proto/passada-4-mobbin.md (Airbnb 3e29c503, card ≤4 linhas)
caminho_artefato: proto-aluno/src/screens/post-card.tsx, proto-aluno/src/screens/social.tsx, proto-aluno/src/screens/perfil.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/ui/photo.tsx, proto-aluno/src/app-root.tsx, proto-aluno/src/lib/seed.ts
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora. O 0 não conta linha de card nem fala no artigo.

Default de derrota (PostCard >4 linhas, página do objeto em folha, Nº/de M no Perfil): o card passa de 4. Dispara.

Afirmação falsificável: o `PostCard` do feed pinta **6 linhas de texto** no artigo, contra o teto B1 / C1 de 4 (cinco já perde). Contagem no primeiro post do seed (`p1`, seed.ts:611–627, 2 falas) como `rede.tsx` monta o card (`post-card.tsx:122–214`):

1. quem + quando (`who` + `metaOf`)
2. marca + grandeza (`mark` + `attr`)
3. legenda (`caption`, `line-clamp-2`)
4. «N tá pago · M falas»
5. fala 1 (`thread[0]`)
6. fala 2 (`thread[1]`)

`thread = post.comments.slice(-2)` ainda mora **dentro** do `<article>` (`post-card.tsx:204–212`). «Falas fora» é falso no arquivo. C1: cinco linhas perde; nenhum acabamento da página compensa o card.

o que o eixo já acerta e não basta:
- app-root.tsx:98–100 — `PAGES` = prova / pessoa / composer / versus; `CARDS` vazio. A página do objeto é a cena, não folha.
- perfil.tsx — `Duo` é semana/dias e clã/sessões. `arenaSpot` / `clanSpot` existem em feed.tsx e **não têm call site**. Zero «Nº de M» no Perfil.
- social.tsx:202–217 + photo.tsx:306–347 — `ObjectHead` com foto 252/300 e título na folha, não no pixel.
- feed.tsx:336–370 — Memory: 1 cheia + 2 meias, teto 3 ≤ 4. Prova: 2 cartões `w-[72%]` + rótulo com o absoluto (`social.tsx:243–265`).

lacuna que impede `empatou` e `venceu`:
- B1 / C1 / passada-4 linha 8: card ≤4. O artigo ainda carrega o fio de falas. Seis linhas no p1.
