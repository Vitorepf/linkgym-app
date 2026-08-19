import Constants from "expo-constants";
import { APARENCIA_PADRAO, type Aparencia } from "./theme";

export function apiBaseUrl(): string {
  const env = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080").replace(
    /\/$/,
    "",
  );
  const hostUri = Constants.expoConfig?.hostUri ?? "";
  const host = hostUri.replace(/^\w+:\/\//, "").split(":")[0];
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return `http://${host}:8080`;
  }
  return env;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (init.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }
  const res = await fetch(`${apiBaseUrl()}${path}`, { ...init, headers });
  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? "erro");
  }
  return body as T;
}

export type Person = {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatar_color?: string;
  avatar_url?: string;
};

/** A config white-label do Time — o cardápio que o personal monta. Toda chave é
 *  opcional no payload; `configDoTime` aplica os padrões de fábrica. */
export type TimeConfig = {
  /** A APARÊNCIA: o documento que o personal edita para o app inteiro ser dele. A cor
   *  primária NÃO mora aqui — ela é `accent_color`, que já é coluna e já viaja no convite.
   *  Um documento com dois donos da mesma cor é a receita de divergirem. */
  aparencia?: Partial<Aparencia>;
  liga?: "nomes" | "anonima" | "off";
  selos?: boolean;
  xp?: boolean;
  prontidao?: boolean;
  passo_kg?: number;
  dias_padrao?: number;
  boas_vindas?: string;
  retomada?: string;
};

export type Time = {
  id: string;
  name: string;
  accent_color: string;
  logo_url?: string;
  config?: TimeConfig | null;
};

/** Config com os padrões de fábrica aplicados: ausência de chave = comportamento que o
 *  app sempre teve. É a única porta de leitura — tela nenhuma lê `time.config` cru. */
export function configDoTime(time: Time): Required<
  Pick<TimeConfig, "liga" | "selos" | "xp" | "prontidao" | "passo_kg" | "dias_padrao">
> &
  Pick<TimeConfig, "boas_vindas" | "retomada"> {
  const c = time.config ?? {};
  return {
    liga: c.liga ?? "nomes",
    selos: c.selos ?? true,
    xp: c.xp ?? true,
    prontidao: c.prontidao ?? true,
    passo_kg: c.passo_kg ?? 2.5,
    dias_padrao: c.dias_padrao ?? 3,
    boas_vindas: c.boas_vindas,
    retomada: c.retomada,
  };
}

/** A aparência com os padrões de fábrica aplicados e a cor primária vinda de onde ela
 *  mora. Ausência de documento = o app de sempre, byte a byte. */
export function aparenciaDoTime(time: Time | null | undefined): Aparencia {
  const a = time?.config?.aparencia ?? {};
  return {
    ...APARENCIA_PADRAO,
    ...a,
    primaria: time?.accent_color || APARENCIA_PADRAO.primaria,
  };
}

/** URL de mídia pronta para o aparelho. A API manda caminho RELATIVO (/v1/media/...):
 *  quem serve a imagem é a própria API, no MESMO host que o app já alcança em qualquer
 *  aparelho. A primeira versão trocava o host de uma URL presignada do MinIO — e a
 *  assinatura SigV4 é presa ao host: quebrava com 403 e o logo sumia da tela. */
export function mediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") ? `${apiBaseUrl()}${url}` : url;
}

export function requestCode(phone: string, inviteCode?: string) {
  return request<{ ok: boolean; dev_code?: string; time?: Time }>(
    "/v1/auth/code",
    {
      method: "POST",
      body: JSON.stringify({ phone, invite_code: inviteCode ?? "" }),
    },
  );
}

export function verify(phone: string, code: string, inviteCode?: string) {
  return request<{ token: string; person: Person; time: Time }>(
    "/v1/auth/verify",
    {
      method: "POST",
      body: JSON.stringify({ phone, code, invite_code: inviteCode ?? "" }),
    },
  );
}

export type MePayload = {
  person: Person;
  time: Time;
  onboarding_complete: boolean;
  commitment_complete: boolean;
  debut: boolean;
};

export function me(token: string) {
  return request<MePayload>("/v1/me", { token });
}

export function logout(token: string) {
  return request<{ ok: boolean }>("/v1/auth/logout", { method: "POST", token });
}

export type TodayItem = {
  id: string;
  exercise_id: string;
  name: string;
  position: number;
  planned_sets: number;
  planned_reps: string;
  load_kg: number;
  rest_seconds: number | null;
  notes: string | null;
  video_url: string | null;
  /** O que o CORPO dele fez da última vez neste exercício — série executada, não carga
   *  prescrita. `null` quando nunca fez: a tela desenha a ausência, nunca um número
   *  inventado. */
  last_kg: number | null;
  last_reps: number | null;
};

export type Prontidao = {
  score: number;
  energy: number;
  soreness: number;
  sleep: number;
  label: string;
};

export type TodayPayload = {
  time: Time;
  person: { id: string; name: string };
  prontidao: Prontidao;
  ofensiva: { current_count: number; protector_available: boolean };
  xp_total: number;
  prescription: {
    id: string;
    name: string;
    for_date: string;
    minutes: number;
    items: TodayItem[];
  } | null;
  banner: { text: string; kind: string } | null;
  coach_line: string;
  debut: boolean;
  comeback: { id: string; minutes: number; coach_line: string } | null;
  /** Cumprimento: a Sessão prescrita de hoje FECHADA. Nunca volume, carga ou percentual
   *  do prescrito. É o que acende o contador da Ofensiva no chrome. */
  cumprido: boolean;
};

export type OwnerHome = {
  greeting: string;
  student_count: number;
  fio: {
    prescribed: number;
    done: number;
    week: { for_date: string; done: number; prescribed: number }[];
  };
  attention: {
    id: string;
    person_id: string;
    name: string;
    reason: string;
    decision: string;
    rank: number;
    applied?: boolean;
    days?: number;
  }[];
  unread_returns: number;
};

export function today(token: string) {
  return request<TodayPayload>("/v1/today", { token });
}

export function putProntidao(
  token: string,
  body: { energy: number; soreness: number; sleep: number },
) {
  return request<Prontidao>("/v1/today/prontidao", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function ownerHome(token: string) {
  return request<OwnerHome>("/v1/owner/home", { token });
}

/** As LEITURAS da Mensalidade sobre a turma (CONTEXT.md) + quem está perto de sumir.
 *  Dinheiro em centavos: float é o bug que ninguém acha. */
export type OwnerOperacao = {
  student_count: number;
  com_mensalidade: number;
  /** O COMBINADO: preço de tabela × turma de hoje. NÃO é receita — não muda um centavo
   *  quando ninguém paga. Chamava-se "Receita do mês" na tela, colado num "em aberto"
   *  que dizia o contrário. */
  receita_cents: number;
  ticket_cents: number;
  /** O mês em três pedaços, que somam o combinado: o que entrou, o que ainda vai vencer,
   *  e o que passou do dia. Antes os dois últimos eram um número só. */
  recebido_cents: number;
  a_vencer_cents: number;
  vencido_cents: number;
  /** Quando o personal marcou alguma coisa pela última vez. `null` = nunca. É o que deixa
   *  a tela distinguir "ninguém pagou" de "ele parou de marcar" — sem isso, o esquecimento
   *  dele vira acusação de calote contra a turma inteira. */
  ultima_marcacao: string | null;
  /** A chave de recebimento do personal. NÃO viaja no payload do aluno: quem paga não
   *  precisa saber a chave, e `Time` é compartilhado com o convite. */
  pix: {
    configurado: boolean;
    chave: string;
    nome: string;
    cidade: string;
  };
  /** O que ele vendeu fora da mensalidade e ainda não recebeu: avaliação, whey, marmita.
   *  Dois campos, sem catálogo — "qualquer tipo de produto" com categoria, foto, estoque e
   *  frete são seis decisões entre o personal e o dinheiro. */
  a_entregar: Cobranca[];
  month: string;
  em_aberto: {
    bond_id: string;
    person_id: string;
    name: string;
    amount_cents: number;
    due_day: number;
    /** dias desde o vencimento neste mês; negativo = ainda vence. */
    vencido_ha: number;
    /** o copia-e-cola do Pix COM o valor desta linha. Vazio = o personal ainda não
     *  configurou a chave. É o que impede a aluna pagar R$ 300 quando o combinado é 350. */
    copia_e_cola: string;
  }[];
  /** QUEM VAI SUMIR — e por quê, numa frase conferível. Nunca um score, nunca um
   *  percentual: "78% de chance de cancelar" é infalsificável para quem lê, e o personal
   *  ou obedece sem julgar ou ignora. Um fato ele confere contra a memória em dois
   *  segundos, descobre que ela viajou, e a fila continua merecendo confiança. Teto de 3. */
  risco: {
    person_id: string;
    bond_id: string;
    name: string;
    phone: string;
    motivo: string;
    /** o que o dedo faz nesta linha. */
    acao: "recebi" | "pix" | "mandar" | "publicar" | "abrir";
    /** o código do sinal que a escolheu, para o toque registrar o porquê. */
    sinal: string;
    amount_cents: number;
  }[];
  /** QUEM não tem combinado. O rodapé escrevia só o número e mandava digitar "na
   *  pessoa" — uma porta que não existia. Número sem os nomes que o compõem não abre
   *  nada. */
  sem_combinado: {
    bond_id: string;
    person_id: string;
    name: string;
  }[];
};

export type Cobranca = {
  id: string;
  bond_id: string;
  person_id: string;
  name: string;
  descricao: string;
  valor_cents: number;
  criada_em: string;
  recebida_em: string | null;
  copia_e_cola: string;
};

/** Criar o que ele vende fora da mensalidade. A resposta já traz o Pix pronto: o gesto
 *  seguinte dele é mandar o código, e um segundo pedido no meio seria uma espera. */
export function criarCobranca(
  token: string,
  body: { bond_id: string; descricao: string; valor_cents: number },
) {
  return request<Cobranca>("/v1/owner/cobrancas", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function receberCobranca(token: string, id: string, desfazer = false) {
  return request<{ ok: boolean }>(`/v1/owner/cobrancas/${id}/recebi`, {
    method: desfazer ? "DELETE" : "POST",
    token,
  });
}

/** Encerrar, pausar ou reativar o vínculo. Sem isto, quem sai do estúdio continua contando,
 *  faturando e devendo para sempre — e o erro é cumulativo mês a mês. */
export function mudarEstadoDoVinculo(
  token: string,
  bondId: string,
  estado: "active" | "paused" | "ended",
) {
  return request<{ ok: boolean }>(`/v1/owner/bonds/${bondId}/estado`, {
    method: "PUT",
    token,
    body: JSON.stringify({ estado }),
  });
}

export function ownerOperacao(token: string) {
  return request<OwnerOperacao>("/v1/owner/operacao", { token });
}

export function pagarMensalidade(token: string, bondId: string) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}/pagar`, {
    method: "POST",
    token,
  });
}

/** O COMBINADO: valor e dia do vencimento daquele Vínculo, digitados pelo personal.
 *
 *  A rota existe no backend desde a migration 00006 e NENHUMA tela do app a chamava —
 *  enquanto o rodapé da Operação mandava o personal "digitar na pessoa". Os quatro
 *  números daquela tela são aritmética sobre este dado, então sem esta chamada a
 *  Operação inteira era um relatório sobre algo que o app não sabia criar. */
/** Desfazer o "Recebi". Travado em `meio = 'mao'` no servidor: pagamento de provedor não
 *  some por toque errado. */
export function desfazerPagamento(token: string, bondId: string) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}/pagar`, {
    method: "DELETE",
    token,
  });
}

export function definirMensalidade(
  token: string,
  bondId: string,
  body: { amount_cents: number; due_day: number },
) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function patchTime(
  token: string,
  body: {
    name?: string;
    accent_color?: string;
    logo_object_key?: string;
    config?: TimeConfig;
  },
) {
  return request<{ ok: boolean }>("/v1/owner/time", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

/** O CONVITE: a porta do aluno, e o primeiro artefato da marca do personal que sai do
 *  app. Telefone é opcional — sem ele o convite é aberto e serve para quem for. Com ele, a
 *  API devolve o convite ABERTO daquele número se já houver um, em vez de empilhar
 *  códigos: tocar duas vezes no botão manda o mesmo link. */
export function criarConvite(token: string, phone?: string) {
  return request<{ code: string; phone?: string; expires_at: string }>(
    "/v1/owner/invites",
    {
      method: "POST",
      token,
      body: JSON.stringify(phone ? { phone } : {}),
    },
  );
}

export function presignMedia(
  token: string,
  kind: "avatar" | "logo",
  contentType: string,
) {
  return request<{ object_key: string; upload_url: string }>(
    "/v1/media/presign",
    {
      method: "POST",
      token,
      body: JSON.stringify({ kind, content_type: contentType }),
    },
  );
}

export function patchMe(
  token: string,
  body: { name?: string; avatar_color?: string; avatar_object_key?: string },
) {
  return request<MePayload>("/v1/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export type OwnerAttention = OwnerHome["attention"][number];

export function ownerAttention(token: string) {
  return request<{ items: OwnerAttention[] }>("/v1/owner/attention", { token });
}

export function applyOwnerAttention(token: string, id: string) {
  return request<{ ok: boolean }>(`/v1/owner/attention/${id}/apply`, {
    method: "POST",
    token,
  });
}

export async function completeComeback(token: string, id: string) {
  try {
    return await request<{ ok: boolean }>(`/v1/comebacks/${id}/complete`, {
      method: "POST",
      token,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { ok: true };
    }
    throw err;
  }
}

export type SessionStart = {
  id: string;
  local_id: string;
  started_at: string;
};

export type FinishRecord = {
  exercise_name: string;
  load_kg: number;
  previous_kg: number;
};

export type FinishPayload = {
  ofensiva: { current_count: number; protector_available: boolean };
  xp_gained: number;
  xp_total: number;
  records: FinishRecord[];
  badge_keys: string[];
};

export type SessionSetBody = {
  local_id: string;
  prescription_item_id: string;
  exercise_id: string;
  swapped_from_exercise_id: string | null;
  set_index: number;
  reps: number;
  load_kg: number;
  rest_seconds: number;
  effort?: 1 | 2 | 3;
  performed_at: string;
};

export function startSession(
  token: string,
  body: { local_id: string; prescription_id: string },
) {
  return request<SessionStart>("/v1/sessions", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function addSessionSet(
  token: string,
  sessionId: string,
  body: SessionSetBody,
) {
  return request<SessionSetBody>(`/v1/sessions/${sessionId}/sets`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function finishSession(
  token: string,
  sessionId: string,
  effort: 1 | 2 | 3,
) {
  return request<FinishPayload>(`/v1/sessions/${sessionId}/finish`, {
    method: "POST",
    token,
    body: JSON.stringify({ effort }),
  });
}

export function swapExercise(
  token: string,
  sessionId: string,
  fromExerciseId: string,
  toExerciseId: string,
) {
  return request<{ ok: boolean }>(`/v1/sessions/${sessionId}/swap`, {
    method: "POST",
    token,
    body: JSON.stringify({
      from_exercise_id: fromExerciseId,
      to_exercise_id: toExerciseId,
    }),
  });
}

export type OwnerReturn = {
  alert_id: string;
  person_id: string;
  name: string;
  effort: number;
  records: FinishRecord[];
  /** Trocas feitas no meio da sessão. Avisam o personal; não quebram a ofensiva. */
  swaps?: { from: string; to: string }[];
  created_at: string;
};

export function ownerReturns(token: string) {
  return request<{ items: OwnerReturn[] }>("/v1/owner/returns", { token });
}

export function applyOwnerReturn(
  token: string,
  alertId: string,
  bumpKg: 2.5 | 0 | -2.5,
) {
  return request<{ ok: boolean }>(`/v1/owner/returns/${alertId}/apply`, {
    method: "POST",
    token,
    body: JSON.stringify({ bump_kg: bumpKg }),
  });
}

export type OwnerWeekItem = {
  person_id: string;
  name: string;
  adherence: string;
  suggested: string;
  selected: boolean;
};

export function ownerWeek(token: string, from?: string) {
  const q = from ? `?from=${encodeURIComponent(from)}` : "";
  return request<{ items: OwnerWeekItem[] }>(`/v1/owner/week${q}`, { token });
}

export function approveOwnerWeek(token: string, personIds: string[]) {
  return request<{ count: number }>("/v1/owner/week/approve", {
    method: "POST",
    token,
    body: JSON.stringify({ person_ids: personIds }),
  });
}

export type OwnerStudent = {
  person_id: string;
  bond_id: string;
  name: string;
  last_effort: number | null;
  last_loads: { exercise_name: string; load_kg: number }[];
  ofensiva: { current_count: number };
  suggested: string;
  commitment_text: string | null;
  /** O combinado desta pessoa. `null` = o personal nunca digitou — e é essa ausência que
   *  a tela usa para oferecer "Combinar o valor" em vez de desenhar um R$ 0 mentiroso. */
  combinado: { amount_cents: number; due_day: number } | null;
};

export function ownerStudent(token: string, id: string) {
  return request<OwnerStudent>(`/v1/owner/students/${id}`, { token });
}

export type ModelSummary = {
  id: string;
  name: string;
};

export function listModels(token: string) {
  return request<{ items: ModelSummary[] }>("/v1/models", { token });
}

export type DraftItem = {
  id: string;
  exercise_id: string;
  name: string;
  planned_sets: number;
  planned_reps: string;
  load_kg: number;
  /** De onde a carga veio. 'history' = o CORPO levantou; 'prescription' = a ficha
   *  anterior pediu e o corpo ainda nao fez; 'starter' = chute do Modelo; 'manual' = o
   *  personal cravou. Os quatro sao distintos de proposito: e onde o personal ve o que
   *  ainda precisa decidir. */
  load_source: "history" | "prescription" | "starter" | "manual";
};

export function draftFromLast(
  token: string,
  modelId: string,
  personId: string,
  from: "last" | "model" = "last",
) {
  return request<{ draft_id: string; items: DraftItem[] }>(
    `/v1/models/${modelId}/draft-from-last`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ person_id: personId, from }),
    },
  );
}

export function patchPrescriptionItem(
  token: string,
  prescriptionId: string,
  itemId: string,
  body: { load_kg: number; planned_sets: number; planned_reps: string },
) {
  return request<{ ok: boolean }>(
    `/v1/prescriptions/${prescriptionId}/items/${itemId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    },
  );
}

/** `coachLine` é a frase que o personal escreveu para o dia, na voz dele. Vazia é o
 *  caso normal: o /v1/today devolve vazio e a tela do aluno não desenha bloco nenhum —
 *  o app não assina no lugar de quem não escreveu. */
export function publishPrescription(
  token: string,
  prescriptionId: string,
  alsoPersonIds: string[],
  coachLine = "",
) {
  return request<{ ok: boolean }>("/v1/publish", {
    method: "POST",
    token,
    body: JSON.stringify({
      prescription_id: prescriptionId,
      also_person_ids: alsoPersonIds,
      coach_line: coachLine,
    }),
  });
}

export type LeagueRow = {
  name: string;
  xp_total: number;
  me: boolean;
};

export type ProgressPayload = {
  ofensiva: { current_count: number; protector_available: boolean };
  xp_total: number;
  league: LeagueRow[];
  badges: { badge_key: string; earned_at: string }[];
  prontidao_week: { for_date: string; score: number }[];
};

export type RecordItem = {
  exercise_name: string;
  load_kg: number;
  reps: number;
  achieved_at: string;
  history: { load_kg: number; achieved_at: string }[];
};

export function progress(token: string) {
  return request<ProgressPayload>("/v1/progress", { token });
}

export function records(token: string) {
  return request<{ items: RecordItem[] }>("/v1/records", { token });
}

export type OnboardingBody = {
  experience: "never" | "before" | "training";
  days_per_week: 2 | 3 | 4 | 5 | 6;
  pain: boolean;
  sex?: "male" | "female";
  height_cm?: number;
  weight_kg?: number;
};

export function putOnboarding(token: string, body: OnboardingBody) {
  return request<{ ok: boolean }>("/v1/onboarding", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function putCommitment(token: string, daysPerWeek: 2 | 3 | 4 | 5 | 6) {
  return request<{ ok: boolean }>("/v1/commitment", {
    method: "PUT",
    token,
    body: JSON.stringify({ days_per_week: daysPerWeek }),
  });
}
