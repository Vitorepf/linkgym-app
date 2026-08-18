import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FONT, productTheme as T } from "../theme";

type PhoneProps = {
  children?: ReactNode;
  /** Tab screens: top inset only. Stack: top inset; DockFooter owns the bottom. */
  tab?: boolean;
};

export function Phone({ children, tab }: PhoneProps) {
  return (
    <SafeAreaView style={styles.phone} edges={tab ? ["top"] : ["top"]}>
      {children}
    </SafeAreaView>
  );
}

type HeadProps = {
  kicker?: string;
  title?: string;
  body?: string;
  accent?: string;
  kickerMuted?: boolean;
  right?: ReactNode;
  children?: ReactNode;
};

export function Head({
  kicker,
  title,
  body,
  accent,
  kickerMuted,
  right,
  children,
}: HeadProps) {
  const ac = accent || T.accentFallback;
  return (
    <View style={styles.head}>
      <View style={styles.headRow}>
        <View style={styles.headMain}>
          {kicker ? (
            <Text style={[styles.kicker, { color: kickerMuted ? T.muted : ac }]}>
              {kicker}
            </Text>
          ) : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {body ? <Text style={styles.lede}>{body}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

type BandProps = {
  children?: ReactNode;
  rule?: "strong" | "hair" | "none";
  raised?: boolean;
  accentTop?: boolean;
  accent?: string;
  pad?: boolean;
};

export function Band({
  children,
  rule = "strong",
  raised,
  accentTop,
  accent,
  pad = true,
}: BandProps) {
  const ac = accent || T.accentFallback;
  return (
    <View
      style={[
        pad ? styles.bandPad : null,
        raised && styles.raised,
        rule === "strong" && styles.ruleStrong,
        rule === "hair" && styles.ruleHair,
        accentTop && { borderTopWidth: 2, borderTopColor: ac },
      ]}
    >
      {children}
    </View>
  );
}

export function DockFooter({ children }: { children: ReactNode }) {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.dock,
        { paddingBottom: Math.max(inset.bottom, 12) + 10 },
      ]}
    >
      {children}
    </View>
  );
}

/** Legacy wrapper — unported screens keep compiling while they move to Phone/Head/Band. */
type ScreenProps = {
  kicker?: string;
  title?: string;
  body?: string;
  accent?: string;
  children?: ReactNode;
  tab?: boolean;
};

export function Screen({
  kicker,
  title,
  body,
  accent,
  children,
  tab,
}: ScreenProps) {
  return (
    <Phone tab={tab}>
      {kicker || title || body ? (
        <Head kicker={kicker} title={title} body={body} accent={accent} />
      ) : null}
      <View style={styles.legacy}>{children}</View>
    </Phone>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
    backgroundColor: T.surface,
  },
  head: {
    paddingHorizontal: T.pad,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  headRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headMain: { flex: 1, minWidth: 0 },
  kicker: {
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
  },
  title: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 26,
    letterSpacing: -0.65,
    marginTop: 5,
  },
  lede: {
    color: T.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  bandPad: {
    paddingHorizontal: T.pad,
    paddingVertical: 22,
  },
  raised: { backgroundColor: T.raised },
  ruleStrong: {
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  ruleHair: {
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  dock: {
    paddingHorizontal: T.pad,
    paddingTop: 14,
    borderTopWidth: 2,
    borderTopColor: T.divider,
    backgroundColor: T.dock,
  },
  legacy: {
    flex: 1,
    paddingHorizontal: T.pad,
  },
});
