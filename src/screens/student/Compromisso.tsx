import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { putCommitment, type Studio } from "../../api";
import { productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Figure } from "../../ui/Figure";
import { Initials } from "../../ui/Initials";
import { useTone } from "../../ui/motion";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Days = 2 | 3 | 4 | 5 | 6;

type Props = {
  token: string;
  studio: Studio;
  onDone: () => void;
};

const DAYS: Days[] = [2, 3, 4, 5, 6];
const WEEK = [0, 1, 2, 3, 4, 5, 6];

/** Uma barra da semana. Cumprido é PRESENÇA DE TINTA, nunca matiz — o único matiz da tela
 *  é o do personal e ele não significa bom nem ruim.
 *  ponytail: `useTone` já é a linguagem de estado do app (tom no MESMO elemento, na UI
 *  thread). Varredura escalonada seria um hook novo para 40 ms de charme. Não vale. */
function Barra({ on }: { on: boolean }) {
  const tone = useTone(on, T.fill, T.ink);
  return <Animated.View style={[styles.bar, tone]} />;
}

/** O HERÓI da tela, e os dois medidores num traço só.
 *
 *  A semana inteira está sempre desenhada: as barras à esquerda são o COMBINADO (o menor
 *  ato que fecha a semana) e as de trás continuam ali, mudas, como EXTRA. O segundo
 *  medidor — a ambição — é literalmente o espaço que sobra, e ele não tem marca de falta,
 *  não tem vermelho e não tem botão. O pedido de "faça mais" é a frase embaixo do número.
 *
 *  O número carrega a unidade num nível próprio (`de 7`), então ele nunca é trivia: a
 *  semana é a referência real contra a qual o combinado está sendo lido. Sete é a semana,
 *  não um número inventado para parecer baseline. */
function Piso({
  days,
  line,
  final: last,
}: {
  days: Days | null;
  line: string;
  final?: boolean;
}) {
  return (
    // ponytail: `Band` não estica, e o herói precisa de flex:1 para não sobrar buraco no
    // terço inferior. Então ele carrega o próprio piso e a própria régua.
    <View style={[styles.hero, last && styles.heroFinal]}>
      <View>
        <View style={styles.legend}>
          <Txt role="label">Combinado</Txt>
          <Txt role="label" tone="dim">
            Extra
          </Txt>
        </View>
        <View style={styles.week}>
          {WEEK.map((i) => (
            <Barra key={i} on={i < (days ?? 0)} />
          ))}
        </View>
      </View>
      <View>
        {/* ponytail: zero, não travessão. Zero é o número REAL do que está combinado antes
            da escolha, casa com as sete barras vazias e conta para cima no toque — o
            travessão em corpo 61 virava um traço branco solto no meio da tela. */}
        <Figure role="hero" value={days ?? 0} unit="de 7" label="Dias por semana" />
        <Txt role="body" tone="muted" style={styles.line}>
          {line}
        </Txt>
      </View>
    </View>
  );
}

export function Compromisso({ token, studio, onDone }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const [days, setDays] = useState<Days | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(false);

  // A causa do número vive NA tela: o critério é o menor ato, e a ambição não é meta.
  const line =
    days === null
      ? "Escolhe o piso: o menor número que você cumpre até na semana ruim."
      : `Semana boa você passa disso. O combinado continua ${days}.`;

  async function send() {
    if (days === null || busy) return;
    setBusy(true);
    setError("");
    try {
      await putCommitment(token, days);
      setReceipt(true);
    } catch {
      setError("Não deu para enviar. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  }

  if (receipt) {
    return (
      <Phone>
        <Head kicker="Combinado" title={`${studio.name} já sabe.`} accent={accent} />
        <Piso days={days} line={line} final />
        <DockFooter>
          <AccentCTA label="Seguir" onPress={onDone} accent={accent} />
        </DockFooter>
      </Phone>
    );
  }

  return (
    <Phone>
      <Head kicker="1 pergunta" title="Quantos dias na semana ruim?" accent={accent} />
      <Band>
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

      <Piso days={days} line={line} />

      <Band raised rule="none">
        <View style={styles.witness}>
          <Initials name={studio.name} size={34} />
          <View style={styles.witnessCopy}>
            <Txt role="label">Quem vai saber</Txt>
            <Txt role="title" numberOfLines={1}>
              {studio.name}
            </Txt>
          </View>
        </View>
        <Txt role="body" tone="muted" style={styles.line}>
          Quem fala com você é gente, não o app.
        </Txt>
      </Band>

      <DockFooter>
        {/* ponytail: aviso em tinta comum. Este app não tem vermelho de erro para o aluno,
            e um matiz de falha aqui brigaria com o acento do personal. */}
        {error ? (
          <Txt role="note" tone="ink" style={styles.error}>
            {error}
          </Txt>
        ) : null}
        <AccentCTA
          label="Combinado"
          onPress={() => void send()}
          disabled={days === null}
          busy={busy}
          accent={accent}
        />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  days: { flexDirection: "row", gap: 8 },
  hero: {
    flex: 1,
    paddingHorizontal: T.pad,
    paddingVertical: 24,
    gap: 26,
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  heroFinal: { justifyContent: "flex-end", borderBottomWidth: 0 },
  legend: { flexDirection: "row", justifyContent: "space-between" },
  week: { flexDirection: "row", gap: 6, marginTop: 10 },
  bar: { flex: 1, height: 64 },
  line: { marginTop: 14 },
  witness: { flexDirection: "row", alignItems: "center", gap: 12 },
  witnessCopy: { flex: 1, minWidth: 0 },
  error: { marginBottom: 10 },
});
