import { Pressable, StyleSheet, Text } from "react-native";
import { FONT, productTheme as T } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function GhostCTA({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        disabled && styles.off,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderColor: T.divider,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  off: { opacity: 0.35 },
  pressed: { backgroundColor: T.raised },
  label: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 13,
    letterSpacing: -0.1,
  },
});
