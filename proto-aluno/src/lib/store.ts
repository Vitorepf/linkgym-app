import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CATALOG,
  CHALLENGES,
  DECKS,
  DUELS,
  FICHAS_TREINO,
  GROUPS,
  RAID,
  LAST_WORKOUT,
  LOAD_BOOK,
  NOW,
  PRESCRIPTION,
  PROOFS,
  ARENA_LADDER,
  WAR,
  YOU,
  YOU_ID,
  deckLine,
  fichaOf,
  deckOf,
  duelOpen,
  fichaAt,
  fichaTreinoOf,
  hasRoom,
  proofGroupId,
  warSide,
} from "./seed";
import { dateShort } from "./format";
import type {
  Challenge,
  ClanKind,
  Deck,
  Effort,
  Exercise,
  FichaTreino,
  Group,
  Raid,
  LoadPoint,
  LoggedSet,
  Duel,
  Overlay,
  OfferKind,
  FichaSheet,
  PostKind,
  Proof,
  RedeBoard,
  SessionKind,
  TabId,
  War,
} from "./types";

export type LastLoads = Record<string, { kg: number; reps: number }>;
export type LoadBook = Record<string, LoadPoint[]>;

export function applyLast(items: Exercise[], lastLoads: LastLoads): Exercise[] {
  return items.map((it) => {
    const last = lastLoads[it.id];
    return last ? { ...it, last_kg: last.kg, last_reps: last.reps } : it;
  });
}

function seedBook(): LoadBook {
  return Object.fromEntries(Object.entries(LOAD_BOOK).map(([id, pts]) => [id, [...pts]]));
}

function bumpLastLoads(prev: LastLoads, logged: LoggedSet[]): LastLoads {
  const next = { ...prev };
  for (const s of logged) next[s.exerciseId] = { kg: s.load_kg, reps: s.reps };
  return next;
}

function bumpLoadBook(book: LoadBook, logged: LoggedSet[]): LoadBook {
  const day = dateShort(NOW);
  const max: Record<string, number> = {};
  for (const s of logged) max[s.exerciseId] = Math.max(max[s.exerciseId] ?? 0, s.load_kg);
  const next: LoadBook = { ...book };
  for (const [id, kg] of Object.entries(max)) {
    const prev = (next[id] ?? []).filter((p) => p.date !== day);
    next[id] = [...prev, { date: day, kg }];
  }
  return next;
}

export type Session = {
  kind: SessionKind;
  name: string;
  items: Exercise[];
  itemIndex: number;
  setIndex: number;
  kg: number;
  reps: number;
  logged: LoggedSet[];
  restLeft: number;
  startedAt: number;
  lastLogged: { kg: number; reps: number } | null;
};

type LastProof = {
  id: string;
  title: string;
  place: string;
  caption: string;
  sets: number;
  volumeKg: number;
  minutes: number;
  ofensiva: number;
  image: string;
  lead: string;
  pr: { name: string; kg: number; before: number | null } | null;
  mode: "recibo" | "patamar";
  patamar: { eixo: string; sub: string; unidade: string; frase: string; barra: number } | null;
};

type State = {
  hydrated: boolean;
  tab: TabId;
  overlay: Overlay;
  overlayTrail: Overlay[];
  redeBoard: RedeBoard;
  fichaSheet: FichaSheet;
  name: string;
  avatarColor: string;
  ofensiva: number;
  protector: boolean;
  protectorUsed: boolean;
  cumprido: boolean;
  pagoMensal: boolean;
  session: Session | null;
  lastProof: LastProof | null;
  comoId: string | null;
  proofs: Proof[];
  duels: Duel[];
  taPagoGiven: string[];
  joinedBoras: string[];
  selectedProofId: string | null;
  selectedPersonId: string | null;
  selectedGroupId: string | null;
  selectedBoraId: string | null;
  groups: Group[];
  challenges: Challenge[];
  joinedGroupIds: string[];
  livrePicked: string[];
  lastLoads: LastLoads;
  loadBook: LoadBook;
  war: War;
  arenaLadder: { personId: string; sessions: number }[];
  raid: Raid;
  youRaids: number;
  pinnedIds: string[];
  fichas: FichaTreino[];
  decks: Deck[];
  selectedFichaId: string | null;
  selectedDeckId: string | null;
  offer: { kind: OfferKind; id: string } | null;
  deckCursor: Record<string, number>;
  activeDeckId: string | null;
  patamarSeen: Record<string, number[]>;
  barras: Record<string, number>;
  setHydrated: () => void;
  setTab: (tab: TabId) => void;
  setRedeBoard: (board: RedeBoard) => void;
  setFichaSheet: (sheet: FichaSheet) => void;
  openOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
  startSession: (kind?: SessionKind, items?: Exercise[], name?: string) => void;
  resumeSession: () => void;
  abandonSession: () => void;
  bumpKg: (d: number) => void;
  bumpReps: (d: number) => void;
  logSet: () => void;
  skipRest: () => void;
  tickRest: () => void;
  setEffortAndAdvance: (effort: Effort) => void;
  finishNow: (effort: Effort) => void;
  closeFeito: () => void;
  goRede: () => void;
  openComo: (id: string) => void;
  openProof: (id: string) => void;
  openPerson: (id: string) => void;
  openGroup: (id: string) => void;
  openBora: (id: string) => void;
  givePago: (id: string) => void;
  speakOnProof: (id: string, text: string) => void;
  composePost: (kind: PostKind, caption: string, image?: string | null) => void;
  challengePost: (postId: string) => void;
  acceptDuel: (id: string) => void;
  togglePin: (id: string) => void;
  setProofCaption: (text: string) => void;
  joinBora: (id: string) => void;
  leaveBora: (id: string) => void;
  setName: (name: string) => void;
  setAvatarColor: (c: string) => void;
  markPago: () => void;
  useProtector: () => void;
  toggleLivre: (id: string) => void;
  startLivre: () => void;
  joinGroup: (id: string) => void;
  enterOpenGroup: (id: string) => void;
  leaveGroup: (id: string) => void;
  createGroup: (name: string, kind: ClanKind, about: string) => void;
  claimRaid: () => void;
  createChallenge: (days: 7 | 30, goal: number) => void;
  boraZap: (id: string) => void;
  selectDeck: (id: string | null) => void;
  selectFicha: (id: string | null) => void;
  createFicha: (name: string, itemIds: string[]) => void;
  createDeck: (name: string, about: string, fichaIds: string[]) => void;
  startFicha: (id: string) => void;
  startDeck: (id: string) => void;
  openOffer: (kind: OfferKind, id: string) => void;
  offerDuel: (toId: string) => void;
  reset: () => void;
};

function emptySession(kind: SessionKind, items: Exercise[], name: string): Session {
  const ex = items[0]!;
  return {
    kind,
    name,
    items,
    itemIndex: 0,
    setIndex: 1,
    kg: ex.last_kg ?? ex.load_kg,
    reps: ex.planned_reps,
    logged: [],
    restLeft: 0,
    startedAt: Date.now(),
    lastLogged: null,
  };
}

function loadFor(items: Exercise[], itemIndex: number, logged: LoggedSet[]) {
  const ex = items[itemIndex]!;
  const prev = [...logged].reverse().find((s) => s.exerciseId === ex.id);
  return {
    kg: prev?.load_kg ?? ex.last_kg ?? ex.load_kg,
    reps: prev?.reps ?? ex.planned_reps,
  };
}

export function nextCursor(items: Exercise[], itemIndex: number, setIndex: number) {
  const ex = items[itemIndex]!;
  if (setIndex < ex.planned_sets) return { itemIndex, setIndex: setIndex + 1 };
  if (itemIndex + 1 < items.length) return { itemIndex: itemIndex + 1, setIndex: 1 };
  return "done" as const;
}

function proofFrom(session: Session) {
  const volumeKg = session.logged.reduce((a, s) => a + s.load_kg * s.reps, 0);
  const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000));
  let pr: LastProof["pr"] = null;
  for (const s of session.logged) {
    const ex = session.items.find((i) => i.id === s.exerciseId);
    if (!ex || ex.last_kg == null) continue;
    if (s.load_kg > ex.last_kg && (!pr || s.load_kg > pr.kg)) {
      pr = { name: ex.name, kg: s.load_kg, before: ex.last_kg };
    }
  }
  return { sets: session.logged.length, volumeKg, minutes, pr };
}

function toFeed(session: Session, stats: ReturnType<typeof proofFrom>, groupId?: string): Proof {
  const vol = Math.round(stats.volumeKg);
  return {
    id: `me-${session.startedAt}`,
    personId: YOU_ID,
    kind: "feito",
    title: session.name,
    line: `${stats.sets} ${stats.sets === 1 ? "série" : "séries"}`,
    caption: stats.pr ? `${stats.pr.name} ${stats.pr.kg} kg. Subi.` : "",
    volume: `${stats.sets} ${stats.sets === 1 ? "série" : "séries"} · ${vol.toLocaleString("pt-BR")} kg`,
    sets: stats.sets,
    kg: vol,
    min: stats.minutes,
    pagos: 2,
    cheers: ["marina", "huan"],
    comments: [],
    image: "/feed/supino.jpg",
    video: null,
    hoursAgo: 0,
    place: "",
    groupId,
  };
}

function bumpWar(war: War, personId: string, joined: string[]): War {
  const side = warSide(war, joined);
  if (!side) return war;
  return {
    ...war,
    homeScore: war.homeScore + (side === "home" ? 1 : 0),
    awayScore: war.awayScore + (side === "away" ? 1 : 0),
    contributions: {
      ...war.contributions,
      [personId]: (war.contributions[personId] ?? 0) + 1,
    },
  };
}

function bumpLadder(week: { personId: string; sessions: number }[], personId: string) {
  const next = week.map((r) => (r.personId === personId ? { ...r, sessions: r.sessions + 1 } : r));
  if (!next.some((r) => r.personId === personId)) next.push({ personId, sessions: 1 });
  return next.sort((a, b) => b.sessions - a.sessions);
}

function bumpGroupSessions(groups: Group[], joinedIds: string[]) {
  return groups.map((g) => (joinedIds.includes(g.id) ? { ...g, weekSessions: g.weekSessions + 1 } : g));
}

function bumpChallenges(challenges: Challenge[], groupIds: string[]) {
  return challenges.map((c) =>
    groupIds.includes(c.groupId) ? { ...c, doneSessions: Math.min(c.goalSessions, c.doneSessions + 1) } : c,
  );
}

function advanceDeck(activeDeckId: string | null, cursor: Record<string, number>, decks: Deck[]) {
  if (!activeDeckId) return { deckCursor: cursor, activeDeckId: null as string | null };
  const deck = decks.find((d) => d.id === activeDeckId);
  const n = deck?.fichaIds.length ?? 0;
  const cur = cursor[activeDeckId] ?? 0;
  return {
    deckCursor: { ...cursor, [activeDeckId]: n ? (cur + 1) % n : 0 },
    activeDeckId: null as string | null,
  };
}

function trailOf(trail: Overlay[] | undefined): Overlay[] {
  return trail ?? [];
}

function pushed(cur: Overlay, trail: Overlay[] | undefined, next: Overlay): Overlay[] {
  const stack = trailOf(trail);
  if (!cur || cur === next) return stack;
  return [...stack, cur];
}

function landed(trail: Overlay[] | undefined, next: Overlay): Overlay[] {
  return trailOf(trail).filter((o) => o !== next);
}

const PATAMAR_STEPS = [25, 50, 75, 100] as const;

function seenFromFicha(personId: string): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  for (const b of fichaOf(personId).barras) {
    out[b.eixo] = PATAMAR_STEPS.filter((s) => b.barra >= s);
  }
  return out;
}

function seedBars(): Record<string, number> {
  return Object.fromEntries(fichaOf(YOU_ID).barras.map((b) => [b.eixo, b.barra]));
}

function writeBars(
  live: Record<string, number> | undefined,
  logged: LoggedSet[],
  items: Session["items"],
) {
  const ficha = fichaOf(YOU_ID);
  const next: Record<string, { barra: number; rotulo: string; nome: string }> = {};
  for (const b of ficha.barras) {
    next[b.eixo] = { barra: live?.[b.eixo] ?? b.barra, rotulo: b.rotulo, nome: b.nome };
  }
  let prs = 0;
  for (const s of logged) {
    const ex = items.find((i) => i.id === s.exerciseId);
    if (ex?.last_kg != null && s.load_kg > ex.last_kg) prs += 1;
  }
  if (prs && next.carga) {
    const barra = Math.min(100, next.carga.barra + prs * 3);
    next.carga = {
      ...next.carga,
      barra,
      rotulo: barra >= 100 ? `${barra}` : next.carga.rotulo,
    };
  }
  return next;
}

function firstPatamar(
  seen: Record<string, number[]>,
  next: Record<string, { barra: number; rotulo: string; nome: string }>,
): LastProof["patamar"] {
  for (const [eixo, row] of Object.entries(next)) {
    const had = seen[eixo] ?? [];
    const step = PATAMAR_STEPS.find((s) => row.barra >= s && !had.includes(s));
    if (step == null) continue;
    return {
      eixo: row.nome,
      sub: row.rotulo.replace(/\s.*$/, "") || String(step),
      unidade: `${row.nome} · ${step}`,
      frase: `${row.nome}. ${row.rotulo}.`,
      barra: step,
    };
  }
  return null;
}

function closeSession(
  session: Session,
  logged: LoggedSet[],
  ofensiva: number,
  groupId: string | undefined,
  lastLoads: LastLoads,
  loadBook: LoadBook,
  seen: Record<string, number[]>,
  liveBars?: Record<string, number>,
) {
  const s = { ...session, logged };
  const stats = proofFrom(s);
  const feed = toFeed(s, stats, groupId);
  const ficha = fichaOf(YOU_ID);
  const nextBars = writeBars(liveBars, logged, session.items);
  const patamar = firstPatamar(seen, nextBars);
  const nextSeen = { ...seen };
  if (patamar) {
    const eixo = ficha.barras.find((b) => b.nome === patamar.eixo)?.eixo;
    if (eixo) nextSeen[eixo] = [...(nextSeen[eixo] ?? []), patamar.barra];
  }
  const barras = Object.fromEntries(Object.entries(nextBars).map(([k, v]) => [k, v.barra]));
  const lastSet = logged[logged.length - 1];
  const leadEx = lastSet ? session.items.find((i) => i.id === lastSet.exerciseId) : undefined;
  return {
    lastProof: {
      id: feed.id,
      title: session.name,
      place: "",
      caption: feed.caption,
      ...stats,
      ofensiva: ofensiva + 1,
      image: feed.image ?? "/feed/supino.jpg",
      lead: leadEx?.name ?? session.name,
      mode: patamar ? ("patamar" as const) : ("recibo" as const),
      patamar,
    },
    proofs: (prev: Proof[]) => [feed, ...prev],
    ofensiva: ofensiva + 1,
    cumprido: true,
    overlay: (patamar ? "feito" : null) as Overlay,
    session: null,
    lastLoads: bumpLastLoads(lastLoads, logged),
    loadBook: bumpLoadBook(loadBook, logged),
    patamarSeen: nextSeen,
    barras,
  };
}

const initial = {
  tab: "hoje" as TabId,
  overlay: null as Overlay,
  overlayTrail: [] as Overlay[],
  redeBoard: "feed" as RedeBoard,
  fichaSheet: "hoje" as FichaSheet,
  name: YOU.name,
      avatarColor: "var(--color-stamp)",
  ofensiva: 4,
  protector: true,
  protectorUsed: false,
  cumprido: false,
  pagoMensal: false,
  session: null as Session | null,
  lastProof: null as LastProof | null,
  comoId: null as string | null,
  proofs: PROOFS,
  duels: DUELS,
  taPagoGiven: [] as string[],
  joinedBoras: [] as string[],
  selectedProofId: null as string | null,
  selectedPersonId: null as string | null,
  selectedGroupId: null as string | null,
  selectedBoraId: null as string | null,
  groups: GROUPS,
  challenges: CHALLENGES,
  joinedGroupIds: ["c-ferro"],
  livrePicked: ["ex-supino", "ex-remada", "ex-desenvolvimento"],
  lastLoads: {} as LastLoads,
  loadBook: seedBook(),
  war: WAR,
  arenaLadder: ARENA_LADDER,
  raid: RAID,
  youRaids: 1,
  pinnedIds: ["marina", "huan"],
  fichas: FICHAS_TREINO,
  decks: DECKS,
  selectedFichaId: null as string | null,
  selectedDeckId: "d-bum" as string | null,
  offer: null as { kind: OfferKind; id: string } | null,
  deckCursor: {} as Record<string, number>,
  activeDeckId: null as string | null,
  patamarSeen: seenFromFicha(YOU_ID),
  barras: seedBars(),
};

export const useLink = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...initial,
      setHydrated: () => set({ hydrated: true }),
      setTab: (tab) => set({ tab, overlay: null, overlayTrail: [] }),
      setRedeBoard: (redeBoard) => set({ redeBoard }),
      setFichaSheet: (fichaSheet) => set({ fichaSheet }),
      openOverlay: (overlay) => {
        if (overlay === null) {
          set({ overlay: null, overlayTrail: [] });
          return;
        }
        const s = get();
        set({ overlay, overlayTrail: pushed(s.overlay, s.overlayTrail, overlay) });
      },
      closeOverlay: () => {
        const trail = trailOf(get().overlayTrail);
        set({ overlay: trail[trail.length - 1] ?? null, overlayTrail: trail.slice(0, -1) });
      },
      startSession: (kind = "ficha", items, name) => {
        const { session, cumprido } = get();
        if (cumprido) return;
        if (session) {
          set({ overlay: "serie", overlayTrail: [] });
          return;
        }
        const last = get().lastLoads;
        const pack = items?.length
          ? { name: name ?? (kind === "livre" ? "Treino livre" : "Ficha"), items: applyLast(items, last) }
          : kind === "ultima"
            ? { name: LAST_WORKOUT.name, items: applyLast(LAST_WORKOUT.items, last) }
            : { name: PRESCRIPTION.name, items: applyLast(PRESCRIPTION.items, last) };
        set({ session: emptySession(kind, pack.items, pack.name), overlay: "serie", overlayTrail: [] });
      },
      resumeSession: () => {
        if (!get().session) return;
        set({ overlay: "serie", overlayTrail: [] });
      },
      abandonSession: () => set({ session: null, overlay: null, overlayTrail: [] }),
      bumpKg: (d) => {
        const s = get().session;
        if (!s) return;
        const kg = Math.max(0, Math.round((s.kg + d) * 2) / 2);
        set({ session: { ...s, kg } });
      },
      bumpReps: (d) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, reps: Math.max(1, s.reps + d) } });
      },
      logSet: () => {
        const s = get().session;
        if (!s) return;
        const ex = s.items[s.itemIndex]!;
        const logged: LoggedSet[] = [
          ...s.logged.filter((x) => !(x.exerciseId === ex.id && x.setIndex === s.setIndex)),
          { exerciseId: ex.id, setIndex: s.setIndex, load_kg: s.kg, reps: s.reps },
        ];
        if (nextCursor(s.items, s.itemIndex, s.setIndex) === "done") {
          const st = get();
          const closed = closeSession(
            s,
            logged,
            st.ofensiva,
            proofGroupId(st.joinedGroupIds, st.war),
            st.lastLoads,
            st.loadBook,
            { ...seenFromFicha(YOU_ID), ...st.patamarSeen },
            st.barras ?? seedBars(),
          );
          set({
            lastProof: closed.lastProof,
            proofs: closed.proofs(st.proofs),
            ofensiva: closed.ofensiva,
            cumprido: true,
            overlay: closed.overlay,
            overlayTrail: [],
            tab: closed.overlay ? st.tab : "hoje",
            session: null,
            lastLoads: closed.lastLoads,
            loadBook: closed.loadBook,
            patamarSeen: closed.patamarSeen,
            barras: closed.barras,
            war: bumpWar(st.war, YOU_ID, st.joinedGroupIds),
            arenaLadder: bumpLadder(st.arenaLadder, YOU_ID),
            groups: bumpGroupSessions(st.groups, st.joinedGroupIds),
            challenges: bumpChallenges(st.challenges, st.joinedGroupIds),
          });
          return;
        }
        set({
          session: {
            ...s,
            logged,
            restLeft: ex.rest_seconds,
            lastLogged: { kg: s.kg, reps: s.reps },
          },
          overlay: "descanso",
        });
      },
      skipRest: () => {
        const s = get().session;
        if (!s) return;
        const nxt = nextCursor(s.items, s.itemIndex, s.setIndex);
        if (nxt === "done") return;
        const load = loadFor(s.items, nxt.itemIndex, s.logged);
        set({
          session: { ...s, ...nxt, ...load, restLeft: 0 },
          overlay: "serie",
        });
      },
      tickRest: () => {
        const s = get().session;
        if (!s || s.restLeft <= 0) return;
        set({ session: { ...s, restLeft: s.restLeft - 1 } });
      },
      setEffortAndAdvance: (effort) => {
        const s = get().session;
        if (!s) return;
        const last = s.logged[s.logged.length - 1];
        const logged = last
          ? s.logged.map((x, i) => (i === s.logged.length - 1 ? { ...x, effort } : x))
          : s.logged;
        const nxt = nextCursor(s.items, s.itemIndex, s.setIndex);
        if (nxt === "done") {
          if (!logged.length) return;
          const st = get();
          const closed = closeSession(
            s,
            logged,
            st.ofensiva,
            proofGroupId(st.joinedGroupIds, st.war),
            st.lastLoads,
            st.loadBook,
            { ...seenFromFicha(YOU_ID), ...st.patamarSeen },
            st.barras ?? seedBars(),
          );
          set({
            lastProof: closed.lastProof,
            proofs: closed.proofs(st.proofs),
            ofensiva: closed.ofensiva,
            cumprido: true,
            overlay: closed.overlay,
            overlayTrail: [],
            tab: closed.overlay ? st.tab : "hoje",
            session: null,
            lastLoads: closed.lastLoads,
            loadBook: closed.loadBook,
            patamarSeen: closed.patamarSeen,
            barras: closed.barras,
            war: bumpWar(st.war, YOU_ID, st.joinedGroupIds),
            arenaLadder: bumpLadder(st.arenaLadder, YOU_ID),
            groups: bumpGroupSessions(st.groups, st.joinedGroupIds),
            challenges: bumpChallenges(st.challenges, st.joinedGroupIds),
            ...advanceDeck(st.activeDeckId, st.deckCursor, st.decks),
          });
          return;
        }
        const load = loadFor(s.items, nxt.itemIndex, logged);
        set({
          session: { ...s, logged, ...nxt, ...load, restLeft: 0 },
          overlay: "serie",
        });
      },
      finishNow: (effort) => {
        const s = get().session;
        if (!s) return;
        const last = s.logged[s.logged.length - 1];
        const logged = last
          ? s.logged.map((x, i) => (i === s.logged.length - 1 ? { ...x, effort } : x))
          : s.logged;
        if (!logged.length) return;
        const st = get();
        const closed = closeSession(
          s,
          logged,
          st.ofensiva,
          proofGroupId(st.joinedGroupIds, st.war),
          st.lastLoads,
          st.loadBook,
          { ...seenFromFicha(YOU_ID), ...st.patamarSeen },
          st.barras ?? seedBars(),
        );
        set({
          lastProof: closed.lastProof,
          proofs: closed.proofs(st.proofs),
          ofensiva: closed.ofensiva,
          cumprido: true,
          overlay: closed.overlay,
          overlayTrail: [],
          tab: closed.overlay ? st.tab : "hoje",
          session: null,
          lastLoads: closed.lastLoads,
          loadBook: closed.loadBook,
          patamarSeen: closed.patamarSeen,
          barras: closed.barras,
          war: bumpWar(st.war, YOU_ID, st.joinedGroupIds),
          arenaLadder: bumpLadder(st.arenaLadder, YOU_ID),
          groups: bumpGroupSessions(st.groups, st.joinedGroupIds),
          challenges: bumpChallenges(st.challenges, st.joinedGroupIds),
          ...advanceDeck(st.activeDeckId, st.deckCursor, st.decks),
        });
      },
      closeFeito: () => set({ overlay: null, overlayTrail: [], tab: "hoje", session: null }),
      goRede: () => {
        set({
          overlay: null,
          overlayTrail: [],
          tab: "rede",
          session: null,
          redeBoard: "feed",
        });
      },
      openComo: (id) => {
        const s = get();
        set({ comoId: id, overlay: "como", overlayTrail: pushed(s.overlay, s.overlayTrail, "como") });
      },
      openProof: (id) => {
        const s = get();
        set({ selectedProofId: id, overlay: "prova", overlayTrail: pushed(s.overlay, s.overlayTrail, "prova") });
      },
      openPerson: (id) => {
        const s = get();
        set({ selectedPersonId: id, overlay: "pessoa", overlayTrail: pushed(s.overlay, s.overlayTrail, "pessoa") });
      },
      openGroup: (id) => {
        const s = get();
        set({ selectedGroupId: id, overlay: "grupo", overlayTrail: pushed(s.overlay, s.overlayTrail, "grupo") });
      },
      openBora: (id) => {
        const s = get();
        set({ selectedBoraId: id, overlay: "bora", overlayTrail: pushed(s.overlay, s.overlayTrail, "bora") });
      },
      givePago: (id) => {
        const { taPagoGiven, proofs } = get();
        const proof = proofs.find((p) => p.id === id);
        if (!proof || proof.personId === YOU_ID || taPagoGiven.includes(id) || (proof.cheers ?? []).includes(YOU_ID)) {
          return;
        }
        set({
          taPagoGiven: [...taPagoGiven, id],
          proofs: proofs.map((p) =>
            p.id === id
              ? { ...p, pagos: p.pagos + 1, cheers: [...(p.cheers ?? []), YOU_ID] }
              : p,
          ),
        });
      },
      speakOnProof: (id, text) => {
        const line = text.trim().slice(0, 180);
        if (!line) return;
        const { proofs } = get();
        const proof = proofs.find((p) => p.id === id);
        if (!proof) return;
        set({
          proofs: proofs.map((p) =>
            p.id === id
              ? {
                  ...p,
                  comments: [...p.comments, { id: `fala-${Date.now()}`, personId: YOU_ID, text: line, hoursAgo: 0 }],
                }
              : p,
          ),
        });
      },
      composePost: (kind, caption, image) => {
        const line = caption.trim().slice(0, 280);
        if (kind === "texto" && !line) return;
        if ((kind === "foto" || kind === "video") && !image) return;
        const st = get();
        const post: Proof = {
          id: `me-post-${Date.now()}`,
          personId: YOU_ID,
          kind,
          title: kind === "video" ? "Vídeo" : "",
          line: "",
          caption: line,
          volume: "",
          pagos: 0,
          cheers: [],
          comments: [],
          image: kind === "texto" ? null : image ?? null,
          video: kind === "video" ? "/feed/fran.mp4" : null,
          hoursAgo: 0,
          place: "",
          groupId: st.joinedGroupIds[0],
        };
        set({
          proofs: [post, ...st.proofs],
          overlay: null,
          overlayTrail: [],
          tab: "rede",
          redeBoard: "feed",
        });
      },
      challengePost: (postId) => {
        const st = get();
        const proof = st.proofs.find((p) => p.id === postId);
        if (!proof || proof.personId === YOU_ID) return;
        if (st.duels.some((d) => duelOpen(d) && d.postId === postId && d.fromId === YOU_ID)) return;
        const mark = proof.title || proof.caption.slice(0, 40) || "esta marca";
        const other = proof.personId;
        set({
          duels: [
            { id: `duel-${Date.now()}`, fromId: YOU_ID, toId: other, mark, postId, estado: "convite" },
            ...st.duels,
          ],
          selectedProofId: postId,
          overlay: "prova",
          overlayTrail: pushed(st.overlay, st.overlayTrail, "prova"),
          tab: "rede",
          redeBoard: "feed",
        });
      },
      togglePin: (id) => {
        if (id === YOU_ID) return;
        const { pinnedIds } = get();
        set({
          pinnedIds: pinnedIds.includes(id) ? pinnedIds.filter((x) => x !== id) : [id, ...pinnedIds],
        });
      },
      acceptDuel: (id) => {
        const st = get();
        const duel = st.duels.find((d) => d.id === id);
        if (!duel || duel.toId !== YOU_ID || !duelOpen(duel)) return;
        const object = duel.object;
        set({
          duels: st.duels.map((d) => (d.id === id ? { ...d, estado: "aceito" } : d)),
          selectedProofId: duel.postId,
          selectedDeckId: object?.kind === "deck" ? object.id : st.selectedDeckId,
          selectedFichaId: object?.kind === "ficha" ? object.id : st.selectedFichaId,
          overlay: "prova",
          overlayTrail: pushed(st.overlay, st.overlayTrail, "prova"),
          tab: "rede",
          redeBoard: "feed",
        });
      },
      setProofCaption: (text) => {
        const line = text.trim().slice(0, 180);
        const last = get().lastProof;
        if (!last) return;
        set({
          lastProof: { ...last, caption: line },
          proofs: get().proofs.map((p) => (p.id === last.id ? { ...p, caption: line } : p)),
        });
      },
      joinBora: (id) => {
        const { joinedBoras } = get();
        if (joinedBoras.includes(id)) return;
        set({ joinedBoras: [...joinedBoras, id] });
      },
      leaveBora: (id) => set({ joinedBoras: get().joinedBoras.filter((x) => x !== id) }),
      setName: (name) => set({ name }),
      setAvatarColor: (c) => set({ avatarColor: c }),
      markPago: () => set({ pagoMensal: true }),
      useProtector: () => {
        if (!get().protector || get().protectorUsed) return;
        set({ protector: false, protectorUsed: true, ofensiva: get().ofensiva });
      },
      toggleLivre: (id) => {
        const picked = get().livrePicked;
        set({
          livrePicked: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id],
        });
      },
      startLivre: () => {
        const items = CATALOG.filter((e) => get().livrePicked.includes(e.id)).map((i) => ({ ...i }));
        if (!items.length) return;
        get().startSession("livre", items, "Treino livre");
      },
      joinGroup: (id) => {
        const { joinedGroupIds, groups } = get();
        if (joinedGroupIds.includes(id)) return;
        const g = groups.find((x) => x.id === id);
        if (!g || g.memberIds.length >= g.cap) return;
        set({
          joinedGroupIds: [...joinedGroupIds, id],
          groups: groups.map((x) =>
            x.id === id ? { ...x, memberIds: [...x.memberIds, YOU_ID] } : x,
          ),
        });
      },
      enterOpenGroup: (id) => {
        const g = get().groups.find((x) => x.id === id);
        if (!g || !hasRoom(g)) return;
        get().joinGroup(id);
        get().openGroup(id);
      },
      leaveGroup: (id) => {
        const st = get();
        const inWar = id === st.war.homeId || id === st.war.awayId;
        set({
          joinedGroupIds: st.joinedGroupIds.filter((x) => x !== id),
          groups: st.groups.map((x) =>
            x.id === id ? { ...x, memberIds: x.memberIds.filter((m) => m !== YOU_ID) } : x,
          ),
          war: inWar
            ? { ...st.war, contributions: { ...st.war.contributions, [YOU_ID]: 0 } }
            : st.war,
        });
      },
      createGroup: (name, kind, about) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = `c-${Date.now()}`;
        const group: Group = {
          id,
          name: trimmed,
          kind,
          about: about.trim(),
          cap: 20,
          memberIds: [YOU_ID],
          weekSessions: 0,
          raids: 0,
        };
        set({
          groups: [...get().groups, group],
          joinedGroupIds: [...get().joinedGroupIds, id],
          selectedGroupId: id,
          overlay: "grupo",
          overlayTrail: landed(get().overlayTrail, "grupo"),
        });
      },
      createChallenge: (days, goal) => {
        const gid = get().selectedGroupId;
        if (!gid) return;
        const ch: Challenge = {
          id: `ch-${Date.now()}`,
          groupId: gid,
          title: `${goal} sessões em ${days} dias`,
          days,
          goalSessions: goal,
          doneSessions: 0,
          ends: days === 7 ? "domingo" : "20 set",
        };
        set({
          challenges: [ch, ...get().challenges],
          overlay: "grupo",
          overlayTrail: landed(get().overlayTrail, "grupo"),
        });
      },
      claimRaid: () => {
        const st = get();
        if (!st.cumprido || st.raid.claimed.includes(YOU_ID)) return;
        set({
          raid: { ...st.raid, claimed: [...st.raid.claimed, YOU_ID] },
          youRaids: st.youRaids + 1,
          groups: st.groups.map((g) =>
            st.joinedGroupIds.includes(g.id) ? { ...g, raids: (g.raids ?? 0) + 1 } : g,
          ),
        });
      },
      boraZap: (id) => {
        const s = get();
        set({
          joinedBoras: s.joinedBoras.includes(id) ? s.joinedBoras : [...s.joinedBoras, id],
          selectedBoraId: id,
          overlay: "zap",
          overlayTrail: pushed(s.overlay, s.overlayTrail, "zap"),
        });
      },
      selectDeck: (id) => set({ selectedDeckId: id, selectedFichaId: null }),
      selectFicha: (id) => set({ selectedFichaId: id }),
      createFicha: (name, itemIds) => {
        const trimmed = name.trim().slice(0, 32);
        const items = CATALOG.filter((e) => itemIds.includes(e.id)).map((i) => ({ ...i }));
        if (!trimmed || !items.length) return;
        const id = `f-${Date.now()}`;
        const ficha: FichaTreino = {
          id,
          name: trimmed,
          minutes: Math.max(20, items.length * 14),
          items,
          ownerId: YOU_ID,
        };
        const st = get();
        set({
          fichas: [...st.fichas, ficha],
          selectedFichaId: id,
          overlay: null,
          overlayTrail: [],
          tab: "ficha",
          fichaSheet: "decks",
        });
      },
      createDeck: (name, about, fichaIds) => {
        const trimmed = name.trim().slice(0, 32);
        const ids = fichaIds.filter((id) => get().fichas.some((f) => f.id === id));
        if (!trimmed || !ids.length) return;
        const id = `d-${Date.now()}`;
        const deck: Deck = {
          id,
          name: trimmed,
          about: about.trim().slice(0, 120) || "Pilha de fichas.",
          fichaIds: ids,
          ownerId: YOU_ID,
        };
        const st = get();
        set({
          decks: [...st.decks, deck],
          selectedDeckId: id,
          selectedFichaId: null,
          overlay: null,
          overlayTrail: [],
          tab: "ficha",
          fichaSheet: "decks",
        });
      },
      startFicha: (id) => {
        const ficha = fichaTreinoOf(id, get().fichas);
        if (!ficha) return;
        set({ activeDeckId: null, selectedFichaId: id });
        get().startSession("deck", ficha.items, ficha.name);
      },
      startDeck: (id) => {
        const st = get();
        const deck = deckOf(id, st.decks);
        if (!deck) return;
        const cur = st.deckCursor[id] ?? 0;
        const ficha = fichaAt(deck, cur, st.fichas);
        if (!ficha) return;
        set({ activeDeckId: id, selectedDeckId: id, selectedFichaId: ficha.id });
        get().startSession("deck", ficha.items, `${deck.name} · ${ficha.name}`);
      },
      openOffer: (kind, id) => {
        const s = get();
        set({
          offer: { kind, id },
          overlay: "oferecer",
          overlayTrail: pushed(s.overlay, s.overlayTrail, "oferecer"),
        });
      },
      offerDuel: (toId) => {
        const st = get();
        if (!st.offer || toId === YOU_ID) return;
        const mineOpen = st.duels.filter((d) => !d.veredito && d.fromId === YOU_ID).length;
        if (mineOpen >= 2) return;
        if (st.duels.some((d) => duelOpen(d) && d.fromId === YOU_ID && d.toId === toId)) return;
        const obj =
          st.offer.kind === "deck"
            ? deckOf(st.offer.id, st.decks)
            : fichaTreinoOf(st.offer.id, st.fichas);
        if (!obj) return;
        const postId = `p-offer-${Date.now()}`;
        const about = "items" in obj ? `${obj.items.length} exercícios` : obj.about;
        const post: Proof = {
          id: postId,
          personId: YOU_ID,
          kind: "feito",
          title: obj.name,
          line: st.offer.kind === "deck" ? "Deck" : "Ficha",
          caption: about,
          volume: "items" in obj ? `${obj.items.length} exercícios` : deckLine(obj, st.fichas),
          pagos: 0,
          cheers: [],
          comments: [],
          image: "/feed/agachamento.jpg",
          video: null,
          hoursAgo: 0,
          place: "",
          groupId: st.joinedGroupIds[0],
        };
        const duel: Duel = {
          id: `duel-${Date.now()}`,
          fromId: YOU_ID,
          toId,
          mark: obj.name,
          postId,
          estado: "convite",
          object: { ...st.offer },
        };
        set({
          proofs: [post, ...st.proofs],
          duels: [duel, ...st.duels],
          selectedProofId: postId,
          overlay: "prova",
          overlayTrail: landed(st.overlayTrail, "prova"),
          tab: "rede",
          redeBoard: "feed",
        });
      },
      reset: () => set({ ...initial }),
    }),
    {
      name: "link-aluno-v29",
      skipHydration: true,
      partialize: (s) => ({
        name: s.name,
        avatarColor: s.avatarColor,
        ofensiva: s.ofensiva,
        protector: s.protector,
        protectorUsed: s.protectorUsed,
        cumprido: s.cumprido,
        pagoMensal: s.pagoMensal,
        session: s.session,
        lastProof: s.lastProof,
        proofs: s.proofs,
        duels: s.duels ?? DUELS,
        taPagoGiven: s.taPagoGiven,
        joinedBoras: s.joinedBoras,
        groups: s.groups,
        challenges: s.challenges,
        joinedGroupIds: s.joinedGroupIds,
        livrePicked: s.livrePicked,
        lastLoads: s.lastLoads ?? {},
        loadBook: s.loadBook ?? seedBook(),
        war: s.war,
        arenaLadder: s.arenaLadder,
        tab: s.tab,
        overlay: s.overlay,
        overlayTrail: s.overlayTrail ?? [],
        redeBoard: s.redeBoard ?? "feed",
        fichaSheet: s.fichaSheet ?? "hoje",
        selectedProofId: s.selectedProofId,
        selectedPersonId: s.selectedPersonId,
        selectedGroupId: s.selectedGroupId,
        selectedBoraId: s.selectedBoraId,
        comoId: s.comoId,
        raid: s.raid ?? RAID,
        youRaids: s.youRaids ?? 1,
        pinnedIds: s.pinnedIds ?? ["marina", "huan"],
        fichas: s.fichas ?? FICHAS_TREINO,
        decks: s.decks ?? DECKS,
        selectedFichaId: s.selectedFichaId ?? null,
        selectedDeckId: s.selectedDeckId ?? "d-bum",
        offer: s.offer ?? null,
        deckCursor: s.deckCursor ?? {},
        activeDeckId: s.activeDeckId ?? null,
        patamarSeen: s.patamarSeen ?? seenFromFicha(YOU_ID),
        barras: s.barras ?? seedBars(),
      }),
    },
  ),
);
