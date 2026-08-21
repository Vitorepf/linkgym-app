export function formatKg(n: number): string {
  const x = Math.round(n * 2) / 2;
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(1).replace(".", ",");
}

export function formatNum(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function weekdayLong(d = new Date()): string {
  return ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][d.getDay()];
}

export function weekdayShort(d = new Date()): string {
  return ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"][d.getDay()];
}

export function dateShort(d = new Date()): string {
  return `${d.getDate()} ${["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][d.getMonth()]}`;
}

export function clockShort(d = new Date()): string {
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function plannedSets(items: { planned_sets: number }[]): number {
  return items.reduce((sum, it) => sum + it.planned_sets, 0);
}

export function cueLines(text: string): string[] {
  return text
    .split(/\.\s+/)
    .map((line) => line.replace(/\.$/, "").trim())
    .filter(Boolean);
}

export function ago(hours: number): string {
  if (hours <= 0) return "agora";
  if (hours < 24) return `há ${hours}h`;
  const d = Math.round(hours / 24);
  return d === 1 ? "ontem" : `há ${d} dias`;
}

export function agoTs(ts: number, now = Date.now()): string {
  return ago(Math.max(0, (now - ts) / 3_600_000));
}
