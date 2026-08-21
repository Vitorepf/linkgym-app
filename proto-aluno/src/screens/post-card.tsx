import { Portrait, Faces, Glyph, Pill, Shot } from "@/ui/photo";
import { Card, Chip, Reveal, Roll, Row } from "@/ui/kit";
import { attrsOf, markOf, metaOf } from "@/ui/feed";
import { YOU_ID, duelOpen, personOf } from "@/lib/seed";
import { useLink } from "@/lib/store";
import type { Duel, Proof } from "@/lib/types";

/* ---------------------------------------------------------------------------
   O objeto do feed. Foto quase quadrada, sem borda e sem sombra, com o texto
   assentando direto na página. Três linhas: título+nota+data, legenda, preço
   (tá pago) sozinho. Falas moram na Prova, não no card. Nenhuma linha pousa
   em cima da imagem. Tipo: só t-body 17 e t-small 15.
--------------------------------------------------------------------------- */

function kindWord(post: Proof): string {
  if (post.kind === "video") return "Vídeo";
  if (post.kind === "foto") return "Foto";
  if (post.kind === "feito") return "Sessão";
  return "Post";
}

function kindGlyph(post: Proof) {
  if (post.kind === "video") return "film" as const;
  if (post.kind === "foto") return "photo" as const;
  if (post.kind === "feito") return "bolt" as const;
  return "text" as const;
}

/** Selo sobre a foto: preenchimento com véu, palavra e glifo. Nunca só cor. */
function badgeOf(post: Proof) {
  if (post.kind === "feito") return <Pill glyph="bolt">sessão</Pill>;
  if (post.kind === "video") return <Pill glyph="film">vídeo</Pill>;
  return undefined;
}

/** A grandeza mais forte do registro, para dividir a linha com a marca. */
function strongest(post: Proof) {
  const attrs = attrsOf(post);
  return attrs[1] ?? attrs[0];
}

function nameOf(id: string, you: string): string {
  return id === YOU_ID ? you : personOf(id).name;
}

function Thumbnail({ post }: { post: Proof }) {
  if (post.image) {
    return <img src={post.image} alt="" className="size-14 shrink-0 rounded-sm object-cover" />;
  }
  return (
    <span className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-surface text-faint">
      <Glyph name={kindGlyph(post)} size={18} />
    </span>
  );
}

export function DiaryRow({ post, last }: { post: Proof; last?: boolean }) {
  const openProof = useLink((s) => s.openProof);
  const attr = strongest(post);
  const title = markOf(post) || post.caption || kindWord(post);
  return (
    <Row
      leading={<Thumbnail post={post} />}
      title={title}
      sub={metaOf(post)}
      value={attr ? attr.v : undefined}
      valueSub={attr?.unit}
      onPress={() => openProof(post.id)}
      last={last}
    />
  );
}

export function DuelOnPost({ duel }: { duel: Duel; post: Proof; name: string }) {
  const accept = useLink((s) => s.acceptDuel);
  const incoming = duelOpen(duel) && duel.toId === YOU_ID;
  const faces = (
    <div className="flex items-center justify-center gap-3">
      <Portrait id={duel.fromId} size={24} />
      <Chip tone="live">{duel.mark}</Chip>
      <Portrait id={duel.toId} size={24} />
    </div>
  );

  return (
    <Card tone="outline" className="mt-3 p-3">
      {incoming ? (
        <button
          type="button"
          className="press flex min-h-11 w-full items-center justify-center"
          onClick={() => accept(duel.id)}
        >
          {faces}
        </button>
      ) : (
        faces
      )}
    </Card>
  );
}

export function PostCard({ post }: { post: Proof }) {
  const name = useLink((s) => s.name);
  const openProof = useLink((s) => s.openProof);
  const openPerson = useLink((s) => s.openPerson);
  const cheer = useLink((s) => s.givePago);
  const challenge = useLink((s) => s.challengePost);
  const duels = useLink((s) => s.duels);

  const who = nameOf(post.personId, name);
  const mine = post.personId === YOU_ID;
  const cheers = post.cheers ?? [];
  const seen = cheers.includes(YOU_ID);
  const mark = markOf(post);
  const attr = strongest(post);
  const duel = duels.find((d) => duelOpen(d) && d.postId === post.id) ?? duels.find((d) => d.postId === post.id);
  const canDuel = !mine && (post.kind === "feito" || post.kind === "video");
  const media = post.image || post.video;

  return (
    <Reveal>
      <article className="px-5 pt-1 pb-8">
        <button
          type="button"
          className="press -mx-2 flex min-h-11 w-full items-center gap-3 rounded-sm px-2 text-left"
          onClick={() => openPerson(post.personId)}
        >
          <Portrait id={post.personId} size={36} />
          <span className="t-body min-w-0 flex-1 truncate">
            {[who, mark].filter(Boolean).join(" · ")}
          </span>
          <span className="t-small shrink-0">
            {[attr ? [attr.v, attr.unit].filter(Boolean).join(" ") : "", metaOf(post)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </button>

        {media ? (
          <div className="mt-2">
            <Shot
              src={post.image}
              video={post.video}
              square
              radius
              badge={badgeOf(post)}
              onPress={() => openProof(post.id)}
              label={mark || kindWord(post)}
            />
          </div>
        ) : null}

        {post.caption ? (
          <p className="t-body mt-3 line-clamp-1 text-ink">{post.caption}</p>
        ) : null}

        {duel ? <DuelOnPost duel={duel} post={post} name={name} /> : null}

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            className="press -mx-2 flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-sm px-2 text-left"
            onClick={() => openProof(post.id)}
          >
            <Faces ids={cheers} size={22} />
            <span className="t-small truncate">
              <Roll value={cheers.length} /> tá pago
            </span>
          </button>

          {canDuel ? (
            <button
              type="button"
              className="press flex h-11 shrink-0 items-center gap-1.5 rounded-sm border border-line px-3 t-small"
              onClick={() => challenge(post.id)}
            >
              <Glyph name="bolt" size={14} />
              Te pego
            </button>
          ) : null}

          {mine ? null : seen ? (
            <Chip tone="done">Tá pago</Chip>
          ) : (
            <button
              type="button"
              className="press flex h-11 shrink-0 items-center gap-1.5 rounded-sm border border-edge px-3 t-small text-ink"
              onClick={() => cheer(post.id)}
            >
              <Glyph name="check" size={14} />
              Tá pago
            </button>
          )}
        </div>
      </article>
    </Reveal>
  );
}
