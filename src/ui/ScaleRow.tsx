import { StyleSheet, View } from "react-native";
import { Choice } from "./Choice";
import { estilos } from "./tema";
import { Txt } from "./Txt";

type Props = {
  name: string;
  value: number;
  onChange: (n: number) => void;
  accent?: string;
};

export function ScaleRow({ name, value, onChange, accent }: Props) {
  const styles = usarEstilos();
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

const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    line: {
      borderBottomWidth: FORMA.borda,
      borderColor: T.divider,
      paddingVertical: SPACE.hair,
    },
    name: { marginTop: SPACE.hair, marginBottom: SPACE.hair },
    bar: { flexDirection: "row" },
  }),
);
