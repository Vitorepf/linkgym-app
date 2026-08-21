import { Face, Screen } from "@/components/bits";
import {
  SPORT_LABEL,
  TERRITORY,
  YOU_ID,
  arenaName,
  arenaPeople,
  arenaWhy,
  clanLadder,
  clanOf,
  groupOf,
  hasRoom,
  matesOf,
  personOf,
  personSpot,
  warLeadNote,
} from "@/lib/seed";
import { useLink } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Group, RedeBoard } from "@/lib/types";
import { PostCard } from "@/screens/post-card";
import { ArenaHead, Dots, Empty, WarBoard } from "@/ui/board";
import { Card, Reveal, Row, SectionHead } from "@/ui/kit";

/* ---------------------------------------------------------------------------
   Rede: onde o estranho aparece. Três quadros, e nenhum deles é uma tabela.

   O quadro do meio é a arena, mas o id dele em `src/lib/types.ts` ainda é
   `guerra`, que é o nome antigo. O rótulo manda, o id é herança.

   Nenhum dos três tem botão preenchido: a ação primária de cada um é uma linha
   ou um cartão de largura total, marcado por área e por posição. A aba ativa é
   marcada só por claridade de texto e um degrau de fundo, sem régua em volta.
--------------------------------------------------------------------------- */

const BOARDS: [RedeBoard, string][] = [
  ["feed", "Feed"],
  ["guerra", "Arena"],
  ["grupos", "Clãs"],
];

export function Rede() {
  const board = useLink((s) => s.redeBoard);
  const setBoard = useLink((s) => s.setRedeBoard);

  return (
    <Screen>
      <div className="flex gap-1 px-4 pt-1 pb-3">
        {BOARDS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "press h-12 rounded-sm px-3 t-body",
              board === id ? "bg-surface text-ink" : "text-mute",
            )}
            aria-current={board === id ? "page" : undefined}
            onClick={() => setBoard(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {board === "feed" ? <Feed /> : board === "guerra" ? <Arena /> : <Clas />}
    </Screen>
  );
}

/** O que as pessoas escreveram. Quem não conhece ninguém começa lendo. */
export function Feed() {
  const proofs = useLink((s) => s.proofs);
  const open = useLink((s) => s.openOverlay);
  const openPerson = useLink((s) => s.openPerson);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const pinned = useLink((s) => s.pinnedIds);
  const mates = matesOf(joined, groups).sort(
    (a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id)),
  );
  const ranked = [...proofs].sort((a, b) => {
    const ap = pinned.includes(a.personId) ? 0 : 1;
    const bp = pinned.includes(b.personId) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.hoursAgo - b.hoursAgo;
  });

  return (
    <div>
      <button
        type="button"
        className="press flex h-12 w-full items-center gap-3 px-4 text-left"
        onClick={() => open("composer")}
      >
        <Face id={YOU_ID} size={36} />
        <span className="t-body text-mute">O que rolou. Texto, foto ou vídeo.</span>
      </button>

      {mates.length ? (
        <div className="scroll flex gap-2 overflow-x-auto px-4 pb-3">
          {mates.map((p) => (
            <button
              key={p.id}
              type="button"
              className="press flex size-11 shrink-0 items-center justify-center rounded-sm"
              aria-label={p.name}
              onClick={() => openPerson(p.id)}
            >
              <Face id={p.id} size={36} ring={pinned.includes(p.id)} />
            </button>
          ))}
        </div>
      ) : null}

      {ranked.length ? (
        ranked.map((p, i) => (
          <Reveal key={p.id} i={i}>
            <PostCard post={p} />
          </Reveal>
        ))
      ) : (
        <div className="px-4">
          <Empty
            title="Poste o primeiro"
            line="Ninguém publicou nada por aqui."
            action="Postar"
            onAction={() => open("composer")}
          />
        </div>
      )}
    </div>
  );
}

/**
 * A arena: você contra as pessoas do lugar onde você mora. O escopo é elástico,
 * então a primeira coisa da tela é qual escopo venceu e por quê. A palavra do
 * estado fica no cabeçalho do grupo; dentro da linha, estado é um glifo só, e
 * esse glifo já carrega o que a pessoa fez e o que o topo fez.
 */
export function Arena() {
  const ladder = useLink((s) => s.arenaLadder);
  const you = useLink((s) => s.name);
  const openPerson = useLink((s) => s.openPerson);
  const top = ladder[0]?.sessions ?? 0;
  const mine = ladder.find((r) => r.personId === YOU_ID);

  return (
    <div className="space-y-6 px-4 pb-6">
      <Reveal>
        <ArenaHead
          name={arenaName()}
          people={arenaPeople()}
          why={arenaWhy()}
          have={TERRITORY.setorAtivos}
          need={TERRITORY.setorMinimo}
          place={TERRITORY.setor}
        />
      </Reveal>

      <Reveal i={1}>
        <SectionHead>De pé nesta semana</SectionHead>
        {mine ? (
          <p className="t-small mt-1">
            Você fez {mine.sessions} sessões. O topo fez {top}.
          </p>
        ) : null}
        {ladder.length > 1 ? (
          <Card className="mt-3">
            <div className="px-4">
              {ladder.map((r) => {
                const p = personOf(r.personId);
                const me = r.personId === YOU_ID;
                return (
                  <Row
                    key={r.personId}
                    last
                    leading={<Face id={r.personId} size={36} ring={me} />}
                    title={me ? you : p.name}
                    sub={personSpot(p, p.groupIds)}
                    value={<Dots n={r.sessions} of={top} />}
                    onPress={() => openPerson(r.personId)}
                  />
                );
              })}
            </div>
          </Card>
        ) : (
          <div className="mt-3">
            <Empty title="Feche uma sessão" line={`Ninguém de pé em ${arenaName()} ainda.`} />
          </div>
        )}
      </Reveal>
    </div>
  );
}

function raidLine(n: number): string {
  if (n <= 0) return "sem raid";
  return `${n} ${n === 1 ? "raid" : "raids"}`;
}

function clanLine(g: Group): string {
  return `${SPORT_LABEL[g.kind]} · ${g.memberIds.length}/${g.cap}`;
}

/**
 * A segunda escada: o seu clã contra os outros. A ordem sai de `clanPower`, e a
 * linha mostra as duas parcelas que formam essa força em vez de mostrar o total
 * sozinho. A palavra que diz se dá para entrar mora no cabeçalho do grupo, uma
 * vez por grupo, nunca por linha.
 */
export function Clas() {
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const war = useLink((s) => s.war);
  const openGroup = useLink((s) => s.openGroup);
  const open = useLink((s) => s.openOverlay);
  const ladder = clanLadder(groups);
  const mine = ladder.filter((g) => joined.includes(g.id));
  const room = ladder.filter((g) => !joined.includes(g.id) && hasRoom(g));
  const full = ladder.filter((g) => !joined.includes(g.id) && !hasRoom(g));
  const clan = clanOf(war, joined, groups);
  const home = groupOf(war.homeId, groups);
  const away = groupOf(war.awayId, groups);

  const rows = (list: Group[], dim?: boolean) => (
    <Card className="mt-3">
      <div className="px-4">
        {list.map((g) => (
          <Row
            key={g.id}
            last
            dim={dim}
            title={g.name}
            sub={clanLine(g)}
            value={g.weekSessions}
            valueSub={raidLine(g.raids)}
            onPress={() => openGroup(g.id)}
          />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 px-4 pb-6">
      {clan ? (
        <Reveal>
          <WarBoard
            ends={war.ends}
            homeName={home.name}
            homeScore={war.homeScore}
            awayName={away.name}
            awayScore={war.awayScore}
            note={warLeadNote(war, home, away)}
            onPress={() => open("guerra")}
          />
        </Reveal>
      ) : null}

      <Reveal i={1}>
        <SectionHead>Seu clã</SectionHead>
        {mine.length ? (
          rows(mine)
        ) : (
          <div className="mt-3">
            <Empty title="Entre num clã" line="Havendo vaga, entra quem chegar." />
          </div>
        )}
      </Reveal>

      <Reveal i={2}>
        <SectionHead>Com vaga</SectionHead>
        {room.length ? (
          rows(room)
        ) : (
          <div className="mt-3">
            <Empty title="Crie o seu" line="Nenhum clã aberto agora." />
          </div>
        )}
      </Reveal>

      {full.length ? (
        <Reveal i={3}>
          <SectionHead>Lotado</SectionHead>
          {rows(full, true)}
        </Reveal>
      ) : null}

      <Reveal i={4}>
        <button
          type="button"
          className="press flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-edge t-body text-mute"
          onClick={() => open("criarGrupo")}
        >
          Criar clã
        </button>
      </Reveal>
    </div>
  );
}
