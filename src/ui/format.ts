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

export function formatKg(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace(".", ",");
}

export function formatXp(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function plannedSets(items: { planned_sets: number }[]): number {
  return items.reduce((sum, it) => sum + it.planned_sets, 0);
}
