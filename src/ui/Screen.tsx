import { useEffect, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { accentOn, accentSet, MOTION, productTheme as T } from "../theme";
import { AccentBudget } from "./accent";
import { useTone } from "./motion";
import { Txt } from "./Txt";

type PhoneProps = {
  children?: ReactNode;
};

/** Toda tela passa por aqui, então o orçamento de acento é montado aqui — nenhuma tela
 *  precisa lembrar de abrir escopo, e não existe tela fora do orçamento. */
export function Phone({ children }: PhoneProps) {
  return (
    // Só o topo: embaixo quem paga o inset é o dock (tab) ou o DockFooter (stack).
    <SafeAreaView style={styles.phone} edges={PHONE_EDGES}>
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

/** UMA régua para o D0 inteiro. Antes eram três: SobreVoce contava `n · 6`, Pronto `3 · 4`
 *  e Estreia `4 · 4`, com três espessuras de traço. Na sequência real o contador ANDAVA
 *  PARA TRÁS (6 · 6 → 3 · 4), que é a única coisa que uma barra de progresso não pode
 *  fazer. Oito paradas depois do convite: as seis perguntas, o Pronto e a Estreia.
 *  O convite tem a espinha rotulada dele, que é outro objeto — não entra nesta contagem. */
export const D0_STEPS = 8;

/** Cumprido é ESPESSURA antes de ser tinta: no time 13 o acento e o divider caem no mesmo
 *  cinza, e uma barra codificada só por matiz não diz nada ali. O passo de agora ACENDE ao
 *  chegar — é a própria barra andando, e não um salto. */
export function StepRail({ accent, now }: { accent: string; now: number }) {
  const mark = accentSet(accent || T.accentFallback).mark;
  const [arrived, setArrived] = useState(false);
  useEffect(() => setArrived(true), [now]);
  return (
    <View
      style={styles.rail}
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${now} de ${D0_STEPS}`}
      accessibilityValue={{ min: 1, max: D0_STEPS, now }}
    >
      {Array.from({ length: D0_STEPS }, (_, i) => (
        <Tick key={i} on={i + 1 < now || (i + 1 === now && arrived)} mark={mark} />
      ))}
    </View>
  );
}

function Tick({ on, mark }: { on: boolean; mark: string }) {
  const tone = useTone(on, T.divider, mark, MOTION.enter);
  return <Animated.View style={[styles.tick, on && styles.tickOn, tone]} />;
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

const PHONE_EDGES = ["top"] as const;

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
  rail: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: 14 },
  tick: { flex: 1, height: 2 },
  tickOn: { height: 6 },
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
