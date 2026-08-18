import { StyleSheet, View } from "react-native";
import { productTheme as T } from "../theme";
import { Choice } from "./Choice";
import { Txt } from "./Txt";

type Props = {
  name: string;
  value: number;
  onChange: (n: number) => void;
  accent?: string;
};

export function ScaleRow({ name, value, onChange, accent }: Props) {
  return (
    <View style={styles.line}>
      <Txt role="label" style={styles.name}>
        {name}
      </Txt>
      <View style={styles.bar}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Choice
            key={n}
            label={String(n)}
            selected={n === value}
            flex
            accent={accent}
            onPress={() => onChange(n)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 2,
    borderColor: T.divider,
    paddingVertical: 4,
  },
  name: { marginTop: 8, marginBottom: 4 },
  bar: { flexDirection: "row" },
});
