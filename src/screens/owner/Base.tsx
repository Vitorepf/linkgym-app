import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { draftFromLast, listModels, ownerStudent, ownerWeek } from "../../api";
import type { OwnerStudent } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, errorInk, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { IconCheck } from "../../ui/Icons";
import { useTone } from "../../ui/motion";
import { DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg } from "../../ui/format";

type From = "last" | "model";
type Load = OwnerStudent["last_loads"][number];

type Props = {
  token: string;
  studioName: string;
  accent: string;
  personId?: string;
  personName?: string;
  tab?: boolean;
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

export function Base({
  token,
  studioName,
  accent,
  personId: initialPersonId,
  personName: initialPersonName,
  tab,
}: Props) {
  const A = accentSet(accent, T.raised);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [personId, setPersonId] = useState(initialPersonId ?? "");
  const [personName, setPersonName] = useState(initialPersonName ?? "");
  const [modelId, setModelId] = useState("");
  // O NOME do modelo vem do servidor. A tela não pode chumbar um nome de Modelo — nem
  // para achar nem para escrever —, senão carrega no código a palavra que o modelo tiver.
  const [modelName, setModelName] = useState("");
  const [loads, setLoads] = useState<Load[]>([]);
  const [picked, setPicked] = useState<From>("last");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [models, week] = await Promise.all([
        listModels(token),
        ownerWeek(token),
      ]);
      const modelo = models.items[0];
      if (!modelo) {
        setError("Não deu para achar o modelo.");
        return;
      }
      setModelId(modelo.id);
      setModelName(modelo.name);
      const first = week.items[0];
      const pid = initialPersonId || first?.person_id || "";
      setPersonId(pid);
      setPersonName(initialPersonName || first?.name || "");
      setError("");
      if (!pid) return;
      // A CAUSA na tela: os números que este corpo já carrega, antes do toque. Sem esta
      // chamada a escolha é uma pergunta sem evidência — que é o defeito da barra.
      const student = await ownerStudent(token, pid);
      setLoads(student.last_loads);
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, initialPersonId, initialPersonName]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function start(from: From) {
    if (busy || !modelId || !personId) return;
    setBusy(true);
    try {
      const draft = await draftFromLast(token, modelId, personId, from);
      setError("");
      navigation.navigate("Ajustar", {
        token,
        studioName,
        accent,
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
    <Phone tab={tab}>
      <Head
        kicker={personName || "Nova ficha"}
        title="De onde a gente parte?"
        kickerMuted
        accent={accent}
      />
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
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Continuar"
          meta={keeps ? `${total} cargas` : "carga de partida"}
          accent={accent}
          busy={busy}
          disabled={!personId || !modelId}
          onPress={() => void start(picked)}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: { paddingHorizontal: T.pad, paddingTop: 12 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: T.pad,
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
    borderLeftWidth: 3,
  },
  check: {
    width: 22,
    height: 22,
    marginTop: 3,
    borderWidth: 2,
    borderColor: T.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkOn: { backgroundColor: T.ink },
  rowBody: { flex: 1, minWidth: 0 },
  rowNote: { marginTop: 4 },
  evidence: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: T.pad,
    paddingTop: 32,
  },
  empty: { marginTop: 8 },
  list: { marginTop: 26, borderTopWidth: 2, borderTopColor: T.divider },
  load: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  loadName: { flex: 1, minWidth: 0 },
  kg: { fontVariant: ["tabular-nums"] },
  out: { textDecorationLine: "line-through" },
});
