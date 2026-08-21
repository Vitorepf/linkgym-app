import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  applyOwnerReturn,
  configDoTime,
  ownerReturns,
  type OwnerReturn,
  type Time,
} from "../../api";
import { GhostCTA } from "../../ui/GhostCTA";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Figure } from "../../ui/Figure";
import { TrendMark } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Bump = number;

type Props = NativeStackScreenProps<RootStackParamList, "Retorno"> & {
  time: Time;
};

function bumpsOf(passo: number): Bump[] {
  return [-passo, 0, passo];
}

/** A decisão já vem pronta: o esforço que o aluno marcou É a causa do peso de amanhã.
 *  Antes o 0 vinha selecionado para todo mundo, então "fácil" e "difícil" custavam DOIS
 *  toques cada. Com a sugestão no lugar, o caminho feliz é UM toque por aluno e a
 *  inclinação de 1 para 20 alunos deixa de dobrar. */
function suggest(effort: number, passo: number): Bump {
  if (effort === 1) return passo;
  if (effort === 3) return -passo;
  return 0;
}

function kg(b: Bump): string {
  if (b > 0) return `+${formatKg(b)}`;
  if (b < 0) return `−${formatKg(-b)}`;
  return "0";
}

function dirOf(b: Bump): "up" | "down" | "flat" {
  return b > 0 ? "up" : b < 0 ? "down" : "flat";
}

function first(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Prosa que cita o número, como o eixo 1 cobra — e que segue o dedo: se o personal
 *  trocar a escolha, a frase troca junto. Nunca elogia; explica. */
function why(row: OwnerReturn, b: Bump): string {
  const who = first(row.name);
  const said =
    row.effort === 1 ? `${who} marcou fácil.`
    : row.effort === 3 ? `${who} marcou difícil.`
    : row.effort === 2 ? `${who} marcou no ponto.`
    : `${who} não marcou o esforço.`;
  const next =
    b > 0 ? `Sobe ${formatKg(b)} kg.`
    : b < 0 ? `Desce ${formatKg(-b)} kg.`
    : "Mantém o peso.";
  return `${said} ${next}`;
}

function hourOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getHours()}h${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Retorno({ route, time }: Props) {
  const styles = usarEstilos();
  const { T, acento, errorInk } = useTema();
  const { token, timeName } = route.params;
  const passo = configDoTime(time).passo_kg;
  const BUMPS = bumpsOf(passo);
  const A = acento(undefined, T.raised);
  const [items, setItems] = useState<OwnerReturn[]>([]);
  const [bumpFor, setBumpFor] = useState<Record<string, Bump>>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const payload = await ownerReturns(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir os retornos.");
    } finally {
      setLoaded(true);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function apply(row: OwnerReturn, bump: Bump) {
    if (busy) return;
    setBusy(row.alert_id);
    try {
      await applyOwnerReturn(token, row.alert_id, bump);
      setItems((prev) => prev.filter((it) => it.alert_id !== row.alert_id));
      // resolvido some da fila e o próximo sobe sozinho: o toque seguinte já está no lugar.
      setFocusId(null);
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  const head = items.find((it) => it.alert_id === focusId) ?? items[0];
  const rest = head ? items.filter((it) => it.alert_id !== head.alert_id) : [];
  const bumpOf = (row: OwnerReturn) =>
    bumpFor[row.alert_id] ?? suggest(row.effort, passo);
  const bump = head ? bumpOf(head) : 0;

  return (
    <Phone>
      <Head
        kicker={timeName}
        kickerMuted
        title={
          !loaded || (error && items.length === 0)
            ? undefined
            : items.length === 1
              ? "1 sessão voltou"
              : `${items.length} sessões voltaram`
        }
        body={
          loaded && head && !(error && items.length === 0)
            ? "O que fizeram, e o peso de amanhã."
            : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.error}>
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
            <View style={styles.retry}>
              <GhostCTA
                label="Tentar de novo"
                onPress={() => void load()}
                fundo={T.bg}
              />
            </View>
          </View>
        ) : null}

        {!loaded ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Buscando o que voltou.
            </Txt>
          </Band>
        ) : null}

        {loaded && !head && !error ? (
          <Band rule="none">
            <Txt role="title">Nada voltou ainda.</Txt>
            <Txt role="body" tone="muted" style={styles.emptyLine}>
              Quando alguém terminar a sessão, o aviso cai aqui com o peso já sugerido.
            </Txt>
          </Band>
        ) : null}

        {head ? (
          <>
            {/* O herói: a próxima decisão, em número, unidade e direção por FORMA.
                Sem baseline — a API não devolve a carga de amanhã, e baseline inventada
                é pior que nenhuma. A causa vem logo abaixo, na tela, sem toque. */}
            <Band rule="hair">
              <View style={styles.who}>
                <Initials name={head.name} size={30} />
                <Txt role="body" numberOfLines={1} style={styles.name}>
                  {head.name}
                </Txt>
                <Txt role="label" tone="dim">
                  {hourOf(head.created_at)}
                </Txt>
              </View>
              <Figure
                value={kg(bump)}
                unit="kg"
                label="Amanhã · 1º exercício"
                dir={dirOf(bump)}
                role="hero"
              />
              <Txt role="body" tone="muted" style={styles.why}>
                {why(head, bump)}
              </Txt>
            </Band>

            {head.records.length ? (
              <MetricGrid
                cells={head.records.map((rec) => ({
                  label: `PR · ${rec.exercise_name}`,
                  value: formatKg(rec.load_kg),
                  unit: "kg",
                  dir: "up" as const,
                  // baseline real, vinda da própria sessão. Sem número anterior, sem nota.
                  note:
                    rec.previous_kg > 0
                      ? `antes ${formatKg(rec.previous_kg)} kg`
                      : undefined,
                }))}
              />
            ) : null}

            {(head.swaps ?? []).map((sw) => (
              <View
                key={`${sw.from}>${sw.to}`}
                style={[styles.swap, { borderLeftColor: A.mark }]}
              >
                {/* a lei do domínio vira RÓTULO de status, não nota de rodapé: trocar
                    exercício avisa o personal e não quebra a ofensiva. */}
                <Txt role="label">Troca · a ofensiva não quebrou</Txt>
                <Txt role="body" style={styles.swapLine}>
                  {`Trocou ${sw.from} por ${sw.to}.`}
                </Txt>
              </View>
            ))}

            {/* ponytail: sem rótulo. O herói já disse o número e o botão repete —
                três caixas com −2,5 / 0 / +2,5 não precisam ser apresentadas. */}
            <Band rule="none">
              <View style={styles.bumps}>
                {BUMPS.map((b) => (
                  <Choice
                    key={b}
                    label={kg(b)}
                    selected={bump === b}
                    flex
                    onPress={() =>
                      setBumpFor((prev) => ({ ...prev, [head.alert_id]: b }))
                    }
                  />
                ))}
              </View>
            </Band>
          </>
        ) : null}

        {rest.length ? (
          <View style={styles.queue}>
            <Txt role="label" style={styles.queueHead}>
              {`Na fila · ${rest.length}`}
            </Txt>
            {rest.map((row) => (
              <Pressable
                key={row.alert_id}
                onPress={() => setFocusId(row.alert_id)}
                accessibilityRole="button"
                style={styles.row}
              >
                <Initials name={row.name} size={30} />
                <Txt role="body" numberOfLines={1} style={styles.rowName}>
                  {row.name}
                </Txt>
                <TrendMark dir={dirOf(bumpOf(row))} color={T.muted} size={10} />
                <Txt role="label" tone="dim">
                  {`${kg(bumpOf(row))} kg`}
                </Txt>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {head ? (
        <DockFooter>
          {/* quiet: ação repetida numa fila não gasta o orçamento de acento da tela.
              O acento aqui marca a ESCOLHA (o Choice), não o botão. */}
          <AccentCTA
            label={`Aplicar ${kg(bump)} kg`}
            meta={first(head.name)}
            check
            quiet
            busy={busy === head.alert_id}
            disabled={busy !== null}
            onPress={() => void apply(head, bump)}
          />
        </DockFooter>
      ) : null}
    </Phone>
  );
}

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1, paddingBottom: 24 },
    error: { paddingHorizontal: T.pad, paddingTop: SPACE.tight },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    emptyLine: { marginTop: 8 },
    who: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    name: { flex: 1, minWidth: 0 },
    why: { marginTop: 8 },
    swap: {
      marginHorizontal: T.pad,
      marginTop: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderLeftWidth: 3,
      backgroundColor: T.raised,
    },
    swapLine: { marginTop: 2 },
    bumps: { flexDirection: "row", gap: 8 },
    queue: { paddingTop: 8 },
    queueHead: { paddingHorizontal: T.pad, paddingBottom: 6 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 13,
      borderTopWidth: 1,
      borderTopColor: T.hairline,
    },
    rowName: { flex: 1, minWidth: 0 },
  }),
);
