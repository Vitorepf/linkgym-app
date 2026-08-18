import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addSessionSet,
  finishSession,
  startSession,
  type FinishPayload,
} from "../api";

export type QueuedSet = {
  client_set_id: string;
  prescription_item_id: string;
  exercise_id: string;
  swapped_from_exercise_id?: string;
  set_index: number;
  reps: number;
  load_kg: number;
  rest_seconds: number;
  effort?: 1 | 2 | 3;
  performed_at: string;
};

export type LocalSession = {
  client_id: string;
  server_id?: string;
  prescription_id: string;
  sets: QueuedSet[];
  finished?: { effort: 1 | 2 | 3 };
  swaps?: Record<string, string>;
};

const CURRENT_KEY = "linkgym.session.current";

function storageKey(clientId: string): string {
  return `linkgym.session.${clientId}`;
}

export function newClientId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const n = (Math.random() * 16) | 0;
    const v = ch === "x" ? n : (n & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function loadSession(clientId: string): Promise<LocalSession | null> {
  const raw = await AsyncStorage.getItem(storageKey(clientId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalSession;
  } catch {
    return null;
  }
}

export async function loadCurrent(): Promise<LocalSession | null> {
  const id = await AsyncStorage.getItem(CURRENT_KEY);
  if (!id) return null;
  return loadSession(id);
}

export async function saveSession(session: LocalSession): Promise<void> {
  await AsyncStorage.setItem(storageKey(session.client_id), JSON.stringify(session));
  await AsyncStorage.setItem(CURRENT_KEY, session.client_id);
}

export async function dropSession(clientId: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(clientId));
  const current = await AsyncStorage.getItem(CURRENT_KEY);
  if (current === clientId) {
    await AsyncStorage.removeItem(CURRENT_KEY);
  }
}

export async function createSession(
  prescriptionId: string,
  clientId = newClientId(),
): Promise<LocalSession> {
  const session: LocalSession = {
    client_id: clientId,
    prescription_id: prescriptionId,
    sets: [],
  };
  await saveSession(session);
  return session;
}

export async function ensureServerSession(
  token: string,
  prescriptionId: string,
): Promise<string> {
  let session = await loadCurrent();
  if (!session || session.prescription_id !== prescriptionId || session.finished) {
    session = await createSession(prescriptionId, newClientId());
  }
  const started = await startSession(token, {
    client_id: session.client_id,
    prescription_id: prescriptionId,
  });
  session.server_id = started.id;
  await saveSession(session);
  return started.id;
}

export async function rememberSwap(
  clientId: string,
  fromExerciseId: string,
  toExerciseId: string,
): Promise<void> {
  const session = await loadSession(clientId);
  if (!session) return;
  session.swaps = { ...session.swaps, [fromExerciseId]: toExerciseId };
  await saveSession(session);
}

export async function enqueueSet(
  clientId: string,
  set: QueuedSet,
): Promise<LocalSession> {
  const session = await loadSession(clientId);
  if (!session) {
    throw new Error("sessao_ausente");
  }
  const to = session.swaps?.[set.exercise_id];
  const queued: QueuedSet =
    to && to !== set.exercise_id
      ? { ...set, exercise_id: to, swapped_from_exercise_id: set.exercise_id }
      : set;
  const i = session.sets.findIndex((s) => s.client_set_id === queued.client_set_id);
  if (i >= 0) {
    session.sets[i] = queued;
  } else {
    session.sets.push(queued);
  }
  await saveSession(session);
  return session;
}

export async function patchLastSetEffort(
  clientId: string,
  effort: 1 | 2 | 3,
): Promise<void> {
  const session = await loadSession(clientId);
  if (!session || session.sets.length === 0) return;
  session.sets[session.sets.length - 1] = {
    ...session.sets[session.sets.length - 1],
    effort,
  };
  await saveSession(session);
}

export async function markFinished(
  clientId: string,
  effort: 1 | 2 | 3,
): Promise<LocalSession | null> {
  const session = await loadSession(clientId);
  if (!session) return null;
  session.finished = { effort };
  await saveSession(session);
  return session;
}

export type FlushResult =
  | { ok: true; finish?: FinishPayload }
  | { ok: false };

export async function flush(token: string, clientId?: string): Promise<FlushResult> {
  const session = clientId
    ? await loadSession(clientId)
    : await loadCurrent();
  if (!session) {
    return { ok: true };
  }
  try {
    const started = await startSession(token, {
      client_id: session.client_id,
      prescription_id: session.prescription_id,
    });
    session.server_id = started.id;
    await saveSession(session);

    for (const set of session.sets) {
      await addSessionSet(token, started.id, {
        client_set_id: set.client_set_id,
        prescription_item_id: set.prescription_item_id,
        exercise_id: set.exercise_id,
        swapped_from_exercise_id: set.swapped_from_exercise_id ?? null,
        set_index: set.set_index,
        reps: set.reps,
        load_kg: set.load_kg,
        rest_seconds: set.rest_seconds,
        effort: set.effort,
        performed_at: set.performed_at,
      });
    }

    if (session.finished) {
      const finish = await finishSession(token, started.id, session.finished.effort);
      await dropSession(session.client_id);
      return { ok: true, finish };
    }

    await saveSession(session);
    return { ok: true };
  } catch {
    await saveSession(session);
    return { ok: false };
  }
}

export function nextAfter(
  items: { planned_sets: number }[],
  itemIndex: number,
  setIndex: number,
): { itemIndex: number; setIndex: number } | "done" {
  const item = items[itemIndex];
  if (item && setIndex < item.planned_sets) {
    return { itemIndex, setIndex: setIndex + 1 };
  }
  if (itemIndex + 1 < items.length) {
    return { itemIndex: itemIndex + 1, setIndex: 1 };
  }
  return "done";
}

export function resumeCursor(
  items: { id: string; planned_sets: number }[],
  sets: QueuedSet[],
): { itemIndex: number; setIndex: number } | "done" {
  const done = new Set(
    sets.map((s) => `${s.prescription_item_id}:${s.set_index}`),
  );
  for (let i = 0; i < items.length; i++) {
    for (let n = 1; n <= items[i].planned_sets; n++) {
      if (!done.has(`${items[i].id}:${n}`)) {
        return { itemIndex: i, setIndex: n };
      }
    }
  }
  return "done";
}

export function lastLoadForItem(
  session: LocalSession | null,
  itemId: string,
  fallback: number,
): number {
  if (!session) return fallback;
  for (let i = session.sets.length - 1; i >= 0; i--) {
    if (session.sets[i].prescription_item_id === itemId) {
      return session.sets[i].load_kg;
    }
  }
  return fallback;
}

export function formatKg(n: number): string {
  const x = Math.round(n * 2) / 2;
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(1);
}

export function stepKg(n: number, delta: number): number {
  return Math.max(0, Math.round((n + delta) * 2) / 2);
}

export function defaultReps(planned: string): number {
  const nums = planned.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return 10;
  return nums[nums.length - 1] ?? 10;
}
