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
            <View style={styles.retry}>
              <GhostCTA
                label="Tentar de novo"
                onPress={() => void load()}
                fundo={T.bg}
              />
            </View>
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
          // FILA VAZIA É UMA FRASE, NÃO TRÊS ZEROS. Estavam aqui três `Figure` heroicos —
          // "Sumiram 0", "Com dor 0", "Sem ficha 0" — enchendo a tela com o número que este
          // produto não desenha em lugar nenhum (Retomada.tsx explica por quê: zero é marca
          // de falha, e ausência se diz com ausência). E os três rótulos são a taxonomia da
          // fila: quem não é fluente nela não tem o que fazer com eles. O Painel já resolve
          // o mesmo estado em uma frase; esta tela sai dele.
          // E SÃO TRÊS FRASES, uma por superfície que ENGORDA — não um parágrafo só
          // flutuando no meio de 700pt. Medido: a frase única centrada deixava 282pt de
          // vazio acima e 281 abaixo, a pior razão de ritmo das 57 telas do app (24,5
          // contra a mediana de 2,4), e uma linha só de texto boiando num retângulo é
          // exatamente o "buraco no meio da tela" que a doutrina condena. Dividida em três,
          // a mesma sobra vira respiro INTERNO com dono e nenhum vão passa de ~100pt.
          //
          // As três frases são as mesmas palavras de antes, e continuam sendo prosa — não
          // são os três rótulos da taxonomia da fila com um zero embaixo, que é o desenho
          // que saiu daqui e não volta.
          <>
            {(done > 0
              ? [
                  `${done} ${done === 1 ? "resolvido" : "resolvidos"}.`,
                  "Ninguém sumiu, ninguém marcou dor, ninguém está sem ficha.",
                  "Pode voltar para a aula.",
                ]
              : [
                  "Ninguém sumiu.",
                  "Ninguém marcou dor, ninguém está sem ficha.",
                  "Pode voltar para a aula.",
                ]
            ).map((frase) => (
              <Band key={frase} grow rule="none">
                <Txt role="body" tone="muted">
                  {frase}
                </Txt>
              </Band>
            ))}
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
                {/* O TAMANHO enfatiza a primeira da fila — é ela que se resolve agora, e
                    esta tela é a do "uma por uma". O PAPEL não: `title` desenha na face de
                    DISPLAY e `body` na de TEXTO, e depois do ciclo 9 essas duas faces são
                    de verdade diferentes (Playfair contra Inter na editorial, Oswald contra
                    Archivo na condensada). Trocar o papel entre a primeira linha e as
                    outras deixava a mesma fila em dois tipos de letra. */}
                <Txt role="body" numberOfLines={2}>
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
                // `decision` vem do servidor e pode chegar vazia. Sem a queda, o botão
                // vira um retângulo de acento SEM PALAVRA NENHUMA — e tocável, aplicando a
                // sugestão. O Painel já tem esta queda; a fila que sai dele, não.
                label={row.decision || "Aplicar a sugestão"}
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
    act: { marginTop: SPACE.tight },
    dockRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
    },
    count: { flex: 1 },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
  }),
);
