import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  runOnJS,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { errorInk, productTheme } from "../../theme";
import { Choice } from "../../ui/Choice";
import { Entity } from "../../ui/Entity";
import { HoldTick } from "../../ui/HoldTick";
import { AccentCTA } from "../../ui/AccentCTA";

export type Body = {
  sex: "male" | "female";
  height_cm: number;
  weight_kg: number;
};

type Beat = "sex" | "height" | "weight";

type Props = {
  accent: string;
  studioName: string;
  busy: boolean;
  error: string;
  onBeat: (beat: Beat) => void;
  onBack: () => void;
  onSend: (body: Body) => void;
};

const HEIGHT_MIN = 140;
const HEIGHT_MAX = 210;
const WEIGHT_MIN = 40;
const WEIGHT_MAX = 140;
const HEIGHT_START = 170;
const WEIGHT_START = 70;

const SPRING = { damping: 16, stiffness: 140, mass: 0.8 };

export function Criacao({
  accent,
  studioName,
  busy,
  error,
  onBeat,
  onBack,
  onSend,
}: Props) {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState<Beat>("sex");
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [heightCm, setHeightCm] = useState(HEIGHT_START);
  const [weightKg, setWeightKg] = useState(WEIGHT_START);
  const heightRef = useRef(heightCm);
  const weightRef = useRef(weightKg);
  heightRef.current = heightCm;
  weightRef.current = weightKg;

  const heightSV = useSharedValue(HEIGHT_START);
  const weightSV = useSharedValue(WEIGHT_START);
  const stance = useSharedValue(0);
  const assembled = useSharedValue(0);
  const beatSV = useSharedValue(0);
  const startH = useSharedValue(HEIGHT_START);
  const startW = useSharedValue(WEIGHT_START);

  useEffect(() => {
    onBeat(beat);
  }, [beat, onBeat]);

  useEffect(() => {
    beatSV.value = beat === "sex" ? 0 : beat === "height" ? 1 : 2;
  }, [beat, beatSV]);

  function morphSex(next: "male" | "female") {
    setSex(next);
    const s = next === "male" ? 1 : -1;
    if (reduce) {
      stance.value = s;
      assembled.value = 1;
      return;
    }
    stance.value = withSpring(s, SPRING);
    assembled.value = withSpring(1, { damping: 14, stiffness: 90, mass: 0.9 });
  }

  function setHeight(n: number) {
    const v = clamp(Math.round(n), HEIGHT_MIN, HEIGHT_MAX);
    heightSV.value = v;
    setHeightCm(v);
  }

  function setWeight(n: number) {
    const v = clamp(Math.round(n * 2) / 2, WEIGHT_MIN, WEIGHT_MAX);
    weightSV.value = v;
    setWeightKg(v);
  }

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          startH.value = heightSV.value;
          startW.value = weightSV.value;
        })
        .onUpdate((e) => {
          if (beatSV.value === 0) return;
          if (beatSV.value === 1) {
            const next = Math.min(
              HEIGHT_MAX,
              Math.max(HEIGHT_MIN, Math.round(startH.value - e.translationY / 5)),
            );
            heightSV.value = next;
            runOnJS(setHeightCm)(next);
            return;
          }
          const next = Math.min(
            WEIGHT_MAX,
            Math.max(
              WEIGHT_MIN,
              Math.round((startW.value + e.translationX / 7) * 2) / 2,
            ),
          );
          weightSV.value = next;
          runOnJS(setWeightKg)(next);
        }),
    [beatSV, heightSV, startH, startW, weightSV],
  );

  const canGo = beat !== "sex" || sex !== null;

  function next() {
    if (!canGo) return;
    if (beat === "sex") {
      setBeat("height");
      return;
    }
    if (beat === "height") {
      setBeat("weight");
      return;
    }
    if (sex === null) return;
    onSend({ sex, height_cm: heightCm, weight_kg: weightKg });
  }

  function back() {
    if (beat === "weight") {
      setBeat("height");
      return;
    }
    if (beat === "height") {
      setBeat("sex");
      return;
    }
    onBack();
  }

  const title =
    beat === "sex"
      ? "Masculino ou feminino?"
      : beat === "height"
        ? `${heightCm} cm`
        : `${formatKg(weightKg)} kg`;
  const caption =
    beat === "sex"
      ? `${studioName} usa na primeira ficha.`
      : beat === "height"
        ? "Arrasta a figura para cima. Ou − / +."
        : "Arrasta para os lados.";

  return (
    <>
      <Animated.View key={beat} entering={FadeIn.duration(180)} style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          collapsable={false}
          style={styles.canvas}
          accessibilityLabel="Figura"
          accessibilityValue={
            beat === "height"
              ? { text: `${heightCm} centímetros` }
              : beat === "weight"
                ? { text: `${formatKg(weightKg)} quilos` }
                : undefined
          }
        >
          <Entity
            accent={accent}
            stance={stance}
            heightCm={heightSV}
            weightKg={weightSV}
            assembled={assembled}
          />
        </Animated.View>
      </GestureDetector>

      {beat === "sex" ? (
        <View style={styles.sex}>
          <Choice
            label="Masculino"
            selected={sex === "male"}
            onPress={() => morphSex("male")}
          />
          <Choice
            label="Feminino"
            selected={sex === "female"}
            onPress={() => morphSex("female")}
          />
        </View>
      ) : (
        <Stepper
          down={() =>
            beat === "height"
              ? setHeight(heightRef.current - 1)
              : setWeight(weightRef.current - 0.5)
          }
          up={() =>
            beat === "height"
              ? setHeight(heightRef.current + 1)
              : setWeight(weightRef.current + 0.5)
          }
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AccentCTA
        label={beat === "weight" ? `Enviar para ${studioName}` : "Continuar"}
        onPress={next}
        disabled={!canGo}
        busy={busy}
        block
      />
      <Pressable onPress={back} hitSlop={12} style={styles.back}>
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>
    </>
  );
}

function Stepper({ down, up }: { down: () => void; up: () => void }) {
  return (
    <View style={styles.stepper}>
      <HoldTick onTick={down} label="−" hint="Diminuir" />
      <HoldTick onTick={up} label="+" hint="Aumentar" />
    </View>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatKg(n: number) {
  return n === Math.round(n) ? String(n) : n.toFixed(1);
}

const styles = StyleSheet.create({
  copy: {
    marginBottom: 4,
  },
  title: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 32,
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  caption: {
    color: productTheme.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  canvas: {
    flex: 1,
    justifyContent: "center",
    minHeight: 280,
  },
  sex: { marginTop: 8 },
  stepper: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: productTheme.divider,
  },
  error: {
    color: errorInk,
    fontSize: 14,
    marginBottom: 8,
  },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 16,
  },
  backText: {
    color: productTheme.muted,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
