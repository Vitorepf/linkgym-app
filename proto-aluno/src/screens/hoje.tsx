import { Face, NoSheet, Pad, Quiet, Screen, Scoreboard, Stamp } from "@/components/bits";
import { weekCount } from "@/ui/feed";
import { MarkStrip } from "@/ui/kit";
import { Shot } from "@/ui/photo";
import { BORAS, NOW, PRESCRIPTION, YOU_ID, alreadySeenLine, arenaWhy, clanOf, duelOpen, groupOf, personOf, warLeadNote } from "@/lib/seed";
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
  const proofs = useLink((s) => s.proofs);
  const raid = useLink((s) => s.raid);
  const duels = useLink((s) => s.duels);
  const accept = useLink((s) => s.acceptDuel);
  const incoming = duels.filter((d) => duelOpen(d) && d.toId === "vitor");
  const judged = duels.find((d) => d.veredito && (d.fromId === YOU_ID || d.toId === YOU_ID));
  const faixa = judged?.veredito?.faixa[YOU_ID];
  const sheet = applyLast(PRESCRIPTION.items, lastLoads);
  const climb = sheet.find((it) => it.last_kg != null && it.load_kg > it.last_kg);
  const weekLeft = Math.max(0, 4 - weekCount(proofs, YOU_ID));
  const nextMark =
    climb && climb.last_kg != null
      ? `faltam ${formatKg(climb.load_kg - climb.last_kg)} kg no ${climb.name.toLowerCase()}`
      : `faltam ${weekLeft} ${weekLeft === 1 ? "sessão" : "sessões"} para 4/semana`;
  const clanName = clan?.name ?? groups.find((g) => joined.includes(g.id))?.name;
  const why = arenaWhy();

  return (
    <Screen>
      <Pad className="flex items-end justify-between pt-1 pb-4">
        <div>
          <p className="t-body">{clanName ?? "Sem clã"}</p>
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
              <Shot src={lastProof?.image ?? "/feed/supino.jpg"} still square />
              <p className="t-body">Sessão fechada · hoje</p>
              <h1 className="t-body mt-1">{lastProof?.title ?? PRESCRIPTION.name}</h1>
              <p className="t-body mt-3">
                {lastProof
                  ? `${lastProof.sets} ${lastProof.sets === 1 ? "série" : "séries"} · ${lastProof.minutes || 1} min · ${lastProof.lead ?? lastProof.title}`
                  : alreadySeenLine(seen)}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="t-body">{ofensiva}</p>
                  <p className="t-small">semanas na ofensiva</p>
                </div>
                <Stamp />
              </div>
              <p className="t-small mt-4">{alreadySeenLine(seen)} Amanhã é outro.</p>
              {faixa ? (
                <div className="mt-6">
                  <MarkStrip
                    body
                    mark={faixa.match(/(\d+(?:[.,]\d+)?)/)?.[1] ?? String(judged?.mark ?? "—")}
                    line={faixa}
                  />
                </div>
              ) : null}
              <Quiet label="Recomeçar o proto" danger onPress={() => useLink.getState().reset()} />
            </>
          ) : sheet.length ? (
            <>
              <p className="t-body">O de hoje</p>
              <h1 className="t-body mt-1">{PRESCRIPTION.name}</h1>
              <ul className="mt-5">
                {sheet.map((item) => {
                  const delta = item.last_kg != null ? item.load_kg - item.last_kg : null;
                  const mark =
                    delta == null ? `${item.planned_sets} × ${item.planned_reps}` : delta === 0 ? "igual" : delta > 0 ? "acima" : "abaixo";
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
                          {item.planned_sets} × {item.planned_reps}
                        </span>
                      </span>
                      <span className="t-body tabular-nums">{mark}</span>
                    </button>
                  </li>
                  );
                })}
              </ul>
              <p className="t-small mt-3">{nextMark}</p>
              <div className="mt-2 flex gap-2">
                <Quiet label="Última vez" onPress={() => start("ultima")} />
                <Quiet label="Treino livre" onPress={() => open("livre")} />
              </div>
            </>
          ) : (
            <NoSheet onUltima={() => start("ultima")} onLivre={() => open("livre")} />
          )}
          {cumprido ? null : sheet.length ? (
            <>
              <button
                type="button"
                className="mt-6 flex min-h-11 items-baseline gap-3 text-left"
                onClick={paused ? resume : () => start("ficha")}
              >
                <span className="t-body">{paused ? "Continuar no rack" : "Começar"}</span>
                {paused ? null : <span className="t-small">{PRESCRIPTION.minutes} min</span>}
              </button>
              {faixa ? (
                <div className="mt-6">
                  <MarkStrip
                    body
                    mark={faixa.match(/(\d+(?:[.,]\d+)?)/)?.[1] ?? String(judged?.mark ?? "—")}
                    line={faixa}
                  />
                </div>
              ) : null}
            </>
          ) : null}
      </Pad>

      {incoming.length ? (
        <div className="px-5 py-5">
          <p className="t-body">Te pegaram</p>
          {incoming.map((d) => (
            <div key={d.id} className="mt-3 flex items-center justify-between gap-3">
              <button type="button" className="flex h-12 min-w-0 items-center gap-3" onClick={() => openProof(d.postId)}>
                <Face id={d.fromId} size={22} />
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

      <div className="min-h-[36vh]" aria-hidden />

      <button type="button" className="h-12 w-full px-5 py-5 text-left" onClick={() => open("raid")}>
        <p className="t-kicker">Raid · fecha {raid.ends}</p>
        <p className="t-body mt-1">{raid.mark}</p>
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
              <Face key={id} id={id} size={22} />
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
