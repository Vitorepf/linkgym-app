# linkgym-app

App do LinkGym (personal + aluno). TypeScript, Expo SDK 54.

API: [linkgym-api](https://github.com/Vitorepf/linkgym-api)

## Subir (front)

Na máquina, só isto:

1. [Node 20.19+](https://nodejs.org/) — 22 também serve. Se usa `nvm`: `nvm use` (tem `.nvmrc`).
2. [Expo Go](https://expo.dev/go) no telefone, **SDK 54** (não o app novo de SDK 55+).
3. Acesso a este repo (é privado — peça convite no GitHub).

```bash
git clone https://github.com/Vitorepf/linkgym-app.git
cd linkgym-app
make setup
make start
```

Sem `make`: `npm run setup && npm start`

O QR abre no app **Expo Go** (SDK 54), não no Chrome. No terminal tem que aparecer `Using Expo Go`, não `Using development build`.

- Mesmo Wi-Fi do Mac: `make start`, câmera / Expo Go no QR.
- Celular no 5G: `make tunnel` (localhost no iPhone é o próprio telefone — por isso o Chrome deu `ERR_CONNECTION_FAILED`).
- Simulador: `i` no terminal.

A API **precisa** estar no ar para entrar (`make start` no `linkgym-api`). No dev: toque Fred / Vitor / Huan / Jose; OTP é `0000`.

## Depois, com a API

Quando for falar com o backend: no `linkgym-api`, `make setup` e `make start`. No simulador, `localhost:8080` já está no `.env`. No telefone físico, troque `EXPO_PUBLIC_API_URL` pelo IP do Mac.

## Travas (não mexer)

| | |
| --- | --- |
| Linguagem | TypeScript |
| Expo | SDK 54 (`~54.0.33`) |
| React / RN | 19.1.0 / 0.81.5 |
| UI | `StyleSheet` + `src/theme.ts` + Reanimated 4 |
| Não entra | Tamagui, NativeWind, styled-components, SDK 55/56/57 |

Pacote Expo novo: `npx expo install <pacote>`. Nunca `npm install` solto num módulo Expo.

Spec: [v1 design](https://github.com/Vitorepf/linkgym-api/blob/main/docs/superpowers/specs/2026-08-18-linkgym-v1-design.md)
