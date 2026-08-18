// Tokens Modernist do LinkGym. ZERO import: tools/contrast.mjs importa este arquivo em
// node puro (o tipo é tirado na hora). Não adicione dependência aqui.

export const FONT = "Archivo_800ExtraBold";

export const productTheme = {
  // O chão é bg — o mesmo rootViewBackgroundColor de app.json. surface/raised sobem dele.
  bg: "#0b0a0a",
  surface: "#141312",
  dock: "#0f0e0e",
  raised: "#1c1a19",
  ink: "#f3f2f2",
  muted: "#9b9797",
  // muted2 subiu de #7d7979: reprovava 4,5:1 como texto em surface, dock e raised.
  muted2: "#868181",
  hairline: "#232120",
  // divider subiu de #444141: reprovava 3:1 como elemento de UI nos QUATRO fundos.
  // Todo traço e toda borda do app dependem deste número.
  divider: "#696565",
  fill: "#2d2b2b",
  // ponytail: `ok` era #7ee0a1 — verde semântico, que este produto não pode ter (é o
  // acento do time 19 e matiz nunca significa "bom" aqui). Colapsou em ink: cumprido é
  // marcado por PRESENÇA de tinta, não por cor. A chave fica porque tools/contrast.mjs
  // a lê; some quando o gate parar de pedi-la.
  ok: "#f3f2f2",
  radius: 0,
  accentFallback: "#ec3013",
  pad: 20,
} as const;

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
  count: 900,
  turn: 3700,
  reveal: 5900,
  ease: [0.2, 0, 0, 1],
  easeOut: [0.16, 1, 0.3, 1],
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
function accentFill(accent: string, min = 4.5): { fill: string; ink: string } {
  const key = `fill|${accent}|${min}`;
  const hit = memo.get(key);
  if (hit) return JSON.parse(hit) as { fill: string; ink: string };

  // Duas regras, uma peça. Primeiro o preenchimento tem que EXISTIR contra o chão — senão
  // o botão do time 13 é um retângulo invisível com texto solto em cima. `raised` é o
  // mais claro dos quatro fundos, então garantir 3:1 nele garante nos quatro, sem prop.
  const surface = accentOn(accent, productTheme.raised, 3);
  const inks: string[] = [productTheme.ink, productTheme.bg];
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
 *  sistema como qualquer outro acento, contra o chão onde o aviso é escrito. */
export const errorInk = accentOn(productTheme.accentFallback, productTheme.bg, 4.5);

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
export function accentSet(accent: string, ground: string = productTheme.bg) {
  return {
    text: accentOn(accent, ground, 4.5),
    mark: accentOn(accent, ground, 3),
    // `piece` ignora `ground` de propósito: accentFill já garante o piso contra `raised`,
    // o mais claro dos quatro fundos, e portanto contra os quatro.
    piece: accentFill(accent),
  };
}

/** A aba ativa do dock não pode EMPATAR com as inativas. O piso dela não é 4,5:1 (o
 *  mínimo de TEXTO): é o contraste da inativa vezes √2 — um degrau inteiro acima, tirado
 *  do próprio token e não chutado. Com 4,5 o time 13 entregava 4,53 na ativa contra
 *  5,02 do muted2 das inativas: a barra ficava com a hierarquia invertida. Vive aqui
 *  porque tools/contrast.mjs mede exatamente este número. */
export const dockActiveMin =
  contrast(productTheme.muted2, productTheme.dock) * Math.SQRT2;

/** Tom do toque: sempre AFASTA o preenchimento da sua tinta, então o rótulo nunca perde
 *  contraste enquanto o dedo está em cima. */
export function pressedFill(fill: string, ink: string): string {
  return shade(fill, luminance(ink) > luminance(fill) ? -0.07 : 0.07);
}
