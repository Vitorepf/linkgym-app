import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ApiError, requestCode, verify, type Person, type Studio } from "../api";
import { FONT, productTheme as T } from "../theme";
import { AccentCTA } from "../ui/AccentCTA";
import { GhostCTA } from "../ui/GhostCTA";
import { Initials } from "../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../ui/Screen";

const DEV_PEOPLE = [
  { name: "Fred", phone: "11900000001" },
  { name: "Vitor", phone: "11900000002" },
  { name: "Huan", phone: "11900000003" },
  { name: "Jose", phone: "11900000004" },
];

type Props = {
  onEntered: (session: { token: string; person: Person; studio: Studio }) => void;
};

export function AccessScreen({ onEntered }: Props) {
  const [phone, setPhone] = useState("");
  const [invite, setInvite] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [studio, setStudio] = useState<Studio | null>(null);

  const accent = studio?.accent_color || T.accentFallback;

  async function sendCode(nextPhone = phone) {
    setBusy(true);
    setError("");
    try {
      const res = await requestCode(nextPhone, invite);
      if (res.dev_code) {
        setOtp(res.dev_code);
      }
      setStudio(res.studio ?? null);
      setStep("otp");
    } catch (e) {
      setError(messageFor(e));
    } finally {
      setBusy(false);
    }
  }

  async function confirm(nextPhone = phone, nextOtp = otp) {
    setBusy(true);
    setError("");
    try {
      const session = await verify(nextPhone, nextOtp, invite);
      onEntered(session);
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
      const session = await verify(devPhone, res.dev_code ?? "0000", "");
      onEntered(session);
    } catch (e) {
      setError(messageFor(e));
    } finally {
      setBusy(false);
    }
  }

  const body = studio
    ? "Ele já montou a sua ficha. Aqui você marca o que fez e ele acompanha."
    : step === "phone"
      ? "Sem convite não nasce aluno. Trocar de iPhone: o mesmo número, um código novo."
      : "Os 4 dígitos que chegaram.";

  return (
    <Phone>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Head
          kicker={studio ? "Convite" : "Acesso"}
          title="Entrar"
          body={
            studio ? `${studio.name} te chamou. ${body}` : body
          }
          accent={accent}
          right={
            studio ? (
              <Initials name={studio.name} accent={accent} fill size={34} />
            ) : undefined
          }
        />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Band>
            {step === "phone" ? (
              <>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="11 90000 0000"
                  placeholderTextColor={T.muted}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  style={styles.input}
                />
                <TextInput
                  value={invite}
                  onChangeText={setInvite}
                  placeholder="Convite (só na primeira vez)"
                  placeholderTextColor={T.muted}
                  autoCapitalize="characters"
                  style={styles.input}
                />
              </>
            ) : (
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="0000"
                placeholderTextColor={T.muted}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.input}
              />
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Band>

          {studio ? (
            <Band rule="hair">
              <Text style={styles.footer}>
                A cara é do seu personal. O app por dentro é o mesmo.
              </Text>
            </Band>
          ) : null}

          {__DEV__ ? (
            <Band rule="none">
              <Text style={styles.devKicker}>Dev · OTP 0000</Text>
              <View style={styles.chips}>
                {DEV_PEOPLE.map((p) => (
                  <Pressable
                    key={p.phone}
                    onPress={() => void enterAs(p.phone)}
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>{p.name}</Text>
                  </Pressable>
                ))}
              </View>
            </Band>
          ) : null}
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
                    setStudio(null);
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
      default:
        return "Não deu para falar com a API. Ela está no ar?";
    }
  }
  return "Não deu para falar com a API. Ela está no ar?";
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  input: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: T.divider,
    marginBottom: 8,
  },
  error: {
    color: T.accentFallback,
    marginTop: 8,
    fontSize: 14,
  },
  footer: {
    color: T.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  devKicker: {
    color: T.muted,
    fontFamily: FONT,
    fontSize: 11,
    letterSpacing: 1.43,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 2,
    borderColor: T.divider,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  chipText: {
    color: T.ink,
    fontFamily: FONT,
    fontSize: 15,
  },
  ghost: { marginTop: 10 },
});
