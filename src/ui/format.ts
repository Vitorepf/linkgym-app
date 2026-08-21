export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function weekdayLong(d = new Date()): string {
  return [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ][d.getDay()];
}

export function weekdayShort(d = new Date()): string {
  return ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"][d.getDay()];
}

export function dateShort(d = new Date()): string {
  return `${d.getDate()} ${["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][d.getMonth()]}`;
}

/** Data com ano. Serve validade de convite: "quatro anos" cravado mentia o `expires_at`. */
export function dateLong(d: Date): string {
  if (Number.isNaN(d.getTime())) return "";
  return `${dateShort(d)} ${d.getFullYear()}`;
}

/** O quilo do app, num lugar só. A grade de carga anda de meio em meio (ver `stepKg`),
 *  então o formato ANCORA nela: arredonda no meio quilo e escreve em português. Eram dois
 *  formatKg com semânticas diferentes — este e um em offline/sessionQueue — e a Serie
 *  importava o outro e traduzia o ponto na mão. */
export function formatKg(n: number): string {
  const x = Math.round(n * 2) / 2;
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(1).replace(".", ",");
}

/** Inteiro com separador de milhar em português. Serve XP, volume de sessão e qualquer
 *  número grande da tela — chamava-se `formatXp` e não tinha nada de XP. */
export function formatNum(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function plannedSets(items: { planned_sets: number }[]): number {
  return items.reduce((sum, it) => sum + it.planned_sets, 0);
}
