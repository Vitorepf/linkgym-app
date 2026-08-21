# Veredito: informação (Flighty)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/04-informacao-flighty.md (ausente no disco; critérios operacionais em docs/barra-proto/proxima-passada.md §4)
caminho_artefato: proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/ui/kit.tsx, proto-aluno/src/styles.css, proto-aluno/src/lib/seed.ts
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. Escada 11 / 13 / 15 / 17 / 21 / 25. Maior salto vizinho 1,24. Nenhum eixo mede herói × corpo, last riscado, nem unidade por superfície.

afirmação: o herói da Série é `t-display` 25 px sobre `t-body` 17 px = 1,47× (piso 2,4–2,7×); kg e reps são dois `t-display` no mesmo bloco; o last riscado é `.strike` 0,42em = 42% do herói onde o Roll envolve (na faixa 38–48%); Hoje, ComoFazer e FichaSessao não riscam.

## O que o arquivo mostra

- Last na Série — verdadeiro. `Roll` pinta `was` se `last != null`, inclusive quando `last === session.kg`. O mesmo para reps. Seed nasce diferente em 100% dos itens da prescrição (60/57, 50/52, 32/30).
- Last na Ficha — verdadeiro no `valueSub`. `was` exige só `last_kg != null`, não desigualdade. O `value` é sets × reps.
- Last no Descanso — verdadeiro no Display: `Roll` de `last.kg` contra `item.last_kg`. Reps vão ao subtítulo sem risco: «N reps nesta série».
- Tamanho do risco — verdadeiro onde o Roll mora dentro do herói. `.strike` é `0,42em` = 42% do `t-display` (25) e do `t-title` (21). Na Ficha o Roll mora em `t-small` (15): o risco é 42% do valueSub, não do número da linha (17).
- Herói 2,4–2,7× — falso. 25/17 = 1,47×. O teto da escada é 25 px (`display` / `hero` / `score` / `plate`). `Display` continua `t-title` 21. Dois `t-display` no mesmo bloco (kg e reps) violam «um herói por bloco».
- Hoje sem kg — verdadeiro na coluna direita: `igual` / `acima` / `abaixo` ou `sets × reps`. É uma palavra, não duração com magnitude. Sem last riscado.
- Feito recibo — `lead` agora é o nome do exercício (`store.ts`). A festa de patamar é o número + unidade, sem série nomeada na linha do herói.

## Brechas

1. Herói 25/17 = 1,47×. Piso da barra: 2,4–2,7×. A escada não tem degrau que chegue.
2. Dois heróis no mesmo bloco da Série (kg e reps, ambos `t-display`).
3. 100% dos campos de execução, inclusive antes do primeiro toque, à direita, riscado — falso. Hoje não risca. ComoFazer imprime `sets × reps · kg` sem antecessor. FichaSessao imprime kg sem last. Descanso risca o kg e deixa as reps sem risco.
4. Quatro superfícies do mesmo exercício não trocam de unidade. Hoje saiu do kg (relativo ou volume). Série, Ficha (`valueSub`), Descanso, Como e FichaSessao repetem kg.
5. `Stat` size lg: unidade em `t-body` (17) sobre `t-display` (25) = 68% do display.

## O que venceria

Um herói por bloco, 2,4–2,7× o corpo. Em 100% dos campos de execução, o valor da sessão anterior na mesma linha, à direita, riscado, 38–48% da altura — inclusive com `last === atual` e antes do primeiro toque. Lista e detalhe em unidades diferentes do mesmo objeto (atraso em duração numa, em hora na outra). Quatro superfícies, quatro unidades. Last riscado e seed diferente já estão onde o Roll envolve — não carregam o eixo.
