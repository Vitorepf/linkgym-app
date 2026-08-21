# O acabamento — auditoria de pixel do ciclo 10

O dono pediu "qualidade impecável, basicamente feito à mão". Um crítico mediu as capturas
embarcadas pixel a pixel e rastreou cada achado até a fonte. Vinte e dois defeitos, todos
verificados nos dois lados.

A frase com que ele fecha é o diagnóstico do produto inteiro, e vale mais que a lista:

> **o repo diagnostica esses defeitos nos próprios comentários e depois os embarca um
> arquivo adiante.** Não é ausência de gosto — é gosto que não se propaga.

Quatro dos achados abaixo são exatamente isso: uma regra que este repo escreve em prosa,
faz valer num componente e viola no vizinho.

## A régua que faltava, e que teria pego metade disto

`tools/vaos.mjs` conta literal de ESPAÇO fora dos seis degraus de `SPACE`. `soltos` conta
hexadecimal, `escala` conta `fontSize`, `tempo` conta duração — e o VÃO, que é a metade do
acabamento que o olho lê primeiro, não tinha ninguém contando.

**Primeira medida: 161 vãos fora da escada, em 31 arquivos.** Os piores: `Hoje.tsx` 12,
`Ajustar.tsx` 11, `Painel.tsx` 11, `MaquinaOcupada.tsx` 11.

## Os que mais barateiam o app

| # | o defeito | onde |
|---|---|---|
| 1 | **`rule="hair"` embarca um delimitador de 1,23:1** contra um piso de 3 que a SPEC §3 declara. Usado 26 vezes. `Baseline.tsx` diagnostica este número exato e conserta localmente; o primitivo compartilhado segue embarcando | `Screen.tsx` `ruleHair` |
| 2 | **Seis fichas de material, seis alturas diferentes** (136 a 140pt) e as legendas de uma mesma fila 4pt fora de uma linha comum. Causa: `minHeight` onde devia ser `height` — o caminho `larga` prova que funciona, todas as suas fichas medem exatos 120pt | `Aparencia.tsx` `palco` |
| 3 | **Traço dobrado na costura da lista com o rodapé**: 1pt, vão de 1pt, 2pt — três traços em 4pt de altura. O último `porta` cai em cima da régua do `DockFooter` | `Aparencia.tsx` + `Screen.tsx` |
| 4 | **O botão ganha contorno visível exatamente quando para de funcionar.** Ligado: acento chapado sem borda. Desligado: cinza + borda de 2pt + rótulo cinza. Lê como quebrado, não como esperando | `AccentCTA.tsx` `DESLIGADO` |
| 5 | **O rótulo da Baseline transborda em 46% da faixa** — abaixo de 23 ou acima de 77 a caixa de 160pt sai do cartão, e ela é `numberOfLines={1}`. A prévia embarca 72, cinco pontos da quebra. É o número herói da tela que a aluna abre todo dia | `Baseline.tsx` `ANCHOR` |
| 6 | **Números que mudam no lugar não são tabulares.** `label` e `note` não recebem `fontVariant` — e é neles que moram o valor da Baseline, o custo do botão ("52 MIN") e a legenda da sessão | `Txt.tsx` |
| 7 | **Seis tamanhos do mesmo check** (13 a 24) e a espessura do traço em unidades de viewBox: o mesmo glifo desenha 1,08pt a 13 e 2,0pt a 24. **85% de diferença de peso no mesmo ícone** | `Icons.tsx` |
| 8 | **O orçamento de acento conta reivindicações, não pixels.** O avatar de 44pt pinta 1.936pt² de marca sólida e é isento incondicionalmente — a isenção é concedida por qual token se chama, não por quanta área se pinta | `accent.tsx` |
| 9 | **Um ponto redondo ao lado de um quadrado, uma linha abaixo**: `miniPonto` crava `borderRadius: 10` enquanto o irmão usa `FORMA.raioEm(20)`. A alavanca de cantos alcança tudo no índice menos os pontos de cor | `Aparencia.tsx` |
| 10 | **`fio` pode cair em meio pixel**: `Math.max(0.5, borda/2)` — no traço fino, todo separador interno do app mede 0,5pt, que a 3× vira 1,5 e antialiasa em cinza borrado | `theme.ts` |
| 11 | **A barra de abas é o único lugar que a alavanca de letra não alcança**: `fontSize: 10` passado como `style` sobrescreve o `Txt`. E o tracking está invertido — as versaletes menores são 26% mais apertadas que as maiores | `tabChrome.tsx` |
| 12 | **A célula de número tem `paddingVertical: 22` congelado**, fora de qualquer escada: escolher "arejada" engorda a célula 9pt na horizontal e 0 na vertical — a proporção da célula muda por baixo de uma alavanca que não é dela | `Metric.tsx` |
| 13 | **A primeira linha da lista é 12pt mais alta** que as quatro irmãs, porque a margem da prévia fica ABAIXO da régua e a régua deixa de tocar o que separa | `Aparencia.tsx` `previaAlta` |
| 14 | **A mesma frase duas vezes numa tela**: a folha do botão repete "Começar, Publicar, Salvar" 165px abaixo do cabeçalho. A prop `nu` existe exatamente para isso e sete folhas a passam; esta não | `Aparencia.tsx` |
| 15 | **Grades que quebram rasgadas**: onze cores em 5+5+1, sete chãos em 2+1+1+2+1 | `Aparencia.tsx` |
| 16 | **Órfãs no português**: "…nunca abaixo do que **o** / **dedo** alcança" — artigo separado do substantivo na quebra | `Aparencia.tsx` |

## Conferido e limpo — para ninguém gastar o tempo de novo

Margem esquerda exata em 18pt em toda tela medida. A coluna fantasma do botão funciona: o
rótulo centra em 390 contra um centro de 390. As iniciais do avatar centram opticamente
dentro de meio pixel. O tique da Baseline é matematicamente exato. As maiúsculas acentuadas
não cortam — "MÉDIA ATÉ ONTEM" tem 2,5pt de folga. As fichas `larga` medem exatos 120pt.
Todos os tokens de cor passam nos próprios pisos, com uma exceção: `hairline`, que é usado
como delimitador e cuja própria especificação proíbe isso.
