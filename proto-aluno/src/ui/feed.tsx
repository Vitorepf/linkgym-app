import { useState, type ReactNode } from "react";
import { ARENA_LADDER, NOW, arenaName, arenaPeople, clanLadder, weekOf, type FichaVista } from "@/lib/seed";
import { ago, dateShort } from "@/lib/format";
import type { Group, Proof } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, Roll, SectionHead, Stat } from "@/ui/kit";
import { Faces, Glyph, Shot, type GlyphName } from "@/ui/photo";

/* ---------------------------------------------------------------------------
   Blocos do feed e do perfil. Aqui moram as decisões de tipo e de espaço que
   as cenas não devem repetir: a cena chama o bloco e passa dado.
--------------------------------------------------------------------------- */

/** Nome da arena onde a disputa da pessoa acontece. Um lugar só no app. */
export function arenaLabel(): string {
  return arenaName();
}

/* ---- leitura de post ----------------------------------------------------- */

/** Marca do registro: o que a pessoa fez, em uma linha curta. */
export function markOf(post: Proof): string {
  return post.title || post.volume || "";
}

/** C8 / C19: grandeza medida — kg, tempo ou contagem. Nunca título nu nem caption. */
export function magnitudeOf(post: Proof): string {
  if (post.kg != null && post.kg > 0) return `${post.kg.toLocaleString("pt-BR")} kg`;
  if (post.min != null && post.min > 0) return `${post.min} min`;
  if (post.sets != null && post.sets > 0) return `${post.sets} ${post.sets === 1 ? "série" : "séries"}`;
  if (post.volume && /\d/.test(post.volume)) return post.volume;
  if (post.pagos > 0) return String(post.pagos);
  if (post.cheers.length > 0) return String(post.cheers.length);
  return "1";
}

/**
 * Metadado do registro. `place` é texto livre que a pessoa escreveu e pode
 * não existir; quando não existe, nada é desenhado no lugar.
 */
export function metaOf(post: Proof): string {
  return [ago(post.hoursAgo), post.place?.trim()].filter(Boolean).join(" · ");
}

export type Attr = { k: string; v: string; unit?: string };

/**
 * Atributos do registro. Todo item carrega grandeza medida, nunca categoria
 * nua: se não houver número, o atributo não entra na lista.
 */
export function attrsOf(post: Proof): Attr[] {
  const out: Attr[] = [];
  if (post.sets != null) out.push({ k: "séries", v: String(post.sets) });
  if (post.kg != null) out.push({ k: "volume", v: post.kg.toLocaleString("pt-BR"), unit: "kg" });
  if (post.min != null) out.push({ k: "tempo", v: String(post.min), unit: "min" });
  return out;
}

/** Segunda a domingo. A semana do seed, com o que a pessoa publicou por cima. */
export function weekDays(proofs: Proof[], personId: string): boolean[] {
  const days = weekOf(personId).days.map(Boolean);
  const today = (NOW.getDay() + 6) % 7;
  for (const p of proofs) {
    if (p.personId !== personId || p.hoursAgo >= 168) continue;
    const i = today - Math.floor(p.hoursAgo / 24);
    if (i >= 0) days[i] = true;
  }
  return days;
}

export function weekCount(proofs: Proof[], personId: string): number {
  return weekDays(proofs, personId).filter(Boolean).length;
}

/**
 * Primeira escada: você contra as outras pessoas da arena. É local por
 * desenho, nunca ranking mundial de indivíduo.
 */
export function arenaSpot(personId: string): { pos: number; of: number } {
  const at = ARENA_LADDER.findIndex((r) => r.personId === personId);
  return { pos: at < 0 ? ARENA_LADDER.length + 1 : at + 1, of: arenaPeople() };
}

/** Segunda escada: o seu clã contra os outros clãs. */
export function clanSpot(groups: Group[], groupId: string): { pos: number; of: number } {
  const ladder = clanLadder(groups);
  const at = ladder.findIndex((g) => g.id === groupId);
  return { pos: at < 0 ? ladder.length : at + 1, of: ladder.length };
}

/* ---- dois números -------------------------------------------------------- */

/**
 * Dois indicadores na primeira dobra, uma faixa, uma régua vertical de 1px.
 * A referência do eixo usa três porque o objeto dela é um estranho sem
 * história; aqui o terceiro número só aparece depois da segunda dobra.
 */
export function Duo({ a, b }: { a: Attr; b: Attr }) {
  return (
    <div className="flex items-stretch gap-4">
      <div className="min-w-0 flex-1">
        <Stat k={a.k} v={a.v} unit={a.unit} />
      </div>
      <div className="w-px shrink-0 bg-line" />
      <div className="min-w-0 flex-1">
        <Stat k={b.k} v={b.v} unit={b.unit} />
      </div>
    </div>
  );
}

/**
 * Dossiê do corpo. Quatro trilhas, zero soma. A leitura é fato.
 * `docs/ficha-de-atributos.md` §6. Não compete com o WinPlate.
 */
export function AtributoPlate({
  ficha,
  onOpen,
}: {
  ficha: FichaVista;
  onOpen?: (proofId: string) => void;
}) {
  return (
    <Card className="px-4 py-4">
      {ficha.leitura ? <p className="t-body">{ficha.leitura}</p> : null}
      <div className={cn(ficha.leitura ? "mt-4" : "", "space-y-4")}>
        {ficha.barras.map((b) => {
          const open = b.proofId && onOpen ? () => onOpen(b.proofId!) : undefined;
          const row = (
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className="t-kicker">{b.nome}</span>
                <span className="t-mono text-ink">
                  {b.rotulo}
                  {b.idade ? ` · ${b.idade}` : ""}
                </span>
              </span>
              <span className="mt-2 block h-1 overflow-hidden rounded-full bg-line">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${b.barra}%` }} />
              </span>
            </>
          );
          if (!open) return <div key={b.eixo}>{row}</div>;
          return (
            <button key={b.eixo} type="button" onClick={open} className="press w-full text-left">
              {row}
            </button>
          );
        })}
      </div>
      {ficha.leitura ? null : (
        <p className="t-small mt-4">Feche uma sessão. O dossiê começa no rack.</p>
      )}
    </Card>
  );
}

export function WinPlate({
  faces,
  wins,
  onPress,
}: {
  faces: string[];
  wins: number;
  onPress?: () => void;
}) {
  return (
    <Card onPress={onPress} label={`${wins} vitórias. Abrir histórico.`} className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        {faces.length ? (
          <Faces ids={faces} size={34} max={5} />
        ) : (
          <p className="t-small">Desafie alguém</p>
        )}
        <div className="shrink-0 text-right">
          <p className="t-kicker">vitórias</p>
          <p className="t-display mt-1">
            <Roll value={wins} />
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Semana como textura, não como painel: barras de 3px, sem número por barra,
 * ocupando pouco mais de um quarto da largura.
 */
export function WeekStrip({ days, label }: { days: boolean[]; label: string }) {
  return (
    <div className="w-[120px]" aria-label={label}>
      <div className="flex items-center gap-1">
        {days.map((on, i) => (
          <span key={i} className={cn("h-[3px] flex-1 rounded-full", on ? "bg-ink" : "bg-line")} />
        ))}
      </div>
    </div>
  );
}

/* ---- estado vazio --------------------------------------------------------
   Quatro partes no máximo, no terço superior, alinhado à esquerda, e nunca
   passando de 18% da altura útil. Zero botões: a ação, quando existe, já é a
   primária da tela, e duplicar o preenchido é o defeito da referência. */

export function Empty({ glyph, title, line }: { glyph: GlyphName; title: string; line: string }) {
  return (
    <div className="max-h-[136px] px-5 py-4">
      <span className="flex size-8 items-center justify-center rounded-sm bg-surface text-mute">
        <Glyph name={glyph} size={16} />
      </span>
      <p className="t-body mt-3">{title}</p>
      <p className="t-small mt-1 max-w-[38ch]">{line}</p>
    </div>
  );
}

/* ---- filtro --------------------------------------------------------------
   Mesma forma nos dois estados: o que muda é luminância da borda, do texto e
   a presença do visto. Nada de preenchimento e nada que dependa de matiz. */

export function Filters<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className={cn(
              "press flex h-11 shrink-0 items-center gap-1.5 rounded-sm border px-3 t-small",
              on ? "border-ink text-ink" : "border-line text-mute",
            )}
          >
            {on ? <Glyph name="check" size={12} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- fala ---------------------------------------------------------------- */

export function Say({
  onSay,
  placeholder = "Fala neste post",
  limit = 180,
}: {
  onSay: (text: string) => void;
  placeholder?: string;
  limit?: number;
}) {
  const [draft, setDraft] = useState("");
  const ready = Boolean(draft.trim());
  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        onSay(draft.trim());
        setDraft("");
      }}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, limit))}
        placeholder={placeholder}
        maxLength={limit}
        className="t-body min-w-0 flex-1 border-b border-line bg-transparent py-2.5 text-ink outline-none placeholder:text-faint"
      />
      <span className="t-mono pb-3 text-faint tabular-nums">
        {draft.length}/{limit}
      </span>
      <button
        type="submit"
        disabled={!ready}
        className="thumb-line h-11 w-auto gap-1.5 px-4 t-small"
      >
        <Glyph name="send" size={15} />
        Falar
      </button>
    </form>
  );
}

/* ---- memória -------------------------------------------------------------
   Não é galeria. É o caminho: a primeira sessão de um lado, a de agora do
   outro, e o número que existe entre as duas. A tira embaixo anda no tempo,
   do começo para cá. Quem olha tem que ver o fruto, não um dump de foto. */

function dayOf(hoursAgo: number): Date {
  return new Date(NOW.getTime() - hoursAgo * 3_600_000);
}

function Beat({
  post,
  kicker,
  onOpen,
}: {
  post: Proof;
  kicker: string;
  onOpen: (id: string) => void;
}) {
  const label = magnitudeOf(post);
  return (
    <button type="button" onClick={() => onOpen(post.id)} aria-label={`${kicker}. ${label}`} className="press w-full text-left">
      <Shot src={post.image} video={post.video} still square />
      <p className="t-kicker mt-2">{kicker}</p>
      <p className="t-body mt-1 tabular-nums">{label}</p>
    </button>
  );
}

export function Memory({
  posts,
  onOpen,
  empty,
}: {
  posts: Proof[];
  onOpen: (id: string) => void;
  empty: { title: string; line: string };
}) {
  const path = [...posts]
    .filter((p) => p.image || p.video)
    .sort((a, b) => b.hoursAgo - a.hoursAgo);
  const weighed = [...posts].filter((p) => p.kg != null).sort((a, b) => b.hoursAgo - a.hoursAgo);
  const firstKg = weighed[0];
  const lastKg = weighed[weighed.length - 1];
  const delta = firstKg && lastKg && lastKg.id !== firstKg.id ? lastKg.kg! - firstKg.kg! : 0;
  const sessions = posts.filter((p) => p.kind === "feito").length;
  const now = path[path.length - 1];
  const rest = path.slice(0, -1).reverse().slice(0, 2);

  if (!now) {
    return (
      <section>
        <div className="px-5">
          <SectionHead>Memória</SectionHead>
        </div>
        <Empty glyph="photo" title={empty.title} line={empty.line} />
      </section>
    );
  }

  const fact =
    delta > 0 && firstKg
      ? `+${delta.toLocaleString("pt-BR")} kg desde ${dateShort(dayOf(firstKg.hoursAgo))}. ${sessions} sessões.`
      : `${sessions} ${sessions === 1 ? "sessão" : "sessões"} no registro.`;

  return (
    <section>
      <div className="px-5">
        <SectionHead>Memória</SectionHead>
        <p className="t-small mt-2 max-w-[38ch]">{fact}</p>
      </div>
      <div className="mt-4 px-5">
        <Beat post={now} kicker="agora" onOpen={onOpen} />
        {rest.length ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {rest.map((p) => (
              <button key={p.id} type="button" onClick={() => onOpen(p.id)} className="press w-full text-left">
                <Shot src={p.image} video={p.video} still square />
                <p className="t-small mt-1 tabular-nums">{magnitudeOf(p)}</p>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---- bloco de seção ------------------------------------------------------ */

export function Block({ head, action, onAction, children }: {
  head: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="px-5">
      <SectionHead action={action} onAction={onAction}>
        {head}
      </SectionHead>
      <div className="mt-3">{children}</div>
    </section>
  );
}
