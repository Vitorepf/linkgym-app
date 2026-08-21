import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Peças que o kit não tem e que uma cena de dado precisa: o glifo, a troca de
   folha e o vazio. Cor sai de currentColor ou de token; nenhum hex mora aqui.
--------------------------------------------------------------------------- */

/* Mesma grade óptica e mesmo peso de traço dos ícones da barra de abas. */
const PATHS = {
  alta: "M6 14.5l6-6 6 6",
  igual: "M5.5 10h13M5.5 14h13",
  baixa: "M6 9.5l6 6 6-6",
  folha: "M7 4h10v16H7zM9.5 9h5M9.5 13h5M9.5 17h3",
  grafico: "M5 19v-6.5M12 19V5M19 19v-4",
  escudo: "M12 3.6l6.4 2.7v5.4c0 3.6-2.5 6.5-6.4 8.2-3.9-1.7-6.4-4.6-6.4-8.2V6.3z",
} as const;

export type GlyphName = keyof typeof PATHS;

export function Glyph({
  name,
  size = 18,
  className,
}: {
  name: GlyphName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d={PATHS[name]}
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Troca de folha. O selecionado é marcado só por um passo de fundo e por
 * luminância de texto: nenhuma régua embaixo, nenhuma borda, nenhum acento.
 */
export function Pick<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex shrink-0 gap-1 px-3 pt-1 pb-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "press h-11 rounded-md px-2 t-body",
            value === o.id ? "bg-surface text-ink" : "text-mute",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Vazio desenhado. Glifo em caixa neutra, título imperativo, até duas linhas
 * de estado. Não aceita botão de propósito: a ação da cena vive na barra, e é
 * assim que dois preenchidos nunca acontecem.
 */
export function Empty({
  glyph,
  title,
  lines,
}: {
  glyph: GlyphName;
  title: string;
  lines: string[];
}) {
  return (
    <div className="max-w-[32ch]">
      <span className="flex size-10 items-center justify-center rounded-md bg-surface text-faint">
        <Glyph name={glyph} />
      </span>
      <p className="t-body mt-3">{title}</p>
      {lines.slice(0, 2).map((line) => (
        <p key={line} className="t-small mt-1">
          {line}
        </p>
      ))}
    </div>
  );
}
