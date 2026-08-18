# linkgym-app

App do LinkGym. Um binário, duas contas (personal e aluno). Depois do login, a cara é a marca do personal — não a da plataforma.

API: [linkgym-api](https://github.com/Vitorepf/linkgym-api)

## Precisa na máquina

- [Node 20.19+](https://nodejs.org/) (22 também serve)
- [Expo Go](https://expo.dev/go) no telefone — **SDK 54**
- A API no ar (`make dev` no `linkgym-api`)

Este app fica no **Expo SDK 54** + **TypeScript** (React 19.1, React Native 0.81.5). É a mesma linha do Atlas e do Blackink. Não subir para 55/56/57. Não usar JavaScript solto.

## Linguagem da UI

TypeScript + `StyleSheet` + tokens (`src/theme.ts`). Animação: Reanimated 4.

Não entra Tamagui, NativeWind nem styled-components. O Modernist precisa de raio 0, Archivo e um acento — biblioteca de componente genérica deixa o app com cara de template e a IA erra a API.

## Subir

```bash
git clone https://github.com/Vitorepf/linkgym-app.git
cd linkgym-app
make setup
make start
```

Sem `make`: `npm run setup && npm start`

Abre o QR no Expo Go. No simulador, `i` no terminal.

## Versões (não mexer no major)

| Pacote | Versão |
| --- | --- |
| expo | ~54.0.33 |
| react | 19.1.0 |
| react-native | 0.81.5 |
| typescript | ~5.9.2 |

Dependências novas: `npx expo install <pacote>` — nunca `npm install` solto num módulo Expo. Depois: `npx expo-doctor`.

## Design

Modernist: fundo `#0b0a0a`, Archivo 800, raio 0, um acento (a cor do estúdio).

Spec: [v1 design](https://github.com/Vitorepf/linkgym-api/blob/main/docs/superpowers/specs/2026-08-18-linkgym-v1-design.md)
