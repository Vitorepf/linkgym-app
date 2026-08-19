import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ownerWeek, type OwnerWeekItem } from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { Campo } from "../../ui/Campo";
import { IconChevron } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { AccentCTA } from "../../ui/AccentCTA";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";
import { fio } from "./Revisao";

type Props = {
  token: string;
  timeName: string;
};

/** A porta para QUALQUER pessoa do time.
 *
 *  Antes desta tela o personal só alcançava quem a fila de hoje sinalizava — três nomes.
 *  Quem estava bem era inalcançável, que é o contrário do que o produto promete: a fila
 *  é curta de propósito, não porque a turma tenha três pessoas.
 *
 *  A referência do eixo 2 acerta exatamente uma coisa e ela está aqui: a busca por nome
 *  mora na primeira tela, sem rolar, e custa 2 toques até a pessoa. O que ela erra é a
 *  linha — avatar, nome e um ícone que sai do app. Aqui a linha carrega o fio da semana,
 *  que é o motivo de o personal estar procurando alguém.
 *
 *  Sem acento em ÁREA: esta tela não tem ação dominante, ela tem N pessoas. */
export function Turma({ token, timeName }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, errorInk } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();
  const [items, setItems] = useState<OwnerWeekItem[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const payload = await ownerWeek(token);
      setItems(payload.items);
      setError("");
    } catch {
      setError("Não deu para abrir a turma.");
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

  return (
    <Phone>
      {/* A PORTA fica no cabeçalho, e não só no vazio: um personal com 28 alunos também
          convida o 29º. A primeira versão só mostrava o botão quando a lista estava vazia
          — que é exatamente o momento em que ele tem menos motivo para estar no app. */}
      <Head
        kicker={timeName}
        title={`A turma de ${items.length}`}
        right={
          <Pressable
            onPress={() => navigation.navigate("Convite")}
            accessibilityRole="button"
            accessibilityLabel="Chamar um aluno"
            hitSlop={8}
            style={styles.convidar}
          >
            <Txt role="label">Chamar</Txt>
          </Pressable>
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
          </Band>
        ) : null}

        {loaded && !error && rows.length === 0 ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              {items.length === 0
                ? "Ninguém no time ainda. Chame pelo número e o aluno entra com ele."
                : `Nenhum nome com "${q.trim()}".`}
            </Txt>
            {/* A frase prometia uma porta que não existia: até hoje nenhuma tela, nenhuma
                rota e nenhum botão criavam convite. Prometer porta e não ter é pior que
                não prometer. */}
            {items.length === 0 ? (
              <View style={styles.convite}>
                <AccentCTA
                  label="Chamar o primeiro aluno"
                  onPress={() => navigation.navigate("Convite")}
                />
              </View>
            ) : null}
          </Band>
        ) : null}

        {rows.map((row) => {
          const f = fio(row.adherence);
          return (
            <Pressable
              key={row.person_id}
              accessibilityRole="button"
              style={styles.row}
              onPress={() =>
                navigation.navigate("Aluna", {
                  token,
                  personId: row.person_id,
                  timeName,
                })
              }
            >
              <Initials name={row.name} size={34} />
              <View style={styles.who}>
                <Txt role="body" numberOfLines={1}>
                  {row.name}
                </Txt>
                {f ? (
                  <Txt role="note" tone="dim">
                    {`${f.done} de ${f.planned} nesta semana`}
                  </Txt>
                ) : null}
              </View>
              <IconChevron color={T.muted2} size={16} />
            </Pressable>
          );
        })}
      </ScrollView>
    </Phone>
  );
}

/** Busca de nome brasileiro sem acento e sem caixa: quem procura "fabio" tem que achar
 *  "Fábio". O mesmo corte de diacrítico de tools/palavras.mjs, pela mesma razão. */
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
    convite: { marginTop: SPACE.step },
    convidar: {
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
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    who: { flex: 1, minWidth: 0 },
  }),
);
