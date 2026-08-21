import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Card, Roll } from "@/ui/kit";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Placar, escada e lotação. Peças da Rede que o kit não tem e que não podem
   virar `div` remontado dentro da cena.

   Duas regras valem em todas elas:

   1. Forma é forma. Sessão não é o caractere `●` repetido: é retângulo com
      altura. Texto fazendo trabalho de desenho quebra em qualquer fonte e não
      escala com o dado.
   2. Número nunca aparece sozinho. Todo algarismo carrega ao lado a referência
      contra a qual ele é desvio: 2 de 5, 23 de 40, +2 de 20. Número solto não
      informa, só decora.
--------------------------------------------------------------------------- */

/**
 * Sessões da semana como forma. A barra alta é sessão cumprida, a baixa é a que
 * falta até a referência: um glifo só carregando feito e previsto ao mesmo
 * tempo. Sobrevive à escala de cinza porque a diferença é altura, não matiz.
 */
export function Dots({ n, of = 5, label }: { n: number; of?: number; label?: string }) {
  const slots = Math.min(Math.max(of, n, 1), 12);
  return (
    <span
      className="inline-flex items-end gap-[3px] align-middle"
      role="img"
      aria-label={label ?? `${n} de ${slots} sessões`}
    >
      {Array.from({ length: slots }, (_, i) => (
        <span
          key={i}
          className={cn("block w-[3px] rounded-full", i < n ? "h-4 bg-ink" : "h-1.5 bg-fill")}
        />
      ))}
    </span>
  );
}

/** Quanto de um teto está ocupado. O comprimento é o dado, e ele entra animando. */
export function Meter({ n, of, className }: { n: number; of: number; className?: string }) {
  const pct = Math.max(2, Math.min(100, Math.round((n / Math.max(of, 1)) * 100)));
  return (
    <span className={cn("block h-1 w-full overflow-hidden rounded-full bg-fill", className)}>
      <motion.span
        className="block h-full rounded-full bg-ink"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

/** Marca de escolha. Caixa vazada, marca cheia dentro. Nunca um caractere. */
export function Pick({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-xs border",
        on ? "border-ink" : "border-edge",
      )}
      role="img"
      aria-label={on ? "escolhido" : "não escolhido"}
    >
      {on ? <span className="block size-3 rounded-[2px] bg-ink" /> : null}
    </span>
  );
}

/**
 * Cartão do desafio. Três níveis de claridade: dia furado, dia que ainda conta
 * para a meta, dia fora dela. Sem caractere dentro do quadrado.
 */
export function Punch({ days, done, goal }: { days: number; done: number; goal: number }) {
  const n = Math.min(days, 30);
  return (
    <div
      className={cn("grid gap-1", n > 7 ? "grid-cols-10" : "grid-cols-7")}
      role="img"
      aria-label={`${done} de ${goal} em ${days} dias`}
    >
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={cn(
            "block h-7 rounded-xs",
            i < done ? "bg-ink" : i < goal ? "bg-raised" : "bg-surface",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Onde a disputa acontece, e por que é aqui. O escopo sobe do setor para a
 * cidade sozinho, então a subida é notícia da tela e não nota de pé de página:
 * a frase vem inteira, e a falta que causou a subida vem medida embaixo dela.
 */
export function ArenaHead({
  name,
  people,
  why,
  have,
  need,
  place,
}: {
  name: string;
  people: number;
  why: string;
  have: number;
  need: number;
  place: string;
}) {
  return (
    <div>
      <p className="t-kicker">Arena da semana</p>
      <p className="t-hero mt-1">{name}</p>
      <p className="t-small mt-2">{people.toLocaleString("pt-BR")} de pé</p>
      {why ? (
        <div className="mt-4">
          <p className="t-body text-mute">{why}</p>
          <Meter n={have} of={need} className="mt-3" />
          <p className="t-small mt-2">
            {have} de {need} em {place}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Placar do clã contra o clã. Os dois marcadores no mesmo degrau de tipo e na
 * mesma coluna tabular: quem manda se separa por claridade, não por tamanho,
 * senão a coluna dança quando o número troca. `Roll` substitui o algarismo em
 * vez de cortá-lo, e a vantagem sai colada ao total de onde ela saiu.
 */
export function WarBoard({
  ends,
  homeName,
  homeScore,
  awayName,
  awayScore,
  note,
  onPress,
}: {
  ends: string;
  homeName: string;
  homeScore: number;
  awayName: string;
  awayScore: number;
  note: string;
  onPress?: () => void;
}) {
  const lead = homeScore - awayScore;
  const total = Math.max(homeScore + awayScore, 1);
  return (
    <Card onPress={onPress} label={`${homeName} ${homeScore}, ${awayName} ${awayScore}`}>
      <div className="px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="t-kicker">Clã contra clã</p>
          <p className="t-kicker">Fecha {ends}</p>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="t-body min-w-0 flex-1 truncate">{homeName}</p>
          <Roll value={homeScore} className="t-hero shrink-0" />
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-4 text-mute">
          <p className="t-body min-w-0 flex-1 truncate">{awayName}</p>
          <Roll value={awayScore} className="t-hero shrink-0" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Meter n={homeScore} of={total} className="max-w-[58%]" />
          <p className="t-small shrink-0 tabular-nums">
            {lead === 0 ? "empate" : `${lead > 0 ? "+" : ""}${lead}`} de {total}
          </p>
        </div>
        <p className="t-small mt-3">{note}</p>
      </div>
    </Card>
  );
}

/**
 * Vazio desenhado. Quatro partes no máximo, alinhado à esquerda, no alto da
 * coluna, sem ilustração: o glifo é o mesmo desenho de dado do resto da tela.
 * Quando a ação já mora na barra de baixo, este bloco fica sem botão, e quando
 * o aluno não tem ação nenhuma ele fica sem botão também. Nunca dois cheios.
 */
export function Empty({
  title,
  line,
  action,
  onAction,
}: {
  title: string;
  line?: ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-1">
      <span className="flex size-9 items-center justify-center rounded-sm bg-surface">
        <Dots n={1} of={3} label="sem dado" />
      </span>
      <p className="t-body mt-3">{title}</p>
      {line ? <p className="t-small mt-1">{line}</p> : null}
      {action && onAction ? (
        <button type="button" onClick={onAction} className="thumb-line mt-3">
          {action}
        </button>
      ) : null}
    </div>
  );
}
