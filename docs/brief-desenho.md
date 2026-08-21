# Brief — desenho: superfície no lugar de linha, grade que fecha

Tese de produto (o que o app *é*): `docs/estrategia-strava-academia.md`. Este arquivo é só o gate de desenho. Sem aquele, é Instagram preto.

O que foi pedido (dono, 2026-08-19), com número:

1. **Ritmo vertical.** `node tools/ritmo.mjs tools/out/design/0` — 32 telas. Pior:
   AtencaoVazio razão 41,9, buraco único de 565pt. ProgressoZero 37,4. Criacao 23,0.
   Mediana do conjunto 2,4. Diagnóstico fechado: o app usava LINHA sangrando de ponta a
   ponta; a barra usa SUPERFÍCIE com respiro interno. O vazio delas é padding de alguém;
   o nosso não era de ninguém, e virava buraco.
   **Critério: `ritmo` abaixo de 41,9 e nenhuma catraca subindo.**

2. **Grade horizontal quebrada** na linha ENERGIA · DOR · SONO de Hoje — e sem medidor.
   **Critério: construir o medidor antes de consertar (`tools/grade.mjs`), e a linha
   dividir em três partes que o olho lê como iguais.**

3. **Perfil em estado de erro** — uma linha de texto, um botão, o resto vazio.
   **Critério: tela de perfil inteira, verificável pelo shot.**

Como trabalhar: uma passada de SISTEMA (theme.ts e src/ui, sequencial), depois FATIAS
VERTICAIS — uma tela de ponta a ponta por vez, verificável pelo shot. O seam de
verificação é `node tools/shots.mjs` (33 telas × 20 marcas) + `tools/ritmo.mjs`.

Como acaba: `node tools/gate.mjs` sai 0, `ritmo` abaixo de 41,9, e os eixos de gosto
(oficio, operacao, ritual) com veredito venceu|empatou carregando referência, artefato,
na_barra e comando_refutacao, julgados contra docs/barra/. Quem diz que acabou é o gate.
