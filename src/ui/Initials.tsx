import { StyleSheet, View } from "react-native";
import { accentFill, productTheme as T } from "../theme";
import { initials } from "./format";
import { Txt } from "./Txt";

type Props = {
  name: string;
  accent?: string;
  fill?: boolean;
  size?: number;
};

export function Initials({ name, accent, fill, size = 34 }: Props) {
  const ac = accentFill(accent || T.accentFallback);
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, backgroundColor: fill ? ac.fill : T.fill },
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
