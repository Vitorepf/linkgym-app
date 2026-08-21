# Veredito: componentes (Stripe)

data: 21 ago 2026 (crítico cego, rodada 7)
julgamento: venceu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 3, 4, 5) + docs/barra-proto/03-componentes-stripe.md B1 B4 B7 B15 C4 + docs/barra-proto/passada-4-mobbin.md (Stripe Add a card e2f6c0b8 + linhas 4–5 das oito)
caminho_artefato: proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. preenchido 0 cenas > 1. faint 5,01 / ghost 3,05 (00 §4: não é falha). edge 1,57. O medidor não conta os 3 portadores no culpado nem o `disabled` do Thumb.

afirmação: Em Montar, `nameBad` pinta os 3 do pack no culpado: `{name.trim().length}` e `!` no campo, «Nome curto demais.» sob o campo. O Thumb de Montar não leva `disabled`.

## O que o arquivo mostra

- Montar Nome — os 3. Overlay `absolute inset-0` no campo: `{name.trim().length}` à esquerda, `!` à direita, ambos `text-stamp` (ficha.tsx:435-440). Frase «Nome curto demais.» no `<p>` imediatamente abaixo, fora do wrapper (ficha.tsx:442). Pack linha 4 e e2f6c0b8: algarismo + `!` no campo, frase sob o campo. A afirmação «os 3 no campo» é falsa na frase: a frase não mora no input; mora onde a barra manda.
- Thumb sem `disabled` no inválido das nomeadas — verdadeiro. Montar: `if (!ready) { setTried(true); return; }` (ficha.tsx:500-502), zero prop. Escrever: idem (ficha.tsx:385-387). Oferecer: idem (ficha.tsx:569-571). Série: `if (armed.current || empty) return` (serie.tsx:147). Descanso: o Thumb recusa no `onPress` (descanso.tsx:139); o Quiet é que leva `disabled`. e2f6c0b8: Continue continua preenchido com campo inválido. Não é furo.
- 1 preenchido por cena — verdadeiro no medidor.
- Série kg≤0 — `{kg}` stamp + `!` + «Carga sem peso.» (serie.tsx:104-112).
- Oferecer — `{pick ? 1 : 0}` + `!` + «Escolha alguém.» na nota sob a lista (ficha.tsx:553-559).
- Descanso — `{markN}` só entra se `faixa` ou `last`; senão `!` + «Marca como foi.» (descanso.tsx:54-59, 121-128). Residual. O teste desta rodada era Montar Nome.

## Arbitragem (00 vence)

- Folha social ≤35% × ≤25% é o que B15 cobra. O diálogo Stripe não se aplica ao rack.
- faint / ghost com medidor verde: não é falha.

## Por que venceu

A r6 perdeu no algarismo ausente de Montar Nome. O arquivo agora pinta os 3. Default desta rodada era perdeu; o JSX sobrescreve. Thumb sem `disabled` casa com a captura, não contra.

Para eu estar errado: Montar `nameBad` teria de omitir `{name.trim().length}`, ou omitir `!`, ou omitir «Nome curto demais.».
