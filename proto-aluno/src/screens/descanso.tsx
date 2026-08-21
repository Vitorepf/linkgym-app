import { useEffect, useState } from "react";
import { Pad, Place, Quiet, Thumb } from "@/components/bits";
import { Dock } from "@/components/shell";
import { Roll } from "@/ui/kit";
import { YOU_ID } from "@/lib/seed";
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
  const duels = useLink((s) => s.duels);
  const judged = duels.find((d) => d.veredito && (d.fromId === YOU_ID || d.toId === YOU_ID));
  const faixa = judged?.veredito?.faixa[YOU_ID];
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
  const kgNow = last ? formatKg(last.kg) : formatKg(item.load_kg);
  const kgWas = item.last_kg != null ? formatKg(item.last_kg) : kgNow;
  const repsNow = last ? last.reps : item.planned_reps;
  const repsWas = item.last_reps != null ? item.last_reps : repsNow;

  const markN =
    (faixa != null ? faixa.match(/(\d+(?:[.,]\d+)?)/)?.[1] : undefined) ??
    (last ? formatKg(last.kg) : undefined) ??
    String(session.setIndex);

  return (
    <div className="relative anim-rise flex min-h-0 flex-1 flex-col">
      <Pad className="pt-5">
        <Place>
          {item.name} · série {session.setIndex} de {item.planned_sets}
        </Place>
        <p className="t-display mt-2 tabular-nums">
          <Roll value={kgNow} was={kgWas} />
        </p>
        <p className="t-micro mt-1">kg</p>
        <p className="t-body mt-3 tabular-nums">
          <Roll value={repsNow} was={repsWas} />
          <span className="t-micro ml-2">reps nesta série</span>
        </p>
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
            <p className="t-micro mt-1">segundos</p>
          </div>
        </div>
        {left === 0 ? (
          <p className="t-body mt-5 max-w-[28ch] px-8 text-center">Fechou. Marca como foi e segue.</p>
        ) : null}
      </div>

      {fechaExercicio ? (
        <Pad className="pb-3">
          <p className="t-kicker mb-3">Como foi</p>
          <div className={cn("flex flex-col gap-2", !effort && "rounded-sm border border-ink p-1")}>
            <div className="flex gap-2">
              {WORDS.map((w) => (
                <button
                  key={w.effort}
                  type="button"
                  className={cn(
                    "min-h-11 flex-1 border t-body",
                    effort === w.effort ? "border-ink bg-transparent text-ink" : "border-edge bg-transparent text-mute",
                  )}
                  onClick={() => setEffort(w.effort)}
                >
                  {w.label}
                </button>
              ))}
            </div>
            {effort ? null : (
              <p className="t-body px-1 text-ink">
                <span className="text-stamp tabular-nums">{markN}</span>
                <span aria-hidden className="mx-1 text-stamp">
                  !
                </span>
                Marca como foi.
              </p>
            )}
          </div>
        </Pad>
      ) : null}

      <Dock>
        <Thumb
          label={ending ? "Terminar sessão" : left === 0 ? "Próxima série" : "Pular descanso"}
          meta={ending ? undefined : nextLabel}
          onPress={() => {
            if (fechaExercicio && !effort) return;
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
