import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { putOnboarding, type OnboardingBody, type Time } from "../../api";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Band, D0_STEPS, Head, Phone, StepRail } from "../../ui/Screen";
import { estilos } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { Criacao, type Body } from "./Criacao";

type Props = {
  token: string;
  time: Time;
  onSent: () => void;
};

const EXPERIENCE: { value: OnboardingBody["experience"]; label: string }[] = [
  { value: "never", label: "Nunca treinei" },
  { value: "before", label: "Já treinei antes" },
  { value: "training", label: "Treino hoje" },
];

const DAYS: OnboardingBody["days_per_week"][] = [2, 3, 4, 5, 6];

type CriacaoBeat = "sex" | "height" | "weight";

/** Seis perguntas: três aqui, três na Criacao. A régua é a do D0 inteiro (`StepRail`), a
 *  mesma que Pronto e Estreia continuam — o aluno nunca perde quanto falta nem vê o
 *  contador andar para trás na virada de tela. */
const CRIACAO = 3;
const BEAT_TICK: Record<CriacaoBeat, number> = { sex: 3, height: 4, weight: 5 };

export function SobreVoce({ token, time, onSent }: Props) {
  const styles = usarEstilos();
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
    `${time.name} usa isso para ajustar a ficha.`,
    "Pense numa semana ruim, não numa semana boa.",
    `Se marcar sim, o ${time.name} te liga antes de montar a ficha.`,
  ][step];

  return (
    <Phone>
      <Head kicker={`${tick + 1} · ${D0_STEPS}`}>
        <StepRail now={tick + 1} />
      </Head>

      <View style={styles.fill}>
        {step === CRIACAO ? (
          <View style={styles.padded}>
          <Criacao
            timeName={time.name}
            busy={busy}
            error={error}
            onBeat={onBeat}
            onBack={() => {
              setError("");
              setStep(2);
            }}
            onSend={(body) => void send(body)}
          />
          </View>
        ) : (
          <>
            {/* A pergunta é o herói do passo: um degrau acima de `title`, senão o único
                elemento dominante da tela vira o retângulo do botão. E ela mora numa
                SUPERFÍCIE que cresce: a folga entre a pergunta e as escolhas era 189pt de
                chão nu no meio da tela — agora é o respiro interno da pergunta. */}
            <Band raised grow rule="none">
              <Txt role="value">{ask}</Txt>
              <Txt role="body" tone="muted" style={styles.note}>
                {note}
              </Txt>
            </Band>

            <View style={styles.foot}>
            <View style={styles.options}>
              {step === 0
                ? EXPERIENCE.map((opt) => (
                    <Choice
                      key={opt.value}
                      label={opt.label}
                      selected={experience === opt.value}
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
                    onPress={() => setPain(false)}
                  />
                  <Choice
                    label="Sim, tenho"
                    selected={pain === true}
                    onPress={() => setPain(true)}
                  />
                </>
              ) : null}
            </View>

            <AccentCTA
              label="Continuar"
              onPress={() => answered && setStep(step + 1)}
              disabled={!answered}
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
            </View>
          </>
        )}
      </View>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    fill: { flex: 1 },
    // A Criacao é um palco com `flex: 1` próprio: ela continua no contêiner com margem, e
    // não dentro da superfície da pergunta.
    padded: { flex: 1, paddingHorizontal: T.pad, paddingTop: SPACE.block },
    note: { marginTop: SPACE.hair },
    foot: { paddingHorizontal: T.pad, paddingTop: SPACE.step },
    options: { gap: SPACE.hair, paddingBottom: SPACE.block },
    days: { flexDirection: "row", gap: SPACE.hair },
    back: {
      minHeight: 48,
      justifyContent: "center",
      alignSelf: "flex-start",
    },
  }),
);
