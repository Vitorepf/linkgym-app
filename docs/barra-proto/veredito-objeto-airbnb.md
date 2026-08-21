# Veredito: objeto (Airbnb)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/06-objeto-airbnb.md B4 B7 B8 B15 B28 B5/C5; docs/barra-proto/proxima-passada.md §6
caminho_artefato: proto-aluno/src/screens/social.tsx, proto-aluno/src/ui/feed.tsx, proto-aluno/src/ui/photo.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/screens/perfil.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/app-root.tsx, proto-aluno/src/styles.css, proto-aluno/src/lib/store.ts
medidor: sem eixo próprio. `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. Proxy cego para B4/B7/B8/B28. Afirmação do implementador, lida no arquivo: compositor 1 cheia + 2 meias; Memory «agora» + grade; Prova mantém ObjectBar. As três são verdade. Nenhuma faz a página do objeto ser a cena.

afirmação: `PAGES` é `new Set()`; Prova, Pessoa e Composer caem em `.sheet` de 35% × 25%; Memory pinta 1 cheia + até 4 meias (teto 5); Perfil ainda imprime colocação (`Nº` / `de M`).

brechas:
- proto-aluno/src/app-root.tsx:93-95,148-149 e proto-aluno/src/styles.css:240-254 — B4: o objeto do Airbnb *é* a página. `PAGES` está vazio. Prova, Pessoa e Composer não estão no RACK nem em CARDS: `isSheet` é verdadeiro. `.sheet` agora é cartão centrado `width: 35%; height: 25%` (antes gaveta de 40%; agora menor nos dois eixos). Numa cena de ~844 px a folha tem ~211 px de alto. `ObjectHead` pede foto 252/300 px (photo.tsx:335). 300/211 > 100% da folha. Fora de 32–45% da primeira dobra. Título na folha interna acerta «nunca sobre a foto» e perde o quadro.
- proto-aluno/src/ui/feed.tsx:360-370 — B7: Memory tem cabeçalho e uma cheia («agora»). `rest` pega até 4 meias. 1 + 4 = 5 fotos num grupo. Teto é 4, com no máximo uma abertura cheia.
- proto-aluno/src/screens/social.tsx:414-421,479-501 — B7/B8: compositor abre 1 cheia (`PICKS[0]`) + `filter ≠ escolhida .slice(0, 2)` em grade 2×2. Três imagens, dentro do teto. Legenda é categoria (Supino, Agachamento, Box), não grandeza. A foto escolhida é quadrado cheio com a mesma palavra. «Foto objeto» é o estado selecionado dentro de um cartão de 25% de alto — a gramática cabe e o objeto não.
- proto-aluno/src/ui/feed.tsx:309-315 — B8: Beat carrega 2 linhas sob a foto (kicker + kg). No teto 1–2. Cumpre o teto e não carrega o eixo: a grandeza está, o gabarito estoura no `rest`.
- proto-aluno/src/screens/social.tsx:243-260 — B15: falas em lista, duas linhas, «N falas no total» em prosa. Sem segundo cartão cortado 20–50%, sem botão de contorno com o absoluto no rótulo.
- proto-aluno/src/screens/feito.tsx:25-48 e proto-aluno/src/lib/store.ts:448,563-582 — B28: a primeira sessão do proto abre Feito em modo patamar (número no `.plate`, sem foto). O ramo recibo (foto + 2 linhas) fica morto. Hoje, se a festa deixar passar, pinta `Shot` + séries + min + lead (hoje.tsx:75-82) — foto + 3 atributos no sítio certo, depois de um pedágio que a barra do objeto recusa. Recibo Airbnb é o mesmo objeto nas três aparições; aqui a confirmação da sessão ou é festa ou some atrás dela.
- proto-aluno/src/screens/perfil.tsx:257-258 — B5/C5: Duo do Perfil (linha 112-115) agora é semana/clã. A colocação mudou de sítio, não saiu da superfície: `value={\`${pos.pos}º\`}` e `valueSub={\`de ${pos.of}\`}`. Ranking na lista de clãs.

o que o eixo já acerta e não basta:
- ObjectBar na Prova permanece no rodapé (social.tsx:272). Anatomia B10 (38% / min-h 76). Não esconde o ObjectBar.
- Memory deixou o par de duas meias iguais. Há uma cheia «agora» e pares embaixo. História curta, teto ainda 5.
- Compositor: uma cheia + duas meias, não cinco de abertura. A grade ao lado ainda é categoria.
- `ObjectHead` + degradê + teto de 3 sobreposições (B3) continua de pé — dentro do cartão de 25%.
- TabBar sempre montada (app-root.tsx:194). Overlay social não some com a aba.
- Pessoa Duo (social.tsx:327-330) é dias da semana e sessões do clã, sem colocação.

o que venceria:
- Página do objeto é a cena, não o cartão de 35% × 25%: foto 32–45% da primeira dobra, ObjectBar e TabBar no lugar. `PAGES` inclui prova, pessoa e composer.
- Toda galeria: um cabeçalho, uma cheia, pares de meia, teto 4, 1–2 linhas de grandeza fora da imagem. Memory e compositor no mesmo teto. Zero grupo com 5 fotos.
- Confirmação é recibo do mesmo objeto (foto + ≥ 3 atributos), zero festa. Card do feed ≤ 4 linhas. Prova social: um cartão, um corte, total no botão. Duo sem colocação em nenhum bloco da superfície.
