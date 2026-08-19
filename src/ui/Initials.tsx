import { StyleSheet, View } from "react-native";
import { initials } from "./format";
import { useTema } from "./tema";
import { Txt } from "./Txt";

type Props = {
  name: string;
  accent?: string;
  fill?: boolean;
  size?: number;
};

export function Initials({ name, accent, fill, size = 34 }: Props) {
  const { T, FORMA, acento } = useTema();
  // Peça, não massa: avatar de 34–54 px. Ver o verbete `piece` em src/theme.ts.
  const ac = acento(accent).piece;
  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          backgroundColor: fill ? ac.fill : T.fill,
          borderRadius: FORMA.raioEm(size),
        },
      ]}
    >
      <Txt role="label" color={fill ? ac.ink : T.ink} style={styles.letters}>
        {initials(name)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  letters: { letterSpacing: 0 },
});
