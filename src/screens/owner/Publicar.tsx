import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ApiError,
  ownerWeek,
  publishPrescription,
  type OwnerWeekItem,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { Figure } from "../../ui/Figure";
import { IconCheck } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Publicar">;

export function Publicar({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { T, acento, errorInk } = useTema();
  const { token, prescriptionId, personId, personName } = route.params;
  const A = acento(undefined, T.raised);
  // null = ainda carregando. [] = ninguém mais na turma. Os três estados são visíveis.
  const [others, setOthers] = useState<OwnerWeekItem[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  // A frase do dia, na voz dele. Vazia é o estado normal — e vazia o aluno não vê bloco
  // nenhum, em vez de ver o produto falando com o rosto do personal.
  const [frase, setFrase] = useState("");
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
        frase,
      );
      setSent(n);
      setError("");
      // Publicado, a volta por gesto deixa de ser saída: ela cai em Ajustar, que ainda
      // segura `items` e `prescriptionId` nos params — republicaria a mesma prescrição.
      // Daqui em diante existe UM caminho, e ele é o botão do overlay.
      navigation.setOptions({ gestureEnabled: false });
    } catch (e) {
      // O servidor só sabe dizer `invalido`, e nesta tela a única coisa que a mão do
      // personal escreve é a frase: então o aviso NOMEIA a regra em vez de dar de ombros.
      setError(
        e instanceof ApiError && e.code === "invalido" && frase.trim()
          ? "Link e telefone não entram na frase."
          : "Não deu para publicar.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head kicker={personName} title="Publicar" kickerMuted />
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

            {/* A VOZ DO PERSONAL, onde ela nasce: junto da prescrição, porque é sobre
                este dia. Opcional de verdade — sem frase o app cala, e calar é o
                contrário de assinar uma frase de produto com o nome dele. */}
            <Band rule="hair">
              <Campo
                label="Seu recado"
                rotulo
                nota={`${
                  count === 1
                    ? `Aparece no Hoje de ${personName}, com seu nome.`
                    : `Aparece no Hoje das ${count} pessoas, com seu nome.`
                } Em branco, ninguém fala no seu lugar.`}
                hint="Aparece no Hoje do aluno, com seu nome. Em branco, o app não escreve nada"
                value={frase}
                onChangeText={setFrase}
                placeholder="Hoje é técnica. Deixa o peso esperar."
                maxLength={100}
              />
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
            {/* A única saída da tela. Volta para a rota do painel, não fecha o overlay:
                fechar devolveria esta tela, e atrás dela Ajustar com o rascunho vivo.
                `popTo` e não `navigate` pelo mesmo motivo de tools/pilha.mjs: descer
                até uma rota que já está na pilha, sem chance de empilhar outra. */}
            <AccentCTA
              label="Voltar ao painel"
              onPress={() => navigation.popTo("Painel", { screen: "Painel" })}
              check
              block
            />
          </View>
        </View>
      ) : null}
    </Phone>
  );
}

/** ponytail: a caixa de marcar é a mesma nas duas linhas — nome e "todos". Uma peça
 *  local, porque marcar nome só acontece aqui e na Revisão, que tem a sua. */
function Box({ on }: { on: boolean }) {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <View
      style={[styles.check, on && { backgroundColor: T.ink, borderColor: T.ink }]}
    >
      {on ? <IconCheck color={T.bg} size={14} /> : null}
    </View>
  );
}

const usarEstilos = estilos(({ T, FORMA }) =>
  StyleSheet.create({
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
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    check: {
      width: 22,
      height: 22,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioEm(22),
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
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raio,
      paddingHorizontal: T.pad,
      paddingTop: 24,
      paddingBottom: 22,
    },
    sheetBody: { marginTop: 10 },
  }),
);
