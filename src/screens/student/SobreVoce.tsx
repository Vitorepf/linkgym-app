import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { putOnboarding, type OnboardingBody, type Studio } from "../../api";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { Criacao, type Body } from "./Criacao";

type Props = {
  token: string;
  studio: Studio;
  onSent: () => void;
};

const EXPERIENCE: { value: OnboardingBody["experience"]; label: string }[] = [
  { value: "never", label: "Nunca treinei" },
  { value: "before", label: "Já treinei antes" },
  { value: "training", label: "Treino hoje" },
];

const DAYS: OnboardingBody["days_per_week"][] = [2, 3, 4, 5, 6];

type CriacaoBeat = "sex" | "height" | "weight";

/** Os seis passos do D0 numa régua só: três perguntas aqui, três na Criacao. A barra é a
 *  mesma nos seis, então o aluno nunca perde quanto falta. */
const STEPS = [0, 1, 2, 3, 4, 5] as const;
const CRIACAO = 3;
const BEAT_TICK: Record<CriacaoBeat, number> = { sex: 3, height: 4, weight: 5 };

export function SobreVoce({ token, studio, onSent }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
  const [step, setStep] = useState(0);
  const [beat, setBeat] = useState<CriacaoBeat>("sex");
  const [experience, setExperience] =
    useState<OnboardingBody["experience"] | null>(null);
  const [days, setDays] = useState<OnboardingBody["days_per_week"] | null>(null);
  const [pain, setPain] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const tick = step === CRIACAO ? BEAT_TICK[beat] : step;
  const answered =
    step === 0 ? experience !== null : step === 1 ? days !== null : pain !== null;

  const onBeat = useCallback((next: CriacaoBeat) => setBeat(next), []);

  async function send(body: Body) {
    if (experience === null || days === null || pain === null || busy) return;
    setBusy(true);
    setError("");
    try {
      await putOnboarding(token, {
        experience,
        days_per_week: days,
        pain,
        sex: body.sex,
        height_cm: body.height_cm,
        weight_kg: body.weight_kg,
      });
      onSent();
    } catch {
      setError("Não deu para enviar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  const ask = [
    "Você já treinou musculação?",
    "Quantos dias por semana você consegue?",
    "Sente dor em alguma articulação?",
  ][step];
  const note = [
    `${studio.name} usa isso para ajustar a ficha.`,
    "Pense numa semana ruim, não numa semana boa.",
    `Se marcar sim, o ${studio.name} te liga antes de montar a ficha.`,
  ][step];

  return (
    <Phone>
      <Head kicker={`${tick + 1} · 6`} accent={accent}>
        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityLabel={`Pergunta ${tick + 1} de 6`}
          accessibilityValue={{ min: 1, max: 6, now: tick + 1 }}
        >
          {STEPS.map((i) => (
            <View
              key={i}
              style={[
                styles.tick,
                i <= tick
                  ? { height: 6, backgroundColor: A.mark }
                  : { height: 2, backgroundColor: T.divider },
              ]}
            />
          ))}
        </View>
      </Head>

      <View style={styles.fill}>
        {step === CRIACAO ? (
          <Criacao
            accent={accent}
            studioName={studio.name}
            busy={busy}
            error={error}
            onBeat={onBeat}
            onBack={() => {
              setError("");
              setStep(2);
            }}
            onSend={(body) => void send(body)}
          />
        ) : (
          <>
            <View style={styles.copy}>
              {/* A pergunta é o herói do passo: um degrau acima de `title`, senão o
                  único elemento dominante da tela vira o retângulo do botão. */}
              <Txt role="value">{ask}</Txt>
              <Txt role="body" tone="muted" style={styles.note}>
                {note}
              </Txt>
            </View>

            <View style={styles.options}>
              {step === 0
                ? EXPERIENCE.map((opt) => (
                    <Choice
                      key={opt.value}
                      label={opt.label}
                      selected={experience === opt.value}
                      accent={accent}
                      onPress={() => setExperience(opt.value)}
                    />
                  ))
                : null}
              {step === 1 ? (
                <View style={styles.days}>
                  {DAYS.map((n) => (
                    <Choice
                      key={n}
                      label={String(n)}
                      selected={days === n}
                      flex
                      accent={accent}
                      onPress={() => setDays(n)}
                    />
                  ))}
                </View>
              ) : null}
              {step === 2 ? (
                <>
                  <Choice
                    label="Não"
                    selected={pain === false}
                    accent={accent}
                    onPress={() => setPain(false)}
                  />
                  <Choice
                    label="Sim, tenho"
                    selected={pain === true}
                    accent={accent}
                    onPress={() => setPain(true)}
                  />
                </>
              ) : null}
            </View>

            <AccentCTA
              label="Continuar"
              onPress={() => answered && setStep(step + 1)}
              disabled={!answered}
              accent={accent}
              block
            />
            {/* Altura reservada nos seis passos: o botão não anda quando o Voltar some. */}
            <View style={styles.back}>
              {step > 0 ? (
                <Pressable
                  onPress={() => setStep(step - 1)}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar para a pergunta anterior"
                >
                  <Txt role="label">Voltar</Txt>
                </Pressable>
              ) : null}
            </View>
          </>
        )}
      </View>
    </Phone>
  );
}

const styles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 14,
  },
  // Cumprido é ESPESSURA, não matiz: no time 13 o acento e o divider quase empatam de
  // cor, e 6px contra 2px continua legível.
  tick: { flex: 1 },
  fill: {
    flex: 1,
    paddingHorizontal: T.pad,
    paddingTop: 24,
  },
  // A pergunta ocupa o vazio que sobra em vez de se espremer no topo; as escolhas ficam
  // ancoradas no terço inferior, ao alcance do polegar.
  copy: { flex: 1, justifyContent: "center" },
  note: { marginTop: 10 },
  options: { gap: 8, paddingBottom: 24 },
  days: { flexDirection: "row", gap: 8 },
  back: {
    minHeight: 48,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
});
