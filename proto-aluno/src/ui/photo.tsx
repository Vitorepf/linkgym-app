import { useRef, useState, type ReactNode } from "react";
import { personOf } from "@/lib/seed";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Foto no escuro. A referência do eixo resolve texto sobre imagem com folha
   branca e pílula opaca; aqui não existe branco. A tradução é outra:

   1. Degradê de queda de 120px na base da foto, da cor da página até
      transparente. É ele que devolve a borda inferior da imagem, que no
      escuro some.
   2. Fio de 1px mais claro no topo da folha que sobe por cima da imagem.
      Sem o fio, painel escuro sobre foto escura não separa nada.
   3. Véu medido atrás de todo rótulo que fica em cima de pixel de foto.
      Nenhum texto de conteúdo pousa na imagem: só rótulo curto, dentro de
      recipiente com fundo.

   Teto de sobreposição: três, e o teto é a própria API. `Shot` tem três
   posições e não aceita filho solto, então não dá para empilhar uma quarta.
--------------------------------------------------------------------------- */

const FALL =
  "linear-gradient(to top, var(--color-bg) 0%, color-mix(in oklab, var(--color-bg) 74%, transparent) 44%, transparent 100%)";

/* ---- glifo ---------------------------------------------------------------
   Um traço só, mesma espessura, mesma caixa. Nada preenchido, para o glifo
   nunca competir em massa com o texto ao lado. */

const GLYPH = {
  play: "M9.2 6.4l8.2 5.6-8.2 5.6z",
  pause: "M9.5 6.5v11M14.5 6.5v11",
  check: "M5.5 12.4l4.4 4.4 8.6-9.2",
  flame:
    "M12 3.6c2.9 3.1 5.3 5.2 5.3 8.4a5.3 5.3 0 11-10.6 0c0-1.9.9-3.5 2.3-4.8.3 1.3 1 2.1 1.8 2.4.4-2.3-.1-4.2 1.2-6z",
  photo: "M3.8 6.6h16.4v10.8H3.8zM7.4 14.6l3-3.2 2.6 2.6 2.5-2.1 2.7 2.7",
  film: "M3.8 6.6h16.4v10.8H3.8zM10.2 9.9l4.3 2.6-4.3 2.7z",
  text: "M5 7.6h14M5 12h14M5 16.4h9",
  back: "M14.6 5.7L8.2 12l6.4 6.3",
  star: "M12 4.4l2.3 4.8 5.2.8-3.8 3.7.9 5.3-4.6-2.5-4.6 2.5.9-5.3-3.8-3.7 5.2-.8z",
  bolt: "M13.3 3.4L6.5 13.5h4.6l-1 7.1 6.8-10.1h-4.6z",
  plus: "M12 5.2v13.6M5.2 12h13.6",
  clock: "M12 4.6a7.4 7.4 0 100 14.8 7.4 7.4 0 000-14.8zM12 8.3V12l2.6 1.7",
  send: "M4.6 12l14.8-6.4-4.3 12.8-3.4-4.6z",
} as const;

export type GlyphName = keyof typeof GLYPH;

export function Glyph({ name, size = 14, className }: { name: GlyphName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path d={GLYPH[name]} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- véu -----------------------------------------------------------------
   Rótulo em cima de foto mora aqui dentro, nunca solto. O fundo é a cor da
   página a 80%, o que sobre a foto mais clara ainda deixa o texto acima de
   9:1. Três portadores: preenchimento, palavra e glifo. */

export function Pill({ children, glyph }: { children: ReactNode; glyph?: GlyphName }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-bg/80 px-2.5 t-mono text-ink backdrop-blur-[3px]">
      {glyph ? <Glyph name={glyph} size={12} /> : null}
      {children}
    </span>
  );
}

/** Mesmo véu, com dedo: 44 de altura e 44 de largura mínima, sempre. */
export function PillButton({
  label,
  glyph,
  onPress,
  mute,
}: {
  label: string;
  glyph?: GlyphName;
  onPress: () => void;
  mute?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="press flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-bg/80 px-3.5 t-mono text-ink backdrop-blur-[3px]"
    >
      {glyph ? <Glyph name={glyph} size={15} /> : null}
      {mute ? null : label}
    </button>
  );
}

/* ---- a foto --------------------------------------------------------------
   Três posições de sobreposição e nada mais: voltar, selo e o controle do
   vídeo. Quem precisar de uma quarta tem que apagar uma. */

export function Shot({
  src,
  video,
  alt = "",
  height,
  square,
  radius,
  veil,
  still,
  back,
  badge,
  onPress,
  label,
}: {
  src: string | null;
  video?: string | null;
  alt?: string;
  height?: number;
  square?: boolean;
  radius?: boolean;
  veil?: boolean;
  /** Vídeo parado, sem controle: a peça inteira abre o objeto em vez de tocar. */
  still?: boolean;
  back?: ReactNode;
  badge?: ReactNode;
  onPress?: () => void;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-surface",
        square && "aspect-square",
        radius && "rounded-lg",
      )}
      style={height ? { height } : undefined}
    >
      {video ? (
        <video
          ref={ref}
          src={video}
          poster={src ?? undefined}
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onEnded={() => setPlaying(false)}
        />
      ) : src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover object-[50%_30%]" />
      ) : null}

      {veil ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]" style={{ background: FALL }} />
      ) : null}

      {onPress ? (
        <button type="button" onClick={onPress} aria-label={label} className="absolute inset-0" />
      ) : null}

      {back ? <span className="absolute top-4 left-4">{back}</span> : null}
      {badge ? <span className="absolute top-4 right-4">{badge}</span> : null}
      {video && !still ? (
        <span className="absolute right-3 bottom-3">
          <PillButton
            label={playing ? "Pausar" : "Tocar"}
            glyph={playing ? "pause" : "play"}
            onPress={toggle}
            mute
          />
        </span>
      ) : null}
    </div>
  );
}

/* ---- folha ---------------------------------------------------------------
   Sobe 20 por cima da borda de baixo da imagem e leva o fio de 1px. É o
   substituto escuro da folha branca: a separação vem do fio e do degradê,
   não de uma cor que aqui não existe. */

export function Sheet({ children, flush, className }: { children: ReactNode; flush?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-t-xl bg-bg px-5 rim",
        flush ? "pt-1" : "-mt-5 pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---- retrato -------------------------------------------------------------
   A versão antiga decidia a cor do texto comparando a string do hex por
   igualdade, então qualquer cor nova caía no ramo errado. Aqui a decisão é
   luminância medida contra os dois extremos disponíveis, e quem ganhar é
   quem tiver mais contraste. */

const INK_L = 0.9;
const BG_L = 0.0043;

function relLum(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const chan = (i: number) => {
    const c = Number.parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(0) + 0.7152 * chan(2) + 0.0722 * chan(4);
}

/** Devolve o token de texto que mede mais contraste sobre a cor dada. */
export function inkOn(hex: string): string {
  const l = relLum(hex);
  const overInk = (Math.max(l, INK_L) + 0.05) / (Math.min(l, INK_L) + 0.05);
  const overBg = (Math.max(l, BG_L) + 0.05) / (Math.min(l, BG_L) + 0.05);
  return overInk >= overBg ? "var(--color-ink)" : "var(--color-bg)";
}

export function Swatch({ color, on, size = 36 }: { color: string; on?: boolean; size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-sm"
      style={{ width: size, height: size, backgroundColor: color, color: inkOn(color) }}
    >
      {on ? <Glyph name="check" size={16} /> : null}
    </span>
  );
}

export function Portrait({
  id,
  size = 36,
  ring,
  className,
}: {
  id: string;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const person = personOf(id);
  const photo = person.photo || `/faces/${id}.jpg`;
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-sm bg-surface", className)}
      style={{
        width: size,
        height: size,
        boxShadow: ring ? "0 0 0 2px var(--color-ink)" : undefined,
      }}
    >
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover object-[50%_18%]" />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center t-mono"
          style={{ backgroundColor: person.color, color: inkOn(person.color) }}
        >
          {person.initials}
        </span>
      )}
    </span>
  );
}

/** Fila de rostos. A pilha tem teto, e o resto vira número, não mais rosto. */
export function Faces({ ids, size = 24, max = 4 }: { ids: string[]; size?: number; max?: number }) {
  if (!ids.length) return null;
  return (
    <span className="flex -space-x-2">
      {ids.slice(0, max).map((id) => (
        <Portrait key={id} id={id} size={size} className="ring-[1.5px] ring-surface" />
      ))}
    </span>
  );
}

/* ---- objeto --------------------------------------------------------------
   O mesmo cabeçalho serve perfil, pessoa e prova. Coerência do objeto nas
   três aparições é critério do eixo, então é um componente só, não três
   parecidos. O título mora sempre dentro da folha, nunca em cima da foto. */

export function ObjectHead({
  src,
  video,
  portrait,
  kicker,
  title,
  sub,
  meta,
  back,
  badge,
  tall,
  children,
}: {
  src: string | null;
  video?: string | null;
  portrait?: string;
  kicker?: string;
  title: string;
  sub?: string;
  meta?: string;
  back?: ReactNode;
  badge?: ReactNode;
  tall?: boolean;
  children?: ReactNode;
}) {
  const hasShot = Boolean(src || video);
  return (
    <div className="shrink-0">
      {hasShot ? (
        <Shot src={src} video={video} height={tall ? 300 : 252} veil back={back} badge={badge} />
      ) : back ? (
        <div className="flex items-center gap-2 px-4 pt-2">{back}</div>
      ) : null}
      <Sheet flush={!hasShot}>
        {portrait ? <Portrait id={portrait} size={56} /> : null}
        {kicker ? <p className={cn("t-kicker", portrait && "mt-3")}>{kicker}</p> : null}
        <h1 className="t-display mt-1">{title}</h1>
        {sub ? <p className="t-sub mt-1">{sub}</p> : null}
        {meta ? <p className="t-small mt-1">{meta}</p> : null}
        {children}
      </Sheet>
    </div>
  );
}
