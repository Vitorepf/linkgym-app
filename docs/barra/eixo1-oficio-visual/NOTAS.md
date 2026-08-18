# Eixo 1 — ofício visual e movimento. Barra: Whoop.

10 screenshots oficiais da App Store (WHOOP, Whoop Incorporated, trackId 933944389),
baixados em 1320×2868. Existem homônimos na busca (`Whop`, `WHOOP!!!`, `Whoop Triggerz`) —
estes são do app certo, conferido pelo `sellerName`.

Cada regra abaixo cita o arquivo que a comprova. Regra sem arquivo é palpite, não entra.

## A regra que resume o eixo

**O número do Whoop é uma história. O nosso é trivia.**

Em `whoop-frame-03-recovery.png`, o número `85%` aparece cercado de:

| camada | o que é | exemplo literal |
| --- | --- | --- |
| o número | herói, dominante | `85` |
| a unidade | nível tipográfico separado, ~45% da altura do número | `%` |
| o rótulo | caps pequeno, tracked | `RECOVERY` |
| a decomposição | 4 métricas com valor e seta de direção | `HEART RATE VARIABILITY 124 ▲` |
| **a baseline** | contra o que o número está sendo comparado | `Today vs. prior 30 days` |
| **a causa** | prosa explicando por que o número é esse | "Your HRV is elevated while your RHR… resulting in a higher Recovery today." |
| a ação | uma só, e nomeada | `BREAK DOWN MY RECOVERY →` |

Nosso `src/ui/ArcGauge.tsx` hoje entrega duas dessas sete camadas: o número (62px) e o
rótulo (14px). Sem unidade, sem decomposição, sem baseline, sem causa, sem ação.

Um número sem baseline não informa nada — o usuário não sabe se 85 é bom. **Toda métrica
herói do LinkGym precisa carregar contra o que ela está sendo comparada.**

## Regras medíveis

### 1. Um nível de hierarquia, uma coisa
`whoop-frame-03-recovery.png` mostra ~12 fatos distintos numa tela e não vira ruído, porque
existe exatamente UM elemento em cada nível: um herói, um grupo de pares (as 4 métricas),
um rótulo de baseline, uma frase, uma ação. Densidade não é o inimigo — empate de
hierarquia é.

Contraste com o defeito medido no LinkGym: **26 valores distintos de `fontSize` e 27 de
`letterSpacing`**. Isso não é hierarquia, é ausência dela.

### 2. A unidade é um nível tipográfico, e ela some quando não existe
`whoop-frame-01-overview.png`: `75%` e `85%` levam `%` menor e alinhado ao topo. `14.2`
(STRAIN) **não leva unidade nenhuma**, porque strain é escala pura.
Regra: a unidade nunca é parte da string do número. É um elemento próprio, opcional.

Para nós: `kg` em `Mass`/`Serie`, `%` em prontidão, contagem crua em ofensiva e XP.

### 3. Codificação redundante do mesmo valor
`whoop-frame-01-overview.png` e `-03-recovery.png`: o anel preenche 85% E os dígitos dizem
85%. Lê-se de relance (a forma) e com precisão (o dígito).
Nosso `ArcGauge` já faz isso com 10 ticks. **Manter a forma** — arco de ticks é linguagem
Modernist e é legitimamente diferente do anel deles. Não copiar o anel.

### 4. Pares ficam lado a lado, no mesmo tamanho
`whoop-frame-01-overview.png`: SLEEP / RECOVERY / STRAIN, três anéis idênticos em fila.
Se duas coisas são pares, elas têm o mesmo peso visual. Se uma é mais importante, ela é
o herói e as outras não competem.

### 5. Rótulo de métrica: caps, tracked, mudo
Em todos os arquivos: `HEART RATE VARIABILITY`, `RECOVERY`, `TODAY'S ACTIVITIES`.
Caixa alta, letter-spacing positivo, cor muda, tamanho pequeno. O valor é que tem cor e
tamanho. Nosso `Metric.tsx` já acerta isso (`fontSize: 11`, `letterSpacing: 1.32`,
`textTransform: uppercase`, cor `muted`). **É o componente mais próximo da barra hoje.**

### 6. Dois pesos de cabeçalho de seção, com significado diferente
`whoop-frame-01-overview.png`: `My Day` é sentence-case, branco, maior. `TODAY'S ACTIVITIES`
é caps tracked pequeno. Dois níveis de seção, não um.

### 7. Prosa explica o número, com alvo concreto
`whoop-frame-01-overview.png`, card "Building Fitness Gains": "…Keep pushing yourself
towards your target of **15.5**…". Não é motivacional genérico — cita o número alvo.

Para nós isso cai direto em Prontidão, Ofensiva e Progresso: a frase tem que citar o
número, não elogiar o aluno.

### 8. Status compacto com contagem
`HEALTH MONITOR › / ✓ WITHIN RANGE / 5/5 Metrics`. Estado + evidência numérica em 3 linhas.
`Resolver todos (11)` da MFIT também põe contagem no rótulo. **Contagem no rótulo é ofício
dos dois lados** — vale adotar.

### 9. Ícone é âncora de linha, não protagonista
Line-art monocromático, pequeno, à esquerda da linha, mesma cor muda do rótulo. Nunca
colorido, nunca competindo com o valor.

## A restrição que nos impede de copiar a alavanca principal deles

**O Whoop usa cor semântica. Nós não podemos.**

No Whoop, verde = boa recuperação, laranja = atenção, azul = strain, e as setas ▲▼ herdam
essa escala. É a alavanca mais forte da tela deles.

O LinkGym tem **um** acento, e ele pertence ao personal (`TimeTheme { name, accent,
logoUrl }`). Não existe verde-bom/vermelho-ruim disponível: o acento pode SER verde, pode
ser cinza, pode ser amarelo. Um sistema que dependa de cor semântica quebra na marca 6
(`Corpo Livre`, acento `#121111`) e na marca 13 (`Ponto 12`, acento = o próprio fundo).

Então a mesma legibilidade tem que sair de: **posição, tamanho, peso, e a forma da seta** —
não de matiz. Direção (▲▼) e magnitude (tamanho/tabular) carregam o significado que o Whoop
carrega em cor.

Isto não é limitação a contornar. É a identidade do produto: a única cor da tela é a do
personal, e ela nunca significa "bom" ou "ruim".

## O que estes arquivos NÃO provam

- São peças de marketing da App Store: telefone renderizado com moldura, copy promocional
  por cima, e em `-01-overview` uma pulseira física cobrindo metade da tela. **Não dá para
  medir espaçamento nem alinhamento em pixel.** Use para hierarquia e mecânica.
- Nenhum destes arquivos mostra **estado vazio, carregando ou erro** — que é exatamente uma
  das dimensões do eixo 1. Marketing nunca mostra tela vazia. Essa lacuna fica declarada:
  o acabamento de vazio/carregando/erro do LinkGym **não tem barra coletada** e vai ter que
  ser julgado por princípio, não por comparação.
- Não há evidência de timing nem de curva de animação em imagem estática. A linguagem de
  movimento da Fase 1 não pode alegar "igual ao Whoop" com base nestes arquivos.

---

Imagens de referência interna de pesquisa. Não entram no app, não são republicadas, nenhuma
tela é clonada. Copia-se o ofício, nunca a identidade.
