import { useEffect, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { EASE } from "./motion";
import { useTema } from "./tema";

type Props = {
  /** O valor que JÁ ESTAVA — o teto anterior, a última vez. Ele abre a cena. */
  antes: ReactNode;
  /** O valor de AGORA. `null` enquanto não existe, e `null` para sempre quando não houve
   *  troca: aí `antes` fica, sozinho, como a referência permanente que ele é. */
  depois?: ReactNode | null;
};

/** A CONQUISTA É O NÚMERO TROCANDO DE LUGAR CONSIGO MESMO.
 *
 *  Medido na barra do eixo 3 (docs/barra/eixo3-ritual-aluno/NOTAS.md §3, arquivo
 *  `duolingo-13`): o valor anterior aparece primeiro e é SUBSTITUÍDO pelo novo. Nenhum
 *  texto anuncia a conquista — a substituição é ela. É a mecânica mais barata do
 *  inventário inteiro e a única que não precisa de personagem nenhum.
 *
 *  Três regras que esta peça existe para não deixar ninguém quebrar:
 *
 *  1. QUEM MANDA NO LAYOUT É O VALOR DE AGORA. `depois` fica no fluxo; `antes` vira
 *     sobreposição absoluta. Assim a altura da caixa é a mesma do primeiro ao último
 *     quadro, mesmo quando as duas camadas têm número de linhas diferente — o rótulo não
 *     anda, e "o que NÃO anima" é metade da regra medida na referência.
 *  2. SEM `depois`, NÃO HÁ TEATRO. Primeira vez no exercício não tem valor anterior para
 *     substituir, e inventar um seria comemorar o que não aconteceu. `antes` é desenhado
 *     cru, sem animação e sem camada extra.
 *  3. A TROCA NUNCA SEGURA NINGUÉM. Isto é opacidade sobre conteúdo já montado: quem tem
 *     pressa toca o botão da doca no meio da animação e sai. Nada aqui é modal, nada aqui
 *     pede toque para sumir.
 *
 *  ponytail: um progresso só, dois `useAnimatedStyle`. A primeira metade apaga o antigo, a
 *  segunda acende o novo — sequencial, não sobreposto, porque dois números do mesmo corpo
 *  em cross-fade viram borrão e param de ser dois números.
 */
export function Troca({ antes, depois }: Props) {
  const { MOTION } = useTema();
  const reduce = useReducedMotion();
  const trocou = Boolean(depois);
  const p = useSharedValue(0);

  useEffect(() => {
    if (!trocou) return;
    // A espera antes da troca é o que dá ao olho tempo de LER o número velho — sem ela a
    // substituição acontece antes de existir o que substituir. Sai do MOTION do tema, então
    // a alavanca de movimento do personal alcança as duas metades.
    p.value = reduce
      ? 1
      : withDelay(
          MOTION.enter,
          withTiming(1, { duration: MOTION.enter * 2, easing: EASE }),
        );
  }, [MOTION.enter, p, reduce, trocou]);

  const sai = useAnimatedStyle(() => ({ opacity: 1 - Math.min(1, p.value * 2) }));
  const entra = useAnimatedStyle(() => ({ opacity: Math.max(0, p.value * 2 - 1) }));

  if (!trocou) return <>{antes}</>;

  return (
    <View>
      <Animated.View style={entra}>{depois}</Animated.View>
      {/* O que sai não é lido em voz alta: o leitor de tela anuncia o valor de agora, uma
          vez. Dois números na mesma caixa é a leitura que a animação existe para evitar. */}
      <Animated.View
        style={[StyleSheet.absoluteFill, sai]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {antes}
      </Animated.View>
    </View>
  );
}
