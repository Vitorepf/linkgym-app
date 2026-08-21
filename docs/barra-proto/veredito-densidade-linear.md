# Veredito: densidade-linear
data: 21 ago 2026 (rodada 6, crítico cego)
julgamento: empatou
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/01-densidade-linear.md B12 + docs/barra-proto/passada-4-mobbin.md (Linear Active issues 30ebc468 + linha 1 das oito)
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. preenchido 0 cenas > 1. tipos pior=4. O 0 do medidor conta teto de cena, não massa na dobra. 0 fora não é vitória.

Afirmação falsificável: na primeira dobra do Hoje (430×844, chrome incluso, seed com ficha) o primário «Começar» é botão de texto `min-h-11` sem classe `.thumb`, fill `rgba(0,0,0,0)`, e o hit-test no centro devolve o SPAN «Começar» — nenhum overlay tapa. Linear B12 e o pack pedem 0 botão preenchido, 0 tinta de ação. Nesta dobra, isso agora é verdadeiro.

Medido (Vite :5248, 430×844, localStorage limpo, seed com ficha):

| y | o que o pixel mostra | classe | px | fill |
| --- | --- | --- | --- | --- |
| 11 | 18:04 / Goiânia | t-body | 17 | 0 |
| 48–75 | Ferro Bruto / Sexta · 21 ago / ofensiva 4 | t-body + t-small | 17 / 15 | 0 |
| 114 | O de hoje | t-body | 17 | 0 |
| 141 | A · Superior | t-body | 17 | 0 |
| 184–328 | linhas da ficha + igual/acima/abaixo | t-body + t-small | 17 / 15 | 0 |
| 340 | faltam 3 kg no supino reto | t-small | 15 | 0 |
| 369 | Última vez / Treino livre | quiet | 17 | 0 |
| 437 | Começar / 48 min | min-h-11 texto | 17 / 15 | **0** — 127×44, rgba(0,0,0,0) |
| 544–727 | Te pegaram / Aceito | t-body + border-edge | 17 / 15 | 0 (contorno) |
| 786–811 | Hoje Ficha Rede Progresso Perfil | t-body | 17 | 0 |

`.thumb` na dobra: 0. Botões na dobra com fill ≠ transparente: 0. Hit-test no centro de Começar: `SPAN.t-body` «Começar», `covered: false`. A faixa do duelo («5 / Sua melhor…») entra no fluxo abaixo do botão, não em `absolute inset-0`.

`hoje.tsx:141-148` monta `<button className="mt-6 flex min-h-11 items-baseline gap-3 text-left">`. Não importa `Thumb`. `bits.tsx` ainda pinta `.thumb` — não é chamado nesta dobra. `styles.css:350-365` continua com fill 82% — sem instância no Hoje.

Corpos visíveis na dobra: 15 e 17. Razão 17/15 = 1,13. «O de hoje» e o título da ficha = 17. Seção=linha e 2 corpos fecham. Pack linha 1 (2 corpos; seção=linha; 0 botão preenchido; 0 régua) fecha nesta dobra.

Não é vitória: Linear B12 é o piso da tela densa, não o teto do app. A Série ainda pinta `.thumb` 152×54 `oklab(0.82158 0 0)` em y=714 — C12 (0 fill na execução) não fecha. Empate é a medida declarada (B12 na dobra do Hoje) cumprida, sem superar.

Para eu estar errado: a dobra do Hoje, chrome incluso, teria de pintar um retângulo com fill de ação — um `.thumb`, um `bg-ink` / `bg-stamp` de botão — ou o hit-test no sítio do primário devolver um `.thumb`. O medidor `preenchido` em 0 não refuta nem confirma sozinho: ele tolera 1 por cena.

brechas que não reabrem o fill:
- Aceito em contorno. Não é o primário da densa.
- Face 22×22 é token de dado, não tinta de ação.
- C12 («0 fill na Série») e B1 («1 tamanho na densa») não são a medida desta rodada. A medida declarada é B12 + pack linha 1.

o que venceria e não está:
- 0 massa preenchida também na Série, o sítio onde Linear C12 cobra o ganho.
