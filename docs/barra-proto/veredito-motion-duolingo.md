# Veredito: motion (Duolingo)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/05-motion-duolingo.md D8 D10 D12 C8 C9; docs/duelo-e-juiz.md §11; docs/ficha-de-atributos.md §7; docs/barra-proto/proxima-passada.md §5
caminho_artefato: proto-aluno/src/screens/feito.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/social.tsx, proto-aluno/src/lib/store.ts, proto-aluno/src/lib/seed.ts, proto-aluno/src/app-root.tsx, proto-aluno/src/ui/kit.tsx, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs cerimonia -v` — 0 fora; `tudo -v` — 0 fora. Proxy mentiroso: `medirCerimonia` conta `overlay:\s*"feito"` (medir.mjs:350-353). `closeSession` escreve `overlay: (patamar ? "feito" : null)` (store.ts:448). O literal não casa. O medidor imprime «overlays pós-sessão: nenhum» e «telas cheias após o ato 0». A primeira sessão do proto abre Feito.

afirmação: a primeira sessão do proto abre overlay `feito` — `frequencia` 90 + 10 = 100 cruza 100; o algarismo da festa é `t-display` 25 px (25/17 = 1,47×) e o da faixa é `t-body` (1,0×); piso D10 / C9 é 2,5× (42,5 px); a faixa do duelo some aos 520 ms.

brechas:
- proto-aluno/src/lib/seed.ts:1225 e proto-aluno/src/lib/store.ts:380-405,448,563-582 — D8 / C8 / D12 / §7: Vitor nasce `frequencia` 90 (seen 25/50/75). `writeBars` soma 10 em toda sessão e grava. `firstPatamar` acha 100. `overlay` vira `"feito"`, `tab` não muda para Hoje enquanto houver overlay. Sem bump de carga, sem PR, a última série do caminho diário ainda cobra 1 tela cheia e 1 toque («É o meu.»). A festa deixou de ser inalcançável e virou o encerramento padrão. D8 pede 0 tela 0 toque depois do ato. O evento raro de §7 é o único fim.
- proto-aluno/src/styles.css:37-47 e proto-aluno/src/screens/feito.tsx:28 e proto-aluno/src/ui/kit.tsx:321 — D10 / C9 / §11.3: corpo 17 px. Feito pinta `t-display` (25 px). 25/17 = 1,47×. MarkStrip pinta `t-body` (17 px). 17/17 = 1,0×. Piso 2,5× = 42,5 px. §11.3 crava 2,8×. O teto da escada é 25 px (`--text-plate` incluso). Nenhum algarismo da cerimônia chega no piso. A correção encolheu a faixa: era título, agora é corpo.
- proto-aluno/src/screens/hoje.tsx:49-54 e proto-aluno/src/screens/descanso.tsx:32-37 — §11.3: «520 ms. Acabou. A faixa fica na tela.» Os dois `useEffect` fazem `setShowMark(false)` aos 520 ms. Depois do timeout o MarkStrip não está no DOM. Conferível: `showMark && faixa` é falso. social.tsx não tem mais o timeout próprio; o furo mora no Hoje e no Descanso, que é onde o duelo julgado pinta.
- proto-aluno/src/app-root.tsx:93-95 — D1 / §11.3: `feito` continua no RACK. A cerimônia substitui a aba. Duolingo sobe a faixa no sítio da lição viva. Aqui a festa é cena nova. `PAGES` está vazio. `vibrate` = 0 em src (§7.3 / D4).

o que o eixo já acerta e não basta:
- `writeBars` agora escreve a conta que a sessão acabou de fechar (carga +3 por PR, frequência +10). `firstPatamar` compara `PATAMAR_STEPS` com essa conta, não com a ficha estática. O gatilho existe.
- Série: MarkStrip cobre o Thumb 520 ms, 0 toque para dispensar, depois `logSet` (serie.tsx:125-145). O número é o kg. Mecânica de D9 no ato.
- Última série não passa por Descanso nem por esforço: `nextCursor === "done"` publica e decide overlay ali (store.ts:563-593).
- Feito tem `.plate`, data no rosto, um só alvo «É o meu.» (§7.3 anatomia). O herói ainda é 25 px.
- Hoje e Descanso passaram a montar a faixa `absolute inset-0` no slot do Thumb, 0 px de empurrão. Cobre. Depois some.
- CSS com 4 durações. Medidores 0. O número não lê o ternário, o tamanho do algarismo nem se a faixa permanece.

o que venceria:
- Sessão que não cruza 25/50/75/100: última série publica e cai no Hoje. 0 tela cheia. 0 toque depois do ato. Seed em que a primeira sessão do proto seja esse caminho — não um 90 que vira 100 por construção.
- Patamar só no primeiro cruzar de 25/50/75/100 da conta recém-escrita. 1 tela, 1 toque, `.plate`, «É o meu.» Algarismo ≥ 2,5× o corpo (42,5 px).
- Faixa de duelo no slot do Thumb, 520 ms de entrada, e fica. 0 navega. Algarismo da faixa no mesmo piso.
- Medidor que leia o ternário, o tamanho e se a faixa permanece depois dos 520 ms.
