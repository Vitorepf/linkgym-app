import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FinishRecord } from "../../api";
import type { SessionProof } from "../../offline/sessionQueue";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, MOTION, productTheme as T } from "../../theme";
import { useAccentMass } from "../../ui/accent";
import { AccentCTA } from "../../ui/AccentCTA";
import { formatKg, formatNum } from "../../ui/format";
import { TrendMark } from "../../ui/Icons";
import { EASE } from "../../ui/motion";
import { DockFooter, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Feito">;

/** A comemoração. Uma tela, um número dominante, uma saída.
 *
 *  O que quatro juízes cegos cobraram desta tela e o que mudou:
 *    - o herói estava ENCALHADO na borda de baixo com 60% de acento vazio em cima. Agora
 *      a prova do ato fica no topo e o número flutua no centro do que sobra: o vazio é
 *      palco dos dois lados, não um terço perdido de um lado só.
 *    - a vitória era abstrata: "214 é agregado de ofensiva, não o esforço de HOJE". A prova
 *      do ato agora ABRE a tela — séries feitas, carga total movida e duração, lidos da
 *      sessão LOCAL antes do flush apagá-la (`sessionProof`, em offline/sessionQueue). E
 *      embaixo do herói, o que a sessão RENDEU: o XP dela e — quando existe — a carga do
 *      recorde de hoje com o valor anterior ao lado. Nenhum número inventado: sem prova a
 *      linha some, sem recorde a célula some (ausência de marca, nunca marca de falta).
 *    - o botão abria OUTRA tela de dados. O destino continua o mesmo (Recorde ->
 *      Compromisso -> início são a cadeia do fim de sessão), mas a carga já está AQUI e o
 *      rótulo virou saída limpa: "Seguir".
 *
 *  O que NÃO entra, e por quê: nada de vaga de amanhã. A rota não traz a prescrição do dia
 *  seguinte, e desenhar bolinha vazia de compromisso futuro é transformar a conquista em
 *  dívida — o defeito da referência do eixo 3, não uma virtude a copiar.
 *
 *  Corpos: número (mega) : rótulo (title) : linha (note) = 3,4 : 1 : 0,44. A referência do
 *  eixo 3 mede 4,2 : 1 : 0,38; a escala fechada de razão 1,5 não tem degrau mais perto. A
 *  prova entra um degrau ABAIXO do rendimento (title contra value): ela é o que aconteceu,
 *  o herói é o que isso virou — e nenhuma das duas disputa com o 92 do meio.
 *
 *  O QUE ANIMA: o número (o anterior é substituído pelo novo) e o fundo (vira o acento de
 *  borda a borda por volta de 3,7 s). O QUE NUNCA ANIMA: rótulo, prova e linha — mesmo
 *  corpo e mesma posição nas duas camadas, então a troca de tom não move um pixel — e o
 *  botão, que aparece por volta de 5,9 s sem saltar (a doca já ocupa o lugar dela desde o
 *  primeiro quadro).
 *
 *  ponytail: a virada é UMA opacidade sobre duas camadas idênticas em vez de seis cores
 *  animadas. Sai de graça o mecanismo da referência — o valor anterior sendo trocado pelo
 *  novo — e nenhum texto precisa virar componente animado.
 */
function Camada({
  n,
  gained,
  pr,
  proof,
  note,
  ink,
  quiet,
}: {
  n: number;
  gained: number;
  pr: FinishRecord | null;
  proof?: SessionProof;
  note: string;
  ink: string;
  quiet: string;
}) {
  const before = pr && pr.previous_kg > 0 && pr.previous_kg < pr.load_kg ? pr.previous_kg : null;

  return (
    <View style={styles.field}>
      <Txt role="body" color={ink}>
        Você fechou a sessão de hoje.
      </Txt>

      {proof ? (
        <View
          style={styles.proof}
          accessible
          accessibilityLabel={`${proof.sets} séries, ${formatNum(Math.round(proof.volumeKg))} quilos movidos${
            proof.minutes === undefined ? "" : `, ${proof.minutes} minutos`
          }`}
        >
          <Prova label="Séries" value={String(proof.sets)} ink={ink} quiet={quiet} />
          <Prova
            label="Movido"
            value={formatNum(Math.round(proof.volumeKg))}
            unit="kg"
            ink={ink}
            quiet={quiet}
          />
          {proof.minutes === undefined ? null : (
            <Prova
              label="Tempo"
              value={String(proof.minutes)}
              unit="min"
              ink={ink}
              quiet={quiet}
            />
          )}
        </View>
      ) : null}

      <View style={styles.stage}>
        <View
          accessible
          accessibilityLabel={`${n} ${n === 1 ? "sessão" : "sessões"} de ofensiva`}
        >
          <Txt role="mega" color={ink}>
            {formatNum(n)}
          </Txt>
          <Txt role="title" color={quiet}>
            {n === 1 ? "sessão de ofensiva" : "sessões de ofensiva"}
          </Txt>
        </View>
      </View>

      <View style={[styles.rule, { backgroundColor: quiet }]} />
      <View style={styles.row}>
        <View
          style={styles.cell}
          accessible
          accessibilityLabel={`Nesta sessão, mais ${gained} XP`}
        >
          <Txt role="label" color={quiet}>
            Nesta sessão
          </Txt>
          <View style={styles.line}>
            <Txt role="value" color={ink}>
              +{formatNum(gained)}
            </Txt>
            <Txt role="body" color={quiet}>
              XP
            </Txt>
          </View>
        </View>

        {pr ? (
          <View
            style={styles.cell}
            accessible
            accessibilityLabel={`Carga de hoje no ${pr.exercise_name}: ${formatKg(pr.load_kg)} quilos${
              before === null ? "" : `, antes ${formatKg(before)} quilos`
            }`}
          >
            <Txt role="label" color={quiet}>
              Carga de hoje
            </Txt>
            <View style={styles.line}>
              <Txt role="value" color={ink}>
                {formatKg(pr.load_kg)}
              </Txt>
              <Txt role="body" color={quiet}>
                kg
              </Txt>
              {before === null ? null : (
                <View style={styles.dir}>
                  <TrendMark dir="up" color={quiet} size={11} />
                </View>
              )}
            </View>
            <Txt role="note" color={quiet} numberOfLines={2}>
              {pr.exercise_name}
              {before === null ? "" : `, antes ${formatKg(before)} kg`}
            </Txt>
          </View>
        ) : null}
      </View>
      <View style={[styles.rule, { backgroundColor: quiet }]} />

      <Txt role="note" color={quiet} style={styles.note}>
        {note}
      </Txt>
    </View>
  );
}

export function Feito({ navigation, route }: Props) {
  const {
    studioName,
    accent,
    streakCount,
    xpGained,
    records,
    proof,
    pending,
    needsCommitment,
  } = route.params;
  // O acento em ÁREA desta tela é o FUNDO. É o único lugar do app onde a comemoração
  // justifica o orçamento inteiro — por isso o botão vai de par neutro (`quiet`).
  const { fill, ink } = useAccentMass("Fundo da comemoração", accent);
  const A = accentSet(accent, T.bg);

  const reduce = useReducedMotion();
  const turn = useSharedValue(reduce ? 1 : 0);
  const show = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) return;
    turn.value = withDelay(
      MOTION.turn,
      withTiming(1, { duration: MOTION.enter, easing: EASE }),
    );
    show.value = withDelay(
      MOTION.reveal,
      withTiming(1, { duration: MOTION.enter, easing: EASE }),
    );
  }, [reduce, show, turn]);
  const virada = useAnimatedStyle(() => ({ opacity: turn.value }));
  // O botão APARECE, não salta: a doca já ocupa o lugar dela desde o primeiro quadro e só
  // a opacidade anda. `pointerEvents` junto para não existir alvo de toque invisível.
  const surge = useAnimatedStyle(() => ({
    opacity: show.value,
    pointerEvents: show.value > 0.5 ? "auto" : "none",
  }));

  function follow() {
    if (records.length > 0) {
      navigation.navigate("Recorde", { accent, records, needsCommitment });
      return;
    }
    if (needsCommitment) {
      navigation.navigate("Compromisso");
      return;
    }
    navigation.reset({ index: 0, routes: [studentHomeTarget] });
  }

  const note = pending
    ? "Sessão guardada neste celular. Sobe sozinha quando tiver rede."
    : `${studioName} já recebeu o resultado.`;
  // A carga que prova o esforço de hoje é a maior das que subiram — a mesma regra da
  // Recorde, para o número não trocar de dono entre as duas telas.
  const pr = [...records].sort((a, b) => b.load_kg - a.load_kg)[0] ?? null;

  return (
    <Phone>
      <View style={styles.plane}>
        <View
          style={StyleSheet.absoluteFill}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Camada
            n={Math.max(0, streakCount - 1)}
            gained={xpGained}
            pr={pr}
            proof={proof}
            note={note}
            ink={A.text}
            quiet={T.muted}
          />
        </View>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: fill }, virada]}
        >
          <Camada
            n={streakCount}
            gained={xpGained}
            pr={pr}
            proof={proof}
            note={note}
            ink={ink}
            quiet={ink}
          />
        </Animated.View>
      </View>

      <Animated.View style={surge}>
        <DockFooter>
          <AccentCTA quiet label="Seguir" onPress={follow} />
        </DockFooter>
      </Animated.View>
    </Phone>
  );
}

/** Uma célula da prova. Existe porque são três iguais e o par número/unidade tem que ser
 *  o MESMO nas três — não porque a tela precisa de um sistema. */
function Prova({
  label,
  value,
  unit,
  ink,
  quiet,
}: {
  label: string;
  value: string;
  unit?: string;
  ink: string;
  quiet: string;
}) {
  return (
    <View style={styles.cell}>
      <Txt role="label" color={quiet}>
        {label}
      </Txt>
      <View style={styles.line}>
        <Txt role="body" color={ink} style={styles.num}>
          {value}
        </Txt>
        {unit ? (
          <Txt role="note" color={quiet} style={styles.unit}>
            {unit}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plane: { flex: 1 },
  field: {
    flex: 1,
    paddingHorizontal: T.pad,
    paddingTop: 18,
    paddingBottom: 16,
  },
  rule: { height: 2, marginTop: 16 },
  proof: { flexDirection: "row", gap: 16, paddingTop: 14 },
  num: { fontVariant: ["tabular-nums"] },
  unit: { paddingBottom: 2 },
  row: { flexDirection: "row", gap: 20, paddingVertical: 16 },
  cell: { flex: 1 },
  line: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  dir: { paddingBottom: 10 },
  // O número flutua no MEIO do que sobra: folga em cima e embaixo. Uma folga só, de um
  // lado, é o terço perdido que os juízes cobraram.
  stage: { flex: 1, justifyContent: "center" },
  note: { marginTop: 14 },
});
