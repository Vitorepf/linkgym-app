import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { deleteModel, getModel, type ModelDetail, type ModelItem } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconClose } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatKg, plannedSets } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Props = RootStackParamList["Modelo"];

/** UM Modelo no mesmo documento que o aluno lê: herói, lista, séries. Carga de
 *  estreia no lugar da carga do corpo — esta ficha ainda não é de ninguém. */
export function Modelo({ token, timeName, modelId, modelName }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, errorInk } = useTema();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [card, setCard] = useState<ModelDetail | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const got = await getModel(token, modelId);
      setCard(got);
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, modelId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const rows = card
    ? [...card.items].sort((a, b) => a.position - b.position)
    : [];
  const title = card?.name ?? modelName;

  function editar() {
    navigation.navigate("NovaModelo", {
      token,
      timeName,
      modelId,
      modelName: title,
    });
  }

  function apagar() {
    if (!card || busy) return;
    Alert.alert(
      card.name,
      "Tira esta ficha da biblioteca. Quem já treinou nela continua com o que recebeu.",
      [
        { text: "Deixar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => {
            void (async () => {
              setBusy(true);
              try {
                await deleteModel(token, modelId);
                navigation.navigate("Modelos");
              } catch {
                setError("Não deu para apagar a ficha.");
                setBusy(false);
              }
            })();
          },
        },
      ],
    );
  }

  return (
    <Phone>
      <Head
        kicker={timeName}
        title={title}
        kickerMuted
        right={
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={8}
            style={styles.fechar}
          >
            <IconClose color={T.muted} size={20} />
          </Pressable>
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="none">
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
          </Band>
        ) : null}

        {card && rows.length === 0 ? (
          <Band>
            <Txt role="body" tone="muted">
              Esta ficha ainda não tem exercício.
            </Txt>
          </Band>
        ) : null}

        {card && rows.length > 0 ? (
          <>
            <Band>
              <Figure
                value={plannedSets(rows)}
                label="Séries previstas"
                note={ledger(rows)}
                role="hero"
              />
            </Band>

            <View style={styles.colHead}>
              <Txt role="label" style={styles.colName}>
                Exercício
              </Txt>
              <Txt role="label" style={styles.colKg}>
                Estreia kg
              </Txt>
            </View>

            {rows.map((item, i) => (
              <View
                key={item.id}
                style={[styles.row, i === rows.length - 1 && styles.last]}
              >
                <View style={styles.line}>
                  <Txt role="label" tone="dim" style={styles.ord}>
                    {String(i + 1).padStart(2, "0")}
                  </Txt>
                  <Txt role="body" style={styles.name}>
                    {item.name}
                  </Txt>
                  <Txt role="body" style={styles.kg}>
                    {item.starter_load_kg > 0
                      ? formatKg(item.starter_load_kg)
                      : "—"}
                  </Txt>
                </View>
                <Txt role="note" tone="dim" style={styles.meta}>
                  {item.planned_sets} × {item.planned_reps}
                </Txt>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>

      {card ? (
        <DockFooter>
          <AccentCTA label="Editar a ficha" onPress={editar} />
          <View style={styles.segunda}>
            <GhostCTA
              label="Apagar"
              onPress={apagar}
              fundo={T.bg}
              tom="perigo"
            />
          </View>
        </DockFooter>
      ) : null}
    </Phone>
  );
}

function ledger(rows: ModelItem[]): string {
  const n = rows.length;
  return `${n} exercício${n > 1 ? "s" : ""}`;
}

const ORD = 26;

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
    colHead: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: T.pad,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: T.divider,
    },
    colName: { flex: 1, marginLeft: ORD + 8 },
    colKg: { width: 78, textAlign: "right" },
    row: {
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
      flexGrow: 1,
      justifyContent: "center",
    },
    last: { borderBottomWidth: 0 },
    line: { flexDirection: "row", alignItems: "baseline", gap: 8 },
    ord: { width: ORD },
    name: { flex: 1, minWidth: 0 },
    kg: { width: 70, textAlign: "right", fontVariant: ["tabular-nums"] },
    meta: { marginTop: 2, paddingLeft: ORD + 8 },
    segunda: { marginTop: SPACE.tight },
  }),
);
