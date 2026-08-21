export type TabId = "hoje" | "ficha" | "rede" | "progresso" | "perfil";
export type RedeBoard = "feed" | "grupos" | "guerra";
export type PostKind = "feito" | "foto" | "video" | "texto";
export type FichaSheet = "hoje" | "ultima" | "decks";

export type Overlay =
  | null
  | "serie"
  | "descanso"
  | "feito"
  | "como"
  | "fichaSessao"
  | "bora"
  | "raid"
  | "prova"
  | "pessoa"
  | "grupo"
  | "guerra"
  | "arena"
  | "duelos"
  | "livre"
  | "desafio"
  | "zap"
  | "criarGrupo"
  | "composer"
  | "escrever"
  | "montar"
  | "oferecer"
  | "versus";

export type Effort = 1 | 2 | 3;
export type SessionKind = "ficha" | "ultima" | "livre" | "deck";

/** Programa de treino nomeado. A aba Ficha. Não é a placa de atributos. */
export type FichaTreino = {
  id: string;
  name: string;
  minutes: number;
  items: Exercise[];
  ownerId: string;
};

/**
 * Pilha nomeada de fichas. Vocabulário Clash (baralho), uma palavra em todo
 * lugar. Seguir o deck entrega um corpo. Ver `docs/deck.md`.
 */
export type Deck = {
  id: string;
  name: string;
  /** O que o corpo ganha se a pessoa seguir. */
  about: string;
  fichaIds: string[];
  ownerId: string;
};

export type OfferKind = "ficha" | "deck";

export type DuelObject = {
  kind: OfferKind;
  id: string;
};

/** Onde a disputa acontece. Setor quando tem gente, cidade quando o setor é deserto. */
export type ArenaScope = "setor" | "cidade";

/** Tipo do clã, escrito por quem criou. Não é filtro fechado, é o que a pessoa procura. */
export type ClanKind =
  | "geral"
  | "powerlifting"
  | "crossfit"
  | "hipertrofia"
  | "corrida"
  | "calistenia"
  | "luta";

export type Exercise = {
  id: string;
  name: string;
  load_kg: number;
  planned_sets: number;
  planned_reps: number;
  rest_seconds: number;
  last_kg: number | null;
  last_reps: number | null;
  notes: string;
};

export type Prescription = {
  id: string;
  name: string;
  minutes: number;
  for_date: string;
  coach_line: string;
  items: Exercise[];
};

export type LoggedSet = {
  exerciseId: string;
  setIndex: number;
  load_kg: number;
  reps: number;
  effort?: Effort;
};

export type Person = {
  id: string;
  name: string;
  initials: string;
  color: string;
  groupIds: string[];
  /** O que a pessoa pratica. Declarado por ela, não é privilégio nem trava nada. */
  sport: ClanKind;
  photo: string;
  /** `faltou` nunca aparece na interface. Só o pareamento lê. */
  duelos: {
    venceu: number;
    empatou: number;
    perdeu: number;
    faltou: number;
  };
};

export type Comment = {
  id: string;
  personId: string;
  text: string;
  hoursAgo: number;
};

export type Proof = {
  id: string;
  personId: string;
  kind: PostKind;
  title: string;
  line: string;
  caption: string;
  volume: string;
  pagos: number;
  cheers: string[];
  comments: Comment[];
  image: string | null;
  video: string | null;
  hoursAgo: number;
  /**
   * Texto livre que a própria pessoa escreveu ao postar: parque, praça, garagem.
   * Nunca vem do sistema. Vazio significa que não há lugar para desenhar.
   */
  place: string;
  groupId?: string;
  sets?: number;
  kg?: number;
  min?: number;
};

/** Subconjunto de `docs/duelo-e-juiz.md` §9. Os estados que faltam entram com a prova. */
export type DuelState =
  | "convite"
  | "aceito"
  | "aguardando"
  | "julgado"
  | "contestado"
  | "expirado"
  | "sem_prova";

export type Veredito = {
  /** null é empate. */
  vencedorId: string | null;
  motivo: "marca" | "empate_tecnico" | "sem_prova";
  fechadoEm: number;
  /** Falso nas primeiras 24 h, enquanto cabe contestação. */
  firme: boolean;
  /** personId para a linha que aquela pessoa lê. Fato antes de elogio, 6 palavras. */
  faixa: Record<string, string>;
};

export type Duel = {
  id: string;
  fromId: string;
  toId: string;
  mark: string;
  postId: string;
  estado: DuelState;
  veredito?: Veredito;
  /** Ficha ou deck que os dois correm. Sem isto, o duelo é só a marca. */
  object?: DuelObject;
};

export type Bora = {
  id: string;
  title: string;
  when: string;
  hour: string;
  address: string;
  hostId: string;
  going: string[];
  capacity: number;
  groupId: string;
};

/**
 * Clã, não turma. Ninguém precisa conhecer ninguém para entrar: tem tipo, tem
 * descrição escrita por quem criou, e tem teto. Havendo vaga, entra quem chegar.
 * Não existe código de convite nem requisito de entrada.
 */
export type Group = {
  id: string;
  name: string;
  kind: ClanKind;
  /** Descrição escrita por quem criou. É o que faz um estranho querer entrar. */
  about: string;
  cap: number;
  memberIds: string[];
  weekSessions: number;
  raids: number;
};

export type Raid = {
  id: string;
  title: string;
  mark: string;
  ends: string;
  claimed: string[];
};

export type War = {
  id: string;
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
  ends: string;
  contributions: Record<string, number>;
};

export type Challenge = {
  id: string;
  groupId: string;
  title: string;
  days: 7 | 30;
  goalSessions: number;
  doneSessions: number;
  ends: string;
};

export type WeekDay = {
  for_date: string;
  label: string;
  sessions: number;
  me: boolean;
};

export type LoadPoint = {
  date: string;
  kg: number;
};
