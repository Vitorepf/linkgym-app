import { useState } from "react";
import { Quiet, Screen, Thumb } from "@/components/bits";
import { agoTs } from "@/lib/format";
import {
  AVATAR_COLORS,
  NOW,
  SPORT_LABEL,
  YOU_ID,
  arenaName,
  arenaWhy,
  bodyFact,
  bodyWeb,
  fichaOf,
  duelHistory,
  duelOpen,
  duelScore,
  personOf,
  resultOf,
  rivalOf,
  rivalsOf,
  roomLine,
} from "@/lib/seed";
import { useLink } from "@/lib/store";
import type { PostKind } from "@/lib/types";
import { DiaryRow } from "@/screens/post-card";
import {
  AtributoPlate,
  Block,
  Duo,
  Empty,
  Filters,
  Memory,
  WeekStrip,
  WinPlate,
  clanSpot,
  weekCount,
  weekDays,
} from "@/ui/feed";
import { Web } from "@/ui/charts";
import { Card, Chip, Reveal, Roll, Row, Scroll, SectionHead } from "@/ui/kit";
import { ObjectHead, PillButton, Portrait, Swatch } from "@/ui/photo";

/* ---------------------------------------------------------------------------
   O perfil é o objeto "você". Mesmo cabeçalho da prova e da pessoa, e duas
   escadas na primeira dobra: a sua posição na arena e o que você deu ao clã.
   Nenhuma delas é ranking mundial de indivíduo.
--------------------------------------------------------------------------- */

const FILTROS: { id: "tudo" | PostKind; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "feito", label: "Sessão" },
  { id: "foto", label: "Foto" },
  { id: "video", label: "Vídeo" },
];

export function Perfil() {
  const name = useLink((s) => s.name);
  const setName = useLink((s) => s.setName);
  const color = useLink((s) => s.avatarColor);
  const setColor = useLink((s) => s.setAvatarColor);
  const ofensiva = useLink((s) => s.ofensiva);
  const protector = useLink((s) => s.protector);
  const youRaids = useLink((s) => s.youRaids);
  const pago = useLink((s) => s.pagoMensal);
  const markPago = useLink((s) => s.markPago);
  const reset = useLink((s) => s.reset);
  const proofs = useLink((s) => s.proofs);
  const duels = useLink((s) => s.duels);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const war = useLink((s) => s.war);
  const openGroup = useLink((s) => s.openGroup);
  const openProof = useLink((s) => s.openProof);
  const openOverlay = useLink((s) => s.openOverlay);
  const loadBook = useLink((s) => s.loadBook);
  const decks = useLink((s) => s.decks);
  const startDeck = useLink((s) => s.startDeck);
  const setTab = useLink((s) => s.setTab);
  const setFichaSheet = useLink((s) => s.setFichaSheet);
  const selectDeck = useLink((s) => s.selectDeck);
  const cumprido = useLink((s) => s.cumprido);
  const session = useLink((s) => s.session);

  const [filtro, setFiltro] = useState<"tudo" | PostKind>("tudo");
  const [conta, setConta] = useState(false);
  const [draft, setDraft] = useState(name);

  const mine = proofs.filter((p) => p.personId === YOU_ID);
  const cover = mine.find((p) => p.image)?.image ?? null;
  const myClans = groups.filter((g) => joined.includes(g.id));
  const clan = myClans[0];
  const gave = war.contributions[YOU_ID] ?? 0;
  const days = weekDays(proofs, YOU_ID);
  const why = arenaWhy();
  const liveDuels = duels.filter((d) => (d.fromId === YOU_ID || d.toId === YOU_ID) && !d.veredito);
  const score = duelScore(YOU_ID, duels);
  const rivals = rivalsOf(YOU_ID, duels);
  const diary = filtro === "tudo" ? mine : mine.filter((p) => p.kind === filtro);
  const dirty = draft.trim() !== name && draft.trim() !== "";
  const mineDecks = decks.filter((d) => d.ownerId === YOU_ID);

  return (
    <Screen>
      <ObjectHead
        src={cover}
        portrait={YOU_ID}
        kicker={arenaName()}
        title={name}
        sub={clan ? `${clan.name} · ${SPORT_LABEL[clan.kind]}` : "Ainda sem clã"}
      />
      <div className="px-5">
        <Duo
          a={{ k: "semana", v: String(weekCount(proofs, YOU_ID)), unit: "dias" }}
          b={{ k: "clã", v: String(gave), unit: "sessões" }}
        />
        {why ? <p className="t-small mt-3">{why}</p> : null}
        <div className="mt-5">
          <WinPlate
            faces={rivals.map((p) => p.id)}
            wins={score.venceu}
            onPress={score.total ? () => openOverlay("duelos") : undefined}
          />
        </div>
        <div className="mt-5">
          <Thumb label="Publicar" onPress={() => openOverlay("composer")} meta="foto, vídeo ou texto" />
        </div>
      </div>

      <Reveal className="mt-7 px-5">
        <AtributoPlate ficha={fichaOf(YOU_ID)} onOpen={openProof} />
        <Card className="mt-3 px-2 pb-2 pt-3">
          <Web axes={bodyWeb(loadBook)} />
          <p className="t-small px-3 pb-3 text-center">{bodyFact(bodyWeb(loadBook))}</p>
        </Card>
      </Reveal>

      <div className="mt-7">
        <Block
          head="Decks"
          action="abrir"
          onAction={() => {
            setFichaSheet("decks");
            setTab("ficha");
          }}
        >
          {mineDecks.length ? (
            mineDecks.map((d, i) => (
              <Row
                key={d.id}
                title={d.name}
                sub={`${d.about} · ${d.fichaIds.length} ${d.fichaIds.length === 1 ? "ficha" : "fichas"}`}
                value={session && session.kind === "deck" ? "aberta" : "começar"}
                onPress={() => {
                  selectDeck(d.id);
                  if (cumprido) {
                    setFichaSheet("decks");
                    setTab("ficha");
                    return;
                  }
                  startDeck(d.id);
                }}
                last={i === mineDecks.length - 1}
              />
            ))
          ) : null}
        </Block>
        {mineDecks.length ? null : (
          <Empty
            glyph="star"
            title="Escreva um deck"
            line="Uma pilha de fichas com o corpo que você quer. A escrita mora na aba Ficha."
          />
        )}
      </div>

      <Reveal className="mt-7 px-5">
        <Card className="p-4">
          <SectionHead>ofensiva</SectionHead>
          <div className="mt-1 flex items-end justify-between gap-4">
            <p className="t-score">
              <Roll value={ofensiva} />
            </p>
            <div className="pb-2">
              <WeekStrip days={days} label={`${weekCount(proofs, YOU_ID)} dias com sessão nesta semana`} />
            </div>
          </div>
          <p className="t-small mt-3">
            {protector ? "1 protetor" : "sem protetor"}
            {" · "}
            {youRaids} raids
            {" · "}
            {weekCount(proofs, YOU_ID)} dias na semana
          </p>
        </Card>
      </Reveal>

      <div className="mt-7">
        <Memory
          posts={mine}
          onOpen={openProof}
          empty={{
            title: "Feche a primeira sessão",
            line: "Ela vira o começo. Daqui a um tempo, este é o lado esquerdo.",
          }}
        />
      </div>

      <div className="mt-7">
        <Block head="Diário">
          <Filters value={filtro} onChange={setFiltro} options={FILTROS} />
          {diary.length ? (
            <div className="mt-1">
              {diary.map((p, i) => (
                <DiaryRow key={p.id} post={p} last={i === diary.length - 1} />
              ))}
            </div>
          ) : null}
        </Block>
        {diary.length ? null : mine.length ? (
          <Empty glyph="text" title="Tire o filtro" line="Você ainda não tem post deste tipo. O resto do diário está atrás do filtro." />
        ) : (
          <Empty glyph="text" title="Feche a primeira sessão" line="Cada sessão fechada no rack vira uma linha aqui, com peso e tempo." />
        )}
      </div>

      {liveDuels.length ? (
        <div className="mt-7">
          <Block head="1 contra 1">
            {liveDuels.map((d, i) => {
              const other = d.fromId === YOU_ID ? d.toId : d.fromId;
              return (
                <Row
                  key={d.id}
                  leading={<Portrait id={other} size={36} />}
                  title={personOf(other).name}
                  sub={d.mark}
                  value={<span className="t-small">{duelOpen(d) ? "aberta" : "aceita"}</span>}
                  onPress={() => openProof(d.postId)}
                  last={i === liveDuels.length - 1}
                />
              );
            })}
          </Block>
        </div>
      ) : null}

      <div className="mt-7">
        <Block head="Clãs">
          {myClans.length ? (
            myClans.map((g, i) => {
              const pos = clanSpot(groups, g.id);
              return (
                <Row
                  key={g.id}
                  title={g.name}
                  sub={`${SPORT_LABEL[g.kind]} · ${roomLine(g)}`}
                  value={`${pos.pos}º`}
                  valueSub={`de ${pos.of}`}
                  onPress={() => openGroup(g.id)}
                  last={i === myClans.length - 1}
                />
              );
            })
          ) : null}
        </Block>
        {myClans.length ? null : (
          <Empty
            glyph="star"
            title="Entre em um clã"
            line="Clã é gente que você não conhece. Havendo vaga, entra quem chegar."
          />
        )}
      </div>

      <div className="mt-7 mb-4">
        <Block head="Conta" action={conta ? "fechar" : "abrir"} onAction={() => setConta((v) => !v)}>
          {conta ? (
            <Reveal>
              <label className="block">
                <span className="t-small">Seu nome</span>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 40))}
                  maxLength={40}
                  className="t-body mt-1 w-full rounded-sm border border-edge bg-raised px-3 py-2.5 text-ink outline-none focus:border-ink"
                />
                <span className="t-mono mt-1 block text-right text-faint tabular-nums">{draft.length}/40</span>
              </label>

              <div className="mt-3 flex flex-wrap gap-1">
                {AVATAR_COLORS.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    className="press flex size-11 items-center justify-center rounded-sm"
                    aria-label={`Cor ${i + 1}`}
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                  >
                    <Swatch color={c} on={color === c} size={34} />
                  </button>
                ))}
              </div>

              {dirty ? (
                <div className="mt-4">
                  <Quiet label="Salvar nome" onPress={() => setName(draft.trim())} />
                </div>
              ) : null}

              <p className="t-small mt-6">
                O Link não cobra nada. Quando você marca, quem vê é o seu clã.
              </p>
              <Row
                title="Já paguei este mês"
                value={pago ? <Chip tone="done">pago</Chip> : <Chip tone="quiet">em aberto</Chip>}
                onPress={pago ? undefined : markPago}
                last
              />

              <div className="mt-5">
                <Quiet label="Recomeçar o proto" danger onPress={reset} />
              </div>
            </Reveal>
          ) : null}
        </Block>
      </div>
    </Screen>
  );
}

const RESULT_WORD = { venceu: "venceu", empatou: "empate", perdeu: "perdeu" } as const;

export function Duelos() {
  const close = useLink((s) => s.closeOverlay);
  const openProof = useLink((s) => s.openProof);
  const duels = useLink((s) => s.duels);
  const score = duelScore(YOU_ID, duels);
  const history = duelHistory(YOU_ID, duels);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <div className="px-5 pt-3">
          <PillButton label="Voltar" glyph="back" onPress={close} mute />
          <p className="t-kicker mt-5">1 contra 1</p>
          <h1 className="t-display mt-1">Histórico</h1>
          <div className="mt-5">
            <Duo a={{ k: "vitórias", v: String(score.venceu) }} b={{ k: "derrotas", v: String(score.perdeu) }} />
            {score.empatou ? (
              <p className="t-small mt-3">
                {score.empatou} {score.empatou === 1 ? "empate" : "empates"}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-7">
          {history.length ? (
            <div className="px-5">
              {history.map((d, i) => {
                const rival = rivalOf(d);
                const result = resultOf(d);
                const faixa = d.veredito?.faixa[YOU_ID];
                return (
                  <Row
                    key={d.id}
                    leading={<Portrait id={rival.id} size={36} />}
                    title={d.mark}
                    sub={`${rival.name} · ${agoTs(d.veredito!.fechadoEm, NOW.getTime())}`}
                    value={RESULT_WORD[result]}
                    valueSub={faixa}
                    onPress={() => openProof(d.postId)}
                    last={i === history.length - 1}
                    dim={result === "perdeu"}
                  />
                );
              })}
            </div>
          ) : (
            <Empty glyph="bolt" title="Nenhum duelo ainda" line="Desafie alguém. O app mede e declara." />
          )}
        </div>
      </Scroll>
    </div>
  );
}
