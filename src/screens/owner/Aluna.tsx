import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  applyOwnerAttention,
  ownerAttention,
  ownerStudent,
  type OwnerAttention,
  type OwnerStudent,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { errorInk, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { formatKg } from "../../ui/format";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Aluna">;

/** A pessoa e a UMA coisa que vai acontecer com ela.
 *
 *  Contra a operação da referência: a ficha de aluno de lá abre com quatro blocos de
 *  avaliação (física, postural, neuromotores, anamnese) antes de qualquer coisa sobre a
 *  prescrição — a pessoa modelada como prontuário. Aqui o corpo da tela é o trabalho: a ficha
 *  que está publicada agora, com a carga de cada exercício, e nada atrás de um toque.
 *
 *  Contra o ofício do eixo 1: o número carrega o que ele estava carecendo. `12` vem com
 *  rótulo mudo, com a prosa do combinado que ele está contando (a âncora, e ela é do
 *  domínio — não é uma régua inventada) e com o esforço da última sessão marcado por
 *  FORMA na escala, nunca por matiz.
 *
 *  A ação é uma só e ela DIZ o que vai acontecer. Quando a pessoa está na fila de hoje, a
 *  ação é a decisão daquela fila e ela se aplica aqui mesmo — o botão faz, não navega.
 *  Fora da fila, a ação é publicar, e o rótulo diz qual das duas publicações é. Nada de
 *  "Manter": verbo genérico num retângulo cheio de acento era o maior elemento da tela
 *  fazendo nada. */
export function Aluna({ navigation, route }: Props) {
  const { token, personId, accent } = route.params;
  const [card, setCard] = useState<OwnerStudent | null>(null);
  const [flag, setFlag] = useState<OwnerAttention | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);

  const load = useCallback(async () => {
    try {
      const [student, queue] = await Promise.all([
        ownerStudent(token, personId),
        // A fila é a única fonte da CAUSA (/v1/owner/students não devolve motivo) e a
        // única ação que se resolve sem sair da tela. Se ela cair, a ficha abre igual.
        ownerAttention(token).catch(() => ({ items: [] as OwnerAttention[] })),
      ]);
      setCard(student);
      setFlag(queue.items.find((it) => it.person_id === personId) ?? null);
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function goBase() {
    if (!card) return;
    navigation.navigate("Base", {
      token,
      timeName: route.params.timeName,
      accent,
      personId: card.person_id,
      personName: card.name,
    });
  }

  async function applyFlag(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      await applyOwnerAttention(token, id);
      setFlag(null);
      setApplied(true);
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(false);
    }
  }

  function flagAction(
    queued: OwnerAttention | null,
    student: OwnerStudent,
    done: boolean,
    first: boolean,
  ) {
    if (queued) {
      return {
        label: queued.decision,
        why: reasonLine(queued),
        // O que o toque FAZ, sem inflar: aplicar resolve o item de hoje e, quando a causa
        // é o sumiço, abre a retomada do vínculo. Nada além disso acontece no servidor.
        effect:
          queued.reason === "student_stopped"
            ? "Aplicar abre a retomada e tira ela da fila de hoje."
            : "Aplicar tira ela da fila de hoje.",
        run: () => void applyFlag(queued.id),
        check: true,
      };
    }
    return {
      label: first ? "Publicar a primeira ficha" : "Publicar a próxima ficha",
      why: done ? "Resolvido agora." : whyPublish(student, first),
      effect: "Abre de onde partir: a última carga deste corpo ou o modelo.",
      run: goBase,
      check: false,
    };
  }

  const loads = card?.last_loads ?? [];
  const act = card && flagAction(flag, card, applied, loads.length === 0);

  return (
    <Phone>
      <Head
        title={card?.name}
        accent={accent}
        right={
          card ? (
            // Sem `fill`: o acento em ÁREA desta tela é o botão da ação, e ele é um só.
            <Initials name={card.name} size={46} />
          ) : undefined
        }
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

        {!card && !error ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Abrindo a ficha…
            </Txt>
          </Band>
        ) : null}

        {card ? (
          <>
            {/* O trabalho primeiro: o que está publicado, com a carga de cada corpo.
                Contagem no rótulo — o "3" que era uma célula de métrica sem baseline
                (trivia) virou contexto do título, onde ele significa alguma coisa. */}
            <Band rule="hair" pad={false}>
              <View style={styles.sectionHead}>
                <Txt role="label">
                  {loads.length > 0
                    ? `Ficha atual · ${loads.length} exercícios`
                    : "Ficha atual"}
                </Txt>
              </View>

              {loads.length === 0 ? (
                <View style={styles.sectionHead}>
                  <Txt role="body" tone="muted">
                    Nenhuma ficha publicada ainda.
                  </Txt>
                </View>
              ) : null}

              {loads.map((row) => (
                <View key={row.exercise_name} style={styles.loadRow}>
                  <Txt role="body" style={styles.loadName} numberOfLines={1}>
                    {row.exercise_name}
                  </Txt>
                  <Txt role="body" style={styles.loadKg}>
                    {formatKg(row.load_kg)}
                  </Txt>
                  <Txt role="label" tone="muted" style={styles.unit} numberOfLines={1}>
                    kg
                  </Txt>
                </View>
              ))}
            </Band>

            {/* Ofensiva não é contagem solta: a nota diz o combinado que ela está
                contando. Esforço é posição numa escala de 3 e a direção sai da FORMA da
                marca, nunca de matiz — o único matiz da tela é o do personal. */}
            <MetricGrid
              columns={2}
              cells={[
                {
                  label: "Ofensiva",
                  value: card.ofensiva.current_count,
                  note: card.commitment_text ?? undefined,
                },
                {
                  label: "Esforço",
                  value: card.last_effort ?? "—",
                  unit: card.last_effort ? "de 3" : undefined,
                  dir: effortDir(card.last_effort),
                  note: card.last_effort
                    ? `${effortWord(card.last_effort)} na última`
                    : "Sem sessão ainda",
                },
              ]}
            />

            {/* A causa vive NA tela, colada na ação. Sem isto o botão é uma ordem sem
                motivo, e o motivo estava atrás de um toque (ou não existia). */}
            {act ? (
              <View style={styles.why}>
                <Band rule="none">
                  <Txt role="body">{act.why}</Txt>
                  <Txt role="body" tone="muted" style={styles.effect}>
                    {act.effect}
                  </Txt>
                </Band>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      {act ? (
        <DockFooter>
          <AccentCTA
            label={act.label}
            accent={accent}
            onPress={act.run}
            busy={busy}
            check={act.check}
          />
        </DockFooter>
      ) : null}
    </Phone>
  );
}

/** O `reason` chega cru do banco (`student_stopped`) e a fila de hoje o desenha como
 *  prosa. Traduzir aqui é o que impede um identificador de tabela de virar texto de tela;
 *  o que não estiver no mapa já é frase e passa direto.
 *  `days` conta dias desde o último cumprimento, então ele só é a causa quando a causa É
 *  o sumiço — em "marcou dor" o mesmo número seria uma data errada com cara de precisão. */
const REASON: Record<string, string> = {
  student_stopped: "Parou de treinar",
  pain_flag: "Marcou dor na última sessão",
  debut: "Entrou e ainda não treinou",
  high_effort: "Esforço alto na última sessão",
};

function reasonLine(f: OwnerAttention): string {
  const base = REASON[f.reason] ?? f.reason;
  return f.reason === "student_stopped" && f.days
    ? `${base} há ${f.days} dias.`
    : `${base}.`;
}

function whyPublish(card: OwnerStudent, first: boolean): string {
  if (first) return "Sem ficha publicada, a estreia é o primeiro toque.";
  if (card.suggested === "nudge") return "Sumiu do fio. A próxima ficha é o caminho de volta.";
  const n = card.ofensiva.current_count;
  const effort = effortWord(card.last_effort);
  if (n <= 0) return "A ofensiva está zerada. O combinado precisa de uma ficha nova.";
  const tail = effort ? `, esforço ${effort.toLowerCase()} na última` : "";
  return `${n} cumprimentos seguidos do combinado${tail}.`;
}

// Posição na escala de 3, não julgamento: fácil fica abaixo do ponto, difícil acima.
function effortDir(n: number | null): "up" | "down" | "flat" | undefined {
  if (n === 1) return "down";
  if (n === 3) return "up";
  if (n === 2) return "flat";
  return undefined;
}

function effortWord(n: number | null): string {
  if (n === 1) return "Fácil";
  if (n === 3) return "Difícil";
  if (n === 2) return "No ponto";
  return "";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  // O par causa+ação desce para o pé da rolagem em vez de deixar o terço de baixo morto.
  // Uma folga só, entre o bloco de fatos e a decisão — não duas, que leem como buraco.
  // Com ficha longa a margem automática vira zero e a rolagem manda.
  why: { marginTop: "auto" },
  sectionHead: {
    paddingHorizontal: T.pad,
    paddingTop: 18,
    paddingBottom: 10,
  },
  loadRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    paddingHorizontal: T.pad,
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  loadName: { flex: 1, minWidth: 0 },
  // Coluna de número com largura fixa: as cargas alinham à direita entre si e a unidade
  // fica num degrau tipográfico próprio, do lado de fora do número.
  loadKg: { fontVariant: ["tabular-nums"], minWidth: 76, textAlign: "right" },
  unit: { minWidth: 26 },
  effect: { marginTop: 6 },
});
