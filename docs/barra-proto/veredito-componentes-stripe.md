# Veredito: componentes (Stripe)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/03-componentes-stripe.md
caminho_artefato: proto-aluno/src/ui/kit.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — todos os medidores na linha. `preenchido` (proxy de B1): 0 cenas com mais de 1 `<Thumb>`/`className="thumb"`; o proxy não conta `bg-fill`. `acento` (B13 contagem): pior cena 1. `alvo`: 0 sem altura de dedo. Afirmação: o proto não entrega 1 preenchido por captura, nem Chip com 3 portadores em 100% dos tons, nem desabilitado na faixa B4, nem erro B7, nem diálogo no orçamento B15.

brechas:
- proto-aluno/src/components/bits.tsx:252 — B1: quatro `HoldTick` com `bg-fill` na mesma camada do `<Thumb>` da Série. O medidor só soma thumb + `bg-(ink|stamp)` e passa; a captura tem 5 retângulos cheios. C1 pede 1 preenchido em 100% das capturas.
- proto-aluno/src/ui/kit.tsx:170 — B8: `Chip tone="live"` é só `text-stamp-hi` + ponto. Sem preenchimento. Dois portadores, não três.
- proto-aluno/src/ui/kit.tsx:172 — B8: `Chip tone="outline"` é borda + círculo vazado. Sem preenchimento.
- proto-aluno/src/ui/kit.tsx:171 — B8: `done` tem `bg-fill` (1,82:1 contra `#0a0a0a`, fora de 1,15–1,6:1) e `text-faint` (2,75:1 contra o fill, piso 4,5:1).
- proto-aluno/src/screens/grupos.tsx:74 e proto-aluno/src/screens/post-card.tsx:87 e proto-aluno/src/screens/progresso.tsx:109-112 — B8: “Em guerra”, `duel.mark`, “1 protetor” / “protetor usado” não são 1 palavra. Progresso ainda mete um `Glyph` extra dentro do Chip que já carrega o ponto de `quiet`.
- proto-aluno/src/styles.css:352-360 — B4: `.thumb:disabled` mistura ink no bg (matiz mantida) mas o fill mede 3,30:1 (base) a 4,68:1 (topo do degradê) contra o painel — fora de 2,2–3,0:1. Texto `#0a0a0a` sobre esse fill mede ~3,83:1, fora de 1,8–2,6:1 e abaixo de 4,5:1 do C4.
- proto-aluno/src/styles.css:433 — B4: `.quiet:disabled` vai para `--color-ghost`. Cinza, sem matiz do ativo.
- proto-aluno/src/ui/feed.tsx:281 — B4: `Say` desliga com `disabled:border-line disabled:text-faint`. Outra vez cinza.
- proto-aluno/src/components/bits.tsx:229 — B3: `.quiet` é texto em `--color-mute`, não na cor de acento; saídas (`Voltar`, `Terminar por aqui`, `Treino livre`) sem glifo direcional.
- proto-aluno/src/ui/feed.tsx:268-276 — B5/B6: campo sem rótulo externo, placeholder interno, `py-2.5` abaixo de 44 pt, contador como quarto texto do grupo.
- proto-aluno/src/screens/ficha.tsx:335-342 — B6: `Place` (“Nome”) e placeholder (“Perna pesada”) no mesmo campo. Rótulo interno e externo juntos. Sem ajuda abaixo.
- proto-aluno/src/screens/grupos.tsx:419 — B7: `ready` só desliga o Thumb. Zero dos 3 portadores (borda, glifo, texto sob o culpado). Não existe UI de erro no proto.
- proto-aluno/src/screens/rede.tsx:294 — B10: `border-dashed` fora de modo de edição. Tracejado é só vaga que ainda não existe.
- proto-aluno/src/screens/post-card.tsx:81 — B10: `Card tone="outline"` com `border-edge` em cartão de leitura. Borda não é objeto móvel/removível/selecionável.
- proto-aluno/src/ui/kit.tsx:139 — B12: `Row` com `min-h-[56px]` sobre corpo 17 px → passo 3,3×, fora de 2,4–2,9×.
- proto-aluno/src/styles.css:240-248 — B15: `.sheet` ocupa 100% da largura e 62% da altura (teto 70%). A barra pede ≤35% largura e ≤25% altura, 1 título, ≤2 linhas, 1 preenchido, 1 dispensa. As folhas carregam cenas inteiras.
- proto-aluno/src/ui/board.tsx:213-216 — B11: `Empty` do board ainda aceita `thumb-line`. C1 proíbe segundo preenchido no vazio; a primitiva deixa a porta aberta.
- proto-aluno/src — B16: não existe pílula transitória de 1 linha / ≤6 palavras / 0 controles.

o que venceria:
- 1 preenchido na captura, inclusive o rack: HoldTick sem massa de primária (`bg-fill` não é contorno).
- Todo `Chip` com preenchimento + 1 palavra + glifo; fill 1,15–1,6:1 e texto ≥4,5:1; `live` e `outline` deixam de ser exceção.
- `.thumb:disabled` na faixa 2,2–3,0:1 com texto ≥4,5:1; erro de campo com os 3 portadores sob o culpado; folha no orçamento B15 (não cena inteira a 62%).
