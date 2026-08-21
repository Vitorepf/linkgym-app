import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ApiError,
  createModel,
  getModel,
  listExercises,
  putModelItems,
  renameModel,
  type Exercise,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconCheck, IconClose } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";

type Props = RootStackParamList["NovaModelo"];

type Linha = {
  exercise_id: string;
  name: string;
  planned_sets: number;
  planned_reps: string;
};

const PADRAO_SERIES = 3;
const PADRAO_REPS = "8-12";

/** Montar a estrutura. Nome, os exercícios na ordem, gravar. Vazio não grava —
 *  o servidor recusa ficha sem item, e a tela não promete o que não consegue. */
export function NovaModelo({ token, timeName, modelId, modelName }: Props) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState(modelName ?? "");
  const [gravado, setGravado] = useState(modelName ?? "");
  const [lib, setLib] = useState<Exercise[]>([]);
  const [picked, setPicked] = useState<Linha[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const editar = Boolean(modelId);

  const load = useCallback(async () => {
    try {
      const listed = await listExercises(token);
      setLib(listed.items);
      if (modelId) {
        const got = await getModel(token, modelId);
        setName(got.name);
        setGravado(got.name);
        setPicked(
          [...got.items]
            .sort((a, b) => a.position - b.position)
            .map((it) => ({
              exercise_id: it.exercise_id,
              name: it.name,
              planned_sets: it.planned_sets,
              planned_reps: it.planned_reps,
            })),
        );
      }
      setError("");
    } catch {
      setError("Não deu para abrir a biblioteca.");
    } finally {
      setLoaded(true);
    }
  }, [token, modelId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filtro = useMemo(() => {
    const alvo = chave(q);
    if (!alvo) return lib;
    return lib.filter((it) => chave(it.name).includes(alvo));
  }, [lib, q]);

  const ids = useMemo(
    () => new Set(picked.map((it) => it.exercise_id)),
    [picked],
  );

  function toggle(ex: Exercise) {
    setPicked((cur) => {
      if (cur.some((it) => it.exercise_id === ex.id)) {
        return cur.filter((it) => it.exercise_id !== ex.id);
      }
      return [
        ...cur,
        {
          exercise_id: ex.id,
          name: ex.name,
          planned_sets: PADRAO_SERIES,
          planned_reps: PADRAO_REPS,
        },
      ];
    });
  }

  const trimmed = name.trim();
  const pode = trimmed.length > 0 && picked.length > 0 && !busy;

  async function gravar() {
    if (!pode) return;
    setBusy(true);
    try {
      const items = picked.map((it) => ({
        exercise_id: it.exercise_id,
        planned_sets: it.planned_sets,
        planned_reps: it.planned_reps,
      }));
      const got = editar && modelId
        ? await (async () => {
            if (trimmed !== gravado.trim()) {
              await renameModel(token, modelId, trimmed);
            }
            return putModelItems(token, modelId, items);
          })()
        : await createModel(token, trimmed, items);
      setError("");
      navigation.replace("Modelo", {
        token,
        timeName,
        modelId: got.id,
        modelName: got.name,
      });
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === "invalido"
          ? "Nome repetido, ou a ficha ficou vazia."
          : "Não deu para gravar a ficha.",
      );
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head
        kicker={timeName}
        title={editar ? "Editar ficha" : "Nova ficha"}
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
      >
        <Campo
          label="Nome da ficha"
          rotulo
          value={name}
          onChangeText={setName}
          placeholder="Treino A"
          maxLength={40}
          style={styles.campo}
        />
        <Campo
          label="Buscar exercício"
          value={q}
          onChangeText={setQ}
          placeholder="Buscar exercício"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={styles.campo}
        />
      </Head>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
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

        {picked.length > 0 ? (
          <View style={styles.sec}>
            <Txt role="label" style={styles.secHead}>
              Nesta ficha · {picked.length}
            </Txt>
            {picked.map((it, i) => (
              <Pressable
                key={it.exercise_id}
                accessibilityRole="button"
                accessibilityLabel={`Tirar ${it.name}`}
                style={styles.row}
                onPress={() =>
                  setPicked((cur) =>
                    cur.filter((x) => x.exercise_id !== it.exercise_id),
                  )
                }
              >
                <Txt role="label" tone="dim" style={styles.ord}>
                  {String(i + 1).padStart(2, "0")}
                </Txt>
                <View style={styles.who}>
                  <Txt role="body">{it.name}</Txt>
                  <Txt role="note" tone="dim">
                    {it.planned_sets} × {it.planned_reps} · toque tira
                  </Txt>
                </View>
              </Pressable>
            ))}
          </View>
        ) : loaded ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Toque nos exercícios para montar a ficha.
            </Txt>
          </Band>
        ) : null}

        <View style={styles.sec}>
          <Txt role="label" style={styles.secHead}>
            Biblioteca
          </Txt>
          {filtro.map((ex) => {
            const on = ids.has(ex.id);
            return (
              <Pressable
                key={ex.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={ex.name}
                style={styles.row}
                onPress={() => toggle(ex)}
              >
                <View style={[styles.check, on && styles.checkOn]}>
                  {on ? <IconCheck color={T.bg} size={14} /> : null}
                </View>
                <Txt role="body" style={styles.libName}>
                  {ex.name}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <DockFooter>
        <AccentCTA
          label={busy ? "Gravando…" : editar ? "Salvar" : "Criar a ficha"}
          onPress={() => void gravar()}
          disabled={!pode}
          busy={busy}
          check
        />
      </DockFooter>
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
    content: { flexGrow: 1, paddingBottom: SPACE.step },
    campo: { marginTop: SPACE.tight },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
    sec: { marginTop: SPACE.tight },
    secHead: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.tight,
      paddingBottom: SPACE.hair,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 12,
      minHeight: FORMA.alturaMinima,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    ord: { width: 28 },
    who: { flex: 1, minWidth: 0, gap: SPACE.hair },
    libName: { flex: 1, minWidth: 0 },
    check: {
      width: 22,
      height: 22,
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(22),
      alignItems: "center",
      justifyContent: "center",
    },
    checkOn: {
      borderColor: T.ink,
      backgroundColor: T.ink,
    },
  }),
);
