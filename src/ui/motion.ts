import { useEffect } from "react";
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MOTION } from "../theme";
import { useTema } from "./tema";

export const EASE = Easing.bezier(...MOTION.ease);

/** O 0→1 de UMA mudança de estado. Ele é público porque um sinal pode ter mais de uma
 *  metade — o passo da régua do D0 acende em COR e em ALTURA — e duas animações separadas
 *  para a mesma mudança andam em velocidades diferentes: a altura saltava no quadro zero
 *  enquanto a cor levava MOTION.enter para chegar. Um progresso só, todo mundo junto. */
export function useProgresso(active: boolean, duracao?: number) {
  // Sem duração explícita quem manda é o MOVIMENTO do personal. Enquanto o padrão vinha
  // do módulo, "seco" e "generoso" mudavam só os quatro pontos que passavam número na mão.
  const duration = duracao ?? useTema().MOTION.state;
  const p = useSharedValue(active ? 1 : 0);
  const reduce = useReducedMotion();
  useEffect(() => {
    p.value = reduce ? (active ? 1 : 0) : withTiming(active ? 1 : 0, { duration, easing: EASE });
  }, [active, duration, p, reduce]);
  return p;
}

/** Estado é mudança de TOM no mesmo elemento — nunca uma tela nova, nunca um salto de
 *  posição. Serve tanto para o toque (press → state) quanto para seleção.
 *  Roda inteiro na UI thread: o React só vira um booleano. */
export function useTone(
  active: boolean,
  off: string,
  on: string,
  duracao?: number,
) {
  const p = useProgresso(active, duracao);
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [off, on]),
  }));
}

/** O mesmo, na borda: para quem não pode pintar o fundo (fica sobre chão desconhecido). */
export function useEdgeTone(
  active: boolean,
  off: string,
  on: string,
  duracao?: number,
) {
  const p = useProgresso(active, duracao);
  return useAnimatedStyle(() => ({
    borderColor: interpolateColor(p.value, [0, 1], [off, on]),
  }));
}
