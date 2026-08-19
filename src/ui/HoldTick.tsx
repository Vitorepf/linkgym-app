import { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useFrameCallback, useSharedValue } from "react-native-reanimated";
import { withAlpha } from "../theme";
import { useTone } from "./motion";
import { useTema } from "./tema";
import { Txt } from "./Txt";

type Props = {
  onTick: () => void;
  label: string;
  hint: string;
};

/** Era `setInterval(onTick, 90)` na JS thread DURANTE o gesto — a thread que também está
 *  desenhando. Agora o relógio da repetição é o relógio de quadros da UI thread, e o
 *  gesto vive no Gesture Handler. O único salto para a JS thread é o próprio onTick,
 *  que é justamente o que precisa mexer no estado do React. */
export function HoldTick({ onTick, label, hint }: Props) {
  const [held, setHeld] = useState(false);
  const { T, MOTION } = useTema();
  const tone = useTone(held, withAlpha(T.fill, 0), T.fill, MOTION.press);

  // shared value, não `let`: o worklet captura por valor e o relógio tem que sobreviver
  // ao render. timeSinceFirstFrame zera a cada setActive(true), então last zera junto.
  const last = useSharedValue(0);
  const frame = useFrameCallback(({ timeSinceFirstFrame }) => {
    "worklet";
    if (timeSinceFirstFrame - last.value < MOTION.press) return;
    last.value = timeSinceFirstFrame;
    runOnJS(onTick)();
  }, false);

  const start = useCallback(() => {
    setHeld(true);
    last.value = 0;
    onTick();
    frame.setActive(true);
  }, [frame, last, onTick]);

  const stop = useCallback(() => {
    setHeld(false);
    frame.setActive(false);
  }, [frame]);

  const gesture = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(0)
        .maxDistance(64)
        .shouldCancelWhenOutside(true)
        .onBegin(() => runOnJS(start)())
        .onFinalize(() => runOnJS(stop)()),
    [start, stop],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel={hint}
        style={[styles.hit, tone]}
      >
        <Txt role="body" tone="ink">
          {label}
        </Txt>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  hit: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});
