import { StyleSheet, View } from "react-native";
import { productTheme as T } from "../theme";
import { Figure } from "./Figure";

/** A fila de pares do eixo 1: mesmo peso visual, um rótulo mudo em caps, o valor com a
 *  cor e o tamanho. Cada célula é uma Figure, então unidade e direção já vêm de graça — e
 *  ninguém precisa reinventar o par número/rótulo. */
type Cell = {
  label: string;
  value: string | number;
  /** legenda muda ao pé do número. NÃO é baseline — baseline exige número, e mora em
   *  src/ui/Baseline.tsx. */
  note?: string;
  unit?: string;
  dir?: "up" | "down" | "flat";
};

type Props = {
  cells: Cell[];
  columns?: 2 | 3;
};

export function MetricGrid({ cells, columns = 2 }: Props) {
  return (
    <View style={styles.grid}>
      {cells.map((cell, i) => {
        const lastCol = (i + 1) % columns === 0;
        const lastRow = i >= cells.length - (cells.length % columns || columns);
        return (
          <View
            key={cell.label}
            style={[
              styles.cell,
              { width: `${100 / columns}%` as `${number}%` },
              !lastCol && styles.right,
              !lastRow && styles.bottom,
            ]}
          >
            <Figure
              value={cell.value}
              label={cell.label}
              unit={cell.unit}
              note={cell.note}
              dir={cell.dir}
              role="value"
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  cell: {
    paddingHorizontal: T.pad,
    paddingVertical: 22,
  },
  right: {
    borderRightWidth: 1,
    borderRightColor: T.hairline,
  },
  bottom: {
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
});
