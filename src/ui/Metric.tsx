import { StyleSheet, Text, View } from "react-native";
import { FONT, productTheme as T } from "../theme";

type Cell = {
  label: string;
  value: string | number;
  hint?: string;
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
            <Text style={styles.label}>{cell.label}</Text>
            <Text style={styles.value}>{cell.value}</Text>
            {cell.hint ? <Text style={styles.hint}>{cell.hint}</Text> : null}
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
  label: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.32,
    textTransform: "uppercase",
  },
  value: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 34,
    letterSpacing: -1.2,
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  hint: {
    color: T.muted,
    fontSize: 11,
    marginTop: 2,
  },
});
