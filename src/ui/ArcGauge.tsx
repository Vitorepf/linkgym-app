import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Line } from "react-native-svg";
import { accentOn, MOTION, productTheme as T } from "../theme";
import { Baseline, type BaselineSpec } from "./Baseline";
import { Figure } from "./Figure";
import { EASE_OUT } from "./motion";

const AnimatedLine = Animated.createAnimatedComponent(Line);

const TICKS = 10;
const CX = 100;
const CY = 110;
const R0 = 58;
const R1 = 84;

type Props = {
  value: number;
  label: string;
  accent: string;
  /** as camadas que faltavam ao número: unidade (some quando não existe), direção (forma
   *  e posição, nunca matiz) e baseline (número real, ancorado onde ele cai). */
  unit?: string;
  baseline?: BaselineSpec;
  dir?: "up" | "down" | "flat";
  ground?: string;
};

/** O arco de dez velas é a codificação redundante do eixo 1: a forma diz de relance, o
 *  dígito diz com precisão.
 *
 *  As velas acesas eram do ACENTO, e é por isso que o vermelho aparecia em três
 *  magnitudes na Hoje — o medidor inteiro competia com o botão. Aqui elas são TINTA
 *  neutra, e o acento fica com o único papel que ainda cabe num medidor sem virar massa:
 *  o PONTEIRO, um traço de 2px. Subordinado, e ainda assim o elemento mais preciso da
 *  peça. O orçamento de acento da tela nem é tocado: este componente não reivindica
 *  massa nenhuma. */
export function ArcGauge({ value, label, accent, unit, baseline, dir, ground }: Props) {
  const n = Math.max(0, Math.min(100, value));
  const point = accentOn(accent, ground ?? T.bg, 3);
  const reduce = useReducedMotion();
  const progress = useSharedValue(reduce ? n / 100 : 0);

  useEffect(() => {
    progress.value = reduce
      ? n / 100
      : withTiming(n / 100, { duration: MOTION.count, easing: EASE_OUT });
  }, [n, progress, reduce]);

  const angle = useDerivedValue(() => Math.PI * (1 - progress.value));
  const marker = useAnimatedProps(() => ({
    x1: CX + Math.cos(angle.value) * 44,
    y1: CY - Math.sin(angle.value) * 44,
    x2: CX + Math.cos(angle.value) * 96,
    y2: CY - Math.sin(angle.value) * 96,
    opacity: progress.value > 0 ? 1 : 0,
  }));

  return (
    <View>
      <View style={styles.wrap}>
        <Svg viewBox="0 0 200 112" width="100%" height={160}>
          {Array.from({ length: TICKS }, (_, i) => (
            <Tick key={i} i={i} progress={progress} />
          ))}
          <AnimatedLine animatedProps={marker} stroke={point} strokeWidth={2} />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Figure
            value={n === 0 ? "—" : n}
            unit={n === 0 ? undefined : unit}
            label={label}
            dir={dir}
            role="hero"
            labelBelow
            center
          />
        </View>
      </View>
      {baseline ? <Baseline {...baseline} /> : null}
    </View>
  );
}

/** Um tick, uma vela: acende quando a varredura passa por ele. */
function Tick({ i, progress }: { i: number; progress: SharedValue<number> }) {
  const t = i / (TICKS - 1);
  const a = Math.PI * (1 - t);
  const geo = {
    x1: CX + Math.cos(a) * R0,
    y1: CY - Math.sin(a) * R0,
    x2: CX + Math.cos(a) * R1,
    y2: CY - Math.sin(a) * R1,
  };
  // ponytail: duas camadas e opacidade, em vez de animar `stroke`. Prop de COR animada em
  // SVG não propaga no alvo web (o tick fica na cor do primeiro render); opacidade é
  // numérica e propaga nos dois alvos. Upgrade: uma camada só, se/quando cor animar em SVG web.
  const props = useAnimatedProps(() => ({
    opacity:
      progress.value <= 0
        ? 0
        : interpolate(progress.value, [t - 0.07, t], [0, 1], Extrapolation.CLAMP),
  }));
  return (
    <>
      <Line {...geo} stroke={T.fill} strokeWidth={11} />
      <AnimatedLine {...geo} animatedProps={props} stroke={T.muted} strokeWidth={11} />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative", marginTop: 4 },
  center: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 2,
    alignItems: "center",
  },
});
