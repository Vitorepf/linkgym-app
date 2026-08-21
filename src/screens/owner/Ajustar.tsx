import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  configDoTime,
  patchPrescriptionItem,
  type DraftItem,
  type Time,
} from "../../api";
import { Campo } from "../../ui/Campo";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { TrendMark } from "../../ui/Icons";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Props = NativeStackScreenProps<RootStackParamList, "Ajustar"> & {
  time: Time;
};

/** A PROCEDÊNCIA. `load_source` já vinha na resposta e a tela jogava fora — que é o mesmo
 *  defeito da barra (o histórico existe, o campo abre em branco) com outro rosto. Toda
 *  carga proposta diz de onde veio, na linha, sem toque nenhum. */
function fromLabel(src: DraftItem["load_source"], who: string): string {
  if (src === "history") return `última de ${who}`;
  if (src === "prescription") return `da última ficha de ${who}`;
  if (src === "starter") return "partida do modelo";
  return "posta à mão";
}

function patchBody(row: DraftItem) {
  return {
    load_kg: row.load_kg,
    planned_sets: row.planned_sets,
    planned_reps: row.planned_reps,
    ...(typeof row.notes === "string" ? { notes: row.notes.trim() } : {}),
  };
}

function fromProse(src: DraftItem["load_source"], who: string): string {
  if (src === "history") return `É a carga da última série que ${who} fez neste exercício.`;
  if (src === "prescription")
    return `Veio da última ficha de ${who}. O corpo dele ainda não fez este exercício.`;
  if (src === "starter") return `${who} ainda não levantou isto. Carga de partida do modelo.`;
  return "Carga posta à mão. O histórico deste corpo não entrou.";
}

export function Ajustar({ navigation, route, time }: Props) {
  const styles = usarEstilos();
  const { T, acento, errorInk } = useTema();
  const { token, timeName, prescriptionId, personId, personName } =
    route.params;
  const passo = configDoTime(time).passo_kg;
  const A = acento(undefined, T.raised);
  const who = personName.trim().split(/\s+/)[0] || "o aluno";

  const [items, setItems] = useState<DraftItem[]>(route.params.items);
  const [focusedId, setFocusedId] = useState(route.params.items[0]?.id ?? "");
  const [error, setError] = useState("");
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const latest = useRef<DraftItem[]>(route.params.items);
  /** O que o SISTEMA propôs ao abrir. É a única baseline real desta tela: sem desvio,
   *  nenhuma marca é desenhada. */
  const proposed = useRef(
    new Map(route.params.items.map((it) => [it.id, it.load_kg])),
  ).current;

  useEffect(() => {
    latest.current = items;
  }, [items]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      Object.values(pending).forEach(clearTimeout);
    };
  }, []);

  function schedulePatch(next: DraftItem) {
    const prev = timers.current[next.id];
    if (prev) clearTimeout(prev);
    timers.current[next.id] = setTimeout(() => {
      delete timers.current[next.id];
      void patchPrescriptionItem(
        token,
        prescriptionId,
        next.id,
        patchBody(next),
      ).catch(() => setError("Não deu para ajustar."));
    }, 300);
  }

  // ponytail: só a CARGA se ajusta aqui. Séries e reps são estrutura, e estrutura é do
  // modelo — dois steppers por exercício eram quatro alvos de toque para mexer no que
  // esta tela não decide. `planned_sets` continua indo inteiro no PATCH.
  function bump(row: DraftItem, delta: number) {
    const next: DraftItem = {
      ...row,
      load_kg: Math.max(0, Math.round((row.load_kg + delta) * 10) / 10),
    };
    schedulePatch(next);
    setItems((prev) => prev.map((it) => (it.id === row.id ? next : it)));
  }

  async function flush() {
    const ids = Object.keys(timers.current);
    ids.forEach((id) => {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    });
    const byId = new Map(latest.current.map((it) => [it.id, it]));
    await Promise.all(
      ids.map((id) => {
        const row = byId.get(id);
        if (!row) return Promise.resolve();
        return patchPrescriptionItem(
          token,
          prescriptionId,
          row.id,
          patchBody(row),
        );
      }),
    );
  }

  const focused = items.find((it) => it.id === focusedId) ?? items[0];
  const drift = (it: DraftItem) => it.load_kg - (proposed.get(it.id) ?? it.load_kg);

  // O quarto valor entra aqui tambem: sem ele, tally["prescription"] era undefined + 1 =
  // NaN, e o rodape "de onde sairam as N cargas" parava de fechar a conta na tela.
  const tally = { history: 0, prescription: 0, starter: 0, manual: 0 };
  items.forEach((it) => {
    tally[drift(it) !== 0 ? "manual" : it.load_source] += 1;
  });

  return (
    <Phone>
      <Head kicker={personName} title="Confere e ajusta" kickerMuted />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Txt role="note" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {items.map((row) => {
          const moved = drift(row);
          if (focused?.id === row.id) {
            return (
              <View key={row.id} style={[styles.hero, { borderLeftColor: A.mark }]}>
                <Txt role="title" numberOfLines={1}>
                  {row.name}
                </Txt>
                <View style={styles.stepper}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Menos ${formatKg(passo)} kg`}
                    style={styles.sq}
                    onPress={() => bump(row, -passo)}
                  >
                    <Txt role="title">−</Txt>
                  </Pressable>
                  <View style={styles.loadBlock}>
                    <Figure
                      value={formatKg(row.load_kg)}
                      unit="kg"
                      label={`${row.planned_sets} × ${row.planned_reps}`}
                      role="hero"
                      labelBelow
                      center
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Mais ${formatKg(passo)} kg`}
                    style={styles.sq}
                    onPress={() => bump(row, passo)}
                  >
                    <Txt role="title">+</Txt>
                  </Pressable>
                </View>
                {moved ? (
                  <View style={styles.drift}>
                    <TrendMark dir={moved > 0 ? "up" : "down"} color={T.muted} size={11} />
                    <Txt role="label">
                      seu ajuste · o sistema propôs {formatKg(proposed.get(row.id) ?? 0)} kg
                    </Txt>
                  </View>
                ) : (
                  <Txt role="note" tone="muted" style={styles.prose}>
                    {fromProse(row.load_source, who)}
                  </Txt>
                )}
                <Campo
                  label="Uma frase para ela"
                  rotulo
                  nota="Ela lê isto como a sua voz neste exercício."
                  value={row.notes ?? ""}
                  onChangeText={(text) => {
                    const next: DraftItem = { ...row, notes: text };
                    schedulePatch(next);
                    setItems((prev) =>
                      prev.map((it) => (it.id === row.id ? next : it)),
                    );
                  }}
                  placeholder="Cotovelo no banco. Sem impulso."
                  maxLength={140}
                  style={styles.nota}
                />
              </View>
            );
          }
          return (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              accessibilityLabel={`${row.name}, ${formatKg(row.load_kg)} quilos`}
              onPress={() => setFocusedId(row.id)}
              style={styles.row}
            >
              <View style={styles.rowBody}>
                <Txt role="body" numberOfLines={1}>
                  {row.name}
                </Txt>
                <View style={styles.rowFrom}>
                  {moved ? (
                    <TrendMark dir={moved > 0 ? "up" : "down"} color={T.muted2} size={9} />
                  ) : null}
                  <Txt role="label" tone="dim" numberOfLines={1}>
                    {moved ? "seu ajuste" : fromLabel(row.load_source, who)} ·{" "}
                    {row.planned_sets} × {row.planned_reps}
                  </Txt>
                </View>
              </View>
              <Txt role="title" style={styles.rowLoad}>
                {formatKg(row.load_kg)}
              </Txt>
              <Txt role="label" tone="muted">
                kg
              </Txt>
            </Pressable>
          );
        })}

        {/* O terço de baixo carrega a conta da tela: nenhum campo em branco, e a
            decomposição de onde saíram as {n} cargas. Tudo em corpo de rótulo — quem
            domina continua sendo o número da carga em foco. */}
        <View style={styles.foot}>
          <Txt role="label">de onde saíram as {items.length} cargas</Txt>
          <Txt role="body" style={styles.footLine}>
            {tally.history} do corpo · {tally.prescription} da última ficha ·{" "}
            {tally.starter} de partida · {tally.manual} à mão
          </Txt>
          <Txt role="note" tone="dim" style={styles.footNote}>
            Nenhum campo abriu em branco. Você confere, não digita.
          </Txt>
        </View>
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Publicar"
          meta={`${items.length} exercícios`}
          onPress={() => {
            void (async () => {
              try {
                await flush();
                setError("");
                navigation.navigate("Publicar", {
                  token,
                  timeName,
                  prescriptionId,
                  personId,
                  personName,
                });
              } catch {
                setError("Não deu para ajustar.");
              }
            })();
          }}
        />
      </DockFooter>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    error: { paddingHorizontal: T.pad, paddingTop: 12 },
    hero: {
      paddingHorizontal: T.pad,
      paddingVertical: 18,
      backgroundColor: T.raised,
      borderRadius: FORMA.raio,
      borderLeftWidth: FORMA.borda + 1,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.hair,
    },
    // O quadrado do ± perdeu o acento de propósito: ele não é o elemento dominante da tela
    // (o dominante é o número da carga, e a massa do acento é do Publicar).
    sq: {
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioAcao,
      borderColor: T.divider,
      backgroundColor: T.fill,
      flexShrink: 0,
    },
    loadBlock: { flex: 1 },
    prose: { marginTop: SPACE.tight },
    nota: { marginTop: SPACE.step },
    drift: { flexDirection: "row", alignItems: "center", gap: SPACE.hair, marginTop: SPACE.tight },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      paddingHorizontal: T.pad,
      paddingVertical: 18,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    rowBody: { flex: 1, minWidth: 0 },
    rowFrom: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    rowLoad: { fontVariant: ["tabular-nums"] },
    foot: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.step,
      paddingBottom: SPACE.step,
    },
    footLine: { marginTop: SPACE.hair },
    footNote: { marginTop: SPACE.hair },
  }),
);
