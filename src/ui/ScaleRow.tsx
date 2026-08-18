import { StyleSheet, Text, View } from "react-native";
import { productTheme } from "../theme";
import { Choice } from "./Choice";

type Props = {
  name: string;
  value: number;
  onChange: (n: number) => void;
};

export function ScaleRow({ name, value, onChange }: Props) {
  return (
    <View style={styles.line}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.bar}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Choice
            key={n}
            label={String(n)}
            selected={n === value}
            flex
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
    borderColor: productTheme.divider,
    paddingVertical: 4,
  },
  name: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  bar: {
    flexDirection: "row",
  },
});
