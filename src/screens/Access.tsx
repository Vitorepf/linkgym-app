import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  aparenciaDoTime,
  ApiError,
  requestCode,
  verify,
  type Person,
  type Time,
} from "../api";
import { AccentCTA } from "../ui/AccentCTA";
import { Campo } from "../ui/Campo";
import { GhostCTA } from "../ui/GhostCTA";
import { Avatar } from "../ui/Avatar";
import { Band, DockFooter, Head, Phone } from "../ui/Screen";
import { estilos, TemaDoTime, useTema } from "../ui/tema";
import { Txt } from "../ui/Txt";

/** Os 4 do seed de desenvolvimento (../linkgym-api/internal/seed/dev.go). O papel entra
 *  no rótulo porque a diferença que importa aqui é qual porta abre: o Fred cai no Painel,
 *  os outros três caem no Hoje. */
const DEV_PEOPLE = [
  { name: "Fred", role: "personal", phone: "11900000001" },
  { name: "Vitor", role: "aluno", phone: "11900000002" },
  { name: "Huan", role: "aluno", phone: "11900000003" },
  { name: "Jose", role: "aluno", phone: "11900000004" },
];

type Step = "phone" | "otp";

/** A barra de passos do eixo 3: o caminho inteiro fica visível em TODOS os passos, então
 *  quem está na porta sabe quanto falta sem tocar em nada.
 *
 *  EM DESENVOLVIMENTO O CAMINHO É UM PASSO SÓ. Sem convite, sem código: o número e
 *  "Entrar". A API já entrega isso — com ENV=development ela devolve o código fixo 0000
 *  (internal/auth/service.go:93), e pessoa que já existe entra com convite vazio. O que
 *  cobrava dois passos era esta tela, não o servidor.
 *
 *  EM PRODUÇÃO CONTINUAM SENDO DOIS, e o convite continua obrigatório: o CONTEXT.md diz
 *  que Convite é a ÚNICA porta de entrada do aluno, e é a produção que a catraca
 *  toques_convite mede (5 toques, 27 teclas). O atalho vive inteiro dentro de `__DEV__`,
 *  que o bundle de produção elimina — não existe env, flag de runtime ou caminho de
 *  código que faça este atalho aparecer para uma pessoa de verdade. */
const STEPS: { key: Step; label: string }[] = __DEV__
  ? [{ key: "phone", label: "Telefone" }]
  : [
      { key: "phone", label: "Telefone" },
      { key: "otp", label: "Código de 4 dígitos" },
    ];

type Props = {
  onEntered: (session: { token: string; person: Person; time: Time }) => void;
};

export function AccessScreen({ onEntered }: Props) {
  const styles = usarEstilos();
  const { T, FORMA, errorInk } = useTema();
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
    // A PORTA COM A CARA DO ESTÚDIO. `App.tsx` só monta o tema com a sessão, e aqui a
    // sessão ainda não existe — então esta era a única tela do app que TODO aluno via, de
    // todo personal, sempre em preto. É o momento em que ele decide se aquilo é o app do
    // Fred ou mais um app. O convite já traz o Time; a aparência dele entra aqui.
    <TemaDoTime aparencia={aparenciaDoTime(time)}>
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
              ? __DEV__
                ? "Dev: número e Entrar. Ou toque num dos quatro abaixo."
                : "Coloque o seu número. Se o seu personal já te chamou por ele, é só isso."
              : // O número aparece de volta, do jeito que foi digitado: quem errou um
                // dígito descobre AQUI, e não depois de esperar uma mensagem que nunca
                // chega. A causa do passo mora na tela, não atrás de um toque.
                `Os 4 dígitos foram para o ${phone}.`
          }
          accent={accent}
          right={
            time ? (
              <Avatar url={time.logo_url} name={time.name} size={34} />
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
            {/* RÓTULO VISÍVEL, e não só placeholder. Placeholder some assim que a pessoa
                digita: nome que evapora não é nome — nem para quem enxerga, nem para o
                leitor de tela. O rótulo é caps/tracked/mudo; o valor é que tem tamanho.
                `accessibilityLabel` repete o rótulo visível para casar o que se vê com o
                que se ouve; `accessibilityHint` diz o que o campo faz com o que foi
                digitado. A ordem de foco é a ordem do documento: rótulo, campo, rótulo,
                campo, erro, ação. */}
            {step === "phone" ? (
              <>
                <Campo
                  rotulo
                  style={styles.campo}
                  label="Telefone"
                  value={phone}
                  onChangeText={setPhone}
                  hint="É para onde vai o código de 4 dígitos"
                  placeholder="11 90000 0000"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
                {/* O CONVITE DEIXOU DE SER A PORTA. Quando o personal chamou o aluno pelo
                    número, o número já está liberado e este campo fica vazio — é o que
                    `resolverConvite` faz na API. Ele continua aqui, e continua visível,
                    porque o convite ABERTO (o story, o cartaz na parede) não tem telefone
                    para liberar: quem recebeu um código precisa de onde digitá-lo.
                    O campo some em dev, onde não há convite nenhum. */}
                {__DEV__ ? null : (
                  <Campo
                    rotulo
                    style={styles.campo}
                    label="Convite"
                    value={invite}
                    onChangeText={setInvite}
                    hint="Só se você recebeu um código. Quem foi chamado pelo número deixa em branco"
                    placeholder="Convite (só se você tiver um)"
                    autoCapitalize="characters"
                  />
                )}
              </>
            ) : (
              <Campo
                rotulo
                style={styles.campo}
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
              <Txt role="label">Dev · um toque entra</Txt>
              <View style={styles.chips}>
                {DEV_PEOPLE.map((p) => (
                  <Pressable
                    key={p.phone}
                    onPress={() => void enterAs(p.phone)}
                    accessibilityRole="button"
                    accessibilityLabel={`Entrar como ${p.name}, ${p.role}`}
                    style={styles.chip}
                  >
                    <Txt role="body">{p.name}</Txt>
                    <Txt role="label" tone="dim">
                      {p.role}
                    </Txt>
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
              label={__DEV__ ? "Entrar" : "Enviar"}
              onPress={() => void (__DEV__ ? enterAs(phone) : sendCode())}
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
                  fundo={FORMA.folha.chrome.composto}
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
    </TemaDoTime>
  );
}

function messageFor(e: unknown): string {
  if (e instanceof ApiError) {
    switch (e.code) {
      case "convite_obrigatorio":
        return "Este número ainda não foi chamado. Peça ao seu personal para te chamar por ele.";
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

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    flex: { flex: 1 },
    // O corpo desce para o alcance do polegar: campos e caminho encostam na ação, e o ar
    // sobra em UMA folga só, embaixo do cabeçalho, em vez de virar um retângulo cercado de
    // filete no meio da tela. Era 400 px de nada no terço de baixo.
    content: { flexGrow: 1, justifyContent: "flex-end", paddingBottom: 8 },
    campo: { marginBottom: SPACE.tight },
    error: { marginTop: 4 },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
    chip: {
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioAcao,
      borderColor: T.divider,
      paddingHorizontal: 14,
      minHeight: FORMA.alturaMinima,
      justifyContent: "center",
    },
    spine: {
      borderTopWidth: FORMA.borda,
      borderTopColor: T.divider,
      paddingHorizontal: T.pad,
    },
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 20,
    },
    stepRule: { borderTopWidth: FORMA.fio, borderTopColor: T.hairline },
    mark: {
      width: 14,
      height: 14,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioEm(14),
      borderColor: T.divider,
      flexShrink: 0,
    },
    markOn: { backgroundColor: T.ink, borderColor: T.ink },
    ghost: { marginTop: 10 },
  }),
);
