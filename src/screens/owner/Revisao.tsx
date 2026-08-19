import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { approveOwnerWeek, ownerWeek, type OwnerWeekItem } from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { IconCheck, IconChevron, TrendMark } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { weekdayLong } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Props = {
  token: string;
  timeName: string;
};

/** O fio em texto: `adherence` chega como "3 de 4" — feito de prescrito. Os dois números
 *  são reais, vêm da API, e são a única coisa desta tela que pode virar número grande.
 *  Sem os dois, nenhum número é desenhado — a linha continua, muda. */
export function fio(text: string): { done: number; planned: number } | null {
  const m = text.match(/(\d+)\D+(\d+)/);
  if (!m) return null;
  const done = Number(m[1]);
  const planned = Number(m[2]);
  return planned > 0 ? { done, planned } : null;
}

/** As três faixas do fio, piores primeiro. A faixa É a causa do ajuste, então ela vira
 *  cabeçalho e o ajuste de cada aluno fica embaixo como consequência — a causa deixa de
 *  depender de um toque porque ela é a própria seção.
 *
 *  Direção por FORMA e POSIÇÃO: quem fechou leva o triângulo para cima, quem fez em parte
 *  leva o ponto, e quem não treinou **não leva marca nenhuma**. Falha é ausência. */
const BANDS = [
  { name: "Não treinou", dir: undefined },
  { name: "Fez em parte", dir: "flat" as const },
  { name: "Fechou a semana", dir: "up" as const },
];

function bandOf(f: ReturnType<typeof fio>): number {
  if (!f) return 1;
  if (f.done === 0) return 0;
  return f.done >= f.planned ? 2 : 1;
}

export function Revisao({ token, timeName }: Props) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();
  const startedAt = useRef(Date.now());
  const [items, setItems] = useState<OwnerWeekItem[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ n: number; seconds: number } | null>(null);

  const load = useCallback(async () => {
    try {
      const payload = await ownerWeek(token);
      setItems(payload.items);
      const next: Record<string, boolean> = {};
      for (const it of payload.items) next[it.person_id] = it.selected;
      setPicked(next);
      setError("");
    } catch {
      setError("Não deu para abrir a revisão.");
    } finally {
      setLoaded(true);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (done) return;
      void load();
    }, [load, done]),
  );

  const groups = useMemo(() => {
    const rows: OwnerWeekItem[][] = [[], [], []];
    const sum = BANDS.map(() => ({ done: 0, planned: 0 }));
    for (const it of items) {
      const f = fio(it.adherence);
      const b = bandOf(f);
      rows[b].push(it);
      if (f) {
        sum[b].done += f.done;
        sum[b].planned += f.planned;
      }
    }
    const ratio = (it: OwnerWeekItem) => {
      const f = fio(it.adherence);
      return f ? f.done / f.planned : 0;
    };
    return BANDS.map((band, i) => ({
      ...band,
      rows: rows[i].sort((a, b) => ratio(a) - ratio(b)),
      ...sum[i],
    }));
  }, [items]);

  // O total da semana amarra as tres faixas: 0 de 12 + 24 de 40 + ... fecha aqui.
  const week = groups.reduce(
    (a, g) => ({ done: a.done + g.done, planned: a.planned + g.planned }),
    { done: 0, planned: 0 },
  );

  const on = (it: OwnerWeekItem) => picked[it.person_id] !== false;
  const selectedIds = items.filter(on).map((it) => it.person_id);
  const count = selectedIds.length;
  const n = items.length;

  function setMany(rows: OwnerWeekItem[], value: boolean) {
    setPicked((prev) => {
      const next = { ...prev };
      for (const it of rows) next[it.person_id] = value;
      return next;
    });
  }

  async function approve() {
    if (busy || count === 0) return;
    setBusy(true);
    try {
      await approveOwnerWeek(token, selectedIds);
      setDone({
        n: count,
        seconds: Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
      });
      setError("");
    } catch {
      setError("Não deu para aprovar.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Phone>
        <Head
          kicker={weekdayLong()}
          title={`A semana de ${done.n} está revisada`}
        />
        <MetricGrid
          cells={[
            { label: "Alunos revisados", value: done.n },
            { label: "Na sua mão", value: done.seconds, unit: "s" },
          ]}
        />
        <Band rule="none">
          <Txt role="label">O que cada um recebe</Txt>
          <Txt role="body" style={styles.gap}>
            {`"${timeName} revisou sua semana"`}, com o ajuste dele em uma linha.
          </Txt>
        </Band>
      </Phone>
    );
  }

  return (
    <Phone>
      <Head
        kicker={weekdayLong()}
        title={n > 0 ? `A semana dos ${n}` : "A semana"}
        body={
          n > 0
            ? "O ajuste sai do fio: feito contra prescrito. Desmarque quem discordar."
            : undefined
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {error ? (
          <Txt role="body" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {loaded && n === 0 && !error ? (
          <Band rule="none">
            <Txt role="label">Nada para revisar</Txt>
            <Txt role="body" tone="muted" style={styles.gap}>
              Ninguém tem sessão prescrita nesta semana.
            </Txt>
          </Band>
        ) : null}

        {groups.map((g) =>
          g.rows.length === 0 ? null : (
            <View key={g.name}>
              <Pressable
                accessibilityRole="button"
                style={styles.group}
                onPress={() => setMany(g.rows, !g.rows.every(on))}
              >
                <Box
                  state={
                    g.rows.every(on) ? "all" : g.rows.some(on) ? "some" : "none"
                  }
                />
                <View style={styles.grow}>
                  <Txt role="body">{g.name}</Txt>
                  <Txt role="label">
                    {`${g.rows.length} ${g.rows.length === 1 ? "aluno" : "alunos"} · ${g.done} de ${g.planned} sessões`}
                  </Txt>
                </View>
                {g.dir ? <TrendMark dir={g.dir} color={T.muted} size={16} /> : null}
              </Pressable>

              {g.rows.map((row) => {
                const f = fio(row.adherence);
                const yes = on(row);
                return (
                  <View key={row.person_id} style={styles.row}>
                    {/* Marcar e ABRIR são dois atos, então são dois alvos. Enquanto a
                        linha inteira só marcava, a pessoa que não estava sinalizada hoje
                        não tinha porta nenhuma no app do personal. */}
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: yes }}
                      accessibilityLabel={`Revisar ${row.name}`}
                      hitSlop={10}
                      onPress={() => setMany([row], !yes)}
                    >
                      <Box state={yes ? "all" : "none"} />
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.who}
                      onPress={() =>
                        navigation.navigate("Aluna", {
                          token,
                          personId: row.person_id,
                          timeName,
                        })
                      }
                    >
                      <Initials name={row.name} size={32} />
                      <View style={styles.grow}>
                        <Txt role="body" numberOfLines={1}>
                          {row.name}
                        </Txt>
                        <Txt role="note">{row.suggested}</Txt>
                      </View>
                      {f ? (
                        <View style={styles.num}>
                          <Txt role="body" style={styles.tab}>
                            {f.done}
                          </Txt>
                          <Txt role="label">de {f.planned}</Txt>
                        </View>
                      ) : null}
                      <IconChevron color={T.muted2} size={16} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          ),
        )}
      </ScrollView>

      {n > 0 ? (
        <DockFooter>
          <Txt role="label" tone="dim" style={styles.dockLine}>
            {`A semana inteira · ${week.done} de ${week.planned} sessões`}
          </Txt>
          <AccentCTA
            label={`Aprovar ${count} ${count === 1 ? "revisão" : "revisões"}`}
            meta={count < n ? `${n - count} de fora` : undefined}
            onPress={() => void approve()}
            disabled={count === 0}
            busy={busy}
            check
          />
        </DockFooter>
      ) : null}
    </Phone>
  );
}

/** Marcado / parcial / vazio sem depender de matiz: presença de tinta e forma do miolo.
 *  ponytail: os dois níveis (grupo e aluno) usam a MESMA caixa — o grupo só é o único que
 *  chega a "some". */
function Box({ state }: { state: "all" | "some" | "none" }) {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <View style={[styles.box, state === "all" && styles.boxOn]}>
      {state === "all" ? <IconCheck color={T.bg} size={13} /> : null}
      {state === "some" ? <View style={styles.half} /> : null}
    </View>
  );
}

const usarEstilos = estilos(({ T, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    // O terço inferior não termina em linha raspada: a lista respira contra o dock.
    content: { flexGrow: 1, paddingBottom: 28 },
    error: { paddingHorizontal: T.pad, paddingTop: 12 },
    gap: { marginTop: 6 },
    dockLine: { marginBottom: 10 },
    grow: { flex: 1, minWidth: 0 },
    group: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingTop: 18,
      paddingBottom: 10,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 10,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    who: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 12 },
    num: { alignItems: "flex-end", flexShrink: 0 },
    tab: { fontVariant: ["tabular-nums"] },
    box: {
      width: 22,
      height: 22,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioEm(22),
      borderColor: T.ink,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    boxOn: { backgroundColor: T.ink },
    half: { width: 10, height: 10, borderRadius: FORMA.raioEm(10), backgroundColor: T.ink },
  }),
);
