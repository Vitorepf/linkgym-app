import { StyleSheet, Text, View } from "react-native";
import { FONT, productTheme as T } from "../theme";
import { initials } from "./format";

type Props = {
  name: string;
  accent?: string;
  fill?: boolean;
  size?: number;
};

export function Initials({ name, accent, fill, size = 34 }: Props) {
  const ac = accent || T.accentFallback;
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size },
        fill ? { backgroundColor: ac } : { backgroundColor: T.fill },
      ]}
    >
      <Text
        style={[
          styles.letters,
          { fontSize: size < 40 ? 11 : 15, color: fill ? T.bg : T.ink },
        ]}
      >
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  letters: {
    fontFamily: FONT,
  },
});
