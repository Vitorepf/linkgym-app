# Veredito: informação (Flighty)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/04-informacao-flighty.md
caminho_artefato: proto-aluno/src/screens/serie.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — todos na linha. Sem medidor de fantasma/herói/unidade: o eixo é conferível no arquivo. Proxy: `tipos` pior cena 4 (teto 5); `escala` 0 avulsos. Afirmação: o bloco da série não tem herói a 2,4–2,7× o corpo; o antecessor não fica riscado a 38–48% em 100% dos campos de execução; lista e detalhe do mesmo exercício repetem a unidade kg; ficha é a terceira superfície ainda em kg.

brechas:
- proto-aluno/src/screens/serie.tsx:94-96 — B1/C1: carga em `t-title` (21) e reps em `t-body` (17) no mesmo bloco. Um número maior, dois tamanhos próximos. O herói do bloco contra o corpo (`t-small` 13 da linha de baixo) mede 1,62×, fora de 2,4–2,7×. Dois números do mesmo assunto na mesma tela sem serem heróis pares.
- proto-aluno/src/screens/hoje.tsx:88-105 e proto-aluno/src/screens/serie.tsx:94 — B2: com `last_kg` a lista imprime `+N`/`−N` via `formatKg` — ainda kg. No detalhe o herói é kg. Unidades iguais. Sem `last_kg` a lista cai em `N × M` (contagem), não tempo relativo. B2 pede unidades diferentes em 100% dos pares lista/detalhe.
- proto-aluno/src/screens/ficha.tsx:126-127 — B2/C2: terceira superfície do mesmo exercício, `Roll` de `load_kg` + `valueSub="kg"`. Quatro superfícies (hoje, ficha, série, recibo) não trocam a natureza do herói; duas delas repetem kg absoluto.
- proto-aluno/src/ui/kit.tsx:209 — B3: em `Stat size="lg"` a unidade é `t-body` (17) sobre `t-display` (22) = 77% da altura, fora de 55–65%. `t-display` e `t-body` compartilham o tom do algarismo.
- proto-aluno/src/ui/kit.tsx:229-246 — B4/C4: o fantasma só nasce se `was` vem e é diferente de `value`, e sai sempre em `t-small` (13). Na Série o herói é 21: 13/21 = 62%, fora de 38–48%. `was` só é passado em proto-aluno/src/screens/progresso.tsx:147. Ficha, placar e ofensiva chamam `Roll` sem antecessor.
- proto-aluno/src/screens/serie.tsx:97-99 — B4/C4: o risco só aparece quando `last !== session.kg`. Na abertura, se a carga já é a da última, o antecessor some. C4 pede o valor da sessão anterior na mesma linha, riscado, antes do primeiro toque, em 100% dos campos de execução.
- proto-aluno/src/screens/serie.tsx:55-60 — B5: a linha traz direção em palavra (“acima”/“abaixo”) sob o absoluto, mas também o distintivo com sinal (`+`/`−`) que a barra proíbe. Sem cor semântica de estado.
- proto-aluno/src/ui/kit.tsx:170 e proto-aluno/src/screens/progresso.tsx:143 e proto-aluno/src/styles.css:31-35 — B6: uma só cor cromática (`stamp` / `stamp-hi`) carrega selo “vivo”, recorde do caderno e o ato do carimbo. A barra pede 3 cores com 1 significado cada; aqui 1 cor com 3 papéis.
- proto-aluno/src/ui/charts.tsx:41-70 — B9: `Trail` é barra de proporção, 1 coluna de valor, sem rótulo de coluna repetido dentro da linha. Não é a grade plano × realidade (2 colunas, 0 régua, 7 linhas).
- proto-aluno/src/screens/feito.tsx:36-41 — B10: o recibo diário é total (séries · minutos) sem decomposição em série nomeada a 1 toque.
- proto-aluno/src/ui/charts.tsx:33 — B12: `Trail` devolve `null` com lista vazia e some com o bloco. `WeekDots` agora imprime “0”; a cobertura de 100% das distribuições ainda quebra no `Trail`.
- proto-aluno/src/ui/feed.tsx:159-163 — B13: `WinPlate` sem rostos troca o conteúdo por convite (“Desafie alguém”). Proibido no lugar do cartão do dado.
- proto-aluno/src/ui/board.tsx:205-217 — B14: vazio (“Só você neste clã”, “Crie o seu”) não nomeia o controle exato nem desenha o glifo dele dentro da frase; a primitiva ainda aceita botão.
- proto-aluno/src/screens/descanso.tsx:80-81 — B16: o herói é só relativo (`left` em segundos); o subtítulo repete o mesmo relativo (“N s no relógio”). Sem par absoluto.
- proto-aluno/src/screens/serie.tsx:101 — B17: número abaixo do pedido não ganha frase de causa acionável terminando em chevron. Cobertura exigida: 100% dos estados ruins.
- proto-aluno/src/ui/kit.tsx:200 — B18: `Stat` põe o rótulo (`t-kicker`) acima do número. Em superfície reduzida o rótulo vai abaixo, versalete, ≤0,45× o herói.

o que venceria:
- 100% dos campos de execução mostram o valor da sessão anterior na mesma linha, à direita, riscado, com 38–48% da altura do herói — inclusive antes do primeiro toque. `Roll` sem `was` não conta.
- Um herói por bloco a 2,4–2,7× o corpo (carga ou rep, não os dois a 21/17), e as 4 superfícies do mesmo exercício com unidades diferentes.
- Uma cor, um significado; todo total pior aponta a série nomeada a 1 toque; cartão sem dado conserva a caixa.
