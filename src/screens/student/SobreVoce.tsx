import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  putOnboarding,
  type OnboardingBody,
  type Studio,
} from "../../api";
import { FONT, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
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

const BEAT_INDEX: Record<CriacaoBeat, number> = {
  sex: 3,
  height: 4,
  weight: 5,
};

export function SobreVoce({ token, studio, onSent }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const [phase, setPhase] = useState<"ficha" | "criacao">("ficha");
  const [beat, setBeat] = useState<CriacaoBeat>("sex");
  const [experience, setExperience] =
    useState<OnboardingBody["experience"] | null>(null);
  const [days, setDays] = useState<OnboardingBody["days_per_week"] | null>(
    null,
  );
  const [pain, setPain] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [criacaoOn, setCriacaoOn] = useState(false);

  const tick = phase === "ficha" ? 2 : BEAT_INDEX[beat];
  const canSend = experience !== null && days !== null && pain !== null;

  const onBeat = useCallback((next: CriacaoBeat) => {
    setBeat(next);
  }, []);

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

  function next() {
    if (!canSend) return;
    setError("");
    setCriacaoOn(true);
    setPhase("criacao");
  }

  return (
    <Phone>
      {phase === "ficha" ? (
        <Head
          kicker="3 perguntas"
          title="Sobre você"
          body={`${studio.name} usa isso para ajustar a ficha.`}
          accent={accent}
        />
      ) : (
        <Head kicker={`${tick + 1} · 6`} accent={accent}>
          <View
            style={styles.progress}
            accessibilityLabel={`Pergunta ${tick + 1} de 6`}
          >
            {([0, 1, 2, 3, 4, 5] as const).map((i) => (
              <View
                key={i}
                style={[
                  styles.tick,
                  { backgroundColor: i <= tick ? accent : T.divider },
                ]}
              />
            ))}
          </View>
        </Head>
      )}

      {criacaoOn ? (
        <View
          style={phase === "criacao" ? styles.fill : styles.parked}
          pointerEvents={phase === "criacao" ? "auto" : "none"}
        >
          <Criacao
            accent={accent}
            studioName={studio.name}
            busy={busy}
            error={error}
            onBeat={onBeat}
            onBack={() => {
              setError("");
              setPhase("ficha");
            }}
            onSend={(body) => void send(body)}
          />
        </View>
      ) : null}

      {phase === "ficha" ? (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Band>
              <Text style={styles.q}>Você já treinou musculação?</Text>
              <View style={styles.stack}>
                {EXPERIENCE.map((opt) => (
                  <Choice
                    key={opt.value}
                    label={opt.label}
                    selected={experience === opt.value}
                    accent={accent}
                    onPress={() => setExperience(opt.value)}
                  />
                ))}
              </View>
            </Band>

            <Band>
              <Text style={styles.q}>Quantos dias por semana você consegue?</Text>
              <Text style={styles.caption}>
                Pense numa semana ruim, não numa semana boa.
              </Text>
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
            </Band>

            <Band>
              <Text style={styles.q}>Sente dor em alguma articulação?</Text>
              <Text style={styles.caption}>
                Se marcar sim, o {studio.name} te liga antes de montar a ficha.
              </Text>
              <View style={styles.stack}>
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
              </View>
            </Band>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
          <DockFooter>
            <AccentCTA
              label={`Enviar para o ${studio.name}`}
              onPress={next}
              disabled={!canSend}
              busy={busy}
              accent={accent}
            />
          </DockFooter>
        </>
      ) : null}
    </Phone>
  );
}

const styles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
  },
  tick: {
    flex: 1,
    height: 2,
  },
  fill: {
    flex: 1,
    paddingHorizontal: T.pad,
  },
  parked: { height: 0, overflow: "hidden", opacity: 0 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  q: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 22,
    letterSpacing: -0.5,
    lineHeight: 26,
    textAlign: "left",
  },
  caption: {
    color: T.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  stack: { marginTop: 16, gap: 8 },
  days: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  error: {
    color: T.accentFallback,
    fontSize: 14,
    paddingHorizontal: T.pad,
    paddingTop: 8,
  },
});
