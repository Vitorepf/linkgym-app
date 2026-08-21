import { useState } from "react";
import { Quiet, Thumb } from "@/components/bits";
import { ago } from "@/lib/format";
import { BORAS, SPORT_LABEL, YOU_ID, arenaName, arenaWhy, duelOpen, fichaOf, groupOf, personOf } from "@/lib/seed";
import { useLink } from "@/lib/store";
import type { PostKind } from "@/lib/types";
import { DiaryRow, DuelOnPost } from "@/screens/post-card";
import {
  AtributoPlate,
  Block,
  Duo,
  Empty,
  Filters,
  Memory,
  Say,
  WeekStrip,
  attrsOf,
  markOf,
  metaOf,
  weekCount,
  weekDays,
} from "@/ui/feed";
import { ActionBar, Card, Chip, ObjectBar, Reveal, Roll, Row, Scroll, SectionHead } from "@/ui/kit";
import { Faces, Glyph, ObjectHead, PillButton, Portrait } from "@/ui/photo";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   As cenas sociais. O produto pressupõe que ninguém conhece ninguém: o que
   aproxima é a disputa, não o horário em comum. Nenhuma tela aqui sabe o que
   é academia, e todo endereço é texto escrito por uma pessoa.
--------------------------------------------------------------------------- */

/* ------------------------------------------------------------------- Bora */

export function Bora() {
  const going = useLink((s) => s.joinedBoras);
  const leave = useLink((s) => s.leaveBora);
  const boraZap = useLink((s) => s.boraZap);
  const close = useLink((s) => s.closeOverlay);
  const selected = useLink((s) => s.selectedBoraId);
  const myClans = useLink((s) => s.joinedGroupIds);
  const groups = useLink((s) => s.groups);
  const [pick, setPick] = useState<string | null>(selected ?? BORAS[0]?.id ?? null);

  const list = [...BORAS].sort((a, b) => Number(myClans.includes(b.groupId)) - Number(myClans.includes(a.groupId)));
  const chosen = list.find((r) => r.id === pick);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <div className="px-5 pt-3">
          <SectionHead>{arenaName()}</SectionHead>
          <h1 className="t-title mt-1">Bora</h1>
          <p className="t-small mt-2 max-w-[36ch]">
            Encontro de gente que se conheceu aqui dentro. O endereço é o que o anfitrião escreveu.
          </p>
        </div>

        {list.length ? (
          <div className="mt-4 space-y-2 px-5">
            {list.map((r, i) => {
              const on = pick === r.id;
              const inList = going.includes(r.id);
              const crowd = inList ? [...r.going, YOU_ID] : r.going;
              const clan = groupOf(r.groupId, groups);
              return (
                <Reveal key={r.id} i={i}>
                  <Card
                    tone="surface"
                    onPress={() => setPick(r.id)}
                    label={r.title}
                    className={cn("p-4", on && "ring-2 ring-ink")}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="t-kicker">
                        {r.when} · {r.hour}
                      </p>
                      {on ? <Chip tone="done">escolhido</Chip> : null}
                    </div>
                    <p className="t-body mt-2">{r.title}</p>
                    <p className="t-small mt-1">{r.address}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Faces ids={crowd} size={24} />
                      <span className="t-small">
                        <Roll value={crowd.length} /> de {r.capacity} · {clan.name}
                      </span>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Empty
            glyph="clock"
            title="Marque o primeiro"
            line="Ninguém da sua arena marcou nada ainda. Quando marcar, o combinado aparece aqui."
          />
        )}

        {chosen && going.includes(chosen.id) ? (
          <div className="mt-4 px-5">
            <Quiet label="Sair da lista" onPress={() => leave(chosen.id)} />
          </div>
        ) : null}
      </Scroll>

      <ActionBar>
        <Thumb
          label={chosen ? "Bora · abrir o Zap" : "Voltar"}
          meta={chosen?.title}
          onPress={() => (chosen ? boraZap(chosen.id) : close())}
        />
      </ActionBar>
    </div>
  );
}

/* -------------------------------------------------------------------- Zap */

export function Zap() {
  const name = useLink((s) => s.name);
  const id = useLink((s) => s.selectedBoraId) ?? BORAS[0]!.id;
  const bora = BORAS.find((r) => r.id === id) ?? BORAS[0]!;
  const close = useLink((s) => s.closeOverlay);
  const host = personOf(bora.hostId);
  const text = `Bora ${bora.title} ${bora.when} ${bora.hour} — ${bora.address} (${name})`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <div className="px-5 pt-4">
          <SectionHead>WhatsApp</SectionHead>
          <h1 className="t-title mt-1">Avisar quem vai</h1>
        </div>
        <div className="mt-5 px-5">
          <div className="max-w-[80%] rounded-sm rounded-tl-none bg-surface px-3 py-2.5">
            <p className="t-small">{host.name}</p>
            <p className="t-body mt-1">{bora.address}. Quem vem?</p>
            <p className="t-small mt-2 text-faint">17:58</p>
          </div>
          <div className="mt-3 ml-auto max-w-[85%] rounded-sm rounded-tr-none bg-raised px-3 py-2.5">
            <p className="t-body">{text}</p>
            <p className="t-small mt-2 text-right text-faint">18:04</p>
          </div>
        </div>
      </Scroll>
      <ActionBar>
        <Thumb
          label="Abrir o WhatsApp"
          onPress={() => {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
          }}
        />
        <Quiet label="Voltar" onPress={() => close()} />
      </ActionBar>
    </div>
  );
}

/* ------------------------------------------------------------------ Prova */

export function Prova() {
  const id = useLink((s) => s.selectedProofId);
  const proofs = useLink((s) => s.proofs);
  const taPagoGiven = useLink((s) => s.taPagoGiven);
  const givePago = useLink((s) => s.givePago);
  const speak = useLink((s) => s.speakOnProof);
  const challenge = useLink((s) => s.challengePost);
  const close = useLink((s) => s.closeOverlay);
  const openPerson = useLink((s) => s.openPerson);
  const name = useLink((s) => s.name);
  const duels = useLink((s) => s.duels);

  const proof = proofs.find((p) => p.id === id);
  const duel = proof
    ? (duels.find((d) => duelOpen(d) && d.postId === proof.id) ?? duels.find((d) => d.postId === proof.id))
    : undefined;
  if (!proof) return null;

  const who = proof.personId === YOU_ID ? name : personOf(proof.personId).name;
  const cheers = proof.cheers ?? [];
  const seen = taPagoGiven.includes(proof.id) || cheers.includes(YOU_ID);
  const own = proof.personId === YOU_ID;
  const canDuel = !own && (proof.kind === "feito" || proof.kind === "video");
  const attrs = attrsOf(proof);
  const rest = attrs.slice(2);
  const done = own || (seen && (!canDuel || Boolean(duel)));

  /**
   * Uma primária só, e ela é sempre a próxima coisa a fazer: pagar, cobrar, ou
   * sair. Nunca um botão desligado dizendo que não dá.
   */
  const primary: { label: string; meta?: string; on: () => void } = done
    ? { label: "Voltar ao feed", on: () => close() }
    : !seen
      ? { label: "Tá pago", meta: `Para ${who}`, on: () => givePago(proof.id) }
      : { label: `Te pego no ${markOf(proof) || "treino"}`, on: () => challenge(proof.id) };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <ObjectHead
          src={proof.image}
          video={proof.video}
          tall
          portrait={proof.personId}
          kicker={metaOf(proof)}
          title={markOf(proof) || who}
          sub={markOf(proof) ? who : undefined}
          back={<PillButton label="Voltar" glyph="back" onPress={() => close()} mute />}
        >
          {attrs.length >= 2 ? (
            <div className="mt-4">
              <Duo a={attrs[0]!} b={attrs[1]!} />
            </div>
          ) : null}
        </ObjectHead>

        <div className="mt-4 px-5">
          {proof.caption ? <p className="t-body">{proof.caption}</p> : null}
          {rest.length ? (
            <p className="t-small mt-2">
              {rest.map((a) => `${a.v} ${a.unit ?? ""} de ${a.k}`.trim()).join(" · ")}
            </p>
          ) : null}
          {duel ? <DuelOnPost duel={duel} post={proof} name={name} /> : null}

          <div className="mt-4 flex items-center gap-2">
            <Faces ids={cheers} size={24} />
            <span className="t-small">
              {cheers.length ? (
                <>
                  <Roll value={cheers.length} /> deram Tá pago
                </>
              ) : (
                "Ninguém deu Tá pago ainda"
              )}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Block head={proof.comments.length ? `${proof.comments.length} falas` : "Falas"}>
            {proof.comments.length ? (
              <div>
                {proof.comments.slice(0, 2).map((c, i) => (
                  <Row
                    key={c.id}
                    leading={<Portrait id={c.personId} size={32} />}
                    title={c.personId === YOU_ID ? name : personOf(c.personId).name}
                    sub={c.text}
                    value={<span className="t-small">{ago(c.hoursAgo)}</span>}
                    onPress={() => openPerson(c.personId)}
                    last={i === Math.min(proof.comments.length, 2) - 1}
                  />
                ))}
                {proof.comments.length > 2 ? (
                  <p className="t-small mt-3">{proof.comments.length} falas no total</p>
                ) : null}
              </div>
            ) : (
              <p className="t-small">Seja o primeiro a falar aqui.</p>
            )}
            <div className="mt-3">
              <Say onSay={(t) => speak(proof.id, t)} />
            </div>
          </Block>
        </div>
      </Scroll>

      <ObjectBar value={markOf(proof) || who} guarantee={primary.meta ?? "Na arena"} action={primary.label} onAction={primary.on} />
    </div>
  );
}

/* ----------------------------------------------------------------- Pessoa */

export function Pessoa() {
  const id = useLink((s) => s.selectedPersonId);
  const close = useLink((s) => s.closeOverlay);
  const proofs = useLink((s) => s.proofs);
  const openProof = useLink((s) => s.openProof);
  const openGroup = useLink((s) => s.openGroup);
  const challenge = useLink((s) => s.challengePost);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);
  const pinned = useLink((s) => s.pinnedIds);
  const togglePin = useLink((s) => s.togglePin);

  const person = personOf(id ?? "marina");
  const own = person.id === YOU_ID;
  const posts = proofs.filter((p) => p.personId === person.id);
  const cover = posts.find((p) => p.image)?.image ?? null;
  const gids = own ? joined : person.groupIds;
  const clans = gids.map((g) => groupOf(g, groups));
  const clan = clans[0];
  const shared = gids.some((g) => joined.includes(g));
  const days = weekDays(proofs, person.id);
  const week = weekCount(proofs, person.id);
  const target = posts.find((p) => p.kind === "feito" || p.kind === "video");
  const onTop = pinned.includes(person.id);

  /* Você não conhece esta pessoa. A primária existe para te dar motivo. */
  const primary: { label: string; meta?: string; on: () => void } =
    !own && target
      ? {
          label: `Te pego no ${target.title || "treino"}`,
          meta: "A disputa é entre vocês dois",
          on: () => challenge(target.id),
        }
      : { label: "Voltar", on: () => close() };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <ObjectHead
          src={cover}
          portrait={person.id}
          kicker={arenaName()}
          title={person.name}
          sub={clan ? `${SPORT_LABEL[person.sport]} · ${clan.name}` : SPORT_LABEL[person.sport]}
          meta={own ? undefined : shared ? "No mesmo clã que você." : "Disputa a mesma arena que você."}
          back={<PillButton label="Voltar" glyph="back" onPress={() => close()} mute />}
        />
        <div className="px-5">
          <Duo
            a={{ k: "semana", v: String(week), unit: "dias" }}
            b={{ k: "clã", v: clan ? String(clan.weekSessions) : "0", unit: "sessões" }}
          />
          <div className="mt-4">
            <WeekStrip days={days} label={`${week} dias com sessão nesta semana`} />
          </div>
          {own ? null : (
            <button
              type="button"
              className={cn(
                "press mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-sm border t-small",
                onTop ? "border-ink text-ink" : "border-line text-mute",
              )}
              aria-pressed={onTop}
              onClick={() => togglePin(person.id)}
            >
              <Glyph name="star" size={14} />
              {onTop ? "No topo do seu feed" : "Priorizar no seu feed"}
            </button>
          )}
        </div>

        <Reveal className="mt-7 px-5">
          <AtributoPlate ficha={fichaOf(person.id)} onOpen={openProof} />
        </Reveal>

        <div className="mt-7">
          <Memory
            posts={posts}
            onOpen={openProof}
            empty={{
              title: "Nada no registro ainda",
              line: `${person.name} ainda não fechou a primeira. O começo mora aqui.`,
            }}
          />
        </div>

        {clans.length ? (
          <div className="mt-7">
            <Block head="Clãs">
              {clans.map((g, i) => (
                <Row
                  key={g.id}
                  title={g.name}
                  sub={`${SPORT_LABEL[g.kind]} · ${g.memberIds.length} de ${g.cap}`}
                  value={joined.includes(g.id) ? <Chip tone="done">seu</Chip> : undefined}
                  onPress={() => openGroup(g.id)}
                  last={i === clans.length - 1}
                />
              ))}
            </Block>
          </div>
        ) : null}

        <div className="mt-7">
          <Block head="Diário">
            {posts.length ? (
              <div>
                {posts.map((p, i) => (
                  <DiaryRow key={p.id} post={p} last={i === posts.length - 1} />
                ))}
              </div>
            ) : null}
          </Block>
          {posts.length ? null : (
            <Empty
              glyph="text"
              title="Sem registro ainda"
              line="Quando esta pessoa fechar uma sessão, ela aparece aqui com peso e tempo."
            />
          )}
        </div>
      </Scroll>

      <ObjectBar
        value={person.name}
        guarantee={primary.meta ?? (own ? "Você" : "Na arena")}
        action={primary.label}
        onAction={primary.on}
      />
    </div>
  );
}

/* --------------------------------------------------------------- Composer */

const PICKS = [
  { src: "/feed/supino.jpg", label: "Supino" },
  { src: "/feed/agachamento.jpg", label: "Agachamento" },
  { src: "/feed/box.jpg", label: "Box" },
  { src: "/feed/sled.jpg", label: "Sled" },
  { src: "/feed/parque.jpg", label: "Parque" },
  { src: "/feed/ficha.jpg", label: "Ficha" },
];

const KINDS: { id: PostKind; label: string }[] = [
  { id: "texto", label: "Texto" },
  { id: "foto", label: "Foto" },
  { id: "video", label: "Vídeo" },
];

export function Composer() {
  const close = useLink((s) => s.closeOverlay);
  const publish = useLink((s) => s.composePost);
  const [kind, setKind] = useState<PostKind>("texto");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const can = kind === "texto" ? Boolean(caption.trim()) : Boolean(image);
  const photoBad = tried && kind !== "texto" && !image;
  const textBad = tried && kind === "texto" && !caption.trim();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <div className="flex items-center justify-between gap-3 px-5 pt-3">
          <SectionHead>Novo post</SectionHead>
          <button type="button" className="press flex h-11 items-center t-small" onClick={() => close()}>
            Fechar
          </button>
        </div>

        <div className="mt-3 px-5">
          <Filters
            value={kind}
            onChange={(k) => {
              setKind(k);
              if (k === "texto") setImage(null);
            }}
            options={KINDS}
          />
        </div>

        <div className="mt-4 px-5">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 280))}
            placeholder={kind === "texto" ? "O que rolou." : "Legenda. Pode ficar vazia."}
            rows={4}
            className="t-body w-full resize-none rounded-sm border border-edge bg-raised p-3 text-ink outline-none placeholder:text-faint focus:border-ink"
          />
          <p className="t-mono mt-1 text-right text-faint tabular-nums">{caption.length}/280</p>
          {textBad ? (
            <p className="t-small mt-2">
              <span className="text-stamp">0</span>
              <span aria-hidden className="mx-1">!</span>
              Texto vazio.
            </p>
          ) : null}
        </div>

        {kind === "texto" ? null : (
          <div className="mt-5 px-5">
            <SectionHead>A foto</SectionHead>
            {image ? (
              <button type="button" className="press mt-3 aspect-square w-full text-left" onClick={() => setImage(null)}>
                <img src={image} alt="" className="aspect-square w-full object-cover" />
                <p className="t-small mt-2">{PICKS.find((p) => p.src === image)?.label ?? "escolhida"}</p>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="press mt-3 aspect-square w-full text-left"
                  onClick={() => setImage(PICKS[0]!.src)}
                >
                  <img src={PICKS[0]!.src} alt="" className="aspect-square w-full object-cover" />
                  <p className="t-small mt-2">{PICKS[0]!.label}</p>
                </button>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PICKS.slice(1, 5).map((p) => (
                    <button
                      key={p.src}
                      type="button"
                      className="press aspect-square w-full text-left"
                      aria-pressed={image === p.src}
                      onClick={() => setImage(p.src)}
                    >
                      <img src={p.src} alt="" className="aspect-square w-full object-cover" />
                      <p className="t-small mt-1">{p.label}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
            {photoBad ? (
              <p className="t-small mt-2">
                <span className="text-stamp">0</span>
                <span aria-hidden className="mx-1">!</span>
                Sem foto. Toque numa.
              </p>
            ) : null}
          </div>
        )}
      </Scroll>

      <ActionBar>
        <Thumb
          label="Publicar"
          meta={arenaWhy() ? `Sai para ${arenaName()}` : undefined}
          onPress={() => {
            if (!can) {
              setTried(true);
              return;
            }
            publish(kind, caption, image);
          }}
        />
      </ActionBar>
    </div>
  );
}
