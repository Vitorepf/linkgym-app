import { motion } from "motion/react";
import { ObjectBar } from "@/ui/kit";
import { PillButton, Portrait } from "@/ui/photo";
import {
  SPORT_LABEL,
  YOU_ID,
  arenaName,
  bestOnMark,
  duelOpen,
  fichaOf,
  groupOf,
  personOf,
  recordOf,
  theyMet,
  titlesOf,
} from "@/lib/seed";
import { useLink } from "@/lib/store";

const EASE = [0.22, 1, 0.36, 1] as const;
const BACK = [0.34, 1.32, 0.64, 1] as const;

function freqOf(id: string): string | null {
  const row = fichaOf(id).barras.find((b) => b.eixo === "frequencia" && b.rotulo !== "—");
  return row?.rotulo ?? null;
}

function Side({
  id,
  you,
  mark,
  side,
}: {
  id: string;
  you: string;
  mark: string;
  side: "left" | "right";
}) {
  const lastLoads = useLink((s) => s.lastLoads);
  const loadBook = useLink((s) => s.loadBook);
  const duels = useLink((s) => s.duels);
  const raid = useLink((s) => s.raid);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const openPerson = useLink((s) => s.openPerson);

  const person = personOf(id);
  const name = id === YOU_ID ? you : person.name;
  const gids = id === YOU_ID ? joined : person.groupIds;
  const clan = gids.map((g) => groupOf(g, groups)).find(Boolean);
  const rec = recordOf(id, duels);
  const lift = bestOnMark(id, mark, loadBook, lastLoads);
  const titles = titlesOf(id, duels, raid);
  const freq = freqOf(id);
  const fromX = side === "left" ? -40 : 40;

  return (
    <motion.button
      type="button"
      onClick={() => openPerson(id)}
      initial={{ opacity: 0, x: fromX, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: EASE, delay: side === "left" ? 0.05 : 0.12 }}
      className="flex min-w-0 flex-1 flex-col items-center px-1 text-center"
    >
      <Portrait id={id} size={124} className="rounded-md" />
      <p className="t-title mt-3 w-full truncate">{name}</p>
      <p className="t-small mt-1 text-mute">{clan ? clan.name : SPORT_LABEL[person.sport]}</p>
      {rec.total > 0 ? (
        <p className="t-display mt-4 tabular-nums tracking-tight">
          {rec.venceu}
          <span className="text-mute">–</span>
          {rec.empatou}
          <span className="text-mute">–</span>
          {rec.perdeu}
        </p>
      ) : (
        <p className="t-small mt-4 text-mute">Ainda sem cartel</p>
      )}
      <p className="t-micro mt-1 text-faint">venceu · empatou · perdeu</p>
      {lift ? (
        <p className="mt-4">
          <span className="t-body tabular-nums">{lift.value}</span>
          <span className="t-small ml-1 text-mute">{lift.label}</span>
        </p>
      ) : null}
      {freq ? <p className="t-small mt-2 text-mute">{freq}</p> : null}
      {titles.length ? (
        <ul className="mt-3 space-y-1">
          {titles.map((t) => (
            <li key={t} className="t-micro text-ink">
              {t}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.button>
  );
}

export function Versus() {
  const id = useLink((s) => s.selectedDuelId);
  const duels = useLink((s) => s.duels);
  const you = useLink((s) => s.name);
  const close = useLink((s) => s.closeOverlay);
  const accept = useLink((s) => s.acceptDuel);

  const duel = duels.find((d) => d.id === id);
  if (!duel) return null;

  const incoming = duelOpen(duel) && duel.toId === YOU_ID;
  const prior = theyMet(duel.fromId, duel.toId, duels.filter((d) => d.id !== duel.id));
  const priorLine = prior?.veredito
    ? prior.veredito.vencedorId === null
      ? `Já empataram em ${prior.mark}.`
      : `${prior.veredito.vencedorId === YOU_ID ? you : personOf(prior.veredito.vencedorId).name} levou ${prior.mark}.`
    : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between px-5 pt-3">
        <PillButton label="Voltar" glyph="back" onPress={() => close()} mute />
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE, delay: 0.08 }}
          className="t-kicker"
        >
          {arenaName()}
        </motion.p>
        <span className="w-11" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center px-5 pb-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="t-kicker text-center"
        >
          A disputa
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.04 }}
          className="t-display mt-1 text-center"
        >
          {duel.mark}
        </motion.h1>

        <div className="relative mt-8 flex items-start justify-between gap-2">
          <Side id={duel.fromId} you={you} mark={duel.mark} side="left" />
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.35, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.48, ease: BACK, delay: 0.22 }}
            className="pointer-events-none absolute top-[52px] left-1/2 z-10 -translate-x-1/2 t-title text-ink"
          >
            vs
          </motion.span>
          <Side id={duel.toId} you={you} mark={duel.mark} side="right" />
        </div>

        {priorLine ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.32, ease: EASE, delay: 0.36 }}
            className="t-small mt-8 text-center text-mute"
          >
            {priorLine}
          </motion.p>
        ) : null}
      </div>

      <ObjectBar
        value={incoming ? "Eles te pegaram" : duel.mark}
        guarantee={incoming ? "Aceitar mede os dois no mesmo objeto." : "Toque no rosto para o dossiê."}
        action={incoming ? "Aceito" : "Fechar"}
        onAction={incoming ? () => accept(duel.id) : () => close()}
      />
    </div>
  );
}
