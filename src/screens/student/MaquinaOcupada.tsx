import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { swapExercise, type TodayItem } from "../../api";
import {
  ensureServerSession,
  loadCurrent,
  rememberSwap,
} from "../../offline/sessionQueue";
import { formatKg } from "../../ui/format";
import { IconChevron } from "../../ui/Icons";
import { useEdgeTone } from "../../ui/motion";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  timeName: string;
  prescriptionId: string;
  from: TodayItem;
  items: TodayItem[];
};

function meta(item: TodayItem): string {
  return `${item.planned_sets} × ${item.planned_reps} · ${formatKg(item.load_kg)} kg`;
}

/** ponytail: nenhum acento em MASSA aqui, e não é esquecimento — esta peça também mora
 *  dentro da ComoFazer, que já gasta o orçamento no "Entendi" do dock. Um retângulo cheio
 *  aqui estouraria o orçamento da tela hospedeira. O acento entra como TEXTO no kicker. */
export function MaquinaOcupada({
  token,
  timeName,
  prescriptionId,
  from,
  items,
}: Props) {
  const styles = usarEstilos();
  const { acento, errorInk } = useTema();
  const A = acento();
  const others = items.filter((item) => item.exercise_id !== from.exercise_id);
  const [done, setDone] = useState<TodayItem | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirm(to: TodayItem) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const sessionId = await ensureServerSession(token, prescriptionId);
      const current = await loadCurrent();
      if (current) {
        await rememberSwap(current.local_id, from.exercise_id, to.exercise_id);
      }
      await swapExercise(token, sessionId, from.exercise_id, to.exercise_id);
      setDone(to);
    } catch {
      setError("Não deu para avisar agora. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  if (others.length === 0) return null;

  // A troca já feita ocupa o MESMO lugar da escolha: a resposta ao medo não muda de sítio,
  // muda de tempo verbal.
  if (done) {
    return (
      <View>
        <Txt role="label" color={A.text}>
          Trocado
        </Txt>
        <Txt role="title" style={styles.title}>
          {timeName} já sabe.
        </Txt>
        <Txt role="body" tone="muted" style={styles.lede}>
          A Ofensiva não quebrou. Você faz {done.name} no lugar de {from.name}.
        </Txt>
        <View style={styles.from}>
          <Txt role="label">Fazendo agora</Txt>
          <View style={styles.fromRow}>
            <Txt role="body" style={styles.fromName}>
              {done.name}
            </Txt>
            <Txt role="label" tone="dim">
              {meta(done)}
            </Txt>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Txt role="label" color={A.text}>
        Máquina ocupada
      </Txt>
      <Txt role="title" style={styles.title}>
        Troque. A Ofensiva fica.
      </Txt>
      <Txt role="body" tone="muted" style={styles.lede}>
        {timeName} é avisado na hora.
      </Txt>

      <View style={styles.from}>
        <Txt role="label">Saindo</Txt>
        <View style={styles.fromRow}>
          <Txt role="body" tone="muted" style={styles.fromName}>
            {from.name}
          </Txt>
          <Txt role="label" tone="dim">
            {meta(from)}
          </Txt>
        </View>
      </View>

      {error ? (
        <Txt
          role="body"
          color={errorInk}
          style={styles.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Txt>
      ) : null}

      <Txt role="label" style={styles.pick}>
        Trocar por ({others.length})
      </Txt>
      {others.map((item) => (
        <SwapCard
          key={item.id}
          item={item}
          disabled={busy}
          onPress={() => {
            void confirm(item);
          }}
        />
      ))}
    </View>
  );
}

/** Alvo de uma mão, em pé: o cartão inteiro é o botão, e um toque resolve — não existe
 *  confirmar depois de escolher. O tom do toque vive na BORDA porque o cartão pousa em
 *  chão variável (bg solto no shot, Band dentro da ComoFazer). */
function SwapCard({
  item,
  onPress,
  disabled,
}: {
  item: TodayItem;
  onPress: () => void;
  disabled: boolean;
}) {
  const styles = usarEstilos();
  const { T, MOTION } = useTema();
  const [down, setDown] = useState(false);
  const tone = useEdgeTone(down && !disabled, T.divider, T.ink, MOTION.press);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Trocar por ${item.name}, ${item.planned_sets} séries de ${item.planned_reps} com ${formatKg(item.load_kg)} quilos`}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
    >
      <Animated.View style={[styles.card, tone, disabled && styles.off]}>
        <View style={styles.cardMain}>
          <Txt role="body">{item.name}</Txt>
          <Txt role="label" tone="dim" style={styles.cardMeta}>
            {meta(item)}
          </Txt>
        </View>
        <IconChevron color={T.muted} />
      </Animated.View>
    </Pressable>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    title: { marginTop: SPACE.hair },
    lede: { marginTop: 8 },
    from: {
      marginTop: SPACE.step,
      paddingTop: SPACE.tight,
      paddingBottom: SPACE.tight,
      borderTopWidth: FORMA.borda,
      borderTopColor: T.divider,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    fromRow: { marginTop: SPACE.hair },
    fromName: { marginBottom: 2 },
    error: { marginTop: SPACE.tight },
    pick: { marginTop: SPACE.step },
    // O cartao inteiro e o botao: canto de ACAO, nao de superficie.
    card: {
      marginTop: 12,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioAcao,
      paddingVertical: SPACE.step,
      paddingHorizontal: SPACE.tight,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    cardMain: { flex: 1, minWidth: 0 },
    cardMeta: { marginTop: 2 },
    off: { opacity: 0.35 },
  }),
);
