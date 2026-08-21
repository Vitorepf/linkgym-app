# Veredito: objeto (Airbnb)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/06-objeto-airbnb.md
caminho_artefato: proto-aluno/src/screens/social.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/ui/photo.tsx
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. Proxy cego para B4/B7/B8/B10. Afirmação do implementador: overlays sociais são folha 62% com tab visível; Memory/compositor com legenda. A folha e a tab estão. A galeria ganhou rótulo e perdeu a foto. A página do objeto nunca é página.

brechas:
- proto-aluno/src/screens/social.tsx:496-513 — B7/B8, galeria sem história: compositor em lista de 4 fotos de largura cheia (teto é 1 abertura cheia por grupo). Cada alvo é `h-12` com `img.aspect-square` dentro. A foto vira faixa de 48 px; a «legenda» (Supino, Box) é categoria, não grandeza. Quatro aberturas cheias, zero grupo, foto esmagada.
- proto-aluno/src/ui/feed.tsx:364-381 — B7: «primeiro / agora» em grade 2 colunas (ok) e depois até 4 `Shot` de largura cheia com kicker repetido «no caminho». Um grupo, quatro aberturas cheias. A barra pede cabeçalho único, uma cheia, pares de meia, teto 4.
- proto-aluno/src/ui/feed.tsx:311-317 — B8: cada Beat carrega 3 linhas sob a foto (kicker + kg + data·caption). Teto é 1–2. O caminho (feed.tsx:374-376) repete o mesmo três.
- proto-aluno/src/app-root.tsx:173-189 e proto-aluno/src/styles.css:240-254 — B4: Prova e Pessoa moram na folha de 62%. `ObjectHead` com foto 252/300 px (photo.tsx:335) come 55–65% da folha, fora de 32–45% da primeira dobra. O objeto do Airbnb *é* a página. Aqui é gaveta. Título na folha interna (`-mt-5` = 20 pt) acerta a sobreposição e perde o quadro.
- proto-aluno/src/screens/social.tsx:259-276 — B15: falas em lista, duas linhas, «N falas no total» em prosa. Sem segundo cartão cortado 20–50%, sem botão de contorno com o absoluto no rótulo.
- proto-aluno/src/screens/feito.tsx:23-33 e proto-aluno/src/lib/store.ts:349-372 — B28: a confirmação da sessão, quando dispara, é festa de patamar (número + trilha + «É o meu.»), sem foto do objeto, sem 3 atributos verificáveis. Recibo Airbnb repete o objeto; este some com ele. Sem PR não há recibo nenhum — some o objeto nas três aparições.
- proto-aluno/src/screens/post-card.tsx:125-176 — B1: quem + meta, marca + attr, caption `line-clamp-2`, tá pago. Cinco linhas quando há legenda. Teto 4. Foto quadrada com pílula é o card mais perto de B2/B3 e não carrega o eixo.
- proto-aluno/src/screens/perfil.tsx:114-117 e proto-aluno/src/screens/social.tsx:350-353 — B5/C5: `Duo` são 2 números, e um deles é colocação (`3º de N`). C5 aceita dois se forem prova do objeto. Colocação é ranking, e o produto a proíbe na superfície.

o que o eixo já acerta e não basta:
- `Sheet` 62%, véu 0%, TabBar sempre montada (shell.tsx:84-90, app-root.tsx:191). Overlay social não some mais com a aba. Era a falha B10/B15 do veredito anterior.
- `ObjectBar` (kit.tsx:286-311): valor + garantia à esquerda, botão `!w-[38%]` (28–42%), `min-h-[76px]` (72–88). Anatomia B10 no rodapé. Some 520 ms quando a Prova pisca MarkStrip (social.tsx:288-294).
- Memory deixou de ser tira muda: há «primeiro / agora» e kg. História curta, gabarito de galeria ainda errado.
- `ObjectHead` + degradê 120 px + teto de 3 sobreposições (B3) continua de pé — dentro da gaveta errada.

o que venceria:
- Toda foto de galeria com um cabeçalho de grupo, uma abertura de largura cheia, pares de meia, 1–2 linhas de grandeza fora da imagem. Memory e compositor no mesmo teto. Zero `h-12` em cima de `aspect-square`.
- Página do objeto é a cena, não a folha de 62%: foto 32–45% da primeira dobra, ObjectBar e TabBar no lugar, zero Thumb de largura cheia.
- Confirmação é recibo do mesmo objeto (foto + ≥ 3 atributos), zero festa. Card do feed ≤ 4 linhas. Prova social: um cartão, um corte, total no botão.
