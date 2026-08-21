import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { deleteModel, listModels, type ModelSummary } from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron, IconClose, IconFicha } from "../../ui/Icons";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";

type Props = {
  token: string;
  timeName: string;
};

/** A biblioteca de treinos. Busca, cria, abre, apaga — o que a lista de nomes
 *  recusava. O detalhe é o documento, como a ficha do aluno. */
export function Modelos({ token, timeName }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, errorInk } = useTema();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<ModelSummary[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const payload = await listModels(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir as fichas.");
    } finally {
      setLoaded(true);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const rows = useMemo(() => {
    const alvo = chave(q);
    if (!alvo) return items;
    return items.filter((it) => chave(it.name).includes(alvo));
  }, [items, q]);

  function nova() {
    navigation.navigate("NovaModelo", { token, timeName });
  }

  function apagar(row: ModelSummary) {
    Alert.alert(
      row.name,
      "Tira esta ficha da biblioteca. Quem já treinou nela continua com o que recebeu.",
      [
        { text: "Deixar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => {
            void (async () => {
              try {
                await deleteModel(token, row.id);
                setItems((cur) => cur.filter((it) => it.id !== row.id));
                setError("");
              } catch {
                setError("Não deu para apagar a ficha.");
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
        title={
          !loaded || (error && items.length === 0)
            ? undefined
            : items.length === 0
              ? "Fichas"
              : `${items.length} ${items.length === 1 ? "ficha" : "fichas"}`
        }
        kickerMuted
        right={
          <View style={styles.headRight}>
            <Pressable
              onPress={nova}
              accessibilityRole="button"
              accessibilityLabel="Nova ficha"
              hitSlop={8}
              style={styles.nova}
            >
              <Txt role="label">Nova</Txt>
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              style={styles.fechar}
            >
              <IconClose color={T.muted} size={20} />
            </Pressable>
          </View>
        }
      >
        <Campo
          label="Buscar por nome"
          value={q}
          onChangeText={setQ}
          placeholder="Buscar por nome"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={styles.busca}
        />
      </Head>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        keyboardShouldPersistTaps="handled"
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

        {loaded && !error && rows.length === 0 ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              {items.length === 0
                ? "Ainda não tem ficha. A ficha é o treino que você aplica em cada aluno."
                : `Nenhum nome com "${q.trim()}".`}
            </Txt>
            {items.length === 0 ? (
              <View style={styles.cta}>
                <AccentCTA label="Criar a primeira ficha" onPress={nova} />
              </View>
            ) : null}
          </Band>
        ) : null}

        {rows.map((row) => (
          <Pressable
            key={row.id}
            accessibilityRole="button"
            accessibilityLabel={row.name}
            accessibilityHint="Segura para apagar"
            style={styles.row}
            onPress={() =>
              navigation.navigate("Modelo", {
                token,
                timeName,
                modelId: row.id,
                modelName: row.name,
              })
            }
            onLongPress={() => apagar(row)}
          >
            <View style={styles.well}>
              <IconFicha color={T.ink} size={18} />
            </View>
            <View style={styles.who}>
              <Txt role="body" numberOfLines={1}>
                {row.name}
              </Txt>
            </View>
            <IconChevron color={T.muted2} size={16} />
          </Pressable>
        ))}
      </ScrollView>
    </Phone>
  );
}

function chave(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    busca: { marginTop: SPACE.tight },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    cta: { marginTop: SPACE.step },
    headRight: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
    nova: {
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      borderRadius: FORMA.raioAcao,
      minHeight: FORMA.alturaMinima,
      justifyContent: "center",
      paddingHorizontal: SPACE.tight,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 14,
      minHeight: 64,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    well: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: T.fill,
      borderRadius: FORMA.raioEm(FORMA.alturaMinima),
    },
    who: { flex: 1, minWidth: 0, gap: SPACE.hair },
  }),
);
