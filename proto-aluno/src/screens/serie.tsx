import { useRef, useState } from "react";
import { Display, HoldTick, Pad, Place, Quiet, Screen, Thumb } from "@/components/bits";
import { MarkStrip, Roll } from "@/ui/kit";
import { Dock } from "@/components/shell";
import { CATALOG, CUES, LAST_WORKOUT, PRESCRIPTION } from "@/lib/seed";
import { applyLast, useLink } from "@/lib/store";
import { cueLines, formatKg } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/types";

function findExercise(id: string | null, sessionItems?: Exercise[]): Exercise | undefined {
  if (!id) return undefined;
  const raw =
    sessionItems?.find((e) => e.id === id) ??
    PRESCRIPTION.items.find((e) => e.id === id) ??
    LAST_WORKOUT.items.find((e) => e.id === id) ??
    CATALOG.find((e) => e.id === id);
  if (!raw) return undefined;
  return applyLast([raw], useLink.getState().lastLoads)[0];
}

export function SerieVazia() {
  const abandon = useLink((s) => s.abandonSession);
  return (
    <Screen>
      <Pad className="pt-6">
        <Display>Essa série saiu da ficha</Display>
        <p className="t-body mt-3 text-mute">Volta e escolhe de novo.</p>
      </Pad>
      <div className="flex-1" />
      <Dock>
        <Thumb label="Voltar" onPress={abandon} />
      </Dock>
    </Screen>
  );
}

export function Serie() {
  const session = useLink((s) => s.session);
  const bumpKg = useLink((s) => s.bumpKg);
  const bumpReps = useLink((s) => s.bumpReps);
  const logSet = useLink((s) => s.logSet);
  const open = useLink((s) => s.openOverlay);
  const openComo = useLink((s) => s.openComo);
  const [mark, setMark] = useState<{ n: string; line: string } | null>(null);
  const armed = useRef(false);
  if (!session) return null;
  const items = session.items;
  const item = items[session.itemIndex];
  if (!item) return <SerieVazia />;

  const kg = formatKg(session.kg);
  const last = item.last_kg;
  const lastReps = item.last_reps;
  const delta = last != null ? session.kg - last : null;
  const empty = session.kg <= 0;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Pad className="flex items-start justify-between pt-3">
        <div>
          <Place>
            {session.itemIndex + 1} de {items.length} · série {session.setIndex} de {item.planned_sets}
          </Place>
          <h1 className="t-body mt-1">{item.name}</h1>
        </div>
        <button
          type="button"
          className="press flex min-h-11 min-w-12 items-center justify-end t-body text-mute"
          onClick={() => open("fichaSessao")}
        >
          Ficha
        </button>
      </Pad>

      <div className="mt-3 flex gap-1.5 px-5">
        {Array.from({ length: item.planned_sets }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1",
              i + 1 < session.setIndex ? "bg-line" : i + 1 === session.setIndex ? "bg-edge" : "bg-raised",
            )}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center px-5">
        <div className={cn(empty && "rounded-sm border-2 border-ink px-2 py-2")}>
          <p className="t-small">kg</p>
          <p className="t-display mt-1 tabular-nums">
            <Roll value={kg} was={last != null ? formatKg(last) : kg} />
          </p>
          {empty ? (
            <p className="t-body mt-2 text-ink">
              <span className="text-stamp">{kg}</span>
              <span aria-hidden className="mx-1">!</span>
              Carga sem peso.
            </p>
          ) : null}
        </div>
        <div className="mt-6">
          <p className="t-small">reps</p>
          <p className="t-body mt-1 tabular-nums">
            <Roll value={session.reps} was={lastReps != null ? lastReps : session.reps} />
          </p>
        </div>
        <div className="mt-6 flex gap-2">
          <HoldTick onTick={() => bumpKg(-2.5)} label="− 2,5 kg" />
          <HoldTick onTick={() => bumpKg(2.5)} label="+ 2,5 kg" />
        </div>
        <div className="mt-2 flex gap-2">
          <HoldTick onTick={() => bumpReps(-1)} label="− 1 rep" />
          <HoldTick onTick={() => bumpReps(1)} label="+ 1 rep" />
        </div>
        <button
          type="button"
          className="press mt-5 flex min-h-11 items-center self-start t-body text-mute"
          onClick={() => openComo(item.id)}
        >
          Como fazer
        </button>
        {item.notes ? <p className="t-body mt-3 italic">“{item.notes}”</p> : null}
      </div>

      <Dock>
        <Thumb
          label="Fiz essa série"
          meta={`${item.rest_seconds}s`}
          onPress={() => {
            if (armed.current || empty) return;
            armed.current = true;
            const line =
              delta == null
                ? `${session.reps} reps`
                : delta === 0
                  ? "igual à última"
                  : `${delta > 0 ? "+" : "−"}${formatKg(Math.abs(delta))} kg`;
            setMark({ n: kg, line });
            window.setTimeout(() => logSet(), 520);
          }}
        />
      </Dock>
      {mark ? <MarkStrip mark={mark.n} line={mark.line} cover /> : null}
    </div>
  );
}

export function ComoFazer() {
  const session = useLink((s) => s.session);
  const comoId = useLink((s) => s.comoId);
  const id = comoId ?? session?.items[session.itemIndex]?.id ?? PRESCRIPTION.items[0]?.id ?? null;
  const item = findExercise(id, session?.items);
  if (!item) return null;
  const cue = CUES[item.id];
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Pad className="pt-4">
        <Place>Como fazer</Place>
        <Display className="mt-1">{item.name}</Display>
        <ol className="mt-6">
          {cueLines(cue || item.notes || "Amplitude completa. Sem impulso.").map((line, i) => (
            <li key={i} className="flex gap-4 py-3">
              <span className="t-mono text-faint">{i + 1}</span>
              <p className="t-body">{/[.!?°]$/.test(line) ? line : `${line}.`}</p>
            </li>
          ))}
        </ol>
        <p className="t-micro mt-5">{item.rest_seconds}s de descanso</p>
        <p className="t-display mt-2 tabular-nums">
          <Roll value={formatKg(item.load_kg)} was={item.last_kg != null ? formatKg(item.last_kg) : formatKg(item.load_kg)} />
        </p>
        <p className="t-micro mt-1">kg</p>
        <p className="t-body mt-3 tabular-nums">
          <Roll value={item.planned_reps} was={item.last_reps != null ? item.last_reps : item.planned_reps} />
          <span className="t-micro ml-2">reps</span>
        </p>
      </Pad>
      <div className="flex-1" />
      <Dock>
        <Thumb
          label={session ? "Voltar ao rack" : "Voltar"}
          onPress={() => useLink.getState().closeOverlay()}
        />
      </Dock>
    </div>
  );
}

export function FichaSessao() {
  const session = useLink((s) => s.session);
  const items = session?.items ?? PRESCRIPTION.items;
  const title = session?.name ?? PRESCRIPTION.name;
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <Pad className="pt-4 pb-4">
        <Place>Nesta sessão</Place>
        <Display className="mt-1">{title}</Display>
      </Pad>
      <Pad className="pb-4">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-baseline justify-between py-3">
            <div>
              <p className="t-body">{item.name}</p>
              <p className="t-small">
                {i + 1} · {item.planned_sets} × {item.planned_reps}
              </p>
            </div>
            <p className="t-body tabular-nums">
              <Roll
                value={formatKg(item.load_kg)}
                was={item.last_kg != null ? formatKg(item.last_kg) : formatKg(item.load_kg)}
              />
              <span className="t-micro ml-1">kg</span>
            </p>
          </div>
        ))}
      </Pad>
      <div className="flex-1" />
      <Dock>
        <Thumb label="Voltar à série" onPress={() => useLink.getState().closeOverlay()} />
        <Quiet label="Abandonar sessão" danger onPress={() => useLink.getState().abandonSession()} />
      </Dock>
    </div>
  );
}
