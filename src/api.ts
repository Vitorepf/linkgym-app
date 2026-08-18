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
  return request<{ ok: boolean; dev_code?: string }>("/v1/auth/code", {
    method: "POST",
    body: JSON.stringify({ phone, invite_code: inviteCode ?? "" }),
  });
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

export function me(token: string) {
  return request<{ person: Person; studio: Studio }>("/v1/me", { token });
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

export type TodayPayload = {
  studio: Studio;
  person: { id: string; name: string };
  readiness: {
    score: number;
    energy: number;
    soreness: number;
    sleep: number;
    label: string;
  };
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

export function ownerHome(token: string) {
  return request<OwnerHome>("/v1/owner/home", { token });
}
