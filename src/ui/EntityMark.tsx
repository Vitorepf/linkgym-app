import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Entity } from "./Entity";

type Props = {
  accent: string;
  compact?: boolean;
};

export function EntityMark({ accent, compact }: Props) {
  const stance = useSharedValue(0);
  const heightCm = useSharedValue(170);
  const weightKg = useSharedValue(70);
  const assembled = useSharedValue(1);

  return (
    <View style={[styles.frame, compact && styles.frameCompact]}>
      <View style={compact ? styles.scale : undefined}>
        <Entity
          accent={accent}
          stance={stance}
          heightCm={heightCm}
          weightKg={weightKg}
          assembled={assembled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  frameCompact: {
    height: 196,
    overflow: "hidden",
  },
  scale: {
    transform: [{ scale: 0.7 }],
  },
});
