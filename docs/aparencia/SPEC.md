# SPEC — A Fábrica de Aparência

> Lei dos próximos lotes. Números aqui são medidos, não estimados (`node tools/aparencia.mjs`, `node tools/contrast.mjs`, `node tools/medir.mjs <eixo>`, rodados em 2026-08-19).

**Estado real de partida.** Metade da fábrica já existe e passa: `src/theme.ts` tem `Aparencia`, `APARENCIA_PADRAO`, `criarTema`, `CHAOS` (7), `separadas`, `secundariaDe`, `afastar`, `afastarPeca`; `src/ui/tema.tsx` tem `TemaDoTime`/`useTema`/`estilos`; 42 arquivos já leem tema vivo; `App.tsx` já monta `TemaDoTime` acima do `NavigationContainer`; `src/api.ts` já tem `aparenciaDoTime`; `tools/aparencia.mjs` já varre 8.620 pares em 245 paletas com 0 reprovas. Catracas hoje: contraste 0, soltos 0, escala 2, telas 36.

**O que ainda não é verdade.** Seis vazamentos de token congelado, `FORMA`/`secundaria`/`movimento` gerados com ZERO leitores, o host de shots fotografando sempre carvão, e a API descartando o documento no PATCH. Esta spec é sobre isso — não sobre reescrever o que já mede limpo.

---

## 1. O documento `Aparencia`

Oito campos. Sete são cardápio fechado; um é livre porque é da marca e ninguém escolhe pelo personal. Vive em `studios.config.aparencia` (jsonb, sem migration) — exceto `primaria`, que é a coluna `studios.accent_color` e viaja no convite (`/v1/auth/code`) e no `/v1/today`, onde config não vai. Um documento com dois donos da mesma cor diverge; por isso `aparenciaDoTime` sobrescreve `primaria` a partir da coluna, sempre.

| campo | cardápio | default | o que decide |
|---|---|---|---|
| `chao` | os 7 nomes de `CHAOS` **ou qualquer `#rrggbb`** | `carvao` | os 10 degraus — os 4 fundos, 2 neutros, 3 tintas. Claro/escuro está aqui, não em campo à parte. Os sete continuam sendo DADO medido; hex livre passa por `escada()` (§2.1). |
| `primaria` | hex livre (`#rrggbb`), 10 sugestões em `ACCENT_CHOICES` | `#ec3013` | a cor da marca. Único campo contínuo do documento inteiro. |
| `secundaria` | `"auto"` ou hex livre | `"auto"` | a segunda série. `auto` = `secundariaDe(primaria)`. |
| `forma` | `reta` · `macia` · `pilula` | `reta` | canto, e por consequência recuo e regra de fio. |
| `superficie` | `solida` · `contorno` · `vidro` · `elevada` | `solida` | onde a superfície pousa e como ela se separa do chão — nos TRÊS estratos (`FORMA.folha`), não só na Band. |
| `acao` | `linha` · `centro` · `caixa` · `empilhada` | `linha` | a ANATOMIA da ação: onde o rótulo mora dentro da peça. `empilhada` põe o custo na segunda linha e faz `FORMA.alturaAcao` crescer (65–70pt, contra o piso 56). |
| `hierarquia` | `salto` · `parelha` · `eco` | `salto` | quanto o SEGUNDO botão recua do primeiro. Peso do primário não é alavanca; o do PAR é. |
| `anel` | `resgate` · `sempre` | `resgate` | o contorno na cor da marca em volta da ação cheia. |
| `numero` | `empilhado` · `linha` · `cartaz` | `empilhado` | a anatomia de uma cifra. |
| `contraste` | `normal` · `alto` | `normal` | as seis tintas 20% mais longe do fundo. Só SOBE. |
| `peso` | `fino` · `medio` · `grosso` | `medio` | espessura do traço que delimita (1 / 2 / 3). |
| `densidade` | `compacta` · `normal` · `arejada` | `normal` | deslocamento de degrau em `SPACE`. Nunca toca área de toque. |
| `movimento` | `seco` · `normal` · `generoso` | `normal` | multiplicador de `state`/`enter`. Nunca toca `press`. |

**O default é o app de hoje byte a byte.** Isso não é cortesia: é o teste de regressão da fábrica inteira. Se `criarTema()` sem argumento não reproduzir o carvão/reta/sólida/médio/normal/normal atual, o lote está errado e para.

**Espaço total:** 7 chãos × 6 vozes × 4 botões × 3 hierarquias × 2 anéis × 3 números × 3 formas × 4 superfícies × 3 pesos × 3 densidades × 3 movimentos × 2 contrastes = **1.959.552 aparências**, cada uma com qualquer primária — e o chão também aceita hex livre, ponto em que a conta deixa de ser finita e passa a ser AMOSTRADA, exatamente como a cor da marca já era desde o ciclo 4. `tools/aparencia.mjs` percorre 49.038 pares. Finito por construção — é por isso que não existe slider de raio, de borda, de sombra nem de espaço em lugar nenhum da interface. Onde o olho humano erra, cardápio; onde a escolha certa é calculável, derivação.

**Regras de nome, que são de gate e não de gosto:**
- Nenhum campo do tema pode conter a substring `accent`. O varredor `cru` de `tools/contrast.mjs` (protegido) reprova `*[Cc]olor|fill|stroke|tint : …accent\w*` em `src/screens` e `src/nav`. Os nomes vivos são `primaria`, `secundaria`, `acento()`, `acentoEm()`.
- Qualquer arquivo novo que contenha hex literal **tem que terminar em `theme.ts`**. A isenção do eixo `soltos` é por sufixo de caminho, não por pasta: `src/skins.ts` reprova, `src/forma-theme.ts` passa. Na prática: tudo continua dentro de `src/theme.ts`.

---

## 2. Derivação

Documento entra, tokens saem. Tudo puro, tudo dentro de `src/theme.ts`, que **não importa nada** — `tools/contrast.mjs`, `tools/aparencia.mjs`, `tools/grade.mjs` e `tools/ritmo.mjs` importam este arquivo em node puro e medem exatamente o código que a tela desenha.

### Assinaturas

```ts
criarTema(a?: Aparencia): Tema                                  // já existe — a única porta
espacos(d: Densidade): Escala<keyof typeof SPACE>               // NOVO — substitui escalar()
forma(a: Aparencia, T: Paleta): Forma                           // NOVO — substitui RAIOS/BORDAS/ELEVACAO/VIDRO
accentOn(cor: string, chao?: string, min?: number): string      // já existe
accentSet(cor, chao?, p?): { text; mark; piece: {fill;ink} }    // já existe
pressedFill(fill: string, ink: string): string                  // já existe — CORRIGIR (§2.4)
secundariaDe(primaria: string, chao?: string): string           // já existe
separadas(a: string, b: string): boolean                        // já existe
contrast(a, b) · luminance(c) · shade(c, d) · withAlpha(c, a)   // já existem
```

`Tema` (o que `useTema()` devolve) permanece: `{ aparencia, T, SPACE, TYPE, TRACK, LEAD, FONT, MOTION, FORMA, primaria, secundaria, acento, acentoEm, errorInk, dockActiveMin }`.

### 2.1 Chão — DADO para os sete, `escada()` para o resto

**A recusa anterior caiu por medida, não por gosto.** Esta seção dizia "não haverá `escada()`" e fixava o teste de aceitação: *reproduzir dentro de ±0,5:1 a constante que ele substituiu*. Reproduzido — `escada(bg)` devolve os sete chãos à mão com ΔL* máximo de **7,0** (o pior é o `ink` do breu, branco puro à mão, o degrau menos sensível do conjunto) e com pisos **iguais ou melhores** que o dado: carvão sai de 4,52/3,01 (texto/divider) para 4,63/3,10. Varredura de **1.260 fundos livres** (12 matizes × 7 cromas × 15 claridades): 0 reprovam, pior texto 4,55, pior divider 3,05, `raised` sempre a ≥5 de L* do chão.

Os sete **continuam sendo DADO** e continuam sendo o que o app entrega a quem os escolheu: `escada()` só roda para hex livre. O gerador é **vigiado pelo dado** — uma seção do medidor cobra `|escada(semente) − CHAOS[nome]| ≤ 8` de L* em cada degrau — e não o substitui. Se ele substituísse, o padrão andaria e `.gate/telas.json` morreria junto.

Os nove degraus não são escolhidos, são **resolvidos**: deslocamento medido em L* como ponto de partida, e a tinta anda mais um pouco enquanto não limpar o piso contra o fundo mais difícil dos quatro.

**A janela** de L* é `[0, 22]` (escuro) e `[78, 94]` (claro), medida: entre 36 e 50 a escada não cabe nos dois sentidos (texto 4,44 e divider 2,97), e acima de 94 `raised` perde o degrau (ΔL* 4,5 em 95). Chão fora da janela **não é recusado: ele anda para dentro**, pela borda mais próxima, mantendo matiz e croma — a mesma lei de `accentOn`, a cor é do personal e a luz é a que o sistema sabe medir. Consequência deliberada: **a janela não é enforçada no Go**. Ter conta de L* em duas linguagens é a divergência que este produto mais paga caro; o servidor confere só a grafia do hex, e nenhuma aparência que ninguém mediu chega a ser representável porque o solver não sabe produzir uma.

`T = { ...CHAOS[chao], ok: chao.ink, accentFallback: primaria, pad: espacos(densidade).step }`.

### 2.2 Espaço — remapeamento de degrau, nunca multiplicação

`escalar()` (multiplicador + piso) sai. Ele fabrica número fora da escala (`arejada` dá `max: 78`, estourando o TETO 61 que o próprio arquivo declara como lei) e esmaga a razão hair→tight na compacta.

`espacos()` remapeia os **seis degraus fixos** que já existem. `hair` e `tight` são átomos de objeto e nunca andam; `max` é o TETO e nunca anda. Só o respiro entre blocos desloca:

| | hair | tight | step (`pad`) | block | room | max |
|---|---|---|---|---|---|---|
| `compacta` | 8 | 12 | **12** | **18** | **27** | 61 |
| `normal` | 8 | 12 | 18 | 27 | 41 | 61 |
| `arejada` | 8 | 12 | **27** | **41** | **61** | 61 |

Zero número novo, PISO e TETO respeitados por construção, `escala` intocado. O mapa tem que ser estritamente crescente — um `assert` de injetividade no autoteste, para que colapso de degrau vire erro de build em vez de aparência ruim.

### 2.3 `ALVO` — fora do alcance da densidade

Os 10 `minHeight` literais de hoje (44/48/52/56/62/64) viram um token:

```ts
export const ALVO = { minimo: 44, chip: 52, acao: 56, linha: 64 } as const;
```

`ALVO` **não participa** de `espacos()`. Densidade come padding, nunca área de toque. Sem essa trava, `compacta` piora `toques_serie`, `toques_convite`, `fila` e `inclinacao_lote` em silêncio, porque nenhum desses eixos mede altura de alvo diretamente.

### 2.4 Cor — o motor que já existe, com um furo a fechar

`accentOn` anda a luminosidade de 1/128 preservando matiz e saturação até bater o piso. `accentSet` devolve os três papéis: `text` (4,5:1), `mark` (3:1), `piece` (par preenchimento/tinta via `accentFill`, que não é exportado — o compilador é quem impede pintar área pela porta de trás).

**Furo medido:** em 3 de 20 marcas nos chãos escuros (`#ffff00`, `#ffffff`, `#00ffff`) e 4 de 20 nos claros, `|Δluminância|` entre `fill` e `pressedFill(fill, ink)` é **< 0,01** — `shade()` clampa em L=0/L=1 e devolve a mesma cor. O botão principal não responde ao dedo, e o gate não vê porque só mede se o rótulo continua legível durante o toque.

**Conserto (3 linhas):** `pressedFill` tenta afastar da tinta; se `shade` clampou (Δ < 0,02), anda **para** a tinta enquanto `contrast(ink, pressed) >= 4.5`. Há folga de sobra (branco sobre bg dá 20:1, cai para ~15:1). Par novo no medidor: `contrast(fill, pressedFill(fill, ink)) >= 1.1`.

**Toda tinta do sistema resolve contra o CHÃO DIFÍCIL — o pior dos quatro fundos.** Escrito no ciclo 7, porque `errorInk` era a única exceção e resolvia contra `T.bg`. O aviso é escrito dentro de uma Band (PerfilTime, Aparencia), ou seja sobre `surface`/`raised`, e media **4,42:1 e 4,13:1 no carvão, no padrão de fábrica**, contra o piso 4,5. `errorInk = accentOn(PERIGO, chaoDificil(…), 4.5)`, e `chaoDificil(T)` alimenta o piso do `accentOn` **e** o do `afastar` dentro de `criarTema`. A marca continua comparada como a tela a escreve (contra `T.bg`): quem muda de chão é o PISO do aviso, não o par que decide se as duas cores são duas. Régua: §26 do medidor — o aviso contra os quatro fundos, mais `folha.peca`/`folha.chrome`, mais a borda de erro do Campo sobre `folha.miuda`.

**A TINTA DESLIGADA É DO PAR DE AÇÕES, NUNCA DA PEÇA.** `Tema.secundario(fundo)` declara `desligada = accentOn(T.muted, pousa, 4.5)` nos três ramos; nenhum botão escolhe `T.muted` por conta. Onde `muted` já limpa o piso — todo `salto`, todo `eco`, o app de hoje inteiro — `desligada` **é** `muted`, sem andar um centésimo; onde não limpa, ela anda. Motivo medido: em `parelha` o segundo botão é preenchido e a tinta ativa dele vale exatamente 4,5:1 contra esse preenchimento, então `T.muted` cravado media **1,00:1 em 441 de 630** combinações. Casos em que a apagada chegaria mais FORTE que a ligada (21 paletas de chão claro, 0,04 de diferença) devolvem a ligada — degradação contínua, sem `if` de exceção. Régua: §27.

### 2.5 Segunda cor — derivada, com um papel só

`secundariaDe` já faz complementar dividida (+150°, saturação um degrau abaixo) e trata marca sem matiz (`s < 0.12` → separação por luminância, não por matiz inventado). `afastarPeca` já garante que as duas se separem **depois** de passarem pelo motor de peça — que é onde mora a armadilha: duas cores diferentes empurradas pelo mesmo piso contra o mesmo fundo chegam na tela iguais.

**O papel único da secundária, e ela não tem outro: SEGUNDA SÉRIE.** Onde duas coisas precisam ser distinguidas no mesmo peso dentro de uma figura. Nunca CTA, nunca dock, nunca massa. Verificável em uma linha: a secundária jamais entra em `useAccentMass`.

### 2.6 Forma — `forma(a, T)` derivando tudo

O app hoje tem uma família não-nomeada e cravada: zero `borderRadius` (o único hit é um `borderRadius: 0` explícito), zero sombra, borda 2 em 80 sítios, fio 1, separação por FUNDO (`T.raised`) e RESPIRO (`SPACE.block`). Isso é a família `reta`. O trabalho não é inventar forma — é nomear a que existe e pôr mais quatro ao lado passando na mesma régua.

```ts
export type Forma = {
  raio: number;        // superfície de conteúdo
  raioAcao: number;    // botão e chip
  raioRosto: number;   // avatar e iniciais (size/2 = círculo)
  borda: number;       // traço que DELIMITA — sempre divider ou ink
  fio: number;         // traço interno (sempre 1)
  recuo: number;       // margem lateral da superfície; 0 quando raio 0
  fundo: "bg" | "surface" | "raised";  // onde a superfície pousa
  sombra: number;      // opacidade; 0 salvo chão claro
  veu: number;         // alfa do vidro sobre o chão; 0 = sem vidro
  caixa: boolean;      // contorno: a caixa é o único delimitador
};
```

Regras de derivação:
- `raio` = `RAIOS[forma]` **clampado em `pad`** (`raio = min(RAIOS[forma].raio, T.pad)`). Uma linha, e o canto encolhe junto com a densidade em vez de brigar com ela: `compacta` + `pilula` sem isso é raio 18 com pad 12 e a primeira linha de texto entrando no arco.
- `borda` = `BORDAS[peso]` **clampado em `floor(SPACE.tight / 4)`**. Na compacta o `grosso` clampa sozinho para 2 — sem aviso e sem cardápio. Sem isso, `contorno` + `grosso` + `compacta` põe 2×3pt de traço num vão de 12: 50% do vão é tinta.
- `recuo` = `raio > 0 ? T.pad : 0`. Canto arredondado sangrando até a borda da tela lê como erro de recorte. Raio arrasta a grade junto — é por isso que ele não pode ser slider.
- `fundo` e `sombra` vêm de `superficie`, **redefinidos**. Hoje `elevacao` é uma opacidade de sombra preta que ninguém lê, e nos 4 chãos escuros (luminância do bg 0,000–0,004) sombra preta sobre preto não existe: `elevada` e `solida` renderizam idênticas. Elevação passa a ser **qual token de fundo a superfície ocupa**, e a sombra só entra onde ela pode existir:

| `superficie` | `fundo` | `sombra` | `veu` | `caixa` |
|---|---|---|---|---|
| `solida` | `raised` | 0 | 0 | false |
| `contorno` | `bg` | 0 | 0 | **true** |
| `elevada` | `raised` | `luminance(T.bg) > 0.5 ? 0.12 : 0` | 0 | false |
| `vidro` | `bg` | 0 | alfa que **compõe exatamente `T.raised`** sobre o chão | false |

O véu do vidro **não é cor nova**: ele alcança por alfa o mesmo `raised` que `tools/contrast.mjs` já mede, achatado para hex **antes** de chegar a qualquer prop (`rgb()` só parseia hex e engasga com `rgba`). O vidro muda a TEXTURA — o fio de luz no topo — nunca o VALOR da superfície. Sem isso, o chão sob o texto deixa de ser um dos quatro medidos e nenhum medidor do repo sabe olhar para um pixel composto.

### 2.7 Fio decorativo × fio que carrega

Traço que **separa ou delimita** é sempre `divider` (3:1 contra os quatro fundos) ou `ink`. Traço que só dá textura (o fio de luz do vidro, o realce no topo de uma superfície macia em chão escuro) pode ser alfa de tinta e não carrega informação nenhuma.

`hairline` mede 1,07–1,29:1 contra os quatro fundos nos 7 chãos. Ele é textura, não delimitador — e hoje `Metric.tsx` e `Screen.tsx` já o usam como fio de grade a 1,16:1. Uma família pode **acrescentar** textura; nunca **substituir** um token que carrega informação.

**`folha.*.aresta` é material e cai na mesma lei.** Ela é o fio de luz, alfa de tinta, cobrada em ≥5 de L\* e em nada mais. O ciclo 7 pagou a regressão de usá-la como delimitador: `borderTopColor: T.divider || chrome.aresta` no dock de `Screen.tsx` e na barra de `tabChrome.tsx` derrubou **44 de 112 pares abaixo de 3:1 — 11 dos 28 pares chão × superfície —, pior 1,22** (linho/vidro contra o conteúdo). As duas linhas voltaram a `T.divider`. Régua: §31, que **lê a expressão de `borderTopColor` do arquivo**, resolve contra o tema vivo e cobra 3:1 contra os dois lados; qualquer material posto ali reprova no ato.

### 2.8 Movimento

`MOVIMENTOS[a.movimento]` multiplica **só `state` e `enter`**. `press` fica cravado em 90 ms — é resposta de dedo, não animação; acima de ~100 ms o app fica "pesado" exatamente na alavanca vendida como premium. Mesma lei do PISO 8 do espaço. `turn` e `reveal` já não são multiplicados e continuam assim.

### 2.9 Ninguém pinta um degrau do chão dentro de uma Band

`T.raised`, `T.fill` e `T.hairline` são degraus contados a partir de `T.bg`. Peça que os pinta **dentro de uma superfície** está calibrada contra um fundo que não é o dela. Medido com a Band levantada (a decisão do dono aberta desde o ciclo 5): **42 de 140 combinações abaixo do piso de ΔL\* 5, e 30 somem por completo — ΔL\* 0,0**, a peça e o fundo dela no mesmo pixel. Todos os 56 casos de `T.raised` estão nas falhas.

O remédio é um ponto só, e funciona em folha de estilo e inline:

```ts
// src/ui/Screen.tsx
export const neutroNaBand = (t: Tema): string =>
  neutroSobre(RAISED_PADRAO ? t.FORMA.folha.peca.composto : t.T.bg, t.T);
```

Com a Band no chão ele devolve **exatamente `T.fill`** — 84 dos 140 pixels ficam idênticos byte a byte, e por isso a conversão não é uma decisão de gosto disfarçada. Régua: §32, em duas metades — (a) varredura de texto que calcula a profundidade de `<Band>` linha a linha e reprova `backgroundColor: T.raised|fill|hairline` que caia dentro (pega o sítio NOVO de amanhã); (b) medição de que o degrau separa ≥5 de L\* do fundo levantado nas 28 combinações e continua sendo `T.fill` no chão.

**O que falta no tema, e é pedido ao dono dele:** `degrauNeutro(fundo, alvo, p)` é privado; só `neutroSobre` (degrau do tamanho de `fill`, ΔL\* 15,2) é exportado. Não existe forma de pedir um degrau MENOR que `fill` — a linha "Você" da Liga passou de ΔL\* 6,6 para 14,9 contra o chão. Pela régua está correto (a peça existe nas 28 combinações); se o destaque de linha de lista dever ser mais discreto que a calha de um cronômetro, exportar `degrauNeutro` resolve sem alavanca nova.

Fora do alcance desta lei, por construção: peça que pousa no CHÃO (Ajustar `hero`, Retorno `swap`, Criacao `canvas`, Serie `setRow`, Base `useTone`), e a cor que é CONTEÚDO e não destaque (as amostras de paleta de `Aparencia.tsx`, que pintam `CHAOS[c].raised` — a escada daquele chão).

---

## 3. Arquitetura — o caminho de menor diff

O provider já está no lugar certo: `TemaDoTime` em `App.tsx`, **acima** do `NavigationContainer`, com `Casca` lendo `useTema()` para montar `criarNavTheme(tema)` e a `StatusBar`. Não desça o provider para `Phone`: cinco arquivos de boot/nav leem tema fora dele.

A troca por arquivo é de duas linhas, e o corpo do `StyleSheet` não muda uma vírgula — o parâmetro da fábrica `estilos()` se chama `T`, `SPACE`, `TYPE`, os mesmos nomes do import antigo:

```ts
const usarEstilos = estilos(({ T, SPACE }) => StyleSheet.create({ /* corpo idêntico */ }));
// dentro do componente:
const styles = usarEstilos();
```

**Os seis vazamentos que restam** — todos lêem constante de módulo, todos congelados no carvão, e nenhum deles é pego por `soltos` (não são hex literais):

| arquivo | o que congela | conserto |
|---|---|---|
| `src/ui/accent.tsx:2` | `accentSet` + `productTheme` de módulo em `useAccentMass` — **a massa dominante e o par DESLIGADO de todo botão do app** | `useTema()` |
| `src/screens/student/Pronto.tsx:3` | idem | `useTema()` |
| `src/nav/OwnerTabs.tsx:25` | `time.accent_color \|\| productTheme.accentFallback` | `useTema().primaria` |
| `src/nav/StudentTabs.tsx:37` | idem | `useTema().primaria` |
| `src/ui/motion.ts:10` | `MOTION.state` como default de `useTone`/`useEdgeTone` — 4 chamadores não passam duração, então `movimento` não os alcança | `duration` vira parâmetro **obrigatório**; os 4 chamadores passam `MOTION` do tema |
| `tools/shotHost.tsx:11,239` | `import App, { navTheme }` e `productTheme as T` no sheet — **o gate fotografa sempre carvão** | monta `TemaDoTime` nos 3 caminhos de render, `criarNavTheme(useTema())`, aparência vinda de `FX.aparencia` |

`App.tsx` deixa de exportar `navTheme` (só o shotHost consumia). O `styles.boot` continua lendo `productTheme.bg`: é pré-sessão, antes de existir documento — não é vazamento, é o único chão possível ali.

**Prévia ao vivo — mecanismo, não maquinaria nova.** `TemaDoTime` é contexto comum e aninha. O editor guarda o rascunho em `useState` e embrulha o bloco de prévia num segundo `<TemaDoTime aparencia={rascunho}>`, usando as peças reais (`Band`, `AccentCTA`, `Avatar`, `Choice`). A memoização é por `JSON.stringify` do documento, então mover o dedo no picker recria o tema — e `estilos()` guarda a folha em `WeakMap` por identidade de tema, então nada remonta a árvore.

**Uma coisa a apagar:** `accent: string` aparece 12 vezes nos `ParamList` de `src/nav/types.ts` e `time.accent_color || T.accentFallback` é re-derivado em 15 lugares. Com tema em contexto, uma tela empilhada antes da troca continua desenhando com o acento do param — divergência visível que nenhum medidor pega. Some tudo em favor de `useTema().primaria`.

---

## 4. Famílias de forma — o que cada uma muda em cada primitivo

Nenhum primitivo lê `Tema.FORMA` hoje. Este é o lote grande.

| primitivo | `reta` (padrão) | `macia` | `pilula` | `contorno` (superfície) | `vidro` (superfície) |
|---|---|---|---|---|---|
| `Screen.Band` | sangra, fundo `raised`, fio 2 embaixo | raio 12, recuo `pad`, sombra só em chão claro; no escuro separa por `raised` + fio de luz | raio 18, recuo `pad` | vira caixa de borda: `rule` colapsa para `none` (a caixa já fecha o bloco), **proibido aninhar caixa em caixa** | véu por alfa + fio de luz no topo |
| `Screen.Head` / `DockFooter` | fio 2 em `divider` | idem, sem raio (é chrome de borda a borda) | idem | idem | pode receber o véu; é o único lugar onde desfoque real caberia (fora de escopo) |
| `AccentCTA` | **cheio e opaco em TODAS as famílias.** Muda só `raioAcao` e a geometria. Botão primário de contorno ou de vidro é o jeito clássico de perder a ação: massa é o que ranqueia, e `accentFill` é o que garante 4,5:1 da tinta sobre o preenchimento. Os 5 números literais (`minHeight 56`, `padding 16/16`, `gap 12`, `marginTop 12`) viram `ALVO.acao` + `SPACE`. |
| `GhostCTA` | borda 2 | borda cai para 1 (borda 2 arredondada engorda) | borda 1 | — | fio de luz | **borda nunca vai a 0**: ela é o único affordance. |
| `Choice` | chip 52 quadrado, borda 2 | raio 12 | pílula (`raioAcao` = altura/2) | — | — | seleção continua sendo preenchimento opaco de `acento().piece`, nunca só o canto. `minHeight` → `ALVO.chip`. |
| `Avatar` / `Initials` | quadrado (canto reto é a linguagem da marca) | `raioRosto` 12 | **círculo** (`size/2`) | raio 4 | raio 18 | os dois já recebem `size` inline: custo zero. |
| `Metric` | grade de fios (`borderRight` 1 + `borderBottom` 1) | **fios somem**, divisão vira `SPACE.block` | idem | idem | idem | fio interno em cartão redondo lê como cartão mal cortado. É a decisão mais dura e a prova de que forma não é cosmético: muda a densidade da tela de números inteira. |
| `HoldTick` | `minHeight 64` → `ALVO.linha` | `raioAcao` | `raioAcao` | — | — |
| `Entity` | `borderRadius: 0` explícito → `FORMA.raio` |
| `nav/tabChrome` | aba ativa = fio 2pt no topo | **pastilha** (`acento().piece`) | pastilha | fio | pastilha | fio de topo reto é incompatível com raio. A marca da aba **não é alavanca vendida** — é derivada de `raio > 0`. Ver §5. |

**O que cada família é quando é premium, em uma linha:** `reta` é premium por PRECISÃO (um só raio, um só peso, nada flutua). `contorno` é premium com UMA borda e vão grande — por isso ele pede `arejada` como densidade padrão. `macia` é premium com UM raio no app inteiro e superfície recuada da borda; raios misturados é o sinal de template. `vidro` é premium pela BORDA (o fio de luz pegando o topo) e por existir algo atrás.

---

## 5. Garantia de premium — o medidor executável

`tools/aparencia.mjs` já existe, já importa `criarTema` (o mesmo código que a tela desenha, não uma segunda régua) e hoje mede **119.103 pares em 364 paletas com 0 reprovas** (eram 8.620 quando esta seção foi escrita; 32 seções). Ele **não está em `.gate/config.json:eixos`** — e é essa a razão de ele poder crescer sem quebrar nada e a razão de ele não valer nada ainda.

**A LEI DA RÉGUA, escrita no ciclo 7 e paga por três defeitos: a régua mede o pixel que a tela PINTA, não o token que o tema DECLARA.** Comparar objetos do tema prova que duas alavancas produzem valores diferentes; não prova que a tela usa a diferença. Foi assim que `elevada` ficou idêntica a `solida` em **24 dos 34 sítios** da folha miúda (Campo e Choice descartavam `aresta`, o único campo em que as duas diferem ali) com a §16 verde; que a legenda da Figure cravou `tone="dim"` e mediu **3,34:1** na célula preenchida; e que `FORMA.celula.tinta` foi medido em três modos e pintado em um.

Consequência de desenho, e ela é obrigatória para toda régua nova deste tipo: a seção **abre o arquivo de tela, tira os comentários, descobre o que a peça consome** (identificadores ligados à folha, expressão literal de `borderTopColor`, tom declarado em cada sítio de `note`, profundidade de `<Band>` linha a linha) e projeta o tema sobre esse conjunto. Corolário incômodo e deliberado: **esconder um token atrás de um helper importado cega o medidor.** Por isso o snippet do fio de luz está duplicado em Campo e em Choice, anotado no código. Se um dia forem cinco peças, o caminho é a régua seguir o import — nunca o inverso.

**Toda régua nova declara qual pergunta responde.** Contraste WCAG responde "dá para ler" (piso 4,5 texto / 3 UI). L\* responde "dá para VER que são duas superfícies" (piso 5). `ALVO` responde "o dedo alcança" (piso 44). Par que não nomeia a pergunta não entra.

**O que ele percorre hoje:** 7 chãos × 35 marcas (20 do `BRANDS` + as 10 do cardápio + 5 extremos) × 3 densidades × 3 formas para a seção de geometria. Exige: TEXTO 4,5:1 · UI 3:1 · a aba ativa domina a inativa (`dockActiveMin` = contraste da inativa × √2) · a segunda cor se separa da primeira **depois** do motor de peça · o aviso não se confunde com a marca · alvo ≥ 44pt · canto cabe na peça · piso do vão 8 · margem ≥ 12.

**O que ele passa a percorrer** (cada item é um par novo, no mesmo formato `par(onde, quem, oque, medido, minimo)`):

1. **toque visível** — `contrast(fill, pressedFill(fill, ink)) >= 1.1`. Reprova 7/20 marcas hoje; zera com o conserto de §2.4.
2. **fidelidade** — `|ΔL(hsl)|` entre `primaria` e `acento().piece.fill` ≤ 0,18. É o defeito central de um white-label e nenhum medidor existente o vê: os dois só perguntam se a cor contrasta, nunca se ela **ainda é ela**. Medido hoje: 40 de 140 combinações movem a luminosidade em mais de 0,25 (`#ffffff` em papel chega como `#707070`; `#000d3a` em carvão chega como `#3a66ff`). **Este medidor vai reprovar na primeira corrida.** Rode, publique o número, e só então decida o conserto — a saída barata é `acento()` deixar de devolver `text` quando o passeio excede o piso, e a marca aparecer só como `piece`.
3. **separação da tinta** — `separadas(acento().text, T.ink)` e `separadas(acento().text, T.muted)`. 8 de 20 marcas chegam acromáticas (saturação < 0,10) nos 7 chãos, e em 6/20 no carvão o acento-como-texto fica abaixo de 1,5:1 contra `T.ink`: "a marca do personal", "texto de corpo" e "cumprido" pousam na mesma luminância.
4. **superfície existe** — `contrast(FORMA.fundo, T.bg) >= 1.06` **ou** `FORMA.sombra > 0`. É o piso que os 4 chãos escuros entregam por token e que os claros não entregam (raised/surface = 1,035:1), forçando a sombra a ser obrigatória lá e proibida aqui.
5. **véu achata** — o hex composto do vidro é **exatamente** um dos quatro fundos medidos, e nunca chega `rgba` a uma prop de cor.
6. **geometria derivada** — `raio <= T.pad`, `borda <= floor(SPACE.tight/4)`, `ALVO.* >= 44` em todas as 3 densidades, `espacos()` estritamente crescente.

**A matriz de screenshot.** `telas` (36 telas × 20 marcas = 720 montagens), `ritmo` (41,9), `toques_serie`, `toques_convite`, `inclinacao_lote`, `fila` e `carga_perdida` são medidos em shots da aparência **padrão** — e densidade, forma e peso são exatamente o que mexe neles. Não varra o produto cartesiano: cada alavanca de geometria é **monótona**, então os dois extremos limitam o interior.

- **3 aparências** para os eixos de layout: `padrão` + `{compacta, pilula, grosso}` + `{arejada, reta, fino}`. `ritmo`/`fila`/`toques_*` tomam o **pior das três**.
- **1 aparência** para `telas`: ele checa montagem, não layout. Triplicar 720 montagens não compra nada.

**Fronteira de autoridade.** `tools/contrast.mjs`, `tools/brands.mjs`, `tools/medir.mjs`, `.gate/config.json` e `.gate/base.json` estão em `protegidos`/travados. Construir e rodar medidor é ato do agente; **registrar eixo é ato do humano**. Todo lote que produz número novo põe o número no `motivo` de `.gate/estado.json` e segue nos eixos que já têm catraca.

---

## 6. Persistência — o que muda na API

**O documento não persiste hoje.** `internal/owner/config.go` define `TimeConfig` com 8 campos e `PatchTimeConfig` **substitui o documento jsonb inteiro** com `json.Marshal` da struct após whitelist. `aparencia` não está na struct, logo qualquer salvamento de config **apaga** a aparência. O app lê `config.aparencia` de um campo que a API nunca grava.

Mudança mínima, **zero migration** (`studios.config` já é jsonb com `DEFAULT '{}'`):

```go
// internal/owner/config.go
type Aparencia struct {
    Chao       *string `json:"chao,omitempty"`
    Secundaria *string `json:"secundaria,omitempty"`   // "auto" ou #rrggbb
    Forma      *string `json:"forma,omitempty"`
    Superficie *string `json:"superficie,omitempty"`
    Peso       *string `json:"peso,omitempty"`
    Densidade  *string `json:"densidade,omitempty"`
    Movimento  *string `json:"movimento,omitempty"`
}
```

Sete campos — **`primaria` não entra**: ela é a coluna `accent_color`, que já tem `CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$')`, já é validada por `PatchTime` e já viaja no convite. Dois donos da mesma cor divergem.

`validaConfig` ganha um bloco de enum no mesmo estilo dos existentes (~25 linhas): cada campo contra sua lista fechada, `secundaria` contra `"auto"` ou a regex `hexColor` que já existe em `operacao.go`. Nada mais. Sem acoplamento entre campos — a fábrica derruba combinação ruim por construção, não por validação de servidor.

O resto do caminho já funciona: `auth.Time.Config` é `json.RawMessage` e repassa sem reinterpretar, então o documento viaja por `/v1/auth/verify` e `/v1/me` sem tocar em mais nenhum Go.

---

## 7. Editor — as telas do personal

**Uma tela nova**, empilhada a partir de `PerfilTime`. Não misture com o cardápio de operação que já está lá (liga, selos, xp, prontidão, passo, dias) — são decisões de produto, não de aparência.

`src/screens/owner/Aparencia.tsx`:
- **Presets** primeiro, em fila de `Choice`. O personal escolhe um e muda um; ele nunca começa de uma tela em branco. Cada preset é só o documento de 8 campos.
- **A cor**, com o grid de `ACCENT_CHOICES` que `PerfilTime` já monta (10 opções) + roda livre. É o único controle contínuo da tela inteira.
- **Seis filas de `Choice`**, uma por cardápio: chão (7), forma (3), superfície (4), peso (3), densidade (3), movimento (3). `secundaria` fica em "auto" e não aparece — ela vira controle só se alguém pedir, e o pedido não chegou.
- **A prévia**, embrulhada em `<TemaDoTime aparencia={rascunho}>`, com as peças reais: um `Head` com kicker, uma `Band raised` com um `Metric` de dois números, um `AccentCTA block`, uma fila de `Choice`, um `Avatar`. Nada de mock — se a prévia usar peça falsa ela mente.
- Um `AccentCTA` "Salvar", desligado enquanto o rascunho for igual ao gravado (o padrão que `PerfilTime` já usa).

Presets de fábrica:

| nome | documento |
|---|---|
| **Ferro** | carvão · reta · sólida · médio · normal · normal — **o app de hoje**, e o padrão. |
| **Clínica** | neve · reta · contorno · médio · arejada · seco — zero preenchimento, tudo caixa. A família mais barata de provar e a que mais rápido revela se `forma()` derrapou. |
| **Boutique** | papel · macia · elevada · fino · arejada · normal — sombra real (chão claro é o único lugar onde sombra existe), rosto redondo, `Metric` sem fio interno. |
| **Vitrine** | breu · pilula · vidro · fino · normal · generoso — véu por alfa em toda superfície com texto, fio de luz no topo. |
| **Garagem** | papel · reta · sólida · grosso · compacta · seco — borda 3, peso, nada flutua. |
| **Sereno** | linho · macia · sólida · fino · arejada · generoso — o caso extremo de propósito: se ele passa nos eixos e no crítico cego, o cardápio está fechado de verdade. |

---

## 8. Ordem de implementação

Lotes grandes e poucos, de propósito: `.gate/telas.json` é chaveado por `impressaoDoCodigo()` e **morre a cada edição de fonte** — o medidor lança em vez de remedir, e são 720 montagens por verificação. Commit pequeno e frequente faz o custo de medição dominar o turno.

---

### Lote 1 — ALICERCE: o tema vivo chega em 100% do pixel

**Entrega.** Trocar `chao` muda o app inteiro, inclusive dock, header de stack, massa do botão e spinner. O gate consegue fotografar outra aparência. Nenhuma alavanca nova, nenhum pixel muda no padrão.

**Arquivos.** `src/ui/accent.tsx` · `src/screens/student/Pronto.tsx` · `src/nav/OwnerTabs.tsx` · `src/nav/StudentTabs.tsx` · `src/ui/motion.ts` (+ os 4 chamadores sem duração: `Choice`, `Base`, `Compromisso`, `Descanso`) · `tools/shotHost.tsx` · `App.tsx` (remove o export `navTheme`) · `src/nav/types.ts` (some `accent: string` dos 12 ParamList).

**Prova.**
```
node tools/gate.mjs                      # 13 eixos: contraste 0, soltos 0, escala 2, telas 36
grep -rn "productTheme" src/ | grep -v theme.ts   # só App.tsx:styles.boot
node tools/shots.mjs --check
```
No aparelho: `PerfilTime` com um `chao: "papel"` forçado à mão em `aparenciaDoTime`. **Olhe o botão desligado do "Salvar"** — hoje ele é um bloco `#2d2b2b` preto sobre a tela clara, porque `useAccentMass` está congelado. Olhe também o dock e a transição entre duas telas empilhadas (era onde o `navTheme` de módulo pintava preto o vão).

---

### Lote 2 — RÉGUA: o medidor passa a ver o que estava cego

**Entrega.** `espacos()` no lugar de `escalar()`, token `ALVO`, `pressedFill` consertado, e 6 famílias de par novas em `tools/aparencia.mjs`. Puro `src/theme.ts` + uma ferramenta não-protegida: nenhuma tela muda, `.gate/telas.json` não é invalidado por lógica de layout.

**Arquivos.** `src/theme.ts` · `tools/aparencia.mjs` · os 10 `minHeight` literais → `ALVO`.

**Prova.**
```
node tools/aparencia.mjs                 # o número de "fidelidade" VAI aparecer — publique-o
node tools/medir.mjs contraste           # 0
node tools/medir.mjs escala              # 2  (ALVO não é fontSize)
node tools/gate.mjs
```
Ponha o número de `fidelidade` e o de `toque visível` no `motivo` de `.gate/estado.json`. **Registrar `aparencia` como eixo é ato do humano** — se ao fim do turno o único trabalho restante for esse registro, o estado terminal é `aguardando_humano`.

---

### Lote 3 — FORMA: os cinco registros chegam nos primitivos

**Entrega.** `forma`, `superficie` e `peso` param de ser knobs mortos. Os 80 `borderWidth` literais e o `borderRadius: 0` de `Entity` passam a ler `FORMA`.

**Arquivos.** `src/theme.ts` (`forma()`) · `src/ui/Screen.tsx` (`Band` é a superfície de todas as telas) · `AccentCTA` · `GhostCTA` · `Choice` · `Avatar` · `Initials` · `Metric` · `HoldTick` · `Entity` · `src/nav/tabChrome.tsx` (pastilha derivada de `raio > 0`; o `fontSize: 10` literal vira token no mesmo passo) · depois os `borderWidth` das 28 telas.

**Prova.**
```
node tools/aparencia.mjs                 # os 6 pares de geometria derivada, nas 9 combinações
node tools/gate.mjs
node tools/shots.mjs --check
```
No aparelho, **os 3 presets que mais forçam**: Clínica (`contorno` — a `Band` vira caixa e `rule` colapsa; procure caixa dentro de caixa), Boutique (`macia` + chão claro — a `Metric` perde o fio interno e a sombra tem que existir), Vitrine (`vidro` — o véu tem que achatar para `raised`, e o fio de luz tem que aparecer no topo). Rode `ritmo`/`fila`/`toques_*` nas 3 aparências extremas e tome o pior.

---

### Lote 4 — PERSISTÊNCIA: a API grava o documento

**Entrega.** O que o personal escolhe sobrevive ao próximo `PATCH /v1/owner/time`.

**Arquivos.** `linkgym-api/internal/owner/config.go` (struct `Aparencia` + bloco de enum em `validaConfig`). Nada mais — `auth.Time.Config` já é `json.RawMessage`, `src/api.ts` já tem `aparenciaDoTime`. Zero migration.

**Prova.**
```
go test ./internal/owner/...
curl -X PATCH .../v1/owner/time -d '{"config":{"aparencia":{"chao":"papel"},"liga":"nomes","xp":true}}'
curl .../v1/me      # aparencia sobrevive
curl -X PATCH ... -d '{"config":{"aparencia":{"chao":"roxo"}}}'   # 400
```
No aparelho: salve, mate o app, reabra. O chão continua. Depois salve **outra coisa** (liga, dias) e confirme que a aparência não sumiu — é exatamente esse o defeito de hoje.

---

### Lote 5 — EDITOR

**Entrega.** `src/screens/owner/Aparencia.tsx` com os 6 presets, o grid de cor, as 6 filas de `Choice` e a prévia ao vivo.

**Arquivos.** `src/screens/owner/Aparencia.tsx` (nova) · `src/screens/owner/PerfilTime.tsx` (a linha que empilha) · `src/nav/types.ts` · `src/nav/Root.tsx`.

**Prova.**
```
node tools/medir.mjs telas               # 37 (a tela nova monta limpa nas 20 marcas)
node tools/gate.mjs
```
No aparelho: mova o picker de cor com o dedo e **observe se a prévia acompanha sem engasgar** — a memoização é por `JSON.stringify` do documento e a folha de estilo é `WeakMap` por identidade de tema. Se engasgar, o culpado é o `memo` de módulo de `src/theme.ts` (Map sem teto, chaveado por `on|accent|ground|min`, com `JSON.parse` por leitura em `accentFill`), que sob picker ao vivo cresce por movimento do dedo. Conserto: teto no Map, ou `criarTema` resolvendo os ~22 hexes de uma vez e congelando.

---

### Lote 6 — SEGUNDA COR E MOVIMENTO

**Entrega.** As duas alavancas restantes ganham leitor. Pequeno de propósito: com o runtime de pé, é adicionar um campo ao objeto.

**Arquivos.** `src/ui/Figure.tsx` · `src/ui/Metric.tsx` · `src/screens/student/Progresso.tsx` (o único papel da secundária) · `src/ui/motion.ts` (`enter` vira token de TELA: item de lista responde com `state`, nunca com `enter` — 493 ms por linha num lote de 10 séries deixa a tela remexendo meio segundo depois de montada).

**Prova.**
```
node tools/aparencia.mjs                 # "segunda cor se separa da marca" nas 245 paletas
node tools/medir.mjs ritmo               # nas 3 aparências, pior das três
node tools/gate.mjs
```
No aparelho: `Progresso` com uma marca acromática (`#f3f2f2`, marca 12) — as duas séries têm que ser contáveis. E `Serie` com `movimento: "generoso"` — a lista não pode remexer depois de montada.

---

## 9. O que fica de fora, e por quê

- ~~**`escada()` gerando `CHAOS`.**~~ **REVOGADO no ciclo 6, por medida.** Ver §2.1: o gerador reproduz os sete dentro do próprio teste que esta seção exigiu e não os substitui. O que sobrevive da recusa é o essencial dela: `CHAOS` continua sendo dado.
- **`croma` e `modo` como campos.** Multiplicam o espaço para entregar o que "digite a cor do chão" agora entrega sozinho. Com chão livre, croma É o hex e modo É a claridade dele. Uma alavanca, não três.
- **`profundidade` (quanto os 4 fundos se afastam entre si).** Recusada no ciclo 6 com três motivos, e o primeiro basta: ela responde a MESMA pergunta que `superficie` — quanto a peça levanta do chão — e duas alavancas que produzem a mesma tela são uma alavanca e uma armadilha. Além disso o valor `rasa` (k 0,6) derruba ΔL*(raised,bg) abaixo do piso 5 quando o `bg` está na borda da janela, ou seja, não é premium em toda combinação; e o defeito que ela alegava consertar — `elevada` idêntica a `solida` no escuro — foi consertado de graça pelo fio de luz da `FORMA.folha`.
- **`relacao` com 5 opções para a segunda cor.** A segunda cor tem UM papel. Cardápio de 5 rotações é enfeite sobre um mecanismo que `secundariaDe` + `afastarPeca` já resolvem sem perguntar nada ao personal.
- **`perigo: "herdado"`.** Alavanca cujo modo ligado precisa de gate para ser permitido é alavanca que não deve existir. `criarTema` já resolve o caso sozinho: `errorInk` = `afastar(accentOn(PERIGO), accentOn(primaria))`, o aviso anda quando a marca é vermelha. Sem campo, sem exceção.
- **`Marca da aba ativa` como alavanca vendida.** Ela existiria só porque a mudança de geometria apagaria o par `dockActiveMin` do gate — manutenção de régua vazando para o cardápio do produto. Derive de `raio > 0 ⇒ pastilha` e mantenha o par medível.
- **`expo-blur` / desfoque real / `boxShadow`.** Dependência nova (e `experimentalBlurMethod` no Android, sem a qual o Android recebe tinta translúcida e não blur) para uma textura que o véu por alfa já entrega dentro do valor medido. Além disso `telas` roda em react-native-web no Chrome, que **renderiza `boxShadow` e ignora `elevation`**: o shot mostraria uma sombra que o Android não tem. Deslocamento e sombra, quando entrarem, entram por `shadowColor`/`shadowOffset` + `elevation` ou por uma View irmã, num lugar só.
- **Tipografia como cardápio.** O dono pediu; não entra nesta rodada porque nenhum eixo a vê: `escala` conta `fontSize` distintos (não muda), `contraste` mede cor (não muda), `telas` monta (monta). A forma correta, quando entrar, é **uma entrada de cardápio carregando um par** — `{display, texto, trackDelta, leadK}` — com `Txt` ligando o papel à família por tipo (`label`/`note`/`body` → `texto`; `value`/`hero`/`mega` → `display`), de modo que "display em corpo de texto" seja inexprimível e não desaconselhado. Par novo no medidor, sem montar tela: `LEAD[papel]/TYPE[papel] >= 1.2` e `|TRACK[papel] + trackDelta| <= 0.08 × TYPE[papel]`. **Não comece antes do Lote 3 pousar.**
- **Varrer `telas` nas 2.268 aparências.** 720 montagens × 2.268 é o turno inteiro para provar montagem, que não depende de aparência. As alavancas de geometria são monótonas: 3 aparências limitam o interior.
- **Editar `tools/contrast.mjs` ou ampliar `tools/brands.mjs`.** Protegidos. `contrast.mjs` continua medindo o carvão fixo e continua sendo a catraca `contraste = 0`; quem varre o espaço é `tools/aparencia.mjs`, que não é protegido e ainda não é eixo. Construir medidor é do agente, registrar eixo é do humano.
---

## 10. Ciclo 6 — o cardápio que entrou, e o que ficou de fora

> Quatro lentes desenharam a expansão; um dono só escreveu `Aparencia` e `criarTema()`. Números aqui saem de `node tools/aparencia.mjs` (49.038 pares, 0 reprovam) e de scripts descartáveis contra `src/theme.ts` em node puro.

### 10.1 Alavancas novas — seis linhas de cardápio

| campo | valores | régua que julga |
|---|---|---|
| `chao` | + hex livre | contraste (4,5 texto / 3 UI) e L* (raised ≥5 do chão), amostrados em 1.260 fundos |
| `acao` | + `empilhada` | geometria: `alturaAcao ≥ ALVO.acao` em toda voz e densidade (65–70 contra o piso 56); o par de simetria passa a percorrer 4 anatomias |
| `hierarquia` | `salto` · `parelha` · `eco` | L*: presença(primário) ≥ presença(secundário) × √2, e 4,5:1 do rótulo do segundo contra o preenchimento REAL dele |
| `anel` | `resgate` · `sempre` | contraste: anel ≥3:1 contra o chão **E** ≥1,3:1 contra o preenchimento — as duas no mesmo laço |
| `numero` | `empilhado` · `linha` · `cartaz` | CABIMENTO: `largura/colunas − 2·pad ≥ dígitos·TYPE·0,6 + folga + unidade` |
| `contraste` | `normal` · `alto` | contraste, como desigualdade contra o app de hoje: `alto` nunca mede menos que `normal` |

### 10.2 O que entrou DERIVADO — zero linha de cardápio, zero linha de whitelist

- **`FORMA.folha` (peca · chrome · miuda).** A regra de "como esta superfície se pinta" morava em três ternários divergentes fora do tema (`Screen.tsx`, `Metric.tsx`, `tabChrome.tsx`). Medido antes: `solida` e `elevada` saíam **idênticas byte a byte** em carvão, breu, grafite e tabaco, e **21 dos 42** pares de superfície colidiam no dock, que só perguntava `vidro`. Agora é um objeto por estrato, e o medidor lê o MESMO objeto que a tela pinta — par novo: nenhum par de superfícies pode produzir a mesma folha, em nenhum dos três estratos, em nenhum dos sete chãos.
- **O fio de luz que existia e era descartado.** `aresta` já era calculada para `elevada` e nenhum leitor a consumia fora do vidro. Régua: **L* ≥ 5** do fio composto contra a folha — e não 3:1, porque o fio não carrega informação e não se toca; quem responde "dá para ver que a peça tem altura" é L*, não a razão de contraste. Par novo: `elevada` tem **exatamente um** sinal de altura por chão (fio no escuro, sombra no claro) — dois traços na mesma aresta leem como erro de renderização.
- **`folha.tinta`.** A peça pequena preenchida não pode herdar `muted2` por descuido: ele é calibrado contra os quatro fundos e mede 4,52 contra `raised` com folga zero. A folha declara a tinta de apoio mais apagada que ainda escreve 4,5:1 sobre o composto dela, e o preenchimento da peça miúda anda de volta até `muted` voltar ao piso (medido: o degrau cheio derrubava `muted` para 3,66 no tabaco).
- **`separadasNoMatiz` no par marca × aviso.** Defeito em produção **no padrão de fábrica**: `PERIGO` e `APARENCIA_PADRAO.primaria` são a mesma cor, e `separadas` aceita 1,3 de razão como prova de separação — o que passa com Δmatiz **zero**. O estúdio escrevia erro num vermelho que era a própria marca 30% mais clara. Agora, com matiz a menos de 30° e croma real dos dois lados, exige-se **ΔL* ≥ 18**. Vale só neste par: a segunda cor tem outro trabalho (ser contável num gráfico) e ali 1,3 basta — endurecer `separadas` inteira reconciliaria 21 mil pares para consertar um.

### 10.3 Recusado, com o motivo

- **`superficie: tingida` e `tinte` (a marca como material do chão).** As duas produzem a MESMA tela — o app inteiro no matiz do estúdio — então são uma alavanca e uma armadilha. E nenhuma das duas é premium em toda combinação: com luminância travada a tinta vale **zero** onde o degrau já é branco ou preto puro (`raised` de papel, neve e linho; `bg` do breu), ou seja, `tingida` degeneraria para `solida` em 3 dos 7 chãos, que é exatamente o defeito que a folha acabou de consertar. `tinte` é pior: o modo monocromático que ela cria **não reprova em medidor nenhum deste repo** — a própria lente que a propôs escreveu que o teto de croma seria chute. Onde o número não julga, o cardápio não abre.
- **`profundidade`.** Ver §9.
- **`toque: recuo` (o botão cede sob o dedo).** O produto já vende `movimento`, e `press` foi deliberadamente tirado desse multiplicador porque é resposta ao corpo, não gosto — do mesmo jeito que o PISO 8 do espaço e o ALVO de 44pt. Uma segunda alavanca de movimento no mesmo pixel reabre uma decisão que a fábrica já fechou medida. Some-se: a metade tátil não existe sem `expo-haptics` (dependência proibida), e a escala de uma View com sombra escala a sombra no iOS e não escala o `elevation` no Android — divergência num estado que ninguém fotografa.
- **`lista` (a anatomia de uma pessoa na fila).** É a proposta de maior efeito e maior custo: peça nova (`src/ui/Linha.tsx`) mais sete telas reescritas. Feita pela metade, o tipo existe numa tela e o app fica incoerente, que é pior que não ter a alavanca. Volta como lote próprio, com os três eixos de fila (`fila`, `inclinacao_lote`, `toques_convite`) rodados nos três tipos.
- **`serie` (a anatomia da semana).** O valor real da proposta é a UNIFICAÇÃO dos dois desenhos de semana (`Progresso` BAR=62 e `Painel` BAR=46, dois códigos para o mesmo dado) — e unificação não precisa de alavanca para acontecer. Uma alavanca cujo argumento é "vem de graça depois da unificação" é a unificação pedindo para ser feita.
- **`prosa`.** Dois dos três valores são governados por regras fora do medidor: `citada` tem que degenerar para `corrida` dentro da superfície `contorno` (barra vertical dentro de caixa = dois delimitadores para um bloco), e `assinada` vale **uma vez por tela**, o que é regra de chamador que medidor nenhum pega.
- **Slot de ícone livre no botão.** `check` codifica SEMÂNTICA — "esta ação conclui" contra "esta ação avança" — e semântica não é do personal.
- **`sucesso`, `informacao`, `aviso` como cores do personal.** O `ok` já foi verde e colapsou em `ink` por decisão registrada; um quarto e um quinto matiz estouram o orçamento de acento. E `perigo` fica fora da mão do personal **para sempre**: um estúdio pintando a dor de verde passaria em contraste, em `separadas` e em `nomeDaCor`, e nenhuma régua deste repo acusaria. É a única customização que troca legibilidade por risco.

### 10.4 REFUTADO por medida: "o dock de vidro não tem o que desfocar"

Defeito aberto desde o ciclo 3. Fica **fechado como refutado**, e o caminho que ele pedia fica proibido com número. Fazer o conteúdo correr por baixo da barra é barato em layout (`insetPorPagar` já é o único funil) e **caro em legibilidade**: o alfa real do véu mede 0,069–0,082 nos quatro chãos escuros e 0,62 nos três claros; com conteúdo real por baixo, o contraste do rótulo inativo do dock cai de **4,52 para 1,04** (um CTA de acento passando embaixo, no carvão). O alfa necessário para segurar 4,5:1 contra o pior fundo é **0,867–0,933** nos sete chãos — acima do `VEU_MAX` 0,62, acima do qual não é vidro, é parede pintada. **Vidro que exige parede não é vidro.** Se um dia alguém quiser vidro de verdade, o caminho medido não é mexer no véu: é a página pintar o fundo (folha sobre scrim), porque só aí o pior pixel é conhecido.

### 10.5 O que a próxima fase tem que fazer (o tema está pronto, a tela não)

`criarTema()` já devolve tudo abaixo e **nenhum primitivo lê ainda**. Enquanto isso não pousar, quatro alavancas do cardápio estão vendidas e não aparecem — e é isso, não o tema, que fecha o ciclo.

1. `Screen.tsx`, `Metric.tsx` e `tabChrome.tsx` param de re-derivar a superfície e passam a ler `FORMA.folha.{peca,chrome,miuda}`. O fio de luz da folha **colide** com `rule="strong"` e com `accentTop`, que moram na mesma aresta: um dos três, nunca dois.
2. As sete cópias do campo de texto, mais `Choice` e `GhostCTA`, viram UM primitivo que lê `folha.miuda` e `folha.miuda.tinta` — e perdem os quatro `fontSize: 18` cravados à mão, que são os dois literais que a catraca `escala` conta.
3. `AccentCTA` lê `FORMA.acao.empilha` e `FORMA.acao.anel`; o anel entra **sempre no layout** (borda transparente quando não pintado), o que mata o pulo de 2pt do rótulo; e o carregando ocupa a coluna que a anatomia já declara, com `accessibilityState={{ busy }}` em vez de anunciar "desativado" — hoje `Aparencia.tsx` e `PerfilTime.tsx` já calculam "Salvando…" e o componente joga a frase fora.
4. `GhostCTA` passa a receber o FUNDO onde pousa e a chamar `T.secundario(fundo)`; sem isso, `parelha` dentro de uma Band levantada pousa com metade do degrau — o defeito que `neutroSobre` existe para consertar. Ganha também `tom="perigo"` (borda e tinta em `errorInk`, nunca área), declarado pela TELA e não pelo cardápio: quem sabe que uma ação destrói é a tela.
5. `MetricGrid` pede as colunas a `FORMA.numero.colunas(pedidas, largura, dígitos)` — passando o número REAL de algarismos da maior célula — e `Figure` obedece a `FORMA.numero.modo`/`rotuloAbaixo` (a prop `labelBelow` já existe e nenhuma tela passa).
6. `tabChrome.tsx` tira o `BlurView` de onde não há o que desfocar (§10.4) e passa a responder às quatro superfícies pela folha do chrome.

---

## 11. Ciclo 7 — os oito defeitos, e a régua que impede a volta

> Relato completo, um bloco por defeito com o número medido e os dentes: **`docs/aparencia/CICLO-7.md`**.

Ciclo de conserto: **zero linha de cardápio nova**. Oito defeitos achados por crítico
adversarial, nenhum deles visível no medidor de 93.840 pares — três porque o par aferia um
objeto que a tela tinha deixado de pintar (ver a LEI DA RÉGUA, §5).

| # | defeito | número sob a regra velha | régua nova |
|---|---|---|---|
| 1 | `errorInk` resolvido contra `bg` e escrito sobre `surface`/`raised` | 4,42 e **4,13:1** no padrão de fábrica · 1.519 pares | §26 |
| 2 | tinta desligada escolhida na peça, não no par de ações | **441/630** em `parelha`, pior 1,00 · 735 pares | §27 |
| 3 | véu do vidro ignorava `muted2` | pior **3,36:1**, 9+9 chãos livres · 30 pares | §28 |
| 4 | `elevada` ≡ `solida` na folha miúda (Campo, Choice) | **24 de 34 sítios**, 15/86 pares | §29 |
| 5 | `note` da Figure cravava `tone="dim"` na célula preenchida | **14/84**, pior 3,34 | §30(a) |
| 6 | `FORMA.celula.tinta` medido em 3 modos, pintado em 1 | **21/28** | §30(b) |
| 7 | `aresta` (material) usada como delimitador nas duas molduras | **44/112**, 11/28 pares chão×superfície, pior 1,22 | §31 |
| 8 | degrau do chão pintado dentro de uma Band | **42/140**, 30 em ΔL\* 0,0 · 5 sítios em 4 telas | §32 |

**Prova agregada:** as sete seções novas rodadas contra o `src/theme.ts` de antes dos consertos
de tema → **2.284 de 119.103 pares reprovam**; contra o código de hoje → 0. A regra velha não é
uma segunda conta escrita à mão: é o próprio arquivo com os consertos revertidos.

**Invariante intacto:** `criarTema()` sem argumento sai byte a byte idêntico — snapshot JSON do
tema inteiro antes/depois, **0 linhas diferentes**.

**O que ficou pedido ao dono do tema** (nenhum implementado por conta própria, todos com o
número no CICLO-7): exportar `degrauNeutro` para existir degrau menor que `fill` (§2.9);
encolher `FORMA.celula.tinta` para os modos `fio` e `caixa`, onde ele é de fato separador; e um
segundo sinal de estado para o `eco` desligado, que hoje é indistinguível do ligado porque o
piso de 4,5:1 come o único degrau que sobrava.
