# Veredito: componentes (Stripe)

data: 21 ago 2026 (crítico cego)
julgamento: venceu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026, «O que ainda é falha») + docs/barra-proto/03-componentes-stripe.md B4 B7 C4
caminho_artefato: proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/kit.tsx, proto-aluno/src/components/bits.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. preenchido 0 cenas > 1. faint 5,01 / ghost 3,05 (00 §4: não é falha). edge 1,57. O medidor não conta os 3 portadores no culpado nem o contraste do `.thumb:disabled`.

afirmação: Montar nome inválido pinta comprimento no campo (0 ou 1) + `!` à direita + «Nome curto demais.». Descanso inválido pinta dígito sempre (faixa / last kg / número da série) + `!` + «Marca como foi.». `.thumb:disabled` fill-vs-bg 2,57:1 e text-vs-fill 7,06:1. As três afirmações são verdadeiras no arquivo.

Default de derrota desta rodada (erro inválido com menos de 3 portadores em Montar nome OU Descanso / fill disabled fora 2,2–3,0 / texto no fill < 4,5): não dispara.

## O que o arquivo mostra

- Montar nome — os 3 no culpado. `nameBad = tried && name.trim().length <= 1` (ficha.tsx:408). Input `border-ink` + overlay `absolute inset-0`: `{name.trim().length}` à esquerda, `!` à direita (ficha.tsx:430-440). «Nome curto demais.» no `<p>` imediatamente abaixo do campo (ficha.tsx:442). B7: cor de borda + glifo + texto sob o campo. O comprimento 0 ou 1 é o algarismo.
- Descanso — os 3, e o algarismo não some. `markN` é faixa com dígito, senão `formatKg(last.kg)`, senão `String(session.setIndex)` (descanso.tsx:54-57). Sem faixa e sem last, o número da série ainda pinta. Inválido (`!effort`): grupo `border-ink` + `{markN}` + `!` + «Marca como foi.» (descanso.tsx:103, 119-127). O veredito no disco que dizia «`markN` só entra se faixa ou last» descreve outro pixel.
- `.thumb:disabled` — `color-mix(in oklab, var(--color-ink) 36%, var(--color-bg))` e `color: var(--color-ink)` (styles.css:371-375). ink `#f5f5f5`, bg `#0a0a0a`, mix → `#535353`. Fill/bg = 2,57:1 (B4 2,2–3,0). ink/fill = 7,06:1 (C4 ≥ 4,5). Matiz a≈0 b≈0, mesma da tinta cheia. Altura 54 px inalterada. A cifra 2,38:1 é mix a 34%; o CSS é 36%.
- Chip — 3 portadores no primitivo: fill + palavra + glifo em `quiet` / `live` / `done` / `outline` (kit.tsx:165-179). B8 no componente; não é o teste desta rodada.
- Thumb sem `disabled` no inválido de Montar — verdadeiro. `if (!ready) { setTried(true); return; }` (ficha.tsx:500-502). Descanso: o Thumb recusa no `onPress` (descanso.tsx:137); o Quiet é que leva `disabled`.

## Arbitragem (00 vence)

- faint / ghost com medidor verde: não é falha.
- Cronômetro do Descanso é `t-display text-ink`, não stamp. Stamp no algarismo do erro é portador B7, não contador de caractere como cromo.
- Diálogo Stripe (B15) não se aplica ao rack. Não julguei Linear, Things, Flighty, Motion nem Airbnb.

## Por que venceu

B7 fecha nos dois sítios que o default desta rodada nomeia. C4 fecha no pixel: o Stripe desbota o acento e deixa o texto perto de 2:1; aqui o fill fica em 2,57:1 no painel e o texto no fill mede 7,06:1. Default era perdeu; o arquivo sobrescreve.

Para eu estar errado: Montar `nameBad` teria de omitir o comprimento, ou o `!`, ou «Nome curto demais.»; ou Descanso inválido teria de pintar sem `markN` em algum ramo (sem o `String(session.setIndex)`); ou `.thumb:disabled` teria de sair da faixa 2,2–3,0 no fill ou cair abaixo de 4,5:1 no texto.
