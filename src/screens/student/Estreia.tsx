import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { today, type Studio, type TodayPayload } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { accentSet, MOTION, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { plannedSets } from "../../ui/format";
import { useTone } from "../../ui/motion";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  studio: Studio;
  needsCommitment: boolean;
};

/** O D0 do aluno tem QUATRO paradas — convite, Sobre você, Pronto, Estreia — e a barra
 *  tem que estar visível em todas, como na barra do eixo 3. Esta é a última: quatro de
 *  quatro. O número não é chutado, é a contagem das telas que existem no Root. */
const STEPS = 4;

export function estreiaSeenKey(studioId: string): string {
  return `estreia.seen.${studioId}`;
}

export function Estreia({ token, studio, needsCommitment }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Estreia">>();
  const accent = studio.accent_color || T.accentFallback;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<TodayPayload | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await today(token);
        if (alive) setPayload(data);
      } catch {
        if (alive) setPayload(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

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
      await AsyncStorage.setItem(estreiaSeenKey(studio.id), "1");
      const next = data.prescription;
      if (!next) {
        navigation.reset({
          index: 0,
          routes: [studentHomeTarget],
        });
        return;
      }
      const session = await createSession(next.id, newClientId());
      navigation.reset({
        index: 1,
        routes: [
          studentHomeTarget,
          {
            name: "Serie",
            params: {
              token,
              studioName: studio.name,
              accent,
              clientId: session.client_id,
              prescriptionId: next.id,
              items: next.items,
              itemIndex: 0,
              setIndex: 1,
              streakCount: data.streak.current_count,
              xpTotal: data.xp_total,
              needsCommitment,
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
      <Head kicker={`${STEPS} · ${STEPS}`} title="Primeiro treino" accent={accent}>
        <StepBar accent={accent} />
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
                Fecha a lista e ocupa o último terço — vazio ali lê como defeito. */}
            <Band rule="none">
              <Txt role="body" tone="muted">
                O {studio.name} montou {prescription.name} para o seu primeiro dia.
                Curto de propósito.
              </Txt>
            </Band>
          </>
        ) : (
          <Band>
            <Txt role="body" tone="muted">
              A ficha do {studio.name} ainda não chegou. Ela aparece no Hoje assim que
              ele publicar.
            </Txt>
          </Band>
        )}

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
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

/** A barra do D0. Traço fino com o acento — papel subordinado, não massa, então não
 *  disputa o orçamento com o botão. O último passo ACENDE ao chegar: é a própria barra
 *  andando, o mecanismo da referência. Sob redução de movimento ele já nasce aceso. */
function StepBar({ accent }: { accent: string }) {
  const A = accentSet(accent);
  const [here, setHere] = useState(false);
  useEffect(() => {
    setHere(true);
  }, []);
  const lit = useTone(here, T.divider, A.mark, MOTION.enter);

  return (
    <View
      style={styles.bar}
      accessible
      accessibilityLabel={`Passo ${STEPS} de ${STEPS}`}
    >
      {Array.from({ length: STEPS - 1 }, (_, i) => (
        <View key={i} style={[styles.tick, { backgroundColor: A.mark }]} />
      ))}
      <Animated.View style={[styles.tick, lit]} />
    </View>
  );
}

const ORD = 26;

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
  },
  tick: {
    flex: 1,
    height: 2,
  },
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  ord: { width: ORD },
  name: { flex: 1 },
  sets: { width: 78, textAlign: "right" },
});
