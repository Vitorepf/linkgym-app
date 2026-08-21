# Veredito: motion (Duolingo)

data: 21 ago 2026 (crítico cego, rodada 7 — nunca implementou; não julgou r3–r6)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, «O que ainda é falha», cerimônia 0/1) + docs/barra-proto/05-motion-duolingo.md D4 D8 D9 D12 C4 C8 C12 + docs/barra-proto/passada-4-mobbin.md (Duolingo 12e43447, faixa 22–30%, linha 7) + docs/duelo-e-juiz.md §11.0 §11.3 + docs/ficha-de-atributos.md §7.2
caminho_artefato: proto-aluno/src/screens/serie.tsx, proto-aluno/src/lib/store.ts, proto-aluno/src/app-root.tsx, proto-aluno/src/lib/tap.ts, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `cerimonia -v` — 0 fora; telas cheias após o ato = 0; preenchidos no Feito = 1; festa de patamar = sim. O 0 do `cerimonia` lê o ternário `overlay: (patamar ? "feito" : null)` (`store.ts:476`). Não lê se a faixa pinta no sítio nem se `tickRest` / `skipRest` a apagam.

Default de derrota (faixa some aos 520 ms / háptico em «Voltar» / dobra Hoje 25/11 / `overlay: "feito"` sem patamar / patamar >2 degraus ou numeral >2,3×): o default **dispara** na última confirmação e no avanço do descanso. Os outros quatro não.

Afirmação falsificável: a cobertura D9 **não** é 100% das confirmações de série, e a faixa **não** fica depois do descanso. `serie.tsx:149–151` no ramo `done` chama `logSet()` direto, **sem** `armStrip`, **sem** `setTimeout`. `logSet` no done (`store.ts:595–625`) omite `strip`, fecha a sessão, `tab: "hoje"`, `session: null`, `overlay: closed.overlay`. A última série **nunca arma** a faixa: 0 ms de 26% sobre a série viva. No meio, `armStrip` + `setTimeout(..., 520)` + `logSet` (`serie.tsx:159–160`, `store.ts:627–635`) grava `overlay: "serie"` e omite `strip` — o estado sobrevive aos 520 ms. `skipRest` e `tickRest` ao avançar cravam `strip: null` (`store.ts:646, 666`). Pack linha 7 pede «520 ms e **fica**». Fica até o descanso acabar ou ser pulado; não fica. `MarkStrip` cover só monta se `strip && (rackId || overlay === "feito")` (`app-root.tsx:180`). `RACK` neste disco contém `serie` (`app-root.tsx:96`), então o meio **pinta** 26% (`styles.css:289–309`) enquanto `strip` vive. A última confirmação não pinta. D9: «Cobertura: 100% das confirmações de série». Falso.

## O que o arquivo mostra

- Ramo done — verdadeiro o que afirmam: `logSet()` direto, sem `armStrip`, sem zerar `strip` no `set`. Também verdadeiro: sem `armStrip` não há faixa para ficar. A última série navega. Pack linha 7 «última série publica e cai no Hoje» fecha C8/D8. D9 na última não fecha.
- Ramo do meio — overlay `"serie"`, estado `strip` sobrevive ao `logSet`. Com `RACK` contendo `serie`, `rackId` é `"serie"` e o cover 26% monta. `pointer-events: none`, 0 px de empurrão. D9 do meio pinta. `tickRest` / `skipRest` zerando `strip` é o default de derrota desta rodada: a faixa some no avanço, não nos 520 ms.
- C8 / D8 / C12 diário — verdadeiro. Sem patamar, `overlay: null`. `cerimonia -v` = 0. 00 «Recibo diário cobrando pedágio» não dispara.
- D4 / C4 — verdadeiro. `tap.ts` `light` 12 / `confirm` 32 / `feast` 56. `vibrate` só em `givePago` (`light`), `logSet` (`confirm`), «É o meu.» (`feast`). `Thumb` mudo. «Voltar» / abas mudos. O default «háptico em navegação» é falso.
- D12 / §7.2 patamar — verdadeiro na conta (1 overlay, 1 thumb). `feito` está em `RACK` neste disco. `feito.tsx` usa `t-body` 17 + `t-display` 25 (1,47 ≤ 2,3). Dois degraus nomeados. `feast` no toque de sair, não no mount.
- Dobra do Hoje — 17/15 = 1,13 ≤ 1,40. 25/11 não está na dobra. Default falso.
- D10 / `t-plate` 84 — 00 arb. 1 vence. Não é falha.

## Arbitragem (00 vence)

- Cerimônia diária: 0 tela, 0 toque. O medidor está verde.
- Feito patamar: dois degraus, numeral ≤ 2,3×. Fecha.
- Dobra do Hoje: Linear ≤ 1,40. Fecha.
- Rack full-bleed: 00 arb. 3 manda. `serie` em `RACK` neste disco obedece. Não é o eixo.
- Festa 2,5× ausente: 00 arb. 1. Não é falha.

## Brechas nomeadas

- Última confirmação sem `armStrip`: 0 faixa no sítio (D9 100%).
- `tickRest` / `skipRest` cravam `strip: null` no avanço. «520 ms e fica» não sobrevive ao descanso.
- `feast` no thumb de sair, não na abertura.

## Por que perdeu (não empatou, não venceu)

Default PERDEU. C8 fecha (0/0 no diário). D4 fecha. O meio pinta 26% e o `logSet` do meio não zera `strip` — o defeito r6 do `setTimeout` 520 que zerava no mesmo `set` **não** está no `logSet`. O que resta é a cobertura: a última série, a que o pack nomeia, sai sem faixa; e a faixa do meio morre no `strip: null` do descanso. D9 pede 100% das confirmações sobre conteúdo vivo, 0 toque para dispensar, e o pack pede «fica». «Diferente, mas ok» (C8 no lugar de D9 na última) é `perdeu`.
