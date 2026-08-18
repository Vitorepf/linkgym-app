import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { FONT, productTheme as T } from "../theme";
import { IconCheck, IconChevron } from "./Icons";

type Props = {
  label: string;
  onPress: () => void;
  accent?: string;
  meta?: string;
  disabled?: boolean;
  busy?: boolean;
  check?: boolean;
};

export function AccentCTA({
  label,
  onPress,
  accent,
  meta,
  disabled,
  busy,
  check,
}: Props) {
  const ac = accent || T.accentFallback;
  const off = disabled || busy;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: ac },
        off && styles.off,
        pressed && !off && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={T.bg} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          {check ? (
            <IconCheck color={T.bg} size={18} />
          ) : (
            <View style={styles.chev}>
              <IconChevron color={T.bg} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  off: { opacity: 0.35 },
  pressed: { transform: [{ translateY: 1 }] },
  label: {
    flex: 1,
    color: T.bg,
    fontFamily: FONT,
    fontSize: 16,
    letterSpacing: -0.2,
    textAlign: "left",
  },
  meta: {
    color: T.bg,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.1,
    opacity: 0.65,
  },
  chev: { flexShrink: 0 },
});
