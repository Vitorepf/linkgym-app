import { useState } from "react";
import { Display, Face, Place, Quiet, Thumb } from "@/components/bits";
import { ActionBar, Card, Reveal, Roll, Row, Scroll, SectionHead } from "@/ui/kit";
import { Empty, Pick } from "@/ui/parts";
import {
  CATALOG,
  FRED,
  LAST_WORKOUT,
  NOW,
  PEOPLE,
  PRESCRIPTION,
  SPORT_LABEL,
  YOU_ID,
  deckLine,
  fichaAt,
  fichaTreinoOf,
} from "@/lib/seed";
import { applyLast, useLink } from "@/lib/store";
import { dateShort, formatKg, plannedSets, weekdayShort } from "@/lib/format";

const ULTIMA_EM = new Date(`${LAST_WORKOUT.for_date}T12:00:00`);

const SHEETS = [
  { id: "hoje" as const, label: "Hoje" },
  { id: "ultima" as const, label: "Última" },
  { id: "decks" as const, label: "Decks" },
];

function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * A folha de hoje só existe se for datada de hoje e se quem publicou ainda
 * divide grupo com você. Sair do grupo do Fred devolve a cena ao vazio.
 */
function sheetToday(groups: { id: string; memberIds: string[] }[], joined: string[]): boolean {
  if (PRESCRIPTION.for_date !== isoDay(NOW)) return false;
  return groups.some((g) => joined.includes(g.id) && g.memberIds.includes(FRED.id));
}

/** Tonelagem prevista da folha: séries × repetições × carga, somada. */
function plannedVolume(rows: { planned_sets: number; planned_reps: number; load_kg: number }[]): string {
  const kg = rows.reduce((a, r) => a + r.planned_sets * r.planned_reps * r.load_kg, 0);
  return Math.round(kg).toLocaleString("pt-BR");
}

export function Ficha() {
  const sheet = useLink((s) => s.fichaSheet);
  if (sheet === "decks") return <Decks />;
  return <Folha />;
}

/**
 * A folha do treino. Uma linha por exercício, dois blocos por linha, nome à
 * esquerda e carga à direita em coluna tabular. Nenhuma régua entre linhas: o
 * que separa é a superfície do cartão. A ação fica na barra, ao alcance do
 * polegar, e é a única coisa preenchida da cena.
 */
export function Folha() {
  const sheet = useLink((s) => s.fichaSheet);
  const setSheet = useLink((s) => s.setFichaSheet);
  const openComo = useLink((s) => s.openComo);
  const start = useLink((s) => s.startSession);
  const open = useLink((s) => s.openOverlay);
  const reset = useLink((s) => s.reset);
  const cumprido = useLink((s) => s.cumprido);
  const session = useLink((s) => s.session);
  const lastLoads = useLink((s) => s.lastLoads);
  const groups = useLink((s) => s.groups);
  const joined = useLink((s) => s.joinedGroupIds);

  const hoje = sheet === "hoje";
  const semFolha = hoje && !sheetToday(groups, joined);
  const pack = hoje ? PRESCRIPTION : LAST_WORKOUT;
  const rows = applyLast(pack.items, lastLoads);
  const kind = semFolha ? "ultima" : hoje ? "ficha" : "ultima";
  const acao = session ? "Continuar a sessão" : kind === "ficha" ? "Começar esta ficha" : "Repetir última";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Pick value={sheet} onChange={setSheet} options={SHEETS} />

      <div className="scrim-bottom relative flex min-h-0 flex-1 flex-col">
        <Scroll className="px-5">
          <Reveal>
            <Place>
              {semFolha
                ? `${weekdayShort(NOW)} · ${dateShort(NOW)}`
                : hoje
                  ? `${FRED.name} publicou`
                  : "Última vez"}
            </Place>
            <Display className="mt-1">{semFolha ? "Sem folha hoje" : pack.name}</Display>
            {semFolha ? null : (
              <p className="t-small mt-1">
                {weekdayShort(hoje ? NOW : ULTIMA_EM)} · {dateShort(hoje ? NOW : ULTIMA_EM)} ·{" "}
                {rows.length} exercícios
              </p>
            )}
          </Reveal>

          {semFolha ? (
            <Reveal className="mt-6" i={1}>
              <Empty
                glyph="folha"
                title="Repita a última"
                lines={[`A última foi ${LAST_WORKOUT.name}, em ${dateShort(ULTIMA_EM)}.`]}
              />
            </Reveal>
          ) : (
            <>
              <SectionHead className="mt-7">Exercícios</SectionHead>
              <Card className="mt-2 px-4 py-1">
                {rows.map((item, i) => (
                  <Reveal key={item.id} i={i + 1}>
                    <Row
                      last
                      onPress={() => openComo(item.id)}
                      title={item.name}
                      sub={`${item.planned_sets} × ${item.planned_reps}${
                        item.last_kg == null || item.last_kg === item.load_kg
                          ? ""
                          : ` · última ${formatKg(item.last_kg)} kg`
                      }`}
                      value={<Roll value={formatKg(item.load_kg)} />}
                      valueSub="kg"
                    />
                  </Reveal>
                ))}
              </Card>

              <Reveal className="mt-2" i={rows.length + 1}>
                <Card className="px-4 py-1">
                  <Row dim last title="Séries" value={plannedSets(rows)} />
                  <Row
                    dim
                    last
                    title={hoje ? "Volume previsto" : "Volume"}
                    value={plannedVolume(rows)}
                    valueSub="kg"
                  />
                </Card>
              </Reveal>

              <Reveal className="mt-7" i={rows.length + 2}>
                <SectionHead>Recado de {FRED.name}</SectionHead>
                <p className="t-small mt-2">{pack.coach_line}</p>
              </Reveal>
            </>
          )}
        </Scroll>
      </div>

      <ActionBar hair={false}>
        {cumprido ? (
          <p className="t-small flex min-h-[44px] items-center justify-center">Sessão de hoje fechada.</p>
        ) : (
          <Thumb label={acao} onPress={() => start(kind)} />
        )}
        <Quiet
          label={cumprido ? "Recomeçar o proto" : "Montar treino livre"}
          onPress={cumprido ? reset : () => open("livre")}
        />
      </ActionBar>
    </div>
  );
}

/** Pilha nomeada. Uma sessão começa a próxima ficha. Ver `docs/deck.md`. */
export function Decks() {
  const setSheet = useLink((s) => s.setFichaSheet);
  const sheet = useLink((s) => s.fichaSheet);
  const decks = useLink((s) => s.decks);
  const fichas = useLink((s) => s.fichas);
  const selectedDeckId = useLink((s) => s.selectedDeckId);
  const selectedFichaId = useLink((s) => s.selectedFichaId);
  const selectDeck = useLink((s) => s.selectDeck);
  const selectFicha = useLink((s) => s.selectFicha);
  const startDeck = useLink((s) => s.startDeck);
  const startFicha = useLink((s) => s.startFicha);
  const resume = useLink((s) => s.resumeSession);
  const open = useLink((s) => s.openOverlay);
  const openOffer = useLink((s) => s.openOffer);
  const session = useLink((s) => s.session);
  const cumprido = useLink((s) => s.cumprido);
  const cursor = useLink((s) => s.deckCursor);
  const reset = useLink((s) => s.reset);

  const mine = decks.filter((d) => d.ownerId === YOU_ID);
  const deck = mine.find((d) => d.id === selectedDeckId) ?? mine[0];
  const next = deck ? fichaAt(deck, cursor[deck.id] ?? 0, fichas) : undefined;
  const picked = selectedFichaId ? fichaTreinoOf(selectedFichaId, fichas) : undefined;
  const acao = session
    ? "Continuar a sessão"
    : picked
      ? `Começar ${picked.name}`
      : deck
        ? `Começar ${next?.name ?? deck.name}`
        : "Começar";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Pick value={sheet} onChange={setSheet} options={SHEETS} />

      <div className="scrim-bottom relative flex min-h-0 flex-1 flex-col">
        <Scroll className="px-5">
          <Reveal>
            <Place>Sua pilha</Place>
            <Display className="mt-1">{deck?.name ?? "Nenhum deck"}</Display>
            {deck ? <p className="t-small mt-1">{deck.about}</p> : null}
          </Reveal>

          {mine.length ? (
            <Reveal className="mt-6" i={1}>
              <SectionHead>Decks</SectionHead>
              <Card className="mt-2 px-4 py-1">
                {mine.map((d) => (
                  <Row
                    key={d.id}
                    last
                    title={d.name}
                    sub={deckLine(d, fichas)}
                    value={d.id === deck?.id ? "neste" : undefined}
                    onPress={() => selectDeck(d.id)}
                  />
                ))}
              </Card>
            </Reveal>
          ) : (
            <Reveal className="mt-6" i={1}>
              <Empty glyph="folha" title="Escreva uma ficha" lines={["Depois empilha num deck."]} />
            </Reveal>
          )}

          {deck ? (
            <Reveal className="mt-6" i={2}>
              <SectionHead>Fichas nesta pilha</SectionHead>
              <Card className="mt-2 px-4 py-1">
                {deck.fichaIds.map((id) => {
                  const f = fichaTreinoOf(id, fichas);
                  if (!f) return null;
                  const on = selectedFichaId === f.id;
                  const turn = next?.id === f.id;
                  return (
                    <Row
                      key={f.id}
                      last
                      title={f.name}
                      sub={`${f.items.length} exercícios · ${f.minutes} min`}
                      value={on ? "esta" : turn ? "próxima" : undefined}
                      onPress={() => selectFicha(on ? null : f.id)}
                    />
                  );
                })}
              </Card>
            </Reveal>
          ) : null}

          <Reveal className="mt-6" i={3}>
            <SectionHead>Suas fichas</SectionHead>
            {fichas.filter((f) => f.ownerId === YOU_ID).length ? (
              <Card className="mt-2 px-4 py-1">
                {fichas
                  .filter((f) => f.ownerId === YOU_ID)
                  .map((f) => (
                    <Row
                      key={f.id}
                      last
                      title={f.name}
                      sub={`${f.items.length} exercícios`}
                      value={selectedFichaId === f.id ? "esta" : undefined}
                      onPress={() => selectFicha(f.id)}
                    />
                  ))}
              </Card>
            ) : (
              <p className="t-small mt-2">Nenhuma ficha escrita ainda.</p>
            )}
          </Reveal>
        </Scroll>
      </div>

      <ActionBar hair={false}>
        {cumprido ? (
          <p className="t-small flex min-h-[44px] items-center justify-center">Sessão de hoje fechada.</p>
        ) : (
          <Thumb
            label={acao}
            disabled={!session && !deck && !picked}
            onPress={() => {
              if (session) {
                resume();
                return;
              }
              if (picked) startFicha(picked.id);
              else if (deck) startDeck(deck.id);
            }}
          />
        )}
        <Quiet label={cumprido ? "Recomeçar o proto" : "Nova ficha"} onPress={cumprido ? reset : () => open("escrever")} />
        {cumprido || !deck ? null : (
          <>
            <Quiet label="Novo deck" onPress={() => open("montar")} />
            <Quiet
              label="Oferecer a um estranho"
              onPress={() => openOffer(picked ? "ficha" : "deck", picked ? picked.id : deck.id)}
            />
          </>
        )}
      </ActionBar>
    </div>
  );
}

export function Escrever() {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const save = useLink((s) => s.createFicha);
  const close = useLink((s) => s.closeOverlay);
  const lastLoads = useLink((s) => s.lastLoads);
  const catalog = applyLast(CATALOG, lastLoads);
  const ready = name.trim().length > 1 && picked.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Nova</Place>
          <Display className="mt-1">Escrever ficha</Display>
          <p className="t-small mt-2">Nome, exercícios, séries e carga. A carga sobe no rack.</p>
        </Reveal>

        <Reveal i={1} className="mt-6 px-5">
          <Place>Nome</Place>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 32))}
            placeholder="Perna pesada"
            maxLength={32}
            aria-label="Nome da ficha"
            className="t-body mt-2 h-12 w-full rounded-sm border border-edge bg-transparent px-3 text-ink outline-none placeholder:text-faint"
          />
        </Reveal>

        <Reveal i={2} className="mt-6 px-5">
          <SectionHead>Exercícios</SectionHead>
          <Card className="mt-2 px-4 py-1">
            {catalog.map((ex) => {
              const on = picked.includes(ex.id);
              return (
                <Row
                  key={ex.id}
                  last
                  title={ex.name}
                  sub={`${ex.planned_sets} × ${ex.planned_reps} · ${formatKg(ex.load_kg)} kg`}
                  value={on ? "nesta" : undefined}
                  onPress={() => setPicked((cur) => (on ? cur.filter((id) => id !== ex.id) : [...cur, ex.id]))}
                />
              );
            })}
          </Card>
        </Reveal>
      </Scroll>

      <ActionBar>
        <Thumb label="Guardar ficha" disabled={!ready} onPress={() => save(name, picked)} />
        <Quiet label="Voltar" onPress={() => close()} />
      </ActionBar>
    </div>
  );
}

export function Montar() {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const save = useLink((s) => s.createDeck);
  const close = useLink((s) => s.closeOverlay);
  const fichas = useLink((s) => s.fichas);
  const mine = fichas.filter((f) => f.ownerId === YOU_ID);
  const ready = name.trim().length > 1 && picked.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>Nova pilha</Place>
          <Display className="mt-1">Montar deck</Display>
          <p className="t-small mt-2">Nomeie o corpo que esta pilha entrega.</p>
        </Reveal>

        <Reveal i={1} className="mt-6 px-5">
          <Place>Nome</Place>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 32))}
            placeholder="Bum bum guloso"
            maxLength={32}
            aria-label="Nome do deck"
            className="t-body mt-2 h-12 w-full rounded-sm border border-edge bg-transparent px-3 text-ink outline-none placeholder:text-faint"
          />
        </Reveal>

        <Reveal i={2} className="mt-6 px-5">
          <Place>O corpo</Place>
          <input
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, 120))}
            placeholder="Perna, posterior, glúteo."
            maxLength={120}
            aria-label="O que o deck entrega"
            className="t-body mt-2 h-12 w-full rounded-sm border border-edge bg-transparent px-3 text-ink outline-none placeholder:text-faint"
          />
        </Reveal>

        <Reveal i={3} className="mt-6 px-5">
          <SectionHead>Fichas nesta pilha</SectionHead>
          {mine.length ? (
            <Card className="mt-2 px-4 py-1">
              {mine.map((f) => {
                const on = picked.includes(f.id);
                return (
                  <Row
                    key={f.id}
                    last
                    title={f.name}
                    sub={`${f.items.length} exercícios`}
                    value={on ? "nesta" : undefined}
                    onPress={() => setPicked((cur) => (on ? cur.filter((id) => id !== f.id) : [...cur, f.id]))}
                  />
                );
              })}
            </Card>
          ) : (
            <p className="t-small mt-2">Escreva uma ficha primeiro.</p>
          )}
        </Reveal>
      </Scroll>

      <ActionBar>
        <Thumb label="Guardar deck" disabled={!ready} onPress={() => save(name, about, picked)} />
        <Quiet label="Voltar" onPress={() => close()} />
      </ActionBar>
    </div>
  );
}

const STRANGERS = PEOPLE.filter((p) => p.id !== YOU_ID && !p.groupIds.includes("c-ferro"));

/** Oferece ficha ou deck a um estranho. Reusa o aceite do duelo. */
export function Oferecer() {
  const [pick, setPick] = useState<string | null>(null);
  const close = useLink((s) => s.closeOverlay);
  const offer = useLink((s) => s.offer);
  const offerDuel = useLink((s) => s.offerDuel);
  const decks = useLink((s) => s.decks);
  const fichas = useLink((s) => s.fichas);
  const obj =
    offer?.kind === "deck" ? decks.find((d) => d.id === offer.id) : fichas.find((f) => f.id === offer?.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Scroll>
        <Reveal className="px-5 pt-2">
          <Place>{offer?.kind === "ficha" ? "Ficha" : "Deck"}</Place>
          <Display className="mt-1">{obj?.name ?? "Oferecer"}</Display>
          <p className="t-small mt-2">Os dois correm o mesmo objeto. Sem sessão no app, não tem veredito.</p>
        </Reveal>

        <Reveal i={1} className="mt-6 px-5">
          <SectionHead>Um estranho da arena</SectionHead>
          <Card className="mt-2 px-4 py-1">
            {STRANGERS.map((p) => (
              <Row
                key={p.id}
                last
                leading={<Face id={p.id} size={36} />}
                title={p.name}
                sub={SPORT_LABEL[p.sport]}
                value={pick === p.id ? "este" : undefined}
                onPress={() => setPick(p.id)}
              />
            ))}
          </Card>
        </Reveal>
      </Scroll>

      <ActionBar>
        <Thumb
          label={pick ? `Oferecer a ${STRANGERS.find((p) => p.id === pick)?.name}` : "Escolha alguém"}
          disabled={!pick || !obj}
          onPress={() => pick && offerDuel(pick)}
        />
        <Quiet label="Voltar" onPress={() => close()} />
      </ActionBar>
    </div>
  );
}
