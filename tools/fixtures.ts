// Fixtures do host de screenshot. Uma entrada por tela, com os props de sessão do Root,
// o initialState do NavigationContainer e o JSON que o stub de rede devolve.
// Dados de treino de verdade: nomes brasileiros, exercícios reais, cargas em kg.
import type {
  DraftItem,
  FinishRecord,
  MePayload,
  OwnerHome,
  OwnerReturn,
  OwnerStudent,
  OwnerWeekItem,
  Person,
  ProgressPayload,
  RecordItem,
  Time,
  TodayItem,
  TodayPayload,
} from "../src/api";
import type { RootStackParamList, SessionRoute } from "../src/nav/types";

export const TOKEN = "shot-token";

// Estado difícil de propósito: nome de aluno longo.
export const ALUNA: Person = {
  id: "p-ana",
  name: "Ana Beatriz Nascimento Rodrigues",
  phone: "+5511987654321",
  role: "student",
};

export const PERSONAL: Person = {
  id: "p-fred",
  name: "Fred Menezes",
  phone: "+5511912345678",
  role: "owner",
};

function item(
  n: number,
  name: string,
  sets: number,
  reps: string,
  kg: number,
  rest: number | null,
  notes: string | null = null,
): TodayItem {
  return {
    id: `pi-${n}`,
    exercise_id: `ex-${n}`,
    name,
    position: n,
    planned_sets: sets,
    planned_reps: reps,
    load_kg: kg,
    rest_seconds: rest,
    notes,
    video_url: n === 1 ? "https://media.invalido/agachamento.mp4" : null,
  };
}

// Carga de 3 dígitos no terra — é onde o número quebra o layout.
export const ITEMS: TodayItem[] = [
  item(1, "Agachamento livre", 4, "8", 82.5, 120, "Desce até o paralelo."),
  item(2, "Levantamento terra", 3, "5", 127.5, 180),
  item(3, "Supino reto com barra", 4, "10", 62.5, 90),
  item(4, "Remada curvada", 3, "10", 55, 90),
  item(5, "Desenvolvimento militar", 3, "12", 37.5, 75),
  item(6, "Rosca direta", 3, "12", 22.5, 60),
];

const RECORDS: FinishRecord[] = [
  { exercise_name: "Levantamento terra", load_kg: 127.5, previous_kg: 120 },
  { exercise_name: "Supino reto com barra", load_kg: 62.5, previous_kg: 60 },
];

const PR_ITEMS: RecordItem[] = [
  {
    exercise_name: "Levantamento terra",
    load_kg: 127.5,
    reps: 5,
    achieved_at: "2026-08-18T11:04:00.000Z",
    history: [
      { load_kg: 110, achieved_at: "2026-06-02T11:00:00.000Z" },
      { load_kg: 120, achieved_at: "2026-07-14T11:00:00.000Z" },
      { load_kg: 127.5, achieved_at: "2026-08-18T11:04:00.000Z" },
    ],
  },
  {
    exercise_name: "Agachamento livre",
    load_kg: 82.5,
    reps: 8,
    achieved_at: "2026-08-11T11:00:00.000Z",
    history: [{ load_kg: 80, achieved_at: "2026-07-07T11:00:00.000Z" }],
  },
];

/** A prova da sessão que a Feito desenha, com a MESMA conta de `sessionProof`: uma
 *  execução inteira de ITEMS, série por série, na carga prescrita. Os 47 min são MEDIDOS
 *  (vão entre a primeira e a última série) e por isso diferem dos 52 PREVISTOS que a Hoje
 *  mostra — são dois números de donos diferentes, e o fixture não os empata. */
const PROOF = {
  sets: ITEMS.reduce((n, it) => n + it.planned_sets, 0),
  volumeKg: ITEMS.reduce(
    (kg, it) => kg + it.planned_sets * Number(it.planned_reps) * it.load_kg,
    0,
  ),
  minutes: 47,
};

// 20 alunos: é o lote que o fluxo 1 mede (tools/taps.mjs).
const WEEK: OwnerWeekItem[] = [
  { person_id: "p-ana", name: "Ana Beatriz Nascimento Rodrigues", adherence: "3 de 4", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-carlos", name: "Carlos Eduardo Lima", adherence: "4 de 4", suggested: "Subir carga", selected: true },
  { person_id: "p-juliana", name: "Juliana Prado", adherence: "1 de 3", suggested: "Manter", selected: false },
  { person_id: "p-rafa", name: "Rafael Souza", adherence: "2 de 3", suggested: "Retomada curta", selected: true },
  { person_id: "p-marina", name: "Marina Okamoto", adherence: "0 de 3", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-bruno", name: "Bruno Tavares", adherence: "3 de 4", suggested: "Subir carga", selected: false },
  { person_id: "p-camila", name: "Camila Ferreira", adherence: "4 de 4", suggested: "Manter", selected: true },
  { person_id: "p-diego", name: "Diego Albuquerque", adherence: "1 de 3", suggested: "Retomada curta", selected: true },
  { person_id: "p-elaine", name: "Elaine Moraes", adherence: "2 de 3", suggested: "Repetir com +2,5 kg", selected: false },
  { person_id: "p-fabio", name: "Fábio Nogueira", adherence: "0 de 3", suggested: "Subir carga", selected: true },
  { person_id: "p-gabriela", name: "Gabriela Pinheiro", adherence: "3 de 4", suggested: "Manter", selected: true },
  { person_id: "p-henrique", name: "Henrique Castro", adherence: "4 de 4", suggested: "Retomada curta", selected: false },
  { person_id: "p-isabela", name: "Isabela Duarte", adherence: "1 de 3", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-joao", name: "João Vitor Barbosa", adherence: "2 de 3", suggested: "Subir carga", selected: true },
  { person_id: "p-karina", name: "Karina Ramos", adherence: "0 de 3", suggested: "Manter", selected: false },
  { person_id: "p-leonardo", name: "Leonardo Prates", adherence: "3 de 4", suggested: "Retomada curta", selected: true },
  { person_id: "p-mariana", name: "Mariana Antunes", adherence: "4 de 4", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-nathalia", name: "Nathalia Vasconcelos", adherence: "1 de 3", suggested: "Subir carga", selected: false },
  { person_id: "p-otavio", name: "Otávio Bittencourt", adherence: "2 de 3", suggested: "Manter", selected: true },
  { person_id: "p-patricia", name: "Patrícia Salgado", adherence: "0 de 3", suggested: "Retomada curta", selected: true },
];
const ATTENTION: OwnerHome["attention"] = [
  {
    id: "al-1",
    person_id: "p-marina",
    name: "Marina Okamoto",
    reason: "Sem sessão há 9 dias",
    decision: "Mandar retomada curta",
    rank: 1,
    days: 9,
  },
  {
    id: "al-2",
    person_id: "p-carlos",
    name: "Carlos Eduardo Lima",
    reason: "Terra fácil duas vezes",
    decision: "Subir 2,5 kg",
    rank: 2,
  },
  {
    id: "al-3",
    person_id: "p-ana",
    name: "Ana Beatriz Nascimento Rodrigues",
    reason: "Dor no ombro relatada",
    decision: "Trocar desenvolvimento",
    rank: 3,
  },
];

const OWNER_HOME: OwnerHome = {
  greeting: "Bom treino",
  student_count: 34,
  fio: {
    prescribed: 28,
    done: 19,
    week: [
      { for_date: "2026-08-12", done: 4, prescribed: 6 },
      { for_date: "2026-08-13", done: 5, prescribed: 5 },
      { for_date: "2026-08-14", done: 3, prescribed: 6 },
      { for_date: "2026-08-15", done: 4, prescribed: 4 },
      { for_date: "2026-08-16", done: 0, prescribed: 2 },
      { for_date: "2026-08-17", done: 1, prescribed: 2 },
      { for_date: "2026-08-18", done: 2, prescribed: 3 },
    ],
  },
  attention: ATTENTION,
  unread_returns: 4,
};

const OWNER_STUDENT: OwnerStudent = {
  person_id: "p-ana",
  name: "Ana Beatriz Nascimento Rodrigues",
  last_effort: 2,
  last_loads: [
    { exercise_name: "Levantamento terra", load_kg: 127.5 },
    { exercise_name: "Agachamento livre", load_kg: 82.5 },
    { exercise_name: "Supino reto com barra", load_kg: 62.5 },
  ],
  ofensiva: { current_count: 12 },
  suggested: "Subir 2,5 kg no terra",
  commitment_text: "4 dias por semana, antes do trabalho.",
};

const RETURNS: OwnerReturn[] = [
  {
    alert_id: "rt-1",
    person_id: "p-ana",
    name: "Ana Beatriz Nascimento Rodrigues",
    effort: 1,
    records: RECORDS,
    swaps: [{ from: "Agachamento livre", to: "Agachamento no smith" }],
    created_at: "2026-08-18T11:10:00.000Z",
  },
  {
    alert_id: "rt-2",
    person_id: "p-carlos",
    name: "Carlos Eduardo Lima",
    effort: 3,
    records: [],
    swaps: [
      { from: "Supino reto com barra", to: "Supino com halteres" },
    ],
    created_at: "2026-08-18T09:40:00.000Z",
  },
];

const DRAFT: DraftItem[] = ITEMS.map((it, i) => ({
  id: it.id,
  exercise_id: it.exercise_id,
  name: it.name,
  planned_sets: it.planned_sets,
  planned_reps: it.planned_reps,
  load_kg: it.load_kg,
  load_source: i === 0 ? "history" : i === 1 ? "history" : i === 5 ? "starter" : "manual",
}));

const PROGRESS: ProgressPayload = {
  ofensiva: { current_count: 214, protector_available: true },
  xp_total: 18740,
  league: [
    { name: "Carlos Eduardo Lima", xp_total: 21100, me: false },
    { name: "Ana Beatriz Nascimento Rodrigues", xp_total: 18740, me: true },
    { name: "Juliana Prado", xp_total: 12300, me: false },
    { name: "Rafael Souza", xp_total: 9800, me: false },
    { name: "Marina Okamoto", xp_total: 4120, me: false },
  ],
  badges: [
    { badge_key: "primeira_serie", earned_at: "2026-01-09T11:00:00.000Z" },
    { badge_key: "pr_terra", earned_at: "2026-08-18T11:04:00.000Z" },
    { badge_key: "cem_dias", earned_at: "2026-05-20T11:00:00.000Z" },
  ],
  prontidao_week: [
    { for_date: "2026-08-12", score: 72 },
    { for_date: "2026-08-13", score: 81 },
    { for_date: "2026-08-14", score: 64 },
    { for_date: "2026-08-15", score: 88 },
    { for_date: "2026-08-16", score: 51 },
    { for_date: "2026-08-17", score: 77 },
    { for_date: "2026-08-18", score: 84 },
  ],
};

function todayPayload(time: Time, over: Partial<TodayPayload> = {}): TodayPayload {
  return {
    time,
    person: { id: ALUNA.id, name: ALUNA.name },
    prontidao: { score: 84, energy: 4, soreness: 2, sleep: 4, label: "pronta" },
    ofensiva: { current_count: 12, protector_available: true },
    xp_total: 18740,
    prescription: {
      id: "pr-1",
      name: "Força A",
      for_date: "2026-08-18",
      minutes: 52,
      items: ITEMS,
    },
    banner: null,
    coach_line: "Hoje é dia de terra. Vai com calma na primeira.",
    debut: false,
    comeback: null,
    ...over,
  };
}

export type Fixture = {
  /** Props de sessão do Root. */
  role?: "owner" | "student";
  onboardingComplete?: boolean;
  commitmentComplete?: boolean;
  debut?: boolean;
  /** Rota de destino. Se `tabs`, entra pela home da role e seleciona a aba. */
  route?: { name: keyof RootStackParamList };
  tab?: string;
  /** Componente que não é rota (vive dentro de outra tela). */
  direct?: "Criacao" | "MaquinaOcupada" | "App";
  /** Sobrescreve o JSON de rede desta tela. path (regex) -> body. */
  api?: Record<string, unknown>;
};

const OWNER_CHROME = { token: TOKEN, timeName: "", accent: "" };

function session(time: Time): SessionRoute {
  return {
    token: TOKEN,
    timeName: time.name,
    accent: time.accent_color,
    localId: "cs-shot-0001",
    prescriptionId: "pr-1",
    items: ITEMS,
    itemIndex: 1, // terra: carga de 3 dígitos
    setIndex: 2,
    ofensivaCount: 12,
    xpTotal: 18740,
    needsCommitment: false,
  };
}

/** Params por tela, resolvidos com a marca ativa. */
export function params(screen: string, time: Time): object | undefined {
  const chrome = { ...OWNER_CHROME, timeName: time.name, accent: time.accent_color };
  switch (screen) {
    case "Retorno":
    case "Atencao":
    case "Revisao":
      return chrome;
    case "Aluna":
      return { ...chrome, personId: ALUNA.id };
    case "Base":
      return { ...chrome, personId: ALUNA.id, personName: ALUNA.name };
    case "Ajustar":
      return {
        ...chrome,
        prescriptionId: "pr-1",
        personId: ALUNA.id,
        personName: ALUNA.name,
        items: DRAFT,
      };
    case "Publicar":
      return {
        ...chrome,
        prescriptionId: "pr-1",
        personId: ALUNA.id,
        personName: ALUNA.name,
      };
    case "Ficha":
      return { ...chrome, items: ITEMS, prescriptionId: "pr-1" };
    case "ComoFazer":
      return { ...chrome, item: ITEMS[0], items: ITEMS, prescriptionId: "pr-1" };
    case "Serie":
      return session(time);
    case "Descanso":
      return { ...session(time), restSeconds: 180, last: false };
    case "Feito":
      return {
        timeName: time.name,
        accent: time.accent_color,
        ofensivaCount: 214,
        xpTotal: 18740,
        xpGained: 40,
        records: RECORDS,
        proof: PROOF,
        needsCommitment: false,
      };
    case "Recorde":
      return { accent: time.accent_color, records: RECORDS };
    default:
      return undefined;
  }
}

/** Props diretos dos componentes que não são rota. */
export function directProps(
  kind: Fixture["direct"],
  time: Time,
): Record<string, unknown> {
  if (kind === "Criacao") {
    return {
      accent: time.accent_color,
      timeName: time.name,
      busy: false,
      error: "",
      onBeat: () => {},
      onBack: () => {},
      onSend: () => {},
    };
  }
  return {
    token: TOKEN,
    timeName: time.name,
    accent: time.accent_color,
    prescriptionId: "pr-1",
    from: ITEMS[4],
    items: ITEMS,
  };
}

const OWNER: Pick<Fixture, "role" | "onboardingComplete" | "commitmentComplete"> = {
  role: "owner",
  onboardingComplete: true,
  commitmentComplete: true,
};

const STUDENT: Pick<Fixture, "role" | "onboardingComplete" | "commitmentComplete"> = {
  role: "student",
  onboardingComplete: true,
  commitmentComplete: true,
};

export const FIXTURES: Record<string, Fixture> = {
  // ---- personal (8)
  Painel: { ...OWNER, tab: "Painel" },
  Atencao: { ...OWNER, route: { name: "Atencao" } },
  Aluna: { ...OWNER, route: { name: "Aluna" } },
  Base: { ...OWNER, route: { name: "Base" } },
  Publicar: { ...OWNER, route: { name: "Publicar" } },
  Revisao: { ...OWNER, route: { name: "Revisao" } },
  Ajustar: { ...OWNER, route: { name: "Ajustar" } },
  Retorno: { ...OWNER, route: { name: "Retorno" } },

  // ---- aluno (17)
  Estreia: { ...STUDENT, debut: true, commitmentComplete: false, route: { name: "Estreia" } },
  Hoje: { ...STUDENT, tab: "Hoje" },
  Ficha: { ...STUDENT, route: { name: "Ficha" } },
  FichaTab: { ...STUDENT, tab: "MinhaFicha" },
  Serie: { ...STUDENT, route: { name: "Serie" } },
  Descanso: { ...STUDENT, route: { name: "Descanso" } },
  Feito: { ...STUDENT, route: { name: "Feito" } },
  Pronto: { ...STUDENT, onboardingComplete: false, route: { name: "Pronto" } },
  Progresso: { ...STUDENT, tab: "Progresso" },
  Recorde: { ...STUDENT, route: { name: "Recorde" } },
  Retomada: {
    ...STUDENT,
    route: { name: "Retomada" },
    api: {
      "/v1/today": "comeback",
    },
  },
  Perfil: { ...STUDENT, tab: "Perfil" },
  SobreVoce: { ...STUDENT, onboardingComplete: false, route: { name: "SobreVoce" } },
  ComoFazer: { ...STUDENT, route: { name: "ComoFazer" } },
  Compromisso: { ...STUDENT, commitmentComplete: false, route: { name: "Compromisso" } },
  // Porta de entrada real: monta o App inteiro, não o Root.
  Acesso: { direct: "App" },
  Criacao: { ...STUDENT, direct: "Criacao" },
  MaquinaOcupada: { ...STUDENT, direct: "MaquinaOcupada" },

  // ---- estados difíceis (é onde o app é julgado)
  HojeVazio: { ...STUDENT, tab: "Hoje", api: { "/v1/today": "vazio" } },
  AtencaoVazio: { ...OWNER, route: { name: "Atencao" }, api: { "/v1/owner/attention": { items: [] } } },
  ProgressoZero: {
    ...STUDENT,
    tab: "Progresso",
    api: {
      "/v1/progress": {
        ofensiva: { current_count: 0, protector_available: false },
        xp_total: 0,
        league: [],
        badges: [],
        prontidao_week: [],
      },
    },
  },
  RecordeVazio: { ...STUDENT, route: { name: "Recorde" }, api: { "/v1/records": { items: [] } } },
  RevisaoVazio: { ...OWNER, route: { name: "Revisao" }, api: { "/v1/owner/week": { items: [] } } },
};

/**
 * Entradas que existem para o tools/taps.mjs e NÃO são tela do v1: o gate de screenshot
 * as ignora por padrão. "Acesso" monta o App inteiro — é a porta de entrada, não uma tela
 * do catálogo. Ainda dá para fotografar à mão com --screens=Acesso.
 */
export const HARNESS = ["Acesso"];

export const SCREENS = Object.keys(FIXTURES).filter((k) => !HARNESS.includes(k));

/**
 * Mapa determinístico de rede. Ordem importa: o primeiro regex que casar ganha.
 * Só rotas /v1 — qualquer outra URL (fonte, asset) passa direto.
 */
export function apiRoutes(
  time: Time,
  over: Record<string, unknown> = {},
): [RegExp, unknown][] {
  const mine: MePayload = {
    person: ALUNA,
    time,
    onboarding_complete: true,
    commitment_complete: true,
    debut: false,
  };
  const base: [RegExp, unknown][] = [
    [/^\/v1\/me$/, mine],
    [/^\/v1\/today\/prontidao$/, { score: 84, energy: 4, soreness: 2, sleep: 4, label: "pronta" }],
    [/^\/v1\/today$/, todayPayload(time)],
    [/^\/v1\/owner\/home$/, OWNER_HOME],
    [/^\/v1\/owner\/attention\/[^/]+\/apply$/, { ok: true }],
    [/^\/v1\/owner\/attention$/, { items: ATTENTION }],
    [/^\/v1\/owner\/returns\/[^/]+\/apply$/, { ok: true }],
    [/^\/v1\/owner\/returns$/, { items: RETURNS }],
    [/^\/v1\/owner\/week\/approve$/, { count: 3 }],
    [/^\/v1\/owner\/week/, { items: WEEK }],
    [/^\/v1\/owner\/students\/[^/]+$/, OWNER_STUDENT],
    [/^\/v1\/models\/[^/]+\/draft-from-last$/, { draft_id: "dr-1", items: DRAFT }],
    [
      /^\/v1\/models$/,
      {
        items: [
          // Base.tsx usa o PRIMEIRO modelo da lista e escreve o nome que vier — não
          // chumba nome de Modelo. Estes dois nomes espelham o seed da API.
          { id: "m-1", name: "Treino A" },
          { id: "m-2", name: "Treino B" },
          { id: "m-3", name: "Full body iniciante" },
        ],
      },
    ],
    [/^\/v1\/prescriptions\/[^/]+\/items\/[^/]+$/, { ok: true }],
    [/^\/v1\/publish$/, { ok: true }],
    [/^\/v1\/progress$/, PROGRESS],
    [/^\/v1\/records$/, { items: PR_ITEMS }],
    [/^\/v1\/sessions\/[^/]+\/finish$/, {
      ofensiva: { current_count: 214, protector_available: true },
      xp_gained: 40,
      xp_total: 18740,
      records: RECORDS,
      badge_keys: ["pr_terra"],
    }],
    [/^\/v1\/sessions\/[^/]+\/sets$/, { ok: true }],
    [/^\/v1\/sessions\/[^/]+\/swap$/, { ok: true }],
    [/^\/v1\/sessions$/, { id: "s-1", local_id: "cs-shot-0001", started_at: "2026-08-18T11:00:00.000Z" }],
    [/^\/v1\/comebacks\/[^/]+\/complete$/, { ok: true }],
    [/^\/v1\/onboarding$/, { ok: true }],
    [/^\/v1\/commitment$/, { ok: true }],
    [/^\/v1\/auth\/code$/, { ok: true, dev_code: "4242", time }],
    [/^\/v1\/auth\/verify$/, { token: TOKEN, person: ALUNA, time }],
    [/^\/v1\/auth\/logout$/, { ok: true }],
  ];

  const named: Record<string, unknown> = {
    comeback: todayPayload(time, {
      prescription: null,
      ofensiva: { current_count: 0, protector_available: false },
      comeback: { id: "cb-1", minutes: 18, coach_line: "Volta curta. O acervo não foi embora." },
    }),
    vazio: todayPayload(time, {
      prescription: null,
      prontidao: { score: 0, energy: 0, soreness: 0, sleep: 0, label: "" },
      ofensiva: { current_count: 0, protector_available: false },
      xp_total: 0,
      coach_line: "",
    }),
  };

  const patches: [RegExp, unknown][] = Object.entries(over).map(([path, body]) => [
    new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    typeof body === "string" ? named[body] : body,
  ]);

  return [...patches, ...base];
}
