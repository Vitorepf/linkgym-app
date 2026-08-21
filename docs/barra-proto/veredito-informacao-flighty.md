# Veredito: informação (Flighty)

data: 21 ago 2026 (crítico cego, rodada 5)
julgamento: venceu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 1, 2, 5) + docs/barra-proto/04-informacao-flighty.md B1 B2 B4 C1 C4 + docs/barra-proto/passada-4-mobbin.md (Flighty AA 6260 d2a15492 + linha 6 das oito)
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/ui/kit.tsx, proto-aluno/src/styles.css, proto-aluno/src/lib/seed.ts, proto-aluno/src/app-root.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. Escada 11 / 13 / 15 / 17 / 21 / 25. Maior salto vizinho 1,24. Extremos 25/11 = 2,27. Dobra do Hoje: corpos nomeados 17, razão 17/17 = 1,00 ≤ 1,40. Nenhum eixo mede last riscado nem herói por bloco.

afirmação: 100% dos campos de execução mostram o valor da sessão anterior na mesma linha, à direita, riscado, a 42% da altura do herói, inclusive antes do primeiro toque. Na Série o kg é `t-display` 25 e as reps são `t-body` 17 — 1 herói no bloco. Lista e detalhe do mesmo objeto saem em unidades diferentes.

## O que o arquivo mostra

- Last na mesma linha, à direita, riscado, 42% — verdadeiro. `.strike` é `font-size: 0.42em` (styles.css:273-277), dentro de 38–48. `Roll` põe o `was` depois do valor, `items-baseline` (kit.tsx:231-247). Série kg e reps passam `was` mesmo quando `last` é null (cai no valor atual) — o risco nasce antes do toque (serie.tsx:91-105). Descanso: kg em `t-display` com `was`; reps em `t-body` com `was` (descanso.tsx:76-82). Como e FichaSessao riscados no kg; Como também nas reps. Ficha Folha risca `sets × last_reps`. Feito-patamar risca o numeral. Seed nasce diferente em 100% dos itens do catálogo (60/57, 50/52, 32/30, 80/75, 120/125, 10/8).
- Série kg `t-display` 25 e reps `t-body` 17 — verdadeiro no arquivo, não no resumo. `--text-display: 25px` e `--text-body: 17px` (styles.css:42-44). serie.tsx:91-92 envolve o `Roll` do kg em `t-display`; serie.tsx:104-105 envolve o das reps em `t-body`. Razão 25/17 = 1,47. 04 B1 pede 2,4–2,7×; 00 §1 e «O que isto deixa de ser falha» tiram essa razão do tapete numa cena densa. C1 (1 herói só na Série, o número que o dedo muda) fecha: kg sobe, reps descem.
- 1 herói por bloco — verdadeiro nos blocos de execução. Série: 1 `t-display` (kg), reps no corpo. Descanso e Como: 1 `t-display` no kg, reps em `t-body`. O cronômetro do Descanso é outro bloco (`t-display text-ink`, descanso.tsx:102) — 00 arb. 5: não é stamp, é o tempo do descanso. Não compete com o kg do mesmo bloco.
- Lista e detalhe em unidades diferentes — verdadeiro. Hoje linha: `N × N` (t-small) e, com last, a palavra igual/acima/abaixo (hoje.tsx:99-116). Ficha Folha: `N × N`. Série / Como / FichaSessao / Descanso: kg (e reps à parte). 04 B2: o herói da linha e o do detalhe do mesmo objeto têm unidades diferentes.
- Dobra do Hoje ≤ 1,40 — verdadeiro. Corpos nomeados na dobra: 17. Razão 1,00. 00 arb. 2: Things 2,0–2,3× não vale nesta dobra.
- Rack full-bleed — verdadeiro, e não é falha deste eixo. `RACK` = serie / descanso / feito / como / fichaSessao (app-root.tsx:98). 00 arb. 3: o rack É a cena.
- Feito patamar dois degraus — verdadeiro. `t-body` 17 + `t-display` 25 (feito.tsx:28-34). 25/17 = 1,47 ≤ 2,3. Zero t-micro / t-kicker no prato.

## Arbitragem (00 vence)

- Herói Flighty 2,4–2,7× ausente (aqui 1,47×) em Hoje / Série / lista: não é falha de tamanho. A escada travada sem 84 é o teto.
- Extremos 2,0–2,3× na dobra do Hoje: não se aplica. Lá vale Linear ≤ 1,40. 17/17 = 1,00.
- stamp no cronômetro / colocação / barra: o `left` do Descanso é ink; a barra do Feito é `bg-fill`. Não é falha de stamp.
- Rack full-bleed: o 00 manda; não é falha Flighty.

## Onde o Flighty ainda é teto (não vira derrota)

- Hoje com last pinta «igual» / «acima» / «abaixo» sem o kg absoluto ao lado (hoje.tsx:101-116). 04 B5 pede o desvio em palavra *sob* o absoluto. C5 é empate provável; o recorte não desfaz C4: C4 mede campo de execução, e o Hoje é lista.
- C2 (herói distinto nas 4 superfícies) não fecha: Ficha e Hoje podem repetir `N × N`.

## Por que venceu

C4 é o ganho que o documento chama de maior do eixo: no Flighty o fantasma é exceção; aqui o antecessor é padrão em 100% dos campos de execução, na mesma linha, à direita, 42%, antes do toque. B2 fecha. C1 fecha no arquivo: Série tem 1 herói (`t-display` 25 no kg) e reps no corpo 17. O 00 tira do tapete a razão 2,4×. Medidor verde. Isso é ficar acima, não empatar.
