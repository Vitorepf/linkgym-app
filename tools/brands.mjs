// 20 Times fictícios para o gate. HARDCODED de propósito: o gate tem que ser reprodutível.
// Índice 0 é a marca de controle (o fallback do produto).
// Os acentos são deliberadamente hostis: amarelo puro, cinza quase-fundo, neon,
// azul escuríssimo, branco, a própria tinta e o próprio fundo — além de cores normais.
export const BRANDS = [
  { name: "Fred", accent: "#ec3013" }, // 0 — controle: fallback do produto
  { name: "Ana", accent: "#ffff00" }, // 3 chars, amarelo puro
  { name: "Iron Lab", accent: "#39ff14" }, // neon
  { name: "Fabiana Personal Trainer Ltd", accent: "#c8a34a" }, // 28 chars
  { name: "Base 9", accent: "#000d3a" }, // azul escuríssimo
  { name: "Kau", accent: "#ffffff" }, // 3 chars, branco
  { name: "Corpo Livre", accent: "#121111" }, // cinza quase-fundo
  { name: "Marcos Halterofilismo Brasil", accent: "#7d7979" }, // 28 chars, = muted2
  { name: "Vila Fit", accent: "#00ffff" },
  { name: "Nine", accent: "#ff00ff" },
  { name: "Tá Pago", accent: "#1a1a1a" },
  { name: "Alto Rendimento", accent: "#2f4f2f" },
  { name: "Beto", accent: "#f3f2f2" }, // = ink
  { name: "Ponto 12", accent: "#0b0a0a" }, // = bg (pior caso)
  { name: "Duo", accent: "#4169e1" }, // 3 chars
  { name: "Renata Coach", accent: "#ffa500" },
  { name: "Bloco B", accent: "#8b0000" },
  { name: "Máquina", accent: "#c0c0c0" },
  { name: "Gama", accent: "#3a3838" },
  { name: "Selva", accent: "#7ee0a1" },
];

export function brand(index) {
  const b = BRANDS[Number(index)];
  if (!b) throw new Error(`marca ${index} não existe (0..${BRANDS.length - 1})`);
  return b;
}
