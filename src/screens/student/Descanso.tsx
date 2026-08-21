import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { resultadoDaSessao } from "../../api";
import {
  flush,
  loadSession,
  markFinished,
  nextAfter,
  patchLastSetEffort,
  sessionProof,
} from "../../offline/sessionQueue";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { neutroSobre } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Choice } from "../../ui/Choice";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { useTone } from "../../ui/motion";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Troca } from "../../ui/Troca";
import { Txt } from "../../ui/Txt";

type Effort = 1 | 2 | 3;

type Props = NativeStackScreenProps<RootStackParamList, "Descanso">;

const WORDS: { effort: Effort; label: string }[] = [
  { effort: 1, label: "Fácil" },
  { effort: 2, label: "No ponto" },
  { effort: 3, label: "Difícil" },
];

export function Descanso({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { T, FORMA, acento } = useTema();
  const {
    token,
    timeName,
    localId,
    items,
    itemIndex,
    setIndex,
    restSeconds,
    last,
    ofensivaCount,
    xpTotal,
  } = route.params;
  const A = acento();
  const item = items[itemIndex];
  const [left, setLeft] = useState(restSeconds);
  const [effort, setEffort] = useState<Effort | 0>(0);
  const [busy, setBusy] = useState(false);

  // O QUE O CORPO FEZ, e não o que a ficha pediu.
  //
  // Este cabeçalho imprimia `item.load_kg × item.planned_reps` — a PRESCRIÇÃO. Quem
  // acabava de levantar 65 lia "60 kg × 8" no segundo seguinte ao esforço: o único momento
  // em que o app fala sobre o ato que acabou de acontecer, e ele falava do plano.
  //
  // A fonte é a série GRAVADA, não o estado da tela anterior: se a escrita não aconteceu,
  // nada é afirmado. Vem de disco porque é onde a verdade da sessão mora (o app é
  // offline-first) e porque assim nenhuma rota precisa carregar carga em parâmetro.
  const [feito, setFeito] = useState<{ load: number; reps: number } | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await loadSession(localId);
      const s = stored?.sets.find(
        (x) => x.prescription_item_id === item?.id && x.set_index === setIndex,
      );
      if (alive && s) setFeito({ load: s.load_kg, reps: s.reps });
    })();
    return () => {
      alive = false;
    };
  }, [item, localId, setIndex]);

  // A REFERÊNCIA DO CORPO. `last_kg` é a série EXECUTADA da última vez naquele exercício
  // (internal/today/service.go), e NÃO o recorde — por isso a linha diz "última vez" e
  // nunca "recorde". Recorde é personal_records, e quem fala dele é a tela Recorde.
  const ultima = item?.last_kg ?? null;
  const subiu =
    ultima !== null && feito !== null && feito.load > ultima
      ? Math.round((feito.load - ultima) * 10) / 10
      : null;

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // A régua enche na UI thread: um withTiming linear do descanso inteiro, não um
  // re-render por segundo. O número é que precisa do React; a barra não.
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (restSeconds <= 0) p.value = 1;
    else if (!reduce)
      p.value = withTiming(1, { duration: restSeconds * 1000, easing: Easing.linear });
  }, [p, reduce, restSeconds]);
  useEffect(() => {
    // sem movimento, a régua anda em degraus de um segundo — o mesmo relógio do número.
    if (reduce && restSeconds > 0) p.value = (restSeconds - left) / restSeconds;
  }, [left, p, reduce, restSeconds]);
  const grow = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  // A recompensa acontece na peça que já estava na tela: a mesma régua muda de tom
  // quando o descanso fecha. Nada de overlay, nada muda de lugar.
  const done = useTone(left === 0, T.muted, A.mark);

  const nxt = nextAfter(items, itemIndex, setIndex);
  const ending = last || nxt === "done";

  // A PALAVRA DE ESFORÇO É POR EXERCÍCIO, NÃO POR SÉRIE.
  //
  // Ela travava as duas saídas daqui em `disabled={!effort}`, então cada série custava um
  // toque a mais: 18 séries num treino viravam 18 toques só para responder três palavras
  // repetidas. Um crítico cego mediu o ciclo em regime e deu 3 toques por série onde o
  // brief pede que um toque feche — e o medidor antigo nem via, porque parava no descanso.
  //
  // O sinal não some: `last_effort` é o que sustenta "Última sessão difícil" na Atenção do
  // dia do personal. Por exercício ele é mais informativo que por série, e custa 6 toques
  // num treino de 6 exercícios em vez de 18. Entre séries do mesmo exercício o descanso
  // volta a ser só descanso.
  const fechaExercicio =
    ending || (typeof nxt !== "string" && nxt.itemIndex !== itemIndex);

  async function pick(n: Effort) {
    setEffort(n);
    await patchLastSetEffort(localId, n);
  }

  async function goFinish() {
    // Fechar a SESSÃO sempre pede a palavra: é o esforço da sessão que sobe em
    // markFinished, e ele é 1|2|3 por tipo. Quem relaxou foi só o avanço entre séries do
    // mesmo exercício. O botão abaixo carrega o mesmo guarda — botão clicável e inerte foi
    // exatamente o defeito que apareceu quando mexi só no `disabled`.
    if (!effort || busy) return;
    setBusy(true);
    try {
      // A prova sai da sessão local AGORA: `flush` termina em `dropSession`, e depois
      // dele não há mais série, carga nem horário para ler.
      const proof = sessionProof(await markFinished(localId, effort));
      const result = await flush(token, localId);
      const finish = result.ok ? result.finish : undefined;
      const pending = !result.ok;
      const resultado = resultadoDaSessao(finish, pending, {
        ofensiva: ofensivaCount,
        xpTotal,
      });
      navigation.reset({
        index: 1,
        routes: [
          studentHomeTarget,
          {
            name: "Feito",
            params: {
              timeName,
              ofensivaCount: resultado.ofensivaCount,
              xpGained: resultado.xpGained,
              xpTotal: resultado.xpTotal,
              records: resultado.records,
              proof,
              pending,
              needsCommitment: route.params.needsCommitment,
            },
          },
        ],
      });
    } finally {
      setBusy(false);
    }
  }

  async function goNext() {
    if ((fechaExercicio && !effort) || busy) return;
    if (nxt === "done") {
      await goFinish();
      return;
    }
    // popTo pelo mesmo motivo da Série: a rota de volta é a que já existe, e quando não
    // existe ela TROCA esta. A tela é remontada com key nova, então carga, repetição e
    // relógio nascem do zero como nasciam antes.
    navigation.popTo("Serie", {
      ...route.params,
      itemIndex: nxt.itemIndex,
      setIndex: nxt.setIndex,
    });
  }

  const nextLabel =
    nxt === "done"
      ? undefined
      : nxt.setIndex > 1
        ? `Série ${nxt.setIndex}`
        : (items[nxt.itemIndex]?.name ?? "Próxima");

  return (
    <Phone>
      <Head
        kicker={
          item
            ? `${item.name} · série ${setIndex} de ${item.planned_sets}`
            : `Série ${setIndex}`
        }
        kickerMuted
        title={feito ? `${formatKg(feito.load)} kg × ${feito.reps}` : "Série feita"}
      >
        {/* O RECONHECIMENTO NO INSTANTE EM QUE ACONTECE — e no slot que já existia.
            A linha da última vez é PERMANENTE (é a coluna `Previous` do Hevy: o passado
            fica no mesmo pixel onde o presente é escrito), então ela ocupa o lugar desde o
            primeiro quadro e nada salta quando a troca chega. Quando a carga gravada supera
            a última vez, o número velho É SUBSTITUÍDO pelo ganho — sem modal, sem toque,
            sem atrasar o descanso, que já está correndo atrás. */}
        {ultima === null ? null : (
          <View style={styles.marca}>
            <Troca
              antes={
                <Txt role="label" tone="dim">
                  Última vez · {formatKg(ultima)} kg
                </Txt>
              }
              depois={
                subiu === null ? null : (
                  <Txt role="label" color={A.text}>
                    Você subiu {formatKg(subiu)} kg
                  </Txt>
                )
              }
            />
          </View>
        )}
      </Head>

      {/* O relógio e a palavra são DUAS superfícies que crescem: a sobra da tela se divide
          entre elas em vez de virar dois buracos de 220pt no chão nu, um acima e um abaixo
          do número. Quando a série não fecha exercício, a palavra não existe e o relógio
          fica com a folga inteira — ainda dele, ainda com dono. */}
      <Band raised grow rule="none">
        <View
          accessible
          accessibilityLabel={
            left === 0 ? "descanso fechado" : `${left} segundos de descanso`
          }
        >
          <Figure role="mega" label="Descanso" value={left} unit="s" />
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, grow, done]} />
        </View>
      </Band>

      {/* A NOTA EM SUPERFÍCIE PRÓPRIA, e ela também cresce. Enquanto morava dentro da
          superfície do relógio, a série que NÃO fecha exercício tinha uma superfície só
          para dividir a sobra — e a divisão de um vazio por um dá o vazio inteiro: 208pt
          acima do número e 206 abaixo da nota, a segunda pior razão de ritmo do app (13,0
          contra a mediana de 2,4). Com duas, cada vão cai pela metade e a nota continua
          colada no número que ela explica, com o fio da superfície entre os dois. */}
      <Band raised grow rule="none">
        <Txt role="note" tone="dim">
          {left === 0
            ? "Descanso fechado. Marca como foi e segue."
            : `O ${timeName} pediu ${restSeconds}s entre as séries deste exercício.`}
        </Txt>
      </Band>

      {fechaExercicio ? (
      <Band raised grow rule="none">
        <Txt role="label">Como foi esse exercício?</Txt>
        <View style={styles.words}>
          {WORDS.map((w) => (
            <Choice
              key={w.effort}
              label={w.label}
              selected={effort === w.effort}
              flex
              onPress={() => void pick(w.effort)}
            />
          ))}
        </View>
        {/* QUEM RECEBE, dito antes de o aluno gastar o toque. A palavra de esforço viaja
            para a tela de trabalho de uma pessoa (`ReturnItem.Effort`, internal/owner/
            service.go:120) e é dela que sai o ajuste de carga da próxima ficha. O app sabia
            disso e não contava: o aluno tocava achando que alimentava um banco de dados. */}
        <Txt role="note" tone="dim" style={styles.note}>
          {effort
            ? noteFor(effort, timeName)
            : `Um toque. O ${timeName} lê isso antes de montar a próxima.`}
        </Txt>
      </Band>
      ) : null}

      <DockFooter>
        <View style={styles.dock}>
          <AccentCTA
            label={
              ending
                ? "Terminar sessão"
                : left === 0
                  ? "Próxima série"
                  : "Pular descanso"
            }
            onPress={() => {
              void goNext();
            }}
            meta={ending ? undefined : nextLabel}
            disabled={fechaExercicio && !effort}
            busy={busy}
          />
          {ending ? null : (
            <GhostCTA
              fundo={FORMA.folha.chrome.composto}
              label="Terminar por aqui"
              onPress={() => {
                void goFinish();
              }}
              // A MESMA GUARDA DO BOTÃO PRINCIPAL, e não `!effort`. A palavra do esforço só
              // é PEDIDA quando o exercício fecha — entre séries do mesmo exercício as
              // fichas nem aparecem na tela. Com `!effort` este botão ficava desligado para
              // sempre nesse estado: quem precisava parar na segunda de três séries via um
              // retângulo morto e nenhum controle na tela capaz de acordá-lo.
              disabled={(fechaExercicio && !effort) || busy}
            />
          )}
        </View>
      </DockFooter>
    </Phone>
  );
}

function noteFor(effort: Effort, timeName: string): string {
  if (effort === 1) return `Sobrou tanque. O ${timeName} sobe a carga na próxima.`;
  if (effort === 2) return "Era essa a série.";
  return `O ${timeName} vê e não empurra amanhã.`;
}

const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    // A calha pousa DENTRO da Band levantada, e `T.fill` é um degrau contado a partir do
    // CHÃO: ali ele separava 8,3 de L* em vez dos 14,9 que entrega no chão — meia calha.
    // `veuComposto` é o fundo real da superfície nas quatro famílias, inclusive `contorno`
    // (onde ele É o chão, e o neutro volta a ser exatamente `T.fill`).
    track: {
      height: 10,
      backgroundColor: neutroSobre(FORMA.veuComposto, T),
      marginTop: SPACE.step,
    },
    fill: { height: 10 },
    // O mesmo degrau que o `title` do Head já paga acima dele: a marca é irmã do título,
    // não um bloco novo.
    marca: { marginTop: SPACE.hair },
    note: { marginTop: SPACE.step },
    words: { flexDirection: "row", gap: SPACE.hair, marginTop: SPACE.tight },
    dock: { gap: SPACE.tight },
  }),
);
