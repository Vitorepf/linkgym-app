import { Pressable, StyleSheet, Text } from "react-native";
import { FONT, productTheme as T } from "../theme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  flex?: boolean;
  accent?: string;
};

export function Choice({ label, selected, onPress, flex, accent }: Props) {
  const ac = accent || T.accentFallback;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.box,
        flex && styles.flex,
        selected
          ? { backgroundColor: ac, borderColor: ac }
          : styles.off,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 52,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: T.divider,
    backgroundColor: "transparent",
  },
  flex: { flex: 1, paddingHorizontal: 0, alignItems: "center" },
  off: {
    backgroundColor: "transparent",
    borderColor: T.divider,
  },
  label: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: -0.2,
    textAlign: "left",
  },
  labelOn: {
    color: T.bg,
  },
});
