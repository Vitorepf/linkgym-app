import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Screen({ children }: { children: ReactNode }) {
  return <div className="scroll flex min-h-0 flex-1 flex-col pb-7">{children}</div>;
}

export function Pad({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-5", className)}>{children}</div>;
}

export function Rule({ className }: { className?: string }) {
  return <div className={cn("rule mx-5", className)} />;
}

export function Place({ children }: { children: ReactNode }) {
  return <p className="t-kicker">{children}</p>;
}

export function PlaceHero({
  src,
  alt,
  kicker,
  title,
  onPress,
  meta,
  faces,
  action,
}: {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  onPress?: () => void;
  meta?: string;
  faces?: { id?: string; initials: string; color: string }[];
  action?: ReactNode;
}) {
  return (
    <div className="relative h-[340px] w-full shrink-0 overflow-hidden">
      <img src={src} alt={alt} className="h-full w-full object-cover object-[50%_22%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
      {onPress ? (
        <button
          type="button"
          onClick={onPress}
          className="absolute inset-0"
          aria-label={`${kicker} ${title}`}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-5 bottom-4 text-ink">
        <p className="t-kicker text-ink/80">{kicker}</p>
        <p className="t-display mt-1 text-ink">{title}</p>
        {faces?.length || meta || action ? (
          <div className="pointer-events-auto relative z-10 mt-3 flex items-center gap-3">
            {faces?.length ? (
              <div className="flex -space-x-1.5">
                {faces.slice(0, 5).map((f, i) => (
                  <Avatar
                    key={f.id ?? `${f.initials}-${i}`}
                    initials={f.initials}
                    color={f.color}
                    size={26}
                    photo={f.id ? personPhoto(f.id) : undefined}
                  />
                ))}
              </div>
            ) : null}
            {meta ? <p className="t-small flex-1 text-ink/75">{meta}</p> : null}
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Scoreboard({
  home,
  homeScore,
  away,
  awayScore,
  note,
  onPress,
}: {
  home: string;
  homeScore: number;
  away: string;
  awayScore: number;
  note?: string;
  onPress?: () => void;
}) {
  const body = (
    <>
      <p className="t-kicker">Fecha domingo · grupo vs grupo</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="t-body min-w-0 truncate">{home}</p>
        <p className="t-title">{homeScore}</p>
      </div>
      <div className="mt-1 flex items-end justify-between gap-4 text-mute">
        <p className="t-body min-w-0 truncate">{away}</p>
        <p className="t-title text-mute">{awayScore}</p>
      </div>
      {note ? <p className="t-small mt-3">{note}</p> : null}
    </>
  );
  const cls = "w-full min-h-[44px] px-5 py-5 text-left";
  if (onPress) {
    return (
      <button type="button" onClick={onPress} className={cls}>
        {body}
      </button>
    );
  }
  return <div className={cls}>{body}</div>;
}

export function Tally({ n, empty = "ainda não" }: { n: number; empty?: string }) {
  if (n <= 0) return <span className="t-small">{empty}</span>;
  return (
    <span className="t-mono tracking-[0.16em] text-ink" aria-label={`${n} sessões`}>
      {"●".repeat(Math.min(n, 12))}
    </span>
  );
}

export function Lockers({ filled, cap }: { filled: number; cap: number }) {
  const pct = Math.min(100, Math.round((filled / Math.max(cap, 1)) * 100));
  return (
    <div className="mt-3">
      <div className="h-1 w-full bg-raised">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PunchCard({
  days,
  done,
  goal,
}: {
  days: number;
  done: number;
  goal: number;
}) {
  const n = Math.min(days, 30);
  return (
    <div className={cn("mt-3 grid gap-1.5", n > 7 ? "grid-cols-10" : "grid-cols-7")}>
      {Array.from({ length: n }, (_, i) => {
        const punched = i < done;
        const needed = i < goal;
        return (
          <div
            key={i}
            className={cn(
              "flex h-8 items-center justify-center t-mono",
              punched ? "bg-ink text-bg" : needed ? "bg-raised text-faint" : "bg-bg text-faint",
            )}
          >
            {punched ? "●" : ""}
          </div>
        );
      })}
    </div>
  );
}

export function LockerTag({ code }: { code: string }) {
  return (
    <div className="py-3">
      <p className="t-kicker">Código do grupo</p>
      <p className="t-display mt-1 tracking-[0.04em]">{code || "—"}</p>
    </div>
  );
}

export function Display({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn("t-title text-ink", className)}>{children}</h1>;
}

export function NoSheet({ onUltima, onLivre }: { onUltima: () => void; onLivre: () => void }) {
  return (
    <>
      <Place>O de hoje</Place>
      <Display className="mt-1">Sem ficha publicada</Display>
      <p className="t-body mt-4 text-mute">Ninguém mandou folha. Última vez ou livre — a conta é sua.</p>
      <div className="mt-6">
        <Thumb label="Repetir última" onPress={onUltima} />
      </div>
      <div className="mt-2">
        <Quiet label="Treino livre" onPress={onLivre} />
      </div>
    </>
  );
}

export function Thumb({
  label,
  onPress,
  meta,
  disabled,
}: {
  label: string;
  onPress: () => void;
  meta?: string;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onPress} className="thumb">
      <span>{label}</span>
      {meta ? <span className="t-mono opacity-80">{meta}</span> : null}
    </button>
  );
}

export function Quiet({
  label,
  onPress,
  danger,
  disabled,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onPress} className="quiet" data-danger={danger}>
      {label}
    </button>
  );
}

export function HoldTick({ onTick, label }: { onTick: () => void; label: string }) {
  const t = useRef<number | null>(null);
  const start = () => {
    onTick();
    t.current = window.setInterval(onTick, 130);
  };
  const stop = () => {
    if (t.current) window.clearInterval(t.current);
    t.current = null;
  };
  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className="flex h-14 flex-1 items-center justify-center border border-edge bg-raised text-ink t-body active:bg-surface"
    >
      {label}
    </button>
  );
}

function personPhoto(id: string) {
  return `/faces/${id}.jpg`;
}

export function Face({
  id,
  size = 36,
  ring,
}: {
  id: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <Avatar
      initials={id.slice(0, 2).toUpperCase()}
      color="var(--color-fill)"
      size={size}
      photo={personPhoto(id)}
      ring={ring}
    />
  );
}

export function Avatar({
  initials,
  color,
  size = 36,
  photo,
  ring,
}: {
  initials: string;
  color: string;
  size?: number;
  photo?: string;
  ring?: boolean;
}) {
  const dark = color.includes("fill") || color.includes("stamp") || color.includes("ink");
  return (
    <div
      className={cn("shrink-0", ring && "ring-2 ring-ink")}
      style={{
        borderRadius: 2,
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: 2,
          backgroundColor: photo ? undefined : color,
        }}
      >
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover object-[50%_18%]" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center t-mono"
            style={{
              color: dark ? "var(--color-ink)" : "var(--color-bg)",
              fontSize: size < 32 ? 10 : 11,
            }}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

export function WeekChart({
  days,
  kg,
  min,
}: {
  days: number[];
  kg: number;
  min: number;
}) {
  const labels = ["S", "T", "Q", "Q", "S", "S", "D"];
  const max = Math.max(1, ...days);
  const sessions = days.filter((n) => n > 0).length;
  return (
    <div>
      <p className="t-kicker">Esta semana</p>
      <div className="mt-3 grid grid-cols-3">
        <div>
          <p className="t-display">{sessions}</p>
          <p className="t-small">sessões</p>
        </div>
        <div>
          <p className="t-display">{kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : kg}</p>
          <p className="t-small">volume</p>
        </div>
        <div>
          <p className="t-display">{min}</p>
          <p className="t-small">min</p>
        </div>
      </div>
      <div className="mt-4 flex h-[72px] items-end gap-1.5">
        {days.map((n, i) => (
          <div key={`${labels[i]}-${i}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <div
              className="w-full"
              style={{
                height: n ? `${Math.max(8, (n / max) * 52)}px` : 3,
                background: n ? "var(--color-ink)" : "var(--color-fill)",
              }}
            />
            <span className="t-small">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthGrid({ days }: { days: number[] }) {
  return (
    <div>
      <p className="t-kicker">Agosto</p>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((n, i) => (
          <div
            key={i}
            className="aspect-square"
            style={{ background: n ? "var(--color-ink)" : "var(--color-fill)" }}
          />
        ))}
      </div>
    </div>
  );
}

export function MediaGrid({
  items,
  onOpen,
}: {
  items: { id: string; src: string; video?: boolean }[];
  onOpen: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-3 gap-px">
      {items.map((it) => (
        <button key={it.id} type="button" onClick={() => onOpen(it.id)} className="relative aspect-square overflow-hidden">
          <img src={it.src} alt="" className="h-full w-full object-cover" />
          {it.video ? (
            <span className="absolute right-1.5 bottom-1.5 t-small text-ink">▶</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function Stamp({
  label = "Tá pago",
  on = true,
}: {
  label?: string;
  on?: boolean;
}) {
  return (
    <span
      className={cn("t-title tracking-[0.04em]", on ? "text-stamp" : "text-faint")}
      aria-label={on ? label : undefined}
      aria-hidden={!on}
    >
      {label}
    </span>
  );
}

export function StampHold({
  paid,
  count,
  onPay,
}: {
  paid: boolean;
  count: number;
  onPay: () => void;
}) {
  const timer = useRef<number | null>(null);
  const fire = () => {
    if (paid) return;
    onPay();
  };
  return (
    <button
      type="button"
      onPointerDown={() => {
        if (paid) return;
        timer.current = window.setTimeout(fire, 380);
      }}
      onPointerUp={() => {
        if (timer.current) window.clearTimeout(timer.current);
      }}
      onPointerLeave={() => {
        if (timer.current) window.clearTimeout(timer.current);
      }}
      className={cn("flex items-center gap-3 py-2", paid ? "text-stamp" : "text-mute")}
    >
      <span
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 t-mono",
          paid ? "stamp-mark border-stamp text-stamp" : "border-line text-mute",
        )}
      >
        {paid ? "OK" : ""}
      </span>
      <span className="t-body">
        Tá pago
        <span className="ml-2 t-small">{count}</span>
      </span>
    </button>
  );
}

export function Segment<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="mx-5 mb-4 flex gap-5 border-b border-line">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "h-11 t-body",
            value === o.id ? "border-b-2 border-ink text-ink" : "text-mute",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function IconPulse({ color, size = 20, weight = 1.7 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 13h4l2.2-6 3.6 12 2.4-6H21" stroke={color} strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

export function IconFicha({ color, size = 20, weight = 1.7 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 3.5h10v17H7z" stroke={color} strokeWidth={weight} />
      <path d="M9.5 8h5M9.5 12h5M9.5 16h3" stroke={color} strokeWidth={weight} />
    </svg>
  );
}

export function IconTrend({ color, size = 20, weight = 1.7 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 16l5-5 3.5 3.5L20 7" stroke={color} strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

export function IconPeople({ color, size = 20, weight = 1.7 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="2.6" stroke={color} strokeWidth={weight} />
      <path d="M4.5 18.5c.4-2.6 2.4-4 4.5-4s4.1 1.4 4.5 4" stroke={color} strokeWidth={weight} />
      <circle cx="16.2" cy="8.4" r="2.1" stroke={color} strokeWidth={weight} />
      <path d="M14 18.5c.3-1.8 1.6-2.9 3.1-2.9 1.4 0 2.6 1 3 2.9" stroke={color} strokeWidth={weight} />
    </svg>
  );
}

export function IconPerson({ color, size = 20, weight = 1.7 }: { color: string; size?: number; weight?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke={color} strokeWidth={weight} />
      <path d="M5 19.5c.6-3.2 3.2-5 7-5s6.4 1.8 7 5" stroke={color} strokeWidth={weight} />
    </svg>
  );
}
