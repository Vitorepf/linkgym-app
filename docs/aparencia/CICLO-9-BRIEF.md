# CICLO 9 — o dono deu nota 6

Ele olhou as telas e reprovou. Sete defeitos, na palavra dele:

1. **O botão.** "consegui o que eu queria mas o botão continuo tendo um tamanho
   extraordinariamente grande, sem sentido, olha os 3 botoes — nunca que isso aqui e
   ultra premium, isso e ia slop."
2. **Cor.** "as cores extremamente baixo a variedade, horrivel."
3. **Vocabulário.** "chao, quem vai saber o que e chao?"
4. **Material.** "não tem elementos visuais diferentes somente cores e poucas cores, sem
   variedade de elementos como o iphone mudou o material dos componentes chamado glass
   que e uma pegada mais de vidro que tem efeitos transparentes, tem inumeras
   personalizzaçoes possiveis, simples da gente aplicar e vc não faz."
5. **Letra.** "letras, todas basicamente iguais."
6. **Usabilidade.** "invez de ter que rolar a tela massivamente, cada item que muda
   alguma coisa da aparencia abrir um modal, com uma interaçao, usablidade maravilhosa e
   extremamente marcante."
7. "tem muitos erros aqui, muita coisa que precisa ser resolvida."

A meta permanente: o personal vende este app como se fosse dele. Customização TOTAL, e
ultra premium em qualquer escolha que ele faça.

## O que já existe e você não pode ignorar

- `src/theme.ts` (1964 linhas) é a fábrica: `criarTema(Aparencia) -> Tema`. O documento
  `Aparencia` tem hoje 14 campos. `TemaDoTime` é o provider; `estilos(fabrica)` é o hook.
- `src/screens/owner/Aparencia.tsx` (979 linhas) é o editor.
- **`expo-blur` JÁ ESTÁ INSTALADO e não é usado em lugar nenhum.** `react-native-svg`
  também está. Seis famílias do `@expo-google-fonts` já são carregadas em `App.tsx`.
- `Superficie = "solida" | "contorno" | "vidro" | "elevada"` — mas `vidro` hoje é só
  sombra + um número `VIDRO` de 26 que não vira blur nenhum. É mentira de nome.

## Catracas do gate (13 eixos, nenhum pode piorar)

- `soltos` = **0**: nenhum literal hex fora de `src/theme.ts`. Conta texto cru, comentário
  incluído.
- `escala` ≤ **2** literais distintos de `fontSize:` no repo (hoje 1).
- `contraste` = **0** pares reprovando.
- `culpa` / `proibidas` = **0** (varredura de vocabulário).
- `toques_serie` = **2** (a série do aluno não pode custar mais toques).
- Traço delimitador é sempre `divider` ou `ink` (SPEC §3); `aresta` é material.
- **Nenhuma dependência nova.** SDK 54, sem bump.

Arquivos travados, não edite: `.gate/*`, `tools/gate.mjs`, `tools/medir.mjs`,
`tools/shots.mjs`, `tools/taps.mjs`, `tools/contrast.mjs`, `tools/palavras.mjs`,
`tools/brands.mjs`, `tools/carga.mjs`, `tools/cobertura.mjs`, `tools/fila.mjs`,
`tools/toques.mjs`, `.claude/hooks/stop-gate.mjs`.
