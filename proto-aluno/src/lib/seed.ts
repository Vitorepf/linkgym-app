import type {
  ArenaScope,
  Challenge,
  ClanKind,
  Deck,
  Exercise,
  FichaTreino,
  Group,
  Bora,
  LoadPoint,
  Person,
  Prescription,
  Duel,
  Proof,
  Raid,
  War,
  WeekDay,
} from "./types";

export const FRED = {
  name: "Fred",
  initials: "FR",
  id: "fred",
};

export const YOU_ID = "vitor";

export const YOU = {
  id: YOU_ID,
  name: "Vitor",
  initials: "VF",
};

/**
 * O lugar da pessoa é onde ela mora, não onde ela treina. Academia saiu do produto:
 * quem quer falar de academia posta sobre isso.
 *
 * A disputa acontece no setor. Setor deserto não dá disputa alcançável, então ela
 * sobe para a cidade sozinha. Aqui o setor está abaixo do mínimo de propósito: é o
 * caso interessante, e a interface tem que explicar a subida em vez de esconder.
 */
export const TERRITORY = {
  setor: "Setor Bueno",
  cidade: "Goiânia",
  setorAtivos: 23,
  setorMinimo: 40,
  cidadeAtivos: 1847,
};

export function arenaScope(t = TERRITORY): ArenaScope {
  return t.setorAtivos >= t.setorMinimo ? "setor" : "cidade";
}

export function arenaName(t = TERRITORY): string {
  return arenaScope(t) === "setor" ? t.setor : t.cidade;
}

export function arenaPeople(t = TERRITORY): number {
  return arenaScope(t) === "setor" ? t.setorAtivos : t.cidadeAtivos;
}

/** Por que a disputa não está no setor. Vazio quando ela está. */
export function arenaWhy(t = TERRITORY): string {
  if (arenaScope(t) === "setor") return "";
  return `${t.setor} tem ${t.setorAtivos} de pé nesta semana. Você disputa em ${t.cidade}.`;
}

export const NOW = new Date(2026, 7, 21, 18, 4);

/** venceu, empatou, perdeu, faltou. `faltou` só o pareamento lê. */
function cartel(v: number, e: number, p: number, f = 0) {
  return { venceu: v, empatou: e, perdeu: p, faltou: f };
}

export const PEOPLE: Person[] = [
  { id: "vitor", name: "Vitor", initials: "VF", color: "var(--color-stamp)", groupIds: ["c-ferro"], sport: "powerlifting", photo: "/faces/vitor.jpg", duelos: cartel(4, 1, 2) },
  { id: "marina", name: "Marina", initials: "MA", color: "var(--color-ink)", groupIds: ["c-ferro"], sport: "powerlifting", photo: "/faces/marina.jpg", duelos: cartel(11, 2, 3) },
  { id: "huan", name: "Huan", initials: "HU", color: "var(--color-mute)", groupIds: ["c-ferro"], sport: "hipertrofia", photo: "/faces/huan.jpg", duelos: cartel(6, 0, 5) },
  { id: "bia", name: "Bia", initials: "BI", color: "var(--color-fill)", groupIds: ["c-caixa"], sport: "crossfit", photo: "/faces/bia.jpg", duelos: cartel(8, 1, 4) },
  { id: "rafael", name: "Rafael", initials: "RA", color: "var(--color-edge)", groupIds: ["c-caixa"], sport: "crossfit", photo: "/faces/rafael.jpg", duelos: cartel(3, 0, 6) },
  { id: "fred", name: "Fred", initials: "FR", color: "var(--color-faint)", groupIds: ["c-ferro"], sport: "powerlifting", photo: "/faces/fred.jpg", duelos: cartel(5, 1, 5) },
  { id: "leo", name: "Léo", initials: "LE", color: "var(--color-ghost)", groupIds: ["c-asfalto"], sport: "corrida", photo: "/faces/leo.jpg", duelos: cartel(9, 0, 2) },
  { id: "camila", name: "Camila", initials: "CA", color: "var(--color-raised)", groupIds: ["c-asfalto"], sport: "corrida", photo: "/faces/camila.jpg", duelos: cartel(4, 1, 3) },
  { id: "diego", name: "Diego", initials: "DI", color: "var(--color-surface)", groupIds: ["c-barra"], sport: "calistenia", photo: "/faces/diego.jpg", duelos: cartel(7, 0, 1) },
  { id: "ana", name: "Ana", initials: "AN", color: "var(--color-line)", groupIds: ["c-novo"], sport: "geral", photo: "/faces/ana.jpg", duelos: cartel(0, 0, 0) },
];

export function personOf(id: string): Person {
  return (
    PEOPLE.find((p) => p.id === id) ?? {
      id,
      name: "Alguém",
      initials: "·",
      color: "var(--color-fill)",
      groupIds: [],
      sport: "geral",
      photo: "",
      duelos: { venceu: 0, empatou: 0, perdeu: 0, faltou: 0 },
    }
  );
}

export const SPORT_LABEL: Record<ClanKind, string> = {
  geral: "Geral",
  powerlifting: "Powerlifting",
  crossfit: "CrossFit",
  hipertrofia: "Hipertrofia",
  corrida: "Corrida",
  calistenia: "Calistenia",
  luta: "Luta",
};

/**
 * Quem é este estranho, em uma linha. Não existe academia nem armário: o que
 * localiza a pessoa é o que ela pratica e o clã em que ela caiu.
 */
export function personSpot(person: Person, gids: string[]): string {
  const sport = SPORT_LABEL[person.sport];
  const clan = gids.map((id) => GROUPS.find((g) => g.id === id)?.name).find(Boolean);
  return clan ? `${sport} · ${clan}` : `${sport} · sem clã`;
}

export function headlineOf(gids: string[], hasFeito: boolean): { line: string; solid: boolean } {
  const clan = gids.map((id) => GROUPS.find((g) => g.id === id)?.name).find(Boolean);
  if (!clan) return { line: arenaName(), solid: hasFeito };
  return { line: `${clan} · ${arenaName()}`, solid: hasFeito };
}

export const GROUPS: Group[] = [
  {
    id: "c-ferro",
    name: "Ferro Bruto",
    kind: "powerlifting",
    about: "Agachamento, supino, terra. Se você vem pela esteira, não é aqui.",
    cap: 30,
    memberIds: ["vitor", "marina", "huan", "fred"],
    weekSessions: 11,
    raids: 3,
  },
  {
    id: "c-caixa",
    name: "Caixa Preta",
    kind: "crossfit",
    about: "WOD todo dia. RX quando dá, escalado quando não dá. Ninguém julga o escalado.",
    cap: 24,
    memberIds: ["bia", "rafael"],
    weekSessions: 9,
    raids: 2,
  },
  {
    id: "c-asfalto",
    name: "Asfalto Quente",
    kind: "corrida",
    about: "Rua, esteira, trilha. Vale tudo que tem quilômetro no fim.",
    cap: 40,
    memberIds: ["leo", "camila"],
    weekSessions: 7,
    raids: 1,
  },
  {
    id: "c-barra",
    name: "Barra Livre",
    kind: "calistenia",
    about: "Peso do corpo. Barra, paralela, argola. Sem anilha e sem desculpa.",
    cap: 20,
    memberIds: ["diego"],
    weekSessions: 4,
    raids: 0,
  },
  {
    id: "c-novo",
    name: "Primeira Semana",
    kind: "geral",
    about: "Clã de quem começou agora. Ninguém aqui sabe o que está fazendo, e é por isso que funciona.",
    cap: 50,
    memberIds: ["ana"],
    weekSessions: 2,
    raids: 0,
  },
];

export function groupOf(id: string, live: Group[] = GROUPS): Group {
  return live.find((g) => g.id === id) ?? GROUPS.find((g) => g.id === id) ?? GROUPS[0]!;
}

/** Havendo vaga, entra quem chegar. A única porta é o teto. */
export function hasRoom(g: Group): boolean {
  return g.memberIds.length < g.cap;
}

export function roomLine(g: Group): string {
  const left = g.cap - g.memberIds.length;
  if (left <= 0) return "Lotado. Nenhuma vaga.";
  if (left === 1) return "1 vaga.";
  return `${left} vagas.`;
}

/**
 * Força do clã: sai da capacidade dos integrantes, não de quem está nele.
 * Sessão da semana pesa 1, raid cumprida pesa 5, porque raid é a marca difícil.
 */
export function clanPower(g: Group): number {
  return g.weekSessions + g.raids * 5;
}

export function clanLadder(groups: Group[] = GROUPS): Group[] {
  return [...groups].sort((a, b) => clanPower(b) - clanPower(a));
}

export const RAID: Raid = {
  id: "raid-fran",
  title: "Raid da semana",
  mark: "Fran · abaixo de 12 min",
  ends: "domingo",
  claimed: ["marina", "huan"],
};

export function groupLabel(g: Group): string {
  return g.name;
}

export function warSide(war: War, joined: string[]): "home" | "away" | null {
  if (joined.includes(war.homeId)) return "home";
  if (joined.includes(war.awayId)) return "away";
  return null;
}

export function proofGroupId(joined: string[], war: War): string | undefined {
  const side = warSide(war, joined);
  if (side === "home") return war.homeId;
  if (side === "away") return war.awayId;
  return joined[0];
}

export function clanOf(war: War, joined: string[], groups: Group[] = GROUPS): Group | null {
  const side = warSide(war, joined);
  if (!side) return null;
  return groupOf(side === "away" ? war.awayId : war.homeId, groups);
}

export function warLeadNote(war: War, home: Group, away: Group): string {
  const d = war.homeScore - war.awayScore;
  if (d > 0) return `A ${groupLabel(away)} precisa de ${d} pra empatar.`;
  if (d < 0) return `A ${groupLabel(home)} precisa de ${-d} pra empatar.`;
  return "Empate. Próxima sessão decide.";
}

export function paidSeenLine(groupName?: string): string {
  if (!groupName) return `${arenaName()} vê que você está em dia.`;
  return `${groupName} vê que você está em dia.`;
}

export function alreadySeenLine(groupName?: string): string {
  if (!groupName) return `${arenaName()} já viu.`;
  return `${groupName} já viu.`;
}

/**
 * Clã contra clã na semana. A moeda é sessão cumprida, que é a única coisa
 * comparável entre powerlifting e CrossFit: ninguém precisa levantar o mesmo peso
 * para aparecer no placar.
 */
export const WAR: War = {
  id: "w-semana",
  homeId: "c-ferro",
  awayId: "c-caixa",
  homeScore: 11,
  awayScore: 9,
  ends: "domingo",
  contributions: {
    vitor: 2,
    marina: 4,
    huan: 3,
    fred: 2,
    bia: 5,
    rafael: 4,
  },
};

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-ferro-7",
    groupId: "c-ferro",
    title: "4 sessões em 7 dias",
    days: 7,
    goalSessions: 4,
    doneSessions: 3,
    ends: "domingo",
  },
];

export const PRESCRIPTION: Prescription = {
  id: "p-2026-08-21",
  name: "A · Superior",
  minutes: 48,
  for_date: "2026-08-21",
  coach_line: "Carga da última. Se as 8 saírem fáceis, sobe 2,5.",
  items: [
    {
      id: "ex-supino",
      name: "Supino reto",
      load_kg: 60,
      planned_sets: 3,
      planned_reps: 8,
      rest_seconds: 90,
      last_kg: 57,
      last_reps: 8,
      notes: "Se as 8 saírem fáceis, sobe 2,5.",
    },
    {
      id: "ex-remada",
      name: "Remada curvada",
      load_kg: 50,
      planned_sets: 3,
      planned_reps: 10,
      rest_seconds: 90,
      last_kg: 52,
      last_reps: 10,
      notes: "",
    },
    {
      id: "ex-desenvolvimento",
      name: "Desenvolvimento",
      load_kg: 32,
      planned_sets: 3,
      planned_reps: 8,
      rest_seconds: 75,
      last_kg: 30,
      last_reps: 8,
      notes: "Não arquear a lombar.",
    },
  ],
};

export const LAST_WORKOUT: Prescription = {
  id: "p-2026-08-19",
  name: "B · Inferior",
  minutes: 52,
  for_date: "2026-08-19",
  coach_line: "Última vez foi quarta. Pode repetir igual.",
  items: [
    {
      id: "ex-agachamento",
      name: "Agachamento",
      load_kg: 80,
      planned_sets: 4,
      planned_reps: 6,
      rest_seconds: 120,
      last_kg: 75,
      last_reps: 6,
      notes: "Profundidade. Joelho acompanha o pé.",
    },
    {
      id: "ex-terra",
      name: "Levantamento terra",
      load_kg: 120,
      planned_sets: 3,
      planned_reps: 5,
      rest_seconds: 150,
      last_kg: 125,
      last_reps: 5,
      notes: "Trava no joelho. Sem bounce.",
    },
    {
      id: "ex-mesa",
      name: "Mesa flexora",
      load_kg: 40,
      planned_sets: 3,
      planned_reps: 10,
      rest_seconds: 75,
      last_kg: 38,
      last_reps: 10,
      notes: "",
    },
  ],
};

export const CATALOG: Exercise[] = [
  { id: "ex-supino", name: "Supino reto", load_kg: 60, planned_sets: 3, planned_reps: 8, rest_seconds: 90, last_kg: 57, last_reps: 8, notes: "" },
  { id: "ex-remada", name: "Remada curvada", load_kg: 50, planned_sets: 3, planned_reps: 10, rest_seconds: 90, last_kg: 52, last_reps: 10, notes: "" },
  { id: "ex-desenvolvimento", name: "Desenvolvimento", load_kg: 32, planned_sets: 3, planned_reps: 8, rest_seconds: 75, last_kg: 30, last_reps: 8, notes: "" },
  { id: "ex-agachamento", name: "Agachamento", load_kg: 80, planned_sets: 4, planned_reps: 6, rest_seconds: 120, last_kg: 75, last_reps: 6, notes: "" },
  { id: "ex-terra", name: "Levantamento terra", load_kg: 120, planned_sets: 3, planned_reps: 5, rest_seconds: 150, last_kg: 125, last_reps: 5, notes: "" },
  { id: "ex-elevacao", name: "Elevação lateral", load_kg: 10, planned_sets: 3, planned_reps: 12, rest_seconds: 60, last_kg: 8, last_reps: 12, notes: "" },
  { id: "ex-triceps", name: "Tríceps pulley", load_kg: 22, planned_sets: 3, planned_reps: 12, rest_seconds: 60, last_kg: 24, last_reps: 12, notes: "" },
  { id: "ex-rosca", name: "Rosca direta", load_kg: 16, planned_sets: 3, planned_reps: 10, rest_seconds: 60, last_kg: 14, last_reps: 10, notes: "" },
  { id: "ex-mesa", name: "Mesa flexora", load_kg: 40, planned_sets: 3, planned_reps: 10, rest_seconds: 75, last_kg: 38, last_reps: 10, notes: "" },
  { id: "ex-hipthrust", name: "Hip thrust", load_kg: 80, planned_sets: 4, planned_reps: 8, rest_seconds: 90, last_kg: 76, last_reps: 8, notes: "" },
  { id: "ex-stiff", name: "Stiff", load_kg: 70, planned_sets: 3, planned_reps: 8, rest_seconds: 90, last_kg: 72, last_reps: 8, notes: "" },
  { id: "ex-avanco", name: "Avanço", load_kg: 24, planned_sets: 3, planned_reps: 10, rest_seconds: 75, last_kg: 22, last_reps: 10, notes: "" },
];

export const CUES: Record<string, string> = {
  "ex-supino": "Escápulas juntas. Barra desce no mamilo. Cotovelo ~45°.",
  "ex-remada": "Tronco ~45°. Puxa para o umbigo. Sem impulso.",
  "ex-desenvolvimento": "Glúteo contraído. Barra sobe na linha da orelha.",
  "ex-agachamento": "Profundidade. Peito alto. Joelho acompanha o pé.",
  "ex-terra": "Trava no joelho. Sem bounce. Barra cola na canela.",
  "ex-elevacao": "Cotovelo macio. Sobe até o ombro. Sem trapézio.",
  "ex-triceps": "Cotovelo parado. Só o antebraço anda.",
  "ex-rosca": "Cotovelo colado. Sem balanço.",
  "ex-mesa": "Quadril colado. Sobe sem impulso.",
  "ex-hipthrust": "Queixo baixo. Trava em cima. Desce controlado.",
  "ex-stiff": "Joelhos macios. Barra cola na perna.",
  "ex-avanco": "Joelho de trás quase toca. Tronco alto.",
};

export const WEEK: WeekDay[] = [
  { for_date: "2026-08-17", label: "SEG", sessions: 1, me: false },
  { for_date: "2026-08-18", label: "TER", sessions: 0, me: false },
  { for_date: "2026-08-19", label: "QUA", sessions: 1, me: false },
  { for_date: "2026-08-20", label: "QUI", sessions: 0, me: false },
  { for_date: "2026-08-21", label: "SEX", sessions: 0, me: true },
  { for_date: "2026-08-22", label: "SÁB", sessions: 0, me: false },
  { for_date: "2026-08-23", label: "DOM", sessions: 0, me: false },
];

export const LOAD_BOOK: Record<string, LoadPoint[]> = {
  "ex-supino": [
    { date: "24 jul", kg: 55 },
    { date: "31 jul", kg: 57.5 },
    { date: "07 ago", kg: 60 },
    { date: "14 ago", kg: 60 },
  ],
  "ex-remada": [
    { date: "24 jul", kg: 42.5 },
    { date: "07 ago", kg: 47.5 },
    { date: "14 ago", kg: 50 },
  ],
  "ex-desenvolvimento": [
    { date: "31 jul", kg: 26 },
    { date: "14 ago", kg: 32 },
  ],
  "ex-agachamento": [
    { date: "17 jul", kg: 70 },
    { date: "31 jul", kg: 75 },
    { date: "14 ago", kg: 80 },
  ],
  "ex-terra": [
    { date: "17 jul", kg: 110 },
    { date: "31 jul", kg: 115 },
    { date: "14 ago", kg: 120 },
  ],
  "ex-rosca": [
    { date: "24 jul", kg: 12 },
    { date: "14 ago", kg: 16 },
  ],
};

/** Zona do corpo que o exercício testemunha. O app infere; a pessoa não declara. */
export const ZONA_DE: Record<string, { id: ZonaId; nome: string }> = {
  "ex-supino": { id: "peito", nome: "Peito" },
  "ex-remada": { id: "costas", nome: "Costas" },
  "ex-desenvolvimento": { id: "ombro", nome: "Ombro" },
  "ex-elevacao": { id: "ombro", nome: "Ombro" },
  "ex-triceps": { id: "braco", nome: "Braço" },
  "ex-rosca": { id: "braco", nome: "Braço" },
  "ex-agachamento": { id: "perna", nome: "Perna" },
  "ex-mesa": { id: "perna", nome: "Perna" },
  "ex-terra": { id: "posterior", nome: "Posterior" },
  "ex-hipthrust": { id: "posterior", nome: "Posterior" },
  "ex-stiff": { id: "posterior", nome: "Posterior" },
  "ex-avanco": { id: "perna", nome: "Perna" },
};

export type ZonaId = "peito" | "costas" | "ombro" | "braco" | "perna" | "posterior";

const ZONA_ORDEM: ZonaId[] = ["peito", "ombro", "braco", "perna", "posterior", "costas"];
const ZONA_NOME: Record<ZonaId, string> = {
  peito: "Peito",
  ombro: "Ombro",
  braco: "Braço",
  perna: "Perna",
  posterior: "Posterior",
  costas: "Costas",
};

export type WebAxis = {
  id: ZonaId;
  label: string;
  first: number;
  now: number;
  firstKg: number;
  nowKg: number;
};

/** Radar do corpo: primeira carga contra a de agora, normalizada no próprio pico. */
export function bodyWeb(book: Record<string, { kg: number }[]>): WebAxis[] {
  const bucket: Partial<Record<ZonaId, { first: number; now: number }>> = {};
  for (const [ex, pts] of Object.entries(book)) {
    const z = ZONA_DE[ex];
    if (!z || !pts.length) continue;
    const first = pts[0]!.kg;
    const now = pts[pts.length - 1]!.kg;
    const prev = bucket[z.id];
    bucket[z.id] = prev
      ? { first: Math.min(prev.first, first), now: Math.max(prev.now, now) }
      : { first, now };
  }
  const peak = Math.max(1, ...ZONA_ORDEM.map((id) => bucket[id]?.now ?? 0));
  return ZONA_ORDEM.map((id) => {
    const b = bucket[id];
    return {
      id,
      label: ZONA_NOME[id],
      first: b ? b.first / peak : 0,
      now: b ? b.now / peak : 0,
      firstKg: b?.first ?? 0,
      nowKg: b?.now ?? 0,
    };
  });
}

export function bodyFact(axes: WebAxis[]): string {
  const grown = axes
    .filter((a) => a.nowKg > a.firstKg)
    .sort((a, b) => b.nowKg - b.firstKg - (a.nowKg - a.firstKg));
  const lead = grown[0];
  if (!lead) return "Feche sessões. O mapa nasce do rack.";
  const d = Math.round((lead.nowKg - lead.firstKg) * 2) / 2;
  const quiet = axes.find((a) => a.nowKg === 0);
  const extra = quiet ? ` ${quiet.label} ainda sem marca.` : "";
  return `${lead.label} +${String(d).replace(".", ",")} kg desde o começo.${extra}`;
}

/**
 * A escada individual da arena: você contra as outras pessoas. Não é ranking
 * mundial, é o setor, ou a cidade quando o setor está vazio.
 */
export const ARENA_LADDER = [
  { personId: "bia", sessions: 5 },
  { personId: "marina", sessions: 4 },
  { personId: "rafael", sessions: 4 },
  { personId: "huan", sessions: 3 },
  { personId: "vitor", sessions: 2 },
  { personId: "leo", sessions: 2 },
];

export const WEEK_DAYS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;

export const WEEK_BARS: Record<string, { days: number[]; kg: number; min: number }> = {
  vitor: { days: [0, 1, 0, 1, 1, 0, 0], kg: 7600, min: 96 },
  marina: { days: [1, 1, 1, 0, 1, 0, 1], kg: 12400, min: 210 },
  huan: { days: [1, 0, 1, 1, 0, 0, 1], kg: 9800, min: 150 },
  bia: { days: [0, 1, 1, 0, 1, 0, 0], kg: 4200, min: 84 },
  rafael: { days: [1, 1, 1, 0, 0, 0, 1], kg: 8600, min: 140 },
  fred: { days: [1, 1, 1, 1, 1, 0, 0], kg: 0, min: 0 },
  leo: { days: [1, 1, 0, 1, 0, 0, 1], kg: 5400, min: 120 },
  camila: { days: [1, 0, 1, 0, 1, 0, 0], kg: 3100, min: 90 },
  diego: { days: [0, 1, 0, 1, 0, 0, 1], kg: 2800, min: 70 },
  ana: { days: [1, 0, 0, 1, 0, 0, 1], kg: 2200, min: 60 },
};

export function weekOf(id: string) {
  return WEEK_BARS[id] ?? { days: [0, 0, 0, 0, 0, 0, 0], kg: 0, min: 0 };
}

export function monthOf(id: string): number[] {
  const w = weekOf(id).days;
  return [
    ...w,
    ...w.map((n, i) => (i === 2 ? 0 : n)),
    ...w.map((n, i) => (i === 6 ? 1 : n)),
    ...w.map((n, i) => (i === 0 ? 0 : n)),
  ];
}

export const AVATAR_COLORS = [
  "var(--color-stamp)",
  "var(--color-ink)",
  "var(--color-mute)",
  "var(--color-fill)",
  "var(--color-edge)",
  "var(--color-faint)",
  "var(--color-ghost)",
  "var(--color-raised)",
  "var(--color-surface)",
  "var(--color-line)",
] as const;

/**
 * Onde o app sai da tela. Endereço é texto livre escrito pelo anfitrião, porque
 * o produto não sabe o que é academia e não tem catálogo de lugar.
 */
export const BORAS: Bora[] = [
  {
    id: "r-parque",
    title: "Terra na garagem do Huan",
    when: "Hoje",
    hour: "20:00",
    address: "Rua 9, 214 · fundo",
    hostId: "marina",
    going: ["marina", "huan"],
    capacity: 6,
    groupId: "c-ferro",
  },
  {
    id: "r-sab",
    title: "Sábado pesado",
    when: "Amanhã",
    hour: "09:00",
    address: "Parque Vaca Brava · barra fixa do portão",
    hostId: "bia",
    going: ["bia", "rafael", "leo"],
    capacity: 12,
    groupId: "c-caixa",
  },
];

export const PROOFS: Proof[] = [
  {
    id: "p1",
    personId: "marina",
    kind: "feito",
    title: "A · Superior",
    line: "8 séries",
    caption: "Supino 65. Fred mandou subir. Subi.",
    volume: "8 séries · 4.200 kg",
    sets: 8,
    kg: 4200,
    min: 48,
    pagos: 4,
    cheers: ["fred", "huan", "bia", "vitor"],
    comments: [
      { id: "c1", personId: "fred", text: "Isso. Quarta sobe 2,5.", hoursAgo: 1 },
      { id: "c2", personId: "huan", text: "65 limpo. Te pego sexta.", hoursAgo: 1 },
    ],
    image: "/feed/supino.jpg",
    video: null,
    hoursAgo: 1,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-deck-offer",
    personId: "bia",
    kind: "feito",
    title: "Bum bum guloso",
    line: "Deck",
    caption: "Perna, posterior, glúteo. Os dois correm o mesmo deck.",
    volume: "3 fichas",
    sets: 0,
    kg: 0,
    min: 0,
    pagos: 1,
    cheers: ["rafael"],
    comments: [{ id: "c-deck", personId: "rafael", text: "Esse eu topo. Semana que vem.", hoursAgo: 2 }],
    image: "/feed/agachamento.jpg",
    video: null,
    hoursAgo: 2,
    place: "",
    groupId: "c-caixa",
  },
  {
    id: "p-txt-leo",
    personId: "leo",
    kind: "texto",
    title: "",
    line: "",
    caption: "Nunca vi ninguém do Asfalto pessoalmente e já briguei com metade. Sábado 7h, quem aparecer eu conheço.",
    volume: "",
    pagos: 6,
    cheers: ["rafael", "camila", "diego", "ana", "huan", "marina"],
    comments: [
      { id: "c-l1", personId: "camila", text: "Eu vou. Só me reconhece pela camisa amarela.", hoursAgo: 1 },
      { id: "c-l2", personId: "ana", text: "Primeira vez que eu saio pra correr com gente. Tô dentro.", hoursAgo: 1 },
    ],
    image: null,
    video: null,
    hoursAgo: 1,
    place: "",
    groupId: "c-asfalto",
  },
  {
    id: "p2",
    personId: "huan",
    kind: "feito",
    title: "Terra 180",
    line: "5 séries",
    caption: "Trava no joelho. Sem bounce.",
    volume: "5 séries · 3.600 kg",
    sets: 5,
    kg: 3600,
    min: 41,
    video: "/feed/terra.mp4",
    pagos: 3,
    cheers: ["bia", "marina", "vitor"],
    comments: [{ id: "c3", personId: "bia", text: "Pesado. Te vejo no fundo.", hoursAgo: 2 }],
    image: "/feed/agachamento.jpg",
    hoursAgo: 2,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vid-bia",
    personId: "bia",
    kind: "video",
    title: "Fran",
    line: "",
    caption: "Última série. Não foi RX. Foi honesto.",
    volume: "12:41",
    min: 13,
    pagos: 5,
    cheers: ["marina", "huan", "fred", "rafael", "vitor"],
    comments: [
      { id: "c-b1", personId: "marina", text: "Isso. Domingo a raid é essa.", hoursAgo: 3 },
      { id: "c-b2", personId: "fred", text: "Abaixo de 12. Você chega.", hoursAgo: 3 },
    ],
    image: "/feed/box.jpg",
    video: "/feed/fran.mp4",
    hoursAgo: 3,
    place: "",
    groupId: "c-caixa",
  },
  {
    id: "p-foto-camila",
    personId: "camila",
    kind: "foto",
    title: "",
    line: "",
    caption: "8 km depois do trabalho. Ninguém me obrigou e é isso que me irrita.",
    volume: "",
    pagos: 2,
    cheers: ["leo", "ana"],
    comments: [{ id: "c-ca1", personId: "ana", text: "Te alcanço amanhã.", hoursAgo: 4 }],
    image: "/feed/parque.jpg",
    video: null,
    hoursAgo: 4,
    place: "Parque Vaca Brava",
    groupId: "c-asfalto",
  },
  {
    id: "p3",
    personId: "bia",
    kind: "feito",
    title: "WOD da box",
    line: "12 min",
    caption: "A raid da semana mora aqui.",
    volume: "6 séries · 12 min",
    sets: 6,
    min: 12,
    pagos: 2,
    cheers: ["marina", "huan"],
    comments: [],
    image: "/feed/sled.jpg",
    video: null,
    hoursAgo: 5,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-txt-fred",
    personId: "fred",
    kind: "texto",
    title: "",
    line: "",
    caption: "Ferro Bruto 11, Caixa Preta 9, e falta domingo. Quem não treinar hoje entrega de graça.",
    volume: "",
    pagos: 7,
    cheers: ["marina", "huan", "bia", "vitor", "rafael", "leo", "camila"],
    comments: [{ id: "c-f1", personId: "huan", text: "Subo. Vitor também.", hoursAgo: 6 }],
    image: null,
    video: null,
    hoursAgo: 6,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p4",
    personId: "rafael",
    kind: "feito",
    title: "A · Superior",
    line: "9 séries",
    caption: "",
    volume: "9 séries · 3.100 kg",
    sets: 9,
    kg: 3100,
    min: 52,
    pagos: 1,
    cheers: ["marina"],
    comments: [{ id: "c4", personId: "marina", text: "Amanhã as 9. Te espero no rack.", hoursAgo: 8 }],
    image: "/feed/ficha.jpg",
    video: null,
    hoursAgo: 8,
    place: "",
    groupId: "c-caixa",
  },
  {
    id: "p-vitor-1",
    personId: "vitor",
    kind: "feito",
    title: "A · Superior",
    line: "7 séries",
    caption: "Supino 60. Semana que vem 62,5.",
    volume: "7 séries · 3.800 kg",
    sets: 7,
    kg: 3800,
    min: 46,
    pagos: 3,
    cheers: ["marina", "huan", "fred"],
    comments: [{ id: "c-v1", personId: "marina", text: "Sobe. Eu vi.", hoursAgo: 26 }],
    image: "/feed/supino.jpg",
    video: null,
    hoursAgo: 26,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vitor-2",
    personId: "vitor",
    kind: "foto",
    title: "",
    line: "",
    caption: "Rack 3 lotado. Espera 4 min e sobe.",
    volume: "",
    min: 4,
    pagos: 2,
    cheers: ["huan", "bia"],
    comments: [],
    image: "/feed/sled.jpg",
    video: null,
    hoursAgo: 50,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vitor-3",
    personId: "vitor",
    kind: "feito",
    title: "Terra 140",
    line: "5 séries",
    caption: "Barra encosta. Sem bounce.",
    volume: "5 séries · 2.800 kg",
    sets: 5,
    kg: 2800,
    min: 38,
    pagos: 2,
    cheers: ["huan", "marina"],
    comments: [{ id: "c-v2", personId: "huan", text: "Sobe 5. Sexta.", hoursAgo: 74 }],
    image: "/feed/agachamento.jpg",
    video: null,
    hoursAgo: 74,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vitor-4",
    personId: "vitor",
    kind: "foto",
    title: "",
    line: "",
    caption: "Depois do A. Box ainda quente.",
    volume: "",
    pagos: 1,
    cheers: ["bia"],
    comments: [],
    image: "/feed/box.jpg",
    video: null,
    hoursAgo: 98,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vitor-old-2",
    personId: "vitor",
    kind: "feito",
    title: "A · Superior",
    line: "6 séries",
    caption: "A trava ainda falha no terceiro.",
    volume: "6 séries · 2.240 kg",
    sets: 6,
    kg: 2240,
    min: 41,
    pagos: 1,
    cheers: ["fred"],
    comments: [],
    image: "/feed/ficha.jpg",
    video: null,
    hoursAgo: 40 * 24,
    place: "",
    groupId: "c-ferro",
  },
  {
    id: "p-vitor-old-1",
    personId: "vitor",
    kind: "feito",
    title: "A · Superior",
    line: "5 séries",
    caption: "Primeira sessão que fechei no app.",
    volume: "5 séries · 1.680 kg",
    sets: 5,
    kg: 1680,
    min: 44,
    pagos: 0,
    cheers: [],
    comments: [],
    image: "/feed/parque.jpg",
    video: null,
    hoursAgo: 96 * 24,
    place: "",
    groupId: "c-ferro",
  },
];

const DAY = 86_400_000;

/** `fechadoEm` conta para trás a partir de agora, então o histórico nunca envelhece sozinho. */
function diasAtras(n: number): number {
  return NOW.getTime() - n * DAY;
}

export const DUELS: Duel[] = [
  { id: "d1", fromId: "huan", toId: "vitor", mark: "Supino 65", postId: "p1", estado: "convite" },
  {
    id: "d-bum-in",
    fromId: "bia",
    toId: "vitor",
    mark: "Bum bum guloso",
    postId: "p-deck-offer",
    estado: "convite",
    object: { kind: "deck", id: "d-bum" },
  },
  { id: "d2", fromId: "leo", toId: "marina", mark: "Fran abaixo de 12", postId: "p-vid-bia", estado: "convite" },

  // julgados, do mais novo para o mais velho
  {
    id: "d-rafael",
    fromId: "vitor",
    toId: "rafael",
    mark: "Terra 140",
    postId: "p-terra",
    estado: "julgado",
    veredito: {
      vencedorId: "vitor",
      motivo: "marca",
      fechadoEm: diasAtras(3),
      firme: true,
      faixa: { vitor: "Sua melhor. 5 kg acima.", rafael: "Rafael fechou 5 kg abaixo." },
    },
  },
  {
    id: "d-camila",
    fromId: "camila",
    toId: "vitor",
    mark: "5 km",
    postId: "p-parque",
    estado: "julgado",
    veredito: {
      vencedorId: null,
      motivo: "empate_tecnico",
      fechadoEm: diasAtras(9),
      firme: true,
      faixa: { vitor: "Empate. 2 s de margem.", camila: "Empate. 2 s de margem." },
    },
  },
  {
    id: "d-marina",
    fromId: "marina",
    toId: "vitor",
    mark: "Fran",
    postId: "p-fran",
    estado: "julgado",
    veredito: {
      vencedorId: "marina",
      motivo: "marca",
      fechadoEm: diasAtras(14),
      firme: true,
      faixa: { vitor: "Sua melhor. 12 s abaixo.", marina: "Marina fechou 43 s antes." },
    },
  },
  {
    id: "d-bia",
    fromId: "vitor",
    toId: "bia",
    mark: "Sessões da semana",
    postId: "p-semana",
    estado: "julgado",
    veredito: {
      vencedorId: "vitor",
      motivo: "marca",
      fechadoEm: diasAtras(21),
      firme: true,
      faixa: { vitor: "5 sessões. 1 acima.", bia: "Bia fechou 4 sessões." },
    },
  },
  {
    id: "d-diego",
    fromId: "diego",
    toId: "vitor",
    mark: "Barra fixa",
    postId: "p-barra",
    estado: "julgado",
    veredito: {
      vencedorId: "vitor",
      motivo: "marca",
      fechadoEm: diasAtras(28),
      firme: true,
      faixa: { vitor: "Sua melhor. 3 reps acima.", diego: "Diego fechou 3 reps abaixo." },
    },
  },
  {
    id: "d-leo",
    fromId: "leo",
    toId: "vitor",
    mark: "10 km",
    postId: "p-asfalto",
    estado: "julgado",
    veredito: {
      vencedorId: "leo",
      motivo: "marca",
      fechadoEm: diasAtras(35),
      firme: true,
      faixa: { vitor: "Sua melhor. 1 min abaixo.", leo: "Léo fechou 4 min antes." },
    },
  },
  {
    id: "d-fred",
    fromId: "vitor",
    toId: "fred",
    mark: "Agachamento 8 reps",
    postId: "p-agacha",
    estado: "julgado",
    veredito: {
      vencedorId: "vitor",
      motivo: "marca",
      fechadoEm: diasAtras(42),
      firme: true,
      faixa: { vitor: "Sua melhor. 10 kg acima.", fred: "Fred fechou 10 kg abaixo." },
    },
  },
];

/** Julgados de quem, do mais recente para o mais antigo. Convite e expirado ficam de fora. */
export function duelHistory(personId: string = YOU_ID, duels: Duel[] = DUELS): Duel[] {
  return duels
    .filter((d) => d.veredito && (d.fromId === personId || d.toId === personId))
    .sort((a, b) => b.veredito!.fechadoEm - a.veredito!.fechadoEm);
}

export function rivalOf(d: Duel, personId: string = YOU_ID): Person {
  return personOf(d.fromId === personId ? d.toId : d.fromId);
}

/** Vitórias contadas do próprio histórico, nunca digitadas à mão. */
export function duelScore(personId: string = YOU_ID, duels: Duel[] = DUELS) {
  let venceu = 0;
  let empatou = 0;
  let perdeu = 0;
  for (const d of duelHistory(personId, duels)) {
    const v = d.veredito!;
    if (v.vencedorId === null) empatou += 1;
    else if (v.vencedorId === personId) venceu += 1;
    else perdeu += 1;
  }
  return { venceu, empatou, perdeu, total: venceu + empatou + perdeu };
}

/** Rostos de quem você já encarou, do duelo mais recente para o mais antigo, sem repetir. */
export function rivalsOf(personId: string = YOU_ID, duels: Duel[] = DUELS): Person[] {
  const seen = new Set<string>();
  const out: Person[] = [];
  for (const d of duelHistory(personId, duels)) {
    const r = rivalOf(d, personId);
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
  }
  return out;
}

export function resultOf(d: Duel, personId: string = YOU_ID): "venceu" | "empatou" | "perdeu" {
  const v = d.veredito!;
  if (v.vencedorId === null) return "empatou";
  return v.vencedorId === personId ? "venceu" : "perdeu";
}

/** Convite ainda sem aceite. Os outros estados não pedem resposta. */
export function duelOpen(d: Duel): boolean {
  return d.estado === "convite";
}

export function matesOf(joined: string[], groups: Group[]): Person[] {
  const ids = new Set<string>();
  for (const g of groups) {
    if (!joined.includes(g.id)) continue;
    for (const id of g.memberIds) {
      if (id !== YOU_ID) ids.add(id);
    }
  }
  return [...ids].map(personOf);
}

export function postsOf(proofs: Proof[], personId: string): Proof[] {
  return proofs.filter((p) => p.personId === personId);
}

export function mediaOf(proofs: Proof[], personId: string): string[] {
  return postsOf(proofs, personId)
    .map((p) => p.image)
    .filter((src): src is string => Boolean(src));
}

export function tilesOf(proofs: Proof[], personId: string) {
  return postsOf(proofs, personId)
    .filter((p) => p.image || p.video)
    .map((p) => ({
      id: p.id,
      src: p.image ?? "/feed/box.jpg",
      video: Boolean(p.video),
    }));
}

export function packFrom(p: Prescription | FichaTreino) {
  return { name: p.name, items: p.items.map((i) => ({ ...i })) };
}

function ex(id: string, load = 0, sets = 0, reps = 0, rest = 0): Exercise {
  const base = CATALOG.find((e) => e.id === id);
  if (!base) throw new Error(`catálogo sem ${id}`);
  return {
    ...base,
    load_kg: load || base.load_kg,
    planned_sets: sets || base.planned_sets,
    planned_reps: reps || base.planned_reps,
    rest_seconds: rest || base.rest_seconds,
  };
}

/** Fichas escritas. A folha do Fred não entra aqui: ela é extra. */
export const FICHAS_TREINO: FichaTreino[] = [
  {
    id: "f-perna",
    name: "Perna pesada",
    minutes: 42,
    ownerId: YOU_ID,
    items: [ex("ex-agachamento"), ex("ex-avanco")],
  },
  {
    id: "f-posterior",
    name: "Posterior",
    minutes: 38,
    ownerId: YOU_ID,
    items: [ex("ex-terra"), ex("ex-stiff")],
  },
  {
    id: "f-gluteo",
    name: "Glúteo",
    minutes: 36,
    ownerId: YOU_ID,
    items: [ex("ex-hipthrust"), ex("ex-mesa")],
  },
];

export const DECKS: Deck[] = [
  {
    id: "d-bum",
    name: "Bum bum guloso",
    about: "Perna, posterior, glúteo. Seguir o deck entrega esse corpo.",
    fichaIds: ["f-perna", "f-posterior", "f-gluteo"],
    ownerId: YOU_ID,
  },
];

export function fichaTreinoOf(id: string, live: FichaTreino[] = FICHAS_TREINO): FichaTreino | undefined {
  return live.find((f) => f.id === id) ?? FICHAS_TREINO.find((f) => f.id === id);
}

export function deckOf(id: string, live: Deck[] = DECKS): Deck | undefined {
  return live.find((d) => d.id === id) ?? DECKS.find((d) => d.id === id);
}

export function deckLine(deck: Deck, fichas: FichaTreino[] = FICHAS_TREINO): string {
  const n = deck.fichaIds.length;
  const names = deck.fichaIds
    .map((id) => fichas.find((f) => f.id === id)?.name)
    .filter(Boolean);
  if (!n) return "Nenhuma ficha nesta pilha.";
  return `${n} ${n === 1 ? "ficha" : "fichas"} · ${names.join(" · ")}`;
}

export function fichaAt(deck: Deck, cursor: number, fichas: FichaTreino[] = FICHAS_TREINO): FichaTreino | undefined {
  if (!deck.fichaIds.length) return undefined;
  const id = deck.fichaIds[cursor % deck.fichaIds.length];
  return fichas.find((f) => f.id === id);
}

/** Quatro eixos do dossiê. Sem soma. Ver `docs/ficha-de-atributos.md`. */
export type EixoId = "carga" | "motor" | "fundo" | "frequencia";

export type BarraVista = {
  eixo: EixoId;
  nome: string;
  barra: number;
  rotulo: string;
  idade?: string;
  proofId?: string;
};

export type FichaVista = {
  leitura: string | null;
  barras: BarraVista[];
};

const EIXO_NOME: Record<EixoId, string> = {
  carga: "Carga",
  motor: "Motor",
  fundo: "Fundo",
  frequencia: "Frequência",
};

const EIXOS: EixoId[] = ["carga", "motor", "fundo", "frequencia"];

type FichaSeed = {
  leitura: string;
  rows: Pick<BarraVista, "eixo" | "barra" | "rotulo" | "idade" | "proofId">[];
};

/** Subs testemunhados. A barra é a pessoa contra o pico dela, não contra o mundo. */
const FICHAS: Record<string, FichaSeed> = {
  vitor: {
    leitura: "140 kg no terra. 4 sessões por semana.",
    rows: [
      { eixo: "carga", barra: 60, rotulo: "140 kg", proofId: "p-vitor-3" },
      { eixo: "motor", barra: 0, rotulo: "—" },
      { eixo: "fundo", barra: 44, rotulo: "5 km" },
      { eixo: "frequencia", barra: 20, rotulo: "4 / semana" },
    ],
  },
  marina: {
    leitura: "155 kg no terra. 5 sessões por semana.",
    rows: [
      { eixo: "carga", barra: 100, rotulo: "155 kg" },
      { eixo: "motor", barra: 88, rotulo: "Fran 4:12" },
      { eixo: "fundo", barra: 0, rotulo: "—" },
      { eixo: "frequencia", barra: 100, rotulo: "5 / semana" },
    ],
  },
  huan: {
    leitura: "65 kg no supino. 4 sessões por semana.",
    rows: [
      { eixo: "carga", barra: 84, rotulo: "65 kg", proofId: "p1" },
      { eixo: "motor", barra: 0, rotulo: "—" },
      { eixo: "fundo", barra: 0, rotulo: "—" },
      { eixo: "frequencia", barra: 100, rotulo: "4 / semana" },
    ],
  },
};

function vazia(): FichaVista {
  return {
    leitura: null,
    barras: EIXOS.map((eixo) => ({ eixo, nome: EIXO_NOME[eixo], barra: 0, rotulo: "—" })),
  };
}

export function fichaOf(personId: string): FichaVista {
  const hit = FICHAS[personId];
  if (!hit) return vazia();
  const byEixo = new Map(hit.rows.map((r) => [r.eixo, r]));
  return {
    leitura: hit.leitura,
    barras: EIXOS.map((eixo) => {
      const r = byEixo.get(eixo);
      return {
        eixo,
        nome: EIXO_NOME[eixo],
        barra: r?.barra ?? 0,
        rotulo: r?.rotulo ?? "—",
        idade: r?.idade,
        proofId: r?.proofId,
      };
    }),
  };
}

const MARK_KEYS: { id: string; keys: string[] }[] = [
  { id: "ex-supino", keys: ["supino"] },
  { id: "ex-terra", keys: ["terra"] },
  { id: "ex-agachamento", keys: ["agachamento"] },
  { id: "ex-remada", keys: ["remada"] },
  { id: "ex-desenvolvimento", keys: ["desenvolvimento"] },
  { id: "ex-rosca", keys: ["rosca"] },
  { id: "ex-hipthrust", keys: ["hip thrust", "hipthrust"] },
  { id: "ex-stiff", keys: ["stiff"] },
];

/** Exercício nomeado na marca do duelo. Sem match, a disputa não é de carga. */
export function exerciseOfMark(mark: string): Exercise | undefined {
  const k = mark.toLowerCase();
  const hit = MARK_KEYS.find((a) => a.keys.some((key) => k.includes(key)));
  return hit ? CATALOG.find((e) => e.id === hit.id) : undefined;
}

/**
 * O número que importa neste confronto. Só aparece se existir testemunho
 * daquela pessoa naquele movimento — livro, última série, ou leitura da ficha.
 */
export function bestOnMark(
  personId: string,
  mark: string,
  book?: Record<string, LoadPoint[]>,
  last?: Record<string, { kg: number; reps: number }>,
): { label: string; value: string } | null {
  const ex = exerciseOfMark(mark);
  const ficha = fichaOf(personId);
  const low = mark.toLowerCase();

  if (ex) {
    const short = ex.name.split(" ")[0]!.toLowerCase();
    if (personId === YOU_ID) {
      const peak = Math.max(
        ex.last_kg ?? 0,
        last?.[ex.id]?.kg ?? 0,
        ...(book?.[ex.id] ?? []).map((p) => p.kg),
      );
      if (peak > 0) return { label: `melhor ${short}`, value: `${peak} kg` };
    }
    const leitura = ficha.leitura?.toLowerCase() ?? "";
    if (leitura.includes(short)) {
      const carga = ficha.barras.find((b) => b.eixo === "carga" && b.rotulo !== "—");
      if (carga) return { label: `melhor ${short}`, value: carga.rotulo };
    }
  }

  if (low.includes("fran")) {
    const motor = ficha.barras.find((b) => b.eixo === "motor" && /fran/i.test(b.rotulo));
    if (motor) return { label: "melhor fran", value: motor.rotulo.replace(/^fran\s+/i, "") };
  }

  if (/\d+\s*km/.test(low) || /\bkm\b/.test(low)) {
    const fundo = ficha.barras.find((b) => b.eixo === "fundo" && b.rotulo !== "—");
    if (fundo) return { label: "melhor fundo", value: fundo.rotulo };
  }

  return null;
}

/** Cartel: histórico julgado quando existe; senão o que a pessoa já trouxe. */
export function recordOf(personId: string, duels: Duel[] = DUELS) {
  const live = duelScore(personId, duels);
  if (live.total > 0) return live;
  const p = personOf(personId).duelos;
  return { venceu: p.venceu, empatou: p.empatou, perdeu: p.perdeu, total: p.venceu + p.empatou + p.perdeu };
}

/** Título = última vitória firme. Emblema = raid desta semana, se ela fez. */
export function titlesOf(personId: string, duels: Duel[] = DUELS, raid: Raid = RAID): string[] {
  const out: string[] = [];
  const lastWin = duelHistory(personId, duels).find((d) => d.veredito?.vencedorId === personId);
  if (lastWin) out.push(lastWin.mark);
  if (raid.claimed.includes(personId)) out.push("Raid desta semana");
  return out.slice(0, 2);
}

/** Já se enfrentaram. O mais recente julgado. */
export function theyMet(a: string, b: string, duels: Duel[] = DUELS): Duel | undefined {
  return duelHistory(a, duels).find(
    (d) => (d.fromId === a && d.toId === b) || (d.fromId === b && d.toId === a),
  );
}
