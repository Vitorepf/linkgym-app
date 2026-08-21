# Veredito: componentes (Stripe)

data: 21 ago 2026 (crítico cego, rodada 5)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 3, 4, 5) + docs/barra-proto/03-componentes-stripe.md B1 B4 B7 B8 B15 + docs/barra-proto/passada-4-mobbin.md (Stripe Add a card e2f6c0b8 + linhas 4–5 das oito)
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/ficha.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. preenchido 0 cenas > 1. faint 5,01 / ghost 3,05 (00 §4: não é falha). edge 1,57. Nenhum eixo do medidor conta os 3 portadores no culpado nem o Thumb desligado por formulário vazio.

afirmação: Montar e Oferecer não carregam os 3 portadores no culpado (algarismo + `!` + frase sob o campo). O Thumb nasce `disabled={!ready}` e `disabled={!pick || !obj}`. Add a card (e2f6c0b8) e a linha 4 da passada 4 pedem o contrário: 1 Continue preenchido com o inválido à vista, e os 3 no campo, em Montar / Oferecer / Descanso.

## O que o arquivo mostra

- 1 preenchido por cena — verdadeiro no medidor. HoldTick é `border-edge bg-transparent` (bits.tsx:251). C1 o medidor já conta.
- Chip 3 portadores — verdadeiro no primitivo. `quiet` / `live` / `done` / `outline` levam fill + palavra + glifo (kit.tsx:165-179). raised/bg 1,42; line/bg 1,28; surface/bg 1,16 (B8 1,15–1,60). mute sobre line 4,50. Call sites: perfil, progresso, grupos, social, post-card.
- Folha social 35% × 25% — verdadeiro. `styles.css` crava width/max-width 35% e height/max-height 25%. `.sheet-card` 48–70% existe e não tem dono: `CARDS` está vazio (app-root.tsx:99).
- Rack full-bleed — verdadeiro, e não é falha Stripe. `RACK` = serie / descanso / feito / como / fichaSessao (app-root.tsx:98). 00 arb. 3: o diálogo Stripe não se aplica ao rack.
- Disabled 2,2–3,0 — verdadeiro neste arquivo. `.thumb:disabled` é `color-mix(in oklab, ink 34%, bg)` contra `#0a0a0a`. Mix oklab → `#4e4e4e`. Fill sobre bg = 2,38:1. Texto `color: bg` sobre o fill = 2,38:1. Ativo (ink 82%) 11,35:1. Matiz a=0 b=0. 03 B4 pede fill 2,2–3,0 e texto 1,8–2,6 contra o fill. Os dois entram. C4 (texto ≥ 4,5:1 no desbotado) não. `.quiet:disabled` é ink 26% = 1,82:1 — não é o preenchido.
- Thumb da Série sem `disabled` por kg≤0 — verdadeiro. `empty` só recusa no `onPress` (serie.tsx:127-131). O botão permanece preenchido com o campo inválido à vista. Este recorte fecha.
- Erro 3 portadores em Montar / Oferecer / Descanso / Série kg — falso nos dois nomeados que a passada aponta primeiro.
  - Montar: zero JSX de erro. Nome e corpo ficam `border-edge text-ink` (ficha.tsx:419-438). `ready` só desliga o Thumb (ficha.tsx:406, 466). Nenhum algarismo, nenhum `!`, nenhuma frase.
  - Oferecer: zero JSX de erro. A lista não pinta culpado. Thumb `disabled={!pick || !obj}` (ficha.tsx:514-516). O rótulo vira «Escolha alguém» no próprio botão — o portador saiu do campo e foi para o Continue apagado.
  - Descanso: frase com `<span className="text-stamp">0</span>` + `!` + «Marca como foi.» (descanso.tsx:129-134). O `0` não é valor do culpado — o grupo é Fácil / No ponto / Difícil, sem algarismo. A borda no grupo existe. O Thumb não desliga.
  - Série kg≤0: `border-2` + linha com `{kg}` em stamp + `!` + «Carga sem peso.» (serie.tsx:89-99). Os 3 tokens estão na frase. O `Roll` do campo continua ink. Escrever (não é o pack) pinta o comprimento + `!` + frase (ficha.tsx:352-357) e não desliga o Thumb.

## Arbitragem (00 vence)

- Como / FichaSessao no rack full-bleed: não é diálogo Stripe. Folha social ≤35% × ≤25% é o que B15 cobra.
- faint / ghost com medidor verde: não é falha.
- stamp: `Stamp` / `StampHold` são o ato. Cronômetro do Descanso é `t-display text-ink`. Barra do Feito é `bg-fill`. Não é acento Stripe.
- Disabled 2,38:1 medido: não é o furo desta rodada.

## Brecha que impede venceu

ficha.tsx:466 e ficha.tsx:514-516 — Montar e Oferecer desligam o Continue e não pintam algarismo + `!` + frase no culpado. Pack linha 4 / 03 B7 / Add a card: 1 preenchido na captura com o inválido à vista, 3 portadores no campo. Chip, 1 preenchido, folha social e o disabled do Thumb já estão no número; o eixo não vence com dois dos três nomeados ainda no padrão «desliga o botão».
