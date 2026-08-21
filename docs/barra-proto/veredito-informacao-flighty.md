# Veredito: informação (Flighty)

data: 21 ago 2026 (crítico cego, rodada 7)
julgamento: venceu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 1, 2, 5) + docs/barra-proto/04-informacao-flighty.md B1 B2 B4 C1 C4 + docs/barra-proto/passada-4-mobbin.md (Flighty AA 6260 d2a15492 + linha 6 das oito)
caminho_artefato: proto-aluno/src/screens/serie.tsx, proto-aluno/src/ui/kit.tsx, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. Escada 11 / 13 / 15 / 17 / 21 / 25. Maior salto vizinho 1,24. Extremos 25/11 = 2,27. Nenhum eixo mede last riscado nem herói por bloco.

afirmação: `serie.tsx` ainda tem kg em `t-display` 25, reps em `t-body`, e `Roll was` a 42% da altura do herói (dentro de 38–48%). Não desfizeram.

## O que o arquivo mostra

- Série kg `t-display` 25 — verdadeiro. `--text-display: 25px` (styles.css:44). serie.tsx:104 envolve o `Roll` do kg em `t-display`.
- Série reps `t-body` — verdadeiro. `--text-body: 17px` (styles.css:42). serie.tsx:116 envolve o `Roll` das reps em `t-body`. 1 herói no bloco. C1.
- `Roll was` 38–48% — verdadeiro. `.strike` é `font-size: 0.42em` (styles.css:273-277). `Roll` põe `was` depois do valor, `items-baseline` (kit.tsx:231-247). Série kg: `was={last != null ? formatKg(last) : kg}` (serie.tsx:105). Série reps: `was={lastReps != null ? lastReps : session.reps}` (serie.tsx:117). O risco nasce antes do toque.

## Arbitragem (00 vence)

- Herói Flighty 2,4–2,7× ausente (aqui 25/17 = 1,47×): não é falha de tamanho. A escada travada sem 84 é o teto.

## Por que venceu

O trio kg 25 / reps corpo / `was` 42% continua no arquivo. C4 e C1 não foram desfeitos. Medidor verde.

Para eu estar errado: o `Roll` da Série teria de perder o `was`, ou kg e reps teriam de voltar ao mesmo degrau `t-display`.
