// Tokens Modernist do LinkGym. ZERO import: tools/contrast.mjs importa este arquivo em
// node puro (o tipo é tirado na hora). Não adicione dependência aqui.

export const FONT = "Archivo_800ExtraBold";

/** A VOZ TIPOGRÁFICA. É a alavanca que muda mais a personalidade do app por caractere de
 *  código — e a mais fácil de estragar, porque "escolha a fonte" é o pedido que produz
 *  Comic Sans em produto sério. Por isso o cardápio é de PARES CURADOS, nunca de fonte
 *  livre: cada voz traz uma face de DISPLAY (número, título, herói) e uma de TEXTO
 *  (rótulo, nota, corpo), já casadas em peso e largura.
 *
 *  A escala de corpos não muda com a voz — TYPE continua sendo os mesmos seis degraus, e a
 *  catraca `escala` continua contando dois. O que muda é o DESENHO da letra.
 *
 *  `bloco` é o app de hoje: uma face só, Archivo ExtraBold, em tudo. Trocar de voz não
 *  pode reescrever o padrão. */
export type Voz =
  | "bloco"
  | "neutra"
  | "tecnica"
  | "editorial"
  | "suave"
  | "condensada";

export type ParDeFontes = {
  /** título e herói */
  display: string;
  /** rótulo, nota, corpo */
  texto: string;
  /** O NÚMERO. Tem face própria porque o produto inteiro é um número — carga, série,
   *  cronômetro, recorde — e número que DANÇA a cada dígito é defeito, não estilo. Só
   *  entra aqui face com `tnum` (dígito de largura fixa), lido do TTF e não suposto:
   *  Playfair, Nunito e Oswald não têm, e nelas o `tabular-nums` que o Txt pede desde
   *  sempre era um pedido no vazio. */
  numero: string;
  /** altura de CAIXA ALTA da face de display, em em. Lida do OS/2 do arquivo. */
  cap: number;
  /** altura de CAIXA ALTA da face do NÚMERO, em em.
   *
   *  Existe porque `cap` sozinha estava corrigindo a óptica dos degraus errados. `value`,
   *  `hero` e `mega` desenham na face do NÚMERO (ver Txt.tsx), e vinham sendo escalados
   *  pela caixa alta do DISPLAY. Na voz condensada isso saía caro e visível: a caixa alta
   *  0,81 do Oswald encolhia dígitos que são de Archivo em 15%, e a voz lia como "bloco,
   *  só que menor" em vez de ler como condensada. Cada degrau agora é corrigido pela
   *  métrica da face que ele realmente desenha. */
  capNumero: number;
  /** altura de X da face de texto, em em. */
  x: number;
  /** a maior linha natural do par, em em (ascender - descender + gap do hhea). */
  linha: number;
  /** correção de tracking do par, somada ao TRACK do degrau. Face estreita pede mais ar,
   *  face larga pede menos: sem isto, trocar a voz estraga o ritmo da linha. */
  ajuste: number;
  /** O GRAU DA VOZ: quanto ela fala mais alto que a referência, no NÚMERO e no TÍTULO.
   *
   *  Esta é a alavanca que faltava, e a falta dela foi o defeito. A correção óptica acima
   *  existe para que trocar a voz não mude o tamanho aparente — e o efeito colateral era
   *  que voz nenhuma PODIA mudar de tamanho. Seis opções saíam com o mesmo número, no
   *  mesmo corpo, e o dono escreveu "letras, todas basicamente iguais". Ele tinha razão:
   *  o tamanho é o canal mais alto da tipografia e estava travado em 1.
   *
   *  Multiplica só o TÍTULO e o NÚMERO, nunca o rótulo nem o corpo. Assim ele move a
   *  RAZÃO herói:rótulo — que é o que se lê como personalidade — sem mexer na densidade de
   *  leitura de um parágrafo, que não é gosto. `bloco` é 1 por definição: é a referência. */
  grau: number;
  /** A CAIXA DO RÓTULO. Canal binário e impossível de confundir num sample de polegar —
   *  o único que não depende de o olho reconhecer um desenho de letra. */
  caixa: "alta" | "natural";
  /** tracking SÓ do rótulo, separado do `ajuste` do par. A legenda (`note`) fica de fora
   *  de propósito: o par rótulo/legenda usa tracking como um dos seus dois canais, e somar
   *  aqui e lá mataria o par. Ver o bloco `note` em Txt.tsx. */
  trackRotulo: number;
};

/** A REFERÊNCIA ÓPTICA é o Archivo, que é a voz de hoje: assim `bloco` sai com
 *  multiplicador 1 e o padrão não anda um pixel. */
const CAP_REF = 0.686;
const X_REF = 0.526;

export const VOZES: Record<Voz, ParDeFontes> = {
  // O PRODUTO. A face de texto é `500Medium` e NÃO a ExtraBold do display: o app inteiro
  // desenhava rótulo, corpo e legenda no mesmo ExtraBold do herói, o que é a razão de
  // fundo de tudo ler com o mesmo peso. Uma face de texto tem que ter para onde o título
  // subir.
  bloco: {
    display: FONT,
    texto: "Archivo_500Medium",
    numero: FONT,
    cap: 0.686,
    capNumero: 0.686,
    x: 0.526,
    linha: 1.088,
    ajuste: 0,
    grau: 1,
    caixa: "alta",
    trackRotulo: 0,
  },
  // A face mais bem resolvida do repo em métrica: caixa alta 0,728, altura de x 0,546 e
  // `tnum` presente. Fala BAIXO — grau 0,92, rótulo em caixa natural, número em 600 e não
  // em 700. É a voz de software: quer que se leia o dado, não a fonte.
  neutra: {
    display: "Inter_700Bold",
    texto: "Inter_400Regular",
    numero: "Inter_600SemiBold",
    cap: 0.728,
    capNumero: 0.728,
    x: 0.546,
    linha: 1.21,
    ajuste: 0,
    grau: 0.92,
    caixa: "natural",
    trackRotulo: 0,
  },
  // PAINEL DE INSTRUMENTO: número grande e pesado sobre rótulo fino e espaçado. O 300Light
  // no corpo contra o 700Bold no número é a maior distância de peso do cardápio.
  tecnica: {
    display: "SpaceGrotesk_700Bold",
    texto: "SpaceGrotesk_300Light",
    numero: "SpaceGrotesk_700Bold",
    cap: 0.7,
    capNumero: 0.7,
    x: 0.486,
    linha: 1.276,
    ajuste: 0.2,
    grau: 1.06,
    caixa: "alta",
    trackRotulo: 0.8,
  },
  // REVISTA. Playfair Black no título, itálico no corpo, caixa natural no rótulo. O número
  // fica em Inter porque Playfair tem `lnum` e não tem `tnum` — mas com grau 1,15 e um
  // título Didone em cima, ninguém mais confunde esta voz com a neutra, que era
  // literalmente a mesma imagem antes deste ciclo.
  editorial: {
    display: "PlayfairDisplay_900Black",
    texto: "Inter_400Regular_Italic",
    numero: "Inter_700Bold",
    cap: 0.708,
    capNumero: 0.728,
    x: 0.546,
    linha: 1.333,
    ajuste: 0.1,
    grau: 1.15,
    caixa: "natural",
    trackRotulo: 0,
  },
  // REDONDA E CALMA. Nunito não tem feature de dígito nenhuma, então o número cai numa
  // face tabular — mas cai no `500Medium`, não no ExtraBold do produto: um número leve é
  // o que faz esta voz ser a mais baixa do cardápio, junto do grau 0,88.
  suave: {
    display: "Nunito_900Black",
    texto: "Nunito_400Regular",
    numero: "Archivo_500Medium",
    cap: 0.705,
    capNumero: 0.686,
    x: 0.484,
    linha: 1.364,
    ajuste: 0.1,
    grau: 0.88,
    caixa: "natural",
    trackRotulo: 0.3,
  },
  // ESTREITA E ALTA, a voz de cartaz. O corpo TAMBÉM é Oswald: era Archivo, e uma voz
  // chamada condensada cujo texto não é condensado só é condensada no título. O número é
  // o Archivo `900Black` — o mais pesado do cardápio — porque Oswald não tem `tnum` e um
  // cronômetro que dança a cada dígito é defeito, não estilo.
  condensada: {
    display: "Oswald_600SemiBold",
    texto: "Oswald_400Regular",
    numero: "Archivo_900Black",
    cap: 0.81,
    capNumero: 0.686,
    x: 0.578,
    linha: 1.482,
    ajuste: 0.4,
    grau: 1.2,
    caixa: "alta",
    trackRotulo: 0.6,
  },
};


/** Escala tipográfica fechada. Razão 1,5 — seis degraus para o app inteiro.
 *  Consequência que o Whoop mede e esta razão entrega de graça: a UNIDADE fica exatamente
 *  dois degraus abaixo do seu número (1/1,5² = 0,44 ≈ os ~45% medidos em `85%`).
 *  A razão herói:rótulo aqui é 61:12 ≈ 5,1 — a referência do eixo 3 mede 4,2 numa tela de
 *  comemoração; `value` (41:12 ≈ 3,4) e `hero` cercam esse valor. */
export const TYPE = {
  label: 12,
  body: 18,
  title: 27,
  value: 41,
  hero: 61,
  mega: 92,
} as const;

/** O DEGRAU DA UNIDADE — dois abaixo do número, que é o que a razão 1,5 entrega de graça.
 *  Mora aqui, e não dentro da Figure, porque o medidor precisa da MESMA tabela para provar
 *  a folga por voz, e uma segunda cópia dela seria uma régua que a tela não usa. */
export const UNIDADE_DE = { value: "body", hero: "title", mega: "value" } as const;

/** A FOLGA ENTRE O NÚMERO E A UNIDADE, e o único lugar onde ela é decidida. Era o literal
 *  `gap: 6` da Figure: o mesmo vão ao lado de um número de 12pt e de um de 92pt — no papel
 *  `mega` a unidade descolava do algarismo e lia como palavra solta ao lado dele.
 *  Proporcional ao corpo, na mesma família de conta que a Figure já usa para a TrendMark,
 *  e ancorada no app de hoje: 0,15 × 41 = 6, exatamente o vão que a tela desenha desde
 *  sempre no degrau `value`. Trocar a voz encolhe o corpo e encolhe a folga junto. */
export const folgaDaUnidade = (corpo: number) => Math.round(corpo * 0.15);

/** A LARGURA DE UM DÍGITO TABULAR, em em. É o que falta para responder a pergunta que
 *  nenhum eixo do gate faz hoje: o número CABE na coluna? (`escala` conta fontSize,
 *  `contraste` mede cor, `telas` só pergunta se montou.) As faces com `tnum` deste repo
 *  medem entre 0,55 e 0,62 — 0,6 é o conservador, e conservador é o certo aqui porque o
 *  preço de errar para menos é o algarismo cortado na tela de alguém. */
export const AVANCO_DO_DIGITO = 0.6;

/** ESCALA DE ESPAÇO, fechada, com PISO e TETO — a irmã deitada de TYPE.
 *
 *  Não é uma escala nova: é a MESMA razão 1,5 da tipografia, um degrau abaixo dela. Espaço
 *  e corpo saem do mesmo gerador, então um vão nunca cai entre dois tamanhos de texto sem
 *  parentesco com nenhum dos dois. Eram 338 números de espaçamento soltos em src/.
 *
 *  PISO 8 — `label` dividido pela razão. Nada no app encosta a menos disto em outra coisa:
 *    o medidor achava vãos de 1pt e 3pt entre blocos, que é o "colado um no outro" do dono.
 *    Abaixo de 8 não existe separação, existe defeito de renderização.
 *  TETO 61 — `hero`. Nenhum respiro DECLARADO passa disto: um vazio maior que o maior
 *    número da tela não é respiro, é buraco. O que sobra além do teto não vira padding de
 *    ninguém — vira crescimento de superfície (`<Band grow>`), que é vazio COM DONO.
 *
 *  Os seis degraus, e o que cada um separa:
 *    hair  8 — duas linhas do MESMO objeto (rótulo e número, número e legenda).
 *    tight 12 — irmãos dentro de um bloco (a fila de escolhas, ícone e palavra).
 *    step  18 — margem do conteúdo (`pad`) e respiro curto entre blocos.
 *    block 27 — respiro INTERNO de superfície: é o que faz o vazio pertencer a alguém.
 *    room  41 — entre seções que não se pertencem.
 *    max   61 — TETO. */
export const SPACE = {
  hair: TYPE.label / 1.5,
  tight: TYPE.label,
  step: TYPE.body,
  block: TYPE.title,
  room: TYPE.value,
  max: TYPE.hero,
} as const;

/** O CHÃO: dez degraus nomeados, do fundo à tinta. Não é uma escala de cinza qualquer —
 *  é a única coisa no app que decide onde cada superfície pousa e o que ainda se lê em
 *  cima dela. Por isso mora aqui como DADO, verificado, e não como fórmula em que é
 *  preciso acreditar: `tools/contrast.mjs` mede os dez contra os quatro fundos, em todos
 *  os chãos, e reprova quem raspa o piso.
 *
 *  A regra de cada degrau, para quem for desenhar o próximo:
 *    bg/dock/surface/raised — os QUATRO fundos. Tudo que se escreve, se escreve num deles.
 *    hairline/fill — traço mudo e preenchimento neutro; não carregam texto sozinhos.
 *    divider — todo traço e toda borda do app. 3:1 contra os quatro fundos, sem exceção.
 *    muted2/muted/ink — as três tintas. 4,5:1 contra os quatro fundos, sem exceção.
 *
 *  `carvao` é o app de hoje, byte a byte: trocar o chão não pode reescrever o padrão. */
export const CHAOS = {
  carvao: {
    bg: "#0b0a0a",
    dock: "#0f0e0e",
    surface: "#141312",
    raised: "#1c1a19",
    hairline: "#232120",
    fill: "#2d2b2b",
    // divider subiu de #444141: reprovava 3:1 como elemento de UI nos QUATRO fundos.
    divider: "#696565",
    // muted2 subiu de #7d7979: reprovava 4,5:1 como texto em surface, dock e raised.
    muted2: "#868181",
    muted: "#9b9797",
    ink: "#f3f2f2",
  },
  breu: {
    bg: "#000000",
    dock: "#060606",
    surface: "#0d0d0d",
    raised: "#151515",
    hairline: "#1c1c1c",
    fill: "#282828",
    divider: "#666666",
    muted2: "#828282",
    muted: "#999999",
    ink: "#ffffff",
  },
  grafite: {
    bg: "#0d0e10",
    dock: "#101214",
    surface: "#141619",
    raised: "#1a1d20",
    hairline: "#202327",
    fill: "#2a2e33",
    divider: "#67717e",
    muted2: "#828c99",
    muted: "#99a0ab",
    ink: "#f4f5f6",
  },
  tabaco: {
    bg: "#0f0d0b",
    dock: "#14110f",
    surface: "#1a1613",
    raised: "#221e1a",
    hairline: "#2a2420",
    fill: "#372f29",
    divider: "#77675a",
    muted2: "#968273",
    muted: "#a99a8e",
    ink: "#f5f3f2",
  },
  // Os três claros invertem a ordem sem inverter a lei: `raised` continua sendo a
  // superfície que mais se afasta do chão — no claro, para o branco.
  //
  // Eles foram RECORTADOS: a primeira versão media, em L* (luz perceptual, não razão de
  // contraste), METADE do degrau do carvão — surface +2,0 e raised +3,4 contra +3,1 e
  // +6,6. Consequência no pixel: superfície levantada que não levanta, e o app claro lendo
  // como uma folha lisa com texto em cima. Agora cada degrau daqui tem exatamente o mesmo
  // ΔL* do carvão, e `divider` deixou de ser MAIS pesado no claro do que no escuro (era
  // -44,4 contra +40,3, e traço escuro sobre fundo claro já pesa mais no olho).
  papel: {
    bg: "#eeece8",
    dock: "#ebe8e4",
    surface: "#f7f5f3",
    raised: "#ffffff",
    hairline: "#d5cfc6",
    fill: "#cac1b5",
    divider: "#877e70",
    muted2: "#696257",
    muted: "#544e45",
    ink: "#191715",
  },
  neve: {
    bg: "#eaedef",
    dock: "#e7e9ec",
    surface: "#f4f6f7",
    raised: "#ffffff",
    hairline: "#cbd1d6",
    fill: "#bdc4cb",
    divider: "#78808a",
    muted2: "#5d646b",
    muted: "#4a5056",
    ink: "#161719",
  },
  linho: {
    bg: "#ededec",
    dock: "#eae9e7",
    surface: "#f5f5f4",
    raised: "#fffffe",
    hairline: "#d2d0cd",
    fill: "#c6c2bf",
    divider: "#827e7b",
    muted2: "#656260",
    muted: "#514e4c",
    ink: "#181717",
  },
} as const;

export type NomeDoChao = keyof typeof CHAOS;
export type Chao = (typeof CHAOS)[NomeDoChao];

/** O vermelho do PERIGO. Não é o acento do personal e nunca vai ser: se fosse, o time que
 *  escolheu verde escreveria erro em verde. Sai daqui e passa pelo mesmo motor de tinta. */
const PERIGO = "#ec3013";

export const productTheme = {
  // O chão é bg — o mesmo rootViewBackgroundColor de app.json. surface/raised sobem dele.
  ...CHAOS.carvao,
  // ponytail: `ok` era #7ee0a1 — verde semântico, que este produto não pode ter (é o
  // acento do time 19 e matiz nunca significa "bom" aqui). Colapsou em ink: cumprido é
  // marcado por PRESENÇA de tinta, não por cor. A chave fica porque tools/contrast.mjs
  // a lê; some quando o gate parar de pedi-la.
  ok: CHAOS.carvao.ink,
  accentFallback: PERIGO,
  // A margem do conteúdo é um degrau da escala, não um número à parte: era 20, que não
  // pertencia a nenhum sistema. Sai daqui a distância de todo texto à borda da tela.
  pad: SPACE.step,
} as const;

/** A paleta que chega na tela. Campos de `string` e não de literal de propósito: o chão
 *  é escolhido em tempo de execução, e um tipo literal aqui trancaria a fábrica no
 *  carvão. */
export type Paleta = {
  bg: string;
  dock: string;
  surface: string;
  raised: string;
  hairline: string;
  fill: string;
  divider: string;
  muted2: string;
  muted: string;
  ink: string;
  ok: string;
  accentFallback: string;
  pad: number;
};

/** A paleta que o personal escolhe no white-label. Mora AQUI porque a catraca `soltos`
 *  proíbe cor literal fora deste arquivo — e é o certo: cor é decisão de sistema, não de
 *  tela. Cada cor passa por accentOn/accentSet na hora de pintar, então os casos extremos
 *  (branco, quase-preto) continuam legíveis nos quatro fundos. */
/** O CARDÁPIO DA MARCA: oito famílias de matiz, três tons cada, mais três neutros.
 *
 *  Eram dez cores soltas, e o dono chamou a variedade de horrível. A resposta óbvia —
 *  "então põe cinquenta" — foi MEDIDA e é pior: passando cada candidata pelo motor de
 *  peça (`accentMassa`) nos sete chãos e perguntando ao `separadasNoMatiz` do próprio app
 *  se as duas ainda chegam como duas cores, o cardápio começa a mentir cedo.
 *
 *    10 cores (o de antes) .................... 1 colisão no pior chão
 *    12 matizes, um tom cada .................. 6
 *    12 matizes, dois tons .................... 19
 *    24 matizes, três tons .................... 173
 *
 *  A causa é uma lei que já estava escrita neste arquivo: `separadas` exige 40° de matiz,
 *  e 360/40 = 9 é o teto de FAMÍLIAS. Acima disso a fila cresce e a escolha não.
 *
 *  O que a medida também mostrou é onde o teto NÃO está: a 45° de distância entre
 *  famílias, 100% das colisões acontecem DENTRO de uma família e nenhuma entre duas. Ou
 *  seja, família é de graça e tom é o que custa — e o tom para em três:
 *
 *    8 famílias x 5 tons ...................... 3 colisões no pior chão
 *    8 famílias x 4 tons ...................... 1
 *    8 famílias x 3 tons ...................... 0   <- é aqui que o motor para de mentir
 *
 *  Daí 27: 8 x 3 + 3 neutros, zero colisão nos sete chãos, e 24 nomes distintos em
 *  `nomeDaCor` — que é o outro teto, porque um cardápio com mais resolução que o nomeador
 *  entrega duas cores com o mesmo nome falado ao leitor de tela.
 *
 *  A ordem é família a família, tom escuro -> claro, e a tela lê isso: oito fichas de
 *  família primeiro, três tons depois. Ele vê nove coisas e alcança vinte e sete.
 *  `tools/aparencia.mjs` varre esta constante inteira, então uma cor ruim reprova sozinha
 *  no dia em que entrar. */
export const ACCENT_CHOICES = [
  "#881807", "#e75740", "#eaccc8",
  "#887907", "#e7d440", "#eae6c8",
  "#368807", "#7ee740", "#d4eac8",
  "#078838", "#40e780", "#c8ead5",
  "#077788", "#40d1e7", "#c8e5ea",
  "#071688", "#4054e7", "#c8ccea",
  "#590788", "#aa40e7", "#ddc8ea",
  "#880756", "#e740a7", "#eac8dd",
  "#121111", "#808080", "#f3f2f2",
] as const;

/** As oito famílias, na ordem do cardápio. Cada uma abre três tons — os três hexes
 *  consecutivos de `ACCENT_CHOICES` a partir de `i * 3`. Os três neutros fecham a fila e
 *  não têm família porque não têm matiz: são o preto, o cinza e o branco. */
export const FAMILIAS_DA_MARCA = [
  "Vermelho",
  "Amarelo",
  "Verde-limão",
  "Verde",
  "Turquesa",
  "Azul",
  "Roxo",
  "Rosa",
] as const;
export const TONS_DA_FAMILIA = ["escuro", "vivo", "claro"] as const;

/** AS CORES DE ROSTO — o cardápio da ALUNA, que não é o do personal.
 *
 *  Ela não escolhe uma marca; escolhe uma cor para o próprio rosto na lista. Vinte e sete
 *  fichinhas ali é uma parede: `tools/rolagem.mjs` contou 37 alvos de toque no Perfil dela
 *  contra um teto de 30, e a maior parte vinha daqui — o cardápio da marca cresceu de 10
 *  para 27 no ciclo 9 e esta tela herdou os 27 sem ninguém pedir.
 *
 *  São o tom VIVO de cada família mais os três neutros: onze cores que o próprio motor do
 *  app já prova separadas duas a duas nos sete chãos, porque famílias distam 45° e a
 *  medida do ciclo 9 mostrou que colisão só acontece DENTRO de uma família. Escolha de
 *  rosto não precisa de profundidade de tom; precisa de onze cores que ninguém confunde. */
export const CORES_DE_ROSTO = [
  ...FAMILIAS_DA_MARCA.map((_, i) => ACCENT_CHOICES[i * 3 + 1]),
  ...ACCENT_CHOICES.slice(FAMILIAS_DA_MARCA.length * 3),
] as const;

/** A COR LIVRE, que a doc vende desde sempre ("livre + 10 sugestões") e o app não tinha:
 *  só existia a fila fechada acima. A marca do personal é DELE, e quem garante a
 *  legibilidade é `accentSet`/`accentOn` contra o chão real — nunca o cardápio, que é
 *  sugestão. A regra de aceitação mora aqui, ao lado do resto das decisões de cor, porque
 *  a tela que digita e o medidor que prova têm que usar a MESMA: duas cópias divergem, e
 *  a que diverge é sempre a que o servidor recusa. Devolve `#rrggbb` minúsculo — a grafia
 *  que a API exige — ou "" quando o que foi digitado não é cor. */
/** O NOME da cor, para quem não a enxerga.
 *
 *  O seletor anunciava "Cor #ec3013" ao leitor de tela. Um hexadecimal ditado dígito a
 *  dígito não é nome de cor: é ruído com seis sílabas, e a pessoa escolhe a marca do
 *  próprio estúdio no escuro. O mesmo seletor existe em duas telas do dono e uma do aluno.
 *
 *  O nome é DERIVADO, e não tabelado, por um motivo que a tabela não resolve: a cor LIVRE
 *  também precisa de nome, e cardápio nenhum alcança uma cor digitada. Matiz, saturação e
 *  claridade decidem — e as dez sugestões caem exatamente onde deveriam cair. */
export function nomeDaCor(cor: string): string {
  const [h, s, l] = toHsl(rgb(cor));
  // Sem croma não há matiz para nomear: é a família do cinza, e ela se separa pela
  // claridade, que é a única coisa que a pessoa vai perceber ali.
  if (s < 0.12) return l > 0.85 ? "branco" : l > 0.6 ? "cinza claro" : l > 0.25 ? "cinza" : "preto";
  const setores: [number, string][] = [
    [15, "vermelho"], [45, "laranja"], [70, "amarelo"], [160, "verde"],
    [200, "turquesa"], [245, "azul"], [285, "roxo"], [345, "rosa"], [360, "vermelho"],
  ];
  const base = setores.find(([ate]) => h < ate)?.[1] ?? "vermelho";
  // "Escuro"/"claro" só entram quando mudam a resposta: um vermelho no meio da escala é
  // vermelho, e adjetivo em toda cor vira ruído de novo.
  if (l < 0.3) return `${base} escuro`;
  if (l > 0.72) return `${base} claro`;
  return base;
}

export function corLivre(digitado: string): string {
  const limpo = digitado.trim();
  return /^#?[0-9a-fA-F]{6}$/.test(limpo)
    ? "#" + limpo.replace("#", "").toLowerCase()
    : "";
}

/** Um letter-spacing por degrau, e nada além disto. Eram 27 valores soltos. */
export const TRACK = {
  label: 1.3,
  body: -0.2,
  title: -0.7,
  value: -1.4,
  hero: -2.4,
  mega: -4,
} as const;

export const LEAD = {
  label: 16,
  body: 26,
  title: 32,
  value: 42,
  hero: 58,
  mega: 86,
} as const;

/** Linguagem de movimento (eixo 3, medido em GIF de blog — ordem de grandeza, não spec).
 *  O QUE ANIMA: o número e o fundo.
 *  O QUE NUNCA ANIMA: o rótulo (mesmo corpo e mesma posição do primeiro ao último quadro)
 *  e o botão — ele APARECE, não salta. Por isso não existe mais `translateY` no toque:
 *  estado é mudança de tom no MESMO elemento.
 *  Curvas em tupla de bézier porque este arquivo não importa Reanimated (ver src/ui/motion.ts). */
export const MOTION = {
  press: 90,
  state: 220,
  enter: 340,
  turn: 3700,
  reveal: 5900,
  ease: [0.2, 0, 0, 1],
  /** A RESPIRAÇÃO de um elemento parado — o pulso que diz "estou esperando você". Estava
   *  cravado em 1100ms dentro de `Entity.tsx`, e sem curva nenhuma: caía no padrão do
   *  Reanimated, que é `inOut(quad)`, a curva de app de template. */
  respira: 1100,
  /** A troca de um passo por outro dentro da MESMA tela. Estava cravado como
   *  `FadeIn.duration(180)` numa linha só do D0. */
  troca: 180,
  /** AS DUAS MOLAS. Uma peça que MONTA (o corpo do D0 se assumindo) e uma que se AJUSTA
   *  (a mesma peça respondendo a um número novo) não podem usar a mesma mola — montar tem
   *  que assentar mais devagar, senão a peça pisca pronta.
   *
   *  Estavam as duas escritas à mão no mesmo arquivo, com números diferentes e nenhum
   *  nome: quem lesse `{ damping: 14, stiffness: 90, mass: 0.9 }` seis linhas depois de
   *  `{ damping: 16, stiffness: 140, mass: 0.8 }` não tinha como saber se a diferença era
   *  intenção ou descuido. Aqui a diferença tem nome, e `tools/tempo.mjs` garante que a
   *  próxima nasça aqui também. */
  molaAjuste: { damping: 16, stiffness: 140, mass: 0.8 },
  molaMonta: { damping: 14, stiffness: 90, mass: 0.9 },
} as const;

// ---------------------------------------------------------------------------
// Cor derivada. Mora aqui, e não num src/ui/color.ts, porque este arquivo não importa
// nada: `tools/contrast.mjs` o importa em node puro e mede o MESMO código que a tela usa,
// sem acreditar em ninguém. UM lugar decide tinta e acento; os componentes obedecem.

type RGB = [number, number, number];

function chan(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function rgb(color: string): RGB {
  let h = color.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6); // ponytail: alfa ignorado, nenhum token usa
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

export function luminance(color: string): number {
  const [r, g, b] = rgb(color);
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// HSL só existe para andar na luminosidade sem mexer no matiz do personal.
function toHsl([r, g, b]: RGB): [number, number, number] {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

function fromHsl(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t: RGB =
    h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
    : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c]
    : h < 300 ? [x, 0, c]
    : [c, 0, x];
  return (
    "#" +
    t
      .map((v) =>
        Math.round(Math.max(0, Math.min(1, v + m)) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** Mesma cor, um empurrão na luminosidade. É assim que o toque responde: tom no MESMO
 *  elemento, nunca um pulo de posição. */
export function shade(color: string, delta: number): string {
  const [h, s, l] = toHsl(rgb(color));
  return fromHsl(h, s, Math.max(0, Math.min(1, l + delta)));
}

/** Achata uma cor translúcida sobre um fundo. Existe porque medidor nenhum deste repo
 *  sabe olhar para um pixel COMPOSTO: `rgb()` só parseia hex. Toda superfície de vidro
 *  entrega também o hex que ela vale sobre o chão, e é esse hex que o gate mede. */
export function compor(frente: string, alfa: number, fundo: string): string {
  const [rf, gf, bf] = rgb(frente);
  const [rb, gb, bb] = rgb(fundo);
  const mix = (f: number, b: number) => Math.round(f * alfa + b * (1 - alfa));
  return (
    "#" +
    [mix(rf, rb), mix(gf, gb), mix(bf, bb)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function withAlpha(color: string, a: number): string {
  const [r, g, b] = rgb(color);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const memo = new Map<string, string>();
const STEP = 1 / 128;

/** Acento de EXIBIÇÃO. O acento cru é do personal e pode ser o próprio fundo (time 13),
 *  ou quase (4, 6, 10, 11, 18). Aqui matiz e saturação dele são preservados e SÓ a
 *  luminosidade anda, até o piso de contraste contra o fundo onde a marca será desenhada.
 *  `min`: 3 para traço e preenchimento, 4.5 para texto. */
export function accentOn(accent: string, ground: string = productTheme.bg, min = 3): string {
  const key = `on|${accent}|${ground}|${min}`;
  const hit = memo.get(key);
  if (hit) return hit;
  let out = accent;
  if (contrast(accent, ground) < min) {
    const [h, s, l0] = toHsl(rgb(accent));
    const dir = luminance(ground) < 0.18 ? 1 : -1;
    for (let i = 1; i <= 128; i++) {
      const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
      out = fromHsl(h, s, l);
      if (contrast(out, ground) >= min || l === 0 || l === 1) break;
    }
  }
  memo.set(key, out);
  return out;
}

/** O MOTOR do acento em área: superfície preenchida + a tinta que escreve nela. NÃO é
 *  exportado — se fosse, qualquer tela entraria por aqui e pintaria área sem passar pelo
 *  orçamento, que é exatamente o buraco que existia enquanto isto tinha `export`.
 *  As duas portas nomeadas são `accentSet().piece` (peça pequena e repetida) e
 *  `useAccentMass` (massa dominante da tela, contada uma por tela).
 *  Se NENHUMA das duas tintas do produto alcança o piso, quem anda é o acento. */
/** O fundo DIFÍCIL de uma paleta: aquele que o acento encontra por último quando anda.
 *  No chão escuro o acento clareia, então o difícil é o mais claro dos quatro (`raised`,
 *  que era o número cravado aqui). No chão claro ele escurece, e o difícil é o mais
 *  escuro. Limpar o piso contra ESTE limpa contra os quatro — a garantia que a prop
 *  cravada dava de graça no escuro e perdia calada no claro. */
function chaoDificil(p: Paleta): string {
  const chaos = [p.bg, p.dock, p.surface, p.raised];
  const subindo = luminance(p.bg) < 0.18;
  return chaos.sort((a, b) => (subindo ? luminance(b) - luminance(a) : luminance(a) - luminance(b)))[0];
}

function accentFill(
  accent: string,
  p: Paleta = productTheme,
  min = 4.5,
): { fill: string; ink: string } {
  const key = `fill|${accent}|${p.bg}|${min}`;
  const hit = memo.get(key);
  if (hit) return JSON.parse(hit) as { fill: string; ink: string };

  // Duas regras, uma peça. Primeiro o preenchimento tem que EXISTIR contra o chão — senão
  // o botão do time 13 é um retângulo invisível com texto solto em cima.
  const surface = accentOn(accent, chaoDificil(p), 3);
  const inks: string[] = [p.ink, p.bg];
  const best = inks
    .map((ink) => ({ ink, c: contrast(ink, surface) }))
    .sort((a, b) => b.c - a.c)[0];

  let out: { fill: string; ink: string } = { fill: surface, ink: best.ink };
  if (best.c < min) {
    const [h, s, l0] = toHsl(rgb(surface));
    let win: { fill: string; ink: string; d: number } | null = null;
    for (const ink of inks) {
      // afasta o acento DA tinta: tinta clara escurece o acento, tinta escura clareia.
      const dir = luminance(ink) > luminance(surface) ? -1 : 1;
      for (let i = 1; i <= 128; i++) {
        const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
        const cand = fromHsl(h, s, l);
        if (contrast(ink, cand) >= min) {
          const d = Math.abs(l - l0);
          if (!win || d < win.d) win = { fill: cand, ink, d };
          break;
        }
        if (l === 0 || l === 1) break;
      }
    }
    if (win) out = { fill: win.fill, ink: win.ink };
  }
  memo.set(key, JSON.stringify(out));
  return out;
}

/** Tinta do aviso de erro. Era `T.accentFallback` cru repetido em 18 telas; passa pelo
 *  sistema como qualquer outro acento — e o chão dele é o DIFÍCIL, não `bg`. O aviso é
 *  escrito tanto na rolagem quanto dentro de Band levantada, e resolver contra UM dos
 *  quatro fundos enquanto se pinta nos quatro é exatamente o furo que `chaoDificil`
 *  existe para fechar. */
export const errorInk = accentOn(PERIGO, chaoDificil(productTheme), 4.5);

/** A MASSA — o único elemento por tela que pinta área com o acento — tem uma regra
 *  DIFERENTE da peça, e é por isso que ela ganhou motor próprio.
 *
 *  A peça é pequena e repetida (chip, avatar de 34px): ela precisa existir sozinha contra
 *  o chão, então o motor ANDA com a cor até ela se separar. O custo disso é o matiz: no
 *  chão claro, uma marca amarela (#ffd400) era escurecida até #9f8400 — oliva. O personal
 *  escolhia amarelo e o app dele mostrava outra cor. Numa peça de 34px é o preço a pagar;
 *  no BOTÃO PRINCIPAL, que é a marca dele em tamanho grande, é uma traição.
 *
 *  Aqui a ordem se inverte: primeiro a TINTA (o rótulo é inegociável), e o preenchimento
 *  fica na cor da marca. Se ele não se separar do chão, a peça ganha um ANEL — a mesma cor
 *  andada até 3:1, desenhada como borda. É o que qualquer sistema sério faz com marca de
 *  matiz claro sobre fundo claro, e é o contrário de repintar a marca de alguém.
 *
 *  `piece` continua como estava, e de propósito: é ele que `tools/contrast.mjs` mede. */
function accentMassa(
  accent: string,
  p: Paleta = productTheme,
  min = 4.5,
  anel: Anel = "resgate",
): { fill: string; ink: string; ring: string } {
  const key = `massa|${accent}|${p.bg}|${min}|${anel}`;
  const hit = memo.get(key);
  if (hit) return JSON.parse(hit) as { fill: string; ink: string; ring: string };

  const inks = [p.ink, p.bg];
  let fill = accent;
  let melhor = inks
    .map((ink) => ({ ink, c: contrast(ink, fill) }))
    .sort((a, b) => b.c - a.c)[0];
  if (melhor.c < min) {
    const [h, sat, l0] = toHsl(rgb(accent));
    let venceu: { fill: string; ink: string; d: number } | null = null;
    for (const ink of inks) {
      const dir = luminance(ink) > luminance(fill) ? -1 : 1;
      for (let i = 1; i <= 128; i++) {
        const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
        const cand = fromHsl(h, sat, l);
        if (contrast(ink, cand) >= min) {
          const d = Math.abs(l - l0);
          if (!venceu || d < venceu.d) venceu = { fill: cand, ink, d };
          break;
        }
        if (l === 0 || l === 1) break;
      }
    }
    if (venceu) {
      fill = venceu.fill;
      melhor = { ink: venceu.ink, c: contrast(venceu.ink, venceu.fill) };
    }
  }
  const chao = chaoDificil(p);
  // DUAS condições no MESMO laço, e não uma de cada vez. O anel tem que existir contra o
  // chão (3:1, o piso de elemento de UI) E se separar do PREENCHIMENTO — resolver só a
  // primeira devolve a própria cor do preenchimento nos 130 pares medidos em que ele já
  // limpa o chão sozinho: anel a 1,00:1, invisível, uma alavanca vendida que não aparece
  // em 62% das marcas. Resolver uma de cada vez faz a segunda desfazer a primeira, como o
  // comentário do `aviso` em criarTema já avisa.
  const sirvo = (c: string) => contrast(c, chao) >= 3 && contrast(c, fill) >= 1.3;
  let ring = contrast(fill, chao) >= 3 ? "" : accentOn(fill, chao, 3);
  if (anel === "sempre" && (!ring || !sirvo(ring))) {
    const [h, sat, l0] = toHsl(rgb(fill));
    ring = "";
    busca: for (let i = 1; i <= 128; i++) {
      for (const dir of [1, -1]) {
        const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
        const cand = fromHsl(h, sat, l);
        if (sirvo(cand)) {
          ring = cand;
          break busca;
        }
      }
    }
  }
  const out = { fill, ink: melhor.ink, ring };
  memo.set(key, JSON.stringify(out));
  return out;
}

/** ORÇAMENTO DE ACENTO, metade um: os papéis do acento que NÃO são a massa dominante.
 *    `text`  — o acento escrevendo (4,5:1). Sem limite: não é área.
 *    `mark`  — traço fino, marca pequena, ponteiro (3:1). Sem limite: não é área.
 *    `piece` — par preenchimento/tinta de PEÇA: elemento pequeno e REPETIDO cujo estado é
 *              o próprio acento (o chip de 52 px da Choice, o avatar de 34–54 px da
 *              Initials). Sem limite, e de propósito: o eixo 1 diz que pares repetidos no
 *              mesmo tamanho ranqueiam em vez de competir. Uma peça só vira massa quando
 *              cresce — e aí ela é a massa da tela, e o caminho é `useAccentMass`.
 *  O papel que NÃO está aqui é a MASSA — área preenchida que domina a tela. Ela só existe
 *  via `useAccentMass` (src/ui/accent.tsx), que conta um por tela e grita no segundo.
 *  `accentFill` não é exportado, então "pintar área sem passar por uma destas portas" não
 *  compila: eram Choice e Initials entrando pela porta de trás sem o gate acusar. */
export function accentSet(
  accent: string,
  ground: string = productTheme.bg,
  p: Paleta = productTheme,
) {
  return {
    text: accentOn(accent, ground, 4.5),
    mark: accentOn(accent, ground, 3),
    // `piece` ignora `ground` de propósito: accentFill já garante o piso contra o fundo
    // difícil da paleta, e portanto contra os quatro.
    piece: accentFill(accent, p),
  };
}

/** A aba ativa do dock não pode EMPATAR com as inativas. O piso dela não é 4,5:1 (o
 *  mínimo de TEXTO): é o contraste da inativa vezes √2 — um degrau inteiro acima, tirado
 *  do próprio token e não chutado. Com 4,5 o time 13 entregava 4,53 na ativa contra
 *  5,02 do muted2 das inativas: a barra ficava com a hierarquia invertida. Vive aqui
 *  porque tools/contrast.mjs mede exatamente este número. */
export const dockActiveMin =
  contrast(productTheme.muted2, productTheme.dock) * Math.SQRT2;

/** Tom do toque: AFASTA o preenchimento da sua tinta, então o rótulo nunca perde contraste
 *  enquanto o dedo está em cima.
 *
 *  O furo que isto fecha: `shade` grampeia em L=0 e L=1. Marca branca, amarela ou ciano já
 *  está no teto de luz — afastar da tinta escura pedia clarear o que não clareia mais, e a
 *  função devolvia a MESMA cor. O botão principal dessas marcas não respondia ao dedo, e
 *  nenhum medidor via: o gate só perguntava se o rótulo continuava legível durante o
 *  toque, e continuava — porque nada acontecia. Quando o caminho de fora acaba, o tom anda
 *  PARA a tinta, o tanto que a legibilidade permite. */
export function pressedFill(fill: string, ink: string): string {
  const fora = luminance(ink) > luminance(fill) ? -1 : 1;
  const visivel = (c: string) => contrast(c, fill) >= 1.06 && contrast(ink, c) >= 4.5;
  // 0,07 primeiro, sempre: é o passo de hoje, e o padrão do produto não pode mudar de tom
  // por causa de um conserto de caso extremo. Só quando ele NÃO produz mudança visível o
  // passo cresce — e, esgotado o lado de fora, o tom anda para dentro, até onde a
  // legibilidade do rótulo permite.
  for (const lado of [fora, -fora]) {
    for (const passo of [0.07, 0.1, 0.14, 0.2, 0.28]) {
      const cand = shade(fill, lado * passo);
      if (visivel(cand)) return cand;
    }
  }
  return shade(fill, fora * 0.07);
}

// ---------------------------------------------------------------------------
// A APARÊNCIA. Este é o documento que o personal edita, e é a única entrada da fábrica.
//
// A promessa do dono é dupla e as duas metades brigam: customização TOTAL e resultado
// ULTRA PREMIUM em qualquer combinação. Só existe um jeito de servir as duas — CARDÁPIO
// FECHADO onde o olho humano erra (chão, forma, densidade, movimento) e DERIVAÇÃO onde a
// escolha certa é calculável (tinta sobre acento, segunda cor, tom do toque). Sobra livre
// só o que é da marca e ninguém pode escolher pelo personal: a cor primária.
//
// Toda combinação possível é um produto cartesiano FINITO — 7 chãos x 3 formas x 4
// superfícies x 3 pesos x 3 densidades x 3 movimentos = 2.268 aparências, e cada uma com
// qualquer primária. `tools/aparencia.mjs` percorre isso inteiro e reprova o que raspa o
// piso. É essa a diferença entre "dá para customizar" e "customizar não estraga".

/** COMO A SUPERFÍCIE SE SEPARA DO CHÃO, e nenhuma das seis respostas é COR — o defeito
 *  que o dono nomeou é que o app troca de aparência trocando tinta, e material nenhum.
 *    solida   — degrau de luz.
 *    contorno — nenhum fundo, só o traço que delimita.
 *    elevada  — degrau de luz mais o sinal de altura (fio no escuro, sombra no claro).
 *    vidro    — véu translúcido POR CIMA do desfoque do que passa atrás.
 *    fio      — moldura DUPLA: o delimitador na borda de fora e um segundo traço numa
 *               caixa interna, afastada dele. Os dois nunca dividem a mesma aresta (a
 *               §2.7 mediu 44 de 112 pares abaixo de 3:1 no ciclo 7 exatamente por isso),
 *               e o de dentro é material — não delimita nada. É GEOMETRIA e não luz:
 *               entrega o mesmo desenho no chão claro e no escuro.
 *    vinco    — o avesso de `elevada`: o fio de luz desce para a aresta DE BAIXO, que é
 *               onde um rebaixo pega a luz que vem de cima, e no chão claro a sombra sai
 *               por cima em vez de por baixo. Mesma folha, direção invertida. */
/** O PORTE DA AÇÃO — o piso de altura do botão principal, em pontos.
 *
 *  O dono pediu isto duas vezes. Primeiro perguntando ("esses botoes grandes eu sinto que
 *  faz muito sentido, mas dimunuir eles um pouco nao deixaria mais ultra premium?") e
 *  depois afirmando, com três botões empilhados na frente ("nunca que isso aqui e ultra
 *  premium, isso e ia slop").
 *
 *  A alavanca só desce, e nunca até o chão: `justo` para em 48, quatro pontos acima do
 *  alvo de dedo de 44 com que a Apple e o Material concordam, então nenhuma escolha do
 *  personal consegue produzir um botão difícil de acertar. E o TETO é o tamanho de hoje —
 *  crescer não é oferta. Se `folgado` passasse de 56, o teto de `tools/botao.mjs` teria que
 *  virar função do porte, e "folgado + arejada + empilhada" traria de volta, calada, a laje
 *  de 100pt que este ciclo acabou de matar. Um número que a régua conhece vale mais que uma
 *  opção a mais no cardápio. */
export type Porte = "justo" | "padrao" | "folgado";

export type Superficie =
  | "solida"
  | "contorno"
  | "vidro"
  | "elevada"
  | "fio"
  | "vinco"
  | "carimbo"
  | "nenhuma";

/** OS SEIS MATERIAIS, como LISTA e não só como tipo.
 *
 *  O tipo some na compilação, e por causa disso `tools/aparencia.mjs` carregava a mesma
 *  lista escrita à mão em seis lugares. Quando `fio` e `vinco` entraram no cardápio, a
 *  varredura continuou medindo quatro: dois materiais chegariam à tela do personal sem um
 *  par medido, no medidor cujo trabalho é garantir que nenhuma combinação seja feia. E não
 *  reprovou nada, que é pior que reprovar — silêncio lido como aprovação.
 *
 *  A lista mora aqui, ao lado do tipo, e o `satisfies` garante que os dois nunca divirjam:
 *  material novo no tipo e fora da lista não compila. */
export const SUPERFICIES = [
  "solida",
  "contorno",
  "vidro",
  "elevada",
  "fio",
  "vinco",
  "carimbo",
  "nenhuma",
] as const satisfies readonly Superficie[];

export type NomeDaForma = "reta" | "macia" | "pilula";
export type Peso = "fino" | "medio" | "grosso";
export type Densidade = "compacta" | "normal" | "arejada";
export type Movimento = "seco" | "normal" | "generoso";
/** A FORÇA DAS TINTAS contra os fundos. Não é "modo acessibilidade" pendurado ao lado: é
 *  a MESMA escada do chão com outro multiplicador, e ele só SOBE. Piorar contraste não é
 *  um valor de cardápio, então o pior caso desta alavanca é o app de hoje.
 *  O multiplicador para nas seis tintas e NÃO alcança o acento: se ele empurrasse
 *  accentOn/accentMassa, a marca do personal seria repintada em nome da acessibilidade —
 *  que é exatamente a traição que accentMassa e o anel existem para impedir. */
export type Contraste = "normal" | "alto";
/** A DISTÂNCIA ENTRE AS DUAS AÇÕES. O personal não escolhe o peso do botão principal —
 *  ele escolhe QUANTO o segundo botão recua. Peso do primário não é alavanca e está
 *  medido: primário contornado joga fora a garantia de massa e matiz do `accentMassa`, e
 *  vira o mesmo objeto que o secundário nas 10 telas em que os dois dividem a tela.
 *    salto   — o app de hoje: primário cheio na marca, secundário em caixa contornada.
 *    parelha — o secundário ganha massa neutra, DERIVADA da presença do primário.
 *    eco     — o secundário mantém a caixa, mas a borda cai para o fio e o rótulo desce
 *              um degrau de tinta. */
export type Hierarquia = "salto" | "parelha" | "eco";
/** O ANEL DA AÇÃO CHEIA: hoje ele é loteria da MARCA, não escolha do personal — nasce só
 *  quando o preenchimento não se separa do chão a 3:1, o que acontece em 80 de 210 pares
 *  medidos. Dois personais que escolheram a MESMA aparência recebem botões estruturalmente
 *  diferentes e nenhum dos dois pediu isso. `sempre` promove a peça que já carrega o peso:
 *  o corpo do botão desligado mede 1,40–1,51:1 contra o chão, e quem o faz existir é o
 *  anel. Em qualquer valor o anel entra no LAYOUT, o que mata o pulo de 2pt do rótulo. */
export type Anel = "resgate" | "sempre";
/** A ANATOMIA DE UMA CIFRA. Os três são o MESMO par número/rótulo em três ordens: nenhum
 *  inventa cor, canto, espaço ou degrau tipográfico.
 *    empilhado — hoje: rótulo em caixa alta, número, unidade, nota.
 *    linha     — tabela: rótulo à esquerda, número à direita. Força uma coluna, e por isso
 *                é o único tipo que nunca reprova por cabimento.
 *    cartaz    — a cifra abre a célula e o rótulo desce a legenda. */
export type Numero = "empilhado" | "linha" | "cartaz";
/** O ESTILO DO BOTÃO — o pedido literal do dono. Não é acabamento (isso é forma, peso e
 *  superfície): é ANATOMIA, onde o rótulo mora dentro da peça.
 *    linha  — rótulo à esquerda, custo à direita, seta no fim. É o botão de hoje: lê como
 *             uma LINHA de comando, e o custo ("52 MIN") fica onde o olho já está.
 *    centro — rótulo centrado, sem seta. Lê como um botão de aplicativo, mais neutro.
 *    caixa  — rótulo centrado em CAIXA ALTA e tracked, sem seta. Lê como etiqueta de
 *             equipamento: é a voz de academia de ferro.
 *    empilhada — rótulo em cima, custo embaixo, os dois centrados, num botão mais alto. É
 *             a única anatomia em que a centralização é exata sem truque: não há coluna
 *             lateral nenhuma, então a coluna fantasma do ciclo 4 não é necessária e o
 *             desvio do par de simetria é zero por construção. A altura sai de
 *             `FORMA.alturaAcao`, o mesmo token que o botão secundário lê — senão o
 *             principal vira uma laje ao lado de uma tira nas 10 telas que têm os dois. */
export type Acao = "linha" | "centro" | "caixa" | "empilhada";

export type Aparencia = {
  /** o chão e as três tintas. Um dos sete nomes de `CHAOS` (dado medido) ou um `#rrggbb`
   *  livre, de onde `escada()` resolve os outros nove degraus. Ver `escada`. */
  chao: NomeDoChao | (string & {});
  /** a cor da marca. Livre: é do personal, não do produto. */
  primaria: string;
  /** "auto" = derivada da primária por harmonia. Um segundo picker é a porta de entrada
   *  do feio: duas cores escolhidas à mão por quem não é designer brigam. */
  secundaria: string | "auto";
  voz: Voz;
  acao: Acao;
  /** quanto o SEGUNDO botão recua do primeiro. Ver Hierarquia. */
  hierarquia: Hierarquia;
  /** o anel da ação cheia é resgate (só quando falta) ou declarado. Ver Anel. */
  anel: Anel;
  /** a anatomia da célula de número. Ver Numero. */
  numero: Numero;
  forma: NomeDaForma;
  /** o tamanho do botão principal. Ver Porte. */
  porte: Porte;
  superficie: Superficie;
  peso: Peso;
  densidade: Densidade;
  movimento: Movimento;
  /** a força das seis tintas contra os quatro fundos. Ver Contraste. */
  contraste: Contraste;
};

/** O padrão É o app de hoje. Trocar a fábrica não pode mudar um pixel de quem não mexeu. */
export const APARENCIA_PADRAO: Aparencia = {
  chao: "carvao",
  primaria: productTheme.accentFallback,
  secundaria: "auto",
  voz: "bloco",
  acao: "linha",
  hierarquia: "salto",
  anel: "resgate",
  numero: "empilhado",
  forma: "reta",
  // `padrao` são 52 e não os 56 de antes: 56 era o piso herdado, e as ações principais de
  // Linear, Things, Whoop e Oura medem entre 48 e 52. O dono reclamou do tamanho duas
  // vezes; o padrão desce com ele.
  porte: "padrao",
  superficie: "solida",
  peso: "medio",
  densidade: "normal",
  movimento: "normal",
  contraste: "normal",
};

/** Forma: o que o canto, a borda e a superfície valem em número.
 *  `raio` e `raioAcao` são separados porque pílula é linguagem de AÇÃO — uma superfície
 *  de conteúdo em pílula não é premium, é adesivo. */
export type Sombra = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
};

export type AnatomiaDaAcao = {
  alinha: "flex-start" | "center";
  /** a seta/check no fim da linha. Some no centrado: seta em botão centrado empurra o
   *  rótulo para fora do centro óptico. */
  seta: boolean;
  /** o rótulo centra no BOTÃO, e não na sobra. `meta` (o custo, "52 MIN") mora à direita;
   *  quando esta anatomia centra, a mesma coluna tem que existir à ESQUERDA, senão o
   *  rótulo fica meia coluna fora do centro. Falsa na anatomia `linha`, onde o rótulo mora
   *  à esquerda de propósito e a sobra é o que empurra o custo para o fim. */
  reservaMeta: boolean;
  caixaAlta: boolean;
  /** tracking extra da caixa alta, somado ao do degrau. */
  tracking: number;
  /** o custo desce para a SEGUNDA linha, embaixo do rótulo. Só na anatomia `empilhada`, e
   *  é ela que faz `alturaAcao` crescer — o botão sem custo continua centrando uma linha
   *  só na altura nova, em vez de abrir um vazio embaixo do rótulo. */
  empilha: boolean;
  /** a hierarquia escolhida, aqui e não num campo à parte: quem lê o botão já lê esta
   *  anatomia, e o par (primário, secundário) é uma decisão só. */
  hierarquia: Hierarquia;
  /** o anel declarado. Ver Anel. */
  anel: Anel;
};

/** A FOLHA — como UM estrato se pinta. Era a mesma decisão re-derivada por três ternários
 *  divergentes fora do tema (`Screen.tsx`, `Metric.tsx`, `tabChrome.tsx`): a Band
 *  perguntava as quatro superfícies, o Metric duas e o dock só `vidro`. Consequência
 *  medida: `solida` e `elevada` saem IDÊNTICAS byte a byte em quatro chãos, e 21 dos 42
 *  pares de superfície colidem no dock. Não é um valor de cardápio — é a condição para que
 *  qualquer valor NOVO nasça premium sem ser conferido à mão em três arquivos, e para o
 *  medidor ler o MESMO objeto que a tela pinta. */
export type Folha = {
  /** o que a peça pinta: hex opaco, `rgba(...)` do véu, ou "transparent". */
  fundo: string;
  /** o que aquele fundo VALE em hex sobre o chão — o pixel que o medidor sabe olhar, e o
   *  fundo real de tudo que se escreve em cima. */
  composto: string;
  /** desfoque atrás da peça; 0 = não é vidro. */
  vidro: number;
  borda: number;
  corDaBorda: string;
  /** A TINTA DE APOIO que esta folha SUPORTA: a mais apagada das três tintas do produto
   *  que ainda escreve 4,5:1 sobre o composto dela. Não é decoração — é a única forma de a
   *  peça preenchida não herdar por descuido o `muted2`, que é calibrado contra os QUATRO
   *  FUNDOS e mede 4,52 contra `raised` com folga zero. Quem preenche um degrau acima
   *  disso perde a tinta mais fraca, e o campo de texto passa a ter placeholder ilegível
   *  sem que nenhum medidor perceba — porque o medidor mede a paleta, não o pixel da peça. */
  tinta: string;
  /** o FIO DE LUZ no topo. É o que dá altura à peça onde a sombra não existe (chão
   *  escuro: preto sobre preto não é sombra, é nada). Vazio quando quem levanta é a
   *  sombra — nunca os dois no mesmo chão, senão são dois sinais para uma altura só. */
  aresta: string;
  /** EM QUE ARESTA o fio de luz mora. `elevada` e `vidro` o põem em cima, `vinco` embaixo
   *  e `fio` numa moldura interna afastada da borda. Sem este campo `vinco` e `elevada`
   *  saem byte a byte iguais nos quatro chãos escuros — que é o mesmo defeito que
   *  `solida ≡ elevada` já custou uma vez, e a §16 compara a folha inteira. */
  arestaEm: "topo" | "base" | "moldura";
  /** O BLOCO IMPRESSO ATRÁS DA PEÇA — a sombra que não é sombra: opaca, sem desfoque,
   *  deslocada. Vazio em toda família que não é `carimbo`.
   *
   *  Ele existe porque a única sombra que este tema sabe fazer é borrada, preta e a 12% —
   *  e só aparece em chão claro (preto sobre preto é nada). O bloco resolve os dois: é um
   *  DEGRAU da escada, então tem contraste garantido por construção nos dois lados. Medido:
   *  ΔL* de `fill` contra `bg` é 14,9 no carvão e 15,5 no papel, e em hex livre é invariante
   *  porque `ESCADA.fill` vale 15,2 para qualquer chão que `escada()` aceite. Nenhum outro
   *  candidato a material tem essa garantia. */
  bloco: string;
  /** quanto o bloco anda, em pontos. Zero quando não há bloco. */
  deslocamento: number;
  sombra: Sombra;
};

export type Forma = {
  acao: AnatomiaDaAcao;
  raio: number;
  raioAcao: number;
  /** o traço FORTE: borda de peça, régua entre seções. */
  borda: number;
  /** o traço MUDO: separador dentro de um mesmo bloco. Sempre metade do forte, senão os
   *  dois colapsam no peso fino e a hierarquia de traço desaparece. */
  fio: number;
  superficie: Superficie;
  /** opacidade da sombra; 0 no plano. */
  elevacao: number;
  /** intensidade do desfoque atrás da superfície; 0 = sem vidro. */
  vidro: number;
  sombra: Sombra;
  /** altura mínima do que se toca. Densidade aperta o VÃO à vontade, mas o dedo tem
   *  piso: 44pt é onde iOS e Material concordam, e abaixo disso não é estilo, é erro. */
  alturaAcao: number;
  alturaChip: number;
  /** o PISO do dedo. Peça compacta (o chip de escolha do Perfil, a marca de passo) pode
   *  ser menor que um chip de fila — mas nunca menor que isto. */
  alturaMinima: number;
  /** O canto de uma peça QUADRADA de lado `size` (avatar, selo, quadrado de cor). Não dá
   *  para sair de um número fixo: 12 de raio num quadrado de 34 é canto macio, no de 96 é
   *  quase reto. Na família pílula devolve o círculo. */
  raioEm: (size: number) => number;
  /** o traço do ÍCONE. As duas alavancas vendidas — peso e canto — não alcançavam a
   *  silhueta: os seis kits compartilhavam o mesmo desenho de ícone, com `strokeWidth` 2
   *  cravado em vinte lugares. No peso fino o traço do ícone era o dobro do traço da tela;
   *  no grosso, nada engrossava. */
  traco: number;
  ponta: "square" | "round";
  /** COMO DUAS CÉLULAS VIZINHAS DE NÚMERO SE SEPARAM. A grade de fios internos (a que
   *  divide as células de um Metric) só existe onde ela não briga com o resto: canto reto e
   *  superfície SÓLIDA. Numa peça arredondada o fio reto cruza o arco, e no vidro ele vira
   *  risco sobre o desfoque. Fora da grade a célula vira PEÇA, com a mesma resposta que a
   *  Band dá ao chão — caixa no contorno, cartão no resto — e quem separa passa a ser o
   *  respiro. Sem esta metade, a escolha de superfície não chegava à tela de número: sem
   *  grade as células simplesmente encostavam.
   *
   *  `tinta` é o PIXEL que separa (fio, borda da caixa ou fundo do cartão) — o mesmo que a
   *  tela pinta e o que `tools/aparencia.mjs` mede contra o chão. */
  celula: { modo: "fio" | "caixa" | "cartao"; tinta: string };
  /** afastamento da superfície em relação à borda da tela. Zero na família reta (a
   *  superfície sangra, que é a linguagem de hoje); positivo assim que existe canto —
   *  canto arredondado encostado na borda da tela não lê como canto, lê como erro. */
  inset: number;
  /** véu translúcido da superfície de vidro. String vazia = não é vidro. */
  veu: string;
  /** o que o véu VALE em hex sobre o chão — o pixel que o medidor consegue olhar. Em
   *  qualquer superfície que não seja vidro, é o próprio fundo da superfície. */
  veuComposto: string;
  /** borda de luz do vidro — o que faz a peça ter aresta sem ter contorno. */
  aresta: string;
  /** COMO CADA ESTRATO SE PINTA, resolvido uma vez. Três estratos fechados e nomeados, e
   *  nunca uma função que aceita qualquer fundo: folha genérica seria um segundo tema
   *  dentro do tema, e o cardápio dobraria em silêncio.
   *    peca   — a superfície de conteúdo (Band).
   *    chrome — o dock e o rodapé de ação: a moldura que não rola com o conteúdo.
   *    miuda  — a peça pequena que pousa DENTRO da peça: célula de número, chip, campo de
   *             texto, botão fantasma. Hoje as três dezenas de cópias dela falam sempre a
   *             língua do `contorno`, em qualquer superfície escolhida. */
  folha: { peca: Folha; chrome: Folha; miuda: Folha };
  /** A ANATOMIA DA CIFRA, e o CABIMENTO — que é a régua que faltava. Medido: a célula de
   *  três colunas em `arejada`+`macia` tem 53pt úteis, e quatro algarismos no degrau
   *  `value` da voz `bloco` pedem ~98. `telas` só pergunta se montou, `escala` conta
   *  fontSize, `contraste` mede cor: ninguém pergunta se o número CABE. A resposta ao
   *  estouro nunca pode ser encolher a fonte (quebra a catraca `escala` e o app vira
   *  template) — é RECUSAR a coluna. */
  numero: {
    modo: Numero;
    /** o rótulo desce para baixo do número (`cartaz`). */
    rotuloAbaixo: boolean;
    /** quantas colunas cabem de fato. `linha` devolve 1 sempre. */
    colunas: (pedidas: number, largura: number, digitos?: number) => number;
  };
};

const RAIOS: Record<NomeDaForma, { raio: number; raioAcao: number }> = {
  reta: { raio: 0, raioAcao: 0 },
  macia: { raio: 12, raioAcao: 12 },
  pilula: { raio: 18, raioAcao: 999 },
};

const BORDAS: Record<Peso, number> = { fino: 1, medio: 2, grosso: 3 };

type Anatomia = Omit<AnatomiaDaAcao, "hierarquia" | "anel">;

const ACOES: Record<Acao, Anatomia> = {
  linha: { alinha: "flex-start", seta: true, reservaMeta: false, caixaAlta: false, tracking: 0, empilha: false },
  centro: { alinha: "center", seta: false, reservaMeta: true, caixaAlta: false, tracking: 0, empilha: false },
  caixa: { alinha: "center", seta: false, reservaMeta: true, caixaAlta: true, tracking: 1.2, empilha: false },
  // Sem coluna lateral nenhuma: `reservaMeta` é falso porque não há meta na horizontal
  // para compensar, e a seta sai porque seta em botão de duas linhas aponta para o custo.
  empilhada: { alinha: "center", seta: false, reservaMeta: false, caixaAlta: false, tracking: 0, empilha: true },
};

/** DENSIDADE REMAPEIA DEGRAU — não multiplica.
 *
 *  Multiplicar fabricava número fora da escala: `arejada` a 1,28 dava max=78, estourando o
 *  TETO 61 que o próprio arquivo declara como lei, e `compacta` esmagava a razão entre
 *  hair e tight. Aqui cada densidade só ESCOLHE outro degrau da MESMA escada de seis. Zero
 *  número novo, PISO e TETO respeitados por construção.
 *
 *  `hair` e `tight` nunca andam: são a distância entre duas linhas do mesmo objeto, e isso
 *  não é gosto. `max` nunca anda: é o teto. Quem desloca é o respiro ENTRE blocos. */
const DENSIDADES: Record<Densidade, (keyof typeof SPACE)[]> = {
  compacta: ["hair", "tight", "tight", "step", "block", "max"],
  normal: ["hair", "tight", "step", "block", "room", "max"],
  arejada: ["hair", "tight", "block", "room", "max", "max"],
};

/** O MOVIMENTO DEIXA DE SER UM BOTÃO DE VELOCIDADE.
 *
 *  Ele era três números que multiplicavam quatro durações — e o app inteiro só anima COR.
 *  Nada neste produto se move no espaço: o único `translate` que existe é o bonequinho de
 *  uma tela de entrada. Então "seco" e "generoso" eram o mesmo app em duas velocidades, e a
 *  alavanca vendida como movimento não tocava nem a troca de aba nem a entrada de tela.
 *
 *  Cada valor passa a carregar uma coreografia: a CURVA (como a coisa desacelera), a
 *  DISTÂNCIA que uma peça percorre ao entrar, e a CASCATA entre irmãs numa lista. Os nomes
 *  ficam — são palavras que qualquer pessoa entende, e trocá-los custaria migração no
 *  servidor por nada.
 *
 *  `normal` é o app de hoje byte a byte: mesma curva, multiplicador 1, distância zero. É a
 *  regra desta fábrica desde sempre — trocar o motor não pode mexer num pixel de quem não
 *  mexeu — e de quebra ele é o teste de regressão dos outros dois. */
export type Coreografia = {
  /** o multiplicador das durações. Era a alavanca inteira. */
  duracao: number;
  /** a curva de saída, em pontos de bézier. */
  ease: readonly [number, number, number, number];
  /** quanto uma peça percorre ao entrar, em degraus de SPACE. `nenhuma` = só tom, nada
   *  translada — que é o desenho de hoje e continua sendo uma escolha legítima. */
  distancia: "nenhuma" | "hair" | "tight";
  /** milissegundos entre irmãs numa fila. Zero = a fila inteira chega como um objeto só. */
  cascata: number;
};

const MOVIMENTOS: Record<Movimento, Coreografia> = {
  // O CONTRA-TEMPO: chega rápido e para seco, sem nada percorrendo distância. É a leitura
  // de quem conta a repetição em voz alta.
  seco: { duracao: 0.55, ease: [0.3, 0, 0.2, 1], distancia: "nenhuma", cascata: 0 },
  normal: { duracao: 1, ease: MOTION.ease, distancia: "nenhuma", cascata: 0 },
  // A EXCÊNTRICA LONGA: desacelera por muito tempo no fim, as peças sobem um degrau, e uma
  // lista chega uma linha de cada vez. É a leitura de um estúdio, de uma sala quente.
  generoso: { duracao: 1.45, ease: [0.16, 1, 0.3, 1], distancia: "tight", cascata: 60 },
};

/** A sombra é PRETA e ponto. Sombra colorida é o primeiro sintoma de app de template, e
 *  no chão escuro ela não aparece de qualquer jeito — quem levanta a superfície ali é o
 *  degrau de luz do chão, não a sombra. */
const SOMBRA = "#000000";

/** Luz PERCEPTUAL (L* do CIE). Razão de contraste responde "dá para ler"; ela não responde
 *  "dá para VER que são duas superfícies". Para separação de superfície quem manda é L*. */
function lstar(cor: string): number {
  const y = luminance(cor);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
}

/** A cor de matiz `h` e croma `s` que pousa exatamente em `alvo` de L*. Busca binária na
 *  luminosidade do HSL, que é o mesmo mecanismo de `accentOn` — só que mirando luz
 *  perceptual em vez de razão de contraste. */
function emLstar(h: number, s: number, alvo: number): string {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (lstar(fromHsl(h, s, mid)) < alvo) lo = mid;
    else hi = mid;
  }
  return fromHsl(h, s, (lo + hi) / 2);
}

/** A JANELA DO CHÃO LIVRE, em L*. Medida, não opinada: entre 36 e 50 a escada não cabe
 *  nos dois sentidos (o texto mede 4,44 e o divider 2,97, abaixo dos pisos), e acima de 94
 *  `raised` perde o degrau — ΔL* 4,5 em 95, abaixo dos 5 em que uma superfície começa a
 *  existir para o olho. Chão fora da janela não é recusado: ele ANDA para dentro, pela
 *  borda mais próxima, mantendo matiz e croma. É a mesma lei de `accentOn` — a cor é do
 *  personal, a luz é a que o sistema sabe medir — e é o que garante que nenhum chão que
 *  ninguém mediu seja representável. */
export const JANELA = { escuro: [0, 22], claro: [78, 94] } as const;

/** Deslocamento de cada degrau a partir do `bg`, em L*. Não é invenção: é a média medida
 *  dos SETE chãos escritos à mão, que já eram a mesma escada com matizes diferentes.
 *  `surface` e `raised` sobem sempre (a superfície levantada anda para a luz nos dois
 *  mundos); o resto anda na direção da TINTA. */
const ESCADA = {
  dock: 1.3,
  surface: 3.2,
  raised: 6.6,
  hairline: 10.2,
  fill: 15.2,
  divider: 41,
  muted2: 52,
  muted: 60.5,
  ink: 93,
} as const;
/** O croma AFINA conforme o degrau se afasta do chão: um cinza de texto com o croma cheio
 *  do fundo lê como cor, não como tinta. */
const CROMA = { hairline: 0.9, fill: 0.85, divider: 0.65, muted2: 0.55, muted: 0.5, ink: 0.25 };
/** Os pisos que os degraus RESOLVEM (não escolhem), com dois centésimos de folga para o
 *  arredondamento do hex não devolver 4,49. */
const PISO_DO_DEGRAU: Record<string, number> = { divider: 3.05, muted2: 4.55, muted: 4.55, ink: 4.55 };

/** O CHÃO LIVRE. Sete chãos viram infinitos: o personal digita a cor de fundo do estúdio
 *  e os outros nove degraus nascem resolvidos a partir dela.
 *
 *  A SPEC §2.1 recusou um gerador dizendo que o teste seria "reproduzir dentro de ±0,5:1 a
 *  constante que ele substituiu". Reproduzido: `escada(bg)` devolve os sete chãos à mão com
 *  ΔL* máximo de 7,0 (o pior degrau é o `ink` do breu, que à mão é branco puro) e com
 *  pisos IGUAIS OU MELHORES que o dado — carvão sai de 4,52/3,01 para 4,63/3,10. A recusa
 *  estava desatualizada por medida, não por gosto.
 *
 *  Os sete continuam sendo DADO e continuam sendo o que o app entrega para quem os
 *  escolheu: `escada()` só roda para hex livre. O gerador é vigiado pelo dado, não o
 *  substitui — se ele passasse a gerar o carvão, o padrão andaria e `.gate/telas.json`
 *  morreria junto.
 *
 *  Um chão feio não é expressável: fora da janela o `bg` anda para dentro, e dentro dela
 *  os nove degraus são resolvidos até bater o piso. Medido em 2.160 fundos livres
 *  (24 matizes x 6 cromas x 15 claridades): 0 reprovam, pior texto 4,55 e pior divider
 *  3,05, com `raised` sempre a 5 ou mais de L* do chão. */
export function escada(bg: string): Chao {
  const [h, s0] = toHsl(rgb(bg));
  const cru = lstar(bg);
  const [lo, hi] = cru < 50 ? JANELA.escuro : JANELA.claro;
  const base = Math.max(lo, Math.min(hi, cru));
  const escuro = base < 50;
  const paraTinta = escuro ? 1 : -1;
  const dentro = (v: number) => Math.max(0, Math.min(100, v));
  const chao = { bg: base === cru ? bg : emLstar(h, s0, base) } as Record<string, string>;
  for (const k of ["dock", "surface", "raised"] as const) {
    const dir = k === "dock" ? paraTinta : 1;
    chao[k] = emLstar(h, s0, dentro(base + dir * ESCADA[k]));
  }
  const fundos = [chao.bg, chao.dock, chao.surface, chao.raised];
  for (const k of ["hairline", "fill", "divider", "muted2", "muted", "ink"] as const) {
    const s = s0 * (CROMA[k] ?? 1);
    // `ink` no claro anda menos: 86 e não 93 — abaixo disso o preto perde o matiz do chão
    // e a tinta deixa de pertencer à paleta.
    const passo = k === "ink" && !escuro ? 86 : ESCADA[k];
    const piso = PISO_DO_DEGRAU[k] ?? 0;
    let cor = emLstar(h, s, dentro(base + paraTinta * passo));
    // Os degraus com piso não são ESCOLHIDOS, são RESOLVIDOS: o deslocamento medido é só o
    // ponto de partida, e a tinta anda mais um pouco enquanto não limpar o piso contra o
    // fundo mais difícil dos quatro. É o que faz o preto puro (onde `raised` já está a
    // 6,6 de L* do nada) continuar entregando divider a 3:1.
    for (let extra = 0.5; piso && extra <= 60; extra += 0.5) {
      if (Math.min(...fundos.map((g) => contrast(cor, g))) >= piso) break;
      const alvo = dentro(base + paraTinta * (passo + extra));
      cor = emLstar(h, s, alvo);
      if (alvo === 0 || alvo === 100) break;
    }
    chao[k] = cor;
  }
  return chao as unknown as Chao;
}

/** A paleta de um chão: nome do cardápio (dado medido) ou hex livre (escada resolvida).
 *  Qualquer outra coisa cai no carvão, que é o padrão. */
function paletaDoChao(chao: string): Chao {
  if (chao in CHAOS) return CHAOS[chao as NomeDoChao];
  return corLivre(chao) ? escada(corLivre(chao)) : CHAOS.carvao;
}

/** CONTRASTE ALTO: as seis tintas andam 20% mais longe do chão; os quatro fundos ficam
 *  onde estão. Misturar as duas coisas numa alavanca só faria "alto contraste" mudar a
 *  profundidade do app junto, sem ninguém pedir.
 *
 *  `ink` fica de fora porque já é o extremo da escada — empurrá-lo só encontraria o teto,
 *  e a alavanca degeneraria em silêncio no degrau mais visível do app, que é exatamente o
 *  defeito que a superfície `elevada` tinha. Quem paga o preço de raspar 4,5:1 é `muted2`,
 *  e é ele que esta alavanca existe para levantar: medido, sai de 4,52 para 6,4 no carvão.
 *
 *  O multiplicador para no CHÃO. O piso do acento é do acento. */
function tintasFortes(chao: Chao, k: number): Chao {
  const base = lstar(chao.bg);
  const out = { ...chao } as Record<string, string>;
  for (const nome of ["hairline", "fill", "divider", "muted2", "muted"] as const) {
    const [h, s] = toHsl(rgb(chao[nome]));
    const alvo = base + (lstar(chao[nome]) - base) * k;
    out[nome] = emLstar(h, s, Math.max(0, Math.min(100, alvo)));
  }
  return out as unknown as Chao;
}

/** O DEGRAU NEUTRO CONTRA O FUNDO REAL — e é UM helper, de propósito: a alternativa era
 *  um token novo por superfície, que multiplicaria a paleta por quatro sem acrescentar
 *  uma decisão.
 *
 *  `fill` e `hairline` são degraus medidos a partir de `bg`, e é só ali que eles valem o
 *  que prometem. Só que a peça não pousa em `bg`: ela pousa DENTRO da Band levantada.
 *  Medido nos quatro chãos escuros, em L*: `fill` separa 14,9 de `bg` e 8,3 de `raised` —
 *  METADE do degrau —, e `hairline` separa 10,1 de `bg` e 3,5 de `raised`, abaixo dos 5
 *  em que uma superfície começa a existir para o olho. A calha do cronômetro, a barra
 *  apagada da semana e o selo não conquistado caíam exatamente nisso.
 *
 *  Aqui o degrau é RECALCULADO: a mesma distância perceptual que `fill` tem de `bg`,
 *  contada a partir do fundo em que a peça REALMENTE pousou, andando na direção da tinta
 *  — que é a direção em que `fill` já anda nos sete chãos (no claro a tinta é escura e o
 *  degrau desce, como tem que ser). Devolve hex composto e não cor com alfa: hex é o que
 *  o medidor sabe ler.
 *
 *  `fundo === bg` devolve o próprio `fill`. Não é atalho de desempenho: é a garantia de
 *  que o padrão do app não anda um pixel — e ela cobre de graça a superfície `contorno`,
 *  cujo fundo real É o chão. */
export function neutroSobre(fundo: string, p: Paleta = productTheme): string {
  if (fundo === p.bg) return p.fill;
  return degrauNeutro(fundo, Math.abs(lstar(p.fill) - lstar(p.bg)), p);
}

/** O mesmo degrau de `neutroSobre`, com a distância como PARÂMETRO. Existe porque a
 *  hierarquia do par de ações precisa de um degrau neutro de tamanho DERIVADO (a presença
 *  do botão principal dividida por √2), e não do tamanho fixo de `fill`. Uma segunda
 *  implementação disto seria uma segunda régua. */
function degrauNeutro(fundo: string, alvo: number, p: Paleta): string {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (Math.abs(lstar(compor(p.ink, mid, fundo)) - lstar(fundo)) < alvo) lo = mid;
    else hi = mid;
  }
  return compor(p.ink, hi, fundo);
}

/** O SEGUNDO BOTÃO. Ver `Tema.secundario` e `Hierarquia`.
 *
 *  O piso de `parelha` é o mesmo que decide se uma superfície existe: 5 de L*. Abaixo
 *  disso o preenchimento derivado é indistinguível do chão, e um botão cheio invisível SEM
 *  borda é pior que o contornado de hoje — então ali `parelha` devolve `salto`, que é o
 *  app de hoje. Degradação contínua, sem exceção escrita à mão. */
function acaoSecundaria(
  h: Hierarquia,
  fundo: string,
  massaFill: string,
  T: Paleta,
  borda: number,
  fio: number,
) {
  // O RÓTULO DESLIGADO É DO PAR, e não da peça. `GhostCTA` escolhia `T.muted` por conta
  // própria — e `T.muted` é calibrado contra os QUATRO fundos do produto, não contra o
  // preenchimento que `parelha` deriva em tempo de execução. Medido antes do conserto,
  // 7 chãos x 30 marcas x 3 fundos: salto 0/630, eco 0/630, parelha 441/630, pior 1,00.
  // O "Descansar" do Descanso e o "Agora não" da Retomada NASCEM desligados: em parelha
  // nasciam ilegíveis. Aqui a tinta apagada anda a luz de `muted` até limpar o piso de
  // texto contra o pixel em que o rótulo REALMENTE pousa — e onde `muted` já limpa (todo
  // `salto`, todo `eco`, o app de hoje inteiro) ela É `muted`, sem andar um centésimo.
  const apagada = (pousa: string, ligada: string) => {
    const forca = (c: string) => contrast(c, pousa);
    const fraca = accentOn(T.muted, pousa, 4.5);
    // E nunca MAIS forte que a ligada. Onde o rótulo ligado já pousa raspando o piso — o
    // caso de `parelha` nos chãos claros, que garante 4,5 e não mais que isso —, não cabe
    // um degrau abaixo: ali o desligado é o próprio ligado. Indistinto é ruim, ilegível é
    // pior, e desligado mais gritante que ligado é o pior dos três, porque inverte a
    // hierarquia que este par existe para declarar.
    if (forca(fraca) > forca(ligada)) return ligada;
    // O COLAPSO DA HIERARQUIA MAIS DISCRETA. `eco` ACENDE o rótulo em `T.muted`, e
    // `T.muted` é o que esta função devolve apagado: desligado e ligado saíam o MESMO
    // pixel em 21 de 21 (7 chãos x 3 pousos), em 100% das paletas — o botão que nasce
    // desligado nas duas telas do produto não tinha estado nenhum. O par da §27 não
    // acusava porque ele mede `ratio(ligada) − ratio(desligada) >= 0`, e a identidade
    // exata passa por construção: ele acusa inversão, nunca colapso.
    //
    // O degrau abaixo NÃO é invenção — é o token que o produto já tem: `muted2` é
    // calibrado para limpar 4,5:1 nos quatro fundos e separa 7,8 a 8,9 de L* de `muted`
    // nos sete chãos. Só desce quando há empate; nas outras hierarquias `muted` já é um
    // degrau abaixo de `ink` (30,9 a 36,8 de L*) e não anda um centésimo.
    if (forca(ligada) - forca(fraca) > 1e-9) return fraca;
    return forca(T.muted2) >= 4.5 && forca(T.muted2) < forca(ligada) ? T.muted2 : fraca;
  };
  const contornada = (tinta: string, largura: number) => ({
    fundo: "transparent",
    tinta,
    // Contorno não pinta área: o rótulo desligado pousa no fundo que a tela declarou.
    desligada: apagada(fundo, tinta),
    borda: T.divider,
    larguraDaBorda: largura,
  });
  if (h === "eco") return contornada(T.muted, fio);
  if (h === "parelha") {
    const presenca = Math.abs(lstar(massaFill) - lstar(fundo));
    const teto = presenca / Math.SQRT2;
    for (let alvo = teto; alvo >= 5; alvo -= 1) {
      const preenchido = degrauNeutro(fundo, alvo, T);
      // A tinta é a MESMA escolha do motor de massa: o rótulo é inegociável, e das duas
      // tintas do produto vale a que enxerga o preenchimento derivado.
      const tinta = contrast(T.ink, preenchido) >= contrast(T.bg, preenchido) ? T.ink : T.bg;
      // A busca do degrau para no primeiro passo que ALCANÇA o alvo, então ela chega
      // sempre um pouco por cima; sem conferir a separação REALIZADA, o secundário passa o
      // teto por três décimos e a dominância deixa de ser verdadeira por construção.
      if (Math.abs(lstar(preenchido) - lstar(fundo)) <= teto && contrast(tinta, preenchido) >= 4.5) {
        // A borda continua no LAYOUT, transparente: sem isso a caixa de conteúdo muda de
        // tamanho entre as hierarquias e o rótulo pula 2pt.
        return {
          fundo: preenchido,
          tinta,
          desligada: apagada(preenchido, tinta),
          borda: "transparent",
          larguraDaBorda: borda,
        };
      }
    }
  }
  return contornada(T.ink, borda);
}

/** O ANEL DO ROSTO. A `<Image>` do avatar não tinha fronteira nenhuma: logo de fundo
 *  branco em chão claro dissolvia, e o quadrado do rosto acabava onde ninguém via.
 *  Vive aqui, e não no componente, porque `tools/aparencia.mjs` mede o anel composto
 *  sobre cada um dos quatro fundos — se o número morasse no .tsx, o medidor teria uma
 *  cópia dele, que é a única coisa que este repo não aceita. */
export const ANEL_DO_ROSTO = 0.12;

/** O alfa do véu do vidro: aquele que dá ao vidro a MESMA separação perceptual que a
 *  superfície sólida tem naquele chão.
 *
 *  A primeira versão resolvia o alfa para compor exatamente `raised`, e isso só funciona
 *  no escuro — ali `raised` é mais claro que o chão e a tinta também é. No claro `raised`
 *  é BRANCO e a tinta é quase preta: a equação não tem solução translúcida, o alfa caía no
 *  piso de 2% e o véu separava 1,4 de L* contra os 6,6 do escuro. Resultado medido: a
 *  superfície mais cara do cardápio era invisível em três dos sete chãos.
 *
 *  Agora o alvo é a SEPARAÇÃO, não a cor: no escuro o véu clareia, no claro ele escurece —
 *  vidro fumê, que é o que vidro sobre fundo claro faz no mundo físico também. */
function tintaDoVeu(chao: Chao): string {
  // O véu pinta NA DIREÇÃO de `raised`. No escuro quem está desse lado é a tinta clara, e
  // ela tem tanto alcance que basta 7% — sobra transparência para o desfoque aparecer. No
  // claro a tinta está do lado ERRADO (é quase preta), e quem serve é o branco do próprio
  // `raised`. Escurecer no claro passaria a separação, mas empurraria todo token calibrado
  // contra `bg` para baixo do piso: medido, `muted2` caía para 4,37 e `divider` para 2,85.
  const paraCima = lstar(chao.raised) > lstar(chao.bg);
  const tintaSobe = lstar(chao.ink) > lstar(chao.bg);
  return paraCima === tintaSobe ? chao.ink : chao.raised;
}

/** TETO DE OPACIDADE DO VÉU. Acima disto não é vidro, é parede pintada: o desfoque atrás
 *  deixa de aparecer e a família custa uma dependência para não mudar nada. */
const VEU_MAX = 0.62;

/** O TETO QUE O TEXTO E O TRAÇO COBRAM DO VÉU. São QUATRO tokens, não um: `muted2`,
 *  `muted` e `ink` são texto real sobre a superfície (4,5:1) e `divider` é o fio que
 *  separa duas linhas DENTRO dela (3:1) — os mesmos quatro que a §28 cobra. Todos são
 *  calibrados contra os quatro fundos, não contra o pixel COMPOSTO que o véu põe no lugar
 *  de `bg`.
 *
 *  A primeira versão só movia `muted2`, e o furo tinha tamanho: numa grade de 24 matizes
 *  x 8 cromas x 17 claridades (3.264 chãos livres) x 4 superfícies x 2 contrastes,
 *  14 pares reprovam — TODOS em `divider` sobre `vidro`, pior 2,97 (h225 s0,6 L*1). A
 *  grade velha da §28 (8 matizes x 4 cromas x 7 claridades) não amostrava nenhum deles:
 *  o "0 de 119.103" era propriedade da amostragem, e o chão livre é vendido como livre.
 *
 *  A opacidade é monótona nos QUATRO ao mesmo tempo — mais véu é mais longe de `bg`, e as
 *  quatro tintas foram resolvidas contra `bg` —, então basta recuar enquanto algum piso
 *  não limpar: o véu perde translucidez antes de o texto perder legibilidade.
 *
 *  Compõe sobre `chao.bg` porque é ali que os dois estratos com véu pousam (`folhaDe` é
 *  chamada com `pousa = chao.bg` para `peca` e para `chrome`). Um terceiro estrato que
 *  pousasse noutro pixel sairia deste alcance — e é por isso que a §28 percorre TODOS os
 *  estratos de `folha`, e não uma lista escrita à mão: o dia em que um estrato novo nascer,
 *  a régua o mede sem ninguém lembrar dela. */
const PISOS_SOBRE_O_VEU: [keyof Chao, number][] = [
  ["muted2", 4.5],
  ["muted", 4.5],
  ["ink", 4.5],
  ["divider", 3],
];
function veuLegivel(chao: Chao, tinta: string, alfa: number): number {
  const limpa = (v: number) => {
    const composto = compor(tinta, v, chao.bg);
    return PISOS_SOBRE_O_VEU.every(([token, piso]) => contrast(chao[token], composto) >= piso);
  };
  let a = alfa;
  while (a > 0.02 && !limpa(a)) a -= 0.01;
  return Math.max(0.02, a);
}

function alfaDoVeu(chao: Chao): number {
  const tinta = tintaDoVeu(chao);
  // Quando a tinta do véu ALCANÇA `raised` translucidamente — o caso dos quatro chãos
  // escuros —, o alfa é o que compõe exatamente aquela cor. Não é preciosismo: assim o
  // texto sobre vidro pousa no MESMO pixel que o gate já mede há muito tempo, e não num
  // vizinho que raspa o piso por dois centésimos. Resolvido canal a canal.
  const [rb, gb, bb] = rgb(chao.bg);
  const [rr, gr, br] = rgb(chao.raised);
  const [rt, gt, bt] = rgb(tinta);
  const canais = [
    [rr - rb, rt - rb],
    [gr - gb, gt - gb],
    [br - bb, bt - bb],
  ].filter(([, d]) => Math.abs(d) > 1);
  if (canais.length) {
    const exato = canais.reduce((soma, [n, d]) => soma + n / d, 0) / canais.length;
    if (exato > 0.02 && exato <= VEU_MAX) return veuLegivel(chao, tinta, exato);
  }
  const alvo = Math.abs(lstar(chao.raised) - lstar(chao.bg));
  let lo = 0.01;
  let hi = VEU_MAX;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const d = Math.abs(lstar(compor(tinta, mid, chao.bg)) - lstar(chao.bg));
    if (d < alvo) lo = mid;
    else hi = mid;
  }
  return veuLegivel(chao, tinta, Math.max(0.02, Math.min(VEU_MAX, (lo + hi) / 2)));
}

function sombraDe(elevacao: number): Sombra {
  return {
    shadowColor: SOMBRA,
    shadowOpacity: elevacao,
    shadowRadius: elevacao ? Math.round(18 * elevacao + 6) : 0,
    shadowOffset: { width: 0, height: elevacao ? Math.round(6 * elevacao + 2) : 0 },
    elevation: Math.round(10 * elevacao),
  };
}

/** O RAIO DO DESFOQUE, que a partir deste ciclo é desfoque de verdade: até aqui `vidro`
 *  era o único valor do cardápio que arquivo NENHUM lia — o número existia, `Band` o
 *  ignorava, e quem escolhia Vidro recebia sombra. Vai inteiro como `intensity` do
 *  `BlurView`. */
const VIDRO: Record<Superficie, number> = {
  solida: 0,
  contorno: 0,
  vidro: 26,
  elevada: 0,
  fio: 0,
  vinco: 0,
  carimbo: 0,
  nenhuma: 0,
};

/** DUAS CORES SÓ SÃO DUAS SE O OLHO SEPARA. Três caminhos, e basta um: luz (uma diferença
 *  de luminância que já se enxerga), matiz (dois matizes distantes), ou croma (vermelho
 *  contra cinza na mesma luz é óbvio, e nenhuma conta de luminância vê isso).
 *  Sem esta função, "segunda cor" e "cor de aviso" podiam sair idênticas à marca — e uma
 *  hierarquia inventada com uma cor só é pior que não ter hierarquia. */
export function separadas(a: string, b: string): boolean {
  if (contrast(a, b) >= 1.3) return true;
  const [ha, sa] = toHsl(rgb(a));
  const [hb, sb] = toHsl(rgb(b));
  if (Math.abs(sa - sb) >= 0.25) return true;
  if (sa < 0.12 || sb < 0.12) return false; // cinza não tem matiz para comparar
  const d = Math.abs(ha - hb) % 360;
  return (d > 180 ? 360 - d : d) >= 40;
}

/** Anda a luminosidade de `cor` até ela se SEPARAR de `outra`, sem nunca perder o piso de
 *  contraste contra o chão. É a saída para os dois empates que a fábrica cria sozinha: a
 *  marca cinza (que não tem matiz para derivar a segunda cor) e a marca vermelha (que
 *  colide com o vermelho do aviso). Anda para o lado que tem espaço. */
/** SEPARAÇÃO QUE O MATIZ NÃO PAGA. `separadas` aceita 1,3 de razão de contraste como
 *  prova de que duas cores são duas — e isso passa com Δmatiz ZERO. É o furo que o
 *  produto tem em produção no PADRÃO de fábrica: `PERIGO` e `APARENCIA_PADRAO.primaria`
 *  são a MESMA cor, e o `errorInk` parava a 1,30 de razão, ou seja, o estúdio escreve erro
 *  num vermelho que é a própria marca 30% mais clara. Nos sete chãos, medido: Δmatiz 0° e
 *  Δrazão 1,30, encostado no limiar.
 *
 *  Aqui, quando os dois têm croma de verdade e o matiz é praticamente o mesmo, razão não
 *  serve: exige-se 18 de L*. Vale SÓ no par marca x aviso, e de propósito — a segunda cor
 *  tem outro trabalho (ser CONTÁVEL num gráfico) e ali 1,3 de razão basta. Endurecer
 *  `separadas` inteira reconciliaria 21 mil pares para consertar um. */
export function separadasNoMatiz(a: string, b: string): boolean {
  const [ha, sa] = toHsl(rgb(a));
  const [hb, sb] = toHsl(rgb(b));
  const bruta = Math.abs(ha - hb) % 360;
  const dh = bruta > 180 ? 360 - bruta : bruta;
  if (dh < 30 && sa >= 0.12 && sb >= 0.12) return Math.abs(lstar(a) - lstar(b)) >= 18;
  return separadas(a, b);
}

function afastar(
  cor: string,
  outra: string,
  chao: string,
  min: number,
  regra: (a: string, b: string) => boolean = separadas,
): string {
  if (regra(cor, outra)) return cor;
  const [h, sat, l0] = toHsl(rgb(cor));
  for (const dir of luminance(outra) > luminance(cor) ? [-1, 1] : [1, -1]) {
    for (let i = 1; i <= 128; i++) {
      const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
      const cand = fromHsl(h, sat, l);
      if (regra(cand, outra) && contrast(cand, chao) >= min) return cand;
      if (l === 0 || l === 1) break;
    }
  }
  return cor;
}

/** A SEGUNDA COR, quando o personal não a escolheu. Complementar dividida: +150° do
 *  matiz da marca. Não é gosto — é a única rotação que não briga com a primária (180° é
 *  brigar) e não some nela (30° é a mesma cor). Saturação um degrau abaixo, porque a
 *  segunda cor é subordinada por definição. Marca sem matiz (cinza, branco, preto) não
 *  ganha matiz inventado: a segunda cor dela é ela mesma. */
/** ESTA SEGUNDA COR CHEGA COMO FOI ESCOLHIDA?
 *
 *  A tela oferece dez cores para a segunda e o app fica com outra em uma escolha a cada
 *  cinco. Medido nas 1.400 combinações de sete chãos x vinte marcas x dez escolhas: o app
 *  MOVEU a cor escolhida em 277 delas — 19,8% —, com distância média de 26 em L\* e pior
 *  caso 53,6. O personal toca no vermelho, recebe salmão, e nada na tela conta isso.
 *
 *  O movimento em si está certo: `afastarAte` empurra a escolha até ela se separar da
 *  marca depois do motor de peça E do vermelho do aviso, senão o app desenha duas séries
 *  na mesma cor ou pinta uma comparação com a cara de um erro. O errado é OFERECER o que
 *  vai ser recusado.
 *
 *  Então a régua vira porta: a tela pergunta antes e só mostra o que ela consegue manter.
 *  Medido no cardápio de 27: sobram 24 em média e 22 no pior caso — mais escolha de
 *  verdade do que as dez de antes, das quais metade era promessa que o app quebrava.
 *
 *  Uma função só, exportada, porque a tela que oferece e o medidor que prova têm que usar
 *  a MESMA — duas cópias divergem, e a que diverge é a que mente para o personal. */
export function segundaValida(a: Aparencia, candidata: string): boolean {
  return criarTema({ ...a, secundaria: candidata }).secundaria === candidata;
}

export function secundariaDe(primaria: string, chao: string = productTheme.bg): string {
  const [h, s, l] = toHsl(rgb(primaria));
  // Marca sem matiz não ganha matiz inventado — um cinza que vira roxo não é derivação, é
  // outra marca. O segundo posto dela é TONAL: a mesma cor, um degrau de luz adiante, o
  // suficiente para o olho contar duas.
  if (s < 0.12) return afastar(fromHsl(h, s, l), primaria, chao, 3);
  // Complementar DIVIDIDA, e as duas metades são candidatas. A rotação existe em dois
  // sentidos e o produto tem uma terceira cor com dono: o vermelho do aviso. Marca azul
  // girada +150° cai justamente no vermelho — e aí a "segunda série" do aluno lê como
  // erro. Escolhe-se o lado que fica LONGE do perigo; com os dois longe, o de sempre.
  const [hp] = toHsl(rgb(PERIGO));
  const distancia = (a: number) => {
    const d = Math.abs(a - hp) % 360;
    return d > 180 ? 360 - d : d;
  };
  const mais = (h + 150) % 360;
  const menos = (h + 210) % 360;
  const escolhido = distancia(mais) >= distancia(menos) ? mais : menos;
  return fromHsl(escolhido, Math.max(0.18, s * 0.85), l);
}

/** A segunda cor tem que se separar da primeira DEPOIS de as duas passarem pelo motor de
 *  peça — e não antes. É aí que mora a armadilha: duas cores diferentes que o piso de
 *  contraste empurra para o mesmo lugar chegam na tela IGUAIS. Um quase-preto e um cinza
 *  médio viram o mesmo preenchimento; a "segunda cor" que o editor mostrou some no
 *  caminho. Então quem anda aqui é o candidato, até os dois PREENCHIMENTOS se separarem. */
function afastarAte(cor: string, aceita: (c: string) => boolean): string {
  if (aceita(cor)) return cor;
  const [h, sat, l0] = toHsl(rgb(cor));
  for (const dir of [1, -1]) {
    for (let i = 1; i <= 128; i++) {
      const l = Math.max(0, Math.min(1, l0 + dir * i * STEP));
      const cand = fromHsl(h, sat, l);
      if (aceita(cand)) return cand;
      if (l === 0 || l === 1) break;
    }
  }
  return cor;
}

export type Escala<K extends string> = Record<K, number>;

/** Os degraus que desenham na face do NÚMERO, e os que desenham na de DISPLAY. A divisão
 *  não é estética, é literal: é o que `Txt.tsx` liga a `FONTES.numero` e a `FONTES.display`.
 *  Enquanto os quatro andavam juntos como "DISPLAY", três deles eram corrigidos pela
 *  métrica de uma face que não os desenha. */
const NUMERO = ["value", "hero", "mega"] as const;
const TITULO = ["title"] as const;
type DegrauDeCorpo = keyof typeof TYPE;

/** O multiplicador óptico de cada degrau, e o GRAU da voz onde ele vale.
 *
 *  Duas coisas em uma função porque são a mesma decisão vista dos dois lados: a correção
 *  óptica APAGA a diferença de tamanho entre as faces (para que trocar a voz não mude o
 *  corpo do texto sem querer), e o grau REPÕE a diferença onde ela é a personalidade da
 *  voz. Aplicar um sem o outro é o que produzia seis opções do mesmo tamanho.
 *
 *  O grau não alcança rótulo nem corpo: densidade de leitura não é gosto do personal. */
function fator(par: ParDeFontes, k: DegrauDeCorpo): number {
  if ((NUMERO as readonly string[]).includes(k)) return (CAP_REF / par.capNumero) * par.grau;
  if ((TITULO as readonly string[]).includes(k)) return (CAP_REF / par.cap) * par.grau;
  return X_REF / par.x;
}

/** Os seis degraus, corrigidos pela ÓPTICA da voz. Cada degrau anda pelo multiplicador da
 *  face que ele desenha: caixa alta para o título, caixa alta da face do número para o
 *  número, altura de x para o texto — que é o que decide se um parágrafo lê grande. */
function corpos(par: ParDeFontes): Escala<DegrauDeCorpo> {
  const out = {} as Escala<DegrauDeCorpo>;
  for (const k of Object.keys(TYPE) as DegrauDeCorpo[]) out[k] = Math.round(TYPE[k] * fator(par, k));
  return out;
}

/** A entrelinha acompanha o corpo corrigido E respeita a LINHA NATURAL da face. Oswald
 *  pede 1,482em: o `LEAD.label` de 16 sobre corpo 12 cortava o Á, o Ç e o Õ na base —
 *  em português isso não é detalhe, é metade das palavras. */
function entrelinhas(par: ParDeFontes): Escala<DegrauDeCorpo> {
  const corpo = corpos(par);
  const out = {} as Escala<DegrauDeCorpo>;
  for (const k of Object.keys(LEAD) as DegrauDeCorpo[]) {
    const display =
      (NUMERO as readonly string[]).includes(k) || (TITULO as readonly string[]).includes(k);
    const escalado = Math.round(LEAD[k] * fator(par, k));
    // Dois pisos, um por natureza de degrau. TEXTO precisa caber a LINHA NATURAL da face,
    // senão o Á, o Ç e o Õ raspam a base — em português isso é metade das palavras.
    // DISPLAY usa entrelinha negativa de propósito (é o que faz um número de 92pt ler como
    // número e não como parágrafo), e o piso dele é só a própria letra com acento: caixa
    // alta mais o espaço do agudo. Aplicar a linha natural aqui engordaria o herói do app
    // de hoje em nove pontos.
    const caixaDoDegrau = (NUMERO as readonly string[]).includes(k) ? par.capNumero : par.cap;
    out[k] = Math.max(escalado, Math.ceil(corpo[k] * (display ? caixaDoDegrau + 0.15 : par.linha)));
  }
  return out;
}

export type Tema = {
  aparencia: Aparencia;
  /** o chão é escuro? Um só número decide isto no app inteiro — o mesmo 0,18 que o motor
   *  de acento usa para saber se clareia ou escurece. Barra de status, tint do vidro e
   *  tema da navegação perguntam aqui em vez de cada um ter o próprio palpite. */
  escuro: boolean;
  T: Paleta;
  SPACE: Escala<keyof typeof SPACE>;
  TYPE: Escala<keyof typeof TYPE>;
  TRACK: Escala<keyof typeof TRACK>;
  LEAD: Escala<keyof typeof LEAD>;
  FONT: string;
  /** o par de faces da voz escolhida. `Txt` decide por PAPEL: display para número e
   *  título, texto para rótulo e corpo. */
  FONTES: ParDeFontes;
  MOTION: {
    press: number;
    state: number;
    enter: number;
    turn: number;
    reveal: number;
    ease: readonly [number, number, number, number];
    /** distância que uma peça percorre ao entrar, em pontos. 0 = só tom. */
    entra: number;
    /** ms entre irmãs numa fila. 0 = todas juntas. */
    cascata: number;
  };
  FORMA: Forma;
  /** a marca do personal, já resolvida contra ESTA paleta */
  primaria: string;
  secundaria: string;
  /** `cor` opcional: sem cor, o acento é a marca do personal. Toda tela que recebe
   *  `accent?: string` como prop cai aqui sem precisar do `|| T.accentFallback` que
   *  estava copiado em vinte arquivos. */
  acento: (cor?: string, ground?: string) => ReturnType<typeof accentSet>;
  /** o par da MASSA — o botão cheio. Devolve também o anel, que é vazio quando o
   *  preenchimento já se separa do chão sozinho. */
  massa: (cor?: string) => { fill: string; ink: string; ring: string };
  /** O SEGUNDO BOTÃO, derivado do primeiro. Não é um par de tokens fixos: o preenchimento
   *  do secundário é o degrau neutro que alcança presença(primário)/√2 a partir do fundo
   *  REAL onde ele pousa — e por isso `fundo` é obrigatório de fato, mesmo tendo padrão.
   *  Quando a marca é fraca (preenchimento colado no chão), a presença-alvo tende a zero e
   *  `parelha` degrada continuamente para `salto` sem um único `if` de exceção. Nenhum
   *  valor pode inverter o rank porque o rank É a fórmula. */
  secundario: (fundo?: string, cor?: string) => {
    fundo: string;
    tinta: string;
    /** O MESMO rótulo, desligado. Mora aqui e não na peça porque quem sabe em que pixel
     *  ele pousa é o par de ações — `parelha` deriva o preenchimento em tempo de execução,
     *  e nenhum token fixo do produto é calibrado contra ele. */
    desligada: string;
    borda: string;
    larguraDaBorda: number;
  };
  acentoEm: (cor?: string, ground?: string, min?: number) => string;
  errorInk: string;
  dockActiveMin: number;
};

type DegrauDoEspaco = keyof typeof SPACE;
const DEGRAUS = ["hair", "tight", "step", "block", "room", "max"] as const;

function espacos(d: Densidade): Escala<DegrauDoEspaco> {
  const mapa = DENSIDADES[d] ?? DENSIDADES.normal;
  const out = {} as Escala<DegrauDoEspaco>;
  DEGRAUS.forEach((degrau, i) => {
    out[degrau] = SPACE[mapa[i] ?? degrau];
  });
  return out;
}

/** ALVO DE DEDO. Fica FORA do alcance da densidade, e é a trava mais importante da
 *  fábrica: apertar o vão é escolha de gosto, apertar a área de toque é defeito. Sem esta
 *  separação, "compacta" venderia elegância e entregaria erro de toque — e nenhum eixo do
 *  gate mede altura de alvo, então isso passaria calado. */
export const ALVO = { minimo: 44, chip: 52, acao: 56, linha: 64 } as const;

/** Os três portes em pontos. `folgado` É `ALVO.acao` — o teto do cardápio é o tamanho que
 *  o app tinha, e não um degrau novo acima dele. */
export const PORTES: Record<Porte, number> = { justo: 48, padrao: 52, folgado: ALVO.acao };

/** A FÁBRICA. Documento entra, tokens saem. Sem React, sem import: `tools/contrast.mjs` e
 *  `tools/aparencia.mjs` chamam isto em node puro e medem exatamente o que a tela desenha
 *  — nenhuma cópia de token, nenhuma fórmula duplicada, nada em que acreditar. */
export function criarTema(a: Aparencia = APARENCIA_PADRAO): Tema {
  const dado = paletaDoChao(a.chao);
  // `normal` NÃO passa pelo transformador: o padrão do app não pode andar um centésimo
  // por causa de um multiplicador que vale 1.
  const chao = a.contraste === "alto" ? tintasFortes(dado, 1.2) : dado;
  const espaco = espacos(a.densidade);
  const T: Paleta = {
    ...chao,
    ok: chao.ink,
    accentFallback: a.primaria || productTheme.accentFallback,
    pad: espaco.step,
  };
  const primaria = a.primaria || productTheme.accentFallback;
  // A segunda cor tem que sobreviver a DUAS vizinhanças ao mesmo tempo: não pode chegar
  // igual à marca depois do motor de peça (duas cores diferentes empurradas pelo mesmo
  // piso chegam iguais na tela), e não pode ser confundida com o aviso. Resolver uma de
  // cada vez faria a segunda desfazer a primeira — então a condição é uma só.
  // O CHÃO DO AVISO É O DIFÍCIL. `errorInk` era a única tinta do sistema que resolvia
  // contra `T.bg` e era pintada nos QUATRO fundos — dentro de Band levantada (PerfilTime,
  // Aparência) e como borda do Campo, que é o único sinal de que o hex digitado não serve.
  // Medido antes do conserto, 7 chãos x 30 marcas x 4 fundos x 2 contrastes: 636 de 1.680
  // abaixo de 4,5, pior 3,94. O padrão de fábrica estava a salvo por ACIDENTE — só na
  // marca vermelha o `afastar` de matiz dispara e empurra a tinta para longe sozinho.
  const dificil = chaoDificil(T);
  const aviso = afastar(
    accentOn(PERIGO, dificil, 4.5),
    // A marca continua sendo comparada como a TELA a escreve, contra `bg`: quem muda de
    // chão aqui é o piso do aviso, não o par que decide se as duas cores são duas.
    accentOn(primaria, T.bg, 4.5),
    dificil,
    4.5,
    separadasNoMatiz,
  );
  const marcaEmPeca = accentFill(primaria, T).fill;
  const secundaria = afastarAte(
    a.secundaria === "auto" ? secundariaDe(primaria, chao.bg) : a.secundaria,
    (c) =>
      separadas(accentFill(c, T).fill, marcaEmPeca) &&
      separadas(accentOn(c, T.bg, 4.5), aviso),
  );
  const coreo = MOVIMENTOS[a.movimento] ?? MOVIMENTOS.normal;
  const mov = coreo.duracao;
  const par = VOZES[a.voz] ?? VOZES.bloco;
  const raios = RAIOS[a.forma] ?? RAIOS.reta;
  // A borda nunca passa de um quarto do menor vão — contorno grosso na densidade compacta
  // punha 6pt de tinta num vão de 12, metade do vão virando traço. E o fio é METADE da
  // borda, sempre: é ele que separa "dentro do bloco" de "entre blocos".
  const borda = Math.min(BORDAS[a.peso] ?? 2, Math.floor(espaco.tight / 4));
  const fio = Math.max(0.5, borda / 2);
  return {
    aparencia: a,
    escuro: luminance(chao.bg) < 0.18,
    T,
    SPACE: espaco,
    // ÓPTICA. Caixa alta varia 0,686 (Archivo) a 0,810 (Oswald) — 18% no MESMO corpo. Sem
    // correção, o herói de 92pt do produto MUDA DE TAMANHO quando o personal troca a voz,
    // e a tela de comemoração é a que mais paga. O multiplicador não é escolhido: sai da
    // métrica lida do arquivo da fonte, um para o display (caixa alta) e outro para o
    // texto (altura de x, que é o que decide se um parágrafo lê grande ou pequeno).
    TYPE: corpos(par),
    LEAD: entrelinhas(par),
    TRACK: Object.fromEntries(
      (Object.keys(TRACK) as (keyof typeof TRACK)[]).map((k) => [k, TRACK[k] + par.ajuste]),
    ) as Escala<keyof typeof TRACK>,
    FONT: par.display,
    FONTES: par,
    MOTION: {
      // `press` NÃO entra na conta do movimento. Ele é resposta de dedo, não animação:
      // acima de ~100 ms o app fica "pesado" exatamente na alavanca vendida como premium,
      // e abaixo de ~60 ms o toque pisca. Medido antes do conserto: 131 ms no generoso e
      // 50 ms no seco. Mesma lei do PISO 8 do espaço e do ALVO de 44pt — a alavanca de
      // gosto não alcança o que é resposta ao corpo.
      press: MOTION.press,
      state: Math.round(MOTION.state * mov),
      enter: Math.round(MOTION.enter * mov),
      // `turn` e `reveal` SÃO animação, e são as duas maiores esperas do sistema — a
      // virada e a chegada do botão na comemoração. Ficavam de fora do multiplicador, de
      // modo que a alavanca vendida como "duração das transições" alcançava os 220 e os
      // 340 ms e não alcançava os 3.700 e os 5.900: no seco o app respondia rápido e
      // depois parava seis segundos, e no generoso a espera não crescia junto.
      turn: Math.round(MOTION.turn * mov),
      reveal: Math.round(MOTION.reveal * mov),
      // A CURVA SAI DA COREOGRAFIA, e não do módulo. Era `MOTION.ease` fixo: as três
      // opções mudavam quatro inteiros e nenhuma curva, e curva é a metade da personalidade
      // que o olho lê sem saber que está lendo.
      ease: coreo.ease,
      // QUANTO UMA PEÇA PERCORRE AO ENTRAR, resolvido em pontos aqui e não no componente —
      // é a mesma lei do PISO 8: distância é vão, e vão sai da escada.
      entra: coreo.distancia === "nenhuma" ? 0 : espaco[coreo.distancia],
      // E o atraso entre irmãs numa fila. Zero = a fila chega como um objeto só.
      cascata: coreo.cascata,
    },
    FORMA: (() => {
      const ehVidro = a.superficie === "vidro";
      const claro = luminance(chao.bg) > 0.5;
      // Dois travamentos que impedem a combinação incoerente de existir, em vez de avisar
      // sobre ela depois:
      //   o canto nunca passa da margem do conteúdo — pílula na densidade compacta seria
      //   arco de 18 num respiro de 12, com a primeira linha de texto entrando na curva;
      //   a borda nunca passa de um quarto do menor vão — contorno grosso na compacta
      //   punha 6pt de tinta num vão de 12, metade do vão virando traço.
      const raio = Math.min(raios.raio, espaco.step);
      const raioAcao = Math.min(raios.raioAcao, Math.max(espaco.step, raios.raio));
      // A ELEVAÇÃO não é a mesma coisa nos dois mundos. No chão claro ela é sombra. No
      // escuro, sombra preta sobre preto não existe — `elevada` e `sólida` sairiam
      // idênticas —, então ali quem levanta é um FIO DE LUZ no topo da peça, que é como
      // toda interface escura boa mostra altura.
      const elevada = a.superficie === "elevada";
      // AS DUAS FAMÍLIAS NOVAS SÃO AS DUAS VELHAS COM A DIREÇÃO TROCADA, e é de propósito:
      // material que inventa cor nova sai do cardápio fechado e vira loteria de marca.
      //   `fio`   é `contorno` mais um segundo traço, numa caixa INTERNA — nunca na mesma
      //           aresta do delimitador (SPEC §2.7).
      //   `vinco` é `elevada` com o sinal de altura ao contrário.
      const emFio = a.superficie === "fio";
      const vinco = a.superficie === "vinco";
      // No chão CLARO o vidro também ganha sombra. Ali o véu não alcança a separação de
      // luz sozinho — branco sobre quase-branco tem 6,5 de L* de curso inteiro, e gastar
      // tudo em opacidade mataria o desfoque. Então a separação vem de onde ela pode vir
      // no claro: da sombra. No escuro isso não existe (sombra preta sobre preto), e lá o
      // véu de tinta clara resolve sozinho.
      const elevacao = claro && (elevada || ehVidro || vinco) ? 0.12 : 0;
      const veuComposto = ehVidro
        ? compor(tintaDoVeu(chao), alfaDoVeu(chao), chao.bg)
        : a.superficie === "contorno"
          ? chao.bg
          : chao.raised;
      const semSombra = sombraDe(0);
      const sombra = sombraDe(elevacao);
      // O VINCO É A MESMA SOMBRA COM O SINAL TROCADO. Não é sombra interna — React Native
      // não tem uma, e forjá-la custaria um estrato a mais em toda Band —, é a mesma peça
      // deitando a sombra para CIMA, que é o que o olho lê como rebaixo quando a luz do
      // resto do app vem de cima. Sai de `sombraDe` para o raio e a opacidade nunca
      // divergirem dos de `elevada`: as duas famílias são a mesma medida, ao contrário.
      const sombraDoVinco: Sombra = {
        ...sombra,
        shadowOffset: { width: 0, height: -sombra.shadowOffset.height },
      };
      const fioDeLuz = withAlpha(chao.ink, claro ? 0.1 : 0.16);
      // A RÉGUA DO DOCK — UM traço, DUAS perguntas, e é ele que as duas molduras pintam.
      //
      //   DELIMITA  "onde a moldura acaba e o conteúdo começa" → 3:1 contra os DOIS lados.
      //   MATERIAL  "a moldura tem altura"                     → separação em L*.
      //
      // A moldura não pode responder à segunda com um fio de luz SEPARADO: a aresta de
      // cima dela já é o delimitador, e dois traços na mesma aresta leem como erro de
      // renderização (a lei que `Screen.tsx:206` escreve). Então quem carrega a altura é a
      // COR do delimitador — e as duas únicas cores que a SPEC §3 aceita para um traço que
      // carrega informação são `divider` e `ink`.
      //
      // MEDIDO, e é por isso que a altura NÃO migra para o fundo do dock (o outro caminho
      // possível): no chão escuro a escada inteira de `dock` até `raised` mede 5,2 a 6,3 de
      // L* — não cabe um degrau de 5 lá dentro —, e o primeiro degrau ACIMA de `raised` que
      // separa 5 é `fill`, onde `divider` cai para 2,42–2,76:1 e a régua morre. Levantar o
      // fundo do dock custa o delimitador; trocar a cor do traço não custa nada.
      //
      // No chão CLARO quem levanta é a sombra (`elevacao`), e o traço fica em `divider`:
      // somar a cor seria o segundo sinal para uma altura só.
      const reguaDoDock = elevada && !elevacao ? chao.ink : chao.divider;
      const veu = ehVidro ? withAlpha(tintaDoVeu(chao), alfaDoVeu(chao)) : "";
      const desfoque = VIDRO[a.superficie] ?? 0;
      // UMA função, três chamadas, três estratos fechados. `opaco` é o que a peça pinta
      // quando a superfície é cheia; `pousa` é o pixel de trás, que continua sendo o fundo
      // real de tudo que se escreve ali quando ela não pinta nada.
      const folhaDe = (opaco: string, pousa: string): Folha => {
        if (ehVidro) {
          return {
            fundo: veu,
            composto: compor(tintaDoVeu(chao), alfaDoVeu(chao), pousa),
            vidro: desfoque,
            borda: fio,
            corDaBorda: fioDeLuz,
            aresta: fioDeLuz,
            arestaEm: "topo",
            bloco: "",
            deslocamento: 0,
            sombra,
            tinta: chao.muted,
          };
        }
        if (a.superficie === "contorno") {
          return {
            fundo: "transparent",
            composto: pousa,
            vidro: 0,
            borda,
            corDaBorda: chao.divider,
            aresta: "",
            arestaEm: "topo",
            bloco: "",
            deslocamento: 0,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        // SEM BLOCO. O conteúdo pousa direto no chão: nenhum preenchimento, nenhum traço,
        // nenhum brilho, nenhuma sombra. Quem separa dois blocos é o VÃO e um filete.
        //
        // Não é o `contorno` com menos tinta — é o oposto dele. O contorno é uma caixa de
        // quatro lados, ou seja, MAIS cromo, não menos; sem este valor o minimalismo só
        // podia escolher entre cartão e gaiola, e caía em cima da sólida. Duas opções que
        // chegam iguais na tela são uma opção com dois nomes.
        if (a.superficie === "nenhuma") {
          return {
            fundo: "transparent",
            composto: pousa,
            vidro: 0,
            borda: 0,
            corDaBorda: "transparent",
            aresta: "",
            arestaEm: "topo",
            bloco: "",
            deslocamento: 0,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        // A MOLDURA DUPLA. Ela POUSA (é `raised` como a sólida, não a moldura vazada do
        // contorno) e desenha dois traços que nunca se encostam: o delimitador na aresta
        // de fora, na cor que a SPEC §3 exige, e o fio de luz numa caixa interna afastada
        // dele. Empilhar os dois na mesma aresta é o que derrubou 44 de 112 pares no ciclo
        // 7 (§2.7, cobrado pela §31) — aqui o que os separa é geometria, não cor.
        //
        // O delimitador vem no traço FINO e não no forte, e é isso que faz a família
        // caber: dois traços grossos em volta do mesmo bloco não leem como moldura, leem
        // como gaiola. É também o que separa esta moldura da do `contorno` no PIXEL, e não
        // só no nome — o dock e o chip inclusive, que são onde `fio` colidia com
        // `contorno` em 7 chãos antes disto.
        if (emFio) {
          return {
            fundo: opaco,
            composto: opaco,
            vidro: 0,
            borda: fio,
            corDaBorda: chao.divider,
            aresta: fioDeLuz,
            arestaEm: "moldura",
            bloco: "",
            deslocamento: 0,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        // O CARIMBO. Não é "contorno grosso" — isso já existe e é `contorno` com o traço
        // no peso forte, uma regulagem, não um material. O que faz esta família é o BLOCO
        // OPACO DESLOCADO ATRÁS: a sombra que não borra, não tem alfa e não depende do chão.
        //
        // Ele é `chao.fill`, um degrau da escada, e é aí que está a garantia: `ESCADA.fill`
        // vale 15,2 e `ESCADA.raised` 6,6, então ΔL* do bloco contra o chão fica em ~15 e
        // contra a peça em ~8,6 para QUALQUER chão que `escada()` aceite — inclusive hex
        // livre. Nenhuma outra família tem contraste garantido por construção nos dois
        // lados; todas as outras precisam de um ramo por polaridade.
        //
        // A borda vai em `chao.ink` porque aqui ela carrega informação, e a SPEC §3 permite
        // `divider` ou `ink` para traço que informa. E a sombra fica em `semSombra`: o
        // bloco É a sombra, e as duas juntas seriam dois sinais para uma altura só.
        if (a.superficie === "carimbo") {
          return {
            fundo: opaco,
            composto: opaco,
            vidro: 0,
            borda,
            corDaBorda: chao.ink,
            aresta: "",
            arestaEm: "topo",
            bloco: chao.fill,
            // Anda o dobro do traço: menos que isso e o bloco lê como borda dupla mal
            // alinhada, que é o defeito de 44/112 do ciclo 7 entrando pela porta nova.
            deslocamento: borda * 2,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        return {
          fundo: opaco,
          composto: opaco,
          vidro: 0,
          borda: 0,
          corDaBorda: "transparent",
          // O FIO DE LUZ e a SOMBRA são o mesmo sinal — altura — e nunca aparecem juntos
          // no mesmo chão: no escuro sombra preta sobre preto não existe e quem levanta é
          // o fio; no claro quem levanta é a sombra e somar o fio seria dois sinais para
          // uma altura só. É o conserto do defeito medido: hoje `elevada` e `solida` saem
          // IDÊNTICAS byte a byte em carvão, breu, grafite e tabaco.
          // O VINCO usa o MESMO fio e pelo mesmo motivo (no escuro a sombra preta sobre
          // preto não existe), só que na aresta de baixo — e é `arestaEm` que carrega
          // isso. Sem esse campo `vinco` e `elevada` sairiam byte a byte iguais nos quatro
          // chãos escuros, que é exatamente a colisão que esta folha nasceu para matar.
          aresta: (elevada || vinco) && !elevacao ? fioDeLuz : "",
          arestaEm: vinco ? "base" : "topo",
          bloco: "",
          deslocamento: 0,
          sombra: vinco ? sombraDoVinco : sombra,
          tinta: chao.muted,
        };
      };
      // O PREENCHIMENTO DA PEÇA PEQUENA tem um teto que a superfície não tem: dentro dela
      // se ESCREVE, e `muted` — a tinta do texto de apoio e do placeholder — é calibrada
      // contra os quatro fundos, não contra um degrau acima deles. Medido: o degrau cheio
      // de `neutroSobre` derruba `muted` para 3,66 no tabaco e 4,15 no grafite. Então o
      // degrau anda de volta até a tinta voltar ao piso, e para se ainda separa 5 de L* do
      // fundo. Se nem isso couber, a peça pequena FALA A LÍNGUA DO CONTORNO — que é o que
      // ela é hoje, em todas as superfícies. A queda é medida, não silenciosa: nos sete
      // chãos ela nunca dispara, e o par de degenerescência acusaria se disparasse, porque
      // ali `solida` e `contorno` passariam a ser a mesma folha.
      const preenchimentoMiudo = (dentroDe: string): string => {
        const cheio = neutroSobre(dentroDe, T);
        const alvoCheio = Math.abs(lstar(cheio) - lstar(dentroDe));
        for (let alvo = alvoCheio; alvo >= 5; alvo -= 0.5) {
          const cand = alvo === alvoCheio ? cheio : degrauNeutro(dentroDe, alvo, T);
          if (contrast(T.muted, cand) >= 4.5) return cand;
        }
        return "";
      };
      // A peça pequena NÃO ganha sombra em chão nenhum — sombra é da superfície, não do
      // chip — então ali o fio é o único sinal de altura que sobra, e é ele que separa
      // `elevada` de `solida` nos dois mundos.
      //
      // No VIDRO ela não ganha véu: dois véus empilhados não são um material que exista, e
      // o pixel composto de vidro sobre vidro é um vizinho que medidor nenhum deste repo
      // sabe olhar. Ali a peça pequena é a aresta sobre o mesmo composto da superfície.
      const miudaDe = (dentroDe: string): Folha => {
        // UM CAMPO SEM FRONTEIRA NÃO É UM CAMPO. `nenhuma` tira o bloco do CONTEÚDO, que se
        // separa pelo vão e pelo filete — mas a peça miúda é um alvo de toque: um campo de
        // texto, uma ficha, um seletor. Sem borda ela deixa de ter onde começar e o dedo
        // deixa de saber onde bater. Aqui o material cai na forma do `contorno`: sem
        // preenchimento, com o traço do delimitador. Silêncio no conteúdo, não no controle.
        if (a.superficie === "nenhuma") {
          return {
            fundo: "transparent",
            composto: dentroDe,
            vidro: 0,
            borda,
            corDaBorda: chao.divider,
            aresta: "",
            arestaEm: "topo",
            bloco: "",
            deslocamento: 0,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        if (ehVidro) {
          return {
            fundo: "transparent",
            composto: dentroDe,
            vidro: 0,
            borda: fio,
            corDaBorda: fioDeLuz,
            aresta: fioDeLuz,
            arestaEm: "topo",
            bloco: "",
            deslocamento: 0,
            sombra: semSombra,
            tinta: chao.muted,
          };
        }
        const cheia = preenchimentoMiudo(dentroDe);
        if (!cheia || a.superficie === "contorno") {
          const f = folhaDe(chao.raised, dentroDe);
          return { ...f, fundo: "transparent", composto: dentroDe, borda, corDaBorda: chao.divider, sombra: semSombra, aresta: "" };
        }
        const f = folhaDe(cheia, dentroDe);
        // O POÇO. A peça pequena dentro de uma superfície REBAIXADA ganha o anel do poço,
        // não um lábio de luz: um fio de meio ponto na aresta de baixo de um chip de 44pt
        // lê como erro de renderização, e não como rebaixo. O anel inteiro, na cor que
        // delimita, é o que sobra de legível naquele tamanho — e é ele que separa o chip
        // do `vinco` do chip da `elevada`, que fora isso seriam o mesmo pixel.
        if (vinco) return { ...f, sombra: semSombra, borda, corDaBorda: chao.divider, aresta: "" };
        return { ...f, sombra: semSombra, aresta: elevada || emFio ? fioDeLuz : "" };
      };
      // A tinta de apoio é DERIVADA da folha, e por isso ela é a última coisa a se
      // resolver: só depois de saber em que pixel a peça pousou dá para dizer o que se
      // escreve nela.
      const comTinta = (f: Folha): Folha => ({
        ...f,
        tinta: [T.muted2, T.muted, T.ink].find((c) => contrast(c, f.composto) >= 4.5) ?? T.ink,
      });
      const peca = comTinta(folhaDe(chao.raised, chao.bg));
      const corpoDoNumero = corpos(par).value;
      const unidadeDoNumero = corpos(par)[UNIDADE_DE.value];
      return {
        acao: {
          ...(ACOES[a.acao] ?? ACOES.linha),
          hierarquia: a.hierarquia ?? "salto",
          anel: a.anel ?? "resgate",
        },
        folha: {
          peca,
          // O dock pinta o PRÓPRIO degrau — quem pousa atrás dele é o chão. Antes desta
          // folha ele perguntava só `vidro`, e por isso `solida`, `contorno` e `elevada`
          // produziam o MESMO dock: 21 dos 42 pares de superfície colidiam ali.
          chrome: (() => {
            // A MOLDURA REBAIXADA NÃO PINTA DEGRAU PRÓPRIO: ela afunda até o nível do
            // chão, e o que a separa do conteúdo passa a ser só a régua de cima. É o
            // avesso exato do que `elevada` faz no escuro (lá a moldura SOBE trocando a
            // COR da régua) — e é o único movimento disponível, porque abaixo de `bg` a
            // escada não tem degrau nenhum. `bg` é um dos quatro fundos medidos, então
            // nada do que se escreve na moldura sai da régua por causa disto.
            const base = folhaDe(vinco ? chao.bg : chao.dock, chao.bg);
            // No contorno o chrome continua opaco: um dock transparente deixaria a lista
            // correr por baixo de rótulo nenhum.
            // A MOLDURA NUNCA VAZA, e `nenhuma` entra nesta lista pelo mesmo motivo que o
            // contorno: a §10.4 mediu o que acontece com um dock transparente — o rótulo
            // inativo cai de 4,52 para 1,04 de contraste com conteúdo real passando por
            // baixo. "Sem bloco" é uma decisão sobre a superfície de CONTEÚDO; o cromo é
            // cromo. Aqui ela veste o dock da sólida, e o par que isso cria com a sólida é
            // registrado como colisão de propósito no medidor, com este motivo.
            const opaca =
              a.superficie === "contorno" || a.superficie === "nenhuma" || emFio
                ? { ...base, fundo: chao.dock, composto: chao.dock }
                : base;
            // O TRAÇO DE CIMA DA MOLDURA É UM SÓ, e a folha o declara inteiro — espessura e
            // cor. Antes daqui a folha declarava `borda: 0` na sólida e `borda` no contorno,
            // e as duas molduras pintavam `FORMA.borda` de qualquer jeito: a §16 lia uma
            // diferença que o pixel não tinha, e por isso dava 0 colisões enquanto o pixel
            // dava 15 de 42. Aqui os dois campos são o que a tela pinta, e a §33 mede
            // exatamente os campos que o arquivo consome.
            //
            // `aresta` é vazia de propósito e para sempre: a moldura não tem fio de luz
            // (ver `reguaDoDock`). Um campo que a folha declara e ninguém pinta é o defeito
            // que este repo já pagou três vezes.
            // A ESPESSURA TAMBÉM É DA FOLHA, e é ela que faz a moldura dupla existir no
            // dock: ali o segundo traço não cabe (a aresta de cima é o delimitador e nada
            // mais pode encostar nela), então o que a família diz na moldura é o traço
            // FINO — o mesmo que ela usa na peça. Sem isto o dock de `fio` saía byte a
            // byte igual ao de `solida` nos sete chãos.
            // O CARIMBO NÃO CARIMBA A MOLDURA — ela está colada na borda da tela e não há
            // para onde o bloco deslocar. O que ela carrega da família é a RÉGUA: traço em
            // `ink`, o mesmo que a peça usa, e que a SPEC §3 permite para delimitador. Sem
            // isto o dock do carimbo sairia byte a byte igual ao da sólida — uma família a
            // mais no cardápio e uma moldura a menos na tela.
            return comTinta({
              ...opaca,
              // E a espessura, porque a COR sozinha não basta: no chão escuro `elevada` já
              // pinta a régua em `ink` (lá a sombra não existe, então quem levanta é o
              // traço), e as duas sairiam iguais. O carimbo dobra o traço — que é
              // literalmente a linguagem dele, a mesma que a peça pinta.
              borda: emFio ? fio : a.superficie === "carimbo" ? borda * 2 : borda,
              corDaBorda: a.superficie === "carimbo" ? chao.ink : reguaDoDock,
              aresta: "",
            });
          })(),
          miuda: comTinta(miudaDe(peca.composto)),
        },
        numero: {
          modo: a.numero ?? "empilhado",
          rotuloAbaixo: a.numero === "cartaz",
          colunas: (pedidas, largura, digitos = 4) => {
            // `linha` é o único tipo que nunca reprova por cabimento, porque é uma coluna
            // por definição — o rótulo à esquerda e o número à direita.
            if (a.numero === "linha") return 1;
            const precisa =
              digitos * corpoDoNumero * AVANCO_DO_DIGITO +
              folgaDaUnidade(corpoDoNumero) +
              2 * unidadeDoNumero * AVANCO_DO_DIGITO;
            for (let n = Math.max(1, pedidas); n > 1; n--) {
              if (largura / n - 2 * espaco.step >= precisa) return n;
            }
            return 1;
          },
        },
        raio,
        raioAcao,
        borda,
        // O fio é METADE da borda, sempre: é ele que separa "dentro do bloco" de "entre
        // blocos". Cravado em 1 ele COLAPSAVA com a borda no peso fino — três dos seis
        // kits de fábrica desenhavam os dois traços com a mesma espessura, e a hierarquia
        // que o comentário anterior prometia não existia em nenhum deles.
        fio,
        // A CÉLULA DE NÚMERO SEGUE O BLOCO. `cartao` é a forma de quem pinta uma superfície;
        // sem bloco não existe cartão para a célula pousar, e o medidor pega isso na hora —
        // "em cartão a tinta é o pixel de trás" reprova porque não há pixel de trás. Sem
        // bloco a célula é a mesma coisa que o resto do material: um fio.
        celula:
          a.superficie === "nenhuma"
            ? // Sem bloco, o separador é a GRADE — mas grade é fio reto, e fio reto cruzando
              // um canto arredondado é o defeito que a régua "o fio da grade não cruza o
              // canto" existe para pegar. Com canto, a célula vira caixa: continua sem
              // preenchimento, e o traço passa a acompanhar o arco em vez de atravessá-lo.
              raio === 0
              ? { modo: "fio" as const, tinta: chao.divider }
              : { modo: "caixa" as const, tinta: chao.divider }
            : raio === 0 && a.superficie === "solida"
              ? { modo: "fio" as const, tinta: chao.hairline }
              : a.superficie === "contorno"
                ? { modo: "caixa" as const, tinta: chao.divider }
                : { modo: "cartao" as const, tinta: veuComposto },
        traco: borda,
        ponta: raio === 0 ? ("square" as const) : ("round" as const),
        // O CARIMBO COBRA RECUO MESMO SEM CANTO. `inset` nasceu para a família de canto
        // arredondado (canto encostado na borda da tela não lê como canto, lê como erro),
        // então na família reta ele é zero e a superfície sangra. Só que o bloco deslocado
        // do carimbo mora FORA da peça: com recuo zero ele sai pela borda da tela e é
        // cortado, e o material vira uma borda grossa e nada mais. Regra do MATERIAL,
        // resolvida no material.
        inset: raio ? espaco.step : a.superficie === "carimbo" ? borda * 2 : 0,
        // A altura da ação só SOBE, e ALVO é o piso. Na anatomia empilhada ela vem das
        // duas caixas de linha que o botão passa a ter — a do rótulo e a do custo — mais o
        // respiro do bloco: se a altura ficasse no componente, o principal viraria uma laje
        // de 76pt ao lado de uma tira de 56 nas dez telas que têm os dois botões.
        //
        // O DEGRAU É `hair` PORQUE É `hair` QUE O BOTÃO PAGA. Enquanto isto orçava `tight`
        // e os dois CTAs pagavam `step`, o teto do tema era ficção: `tools/botao.mjs` lê o
        // degrau DENTRO de AccentCTA.tsx e mediu 100 das 144 combinações acima do teto
        // premium, a mais alta em 100pt. Orçamento e pagamento agora são o mesmo degrau —
        // trocar um sem o outro reprova na régua.
        alturaAcao: Math.max(
          PORTES[a.porte] ?? PORTES.padrao,
          ACOES[a.acao]?.empilha ? entrelinhas(par).body + entrelinhas(par).label + 2 * espaco.hair : 0,
        ),
        alturaChip: ALVO.chip,
        alturaMinima: ALVO.minimo,
        raioEm: (size: number) =>
          raios.raioAcao > 100 ? size / 2 : Math.min(raio, Math.round(size / 4)),
        superficie: a.superficie,
        elevacao,
        vidro: VIDRO[a.superficie] ?? 0,
        sombra: sombraDe(elevacao),
        // O VÉU DO VIDRO compõe EXATAMENTE `raised` sobre o chão. Não é preciosismo: é a
        // única forma de o texto sobre vidro continuar pousando num dos quatro fundos que
        // tools/contrast.mjs mede. Um véu de alfa qualquer produziria um pixel composto
        // que medidor nenhum deste repo sabe olhar. O vidro muda a TEXTURA — o fio de luz
        // e o desfoque —, nunca o VALOR da superfície.
        veu,
        veuComposto,
        aresta: ehVidro || elevada || vinco || emFio ? withAlpha(chao.ink, claro ? 0.1 : 0.16) : "",
      };
    })(),
    primaria,
    secundaria,
    acento: (cor, ground) => accentSet(cor || primaria, ground ?? T.bg, T),
    massa: (cor) => accentMassa(cor || primaria, T, 4.5, a.anel ?? "resgate"),
    secundario: (fundo, cor) =>
      acaoSecundaria(
        a.hierarquia ?? "salto",
        fundo ?? T.bg,
        accentMassa(cor || primaria, T, 4.5, a.anel ?? "resgate").fill,
        T,
        borda,
        fio,
      ),
    acentoEm: (cor, ground, min) => accentOn(cor || primaria, ground ?? T.bg, min ?? 3),
    // O aviso ANDA quando a marca do personal é vermelha. Sem isto, o time cuja marca é
    // #ec3013 — o padrão de fábrica, aliás — escreve erro exatamente na cor da própria
    // marca: o vermelho deixa de significar "olha isto" e vira decoração.
    errorInk: aviso,
    dockActiveMin: contrast(T.muted2, T.dock) * Math.SQRT2,
  };
}
