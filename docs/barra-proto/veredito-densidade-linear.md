# Veredito: densidade-linear
data: 21 ago 2026 (rodada 5, crítico cego)
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/01-densidade-linear.md B12 + docs/barra-proto/passada-4-mobbin.md (Linear Active issues 30ebc468 + linha 1 das oito)
caminho_artefato: proto-aluno/src/screens/hoje.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/styles.css, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. preenchido 0 cenas > 1. tipos pior=4. O 0 do medidor conta teto de cena, não massa na dobra. 0 fora não é vitória.

Afirmação falsificável: na primeira dobra do Hoje (430×844, chrome incluso, seed com ficha) o primário «Começar» ainda é `.thumb` 390×54 em y=404, fill `oklab(0.82158 0 0)` — tinta cheia. Linear B12 e o pack pedem 0 botão preenchido, 0 tinta de ação. O furo da rodada 4 não saiu do pixel.

Medido (Vite :5247, 430×844, localStorage limpo, seed com ficha):

| y | o que o pixel mostra | classe | px | fill |
| --- | --- | --- | --- | --- |
| 11 | 18:04 / Goiânia | t-body | 17 | 0 |
| 48 | Ferro Bruto | t-body | 17 | 0 |
| 56 | ofensiva 4 / 1 protetor | t-small | 15 | 0 |
| 75 | Sexta · 21 ago | t-body | 17 | 0 |
| 114 | O de hoje | t-body | 17 | 0 |
| 141 | A · Superior | t-body | 17 | 0 |
| 196–319 | linhas da ficha + igual/acima/abaixo | t-body + t-small | 17 / 15 | 0 |
| 336 | Última vez / Treino livre | quiet | 17 | 0 |
| 404 | Começar / 48 min | thumb | 17 | **390×54 oklab 0,82** |
| 424 | 5 / Sua melhor. 5 kg acima. | MarkStrip body | 17 | véu bg-bg em cima do Thumb |
| 494 | Te pegaram | t-body | 17 | 0 |
| 529–589 | Aceito | t-small + border-edge | 15 | 0 (contorno) |
| 811 | Hoje Ficha Rede Progresso Perfil | t-body | 17 | 0 |

Corpos visíveis na dobra: 15 e 17. Razão 17/15 = 1,13. «O de hoje» = linha (os dois em 17). Seção=linha e 2 corpos fecham. O furo da r4 não era esse.

O que o arquivo faz com o fill: `hoje.tsx:132-136` monta `<Thumb label="Começar">`. `bits.tsx:209` pinta `className="thumb"`. `styles.css:350-365` crava `width: 100%`, `height: 54px`, `background-color: color-mix(in oklab, ink 82%, bg)`. Com `faixa` de duelo, `hoje.tsx:137-145` põe `absolute inset-0 bg-bg` em cima — o hit-test (`elementFromPoint` no centro) ainda devolve o SPAN «Começar». Sem `faixa` o fill fica à vista. Linear B12 não pergunta se um recorte do seed tapa o botão; pergunta se existe massa preenchida de ação. Existe.

Chrome incluso: TabBar é glifo + `t-body`, fundo transparente. Aceito é borda. A única tinta de ação na dobra é o Thumb.

Pack (Active issues, 30ebc468): 0 botões, soma de tinta de ação = 0. Barra 01 B12: 0 botões preenchidos na tela mais densa. Linha 1 das oito: 0 botão preenchido; 2 corpos; seção=linha. Dois dos três fecham. O terceiro é o furo da r4 e continua no pixel.

Não é vitória: 2 corpos e seção=linha. Não é empate: a barra e o pack tratam 0 fill como condição, não como detalhe. Diferente-mas-ok é perdeu.

Para eu estar errado: a dobra do Hoje, chrome incluso, teria de pintar 0 retângulo com fill de ação — nenhum `.thumb`, nenhum `bg-ink` / `bg-stamp` de botão — e o hit-test no sítio do primário não poderia devolver um `.thumb`. O medidor `preenchido` em 0 não refuta: ele tolera 1 por cena.

brechas que não reabrem o fill:
- t-kicker agora é 17 (styles.css:129-137). Seção=linha. Não apaga o Thumb.
- Aceito em contorno. Não é o primário da densa.
- 00 arb. 2 (razão ≤ 1,40) e C12 («exatamente 1 preenchido») não são a medida desta rodada. A medida declarada é B12 + pack linha 1 + o furo da r4.

o que venceria e não está:
- 0 massa preenchida na primeira dobra do Hoje, chrome incluso.
