import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { accentSet, productTheme as T, withAlpha } from "../theme";
import { useTone } from "./motion";
import { Txt } from "./Txt";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  flex?: boolean;
  accent?: string;
};

export function Choice({ label, selected, onPress, flex, accent }: Props) {
  // Peça, não massa: chip de 52 px que se repete em fila. Ver o verbete `piece`.
  const { fill, ink } = accentSet(accent || T.accentFallback).piece;
  // Estado é saturação no mesmo elemento: o fundo vem do nada até o acento, e o rótulo
  // fica exatamente onde estava. Alfa, e não T.bg, porque a caixa pousa em chão variável.
  const tone = useTone(selected, withAlpha(fill, 0), fill);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={flex && styles.flex}
    >
      <Animated.View
        style={[
          styles.box,
          flex && styles.flexBox,
          tone,
          { borderColor: selected ? fill : T.divider },
        ]}
      >
        <Txt role="body" color={selected ? ink : T.ink}>
          {label}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 52,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 2,
  },
  flex: { flex: 1 },
  flexBox: { paddingHorizontal: 0, alignItems: "center" },
});
