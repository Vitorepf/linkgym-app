import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { MOTION, productTheme as T } from "../theme";
import { useEdgeTone } from "./motion";
import { Txt } from "./Txt";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function GhostCTA({ label, onPress, disabled }: Props) {
  const [down, setDown] = useState(false);
  // ponytail: o tom vive na BORDA, não no fundo — este botão pousa em chão desconhecido
  // (bg, dock, raised) e pintar o fundo dele obrigaria a saber onde ele está.
  const tone = useEdgeTone(down && !disabled, T.divider, T.ink, MOTION.press);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
    >
      <Animated.View style={[styles.btn, tone, disabled && styles.off]}>
        <Txt role="body" tone="ink">
          {label}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  off: { opacity: 0.35 },
});
