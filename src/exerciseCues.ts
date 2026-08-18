export type ExerciseCues = {
  cues: [string, string, string];
  error: string;
};

const EMPTY: ExerciseCues = { cues: ["", "", ""], error: "" };

const BY_NAME: Record<string, ExerciseCues> = {
  Supino: {
    cues: ["Escápula", "pé no chão", "barra no meio do peito"],
    error: "Quicar no peito",
  },
  Remada: {
    cues: ["Tronco firme", "cotovelo raspa o tronco", ""],
    error: "Puxar com o trapézio",
  },
  Agachamento: {
    cues: ["Joelho na linha do pé", "profundidade que o quadril aguenta", ""],
    error: "Joelho caindo para dentro",
  },
};

export function cuesFor(name: string): ExerciseCues {
  return BY_NAME[name] ?? EMPTY;
}
