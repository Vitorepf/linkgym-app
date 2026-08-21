# Veredito: objeto (Airbnb)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/06-objeto-airbnb.md B1 B4 B7 B8 B15 B28 + docs/barra-proto/passada-4-mobbin.md § Airbnb (gallery + listing) + linha 8 + docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, DERIVADO)
caminho_artefato: proto-aluno/src/screens/post-card.tsx, proto-aluno/src/screens/social.tsx, proto-aluno/src/screens/versus.tsx, proto-aluno/src/screens/perfil.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/ui/photo.tsx, proto-aluno/src/app-root.tsx, proto-aluno/src/lib/store.ts, proto-aluno/src/styles.css
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. O 0 não lê linhas de card, grupo de foto nem corte de depoimento.

Afirmação falsificável: o card do objeto no feed (`PostCard`, post-card.tsx:127-217) pinta, no seed `p1`, seis linhas de texto — quem+quando (132-138), marca+grandeza (154-163), legenda (165-167), «N tá pago · M falas» (171-181), e duas falas (209-217). B1 e a linha 8 da passada pedem no máximo 4. A galeria da Memory cabe no teto B7 (1 cheia + até 2 meias, feed.tsx:336, 360-371). Isso não salva o card.

Não é falha (00 + furos nomeados da rodada 3 que este artefato fechou):
- Página do objeto é a cena. `PAGES` = prova / pessoa / composer / versus (app-root.tsx:100). LiveScene troca a tab; não é `.sheet` 35×25.
- Foto da Prova/Pessoa: `ObjectHead` `tall` → 300 px (photo.tsx:335). 300/844 = 35,5%, dentro de B4 32–45%. Título na folha (`Sheet` −mt-5 = 20 px, photo.tsx:206, 339), degradê de 120 px, 0 texto de conteúdo sobre a foto.
- Galeria Memory: 1 cabeçalho + 1 cheia + pares de meia, teto 3 ≤ 4. Composer: 1 cheia + 2 meias, legendas com grandeza (`60 kg · 4 × 8`, social.tsx:420-426, 488-507).
- Prova B15: dois cartões `w-[72%]` em fila com overflow (social.tsx:246-262) — o segundo corta na faixa 20–50% — e botão de contorno com o absoluto (`N falas`, 263-265).
- Recibo diário: `Shot` + séries + min + lead (hoje.tsx:61-67). 0 festa no caminho sem patamar (`overlay: null`, store.ts:473).
- Perfil Duo é semana / clã (perfil.tsx:111-114). 0 `Nº` / `de M` na superfície. Ranking na superfície seria falha; não há.
- Versus é objeto-cena, não gaveta: está em `PAGES`, foto+vs no miolo (versus.tsx:151-163), `ObjectBar` no rodapé. Não é `.sheet`.

brechas:
- proto-aluno/src/screens/post-card.tsx:127-217 — B1 / pack linha 8: o card do listing. Quem, marca, legenda, tá pago, duas falas. Seis linhas no `p1`. Teto 4. Nenhum acabamento da página fecha o card do feed.
- proto-aluno/src/ui/feed.tsx:367 — B8 nas meias da Memory: `markOf(p)` devolve `title` (`A · Superior`, `Bum bum guloso`, seed.ts:615, 638). Uma linha, fora da imagem, e é nome de ficha — não grandeza. O Beat ao lado carrega kg. O grupo não.
- proto-aluno/src/screens/versus.tsx:65, 142-163 — B4 neste objeto: os dois retratos são 124 px (124/844 = 14,7%). O herói tipográfico é `duel.mark` em `t-display`. Pack listing: herói = a foto ~40% da dobra. Versus é cena; a foto não é a dobra.

o que o eixo já acerta e não basta:
- Os três furos da rodada 3 (Memory 5 fotos, compositor sem grandeza, falas em `Row` sem corte) fecharam de forma. A página deixou de ser folha.
- Recibo, Perfil sem colocação, Versus como página — de pé.
- Duo de dois indicadores (C5). Não tira o B1.

lacuna maior:
- O card do feed com mais de 4 linhas. É o primeiro critério do eixo e o último da linha 8 da passada. Sem ele o listing da referência não empata.
