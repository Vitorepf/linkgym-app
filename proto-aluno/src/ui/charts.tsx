import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { WeekDay } from "@/lib/types";

/* ---------------------------------------------------------------------------
   Gráficos do caderno. Largura e altura vêm do dado, cor vem de token, e um
   só degrau de tipo por gráfico: quem separa a linha de agora das antigas é a
   luminância. A entrada anima uma vez; nada roda em laço.

   Uma gramática de gráfico para a tela inteira: linha com rótulo à esquerda,
   barra de proporção no meio, número à direita em coluna tabular.
--------------------------------------------------------------------------- */

const ENTER = { duration: 0.36, ease: [0.22, 1, 0.36, 1] } as const;

export type TrailRow = {
  label: string;
  value: number;
  text: string;
};

export function Trail({
  rows,
  base = "tight",
}: {
  rows: TrailRow[];
  /** `zero` para contagem, `tight` para carga: 55 e 62,5 só se distinguem se o piso sobe. */
  base?: "zero" | "tight";
}) {
  if (!rows.length) return null;
  const values = rows.map((r) => r.value);
  const top = Math.max(...values);
  const low = Math.min(...values);
  const floor = base === "zero" ? 0 : low - Math.max(2.5, (top - low) * 0.7);
  const span = Math.max(top - floor, 1);
  const tip = rows.length - 1;

  return (
    <ul className="mt-3">
      {rows.map((r, i) => {
        const now = i === tip;
        const fill = r.value <= floor ? 0 : Math.max(6, Math.round(((r.value - floor) / span) * 100));
        return (
          <li key={`${r.label}-${r.text}`} className="flex h-8 items-center gap-3">
            <span className="t-small w-12 shrink-0 text-faint">{r.label}</span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-xs bg-surface">
              <motion.span
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: "scaleX(1)" }}
                transition={{ ...ENTER, delay: Math.min(i, 8) * 0.05 }}
                style={{ width: `${fill}%`, transformOrigin: "left center" }}
                className={cn("absolute inset-y-0 left-0 block rounded-xs", now ? "bg-ink" : "bg-fill")}
              />
            </span>
            <span
              className={cn(
                "t-small w-12 shrink-0 text-right",
                now && "text-ink",
              )}
            >
              {r.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Presença da semana. Sete células: um degrau de fundo separa o dia treinado
 * do dia vazio, e outro degrau marca hoje. Zero borda, zero tracejado, zero
 * cor. O dia salvo pelo protetor carrega a letra, não uma cor.
 */
/**
 * Radar do corpo. Cada ponta é uma zona inferida do exercício. A malha
 * de dentro é o começo; a de fora é agora. Duas áreas, uma tinta.
 */
export function Web({
  axes,
}: {
  axes: { label: string; first: number; now: number }[];
}) {
  const n = axes.length;
  if (n < 3) return null;
  const size = 236;
  const cx = size / 2;
  const cy = size / 2;
  const r = 78;

  const pt = (i: number, t: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return `${cx + r * t * Math.cos(a)},${cy + r * t * Math.sin(a)}`;
  };
  const ring = (t: number) => axes.map((_, i) => pt(i, t)).join(" ");
  const labelAt = (i: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = cx + (r + 22) * Math.cos(a);
    const y = cy + (r + 22) * Math.sin(a);
    return { x, y };
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size} aria-hidden className="mx-auto block">
      {[1 / 3, 2 / 3, 1].map((t) => (
        <polygon key={t} points={ring(t)} fill="none" stroke="var(--color-line)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt(i, 1).split(",")[0]}
          y2={pt(i, 1).split(",")[1]}
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}
      <motion.polygon
        points={axes.map((_, i) => pt(i, axes[i]!.first)).join(" ")}
        fill="var(--color-fill)"
        fillOpacity="0.28"
        stroke="var(--color-mute)"
        strokeWidth="1.2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={ENTER}
      />
      <motion.polygon
        points={axes.map((_, i) => pt(i, axes[i]!.now)).join(" ")}
        fill="var(--color-ink)"
        fillOpacity="0.1"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...ENTER, delay: 0.08 }}
      />
      {axes.map((ax, i) => {
        const { x, y } = labelAt(i);
        return (
          <text
            key={ax.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-faint)"
            fontSize="11"
            fontWeight="600"
            letterSpacing="0.08em"
            style={{ textTransform: "uppercase" }}
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}

export function WeekDots({ days, frozen }: { days: WeekDay[]; frozen?: string }) {
  return (
    <div className="mt-3 grid grid-cols-7 gap-1.5">
      {days.map((d, i) => {
        const done = d.sessions > 0;
        const held = !done && d.label === frozen;
        return (
          <motion.div
            key={d.for_date}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ENTER, delay: Math.min(i, 8) * 0.03 }}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "flex h-9 w-full items-center justify-center rounded-sm t-kicker text-mute",
                done ? "bg-fill" : d.me ? "bg-raised" : "bg-surface",
              )}
            >
              {held ? "P" : done ? <span className="t-micro text-ink">1</span> : <span className="t-micro text-ghost">0</span>}
            </span>
            <span className="t-kicker">{d.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
