import { Quiet, Thumb } from "@/components/bits";
import { ActionBar, Card, Chip, Reveal, Roll, Row, Scroll, SectionHead, Stat } from "@/ui/kit";
import { Trail, Web, WeekDots, type TrailRow } from "@/ui/charts";
import { Empty, Glyph, type GlyphName } from "@/ui/parts";
import { CATALOG, LAST_WORKOUT, PRESCRIPTION, WEEK, YOU_ID, bodyFact, bodyWeb, monthOf } from "@/lib/seed";
import { useLink } from "@/lib/store";
import { dateShort, formatKg } from "@/lib/format";
import type { LoadPoint, WeekDay } from "@/lib/types";

function liftName(id: string): string {
  const found =
    CATALOG.find((e) => e.id === id)?.name ??
    PRESCRIPTION.items.find((e) => e.id === id)?.name ??
    LAST_WORKOUT.items.find((e) => e.id === id)?.name;
  if (found) return found;
  const bare = id.replace(/^ex-/, "").replace(/-/g, " ");
  return bare.charAt(0).toUpperCase() + bare.slice(1);
}

/** Um glifo, duas informações: para onde a carga foi e se virou recorde. */
function trendOf(points: LoadPoint[]): GlyphName {
  if (points.length < 2) return "igual";
  const tip = points[points.length - 1]!;
  const prev = points[points.length - 2]!;
  if (tip.kg > prev.kg) return "alta";
  if (tip.kg < prev.kg) return "baixa";
  return "igual";
}

function isRecord(points: LoadPoint[]): boolean {
  if (points.length < 2) return false;
  const tip = points[points.length - 1]!;
  return points.slice(0, -1).every((p) => tip.kg > p.kg);
}

function historyOf(points: LoadPoint[]): string {
  const first = points[0]!;
  const tip = points[points.length - 1]!;
  const n = points.length;
  const sessoes = `${n} ${n === 1 ? "sessão" : "sessões"}`;
  const d = tip.kg - first.kg;
  if (!d) return `${sessoes} desde ${first.date}`;
  return `${sessoes} · ${d > 0 ? "+" : "-"}${formatKg(Math.abs(d))} kg desde ${first.date}`;
}

function orderLifts(book: Record<string, LoadPoint[]>): string[] {
  const ids = Object.keys(book).filter((id) => (book[id]?.length ?? 0) > 0);
  return ids.includes("ex-supino") ? ["ex-supino", ...ids.filter((id) => id !== "ex-supino")] : ids;
}

function loadRows(points: LoadPoint[]): TrailRow[] {
  return points.map((p) => ({ label: p.date, value: p.kg, text: formatKg(p.kg) }));
}

/** As quatro semanas que sustentam a ofensiva. A última linha é esta semana. */
function weekRows(week: WeekDay[]): TrailRow[] {
  const past = monthOf(YOU_ID);
  const start = new Date(`${week[0]?.for_date ?? ""}T12:00:00`);
  const rows = [0, 1, 2].map((i) => {
    const when = new Date(start);
    when.setDate(when.getDate() - (3 - i) * 7);
    const n = past.slice(i * 7, i * 7 + 7).filter((d) => d > 0).length;
    return { label: dateShort(when), value: n, text: String(n) };
  });
  const now = week.filter((d) => d.sessions > 0).length;
  return [...rows, { label: dateShort(start), value: now, text: String(now) }];
}

/**
 * A memória de carga. Um cartão por exercício: linha de topo com o número de
 * hoje em coluna tabular, e a trilha das sessões anteriores logo abaixo. A
 * palavra "recorde" aparece uma vez, no cabeçalho do grupo; na linha só o
 * glifo. Zero régua na cena.
 */
export function Progresso() {
  const ofensiva = useLink((s) => s.ofensiva);
  const protector = useLink((s) => s.protector);
  const protectorUsed = useLink((s) => s.protectorUsed);
  const useProtector = useLink((s) => s.useProtector);
  const cumprido = useLink((s) => s.cumprido);
  const loadBook = useLink((s) => s.loadBook);
  const open = useLink((s) => s.openOverlay);

  const week = WEEK.map((d) => (d.me && cumprido ? { ...d, sessions: 1 } : d));
  const done = week.filter((d) => d.sessions > 0).length;
  const lifts = orderLifts(loadBook);
  const records = lifts.filter((id) => isRecord(loadBook[id] ?? [])).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="scrim-bottom relative flex min-h-0 flex-1 flex-col">
        <Scroll className="px-5 pt-1">
          <Reveal>
            <SectionHead className="pt-2">Corpo</SectionHead>
            <p className="t-small mt-2 max-w-[38ch]">{bodyFact(bodyWeb(loadBook))}</p>
            <Card className="mt-4 px-2 pb-2 pt-3">
              <Web axes={bodyWeb(loadBook)} />
              <p className="t-kicker px-3 pb-3 text-center">
                <span className="text-mute">começo</span>
                <span className="mx-2 text-line">·</span>
                <span className="text-ink">agora</span>
              </p>
            </Card>
          </Reveal>

          <Reveal i={1}>
            <div className="flex items-end justify-between gap-4 pt-7">
              <Stat k="Ofensiva em semanas" v={<Roll value={ofensiva} />} size="lg" />
              <Chip tone="quiet">
                <Glyph name="escudo" size={12} />
                {protector ? "1 protetor" : protectorUsed ? "protetor usado" : "sem protetor"}
              </Chip>
            </div>
          </Reveal>

          <Reveal i={1}>
            <SectionHead className="mt-7">{`Esta semana · ${done} ${done === 1 ? "sessão" : "sessões"}`}</SectionHead>
            <WeekDots days={week} frozen={protectorUsed ? "QUI" : undefined} />
          </Reveal>

          <Reveal i={2}>
            <SectionHead className="mt-7">Sessões por semana</SectionHead>
            <Trail rows={weekRows(week)} base="zero" />
          </Reveal>

          <Reveal i={3}>
            <SectionHead className="mt-7">
              {records ? `Caderno · ${records} ${records === 1 ? "recorde" : "recordes"}` : "Caderno"}
            </SectionHead>
          </Reveal>

          {lifts.length ? (
            lifts.map((id, i) => {
              const points = loadBook[id] ?? [];
              const tip = points[points.length - 1]!;
              const record = isRecord(points);
              return (
                <Reveal key={id} className="mt-2" i={i + 4}>
                  <Card className={points.length > 1 ? "px-4 pb-4" : "px-4"}>
                    <Row
                      last
                      leading={
                        <Glyph name={trendOf(points)} className={record ? "text-stamp-hi" : "text-faint"} />
                      }
                      title={liftName(id)}
                      sub={historyOf(points)}
                      value={<Roll value={formatKg(tip.kg)} was={points.length > 1 ? formatKg(points[points.length - 2]!.kg) : undefined} />}
                      valueSub="kg"
                    />
                    <Trail rows={loadRows(points)} accent={record} />
                  </Card>
                </Reveal>
              );
            })
          ) : (
            <Reveal className="mt-3" i={4}>
              <Empty
                glyph="grafico"
                title="Registre a primeira carga"
                lines={["Nenhuma carga registrada até agora."]}
              />
            </Reveal>
          )}
        </Scroll>
      </div>

      <ActionBar hair={false}>
        {cumprido ? (
          <p className="t-small flex min-h-[44px] items-center justify-center">
            {lifts.length ? "Hoje já entrou no caderno." : "Sessão de hoje fechada."}
          </p>
        ) : (
          <Thumb label="Registrar carga" onPress={() => open("livre")} />
        )}
        {protector && !protectorUsed ? <Quiet label="Usar o protetor" onPress={useProtector} /> : null}
      </ActionBar>
    </div>
  );
}
