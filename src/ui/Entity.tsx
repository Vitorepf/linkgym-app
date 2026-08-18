import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  accent: string;
  stance: SharedValue<number>;
  heightCm: SharedValue<number>;
  weightKg: SharedValue<number>;
  assembled: SharedValue<number>;
};

export function Entity({
  accent,
  stance,
  heightCm,
  weightKg,
  assembled,
}: Props) {
  const reduce = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduce) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(0.38, { duration: 1100 }), -1, true);
  }, [pulse, reduce]);

  useAnimatedReaction(
    () => assembled.value,
    (a) => {
      if (a > 0.15) {
        cancelAnimation(pulse);
        pulse.value = 1;
      }
    },
  );

  const column = useAnimatedStyle(() => ({
    transform: [
      {
        scaleY: interpolate(
          heightCm.value,
          [140, 210],
          [0.72, 1.2],
          Extrapolation.CLAMP,
        ),
      },
      {
        scaleX: interpolate(
          weightKg.value,
          [40, 140],
          [0.78, 1.32],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const seed = useAnimatedStyle(() => {
    const a = assembled.value;
    return {
      transform: [
        { translateY: interpolate(a, [0, 1], [192, 0], Extrapolation.CLAMP) },
        { scale: interpolate(a, [0, 1], [1.85, 1], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(a, [0, 0.2], [pulse.value, 1], Extrapolation.CLAMP),
      marginBottom: interpolate(a, [0, 1], [0, 8], Extrapolation.CLAMP),
    };
  });

  const chest = useAnimatedStyle(() => ({
    opacity: interpolate(assembled.value, [0.08, 0.4], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scaleY: interpolate(assembled.value, [0.08, 0.45], [0.2, 1], Extrapolation.CLAMP) },
      {
        scaleX: interpolate(stance.value, [-1, 1], [0.82, 1.22], Extrapolation.CLAMP),
      },
    ],
  }));

  const hip = useAnimatedStyle(() => ({
    opacity: interpolate(assembled.value, [0.28, 0.62], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scaleY: interpolate(assembled.value, [0.28, 0.65], [0.2, 1], Extrapolation.CLAMP) },
      {
        scaleX: interpolate(stance.value, [-1, 1], [1.24, 0.84], Extrapolation.CLAMP),
      },
    ],
  }));

  const legs = useAnimatedStyle(() => ({
    opacity: interpolate(assembled.value, [0.5, 0.9], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scaleY: interpolate(assembled.value, [0.5, 1], [0.15, 1], Extrapolation.CLAMP) },
    ],
  }));

  const cleft = useAnimatedStyle(() => ({
    width: interpolate(stance.value, [-1, 0, 1], [16, 6, 14], Extrapolation.CLAMP),
  }));

  const ground = useAnimatedStyle(() => ({
    width: interpolate(weightKg.value, [40, 140], [72, 148], Extrapolation.CLAMP),
    opacity: interpolate(assembled.value, [0, 0.2], [0.45, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.stage} pointerEvents="none">
      <Animated.View style={[styles.column, column]}>
        <Animated.View style={[styles.block, styles.head, { backgroundColor: accent }, seed]} />
        <Animated.View
          style={[styles.block, styles.chest, { backgroundColor: accent }, chest]}
        />
        <View style={styles.joint} />
        <Animated.View
          style={[styles.block, styles.hip, { backgroundColor: accent }, hip]}
        />
        <View style={styles.joint} />
        <Animated.View style={[styles.legs, legs]}>
          <View style={[styles.block, styles.leg, { backgroundColor: accent }]} />
          <Animated.View style={cleft} />
          <View style={[styles.block, styles.leg, { backgroundColor: accent }]} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.ground, { backgroundColor: accent }, ground]} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: 280,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  column: {
    alignItems: "center",
    transformOrigin: "bottom",
  },
  block: {
    borderRadius: 0,
  },
  head: {
    width: 18,
    height: 18,
  },
  chest: {
    width: 54,
    height: 70,
    transformOrigin: "bottom",
  },
  hip: {
    width: 44,
    height: 32,
    transformOrigin: "bottom",
  },
  legs: {
    flexDirection: "row",
    alignItems: "flex-end",
    transformOrigin: "bottom",
  },
  leg: {
    width: 12,
    height: 78,
  },
  joint: { height: 6 },
  ground: {
    height: 2,
    marginTop: 18,
  },
});
