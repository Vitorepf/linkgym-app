# Veredito: motion (Duolingo)

data: 21 ago 2026 (crítico cego, rodada 6)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 3, «O que ainda é falha») + docs/duelo-e-juiz.md §11.0 §11.5 + docs/ficha-de-atributos.md §7.1 §7.2 + docs/barra-proto/05-motion-duolingo.md D8 D9 D12 C8 C12 + docs/barra-proto/passada-4-mobbin.md (Duolingo 12e43447, faixa 22–30%, linha 7)
caminho_artefato: proto-aluno/src/lib/store.ts, proto-aluno/src/screens/serie.tsx, proto-aluno/src/app-root.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/lib/tap.ts, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora; telas cheias após o ato = 0; festa de patamar no Feito = sim. O 0 do `cerimonia` lê o ternário `overlay: (patamar ? "feito" : null)` e não lê se `feito` é cena ou cartão, nem se a faixa fica.

Default de derrota (overlay `"descanso"` no ato): não dispara. `logSet` do meio grava `overlay: "serie"` (`store.ts:635`). Nenhuma escrita `overlay: "descanso"` no store.

Afirmação falsificável: a festa ocasional (patamar) **não é tela cheia**. `closeSession` ainda devolve `overlay: (patamar ? "feito" : null)` (`store.ts:476`). `feito` saiu do `RACK` e mora em `CARDS` (`app-root.tsx:94–96`). Com `overlayTrail: []` no fechamento (`store.ts:613`), `rackUnder` devolve `null`, o Hoje fica atrás e o Feito sobe em `.sheet-card` — `height: 55%`, teto `70%` (`styles.css:258–269`). D12 / C12 / §7.2 / 00 arb. 3 pedem cena (tela cheia / rack). 55% é cartão. Pack linha 7 «0 tela cheia» vale para o recibo diário, não para o patamar. Isso perde.

## O que o arquivo mostra

- Overlay do meio = `"serie"` — verdadeiro. `logSet` quando `nextCursor !== "done"`: `overlay: "serie"` (`store.ts:628–636`). Não é `"descanso"`. A árvore da Série fica montada. `restLeft` arma o descanso **dentro** da Série (`serie.tsx:48–49, 140`).
- Última → Hoje — verdadeiro no `tab`. `store.ts:607–625`: `tab: "hoje"`, `session: null`, `overlay: closed.overlay`. Sem patamar, overlay `null`. Com patamar, overlay `"feito"` sobre o Hoje, não rack.
- Patamar só cartão — verdadeiro no pixel, e é a falha. `CARDS` tem `feito`. `.sheet-card` 55% (48–70%). 00 arb. 3: o rack (`serie` / `descanso` / `feito` / `como` / `fichaSessao`) **é** a cena, full-bleed. §7.1: a ficha toma a vaga em tela cheia. D12: ocasional «sempre em tela cheia». Cartão 55% não é isso.
- D9 / pack linha 7 «520 ms e fica» no meio — verdadeiro a meia. `armStrip` + `MarkStrip` `cover` 26% (`styles.css:289–309`, `app-root.tsx:178`). Sem `setShowMark(false)`. O ramo do meio **não** zera `strip`. A faixa cobre o Thumb, `pointer-events: none`, 0 px de empurrão.
- D9 na última — falso. `serie.tsx:156`: `window.setTimeout(() => logSet(), 520)`. O timeout **navega** no ramo `done`: `strip: null` (`store.ts:624`), Série desmonta. Pack linha 7 pede última → Hoje (isso fecha). «Fica» na lição viva, na última, não: a faixa some no mesmo `set` que troca a cena.
- D8 / C8 recibo diário — verdadeiro. Sem patamar, `overlay: null`, 0 tela, 0 toque. `cerimonia -v` = 0. O 0 não vê o cartão do patamar.
- D4 vocabulário — verdadeiro no disco. `tap.ts:2–8`: `light` 12 / `confirm` 32 / `feast` 56. `logSet` → `confirm` (`store.ts:589`). `feito.tsx:16` → `feast` no toque de sair, não no mount (§7.3 pede abertura).
- C4 / D4 «0 vibração em navegação» — falso. Todo `Thumb` vibra `light` (`bits.tsx:214`), inclusive «Voltar» / «Voltar ao rack» / «Voltar à série» (`serie.tsx:32, 198, 236`).
- D12 vaga uma vez — verdadeiro na regra. `firstPatamar` + `patamarSeen`. Falso na forma: a única festa sobe cartão, não tela.

## Arbitragem (00 vence)

- Rack full-bleed: o 00 manda. `feito` no `CARDS` perde para arb. 3.
- Recibo diário com `overlay: "feito"` sem patamar: não dispara. O ternário segura.
- Festa 2,5× / `t-plate` 84: 00 arb. 1 vence. `feito.tsx` 25/17 = 1,47 ≤ 2,3.
- Things B20 cartão 40–70% não julga o rack. Não desculpa o patamar.

## Por que perdeu (não empatou, não venceu)

C8 do diário fecha (0 tela). D9 do meio fecha (faixa 26% sobre a Série viva, overlay `"serie"`). Isso não sobe o eixo: a única festa que D12 / §7 / 00 autorizam é tela cheia, e o arquivo entrega um `.sheet-card` de 55%. «Diferente, mas ok» é perdeu. O 0 do `cerimonia` não lê a altura do Feito.
