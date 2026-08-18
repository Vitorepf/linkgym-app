import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { accentOn, productTheme as T } from "../theme";
import { AccentBudget } from "./accent";
import { Txt } from "./Txt";

type PhoneProps = {
  children?: ReactNode;
  /** Tab screens: top inset only. Stack: top inset; DockFooter owns the bottom. */
  tab?: boolean;
};

/** Toda tela passa por aqui, então o orçamento de acento é montado aqui — nenhuma tela
 *  precisa lembrar de abrir escopo, e não existe tela fora do orçamento. */
export function Phone({ children, tab }: PhoneProps) {
  return (
    <SafeAreaView style={styles.phone} edges={tab ? ["top"] : ["top"]}>
      <AccentBudget>{children}</AccentBudget>
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
  // kicker é TEXTO, não enfeite: 4,5:1 contra o chão, com o matiz do personal preservado.
  const ac = accentOn(accent || T.accentFallback, T.bg, 4.5);
  return (
    <View style={styles.head}>
      <View style={styles.headRow}>
        <View style={styles.headMain}>
          {kicker ? (
            <Txt role="label" color={kickerMuted ? T.muted : ac}>
              {kicker}
            </Txt>
          ) : null}
          {title ? (
            <Txt role="title" style={styles.title}>
              {title}
            </Txt>
          ) : null}
          {body ? (
            <Txt role="body" tone="muted" style={styles.lede}>
              {body}
            </Txt>
          ) : null}
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
  const ground = raised ? T.raised : T.bg;
  const ac = accentOn(accent || T.accentFallback, ground, 3);
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
    <View style={[styles.dock, { paddingBottom: Math.max(inset.bottom, 12) + 10 }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // O chão é bg — o mesmo de app.json. Antes era surface, e o token bg quase não existia.
  phone: {
    flex: 1,
    backgroundColor: T.bg,
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
  title: { marginTop: 5 },
  lede: { marginTop: 8 },
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
});
