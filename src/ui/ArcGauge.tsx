import { StyleSheet, Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";
import { FONT, productTheme as T } from "../theme";

type Props = {
  value: number;
  label: string;
  accent: string;
};

export function ArcGauge({ value, label, accent }: Props) {
  const n = Math.max(0, Math.min(100, value));
  const ticks = 10;
  const cx = 100;
  const cy = 110;
  const r0 = 58;
  const r1 = 84;
  const mark = Math.PI * (1 - n / 100);

  const lines = Array.from({ length: ticks }, (_, i) => {
    const t = i / (ticks - 1);
    const a = Math.PI * (1 - t);
    const on = n > 0 && t <= n / 100;
    return {
      x1: cx + Math.cos(a) * r0,
      y1: cy - Math.sin(a) * r0,
      x2: cx + Math.cos(a) * r1,
      y2: cy - Math.sin(a) * r1,
      c: on ? accent : T.fill,
    };
  });

  const mx1 = cx + Math.cos(mark) * 48;
  const my1 = cy - Math.sin(mark) * 48;
  const mx2 = cx + Math.cos(mark) * 92;
  const my2 = cy - Math.sin(mark) * 92;

  return (
    <View style={styles.wrap}>
      <Svg viewBox="0 0 200 112" width="100%" height={160}>
        {lines.map((l, i) => (
          <Line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.c}
            strokeWidth={11}
          />
        ))}
        {n > 0 ? (
          <Line
            x1={mx1}
            y1={my1}
            x2={mx2}
            y2={my2}
            stroke={T.ink}
            strokeWidth={2}
          />
        ) : null}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.num}>{n === 0 ? "—" : n}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    marginTop: 4,
  },
  center: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 2,
    alignItems: "center",
  },
  num: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 62,
    letterSpacing: -3,
    lineHeight: 58,
    fontVariant: ["tabular-nums"],
  },
  label: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 14,
    marginTop: 4,
  },
});
