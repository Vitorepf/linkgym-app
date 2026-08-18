import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { MOTION, pressedFill } from "../theme";
import { useAccentMass } from "./accent";
import { IconCheck, IconChevron } from "./Icons";
import { useTone } from "./motion";
import { Txt } from "./Txt";

/** O único botão cheio do app, e o dono natural do acento em MASSA: massa proporcional à
 *  ação e o custo DENTRO do botão ("52 MIN"). PrimaryButton era ~90% este arquivo e
 *  morreu; `block` veio de lá.
 *
 *  Reivindica o orçamento de acento da tela. Se um segundo elemento pintar área com o
 *  acento na mesma tela, o console grita com os dois nomes e tools/shots.mjs reprova. */
type Props = {
  label: string;
  onPress: () => void;
  accent?: string;
  meta?: string;
  disabled?: boolean;
  busy?: boolean;
  check?: boolean;
  block?: boolean;
  /** ação repetida numa lista: mesma massa, tinta neutra, e não gasta o orçamento. */
  quiet?: boolean;
};

export function AccentCTA({
  label,
  onPress,
  accent,
  meta,
  disabled,
  busy,
  check,
  block,
  quiet,
}: Props) {
  const { fill, ink } = useAccentMass(`AccentCTA "${label}"`, accent, !quiet);
  const off = disabled || busy;
  const [down, setDown] = useState(false);
  // O botão não salta: o tom do MESMO elemento muda, e sempre para longe da tinta —
  // o rótulo não perde contraste enquanto o dedo está em cima.
  const tone = useTone(down && !off, fill, pressedFill(fill, ink), MOTION.press);

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      style={block && styles.block}
    >
      <Animated.View style={[styles.btn, tone, off && styles.off]}>
        {busy ? (
          <ActivityIndicator color={ink} />
        ) : (
          <>
            <Txt role="body" color={ink} style={styles.label}>
              {label}
            </Txt>
            {meta ? (
              <Txt role="label" color={ink}>
                {meta}
              </Txt>
            ) : null}
            {check ? (
              <IconCheck color={ink} size={18} />
            ) : (
              <View style={styles.chev}>
                <IconChevron color={ink} />
              </View>
            )}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { alignSelf: "stretch", marginTop: 12 },
  btn: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  off: { opacity: 0.35 },
  label: { flex: 1, textAlign: "left" },
  chev: { flexShrink: 0 },
});
