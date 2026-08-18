import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { accentFill, productTheme as T, withAlpha } from "../theme";
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
  const { fill, ink } = accentFill(accent || T.accentFallback);
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
