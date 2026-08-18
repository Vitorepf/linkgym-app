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

export const EASE = Easing.bezier(...MOTION.ease);
export const EASE_OUT = Easing.bezier(...MOTION.easeOut);

/** Estado é mudança de TOM no mesmo elemento — nunca uma tela nova, nunca um salto de
 *  posição. Serve tanto para o toque (press → state) quanto para seleção.
 *  Roda inteiro na UI thread: o React só vira um booleano. */
export function useTone(
  active: boolean,
  off: string,
  on: string,
  duration: number = MOTION.state,
) {
  const p = useSharedValue(active ? 1 : 0);
  const reduce = useReducedMotion();
  useEffect(() => {
    p.value = reduce ? (active ? 1 : 0) : withTiming(active ? 1 : 0, { duration, easing: EASE });
  }, [active, duration, p, reduce]);
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [off, on]),
  }));
}

/** O mesmo, na borda: para quem não pode pintar o fundo (fica sobre chão desconhecido). */
export function useEdgeTone(
  active: boolean,
  off: string,
  on: string,
  duration: number = MOTION.state,
) {
  const p = useSharedValue(active ? 1 : 0);
  const reduce = useReducedMotion();
  useEffect(() => {
    p.value = reduce ? (active ? 1 : 0) : withTiming(active ? 1 : 0, { duration, easing: EASE });
  }, [active, duration, p, reduce]);
  return useAnimatedStyle(() => ({
    borderColor: interpolateColor(p.value, [0, 1], [off, on]),
  }));
}
