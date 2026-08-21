import { useRef, useState } from "react";
import { Display, HoldTick, Pad, Place, Quiet, Screen, Thumb } from "@/components/bits";
import { MarkStrip } from "@/ui/kit";
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
  const delta = last != null ? session.kg - last : null;
  const deltaLine =
    delta == null
      ? `pedido ${formatKg(item.load_kg)}`
      : delta === 0
        ? "igual à última"
        : `${delta > 0 ? "+" : "−"}${formatKg(Math.abs(delta))} kg ${delta > 0 ? "acima" : "abaixo"} da última`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Pad className="flex items-start justify-between pt-3">
        <div>
          <Place>
            {session.itemIndex + 1} de {items.length} · série {session.setIndex} de {item.planned_sets}
          </Place>
          <h1 className="t-title mt-1">{item.name}</h1>
        </div>
        <button
          type="button"
          className="press flex h-12 min-w-12 items-center justify-end t-body text-mute"
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
              i + 1 < session.setIndex ? "bg-fill" : i + 1 === session.setIndex ? "bg-edge" : "bg-line",
            )}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center px-5">
        <p className="t-kicker">Esta série</p>
        <p className="t-title mt-1 text-ink">
          {kg}
          <span className="t-body text-mute"> × {session.reps}</span>
          {last != null && last !== session.kg ? (
            <span className="t-small ml-3 text-faint line-through">{formatKg(last)}</span>
          ) : null}
        </p>
        <p className="t-small mt-2">{deltaLine}</p>
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
          className="press mt-5 flex h-12 items-center self-start t-small text-mute"
          onClick={() => openComo(item.id)}
        >
          Como fazer
        </button>
        {item.notes ? <p className="t-small mt-3 italic">“{item.notes}”</p> : null}
      </div>

      <Dock>
        {mark ? (
          <MarkStrip mark={mark.n} line={mark.line} />
        ) : (
          <Thumb
            label="Fiz essa série"
            meta={`${item.rest_seconds}s`}
            onPress={() => {
              if (armed.current) return;
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
        )}
      </Dock>
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
        <p className="t-small mt-5">
          {item.planned_sets} × {item.planned_reps} · {formatKg(item.load_kg)} kg
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
            <p className="t-body">{formatKg(item.load_kg)}</p>
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
