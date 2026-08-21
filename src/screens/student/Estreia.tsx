import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  configDoTime, today, type Time, type TodayPayload } from "../../api";
import { GhostCTA } from "../../ui/GhostCTA";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newLocalId } from "../../offline/sessionQueue";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { plannedSets } from "../../ui/format";
import { Band, D0_STEPS, DockFooter, Head, Phone, StepRail } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
  needsCommitment: boolean;
};

export function estreiaSeenKey(timeId: string): string {
  return `estreia.seen.${timeId}`;
}

export function Estreia({ token, time, needsCommitment }: Props) {
  const styles = usarEstilos();
  const { T } = useTema();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Estreia">>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<TodayPayload | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await today(token);
      setPayload(data);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const prescription = payload?.prescription ?? null;
  const rows = prescription
    ? [...prescription.items].sort((a, b) => a.position - b.position)
    : [];

  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = payload ?? (await today(token));
      setPayload(data);
      await AsyncStorage.setItem(estreiaSeenKey(time.id), "1");
      const next = data.prescription;
      if (!next) {
        navigation.reset({
          index: 0,
          routes: [studentHomeTarget],
        });
        return;
      }
      const session = await createSession(next.id, newLocalId());
      navigation.reset({
        index: 1,
        routes: [
          studentHomeTarget,
          {
            name: "Serie",
            params: {
              token,
              timeName: time.name,
              localId: session.local_id,
              prescriptionId: next.id,
              items: next.items,
              itemIndex: 0,
              setIndex: 1,
              ofensivaCount: data.ofensiva.current_count,
              xpTotal: data.xp_total,
              needsCommitment,
              passoKg: configDoTime(time).passo_kg,
            },
          },
        ],
      });
    } catch {
      setError("Não deu para começar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      {/* Sem seta de voltar: a Estreia é a raiz da pilha, não há passo atrás para
          desfazer. Onde há, a seta é pequena e discreta — nunca um convite. */}
      {/* Última parada do D0: oito de oito, na mesma régua das sete anteriores. */}
      <Head
        kicker={`${D0_STEPS} · ${D0_STEPS}`}
        title="Primeira sessão"
      >
        <StepRail now={D0_STEPS} />
      </Head>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {prescription ? (
          <>
            <Band>
              {/* O herói é o CUSTO — é a pergunta que o aluno faz na porta. E a causa
                  dele fica na mesma tela: os exercícios e as séries que somam o tempo,
                  primeiro na legenda, depois um a um logo abaixo. */}
              <Figure
                role="mega"
                value={prescription.minutes}
                unit="MIN"
                label={prescription.name}
                note={`${rows.length} exercícios · ${plannedSets(rows)} séries`}
              />
            </Band>

            <View style={styles.colHead}>
              <Txt role="label" style={styles.colName}>
                Exercício
              </Txt>
              <Txt role="label" style={styles.colSets}>
                Séries
              </Txt>
            </View>

            {/* ponytail: nome e séries, uma linha por exercício. A carga não vem: aqui a
                pergunta é quanto tempo e o quê, e kg já tem dono na Ficha e na Série. */}
            {rows.map((item, i) => (
              <View key={item.id} style={styles.row}>
                <Txt role="label" tone="dim" style={styles.ord}>
                  {String(i + 1).padStart(2, "0")}
                </Txt>
                <Txt role="body" style={styles.name} numberOfLines={1}>
                  {item.name}
                </Txt>
                <Txt role="body" tone="muted" style={styles.sets}>
                  {item.planned_sets} × {item.planned_reps}
                </Txt>
              </View>
            ))}

            {/* A causa em prosa, no pé: quem montou, para quando, e por que é curto.
                A superfície CRESCE e fica dona da sobra — com 3 exercícios reais o que
                sobrava entre a lista e o botão era buraco de ninguém. */}
            <Band raised grow rule="none">
              <Txt role="body" tone="muted">
                {/* a primeira frase humana do app é do personal, quando ele a escreveu. */}
                {configDoTime(time).boas_vindas ||
                  `O ${time.name} montou ${prescription.name} para o seu primeiro dia. Curto de propósito.`}
              </Txt>
            </Band>
          </>
        ) : failed ? (
          <Band>
            <Txt role="body" tone="muted">
              Não deu para abrir o hoje.
            </Txt>
            <View style={styles.retry}>
              <GhostCTA
                label="Tentar de novo"
                onPress={() => void load()}
                fundo={T.bg}
              />
            </View>
          </Band>
        ) : payload && !prescription ? (
          <Band>
            <Txt role="body" tone="muted">
              A ficha do {time.name} ainda não chegou. Ela aparece no Hoje assim que
              ele publicar.
            </Txt>
          </Band>
        ) : null}

        {/* Falha é dita, não acusada: tinta muda, sem vermelho de erro para o aluno. */}
        {error ? (
          <Band rule="hair">
            <Txt role="body" tone="muted">
              {error}
            </Txt>
          </Band>
        ) : null}
      </ScrollView>

      <DockFooter>
        <AccentCTA
          label={prescription ? "Começar" : "Ver o Hoje"}
          onPress={() => void start()}
          busy={busy}
        />
      </DockFooter>
    </Phone>
  );
}

const ORD = 26;

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    colHead: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: T.pad,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: T.divider,
    },
    colName: { flex: 1, marginLeft: ORD + 8 },
    colSets: { width: 78, textAlign: "right" },
    row: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 8,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
    },
    ord: { width: ORD },
    name: { flex: 1 },
    sets: { width: 78, textAlign: "right" },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
  }),
);
