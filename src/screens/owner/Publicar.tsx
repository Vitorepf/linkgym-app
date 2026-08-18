import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ownerWeek,
  publishPrescription,
  type OwnerWeekItem,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, errorInk, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { IconCheck } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Publicar">;

export function Publicar({ route }: Props) {
  const { token, accent, prescriptionId, personId, personName } = route.params;
  const A = accentSet(accent, T.raised);
  // null = ainda carregando. [] = ninguém mais na turma. Os três estados são visíveis.
  const [others, setOthers] = useState<OwnerWeekItem[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(0);

  const load = useCallback(async () => {
    try {
      const payload = await ownerWeek(token);
      setOthers(payload.items.filter((it) => it.person_id !== personId));
      setError("");
    } catch {
      setError("Não deu para abrir a turma.");
      setOthers([]);
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      if (sent) return;
      void load();
    }, [load, sent]),
  );

  const rows = others ?? [];
  const also = rows.filter((it) => picked[it.person_id]);
  // O número dominante da tela: a prescrição desta pessoa mais uma por nome marcado.
  const count = 1 + also.length;
  const turma = 1 + rows.length;
  const all = rows.length > 0 && also.length === rows.length;

  async function publish() {
    if (busy) return;
    setBusy(true);
    const n = count;
    try {
      await publishPrescription(
        token,
        prescriptionId,
        also.map((it) => it.person_id),
      );
      setSent(n);
      setError("");
    } catch {
      setError("Não deu para publicar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head kicker={personName} title="Publicar" kickerMuted accent={accent} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Txt role="body" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {!sent ? (
          <>
            <Band>
              <Figure
                role="hero"
                value={count}
                label={count === 1 ? "Prescrição" : "Prescrições"}
                note={others ? `de ${turma} na turma` : undefined}
              />
              <Txt role="body" tone="muted" style={styles.cause}>
                Mesma estrutura. A carga sai da última sessão de cada um; sem
                sessão, a inicial.
              </Txt>
            </Band>

            <View style={styles.header}>
              <Txt role="label">Também para</Txt>
              {rows.length > 0 ? <Txt role="label">Feito na semana</Txt> : null}
            </View>

            {others === null ? (
              <Txt role="body" tone="muted" style={styles.state}>
                Carregando a turma.
              </Txt>
            ) : null}

            {others !== null && rows.length === 0 ? (
              <Txt role="body" tone="muted" style={styles.state}>
                Ninguém mais na turma ainda.
              </Txt>
            ) : null}

            {/* Um toque marca a turma inteira: é isto que mantém o lote plano em n.
                Papel de acessibilidade é checkbox, não button — o contador de toques
                de tools/taps.mjs varre os botões da lista um a um. */}
            {rows.length > 0 ? (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: all }}
                style={styles.row}
                onPress={() =>
                  setPicked(
                    all
                      ? {}
                      : Object.fromEntries(rows.map((it) => [it.person_id, true])),
                  )
                }
              >
                <Box on={all} />
                <Txt role="body" style={styles.name}>
                  Todos os {rows.length}
                </Txt>
              </Pressable>
            ) : null}

            {rows.map((row) => {
              const on = Boolean(picked[row.person_id]);
              return (
                <Pressable
                  key={row.person_id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={styles.row}
                  onPress={() =>
                    setPicked((prev) => ({ ...prev, [row.person_id]: !on }))
                  }
                >
                  <Box on={on} />
                  <Txt role="body" numberOfLines={1} style={styles.name}>
                    {row.name}
                  </Txt>
                  <Txt role="label" tone="dim">
                    {row.adherence}
                  </Txt>
                </Pressable>
              );
            })}
          </>
        ) : null}
      </ScrollView>

      {!sent ? (
        <DockFooter>
          <AccentCTA
            label="Publicar"
            meta={count === 1 ? "1 pessoa" : `${count} pessoas`}
            onPress={() => void publish()}
            busy={busy}
            accent={accent}
          />
        </DockFooter>
      ) : null}

      {sent ? (
        <View style={styles.overlay} pointerEvents="auto">
          <View style={[styles.sheet, { borderColor: A.mark }]}>
            <Figure
              role="value"
              value={sent}
              label={sent === 1 ? "Prescrição no ar" : "Prescrições no ar"}
            />
            <Txt role="body" style={styles.sheetBody}>
              {personName} já vê no Hoje
              {sent > 1
                ? `. As outras ${sent - 1}, cada uma com a carga do próprio corpo.`
                : "."}
            </Txt>
          </View>
        </View>
      ) : null}
    </Phone>
  );
}

/** ponytail: a caixa de marcar é a mesma nas duas linhas — nome e "todos". Uma peça
 *  local, porque marcar nome só acontece aqui e na Revisão, que tem a sua. */
function Box({ on }: { on: boolean }) {
  return (
    <View
      style={[styles.check, on && { backgroundColor: T.ink, borderColor: T.ink }]}
    >
      {on ? <IconCheck color={T.bg} size={14} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  error: { paddingHorizontal: T.pad, paddingTop: 12 },
  cause: { marginTop: 14 },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: T.pad,
    paddingTop: 20,
    paddingBottom: 6,
  },
  state: { paddingHorizontal: T.pad, paddingVertical: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  name: { flex: 1, minWidth: 0 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,10,10,0.86)",
    justifyContent: "flex-end",
    paddingHorizontal: T.pad,
    paddingBottom: 24,
  },
  sheet: {
    backgroundColor: T.surface,
    borderWidth: 2,
    paddingHorizontal: T.pad,
    paddingTop: 24,
    paddingBottom: 22,
  },
  sheetBody: { marginTop: 10 },
});
