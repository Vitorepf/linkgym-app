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
  /** altura de X da face de texto, em em. */
  x: number;
  /** a maior linha natural do par, em em (ascender - descender + gap do hhea). */
  linha: number;
  /** correção de tracking do par, somada ao TRACK do degrau. Face estreita pede mais ar,
   *  face larga pede menos: sem isto, trocar a voz estraga o ritmo da linha. */
  ajuste: number;
};

/** A REFERÊNCIA ÓPTICA é o Archivo, que é a voz de hoje: assim `bloco` sai com
 *  multiplicador 1 e o padrão não anda um pixel. */
const CAP_REF = 0.686;
const X_REF = 0.526;

export const VOZES: Record<Voz, ParDeFontes> = {
  bloco: { display: FONT, texto: FONT, numero: FONT, cap: 0.686, x: 0.526, linha: 1.088, ajuste: 0 },
  // A face mais bem resolvida do repo em métrica: caixa alta 0,728, altura de x 0,546 e
  // `tnum` presente. Sai de graça — o pacote já estava instalado por causa da editorial.
  neutra: {
    display: "Inter_700Bold",
    texto: "Inter_500Medium",
    numero: "Inter_700Bold",
    cap: 0.728,
    x: 0.546,
    linha: 1.21,
    ajuste: 0,
  },
  tecnica: {
    display: "SpaceGrotesk_700Bold",
    texto: "SpaceGrotesk_500Medium",
    numero: "SpaceGrotesk_700Bold",
    cap: 0.7,
    x: 0.486,
    linha: 1.276,
    ajuste: 0.2,
  },
  editorial: {
    display: "PlayfairDisplay_700Bold",
    texto: "Inter_500Medium",
    // Playfair tem `lnum` e não tem `tnum`: serve ao título, não ao cronômetro.
    numero: "Inter_700Bold",
    cap: 0.708,
    x: 0.546,
    linha: 1.333,
    ajuste: 0.1,
  },
  suave: {
    display: "Nunito_800ExtraBold",
    texto: "Nunito_600SemiBold",
    // Nunito não tem nenhuma feature de dígito: o número cai na face do produto.
    numero: FONT,
    cap: 0.705,
    x: 0.484,
    linha: 1.364,
    ajuste: 0.1,
  },
  condensada: {
    display: "Oswald_600SemiBold",
    texto: "Archivo_500Medium",
    numero: FONT,
    cap: 0.81,
    x: 0.578,
    linha: 1.482,
    ajuste: 0.4,
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
export const ACCENT_CHOICES = [
  "#ec3013",
  "#f59e0b",
  "#ffd400",
  "#22aa55",
  "#00b8b8",
  "#2d7ef7",
  "#7b61ff",
  "#e754a6",
  "#f3f2f2",
  "#121111",
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

export type Superficie = "solida" | "contorno" | "vidro" | "elevada";
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

const MOVIMENTOS: Record<Movimento, number> = { seco: 0.55, normal: 1, generoso: 1.45 };

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

const ELEVACAO: Record<Superficie, number> = {
  solida: 0,
  contorno: 0,
  vidro: 0.18,
  elevada: 0.3,
};

const VIDRO: Record<Superficie, number> = { solida: 0, contorno: 0, vidro: 26, elevada: 0 };

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

const DISPLAY = ["title", "value", "hero", "mega"] as const;
type DegrauDeCorpo = keyof typeof TYPE;

/** Os seis degraus, corrigidos pela ÓPTICA da voz. Display e texto andam por
 *  multiplicadores diferentes porque são duas faces diferentes: quem decide o tamanho
 *  aparente de um título é a caixa alta, e o de um parágrafo é a altura de x. */
function corpos(par: ParDeFontes): Escala<DegrauDeCorpo> {
  const kd = CAP_REF / par.cap;
  const kt = X_REF / par.x;
  const out = {} as Escala<DegrauDeCorpo>;
  for (const k of Object.keys(TYPE) as DegrauDeCorpo[]) {
    const display = (DISPLAY as readonly string[]).includes(k);
    out[k] = Math.round(TYPE[k] * (display ? kd : kt));
  }
  return out;
}

/** A entrelinha acompanha o corpo corrigido E respeita a LINHA NATURAL da face. Oswald
 *  pede 1,482em: o `LEAD.label` de 16 sobre corpo 12 cortava o Á, o Ç e o Õ na base —
 *  em português isso não é detalhe, é metade das palavras. */
function entrelinhas(par: ParDeFontes): Escala<DegrauDeCorpo> {
  const corpo = corpos(par);
  const out = {} as Escala<DegrauDeCorpo>;
  for (const k of Object.keys(LEAD) as DegrauDeCorpo[]) {
    const display = (DISPLAY as readonly string[]).includes(k);
    const escalado = Math.round(LEAD[k] * (display ? CAP_REF / par.cap : X_REF / par.x));
    // Dois pisos, um por natureza de degrau. TEXTO precisa caber a LINHA NATURAL da face,
    // senão o Á, o Ç e o Õ raspam a base — em português isso é metade das palavras.
    // DISPLAY usa entrelinha negativa de propósito (é o que faz um número de 92pt ler como
    // número e não como parágrafo), e o piso dele é só a própria letra com acento: caixa
    // alta mais o espaço do agudo. Aplicar a linha natural aqui engordaria o herói do app
    // de hoje em nove pontos.
    out[k] = Math.max(escalado, Math.ceil(corpo[k] * (display ? par.cap + 0.15 : par.linha)));
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
  const mov = MOVIMENTOS[a.movimento] ?? 1;
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
      ease: MOTION.ease,
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
      // No chão CLARO o vidro também ganha sombra. Ali o véu não alcança a separação de
      // luz sozinho — branco sobre quase-branco tem 6,5 de L* de curso inteiro, e gastar
      // tudo em opacidade mataria o desfoque. Então a separação vem de onde ela pode vir
      // no claro: da sombra. No escuro isso não existe (sombra preta sobre preto), e lá o
      // véu de tinta clara resolve sozinho.
      const elevacao = claro && (elevada || ehVidro) ? 0.12 : 0;
      const veuComposto = ehVidro
        ? compor(tintaDoVeu(chao), alfaDoVeu(chao), chao.bg)
        : a.superficie === "contorno"
          ? chao.bg
          : chao.raised;
      const semSombra = sombraDe(0);
      const sombra = sombraDe(elevacao);
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
          aresta: elevada && !elevacao ? fioDeLuz : "",
          sombra,
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
        if (ehVidro) {
          return {
            fundo: "transparent",
            composto: dentroDe,
            vidro: 0,
            borda: fio,
            corDaBorda: fioDeLuz,
            aresta: fioDeLuz,
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
        return { ...f, sombra: semSombra, aresta: elevada ? fioDeLuz : "" };
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
            const base = folhaDe(chao.dock, chao.bg);
            // No contorno o chrome continua opaco: um dock transparente deixaria a lista
            // correr por baixo de rótulo nenhum.
            const opaca =
              a.superficie === "contorno"
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
            return comTinta({ ...opaca, borda, corDaBorda: reguaDoDock, aresta: "" });
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
        celula:
          raio === 0 && a.superficie === "solida"
            ? { modo: "fio" as const, tinta: chao.hairline }
            : a.superficie === "contorno"
              ? { modo: "caixa" as const, tinta: chao.divider }
              : { modo: "cartao" as const, tinta: veuComposto },
        traco: borda,
        ponta: raio === 0 ? ("square" as const) : ("round" as const),
        inset: raio ? espaco.step : 0,
        // A altura da ação só SOBE, e ALVO é o piso. Na anatomia empilhada ela vem das
        // duas caixas de linha que o botão passa a ter — a do rótulo e a do custo — mais o
        // respiro do bloco: se a altura ficasse no componente, o principal viraria uma laje
        // de 76pt ao lado de uma tira de 56 nas dez telas que têm os dois botões.
        alturaAcao: Math.max(
          ALVO.acao,
          ACOES[a.acao]?.empilha ? entrelinhas(par).body + entrelinhas(par).label + 2 * espaco.tight : 0,
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
        aresta: ehVidro || elevada ? withAlpha(chao.ink, claro ? 0.1 : 0.16) : "",
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
