import { useEffect, useState } from "react";
import { Display, Pad, Place, Quiet, Thumb } from "@/components/bits";
import { Dock } from "@/components/shell";
import { nextCursor, useLink } from "@/lib/store";
import { formatKg } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Effort } from "@/lib/types";

const WORDS: { effort: Effort; label: string }[] = [
  { effort: 1, label: "Fácil" },
  { effort: 2, label: "No ponto" },
  { effort: 3, label: "Difícil" },
];

export function Descanso() {
  const session = useLink((s) => s.session);
  const tick = useLink((s) => s.tickRest);
  const skip = useLink((s) => s.skipRest);
  const advance = useLink((s) => s.setEffortAndAdvance);
  const finish = useLink((s) => s.finishNow);
  const [effort, setEffort] = useState<Effort | 0>(0);

  useEffect(() => {
    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  if (!session) return null;
  const item = session.items[session.itemIndex];
  if (!item) return null;
  const last = session.lastLogged;
  const nxt = nextCursor(session.items, session.itemIndex, session.setIndex);
  const ending = nxt === "done";
  const fechaExercicio = ending || (typeof nxt !== "string" && nxt.itemIndex !== session.itemIndex);
  const left = session.restLeft;
  const total = item.rest_seconds || 1;
  const done = Math.min(1, (total - left) / total);
  const ring = 276.46;
  const nextLabel =
    nxt === "done"
      ? undefined
      : nxt.setIndex > 1
        ? `série ${nxt.setIndex}`
        : session.items[nxt.itemIndex]?.name;

  return (
    <div className="anim-rise flex min-h-0 flex-1 flex-col">
      <Pad className="pt-5">
        <Place>
          {item.name} · série {session.setIndex} de {item.planned_sets}
        </Place>
        <Display className="mt-2">
          {last ? `${formatKg(last.kg)} kg × ${last.reps}` : "Série feita"}
        </Display>
        {item.last_kg != null ? (
          <p className="t-small mt-2">
            {last && last.kg > item.last_kg
              ? `Você subiu ${formatKg(last.kg - item.last_kg)} kg`
              : `Última vez · ${formatKg(item.last_kg)} kg`}
          </p>
        ) : null}
      </Pad>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative size-[220px]">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-line)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="3"
              strokeDasharray={`${done * ring} ${ring}`}
              strokeLinecap="butt"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="t-display text-ink">{left}</p>
            <p className="t-kicker mt-1">{left} s no relógio</p>
          </div>
        </div>
        {left === 0 ? (
          <p className="t-small mt-5 max-w-[28ch] px-8 text-center">Fechou. Marca como foi e segue.</p>
        ) : null}
      </div>

      {fechaExercicio ? (
        <Pad className="pb-3">
          <p className="t-kicker mb-3">Como foi</p>
          <div className="flex gap-2">
            {WORDS.map((w) => (
              <button
                key={w.effort}
                type="button"
                className={cn(
                  "h-12 flex-1 t-body",
                  effort === w.effort ? "bg-fill text-ink" : "bg-raised text-mute",
                )}
                onClick={() => setEffort(w.effort)}
              >
                {w.label}
              </button>
            ))}
          </div>
        </Pad>
      ) : null}

      <Dock>
        <Thumb
          label={ending ? "Terminar sessão" : left === 0 ? "Próxima série" : "Pular descanso"}
          meta={ending ? undefined : nextLabel}
          disabled={fechaExercicio && !effort}
          onPress={() => {
            if (ending) {
              if (effort) finish(effort);
              return;
            }
            if (fechaExercicio) {
              if (effort) advance(effort);
              return;
            }
            skip();
          }}
        />
        {ending ? null : (
          <Quiet
            label="Terminar por aqui"
            disabled={Boolean(fechaExercicio && !effort)}
            onPress={() => {
              if (fechaExercicio && effort) finish(effort);
              else if (!fechaExercicio) finish(2);
            }}
          />
        )}
      </Dock>
    </div>
  );
}
