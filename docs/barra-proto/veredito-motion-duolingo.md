# Veredito: motion (Duolingo)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, DERIVADO) + docs/barra-proto/05-motion-duolingo.md D8 D9 D12 C8 C9 + docs/duelo-e-juiz.md §11 + docs/ficha-de-atributos.md §7
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/lib/store.ts, proto-aluno/src/lib/seed.ts, proto-aluno/src/ui/kit.tsx
medidor: `cd proto-aluno && node tools/medir.mjs cerimonia -v` — 0 fora; `tudo -v` — 0 fora. Proxy cego: `medirCerimonia` conta o ternário `overlay: (patamar ? "feito" : null)` e devolve «telas cheias = 0». O proxy não lê se o Feito é tela cheia ou cartão. O código, não o proxy, é a prova.

Não é falha (00 vence 05): festa 2,5× / D10 / C9 ausente em cena densa; Folha social 35% × 25% (`.sheet`); faint / ghost com medidor verde. §11.0 0 toques no veredito (MarkStrip, `pointer-events-none`) — o 00 não cobra o 2,8× de §11.3 numa cena densa.

Afirmação falsificável: a festa de patamar não é tela cheia. `RACK` está vazio; `feito` / `serie` / `descanso` / `como` / `fichaSessao` estão em `CARDS` e montam `.sheet.sheet-card` — altura 55%, teto 70%, Hoje continua a `LiveScene` por baixo. D12 e `docs/ficha-de-atributos.md` §7.2 exigem a festa em tela cheia. 00 arb. 3: o rack É a cena, full-bleed; «Como / Ficha da sessão como folha ou cartão» continua na lista do que ainda é falha. O comentário em styles.css:238 jura full-bleed; o seletor em app-root.tsx:98–99 contradiz.

brechas que o 00 fecha e o que o 00 ainda mata:
- proto-aluno/src/app-root.tsx:98–100 + proto-aluno/src/styles.css:258–268 + proto-aluno/src/components/shell.tsx:95–96 — D12 / §7.2 / 00 arb. 3: `RACK = ∅`. `CARDS` leva os cinco. `Sheet tall` pinta `sheet-card` (55% / 48–70%). A rodada anterior leu Feito no rack full-bleed. O arquivo agora não.
- proto-aluno/src/lib/seed.ts:1225 + proto-aluno/src/lib/store.ts:355–361,404–408 — 00 produto travado: «Seed: Frequência 90; fechar uma sessão soma 10 e cruza 100». Frequência nasce 14. `+10` → 24. `firstPatamar` não acha degrau. A primeira sessão não abre Feito. A segunda (24+10=34) cruzaria 25. Não é «patamar morto»: o ternário e o modo existem. É o seed do 00 que não está.

o que o eixo já acerta e não basta:
- Cerimônia do 00 no orçamento: pedágio diário 0 overlay; `closeSession` só escreve `overlay: "feito"` com `firstPatamar` (store.ts:448–473). Recibo diário no Hoje: `Shot` + `lead` (hoje.tsx:61–67). Um `.thumb` «É o meu.» (feito.tsx:51–53).
- §11.0 / §11.5: o duelo não gasta a vaga. Veredito é `MarkStrip` sobre conteúdo vivo, 0 navegação, 0 toque. Faixas do seed cabem em 6 palavras com número (`Sua melhor. 5 kg acima.`).
- D9 no ato: Série cobre o Thumb 520 ms e depois `logSet` (serie.tsx:125–143).
- §7 anatomia quando abre: `.plate`, data no rosto, um alvo, numeral `t-display` 25 / corpo 17 = 1,47× ≤ 2,3×. CSS com 4 durações. `vibrate` = 0 em src. Medidores 0.

o que venceria:
- Os cinco do rack de volta a full-bleed (00 arb. 3) e a festa de §7 / D12 em tela cheia — uma, no máximo, por sessão.
- Seed do 00 (Frequência 90 + 10 = 100) ou outro cruzamento no primeiro fechar, para a vaga de §7.1 não ficar no cartão nem no segundo dia.
- Para `venceu` no 05 inteiro ainda faltam D4 (exatamente 3 intensidades, zero hoje) e D13 (próximo alvo por subtração — Hoje ainda satura lista, raid e placar).
