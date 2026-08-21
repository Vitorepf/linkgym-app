import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  defaultReps,
  enqueueSet,
  flush,
  lastLoadForItem,
  loadSession,
  newLocalId,
  nextAfter,
  stepKg,
  type LocalSession,
} from "../../offline/sessionQueue";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { HoldTick } from "../../ui/HoldTick";
import { IconPlay } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Serie">;


export function Serie({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { T, acento } = useTema();
  const {
    token,
    timeName,
    localId,
    items,
    itemIndex,
    setIndex,
  } = route.params;
  // passo do ajuste de carga: config do Time (2,5 é o padrão de fábrica).
  const passo = route.params.passoKg ?? 2.5;
  const A = acento(undefined, T.raised);
  const item = items[itemIndex];
  const [load, setLoad] = useState(item?.load_kg ?? 0);
  // REPETIÇÃO É EDITÁVEL, e isto era um defeito de verdade: era `const`, e esse mesmo
  // valor descia no enqueueSet. Quem falhava a última repetição gravava o que a ficha
  // pediu, não o que o corpo fez — o app registrava a intenção do personal como se fosse
  // execução da pessoa. Um crítico cego achou comparando com a barra: em hevy-11 a coluna
  // REPS é campo por linha (8, 8, 6 sobre Previous diferentes) e em strong-01 a linha
  // pendente traz 85 e 8 em caixas separadas.
  //
  // O padrão continua sendo o prescrito: quem manda na repetição é a Prescrição, e o dedo
  // corrige quando o corpo discorda. Mesmo passo fixo do peso, e o teclado segue fechado.
  const [reps, setReps] = useState(item ? defaultReps(item.planned_reps) : 10);
  const [session, setSession] = useState<LocalSession | null>(null);
  const loadSV = useSharedValue(load);
  const startLoad = useSharedValue(load);
  useEffect(() => {
    loadSV.value = load;
  }, [load, loadSV]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          startLoad.value = loadSV.value;
        })
        .onUpdate((e) => {
          const steps = Math.round(-e.translationY / 28);
          const next = Math.max(
            0,
            Math.round((startLoad.value + steps * passo) * 2) / 2,
          );
          runOnJS(setLoad)(next);
        }),
    [loadSV, startLoad],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await loadSession(localId);
      if (!alive) return;
      setSession(stored);
      if (item) {
        setLoad(lastLoadForItem(stored, item.id, item.load_kg));
      }
    })();
    return () => {
      alive = false;
    };
  }, [localId, item]);

  const rest = item?.rest_seconds ?? 90;
  const last = nextAfter(items, itemIndex, setIndex) === "done";
  const kg = formatKg(load);
  const [busy, setBusy] = useState(false);

  async function onDone() {
    if (busy || !item) return;
    setBusy(true);
    try {
      const stored = await loadSession(localId);
      const existing = stored?.sets.find(
        (s) => s.prescription_item_id === item.id && s.set_index === setIndex,
      );
      await enqueueSet(localId, {
        local_id: existing?.local_id ?? newLocalId(),
        prescription_item_id: item.id,
        exercise_id: item.exercise_id,
        set_index: setIndex,
        reps,
        load_kg: load,
        rest_seconds: rest,
        performed_at: existing?.performed_at ?? new Date().toISOString(),
      });
      flush(token, localId).catch(() => undefined);
      // popTo, não navigate: o NAVIGATE do StackRouter só reaproveita a rota quando ela é
      // o TOPO, e o Descanso nunca é — então cada série empilhava mais uma tela, cada uma
      // segurando `items` inteiro em params (20 séries = 41 telas montadas; tools/pilha.mjs
      // mede). O popTo volta para a rota existente ou, quando ela não está na pilha, TROCA
      // a de agora por ela: a sessão fica em duas telas, Hoje + a de agora, e voltar sai
      // para a Hoje em vez de andar o treino para trás série por série.
      navigation.popTo("Descanso", {
        ...route.params,
        restSeconds: rest,
        last,
      });
    } finally {
      setBusy(false);
    }
  }

  if (!item) {
    // ARMADILHA, e das piores: esta tela roda com `headerShown: false` e
    // `gestureEnabled: false` (nav/Root.tsx), então sem um botão aqui o único jeito de sair
    // é matar o app — no meio de uma sessão, com treino guardado no celular esperando
    // subir. Acontece de verdade: o cursor de uma sessão retomada sobrevive a uma ficha
    // republicada, e a série que ele aponta some.
    //
    // E a frase mudou junto. "Esta série não está na ficha" descreve o banco; quem está
    // com o celular na mão no meio do treino precisa saber que não é culpa dela e o que
    // fazer agora.
    return (
      <Phone>
        <Head title="Essa série saiu da ficha" body={`O ${timeName} publicou uma nova.`} />
        <View style={styles.vazio} />
        <DockFooter>
          <AccentCTA label="Voltar para o Hoje" onPress={() => navigation.popToTop()} />
        </DockFooter>
      </Phone>
    );
  }

  const sets = item.planned_sets;
  const doneSets = session?.sets.filter((s) => s.prescription_item_id === item.id) ?? [];
  // A baseline desta tela é REAL e vive na prescrição: a carga que o personal pediu.
  // A direção sai da FORMA (TrendMark), nunca de matiz.
  // Sem diferença não há direção, e marca sem informação é sujeira: nada é desenhado.
  const asked = item.load_kg;
  // A referência do CORPO, separada da referência do personal. São duas coisas e a tela
  // dizia só uma: `asked` é o que pediram, `feito` é o que ele levantou. A barra do eixo 3
  // mantém as duas visíveis ao mesmo tempo — no Hevy a coluna PREVIOUS convive com o campo
  // KG, e é por isso que a linha confirmada pode ter PREVIOUS 62 e ter ido para 65
  // (docs/barra/eixo3-ritual-aluno/hevy-11-ipad-tabela-serie-completa-com-aquecimento.png).
  //
  // Sem número, nada é desenhado. Primeira vez naquele exercício não ganha placeholder.
  const feito =
    item.last_kg == null
      ? null
      : `${formatKg(item.last_kg)} kg${item.last_reps == null ? "" : ` × ${item.last_reps}`}`;

  // UMA linha de referência por vez. As duas empilhadas empatavam a hierarquia, e o
  // "pediu" ainda repetia o herói: com o dedo parado, a nota dizia 127,5 debaixo de um
  // 127,5 em corpo mega. Nota que ecoa o número não informa nada.
  //
  // A referência permanente é a do CORPO, que é a que o Hevy mantém sempre visível. A do
  // personal só aparece quando o dedo saiu do que foi pedido — aí ela vira notícia, e a
  // seta ao lado do herói já disse a direção.
  const pedido = `${timeName} pediu ${formatKg(asked)} kg`;
  const desviou = load !== asked;
  const dir = load > asked ? "up" : load < asked ? "down" : undefined;

  return (
    <Phone>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Txt role="label">
            Exercício {itemIndex + 1} de {items.length}
          </Txt>
          <Txt role="label">
            Série {setIndex} de {sets}
          </Txt>
        </View>
        <View style={styles.ticks}>
          {Array.from({ length: sets }, (_, i) => {
            const n = i + 1;
            // A série de agora é mais ALTA, não só de outra cor: no time 13 o acento
            // encosta no traço neutro, e a forma continua dizendo onde o aluno está.
            return (
              <View
                key={n}
                style={[
                  styles.tick,
                  n === setIndex && styles.tickNow,
                  {
                    backgroundColor:
                      n < setIndex ? T.ink : n === setIndex ? A.mark : T.divider,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.ex}>
        <Txt role="title" numberOfLines={1}>
          {item.name}
        </Txt>
        <Txt role="body" style={styles.rhythm}>
          {sets}
          <Txt role="body" tone="muted">
            {"  "}séries ·{"  "}
          </Txt>
          {item.planned_reps}
          <Txt role="body" tone="muted">
            {"  "}reps
          </Txt>
        </Txt>
        <Pressable
          onPress={() =>
            navigation.navigate("ComoFazer", {
              item,
              items,
              timeName,
              token,
              prescriptionId: route.params.prescriptionId,
            })
          }
          style={styles.how}
          hitSlop={12}
        >
          <IconPlay color={A.mark} />
          <Txt role="label" color={A.text}>
            Ver como fazer
          </Txt>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <View
          style={styles.loadBlock}
          accessibilityLabel={`${kg} quilogramas por ${reps} repetições. Arrasta para mudar a carga.`}
        >
          <Figure
            role="mega"
            value={kg}
            unit="kg"
            label="Carga"
            dir={dir}
            note={feito ? `Última vez · ${feito}` : pedido}
          />
          {feito && desviou ? (
            <Txt role="label" tone="dim" style={styles.feito}>
              {pedido}
            </Txt>
          ) : null}
          <View style={styles.stepRow}>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setLoad((n) => stepKg(n, -passo))}
                label={`− ${formatKg(passo)} kg`}
                hint={`Menos ${formatKg(passo)} kg`}
              />
            </View>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setLoad((n) => stepKg(n, passo))}
                label={`+ ${formatKg(passo)} kg`}
                hint={`Mais ${formatKg(passo)}`}
              />
            </View>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setReps((n) => Math.max(1, n - 1))}
                label="− 1 rep"
                hint="Uma repetição a menos"
              />
            </View>
            <View style={styles.step}>
              <HoldTick
                onTick={() => setReps((n) => n + 1)}
                label="+ 1 rep"
                hint="Uma repetição a mais"
              />
            </View>
          </View>
        </View>
      </GestureDetector>

      {/* ponytail: contentContainer com flexGrow + linhas flex — as séries ESTICAM para
          ocupar o terço de baixo em vez de deixar um vazio que não separa nada, e a
          rolagem só entra quando não cabem. Teto: acima de ~7 séries a lista rola. */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listBody}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: sets }, (_, i) => {
          const n = i + 1;
          const logged = doneSets.find((s) => s.set_index === n);
          const current = n === setIndex;
          const done = n < setIndex || Boolean(logged);
          return (
            <View
              key={n}
              style={[
                styles.setRow,
                current && { backgroundColor: T.raised, borderLeftColor: A.mark },
              ]}
            >
              <Txt role="value" tone={done || current ? "ink" : "dim"}>
                {n}
              </Txt>
              {/* Série que ainda não aconteceu é AUSÊNCIA de marca — não marca de falha. */}
              {logged ? (
                <Txt role="body" tone="muted">
                  {formatKg(logged.load_kg)} kg × {logged.reps}
                </Txt>
              ) : current ? (
                <Txt role="body">
                  {kg} kg × {reps}
                </Txt>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      {item.notes ? (
        <Band raised rule="none">
          <Txt role="label">{timeName} disse</Txt>
          <Txt role="body" style={styles.note}>
            {item.notes}
          </Txt>
        </Band>
      ) : null}

      <DockFooter>
        <View style={styles.dockRow}>
          <GhostCTA
            label="Ficha"
            onPress={() =>
              navigation.navigate("Ficha", {
                token,
                timeName,
                items,
                prescriptionId: route.params.prescriptionId,
              })
            }
          />
          <View style={styles.dockCta}>
            <AccentCTA
              label="Fiz essa série"
              meta={`${rest} S`}
              onPress={() => {
                void onDone();
              }}
              check
            />
          </View>
        </View>
      </DockFooter>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    feito: { marginTop: SPACE.hair },
    vazio: { flex: 1 },
    top: {
      paddingHorizontal: T.pad,
      paddingTop: 8,
      paddingBottom: 12,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    ticks: { flexDirection: "row", gap: SPACE.hair, marginTop: 12, alignItems: "flex-end" },
    tick: { flex: 1, height: 4 },
    tickNow: { height: 10 },
    ex: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.tight,
      paddingBottom: 18,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    rhythm: { marginTop: SPACE.hair },
    how: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingTop: 12,
    },
    loadBlock: {
      paddingHorizontal: T.pad,
      paddingTop: 18,
      paddingBottom: 18,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    stepRow: { flexDirection: "row", gap: SPACE.tight, marginTop: 18 },
    // A moldura do HoldTick E a peca de acao: mesmo traco e mesmo canto do botao.
    step: {
      flex: 1,
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      borderRadius: FORMA.raioAcao,
    },
    list: { flex: 1 },
    listBody: { flexGrow: 1 },
    setRow: {
      flex: 1,
      minHeight: 62,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: T.pad,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
      // A serie de agora e ENFASE: um degrau acima do traco forte.
      borderLeftWidth: FORMA.borda + 1,
      borderLeftColor: "transparent",
    },
    note: { marginTop: SPACE.hair },
    dockRow: { flexDirection: "row", gap: SPACE.tight, alignItems: "stretch" },
    dockCta: { flex: 1 },
  }),
);
