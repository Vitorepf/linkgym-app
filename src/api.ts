import Constants from "expo-constants";

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
};

export type Studio = {
  id: string;
  name: string;
  accent_color: string;
};

export function requestCode(phone: string, inviteCode?: string) {
  return request<{ ok: boolean; dev_code?: string; studio?: Studio }>(
    "/v1/auth/code",
    {
      method: "POST",
      body: JSON.stringify({ phone, invite_code: inviteCode ?? "" }),
    },
  );
}

export function verify(phone: string, code: string, inviteCode?: string) {
  return request<{ token: string; person: Person; studio: Studio }>(
    "/v1/auth/verify",
    {
      method: "POST",
      body: JSON.stringify({ phone, code, invite_code: inviteCode ?? "" }),
    },
  );
}

export type MePayload = {
  person: Person;
  studio: Studio;
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
};

export type Readiness = {
  score: number;
  energy: number;
  soreness: number;
  sleep: number;
  label: string;
};

export type TodayPayload = {
  studio: Studio;
  person: { id: string; name: string };
  readiness: Readiness;
  streak: { current_count: number; protector_available: boolean };
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
  }[];
  unread_returns: number;
};

export function today(token: string) {
  return request<TodayPayload>("/v1/today", { token });
}

export function putReadiness(
  token: string,
  body: { energy: number; soreness: number; sleep: number },
) {
  return request<Readiness>("/v1/today/readiness", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function ownerHome(token: string) {
  return request<OwnerHome>("/v1/owner/home", { token });
}

export type SessionStart = {
  id: string;
  client_id: string;
  started_at: string;
};

export type FinishRecord = {
  exercise_name: string;
  load_kg: number;
  previous_kg: number;
};

export type FinishPayload = {
  streak: { current_count: number; protector_available: boolean };
  xp_gained: number;
  xp_total: number;
  records: FinishRecord[];
  badge_keys: string[];
};

export type SessionSetBody = {
  client_set_id: string;
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
  body: { client_id: string; prescription_id: string },
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

export type LeagueRow = {
  name: string;
  xp_total: number;
  me: boolean;
};

export type ProgressPayload = {
  streak: { current_count: number; protector_available: boolean };
  xp_total: number;
  league: LeagueRow[];
  badges: { badge_key: string; earned_at: string }[];
  readiness_week: { for_date: string; score: number }[];
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
