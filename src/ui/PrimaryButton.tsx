import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { productTheme } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, busy }: Props) {
  const off = disabled || busy;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={[styles.btn, off && styles.off]}
    >
      {busy ? (
        <ActivityIndicator color={productTheme.bg} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
    backgroundColor: productTheme.ink,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    borderRadius: productTheme.radius,
  },
  off: { opacity: 0.35 },
  label: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
