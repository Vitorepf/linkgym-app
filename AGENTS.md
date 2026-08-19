# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

This app stays on **SDK 54** — the same major as `atlas-app` (`~54.0.33`) and `blackink-app` (`~54.0.32`). Do not bump to SDK 55/56/57.

Language: **TypeScript**. UI: React Native `StyleSheet` + `src/theme.ts`. Motion: Reanimated 4 + Gesture Handler. Do not add Tamagui, NativeWind, or styled-components.

Setup for humans is in `README.md`. Partner path: `make setup` then `make start` (`--go`). Celular no 5G: `make tunnel`. Never open localhost in the phone browser.

## Parada

Enquanto `.gate/estado.json` estiver em `em_andamento`, o turno não termina — o hook
Stop recusa. Quem decide que acabou é `node tools/gate.mjs`, não você.

Para terminar, grave um estado terminal E faça o gate sair 0:
- `aprovado` — veredito `venceu` ou `empatou` em todos os eixos, cada um com o caminho
  da referência e o do artefato, `na_barra: true` e `refutado: false`, e algum medidor
  fora da linha de base.
- `aguardando_humano` / `bloqueado` / `estagnado` — `motivo` com 20+ caracteres nomeando
  a decisão e o dono.

`esgotado` e `estagnado` não são entrega. Relate como são.

Mantenha `fase`, `alvo`, `defeitos` e `medidores` atualizados em `.gate/estado.json`.
Perdeu o fio, ou voltou de compactação? `cat .gate/estado.json; tail -3 .gate/serie.jsonl`
antes de qualquer outra coisa. Não releia o repo para se localizar.

Catracas: os 13 eixos de `.gate/base.json` — nenhum pode piorar. `node tools/medir.mjs <eixo>`
mede um; `node tools/gate.mjs` mede todos. Os eixos de gosto (`oficio`, `operacao`, `ritual`)
não têm número: quem julga é o crítico cego contra `docs/barra/`.

`--lock` NÃO é seu, em caso nenhum. `.gate/config.json`, `.gate/base.json` e `.gate/lock.json`
estão travados; editar qualquer um deles põe o gate em exit 2 sem saída por dentro do loop,
e `--lock` recusa relegitimar arquivo travado que mudou. Registrar eixo é ato do humano.
Construiu um medidor novo? Rode, ponha o número no `motivo` e continue nos eixos que já têm
catraca. Se ao fim o único trabalho restante for registrar esse eixo, aí sim `aguardando_humano`.
