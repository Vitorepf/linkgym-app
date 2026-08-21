import { Face, NoSheet, Pad, Place, Quiet, Screen, Stamp } from "@/components/bits";
import { MarkStrip, Roll } from "@/ui/kit";
import { Shot } from "@/ui/photo";
import { BORAS, NOW, PRESCRIPTION, YOU_ID, alreadySeenLine, arenaWhy, clanOf, duelOpen, groupOf, personOf } from "@/lib/seed";
import { applyLast, useLink } from "@/lib/store";
import { dateShort, weekdayLong } from "@/lib/format";

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
  const openVersus = useLink((s) => s.openVersus);
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
  const seen = clanOf(war, joined, groups)?.name ?? groups.find((g) => joined.includes(g.id))?.name;
  const lastLoads = useLink((s) => s.lastLoads);
  const raid = useLink((s) => s.raid);
  const duels = useLink((s) => s.duels);
  const accept = useLink((s) => s.acceptDuel);
  const incoming = duels.filter((d) => duelOpen(d) && d.toId === "vitor");
  const judged = duels.find((d) => d.veredito && (d.fromId === YOU_ID || d.toId === YOU_ID));
  const faixa = judged?.veredito?.faixa[YOU_ID];
  const sheet = applyLast(PRESCRIPTION.items, lastLoads);
  const clanName = clan?.name ?? groups.find((g) => joined.includes(g.id))?.name;
  const why = arenaWhy();

  return (
    <Screen>
      <Pad className="flex items-end justify-between pt-1 pb-5">
        <div className="min-w-0">
          <Place>{clanName ?? "Sem clã"}</Place>
          <p className="t-body mt-1">
            {weekdayLong(NOW)} · {dateShort(NOW)}
          </p>
        </div>
        <p className="t-body shrink-0 text-right text-mute">
          ofensiva {ofensiva}
          <br />
          {protector ? "1 protetor" : "protetor gasto"}
        </p>
      </Pad>

      <Pad className="pb-8">
        {cumprido ? (
          <>
            <Shot src={lastProof?.image ?? "/feed/supino.jpg"} still square />
            <Place>Sessão fechada · hoje</Place>
            <h1 className="t-body mt-1">{lastProof?.title ?? PRESCRIPTION.name}</h1>
            <p className="t-body mt-3">
              {lastProof
                ? `${lastProof.sets} ${lastProof.sets === 1 ? "série" : "séries"} · ${lastProof.minutes || 1} min · ${lastProof.lead ?? lastProof.title}`
                : alreadySeenLine(seen)}
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="t-body">{ofensiva}</p>
                <p className="t-body">semanas na ofensiva</p>
              </div>
              <Stamp />
            </div>
            <p className="t-body mt-4">{alreadySeenLine(seen)} Amanhã é outro.</p>
            {faixa ? (
              <div className="mt-6">
                <MarkStrip
                  mark={faixa.match(/(\d+(?:[.,]\d+)?)/)?.[1] ?? String(judged?.mark ?? "—")}
                  line={faixa}
                />
              </div>
            ) : null}
            <div className="mt-6">
              <Quiet label="Recomeçar o proto" danger onPress={() => useLink.getState().reset()} />
            </div>
          </>
        ) : sheet.length ? (
          <>
            <Place>O de hoje</Place>
            <h1 className="t-body mt-1">{PRESCRIPTION.name}</h1>
            <ul className="mt-4">
              {sheet.map((item) => {
                const now = `${item.planned_sets} × ${item.planned_reps}`;
                const was =
                  item.last_reps != null ? `${item.planned_sets} × ${item.last_reps}` : now;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center py-2.5 text-left"
                      onClick={() => openComo(item.id)}
                    >
                      <span className="t-body min-w-0 truncate">{item.name}</span>
                      <span className="w-[15%] shrink-0" aria-hidden />
                      <span className="t-body shrink-0 tabular-nums text-mute">
                        <Roll value={now} was={was} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-4 flex min-h-11 w-full items-center py-2.5 text-left"
              onClick={paused ? resume : () => start("ficha")}
            >
              <span className="t-body min-w-0 truncate">{paused ? "Continuar no rack" : "Começar"}</span>
              <span className="w-[15%] shrink-0" aria-hidden />
              {paused ? null : (
                <span className="t-body shrink-0 tabular-nums text-mute">{PRESCRIPTION.minutes} min</span>
              )}
            </button>
            <div className="mt-3 flex gap-2">
              <Quiet label="Última vez" onPress={() => start("ultima")} />
              <Quiet label="Treino livre" onPress={() => open("livre")} />
            </div>
          </>
        ) : (
          <NoSheet onUltima={() => start("ultima")} onLivre={() => open("livre")} />
        )}
      </Pad>

      {incoming.length ? (
        <Pad className="pb-8">
          <p className="t-kicker">Te pegaram</p>
          <ul className="mt-1">
            {incoming.map((d) => (
              <li key={d.id} className="flex min-h-[44px] items-center justify-between gap-3 py-2">
                <button type="button" className="flex min-h-11 min-w-0 items-center gap-3" onClick={() => openVersus(d.id)}>
                  <Face id={d.fromId} size={20} />
                  <p className="t-body truncate">
                    {personOf(d.fromId).name} · {d.mark}
                  </p>
                </button>
                <button
                  type="button"
                  className="press flex min-h-11 shrink-0 items-center rounded-sm border border-edge px-4 t-body text-ink"
                  onClick={() => accept(d.id)}
                >
                  Aceito
                </button>
              </li>
            ))}
          </ul>
        </Pad>
      ) : null}

      {why ? <p className="px-5 py-4 t-body">{why}</p> : null}

      {bora ? (
        <button type="button" className="flex min-h-11 w-full items-center gap-3 px-5 py-5 text-left" onClick={() => openBora(bora.id)}>
          <div className="flex -space-x-1.5">
            {going.slice(0, 4).map((id) => (
              <Face key={id} id={id} size={20} />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="t-body">
              {bora.title} · {bora.hour}
            </p>
            <p className="t-body truncate text-mute">
              {going.length} vão · {bora.address}
            </p>
          </div>
          <span className="t-body shrink-0">Bora</span>
        </button>
      ) : null}

      <p className="px-5 py-3 t-body">
        Raid · {raid.mark} · fecha {raid.ends}
      </p>
      <p className="px-5 py-3 t-body text-mute">
        {home.name} {war.homeScore} · {away.name} {war.awayScore}
      </p>
    </Screen>
  );
}
