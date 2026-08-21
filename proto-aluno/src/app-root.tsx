import { Component, Suspense, lazy, useEffect, type ComponentType, type ReactNode } from "react";
import { motion } from "motion/react";
import { PhoneShell, Sheet, TabBar } from "./components/shell";
import { Hoje } from "./screens/hoje";
import { Escrever, Ficha, Montar, Oferecer } from "./screens/ficha";
import { Progresso } from "./screens/progresso";
import { Duelos, Perfil } from "./screens/perfil";
import { ComoFazer, FichaSessao, Serie } from "./screens/serie";
import { Descanso } from "./screens/descanso";
import { Feito } from "./screens/feito";
import { Bora, Composer, Pessoa, Prova, Zap } from "./screens/social";
import { Versus } from "./screens/versus";
import { useLink } from "./lib/store";
import type { Overlay, TabId } from "./lib/types";

type SceneFn = ComponentType;

/**
 * Cena carregada sob demanda. Import estático de módulo quebrado derruba o app
 * inteiro antes de qualquer render, e nenhuma barreira de erro alcança isso.
 * Carregando tarde, a falha fica presa na cena que falhou.
 */
function scene(load: () => Promise<Record<string, unknown>>, name: string) {
  return lazy(() =>
    load().then((m) => {
      const Found = m[name];
      if (typeof Found !== "function") throw new Error(`A cena "${name}" ainda não existe.`);
      return { default: Found as ComponentType };
    }),
  );
}

const Rede = scene(() => import("./screens/rede"), "Rede");
const grupos = () => import("./screens/grupos");

const OVERLAYS: Record<string, SceneFn> = {
  serie: Serie,
  descanso: Descanso,
  feito: Feito,
  como: ComoFazer,
  fichaSessao: FichaSessao,
  bora: Bora,
  raid: scene(grupos, "RaidBoard"),
  zap: Zap,
  prova: Prova,
  pessoa: Pessoa,
  grupo: scene(grupos, "Grupo"),
  guerra: scene(grupos, "Guerra"),
  arena: scene(grupos, "Arena"),
  duelos: Duelos,
  livre: scene(grupos, "Livre"),
  desafio: scene(grupos, "Desafio"),
  criarGrupo: scene(grupos, "CriarGrupo"),
  composer: Composer,
  escrever: Escrever,
  montar: Montar,
  oferecer: Oferecer,
  versus: Versus,
};

const TABS: Record<TabId, SceneFn> = {
  hoje: Hoje,
  ficha: Ficha,
  rede: Rede,
  progresso: Progresso,
  perfil: Perfil,
};

class SceneBoundary extends Component<{ children: ReactNode; onLeave: () => void }, { err: Error | null }> {
  state = { err: null as Error | null };

  static getDerivedStateFromError(err: Error) {
    return { err };
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="flex min-h-0 flex-1 flex-col justify-center px-6">
        <p className="t-kicker">Esta tela caiu</p>
        <p className="t-body mt-2 text-mute">{this.state.err.message}</p>
        <button
          type="button"
          className="press mt-6 flex h-12 items-center justify-center rounded-sm border border-edge px-4 t-small text-ink"
          onClick={this.props.onLeave}
        >
          Voltar para o Hoje
        </button>
      </div>
    );
  }
}

/**
 * Rack vazio: Série / Descanso / Feito / Como / Ficha sobem cartão 55%.
 * Folha 35×25 = social (Stripe). Página = o objeto é a cena (Airbnb).
 */
const RACK = new Set<string>();
const CARDS = new Set<string>(["serie", "descanso", "feito", "como", "fichaSessao"]);
const PAGES = new Set<string>(["prova", "pessoa", "composer", "versus"]);

function rackUnder(overlay: Overlay, trail: Overlay[]) {
  if (overlay && RACK.has(overlay)) return overlay;
  if (overlay && CARDS.has(overlay)) {
    for (let i = trail.length - 1; i >= 0; i--) {
      const o = trail[i];
      if (o && RACK.has(o)) return o;
    }
  }
  return null;
}

function entranceOf(overlay: Overlay) {
  if (!overlay) return { from: { opacity: 0, y: 6 }, dur: 0.24 };
  if (overlay === "versus") return { from: { opacity: 0, scale: 0.96 }, dur: 0.4 };
  if (RACK.has(overlay)) return { from: { opacity: 0, x: 22 }, dur: 0.24 };
  return { from: { opacity: 0, y: 20 }, dur: 0.32 };
}

export function AppRoot() {
  const hydrated = useLink((s) => s.hydrated);
  const tab = useLink((s) => s.tab);
  const overlay = useLink((s) => s.overlay);
  const overlayTrail = useLink((s) => s.overlayTrail);

  useEffect(() => {
    let alive = true;
    void Promise.resolve(useLink.persist.rehydrate()).then(() => {
      if (!alive) return;
      const s = useLink.getState();
      if (s.session && !s.cumprido) {
        const keep = s.overlay != null && (RACK.has(s.overlay) || CARDS.has(s.overlay));
        if (!keep) {
          useLink.setState({ overlay: s.session.restLeft > 0 ? "descanso" : "serie" });
        }
      }
      s.setHydrated();
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!hydrated) {
    return (
      <PhoneShell>
        <div className="flex-1" />
      </PhoneShell>
    );
  }

  const rackId = rackUnder(overlay, overlayTrail);
  const isCard = overlay != null && CARDS.has(overlay);
  const isPage = overlay != null && PAGES.has(overlay);
  const isSheet = overlay != null && !RACK.has(overlay) && !PAGES.has(overlay) && !(isCard && rackId);
  const TabScene = TABS[tab] ?? Hoje;
  const OverlayScene = overlay ? OVERLAYS[overlay] : undefined;
  const RackScene = rackId ? OVERLAYS[rackId] : undefined;
  const { from, dur } = entranceOf(overlay);
  const tabKey = `tab:${tab}`;
  const goHome = () => useLink.setState({ tab: "hoje", overlay: null, overlayTrail: [] });
  const dismissSheet = () => useLink.getState().closeOverlay();
  const LiveScene = rackId && RackScene ? RackScene : isPage && OverlayScene ? OverlayScene : TabScene;
  const liveKey = rackId ? `rack:${rackId}` : isPage ? `page:${overlay}` : tabKey;

  return (
    <PhoneShell>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <motion.div
          key={liveKey}
          initial={rackId || isPage ? from : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: rackId || isPage ? dur : 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <SceneBoundary key={liveKey} onLeave={goHome}>
            <Suspense fallback={<div className="flex-1" />}>
              <LiveScene />
            </Suspense>
          </SceneBoundary>
        </motion.div>
        {(isSheet || isCard) && OverlayScene ? (
          <Sheet onDismiss={dismissSheet} tall={isCard}>
            <motion.div
              key={overlay}
              initial={from}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <SceneBoundary key={overlay} onLeave={dismissSheet}>
                <Suspense fallback={<div className="flex-1" />}>
                  <OverlayScene />
                </Suspense>
              </SceneBoundary>
            </motion.div>
          </Sheet>
        ) : null}
      </div>
      <TabBar />
    </PhoneShell>
  );
}
