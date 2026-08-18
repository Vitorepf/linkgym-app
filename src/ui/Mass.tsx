import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  kg: number;
  accent: string;
};

const SLOTS = 12;

export function Mass({ kg, accent }: Props) {
  const exact = Math.max(0.2, kg / 10);
  const full = Math.min(SLOTS, Math.floor(exact));
  const frac = exact - Math.floor(exact);
  const extra = full < SLOTS && frac > 0.04 ? 1 : 0;
  const count = Math.max(1, full + extra);

  return (
    <View style={styles.stack} pointerEvents="none">
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 1) / SLOTS;
        const last = extra === 1 && i === count - 1;
        return (
          <Animated.View
            key={`p-${i}`}
            entering={FadeIn.duration(140)}
            exiting={FadeOut.duration(90)}
            style={[
              styles.plate,
              {
                width: 32 + t * 108,
                backgroundColor: accent,
                opacity: last ? Math.max(0.28, frac) : 1,
              },
            ]}
          />
        );
      })}
      <View style={[styles.ground, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 108,
  },
  plate: {
    height: 8,
    marginTop: 4,
    borderRadius: 0,
  },
  ground: {
    width: 132,
    height: 2,
    marginTop: 12,
  },
});
