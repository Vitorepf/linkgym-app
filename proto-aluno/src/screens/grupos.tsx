import { useState } from "react";
import { Display, Face, Place, Quiet, Thumb } from "@/components/bits";
import { Dock } from "@/components/shell";
import {
  CATALOG,
  SPORT_LABEL,
  YOU_ID,
  clanOf,
  groupOf,
  hasRoom,
  personOf,
  roomLine,
  warLeadNote,
  weekOf,
} from "@/lib/seed";
import { applyLast, useLink } from "@/lib/store";
import { formatKg } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ClanKind } from "@/lib/types";
import { Dots, Empty, Meter, Pick, Punch, WarBoard } from "@/ui/board";
import { Card, Chip, Reveal, Row, Scroll, SectionHead } from "@/ui/kit";

/* ---------------------------------------------------------------------------
   As sobreposições da Rede. Clã, guerra, raid, desafio, treino livre e criação.

   Um clã não é turma: ninguém conhece ninguém, ele tem tipo, tem descrição
   escrita por quem criou, e a única porta é o teto. Não existe código, convite
   nem requisito de entrada, então a cena do clã só precisa responder três
   coisas para um estranho: o que é isto, quem está, e cabe mais um.

   Orçamento que vale em todas: exatamente 1 botão preenchido por cena, ou zero
   quando a cena não tem ação nenhuma, e nenhuma régua desenhada dentro da cena.
   Lista é agrupada por superfície e por espaço, nunca por linha entre linhas.
--------------------------------------------------------------------------- */

/** Quantas sessões a pessoa fechou nesta semana. */
function weekSessionsOf(id: string): number {
  return weekOf(id).days.filter((n) => n > 0).length;
}

export function Grupo() {
  const id = useLink((s) => s.selectedGroupId);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const leave = useLink((s) => s.leaveGroup);
  const enter = useLink((s) => s.enterOpenGroup);
  const open = useLink((s) => s.openOverlay);
  const close = useLink((s) => s.closeOverlay);
  const openPerson = useLink((s) => s.openPerson);
  const challenges = useLink((s) => s.challenges);
  const war = useLink((s) => s.war);
  const you = useLink((s) => s.name);
  const g = groupOf(id ?? groups[0]!.id, groups);
  const mine = joined.includes(g.id);
  const room = hasRoom(g);
  const chs = challenges.filter((c) => c.groupId === g.id);
  const others = g.memberIds.filter((m) => m !== YOU_ID);
  const inWar = g.id === war.homeId || g.id === war.awayId;
  const top = Math.max(1, ...g.memberIds.map(weekSessionsOf));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>{SPORT_LABEL[g.kind]}</Place>
          <Display className="mt-1">{g.name}</Display>
          <p className="t-body mt-3 text-mute">{g.about}</p>
          <Meter n={g.memberIds.length} of={g.cap} className="mt-5" />
          <p className="t-small mt-2">
            {g.memberIds.length} de {g.cap} no teto · {g.weekSessions} sessões nesta semana
          </p>
          {inWar ? (
            <div className="mt-3">
              <Chip tone="live">Guerra</Chip>
            </div>
          ) : null}
        </Reveal>

        {chs.length ? (
          <Reveal i={1} className="mt-6 px-5">
            <SectionHead>Cartão do clã</SectionHead>
            <Card className="mt-3" onPress={() => open("desafio")} label={chs[0]!.title}>
              <div className="px-4 py-4">
                <p className="t-body">{chs[0]!.title}</p>
                <div className="mt-3">
                  <Punch days={chs[0]!.days} done={chs[0]!.doneSessions} goal={chs[0]!.goalSessions} />
                </div>
                <p className="t-small mt-3">
                  {chs[0]!.doneSessions} de {chs[0]!.goalSessions} · fecha {chs[0]!.ends}
                </p>
              </div>
            </Card>
          </Reveal>
        ) : null}

        <Reveal i={2} className="mt-6 px-5">
          <SectionHead>Quem está</SectionHead>
          <p className="t-small mt-1">{roomLine(g)}</p>
          {others.length ? (
            <Card className="mt-3">
              <div className="px-4">
                {g.memberIds.map((mid) => {
                  const p = personOf(mid);
                  const me = mid === YOU_ID;
                  return (
                    <Row
                      key={mid}
                      last
                      leading={<Face id={mid} size={36} ring={me} />}
                      title={me ? you : p.name}
                      sub={SPORT_LABEL[p.sport]}
                      value={<Dots n={weekSessionsOf(mid)} of={top} />}
                      onPress={() => openPerson(mid)}
                    />
                  );
                })}
              </div>
            </Card>
          ) : (
            <div className="mt-3">
              <Empty title="Só você neste clã" line="Entra quem chegar, sem código e sem pedir." />
            </div>
          )}
        </Reveal>

        {mine ? (
          <Reveal i={3} className="mt-6 px-5">
            <Quiet label="Sair do clã" danger onPress={() => leave(g.id)} />
          </Reveal>
        ) : null}
      </Scroll>

      <Dock>
        <Thumb
          label={mine ? "Criar cartão" : room ? "Entrar no clã" : "Lotado"}
          disabled={!mine && !room}
          onPress={() => (mine ? open("desafio") : enter(g.id))}
        />
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

/**
 * Clã contra clã na semana. Quem já pontuou e quem ainda não são dois grupos
 * separados, então a palavra do estado aparece uma vez por grupo e a linha fica
 * só com o glifo. É o mesmo desenho da escada da arena, com outro recorte.
 */
export function Guerra() {
  const close = useLink((s) => s.closeOverlay);
  const openGroup = useLink((s) => s.openGroup);
  const war = useLink((s) => s.war);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const you = useLink((s) => s.name);
  const home = groupOf(war.homeId, groups);
  const away = groupOf(war.awayId, groups);
  const clan = clanOf(war, joined, groups);
  const rival = clan?.id === home.id ? away : home;
  const rows = clan
    ? clan.memberIds
        .map((id) => ({ id, n: war.contributions[id] ?? 0 }))
        .sort((a, b) => b.n - a.n)
    : [];
  const top = Math.max(1, ...rows.map((r) => r.n));
  const came = rows.filter((r) => r.n > 0);
  const late = rows.filter((r) => r.n === 0);

  const list = (items: { id: string; n: number }[], dim?: boolean) => (
    <Card className="mt-3">
      <div className="px-4">
        {items.map((r) => {
          const p = personOf(r.id);
          const me = r.id === YOU_ID;
          return (
            <Row
              key={r.id}
              last
              dim={dim}
              leading={<Face id={r.id} size={36} ring={me} />}
              title={me ? you : p.name}
              sub={SPORT_LABEL[p.sport]}
              value={<Dots n={r.n} of={top} />}
            />
          );
        })}
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Fecha {war.ends}</Place>
          <Display className="mt-1">Guerra de clã</Display>
        </Reveal>

        <Reveal i={1} className="mt-5 px-5">
          <WarBoard
            ends={war.ends}
            homeName={home.name}
            homeScore={war.homeScore}
            awayName={away.name}
            awayScore={war.awayScore}
            note={warLeadNote(war, home, away)}
            onPress={() => openGroup(rival.id)}
          />
        </Reveal>

        {clan ? (
          <Reveal i={2} className="mt-6 px-5">
            <SectionHead>Já pontuou</SectionHead>
            {came.length ? (
              list(came)
            ) : (
              <div className="mt-3">
                <Empty title="Feche uma sessão" line={`Ninguém do ${clan.name} pontuou ainda.`} />
              </div>
            )}
          </Reveal>
        ) : null}

        {late.length ? (
          <Reveal i={3} className="mt-6 px-5">
            <SectionHead>Ainda não veio</SectionHead>
            {list(late, true)}
          </Reveal>
        ) : null}
      </Scroll>

      <Dock>
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

export function Livre() {
  const picked = useLink((s) => s.livrePicked);
  const toggle = useLink((s) => s.toggleLivre);
  const start = useLink((s) => s.startLivre);
  const close = useLink((s) => s.closeOverlay);
  const lastLoads = useLink((s) => s.lastLoads);
  const catalog = applyLast(CATALOG, lastLoads);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Hoje</Place>
          <Display className="mt-1">Treino livre</Display>
        </Reveal>

        <Reveal i={1} className="mt-5 px-5">
          <Card>
            <div className="px-4">
              {catalog.map((ex) => (
                <Row
                  key={ex.id}
                  last
                  leading={<Pick on={picked.includes(ex.id)} />}
                  title={ex.name}
                  sub={
                    ex.last_kg != null
                      ? `última ${formatKg(ex.last_kg)} × ${ex.last_reps}`
                      : `${ex.planned_sets} × ${ex.planned_reps} · ${formatKg(ex.load_kg)}`
                  }
                  onPress={() => toggle(ex.id)}
                />
              ))}
            </div>
          </Card>
        </Reveal>
      </Scroll>

      <Dock>
        <Thumb
          label={`Começar · ${picked.length}`}
          disabled={picked.length === 0}
          onPress={start}
        />
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

export function Desafio() {
  const close = useLink((s) => s.closeOverlay);
  const create = useLink((s) => s.createChallenge);
  const challenges = useLink((s) => s.challenges);
  const groups = useLink((s) => s.groups);
  const gid = useLink((s) => s.selectedGroupId);
  const mine = challenges.filter((c) => gid && c.groupId === gid);
  const g = gid ? groupOf(gid, groups) : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>{g?.name ?? "Clã"}</Place>
          <Display className="mt-1">Cartão do clã</Display>
        </Reveal>

        {mine.map((c, i) => (
          <Reveal key={c.id} i={i + 1} className="mt-5 px-5">
            <Card>
              <div className="px-4 py-4">
                <p className="t-body">{c.title}</p>
                <div className="mt-3">
                  <Punch days={c.days} done={c.doneSessions} goal={c.goalSessions} />
                </div>
                <p className="t-small mt-3">
                  {c.doneSessions} de {c.goalSessions} · fecha {c.ends}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}

        {mine.length === 0 ? (
          <Reveal i={1} className="mt-5 px-5">
            <Empty title="Crie um cartão" line="Nenhum cartão neste clã." />
          </Reveal>
        ) : null}

        <Reveal i={2} className="mt-6 px-5">
          <Quiet label="30 dias · 12 sessões" disabled={!gid} onPress={() => create(30, 12)} />
        </Reveal>
      </Scroll>

      <Dock>
        <Thumb label="7 dias · 4 sessões" disabled={!gid} onPress={() => create(7, 4)} />
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

const KINDS: ClanKind[] = [
  "powerlifting",
  "crossfit",
  "hipertrofia",
  "corrida",
  "calistenia",
  "luta",
  "geral",
];

const ABOUT_MAX = 140;

export function CriarGrupo() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ClanKind>("powerlifting");
  const [about, setAbout] = useState("");
  const create = useLink((s) => s.createGroup);
  const close = useLink((s) => s.closeOverlay);
  const ready = name.trim().length > 1 && about.trim().length > 9;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Novo</Place>
          <Display className="mt-1">Criar clã</Display>
        </Reveal>

        <Reveal i={1} className="mt-6 px-5">
          <Place>Nome</Place>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ferro Bruto"
            maxLength={28}
            aria-label="Nome do clã"
            className="mt-2 h-12 w-full rounded-sm border border-edge bg-transparent px-3 t-body text-ink outline-none placeholder:text-faint"
          />
        </Reveal>

        <Reveal i={2} className="mt-7 px-5">
          <Place>Tipo</Place>
          <div className="mt-2 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                className={cn(
                  "press h-12 rounded-sm border px-3 t-body",
                  kind === k ? "border-ink text-ink" : "border-line text-mute",
                )}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                {SPORT_LABEL[k]}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal i={3} className="mt-7 px-5">
          <Place>Descrição</Place>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Quem entra aqui treina o quê, e como."
            maxLength={ABOUT_MAX}
            aria-label="Descrição do clã"
            className="mt-2 min-h-[88px] w-full rounded-sm border border-edge bg-transparent p-3 t-body text-ink outline-none placeholder:text-faint"
          />
          <p className="t-small mt-2">
            {ABOUT_MAX - about.length} restam. É o que um estranho lê antes de entrar.
          </p>
        </Reveal>
      </Scroll>

      <Dock>
        <Thumb label="Abrir o clã" disabled={!ready} onPress={() => create(name, kind, about)} />
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

export function RaidBoard() {
  const raid = useLink((s) => s.raid);
  const youRaids = useLink((s) => s.youRaids);
  const claim = useLink((s) => s.claimRaid);
  const cumprido = useLink((s) => s.cumprido);
  const close = useLink((s) => s.closeOverlay);
  const you = useLink((s) => s.name);
  const done = raid.claimed.includes(YOU_ID);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Raid · fecha {raid.ends}</Place>
          <Display className="mt-1">{raid.mark}</Display>
          <p className="t-small mt-3">
            {youRaids} {youRaids === 1 ? "raid" : "raids"} na sua conta.
          </p>
        </Reveal>

        <Reveal i={1} className="mt-6 px-5">
          <SectionHead>Quem já fez</SectionHead>
          {raid.claimed.length ? (
            <Card className="mt-3">
              <div className="px-4">
                {raid.claimed.map((id) => {
                  const p = personOf(id);
                  const me = id === YOU_ID;
                  return (
                    <Row
                      key={id}
                      last
                      leading={<Face id={id} size={36} ring={me} />}
                      title={me ? you : p.name}
                      sub={SPORT_LABEL[p.sport]}
                      value={<Dots n={1} of={1} label="fez" />}
                    />
                  );
                })}
              </div>
            </Card>
          ) : (
            <div className="mt-3">
              <Empty title="Seja o primeiro" line="Ninguém fechou a raid desta semana." />
            </div>
          )}
        </Reveal>
      </Scroll>

      <Dock>
        <Thumb
          label={done ? "Já no seu nome" : cumprido ? "Registrar raid" : "Feche a sessão primeiro"}
          disabled={done || !cumprido}
          onPress={claim}
        />
        <Quiet label="Voltar" onPress={() => close()} />
      </Dock>
    </div>
  );
}

/**
 * Ponte até `app-root.tsx` trocar o mapa de sobreposição. O mapa ainda carrega
 * as chaves `unidade` e `convite`, que saíram do tipo `Overlay` junto com a
 * academia e o código de convite. Nenhuma das duas tem quem as abra, mas sem
 * estes dois nomes o app nem carrega. Ver pedido de fundação no relatório.
 */
export const Unidade = Grupo;
export const Convite = Grupo;
