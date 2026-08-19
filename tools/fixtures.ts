// Fixtures do host de screenshot. Uma entrada por tela, com os props de sessão do Root,
// o initialState do NavigationContainer e o JSON que o stub de rede devolve.
// Dados de treino de verdade: nomes brasileiros, exercícios reais, cargas em kg.
import type {
  Cobranca,
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
  // avatar por COR (sem foto): o shot prova o degrau do meio do Avatar sem depender de
  // imagem de rede — o host de shots não sai para a internet.
  avatar_color: "#2d7ef7",
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
    // Os dois caminhos entram no shot de propósito. O exercício 5 nunca foi feito, então
    // vem sem referência e a tela tem que desenhar a AUSÊNCIA — se todo item tivesse
    // histórico, as 600 montagens jamais provariam o caso do traço.
    //
    // O número é diferente do prescrito também de propósito: se alguém religar a
    // referência na prescrição, o shot passa a mostrar a mesma carga duas vezes e a
    // diferença aparece na imagem.
    last_kg: n === 5 ? null : Math.round((kg + 5) * 2) / 2,
    last_reps: n === 5 ? null : Number(reps) + 1 || null,
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
    reason: "student_stopped",
    decision: "Mandar retomada curta",
    rank: 1,
    days: 9,
  },
  {
    id: "al-2",
    person_id: "p-carlos",
    name: "Carlos Eduardo Lima",
    reason: "high_effort",
    decision: "Subir 2,5 kg",
    rank: 2,
  },
  {
    id: "al-3",
    person_id: "p-ana",
    name: "Ana Beatriz Nascimento Rodrigues",
    reason: "pain_flag",
    decision: "Trocar desenvolvimento",
    rank: 3,
  },
];

/** A operação: leituras da Mensalidade sobre a MESMA turma de WEEK (20 alunos), com a
 *  conta fechando — ticket = receita / com_mensalidade. Nomes reaproveitados de WEEK
 *  para as portas (risco abre a Aluna) apontarem para gente que existe no fixture. */
// A receita do FRED REAL, e nao um numero redondo de 5 caracteres. Com 700000 a fila de
// numeros cabia em duas colunas na foto e cabia em uma no aparelho: `FORMA.numero.colunas`
// recusa a segunda coluna acima de 5 caracteres, e "10.500" tem 6. A fixture escondia da
// catraca e do critico cego exatamente o estado em que o estudio que cresce perde a dobra.
// BR Codes reais, gerados por internal/pix/brcode.go com a chave do Fred.
const PIX_350 = "00020126360014br.gov.bcb.pix0118fred@studio.com.br52040000530398654063350.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304";
const PIX_300 = "00020126360014br.gov.bcb.pix0118fred@studio.com.br52040000530398654063300.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304";
const PIX_150 = "00020126360014br.gov.bcb.pix0118fred@studio.com.br52040000530398654063150.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304";
const PIX_219 = "00020126360014br.gov.bcb.pix0118fred@studio.com.br52040000530398654063219.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304";
const PIX_400 = "00020126360014br.gov.bcb.pix0118fred@studio.com.br52040000530398654063400.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304";

const OWNER_OPERACAO = {
  student_count: 28,
  com_mensalidade: 28,
  receita_cents: 1050000,
  ticket_cents: 37500,
  // O mes em tres pedacos. 25 marcados x 375 = 937500 entrou; sobram os tres em aberto,
  // e um deles (Patricia, dia 25) ainda NAO venceu — e era isso que o cartao antigo
  // somava junto com os vencidos.
  recebido_cents: 940000,
  vencido_cents: 65000,
  a_vencer_cents: 40000,
  ultima_marcacao: "2026-08-18" as string | null,
  month: "2026-08-01",
  // O copia_e_cola vem PRONTO do servidor, com o valor daquela pessoa dentro. Sao BR Codes
  // de verdade, montados por internal/pix — o que a foto mostra e o que o banco leria.
  em_aberto: [
    { bond_id: "b-marina", person_id: "p-marina", name: "Marina Okamoto", amount_cents: 35000, due_day: 10, vencido_ha: 9, copia_e_cola: PIX_350 },
    { bond_id: "b-rafa", person_id: "p-rafa", name: "Rafael Souza", amount_cents: 30000, due_day: 15, vencido_ha: 4, copia_e_cola: PIX_300 },
    { bond_id: "b-patricia", person_id: "p-patricia", name: "Patrícia Salgado", amount_cents: 40000, due_day: 25, vencido_ha: -6, copia_e_cola: PIX_400 },
  ],
  pix: { configurado: true, chave: "fred@studio.com.br", nome: "Fred Personal", cidade: "Sao Paulo" },
  // O que ele vende fora da mensalidade e ainda nao recebeu.
  a_entregar: [
    {
      id: "c-1", bond_id: "b-marina", person_id: "p-marina", name: "Marina Okamoto",
      descricao: "Avaliação física", valor_cents: 15000, criada_em: "2026-08-14",
      recebida_em: null, copia_e_cola: PIX_150,
    },
    {
      id: "c-2", bond_id: "b-rafa", person_id: "p-rafa", name: "Rafael Souza",
      descricao: "Whey 900g", valor_cents: 21900, criada_em: "2026-08-17",
      recebida_em: null, copia_e_cola: PIX_219,
    },
  ] as Cobranca[],
  // Tres sinais DIFERENTES, que e o ponto: a fila antiga dizia "N dias sem treinar" para
  // todo mundo, e o mesmo numero nao significa a mesma coisa para quem treinava 4x e para
  // quem treina 1x. Aqui cada linha traz o motivo conferivel e a acao daquele motivo.
  risco: [
    {
      person_id: "p-marina",
      bond_id: "b-marina",
      name: "Marina Okamoto",
      phone: "+5511900000031",
      motivo: "R$ 350 em aberto há 9 dias, e 12 dias sem treinar",
      acao: "recebi" as const,
      sinal: "dinheiro_e_sumico",
      amount_cents: 35000,
    },
    {
      person_id: "p-patricia",
      bond_id: "b-patricia",
      name: "Patrícia Salgado",
      phone: "+5511900000032",
      motivo: "Treinava 4× por semana. Fez 1 nas últimas duas.",
      acao: "mandar" as const,
      sinal: "queda_contra_a_linha",
      amount_cents: 0,
    },
    {
      person_id: "p-diego",
      bond_id: "b-diego",
      name: "Diego Albuquerque",
      phone: "+5511900000033",
      motivo: "Você não publica para Diego há 24 dias.",
      acao: "publicar" as const,
      sinal: "silencio_do_personal",
      amount_cents: 0,
    },
  ],
  sem_combinado: [] as { bond_id: string; person_id: string; name: string }[],
};

/** Os alunos sem valor combinado — o estado que a fixture cheia nunca produzia, porque ela
 *  cravava com_mensalidade === student_count. A faixa que aponta para a tela do Combinado
 *  NUNCA entrava em foto nenhuma, e por isso nem a catraca nem o critico cego viram que ela
 *  prometia uma porta inexistente. */
const SEM_COMBINADO = [
  { bond_id: "b-ana", person_id: "p-ana", name: "Ana Beatriz Nascimento Rodrigues" },
  { bond_id: "b-bruno", person_id: "p-bruno", name: "Bruno Tavares" },
  { bond_id: "b-carla", person_id: "p-carla", name: "Carla Reis" },
  { bond_id: "b-davi", person_id: "p-davi", name: "Davi Monteiro" },
  { bond_id: "b-elis", person_id: "p-elis", name: "Elis Prado" },
];

const OWNER_HOME: OwnerHome = {
  greeting: "Bom treino",
  // O MESMO conjunto de WEEK: na API os dois números saem da mesma consulta (bonds
  // ativos). Enquanto o Painel dizia 34 e a turma listava 20, o número era só enfeite —
  // agora ele é uma porta e abre a lista que ele conta.
  student_count: WEEK.length,
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
  bond_id: "b-ana",
  name: "Ana Beatriz Nascimento Rodrigues",
  combinado: { amount_cents: 37500, due_day: 5 },
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
  // Os QUATRO valores aparecem, senao o shot nunca desenha o estado novo e o rodape
  // "de onde sairam as N cargas" nunca e conferido somando certo.
  load_source:
    i === 0 ? "history" : i === 1 ? "prescription" : i === 5 ? "starter" : "manual",
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
    cumprido: false,
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
    // O lote: e nele que a tela e julgada, porque uma linha sozinha nao mostra a decisao
    // que a tela toma (a caixa de edicao sobre NOMES, e nao um formulario por pessoa).
    case "Combinado":
      return {
        ...chrome,
        pessoas: SEM_COMBINADO.map((p) => ({ bond_id: p.bond_id, name: p.name })),
      };
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
  // ---- personal (9)
  Painel: { ...OWNER, tab: "Painel" },
  Turma: { ...OWNER, tab: "Fichas" },
  Operacao: { ...OWNER, tab: "Operacao" },
  PerfilTime: { ...OWNER, tab: "PerfilTime" },
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
  // O estado ACESO do contador, coberto nas 20 marcas: com o dia cumprido o mesmo desenho
  // troca de saturação, e é justamente aí que um acento hostil (marca 13, igual ao fundo)
  // teria chance de sumir.
  HojeCumprido: { ...STUDENT, tab: "Hoje", api: { "/v1/today": "cumprido" } },
  Ficha: { ...STUDENT, route: { name: "Ficha" } },
  FichaTab: { ...STUDENT, tab: "MinhaFicha" },
  Serie: { ...STUDENT, route: { name: "Serie" } },
  Descanso: { ...STUDENT, route: { name: "Descanso" } },
  DescansoVirada: { ...STUDENT, route: { name: "Descanso" } },
  Feito: { ...STUDENT, route: { name: "Feito" } },
  Pronto: { ...STUDENT, onboardingComplete: false, route: { name: "Pronto" } },
  Progresso: { ...STUDENT, tab: "Progresso" },
  Recorde: { ...STUDENT, route: { name: "Recorde" } },
  // A Retomada deixou de ser rota: virou faixa sobre a Hoje. A tela coberta continua
  // sendo UMA na catraca `telas`, agora no estado que importa — a faixa E o dia atras
  // dela na mesma imagem.
  HojeRetomada: {
    ...STUDENT,
    tab: "Hoje",
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
  OperacaoVazia: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        em_aberto: [],
        risco: [],
      },
    },
  },
  // O estado que a fixture cheia escondia: parte da turma sem combinado, e a porta para a
  // tela que resolve isso desenhada no rodape.
  OperacaoSemCombinado: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        com_mensalidade: OWNER_OPERACAO.student_count - SEM_COMBINADO.length,
        sem_combinado: SEM_COMBINADO,
      },
    },
  },
  Combinado: { ...OWNER, route: { name: "Combinado" } },
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
    [/^\/v1\/owner\/operacao$/, OWNER_OPERACAO],
    [/^\/v1\/owner\/mensalidades\/[^/]+\/pagar$/, { ok: true }],
    [/^\/v1\/owner\/time$/, { ok: true }],
    [/^\/v1\/media\/presign$/, { object_key: "avatar/p-ana/x.jpg", upload_url: "http://localhost:9000/none" }],
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
      // A ficha de hoje FICA. Quem faltou ontem tem treino hoje, e a faixa se sobrepõe a
      // ele em vez de substituí-lo — se a fixture viesse sem prescrição, o shot provaria
      // o contrário do que o desenho promete.
      ofensiva: { current_count: 4, protector_available: false },
      comeback: { id: "cb-1", minutes: 18, coach_line: "Sua carga e seus recordes continuam aí." },
    }),
    cumprido: todayPayload(time, { cumprido: true, ofensiva: { current_count: 13, protector_available: true } }),
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
