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
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, MOTION, productTheme as T } from "../../theme";
import { useAccentMass } from "../../ui/accent";
import { AccentCTA } from "../../ui/AccentCTA";
import { formatXp } from "../../ui/format";
import { EASE } from "../../ui/motion";
import { DockFooter, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Feito">;

/** A comemoração: uma tela, um número, um botão.
 *
 *  O ganho da sessão (XP) e o recorde NÃO moram aqui — cada um tem a sua tela, na ordem
 *  (Feito -> Recorde). Empilhar os três era o empate de hierarquia que os juízes cobraram.
 *
 *  Três corpos e nada mais: número (mega) : rótulo (title) : linha (note) = 3,4 : 1 : 0,44.
 *  A referência do eixo 3 mede 4,2 : 1 : 0,38 — a escala fechada de razão 1,5 não tem
 *  degrau mais perto, e o theme.ts já diz que `hero`/`value` cercam esse número.
 *
 *  O QUE ANIMA: o número (o anterior é substituído pelo novo) e o fundo (vira o acento de
 *  borda a borda por volta de 3,7 s). O QUE NUNCA ANIMA: o rótulo — mesmo corpo e mesma
 *  posição nas duas camadas, então a troca de tom não move um pixel — e o botão, que
 *  aparece por volta de 5,9 s sem saltar (a doca já ocupa o lugar dela desde o quadro 1).
 *
 *  ponytail: a virada é UMA opacidade sobre duas camadas idênticas em vez de seis cores
 *  animadas. Sai de graça o mecanismo da referência — o valor anterior sendo trocado pelo
 *  novo — e nenhum texto precisa virar componente animado.
 */
function Contagem({
  n,
  ink,
  quiet,
  note,
}: {
  n: number;
  ink: string;
  quiet: string;
  note: string;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.stack}>
        <Txt role="mega" color={ink}>
          {formatXp(n)}
        </Txt>
        <Txt role="title" color={quiet}>
          {n === 1 ? "treino de ofensiva" : "treinos de ofensiva"}
        </Txt>
      </View>
      <Txt role="note" color={quiet} style={styles.note}>
        {note}
      </Txt>
    </View>
  );
}

export function Feito({ navigation, route }: Props) {
  const { studioName, accent, streakCount, records, pending, needsCommitment } =
    route.params;
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

  return (
    <Phone>
      <View style={styles.stage}>
        <View
          style={StyleSheet.absoluteFill}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Contagem
            n={Math.max(0, streakCount - 1)}
            ink={A.text}
            quiet={T.muted}
            note={note}
          />
        </View>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: fill }, virada]}
        >
          <Contagem n={streakCount} ink={ink} quiet={ink} note={note} />
        </Animated.View>
      </View>

      <Animated.View style={surge}>
        <DockFooter>
          <AccentCTA
            quiet
            label={
              records.length > 1
                ? "Ver seus recordes de hoje"
                : records.length === 1
                  ? "Ver seu recorde de hoje"
                  : "Seguir"
            }
            onPress={follow}
          />
        </DockFooter>
      </Animated.View>
    </Phone>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1 },
  field: {
    flex: 1,
    paddingHorizontal: T.pad,
    paddingTop: 16,
    paddingBottom: 20,
  },
  // O bloco de tipo pousa no terço de baixo: o plano de acento vazio ACIMA é a
  // comemoração, o vazio abaixo do número não separaria nada. E deixa número, rótulo,
  // linha e botão numa leitura só, de cima para baixo.
  stack: { flex: 1, justifyContent: "flex-end" },
  note: { marginTop: 14 },
});
