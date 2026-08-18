import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { productTheme } from "../theme";

type Props = {
  onTick: () => void;
  label: string;
  hint: string;
};

export function HoldTick({ onTick, label, hint }: Props) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => stop, []);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hint}
      onPressIn={() => {
        onTick();
        timer.current = setInterval(onTick, 90);
      }}
      onPressOut={stop}
      style={styles.hit}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 18,
    letterSpacing: 0.4,
  },
});
