import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  runOnJS,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { errorInk, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Entity } from "../../ui/Entity";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { HoldTick } from "../../ui/HoldTick";
import { Txt } from "../../ui/Txt";

export type Body = {
  sex: "male" | "female";
  height_cm: number;
  weight_kg: number;
};

type Beat = "sex" | "height" | "weight";

type Props = {
  accent: string;
  /** nome do time. `timeName` é o nome da prop no chamador (src/api.ts `Time`), não
   *  vocabulário de tela: aqui dentro ele só aparece como o nome, nunca como tipo. */
  timeName: string;
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
  timeName,
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

  // shared values são a fonte única do valor corrente: o gesto escreve neles na UI thread
  // e o botão lê deles na JS thread. Eram dois refs espelhando o estado; morreram.
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

  /** um passo do controle, seja botão ou ação de acessibilidade. */
  function bump(dir: 1 | -1) {
    if (beat === "height") setHeight(heightSV.value + dir);
    if (beat === "weight") setWeight(weightSV.value + dir * 0.5);
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

  const measure = beat === "height" ? "Altura" : "Peso";
  const spoken =
    beat === "height"
      ? `${heightCm} centímetros`
      : `${formatKg(weightKg)} quilos`;

  return (
    <>
      {/* O que anima é o número; o rótulo e o botão ficam onde estão. */}
      <Animated.View key={beat} entering={FadeIn.duration(180)}>
        {beat === "sex" ? (
          <Txt role="title">Masculino ou feminino?</Txt>
        ) : (
          <Figure
            value={beat === "height" ? heightCm : formatKg(weightKg)}
            label={measure}
            unit={beat === "height" ? "cm" : "kg"}
            note={
              beat === "height"
                ? "Arrasta a figura para cima. Ou − / +."
                : "Arrasta a figura para os lados. Ou − / +."
            }
            role="hero"
          />
        )}
        {/* a razão de perguntar não sai da tela em nenhum dos três tempos. */}
        <Txt role="body" tone="muted" style={styles.why}>
          {timeName} usa na primeira ficha.
        </Txt>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          collapsable={false}
          style={styles.canvas}
          accessible={beat !== "sex"}
          accessibilityRole="adjustable"
          accessibilityLabel={measure}
          accessibilityValue={{ text: spoken }}
          accessibilityActions={ADJUST}
          onAccessibilityAction={(e) =>
            bump(e.nativeEvent.actionName === "increment" ? 1 : -1)
          }
        >
          {/* A figura é a codificação redundante do número — só serve se for lida de
              relance, e o palco tem quase mil pixels. Escala do palco inteiro (é tudo
              retângulo, não borra), pé no chão, sem tocar no primitivo.

              E ela é CINZA, não acentuada: o acento é do personal e esta tela já o gasta
              inteiro no botão (o orçamento é de UM elemento pintando área por tela). Este
              corpo é da Pessoa. De quebra, some o pior caso do time 13 — acento igual ao
              fundo desenhava uma figura invisível. */}
          <View style={styles.stage}>
            <Entity
              accent={T.divider}
              stance={stance}
              heightCm={heightSV}
              weightKg={weightSV}
              assembled={assembled}
            />
          </View>
        </Animated.View>
      </GestureDetector>

      {beat === "sex" ? (
        <View style={styles.sex}>
          <Choice
            label="Masculino"
            selected={sex === "male"}
            accent={accent}
            onPress={() => morphSex("male")}
          />
          <Choice
            label="Feminino"
            selected={sex === "female"}
            accent={accent}
            onPress={() => morphSex("female")}
          />
        </View>
      ) : (
        <View style={styles.stepper}>
          <HoldTick
            onTick={() => bump(-1)}
            label="−"
            hint={`Diminuir ${measure.toLowerCase()}`}
          />
          <HoldTick
            onTick={() => bump(1)}
            label="+"
            hint={`Aumentar ${measure.toLowerCase()}`}
          />
        </View>
      )}

      {error ? (
        <Txt role="body" color={errorInk} style={styles.error}>
          {error}
        </Txt>
      ) : null}

      <AccentCTA
        label={beat === "weight" ? `Enviar para ${timeName}` : "Continuar"}
        onPress={next}
        accent={accent}
        disabled={!canGo}
        busy={busy}
        block
      />
      <Pressable
        onPress={back}
        hitSlop={12}
        accessibilityRole="button"
        style={styles.back}
      >
        <Txt role="label">Voltar</Txt>
      </Pressable>
    </>
  );
}

const ADJUST = [{ name: "increment" }, { name: "decrement" }] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const styles = StyleSheet.create({
  why: { marginTop: 10 },
  // A figura PISA no chão logo acima do controle, em vez de boiar no meio de um vazio:
  // o terço inferior fica com número, controle e ação, que é onde o dedo está.
  canvas: {
    flex: 1,
    justifyContent: "flex-end",
  },
  stage: {
    transform: [{ scale: 1.5 }],
    transformOrigin: "bottom",
    marginBottom: 14,
  },
  sex: { marginTop: 8, gap: 8 },
  stepper: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: T.divider,
  },
  error: { marginBottom: 8 },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 16,
  },
});
