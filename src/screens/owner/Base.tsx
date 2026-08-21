import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { draftFromLast, listModels, ownerStudent } from "../../api";
import type { ModelSummary, OwnerStudent } from "../../api";
import { GhostCTA } from "../../ui/GhostCTA";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { IconCheck } from "../../ui/Icons";
import { useTone } from "../../ui/motion";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { formatKg } from "../../ui/format";

type From = "last" | "model";
type Load = OwnerStudent["last_loads"][number];

type Props = {
  token: string;
  timeName: string;
  /** Quem. Era opcional, e o opcional virava `week.items[0]` — a tela abria a ficha de
   *  quem calhasse de vir primeiro na semana. Rota empilhada, pessoa obrigatória. */
  personId: string;
  personName: string;
};

/** Uma origem. Seleção é TOM no mesmo elemento mais um traço à esquerda — nunca um matiz
 *  que signifique "certo". O componente existe porque `useTone` é hook e as duas linhas
 *  saem de um map. */
function Origem({
  title,
  body,
  selected,
  mark,
  onPress,
}: {
  title: string;
  body: string;
  selected: boolean;
  mark: string;
  onPress: () => void;
}) {
  const styles = usarEstilos();
  const { T } = useTema();
  const tone = useTone(selected, T.bg, T.raised);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${body}`}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.row,
          tone,
          { borderLeftColor: selected ? mark : "transparent" },
        ]}
      >
        <View style={[styles.check, selected && styles.checkOn]}>
          {selected ? <IconCheck color={T.bg} size={14} /> : null}
        </View>
        <View style={styles.rowBody}>
          <Txt role="body">{title}</Txt>
          <Txt role="label" tone="dim" style={styles.rowNote}>
            {body}
          </Txt>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function Base({ token, timeName, personId, personName }: Props) {
  const styles = usarEstilos();
  const { T, acento, errorInk } = useTema();
  const A = acento(undefined, T.raised);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modelId, setModelId] = useState("");
  // O NOME do modelo vem do servidor. A tela não pode chumbar um nome de Modelo — nem
  // para achar nem para escrever —, senão carrega no código a palavra que o modelo tiver.
  const [modelName, setModelName] = useState("");
  const [models, setModels] = useState<ModelSummary[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const [picked, setPicked] = useState<From>("last");
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      // A CAUSA na tela: os números que este corpo já carrega, antes do toque. Sem esta
      // chamada a escolha é uma pergunta sem evidência — que é o defeito da barra.
      const [listed, student] = await Promise.all([
        listModels(token),
        ownerStudent(token, personId),
      ]);
      const items = listed.items;
      setModels(items);
      setLoads(student.last_loads);
      if (items.length === 0) {
        setModelId("");
        setModelName("");
        setEmpty(true);
        setError("");
        return;
      }
      setEmpty(false);
      setError("");
      setModelId((current) => items.find((m) => m.id === current)?.id ?? items[0].id);
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  useEffect(() => {
    const m = models.find((it) => it.id === modelId);
    if (m) setModelName(m.name);
  }, [models, modelId]);

  async function start(from: From) {
    if (busy || !modelId) return;
    setBusy(true);
    try {
      const draft = await draftFromLast(token, modelId, personId, from);
      setError("");
      navigation.navigate("Ajustar", {
        token,
        timeName,
        prescriptionId: draft.draft_id,
        personId,
        personName,
        items: draft.items,
      });
    } catch {
      setError("Não deu para criar o rascunho.");
    } finally {
      setBusy(false);
    }
  }

  const who = personName.trim().split(/\s+/)[0] || "o aluno";
  const total = loads.length;
  const keeps = picked === "last";

  return (
    <Phone>
      <Head
        kicker={personName || "Nova ficha"}
        title="De onde a gente parte?"
        kickerMuted
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.error}>
            <Txt role="note" color={errorInk}>
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

        {empty ? (
          <View style={styles.error}>
            <Txt role="body">
              Ainda não tem um modelo. Sem ele não dá para publicar a primeira
              ficha.
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

        {models.length === 0 ? null : (
          <>
        {models.length > 1
          ? models.map((m) => (
              <Origem
                key={m.id}
                title={m.name}
                body="Estrutura deste modelo"
                selected={modelId === m.id}
                mark={A.mark}
                onPress={() => {
                  setModelId(m.id);
                  setModelName(m.name);
                }}
              />
            ))
          : null}

        <Origem
          title={`Última ficha de ${who}`}
          body={total ? `${total} cargas já levantadas` : "Sem carga registrada"}
          selected={keeps}
          mark={A.mark}
          onPress={() => setPicked("last")}
        />
        <Origem
          title={`Modelo ${modelName}`.trim()}
          body="Só a estrutura. Cargas de partida."
          selected={!keeps}
          mark={A.mark}
          onPress={() => setPicked("model")}
        />

        {/* O terço de baixo é a conta da escolha: quantos números deste corpo atravessam,
            e QUAIS. A consequência é marcada por FORMA — o traço sobre o número que fica
            de fora —, nunca por matiz. */}
        <View style={styles.evidence}>
          {total ? (
            <Figure
              role="mega"
              label={`cargas de ${who} nesta ficha`}
              value={keeps ? total : 0}
              unit={`de ${total}`}
              note={
                keeps
                  ? `Saem da última ficha. Onde o ${modelName} pedir outro exercício, entra a carga de partida.`
                  : `Nenhuma. O ${modelName} entra inteiro na carga de partida, igual para todo mundo.`
              }
            />
          ) : (
            <View>
              <Txt role="label">{`cargas de ${who} nesta ficha`}</Txt>
              <Txt role="body" style={styles.empty}>
                {who} ainda não levantou nada aqui. Os dois caminhos começam na
                carga de partida do {modelName}.
              </Txt>
            </View>
          )}

          <View style={styles.list}>
            {loads.map((l) => (
              <View key={l.exercise_name} style={styles.load}>
                <Txt
                  role="body"
                  tone={keeps ? "ink" : "dim"}
                  numberOfLines={1}
                  style={styles.loadName}
                >
                  {l.exercise_name}
                </Txt>
                <Txt
                  role="title"
                  tone={keeps ? "ink" : "dim"}
                  style={[styles.kg, !keeps && styles.out]}
                >
                  {formatKg(l.load_kg)}
                </Txt>
                <Txt role="label" tone={keeps ? "muted" : "dim"}>
                  kg
                </Txt>
              </View>
            ))}
          </View>
        </View>
          </>
        )}
      </ScrollView>
      {models.length === 0 ? null : (
      <DockFooter>
        <AccentCTA
          label="Continuar"
          meta={keeps ? `${total} cargas` : "carga de partida"}
          busy={busy}
          disabled={!modelId}
          onPress={() => void start(picked)}
        />
      </DockFooter>
      )}
    </Phone>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1, paddingBottom: 8 },
    error: { paddingHorizontal: T.pad, paddingTop: SPACE.tight },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: SPACE.tight,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.block,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
      // o traço de seleção é ÊNFASE: um degrau acima do traço forte, senão ele empata
      // com a régua da lista e a linha escolhida deixa de se anunciar.
      borderLeftWidth: FORMA.borda + 1,
    },
    check: {
      width: 22,
      height: 22,
      marginTop: 3,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioEm(22),
      borderColor: T.ink,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    checkOn: { backgroundColor: T.ink },
    rowBody: { flex: 1, minWidth: 0 },
    rowNote: { marginTop: SPACE.hair },
    evidence: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: T.pad,
      paddingTop: SPACE.block,
    },
    empty: { marginTop: 8 },
    list: { marginTop: SPACE.block, borderTopWidth: FORMA.borda, borderTopColor: T.divider },
    load: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      paddingVertical: SPACE.step,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    loadName: { flex: 1, minWidth: 0 },
    kg: { fontVariant: ["tabular-nums"] },
    out: { textDecorationLine: "line-through" },
  }),
);
