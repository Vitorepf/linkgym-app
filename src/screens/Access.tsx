import { useState, type ComponentProps } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ApiError, requestCode, verify, type Person, type Time } from "../api";
import { errorInk, FONT, productTheme as T } from "../theme";
import { AccentCTA } from "../ui/AccentCTA";
import { GhostCTA } from "../ui/GhostCTA";
import { Initials } from "../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../ui/Screen";
import { Txt } from "../ui/Txt";

const DEV_PEOPLE = [
  { name: "Fred", phone: "11900000001" },
  { name: "Vitor", phone: "11900000002" },
  { name: "Huan", phone: "11900000003" },
  { name: "Jose", phone: "11900000004" },
];

type Step = "phone" | "otp";

/** A barra de passos do eixo 3: o caminho inteiro fica visível em TODOS os passos, então
 *  quem está na porta sabe quanto falta sem tocar em nada. Dois passos, e é o fim. */
const STEPS: { key: Step; label: string }[] = [
  { key: "phone", label: "Telefone e convite" },
  { key: "otp", label: "Código de 4 dígitos" },
];

type Props = {
  onEntered: (session: { token: string; person: Person; time: Time }) => void;
};

export function AccessScreen({ onEntered }: Props) {
  const [phone, setPhone] = useState("");
  const [invite, setInvite] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [time, setTime] = useState<Time | null>(null);

  const accent = time?.accent_color || T.accentFallback;

  async function sendCode() {
    setBusy(true);
    setError("");
    try {
      const res = await requestCode(phone, invite);
      if (res.dev_code) setOtp(res.dev_code);
      setTime(res.time ?? null);
      setStep("otp");
    } catch (e) {
      setError(messageFor(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      onEntered(await verify(phone, otp, invite));
    } catch (e) {
      setError(messageFor(e));
    } finally {
      setBusy(false);
    }
  }

  async function enterAs(devPhone: string) {
    setPhone(devPhone);
    setInvite("");
    setBusy(true);
    setError("");
    try {
      const res = await requestCode(devPhone, "");
      onEntered(await verify(devPhone, res.dev_code ?? "0000", ""));
    } catch (e) {
      setError(messageFor(e));
    } finally {
      setBusy(false);
    }
  }

  const now = step === "phone" ? 1 : 2;

  return (
    <Phone>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* O nome de quem convidou vive no kicker, que é o único lugar da tela onde o
            acento ESCREVE (4,5:1 contra o chão). A massa do acento é do botão, e é só
            dele — por isso a marca ao lado vai sem `fill`. */}
        <Head
          kicker={time ? `${time.name} te chamou` : "Convite"}
          title="Entrar"
          body={
            step === "phone"
              ? "Sem convite não há aluno. Quem já entrou uma vez deixa o convite em branco."
              : // O número aparece de volta, do jeito que foi digitado: quem errou um
                // dígito descobre AQUI, e não depois de esperar uma mensagem que nunca
                // chega. A causa do passo mora na tela, não atrás de um toque.
                `Os 4 dígitos foram para o ${phone}.`
          }
          accent={accent}
          right={time ? <Initials name={time.name} size={34} /> : undefined}
        />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Band>
            {/* RÓTULO VISÍVEL, e não só placeholder. Placeholder some assim que a pessoa
                digita: nome que evapora não é nome — nem para quem enxerga, nem para o
                leitor de tela. O rótulo é caps/tracked/mudo; o valor é que tem tamanho.
                `accessibilityLabel` repete o rótulo visível para casar o que se vê com o
                que se ouve; `accessibilityHint` diz o que o campo faz com o que foi
                digitado. A ordem de foco é a ordem do documento: rótulo, campo, rótulo,
                campo, erro, ação. */}
            {step === "phone" ? (
              <>
                <Field
                  label="Telefone"
                  value={phone}
                  onChangeText={setPhone}
                  hint="É para onde vai o código de 4 dígitos"
                  placeholder="11 90000 0000"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
                <Field
                  label="Convite"
                  value={invite}
                  onChangeText={setInvite}
                  hint="Só na primeira vez. Quem já entrou uma vez deixa em branco"
                  placeholder="Convite (só na primeira vez)"
                  autoCapitalize="characters"
                />
              </>
            ) : (
              <Field
                label="Código"
                value={otp}
                onChangeText={setOtp}
                hint="Os 4 dígitos que chegaram por mensagem"
                placeholder="0000"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={4}
                autoFocus
              />
            )}
            {/* O ERRO É ANUNCIADO: `alert` faz o leitor de tela falar a mensagem quando
                ela aparece, em vez de ela existir só para quem enxerga a linha. */}
            {error ? (
              <Txt
                role="body"
                color={errorInk}
                style={styles.error}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                {error}
              </Txt>
            ) : null}
          </Band>

          {__DEV__ ? (
            <Band rule="none">
              <Txt role="label">Dev · OTP 0000</Txt>
              <View style={styles.chips}>
                {DEV_PEOPLE.map((p) => (
                  <Pressable
                    key={p.phone}
                    onPress={() => void enterAs(p.phone)}
                    accessibilityRole="button"
                    accessibilityLabel={`Entrar como ${p.name}`}
                    style={styles.chip}
                  >
                    <Txt role="body">{p.name}</Txt>
                  </Pressable>
                ))}
              </View>
            </Band>
          ) : null}

          <View
            style={styles.spine}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Caminho até entrar"
            accessibilityValue={{
              min: 1,
              max: STEPS.length,
              now,
              text: `Passo ${now} de ${STEPS.length}: ${STEPS[now - 1].label}`,
            }}
          >
            {STEPS.map((s, i) => {
              const done = i + 1 < now;
              const here = i + 1 === now;
              return (
                <View key={s.key} style={[styles.stepRow, i > 0 && styles.stepRule]}>
                  {/* Estado por FORMA e PRESENÇA, nunca por matiz: o passo vencido e o
                      passo de agora têm marca; o que ainda não chegou é a marca vazia. */}
                  <View style={[styles.mark, (done || here) && styles.markOn]} />
                  <Txt role="body" tone={here ? "ink" : "muted"}>
                    {s.label}
                  </Txt>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <DockFooter>
          {step === "phone" ? (
            <AccentCTA
              label="Enviar"
              onPress={() => void sendCode()}
              disabled={busy || phone.length < 10}
              busy={busy}
              accent={accent}
            />
          ) : (
            <>
              <AccentCTA
                label="Entrar"
                onPress={() => void confirm()}
                disabled={busy || otp.length !== 4}
                busy={busy}
                accent={accent}
              />
              <View style={styles.ghost}>
                <GhostCTA
                  label="Trocar número"
                  onPress={() => {
                    setTime(null);
                    setOtp("");
                    setError("");
                    setStep("phone");
                  }}
                />
              </View>
            </>
          )}
        </DockFooter>
      </KeyboardAvoidingView>
    </Phone>
  );
}

/** Rótulo visível + campo, sempre nessa ordem e sempre com o mesmo nome nos dois canais.
 *  Existe porque a tela tem três campos e o par rótulo/nome acessível não pode divergir
 *  em nenhum deles — essa divergência já foi apontada como defeito real aqui. */
type FieldProps = ComponentProps<typeof TextInput> & { label: string; hint: string };

function Field({ label, hint, style, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <Txt role="label">{label}</Txt>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={T.muted}
        style={[styles.input, style]}
      />
    </View>
  );
}

function messageFor(e: unknown): string {
  if (e instanceof ApiError) {
    switch (e.code) {
      case "convite_obrigatorio":
        return "Primeira vez: precisa do convite do personal.";
      case "convite_invalido":
        return "Esse convite não bate com o telefone.";
      case "codigo_invalido":
        return "Código errado ou vencido.";
      case "telefone_invalido":
        return "Telefone inválido.";
    }
  }
  return "Não deu para falar com a API. Ela está no ar?";
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // O corpo desce para o alcance do polegar: campos e caminho encostam na ação, e o ar
  // sobra em UMA folga só, embaixo do cabeçalho, em vez de virar um retângulo cercado de
  // filete no meio da tela. Era 400 px de nada no terço de baixo.
  content: { flexGrow: 1, justifyContent: "flex-end", paddingBottom: 8 },
  field: { marginBottom: 14 },
  input: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 18,
    minHeight: 52,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    borderWidth: 2,
    borderColor: T.divider,
  },
  error: { marginTop: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    borderWidth: 2,
    borderColor: T.divider,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
  },
  spine: {
    borderTopWidth: 2,
    borderTopColor: T.divider,
    paddingHorizontal: T.pad,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 20,
  },
  stepRule: { borderTopWidth: 1, borderTopColor: T.hairline },
  mark: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: T.divider,
    flexShrink: 0,
  },
  markOn: { backgroundColor: T.ink, borderColor: T.ink },
  ghost: { marginTop: 10 },
});
