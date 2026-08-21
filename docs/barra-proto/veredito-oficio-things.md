# Veredito: oficio-things
data: 21 ago 2026 (rodada 5, crítico cego)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/02-oficio-things.md B1 B20 + docs/barra-proto/passada-4-mobbin.md (Things flow b1fa3cd6 + linhas 2–3 das oito)
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. escala 0 avulsos, 10 degraus, maior salto 1,24; extremos do sistema 25/11 = 2,27. O medidor lê a escada no CSS, não os corpos visíveis na dobra nem o cartão. 0 fora não é vitória.

Afirmação falsificável: a primeira dobra do Hoje (430×844, chrome incluso) pinta só 15 e 17 — extremos 1,13×, não 2,0–2,3×. Série / Descanso / Feito entram em `RACK` e substituem a cena (LiveScene = RackScene); `CARDS` é vazio; 0 `.sheet` / `.sheet-card`. Nenhuma linha do Hoje fica atrás. Things B1 e B20 + pack linhas 2–3 pedem o contrário. Os dois furos da r4 continuam no pixel.

Medido (Vite :5247, 430×844, localStorage limpo):

Hoje, chrome incluso:

| y | texto | classe | px |
| --- | --- | --- | --- |
| 11–141 | 18:04 / Ferro Bruto / O de hoje / A · Superior | t-body | 17 |
| 56 | ofensiva 4 / 1 protetor | t-small | 15 |
| 196–319 | nomes da ficha 17 · 3×8 15 | t-body + t-small | 17 / 15 |
| 811 | Hoje Ficha Rede Progresso Perfil | t-body | 17 |

Corpos visíveis: {15, 17}. Razão 1,13. Things B1: extremos entre 2,0× e 2,3×. Pack: cinco degraus no fluxo, extremos ~2,15. 1,13 não entra na faixa. Não inventei quarto sistema para mandar os extremos só ao Feito: a dobra densa é o sítio que o pack e a r4 nomearam.

Série (toque em Começar, mesma viewport):

- LiveScene vira Serie. O texto vivo começa em «1 de 3 · série 1 de 3 / Supino reto». Zero linha do Hoje.
- Corpos amostrados: 7,14 (strike sobre 17), 10,5 (strike sobre 25), 15, 17, 25. Razão se contar strike: 3,50. Sem strike: 25/15 = 1,67. Nenhum dos dois é 2,0–2,3 com vizinho ≤ 1,35.
- `.sheet` / `.sheet-card`: 0. `RACK` em app-root.tsx:98 = serie / descanso / feito / como / fichaSessao. `CARDS` = `new Set()`.
- Thumb «Fiz essa série · 90s»: 152×54, fill oklab 0,82, y=714. Pack linha 3: 1 Save no cartão, FAB 52–56. Isto é primária cheia numa cena 100%, não cartão 40–55%.

Descanso e Feito: o mesmo `RACK`. Feito.tsx:25 é `flex-1` full-bleed; o `.plate` (feito.tsx:27) é bloco interno, não overlay sobre o Hoje. 0 linhas do Hoje atrás.

Pack (Creating a new to-do, b1fa3cd6): cartão 40% no piso, When? ≤65%, 0 quadro a 100%, ≥2 linhas do contexto. Linha 2 das oito: Série / Descanso / Feito sobem cartão 40–55% com Hoje atrás. Things B20: 40–70% e o contexto reconhecível. O artefato entrega 100% e apaga o Hoje.

Conflito Linear 17+21: a dobra do Hoje ficou em 15+17 (1,13×) para servir 2 corpos / seção=linha. Things B1 nessa mesma dobra perde. Não desempatar com a escada do CSS (25/11 = 2,27) nem com o 00: a barra deste eixo na dobra é o que o pixel mostra.

Face 22×22 (hoje.tsx:156) continua na faixa B3. Não é o furo da r4 e não vence o eixo.

Para eu estar errado: a dobra do Hoje teria de mostrar extremos de tipo entre 2,0× e 2,3× (dois corpos nomeados, não strike), e Série / Descanso / Feito teriam de ocupar 40–55% da altura com pelo menos duas linhas do Hoje ainda legíveis. O medidor `escala` em 2,27 não refuta: ele não olha a dobra.

brechas que não reabrem B1 nem B20:
- Face 18–22. Era o ganho da r4. Os extremos e o cartão é que tinham de fechar.
- Feito em 17+25 (1,47×). Ainda fora de 2,0–2,3, e é cena 100%.
- Dock `w-fit` no Thumb da Série (152 px). Não vira FAB 52–56 sem rótulo, e não vira cartão.

o que venceria e não está:
- Extremos 2,0–2,3× visíveis na dobra que o pack mede, e Série / Descanso / Feito em cartão 40–55% com o Hoje atrás. Os dois. Um só não basta.
