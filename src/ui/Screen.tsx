import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { productTheme } from "../theme";

type Props = {
  kicker?: string;
  title?: string;
  body?: string;
  accent?: string;
  children?: ReactNode;
  /** Tab screens sit above the bar — omit the home-indicator inset. */
  tab?: boolean;
};

const TAB_EDGES: readonly Edge[] = ["top"];
const STACK_EDGES: readonly Edge[] = ["top", "bottom"];

export function Screen({
  kicker,
  title,
  body,
  accent,
  children,
  tab,
}: Props) {
  const ac = accent || productTheme.accentFallback;
  return (
    <SafeAreaView
      style={styles.safe}
      edges={tab ? TAB_EDGES : STACK_EDGES}
    >
      <View style={styles.pad}>
        {kicker ? <Text style={[styles.kicker, { color: ac }]}>{kicker}</Text> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {body ? <Text style={styles.body}>{body}</Text> : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: productTheme.bg,
  },
  pad: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  kicker: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 36,
    letterSpacing: -0.8,
  },
  body: {
    color: productTheme.muted,
    fontSize: 16,
    marginTop: 12,
    lineHeight: 22,
  },
});
