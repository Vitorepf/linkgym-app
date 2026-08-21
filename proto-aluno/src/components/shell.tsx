import { cn } from "../lib/utils";
import { useLink } from "@/lib/store";
import { NOW, arenaName } from "@/lib/seed";
import { clockShort } from "@/lib/format";
import type { Overlay, TabId } from "@/lib/types";
import { IconFicha, IconPeople, IconPerson, IconPulse, IconTrend } from "@/components/bits";

const TABS: { id: TabId; label: string; Icon: typeof IconPulse }[] = [
  { id: "hoje", label: "Hoje", Icon: IconPulse },
  { id: "ficha", label: "Ficha", Icon: IconFicha },
  { id: "rede", label: "Rede", Icon: IconPeople },
  { id: "progresso", label: "Progresso", Icon: IconTrend },
  { id: "perfil", label: "Perfil", Icon: IconPerson },
];

function toneOf(overlay: Overlay) {
  return overlay === "zap" ? "tone-zap" : "";
}

export function PhoneShell({ children }: { children: React.ReactNode }) {
  const overlay = useLink((s) => s.overlay);
  const tone = toneOf(overlay);
  return (
    <div className="flex min-h-dvh items-stretch justify-center bg-sunk md:items-center md:py-8">
      <div
        className={cn(
          "relative flex h-dvh w-full max-w-[430px] flex-col bg-bg text-ink",
          "md:h-[844px] md:overflow-hidden md:rounded-[38px]",
          "md:shadow-[0_0_0_1px_var(--color-edge),0_0_0_10px_var(--color-sunk),0_40px_90px_rgba(0,0,0,0.6)]",
          tone,
        )}
      >
        <div className="flex h-11 shrink-0 items-center justify-between px-5">
          <span className="t-body text-faint">{clockShort(NOW)}</span>
          <span className="t-body text-faint">{arenaName()}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TabBar() {
  const tab = useLink((s) => s.tab);
  const setTab = useLink((s) => s.setTab);

  return (
    <nav className="relative mt-auto flex shrink-0 bg-dock pt-1 pb-[max(10px,env(safe-area-inset-bottom))]">
      {TABS.map((t) => {
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={cn(
              "press relative flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-sm",
              on ? "text-ink" : "text-faint",
            )}
            aria-current={on ? "page" : undefined}
            onClick={() => setTab(t.id)}
          >
            <t.Icon color="currentColor" weight={on ? 2.2 : 1.7} />
            <span className={cn("t-body", on ? "font-semibold" : "font-medium")}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** Rodapé de ação do rack. Uma primária, no máximo uma saída silenciosa. Sem régua de ponta a ponta. */
export function Dock({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-dock
      className="mx-auto w-fit min-w-[12rem] max-w-full shrink-0 bg-dock px-5 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]"
    >
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/** Folha social. O tab fica; o contexto acima continua legível. Véu 0%. */
export function Sheet({
  children,
  onDismiss,
  tall,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
  tall?: boolean;
}) {
  return (
    <>
      <button type="button" aria-label="Fechar" onClick={onDismiss} className="absolute inset-0 z-10" />
      <div className={cn("sheet", tall && "sheet-card")}>{children}</div>
    </>
  );
}
