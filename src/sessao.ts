/** Resultado da sessão FECHADA. Sem HTTP: a comemoração chama isto, não o fetch.

  Quando a fila local ainda não subiu, XP e ofensiva ficam como estavam — o único
  número que cresce é um que um corpo levantou. */

export type SessaoFinish = {
  ofensiva: { current_count: number };
  xp_gained: number;
  xp_total: number;
  records: { exercise_name: string; load_kg: number; previous_kg: number }[];
};

export function resultadoDaSessao(
  finish: SessaoFinish | undefined,
  pending: boolean,
  atual: { ofensiva: number; xpTotal: number },
): {
  ofensivaCount: number;
  xpGained: number;
  xpTotal: number;
  records: SessaoFinish["records"];
} {
  if (pending || !finish) {
    return {
      ofensivaCount: atual.ofensiva,
      xpGained: 0,
      xpTotal: atual.xpTotal,
      records: [],
    };
  }
  return {
    ofensivaCount: finish.ofensiva.current_count,
    xpGained: Math.max(0, finish.xp_gained),
    xpTotal: finish.xp_total,
    records: finish.records,
  };
}
