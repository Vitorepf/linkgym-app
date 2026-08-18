import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ApiError, requestCode, verify, type Person, type Studio } from "../api";
import { productTheme } from "../theme";

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

  async function sendCode(nextPhone = phone) {
    setBusy(true);
    setError("");
    try {
      const res = await requestCode(nextPhone, invite);
      if (res.dev_code) {
        setOtp(res.dev_code);
      }
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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.kicker}>Acesso</Text>
        <Text style={styles.title}>
          {step === "phone"
            ? "Seu telefone."
            : "Os 4 dígitos que chegaram."}
        </Text>
        <Text style={styles.body}>
          Sem convite não nasce aluno. Trocar de iPhone: o mesmo número, um
          código novo.
        </Text>

        {step === "phone" ? (
          <>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="11 90000 0000"
              placeholderTextColor={productTheme.muted}
              keyboardType="phone-pad"
              autoComplete="tel"
              style={styles.input}
            />
            <TextInput
              value={invite}
              onChangeText={setInvite}
              placeholder="Convite (só na primeira vez)"
              placeholderTextColor={productTheme.muted}
              autoCapitalize="characters"
              style={styles.input}
            />
            <Pressable
              onPress={() => sendCode()}
              disabled={busy || phone.length < 10}
              style={[styles.btn, (busy || phone.length < 10) && styles.btnOff]}
            >
              {busy ? (
                <ActivityIndicator color={productTheme.bg} />
              ) : (
                <Text style={styles.btnText}>Continuar</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="0000"
              placeholderTextColor={productTheme.muted}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.input}
            />
            <Pressable
              onPress={() => confirm()}
              disabled={busy || otp.length !== 4}
              style={[styles.btn, (busy || otp.length !== 4) && styles.btnOff]}
            >
              {busy ? (
                <ActivityIndicator color={productTheme.bg} />
              ) : (
                <Text style={styles.btnText}>Entrar</Text>
              )}
            </Pressable>
            <Pressable onPress={() => setStep("phone")} style={styles.linkWrap}>
              <Text style={styles.link}>Trocar número</Text>
            </Pressable>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {__DEV__ ? (
          <View style={styles.dev}>
            <Text style={styles.devKicker}>Dev · OTP 0000</Text>
            <View style={styles.chips}>
              {DEV_PEOPLE.map((p) => (
                <Pressable
                  key={p.phone}
                  onPress={() => enterAs(p.phone)}
                  style={styles.chip}
                >
                  <Text style={styles.chipText}>{p.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
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
  screen: { flex: 1, backgroundColor: productTheme.bg },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    color: productTheme.accentFallback,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: productTheme.ink,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 28,
    letterSpacing: -0.6,
  },
  body: {
    color: productTheme.muted,
    fontSize: 15,
    marginTop: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  input: {
    color: productTheme.ink,
    fontSize: 18,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: productTheme.divider,
    marginBottom: 8,
  },
  btn: {
    marginTop: 20,
    backgroundColor: productTheme.ink,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnOff: { opacity: 0.35 },
  btnText: {
    color: productTheme.bg,
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  linkWrap: { marginTop: 16 },
  link: { color: productTheme.muted, fontSize: 14 },
  error: { color: productTheme.accentFallback, marginTop: 16, fontSize: 14 },
  dev: {
    marginTop: 40,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: productTheme.divider,
  },
  devKicker: {
    color: productTheme.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 2,
    borderColor: productTheme.divider,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: productTheme.ink, fontFamily: "Archivo_800ExtraBold" },
});
