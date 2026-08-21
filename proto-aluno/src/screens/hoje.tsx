import { Display, Face, NoSheet, Pad, Place, Quiet, Screen, Scoreboard, Stamp, Thumb } from "@/components/bits";
import { BORAS, NOW, PRESCRIPTION, alreadySeenLine, arenaWhy, clanOf, duelOpen, groupOf, personOf, warLeadNote } from "@/lib/seed";
import { applyLast, useLink } from "@/lib/store";
import { dateShort, formatKg, weekdayLong } from "@/lib/format";

export function Hoje() {
  const ofensiva = useLink((s) => s.ofensiva);
  const protector = useLink((s) => s.protector);
  const cumprido = useLink((s) => s.cumprido);
  const session = useLink((s) => s.session);
  const lastProof = useLink((s) => s.lastProof);
  const start = useLink((s) => s.startSession);
  const resume = useLink((s) => s.resumeSession);
  const openBora = useLink((s) => s.openBora);
  const open = useLink((s) => s.openOverlay);
  const openComo = useLink((s) => s.openComo);
  const openProof = useLink((s) => s.openProof);
  const war = useLink((s) => s.war);
  const paused = Boolean(session) && !cumprido;
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const bora = BORAS.find((r) => joined.includes(r.groupId));
  const joinedBoras = useLink((s) => s.joinedBoras);
  const going = bora ? (joinedBoras.includes(bora.id) ? [...bora.going, "vitor"] : bora.going) : [];
  const home = groupOf(war.homeId, groups);
  const away = groupOf(war.awayId, groups);
  const clan = clanOf(war, joined, groups);
  const missing = clan ? clan.memberIds.filter((id) => (war.contributions[id] ?? 0) === 0) : [];
  const top = clan
    ? [...clan.memberIds]
        .map((id) => ({ id, n: war.contributions[id] ?? 0 }))
        .sort((a, b) => b.n - a.n)[0]
    : undefined;
  const seen = clanOf(war, joined, groups)?.name ?? groups.find((g) => joined.includes(g.id))?.name;
  const lastLoads = useLink((s) => s.lastLoads);
  const raid = useLink((s) => s.raid);
  const duels = useLink((s) => s.duels);
  const accept = useLink((s) => s.acceptDuel);
  const incoming = duels.filter((d) => duelOpen(d) && d.toId === "vitor");
  const sheet = applyLast(PRESCRIPTION.items, lastLoads);
  const clanName = clan?.name ?? groups.find((g) => joined.includes(g.id))?.name;
  const why = arenaWhy();

  return (
    <Screen>
      <Pad className="flex items-end justify-between pt-1 pb-4">
        <div>
          <Place>{clanName ?? "Sem clã"}</Place>
          <p className="t-body mt-1">
            {weekdayLong(NOW)} · {dateShort(NOW)}
          </p>
        </div>
        <p className="t-small text-right">
          ofensiva {ofensiva}
          <br />
          {protector ? "1 protetor" : "protetor gasto"}
        </p>
      </Pad>

      <Pad className="pb-4">
          {cumprido ? (
            <>
              <p className="t-small text-mute">{clanName}</p>
              <Place>Sessão fechada · hoje</Place>
              <Display className="mt-1">{lastProof?.title ?? PRESCRIPTION.name}</Display>
              {lastProof ? (
                <p className="t-body mt-5">
                  {lastProof.sets} {lastProof.sets === 1 ? "série" : "séries"} · {lastProof.minutes || 1} min
                </p>
              ) : null}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="t-title">{ofensiva}</p>
                  <p className="t-small">semanas na ofensiva</p>
                </div>
                <Stamp />
              </div>
              <p className="t-small mt-4">{alreadySeenLine(seen)} Amanhã é outro.</p>
              <Quiet label="Recomeçar o proto" danger onPress={() => useLink.getState().reset()} />
            </>
          ) : sheet.length ? (
            <>
              <Place>O de hoje</Place>
              <Display className="mt-1">{PRESCRIPTION.name}</Display>
              <ul className="mt-5">
                {sheet.map((item) => {
                  const delta = item.last_kg != null ? item.load_kg - item.last_kg : null;
                  const mark =
                    delta == null ? `${item.planned_sets} × ${item.planned_reps}` : delta === 0 ? "igual" : `${delta > 0 ? "+" : "−"}${formatKg(Math.abs(delta))}`;
                  return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex h-12 w-full items-baseline justify-between gap-3 py-3 text-left"
                      onClick={() => openComo(item.id)}
                    >
                      <span>
                        <span className="t-body block">{item.name}</span>
                        <span className="t-small">
                          {item.last_kg != null
                            ? `última ${formatKg(item.last_kg)} × ${item.last_reps}`
                            : `${item.planned_sets} × ${item.planned_reps}`}
                        </span>
                      </span>
                      <span className="t-body tabular-nums">{mark}</span>
                    </button>
                  </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex gap-2">
                <Quiet label="Última vez" onPress={() => start("ultima")} />
                <Quiet label="Treino livre" onPress={() => open("livre")} />
              </div>
            </>
          ) : (
            <NoSheet onUltima={() => start("ultima")} onLivre={() => open("livre")} />
          )}
          {cumprido || sheet.length ? (
            <div className="mt-6">
              <Thumb
                label={cumprido ? "Ver o Feito" : paused ? "Continuar no rack" : "Começar"}
                meta={cumprido || paused ? undefined : `${PRESCRIPTION.minutes} min`}
                onPress={
                  cumprido
                    ? () => (lastProof ? openProof(lastProof.id) : open("feito"))
                    : paused
                      ? resume
                      : () => start("ficha")
                }
              />
            </div>
          ) : null}
      </Pad>

      {incoming.length ? (
        <div className="px-5 py-5">
          <p className="t-kicker">Te pegaram</p>
          {incoming.map((d) => (
            <div key={d.id} className="mt-3 flex items-center justify-between gap-3">
              <button type="button" className="flex h-12 min-w-0 items-center gap-3" onClick={() => openProof(d.postId)}>
                <Face id={d.fromId} size={36} />
                <p className="t-body truncate">
                  {personOf(d.fromId).name} · {d.mark}
                </p>
              </button>
              <button
                type="button"
                className="press flex h-12 shrink-0 items-center rounded-sm border border-edge px-4 t-small text-ink"
                onClick={() => accept(d.id)}
              >
                Aceito
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button type="button" className="h-12 w-full px-5 py-5 text-left" onClick={() => open("raid")}>
        <p className="t-kicker">Raid · fecha {raid.ends}</p>
        <p className="t-title mt-1">{raid.mark}</p>
        <p className="t-small mt-2">{raid.claimed.length} já fizeram.</p>
      </button>

      <Scoreboard
        home={home.name}
        homeScore={war.homeScore}
        away={away.name}
        awayScore={war.awayScore}
        note={
          clan
            ? `${top && top.n > 0 ? `${personOf(top.id).name} puxou ${top.n}. ` : ""}${
                missing.length
                  ? `${missing.map((id) => (id === "vitor" ? "Você" : personOf(id).name)).join(", ")} ainda não veio. `
                  : ""
              }${warLeadNote(war, home, away)}`
            : warLeadNote(war, home, away)
        }
        onPress={() => open("guerra")}
      />

      {why ? <p className="px-5 py-4 t-small">{why}</p> : null}

      {bora ? (
        <button type="button" className="flex h-12 w-full items-center gap-3 px-5 py-5 text-left" onClick={() => openBora(bora.id)}>
          <div className="flex -space-x-1.5">
            {going.slice(0, 4).map((id) => (
              <Face key={id} id={id} size={28} />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="t-body">
              {bora.title} · {bora.hour}
            </p>
            <p className="t-small truncate">
              {going.length} vão · {bora.address}
            </p>
          </div>
          <span className="t-body">Bora</span>
        </button>
      ) : null}

    </Screen>
  );
}
