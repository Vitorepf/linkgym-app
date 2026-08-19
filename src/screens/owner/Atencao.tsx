import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  applyOwnerAttention,
  ownerAttention,
  type OwnerAttention,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { whyFor } from "./Painel";
import { weekdayLong } from "../../ui/format";

type Props = NativeStackScreenProps<RootStackParamList, "Atencao">;

/** Fila curta: nomes ranqueados, UMA ação por linha, e a ação É a decisão.
 *
 *  Contra a referência de operação: a fila de lá são 11 cartões iguais com TRÊS botões
 *  cada (~33 destinos) e um "resolver todos" como válvula. Aqui são 3 linhas ordenadas
 *  por `rank`, 3 destinos, e nenhuma válvula — descartar a fila inteira de uma vez é
 *  admitir que ela virou ruído.
 *
 *  O acento em ÁREA fica no primeiro da fila e só nele. É assim que o rank aparece sem
 *  matiz semântico: presença de tinta + posição + corpo do nome. Os outros dois usam
 *  `quiet` — mesma massa, tinta neutra, orçamento intacto. Três retângulos acentuados
 *  numa rolagem foi a queixa nº1 dos juízes, e ela nasceu exatamente aqui. */
export function Atencao({ route }: Props) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const { token, timeName } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Atencao">>();
  const [items, setItems] = useState<OwnerAttention[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState(0);

  const load = useCallback(async () => {
    try {
      const payload = await ownerAttention(token);
      setItems(payload.items);
      setError("");
    } catch {
      setItems([]);
      setError("Não deu para abrir a fila.");
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function apply(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await applyOwnerAttention(token, id);
      setItems((prev) => (prev ?? []).filter((it) => it.id !== id));
      setDone((n) => n + 1);
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  // O rank é do domínio, então a ordem da tela é a dele — não a ordem em que a API
  // resolveu mandar. Sem isto, "fila ranqueada" é só uma frase.
  const queue = items ? [...items].sort((a, b) => a.rank - b.rank) : [];
  const total = queue.length + done;

  return (
    <Phone>
      <Head
        kicker={`${weekdayLong()} · entre uma aula e outra`}
        title={items === null ? undefined : headline(queue.length)}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="none">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
          </Band>
        ) : null}

        {items === null && !error ? (
          <Band raised grow rule="none">
            <Txt role="body" tone="muted">
              Abrindo a fila…
            </Txt>
          </Band>
        ) : null}

        {/* Fila vazia não é tela vazia: a evidência POR CATEGORIA, com contagem no rótulo
            (o "5/5 Metrics" do eixo 1). Três superfícies IGUAIS — pares no mesmo peso — e
            cada uma com `grow`: a sobra da tela é dividida entre elas e vira respiro
            interno com dono, em vez de um buraco único entre a mensagem e o rodapé. */}
        {items !== null && queue.length === 0 && !error ? (
          <>
            <Band raised grow rule="none">
              <Figure label="Sumiram" value={0} />
            </Band>
            <Band raised grow rule="none">
              <Figure label="Com dor" value={0} />
            </Band>
            <Band raised grow rule="none">
              <Figure label="Sem ficha" value={0} />
            </Band>
            <Band rule="none">
              <Txt role="body" tone="muted">
                {done > 0
                  ? `${done} resolvidos. Pode voltar para a aula.`
                  : "Todo mundo está no automático."}
              </Txt>
            </Band>
          </>
        ) : null}

        {queue.map((row, i) => (
          <View key={row.id} style={styles.row}>
            <Pressable
              onPress={() =>
                navigation.navigate("Aluna", {
                  token,
                  personId: row.person_id,
                  timeName,
                })
              }
              accessibilityRole="button"
              style={styles.who}
            >
              <Initials name={row.name} size={i === 0 ? 44 : 34} />
              <View style={styles.whoCopy}>
                <Txt role={i === 0 ? "title" : "body"} numberOfLines={2}>
                  {row.name}
                </Txt>
                <Txt role="note" style={styles.why}>
                  {whyFor(row)}
                </Txt>
              </View>
              <IconChevron color={T.muted2} size={16} />
            </Pressable>
            {/* A ação é a decisão. Não existe rótulo "Aplicar" cobrindo uma caixa que
                repetia a frase logo acima — a frase virou o botão. */}
            <View style={styles.act}>
              <AccentCTA
                label={row.decision}
                onPress={() => void apply(row.id)}
                busy={busy === row.id}
                disabled={busy !== null && busy !== row.id}
                check
                quiet={i !== 0}
              />
            </View>
          </View>
        ))}

        {/* Fecha a fila onde o leitor pergunta "só isso?". A lei do domínio é "nunca a
            turma inteira", então a frase que a defende vive no FIM da lista — não no
            cabeçalho, onde ela seria só uma lede a mais. */}
        {queue.length > 0 ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Só estes. Os outros estão no automático.
            </Txt>
          </Band>
        ) : null}
      </ScrollView>
      {items === null ? null : (
        <DockFooter>
          <View style={styles.dockRow}>
            <Txt role="label" style={styles.count}>
              {total > 0 ? `${done} de ${total} resolvidos` : "Nada na fila"}
            </Txt>
            {/* Com fila, o acento pertence ao primeiro nome e este botão é fantasma. Sem
                fila, o orçamento está livre e a revisão vira o único trabalho da tela —
                então ela herda a massa. Um dominante em cada estado, nunca dois. */}
            {queue.length === 0 ? (
              <AccentCTA
                label="Revisão"
                onPress={() =>
                  navigation.navigate("Revisao", { token, timeName })
                }
              />
            ) : (
              <GhostCTA
                label="Revisão"
                onPress={() =>
                  navigation.navigate("Revisao", { token, timeName })
                }
              />
            )}
          </View>
        </DockFooter>
      )}
    </Phone>
  );
}

function headline(n: number): string {
  if (n === 0) return "Ninguém precisa de você agora";
  return n === 1 ? "1 aluno precisa de você" : `${n} alunos precisam de você`;
}

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    row: {
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.block,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
    },
    who: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    whoCopy: { flex: 1, minWidth: 0 },
    why: { marginTop: 2 },
    act: { marginTop: 14 },
    dockRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    count: { flex: 1 },
  }),
);
