# Veredito: motion (Duolingo)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, DERIVADO) + docs/barra-proto/05-motion-duolingo.md D9 D12 + docs/barra-proto/passada-4-mobbin.md (Duolingo 12e43447, faixa 22–30%, «520 ms e fica»)
caminho_artefato: proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/styles.css, proto-aluno/src/lib/store.ts, proto-aluno/src/ui/kit.tsx, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora; lê o ternário `overlay: (patamar ? "feito" : null)` e devolve «telas cheias = 0». O 0 não lê altura da faixa nem se ela permanece na lição.

Default de derrota (festa diária em tela cheia, patamar sem cruzar, faixa que some no ato): a faixa some. Dispara.

Afirmação falsificável: a faixa de veredito da série **não fica** sobre a lição viva. Em `serie.tsx:139–140` o toque faz `setMark` e, 520 ms depois, `logSet()`. `store.ts:581–629`: se ainda há série, `overlay: "descanso"`; se era a última, `closeSession` e o overlay vira `"feito"` ou `null`. Nos dois ramos a árvore da Série desmonta. A lição (kg, reps, HoldTick) deixa de existir atrás da faixa. O `MarkStrip` do Descanso (`descanso.tsx:167`) é outra cena — o relógio de 220 px, não o exercício. D9 / pack: sem trocar de tela, 22–30% da altura, **fica**, lição viva atrás. O CSS `height: 26%` + `position: absolute` (styles.css:289–309) cobre o Thumb e não empurra; isso não salva o navegar.

o que o eixo já acerta e não basta:
- styles.css:289–309 — `.mark-strip-cover` 26% do palco, `bottom: 0`, `pointer-events: none`. 0 px de empurrão enquanto a Série ainda está montada.
- store.ts:448–473 — `overlay: (patamar ? "feito" : null)`. Recibo diário sem cruzar não abre Feito. Frequência seed 20; `writeBars` +10 → 30; `firstPatamar` devolve 25 no primeiro fechar. D12 / §7.1: patamar só no cruzar.
- app-root.tsx:98–100 — `CARDS` vazio; Série / Descanso / Feito são rack.

lacuna que impede `empatou` e `venceu`:
- D9 + passada-4 linha 7: 520 ms e **fica** na lição. O arquivo ainda faz o que a r4 nomeou: some no `logSet`.
