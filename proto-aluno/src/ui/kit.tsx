import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Primitivas. Nenhuma tela remonta superfície, linha ou alvo de dedo à mão.
   Se um bloco precisa de borda, ele é um Band ou um Card, nunca um div com
   border-t solto.
--------------------------------------------------------------------------- */

const PAD = "px-5";

/** Faixa de largura total. O vão separa; régua é opt-in. */
export function Band({
  children,
  className,
  hair = false,
  flush,
  onPress,
  label,
}: {
  children: ReactNode;
  className?: string;
  hair?: boolean;
  flush?: boolean;
  onPress?: () => void;
  label?: string;
}) {
  const cls = cn(
    "w-full text-left",
    hair && "border-t border-line",
    !flush && cn(PAD, "py-5"),
    className,
  );
  if (onPress) {
    return (
      <button type="button" onClick={onPress} aria-label={label} className={cn(cls, "press min-h-[44px]")}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}

/** Objeto com quina. Usar quando o bloco é uma coisa, não uma seção. */
export function Card({
  children,
  className,
  onPress,
  tone = "surface",
  label,
}: {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  tone?: "surface" | "raised" | "outline" | "stamp";
  label?: string;
}) {
  const held = Boolean(onPress) || tone === "raised";
  const cls = cn(
    "block w-full overflow-hidden text-left",
    held && "plate",
    tone === "outline" && "rounded-xl border border-edge",
    tone === "stamp" && "rounded-xl bg-raised",
    className,
  );
  if (onPress) {
    return (
      <button type="button" onClick={onPress} aria-label={label} className={cn(cls, "press min-h-[44px]")}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}

/** Rótulo de seção. Opcionalmente com uma ação à direita, nunca duas. */
export function SectionHead({
  children,
  action,
  onAction,
  className,
}: {
  children: ReactNode;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <p className="t-kicker">{children}</p>
      {action && onAction ? (
        <button type="button" onClick={onAction} className="press -mx-1 min-h-[44px] rounded-xs px-1 t-small text-mute">
          {action}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Linha de lista. Altura mínima de 56 para o dedo, título e apoio na mesma
 * coluna óptica, valor à direita sempre tabular para a coluna não dançar.
 */
export function Row({
  title,
  sub,
  value,
  valueSub,
  leading,
  onPress,
  last,
  dim,
}: {
  title: ReactNode;
  sub?: ReactNode;
  value?: ReactNode;
  valueSub?: ReactNode;
  leading?: ReactNode;
  onPress?: () => void;
  last?: boolean;
  dim?: boolean;
}) {
  const body = (
    <>
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="min-w-0 flex-1">
        <span className={cn("t-body block truncate", dim && "text-mute")}>{title}</span>
        {sub ? <span className="t-small mt-0.5 block truncate">{sub}</span> : null}
      </span>
      {value != null ? (
        <span className="shrink-0 text-right">
          <span className="t-body block tabular-nums">{value}</span>
          {valueSub ? <span className="t-small block tabular-nums">{valueSub}</span> : null}
        </span>
      ) : null}
    </>
  );
  const cls = cn("flex min-h-[56px] w-full items-center gap-3 py-2.5 text-left", !last && "mt-1");
  if (!onPress) return <div className={cls}>{body}</div>;
  return (
    <button type="button" onClick={onPress} className={cn(cls, "press -mx-2 rounded-sm px-2")}>
      {body}
    </button>
  );
}

/**
 * Selo de estado. Três portadores em todos: preenchimento, palavra e glifo.
 * Nenhum estado depende só de matiz, então a captura em escala de cinza
 * continua distinguível.
 *
 * `done` NÃO leva preenchimento de tinta. No claro, faixa clara sob item
 * concluído é rebaixamento; no escuro, tudo mais claro que o fundo é
 * promoção, e o item feito viraria a coisa mais brilhante da tela. Feito é
 * vazado e recuado, nunca cheio.
 */
export function Chip({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "live" | "done" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-xs px-2 t-mono",
        tone === "quiet" && "bg-raised text-mute",
        tone === "live" && "text-stamp-hi",
        tone === "done" && "bg-fill text-faint",
        tone === "outline" && "border border-edge text-mute",
      )}
    >
      {tone === "live" ? <span className="anim-breathe size-1.5 rounded-full bg-stamp-hi" /> : null}
      {tone === "done" ? <span aria-hidden>✓</span> : null}
      {tone === "quiet" ? <span aria-hidden className="size-1 rounded-full bg-mute" /> : null}
      {tone === "outline" ? <span aria-hidden className="size-1 rounded-full border border-edge" /> : null}
      {children}
    </span>
  );
}

/** Número com rótulo. O algarismo é o assunto, a unidade acompanha. */
export function Stat({
  k,
  v,
  unit,
  size = "md",
  dim,
}: {
  k: string;
  v: ReactNode;
  unit?: string;
  size?: "md" | "lg";
  dim?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="t-kicker">{k}</p>
      <p
        className={cn(
          "mt-1 flex items-baseline gap-1 tabular-nums",
          size === "lg" ? "t-display" : "t-title",
          dim && "text-mute",
        )}
      >
        {v}
        {unit ? <span className={cn("font-semibold", size === "lg" ? "t-body" : "t-small")}>{unit}</span> : null}
      </p>
    </div>
  );
}

/**
 * Algarismo que troca por substituição, não por corte seco. O eixo da
 * informação viva exige que o valor anterior saia por cima e o novo entre
 * por baixo, na mesma coluna tabular.
 */
export function Roll({
  value,
  was,
  className,
}: {
  value: string | number;
  was?: string | number;
  className?: string;
}) {
  const ghost = was != null && String(was) !== String(value);
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      <span className="relative inline-block overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={String(value)}
            initial={{ y: "0.55em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-0.55em", opacity: 0, position: "absolute" }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      {ghost ? <span className="t-small text-faint line-through">{was}</span> : null}
    </span>
  );
}

/** Entrada em cascata. Só na primeira pintura, nunca a cada rolagem. */
export function Reveal({
  children,
  i = 0,
  className,
}: {
  children: ReactNode;
  i?: number;
  className?: string;
}) {
  return (
    <div className={cn("anim-rise", className)} style={{ animationDelay: `${Math.min(i, 8) * 34}ms` }}>
      {children}
    </div>
  );
}

/**
 * Zona de ação fixa no rodapé. Uma primária, no máximo uma secundária.
 * O conteúdo some por baixo dela em vez de bater nela.
 */
export function ActionBar({ children, hair = false }: { children: ReactNode; hair?: boolean }) {
  return (
    <div
      data-dock
      className={cn(
        "relative shrink-0 bg-bg px-5 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]",
        hair && "border-t border-line",
      )}
    >
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/** Rodapé do objeto: valor à esquerda, ação em 28–42% à direita. */
export function ObjectBar({
  value,
  guarantee,
  action,
  onAction,
}: {
  value: string;
  guarantee?: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div
      data-dock
      className="flex min-h-[76px] shrink-0 items-center justify-between gap-4 bg-bg px-5 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]"
    >
      <div className="min-w-0">
        <p className="t-body truncate">{value}</p>
        {guarantee ? <p className="t-small mt-0.5">{guarantee}</p> : null}
      </div>
      <button type="button" onClick={onAction} className="thumb !w-[38%] max-w-[42%] min-w-[7.5rem]">
        {action}
      </button>
    </div>
  );
}

/**
 * Veredito no slot do Thumb. Cobre o botão, não empurra nada acima, 0 toque.
 * O algarismo é a marca de quem está olhando — nunca a do vencedor.
 */
export function MarkStrip({ mark, line }: { mark: string; line: string }) {
  return (
    <div className="mark-strip anim-fade" role="status">
      <p className="t-title tabular-nums">{mark}</p>
      <p className="t-small min-w-0 truncate">{line}</p>
    </div>
  );
}

/** Barra de rolagem do conteúdo, com folga para a ação não cobrir a última linha. */
export function Scroll({
  children,
  className,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={cn("scroll flex min-h-0 flex-1 flex-col", pad && "pb-6", className)}>{children}</div>
  );
}
