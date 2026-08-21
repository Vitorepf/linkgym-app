import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  applyOwnerAttention,
  ownerHome,
  type OwnerHome,
  type Person,
  type Time,
} from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { Band, Head, neutroNaBand, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { weekdayLong, weekdayShort } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  time: Time;
};

type Row = OwnerHome["attention"][number];
type Day = OwnerHome["fio"]["week"][number];

/** A tela que o personal abre todo dia.
 *
 *  A referência do eixo 2 gasta o maior texto da tela numa saudação com o nome do
 *  PROFISSIONAL, põe dois atalhos comerciais acima do trabalho e dá a cada linha de aluno
 *  uma única ação: sair do app. A nota do eixo diz o remédio literalmente — a primeira
 *  coisa abaixo do nome do personal é a fila curta de quem precisa de um toque hoje, com
 *  a ação DENTRO da linha. É isso e nada além disso.
 *
 *  Saíram daqui: a saudação de 27px, o painel de três números soltos (ALUNOS/PENDÊNCIAS/
 *  RETORNOS — trivia sem baseline), a barra de progresso da semana acima do trabalho, e o
 *  atalho "Atenção do dia" que apontava para a fila que agora está NESTA tela.
 *
 *  Acento: UM só elemento pinta área com a cor da MARCA — o botão do primeiro da fila. Os
 *  outros dois são `quiet`. A semana não pode competir com a ação de hoje, e não compete:
 *  o dia de hoje continua em tinta neutra e quem ganhou matiz é a série de REFERÊNCIA (os
 *  outros dias), na segunda cor — subordinada por construção e nunca a da marca. */
export function Painel({ token, time }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const tema = useTema();
  const { T, acento, errorInk, secundaria } = tema;
  // A CALHA DA SEMANA pousa dentro da Band, e por isso o degrau dela é contado a partir do
  // fundo da Band e não do chão: `T.fill` é um degrau de `bg`, e dentro de uma Band
  // levantada ele valeria METADE (8,3 de L* em vez de 14,9). Hoje isto É `T.fill`.
  const calha = neutroNaBand(tema);
  // A SEGUNDA COR como SEGUNDA SÉRIE, o mesmo papel que ela tem na ui/Baseline. O fio da
  // semana diz duas coisas que a legenda ao lado já separa em palavras — "Feitos hoje" e
  // "nos outros dias da semana" —, e até aqui as duas eram o mesmo cinza em dois degraus.
  // Hoje é o DADO e fica na tinta neutra; os outros dias são a REFERÊNCIA e é ela que
  // ganha matiz. Não é "bom" nem "ruim": é "esta é a outra".
  // A cor da marca continua fora daqui: a massa dela é do botão da fila, e a semana não
  // pode competir com a ação de hoje. A segunda cor é subordinada por construção.
  // O fundo REAL desta peça é a calha, e não o chão: é dentro dela que a parte feita do
  // dia é pintada, então é contra ela que o piso tem de valer.
  const referencia = acento(secundaria, calha).mark;
  const navigation = useNavigation<OwnerTabNavigation>();
  const [data, setData] = useState<OwnerHome | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await ownerHome(token));
      setError("");
    } catch {
      setError("Não deu para abrir o dia.");
    }
  }, [token]);

  // Aplicar em Atenção do dia esvazia a fila daqui. Recarregar no foco em vez de no
  // monte é o que mantém as duas telas contando a mesma coisa.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function apply(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await applyOwnerAttention(token, id);
      await load();
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(null);
    }
  }

  // O rank é do domínio; a ordem da tela é a dele, não a ordem em que a API respondeu.
  const queue = data ? [...data.attention].sort((a, b) => a.rank - b.rank) : [];
  const fio = data ? readFio(data.fio.week) : null;

  return (
    <Phone>
      {/* Sem retrato e sem saudação: a referência gasta o maior texto da tela no nome
          do PROFISSIONAL, que é a única pessoa que já sabe quem é. Aqui o cabeçalho diz
          de quem é a casa e que dia é hoje, em uma linha. */}
      <Head kicker={`${time.name} · ${weekdayLong()}`} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="hair">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
            <View style={styles.retry}>
              <GhostCTA label="Tentar de novo" onPress={() => void load()} />
            </View>
          </Band>
        ) : null}

        {!data && !error ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Abrindo o dia…
            </Txt>
          </Band>
        ) : null}

        {fio ? (
          <Band pad={false}>
            <View style={styles.fio}>
              {/* Número e causa lado a lado: a barra do dia é a decomposição do número,
                  então ela não pode custar mais uma dobra de rolagem. */}
              <View style={styles.fioRow}>
                <Figure
                  value={fio.value}
                  unit={`de ${fio.total}`}
                  label={fio.label}
                  dir={fio.dir}
                />
                <View style={styles.week}>
                  {fio.days.map((d) => (
                    <View key={d.key} style={styles.day}>
                      <View
                        style={[
                          styles.bar,
                          { height: d.height, backgroundColor: calha },
                        ]}
                      >
                        <View
                          style={{
                            height: d.fill,
                            // Hoje contra o resto da semana em TRÊS canais, e nenhum
                            // sozinho: a letra embaixo (tinta cheia contra apagada), a
                            // posição na fila e o matiz. Em preto e branco a leitura
                            // fica inteira — o medidor exige 5 de L* entre os dois.
                            backgroundColor: d.today ? T.ink : referencia,
                          }}
                        />
                      </View>
                      <Txt
                        role="label"
                        tone={d.today ? "ink" : "dim"}
                        style={styles.dayName}
                      >
                        {d.letter}
                      </Txt>
                    </View>
                  ))}
                </View>
              </View>
              <Txt role="note" tone="dim" style={styles.fioNote}>
                {fio.note}
              </Txt>
            </View>
          </Band>
        ) : null}

        {data ? (
          <View style={styles.queueHead}>
            <Txt role="body">
              {queue.length === 0
                ? "Ninguém precisa de um toque"
                : `${queue.length} ${queue.length === 1 ? "precisa" : "precisam"} de um toque hoje`}
            </Txt>
            <View style={styles.queueSub}>
              {/* O número da turma era só texto, e a fila é curta de propósito: quem não
                  está sinalizado hoje não tinha porta nenhuma. Agora ele é a porta. */}
              <Pressable
                onPress={() => navigation.navigate("Alunos")}
                accessibilityRole="button"
                hitSlop={12}
                style={styles.queueLink}
              >
                <Txt role="note" tone="dim" style={styles.queueNote}>
                  {data.student_count} alunos com você
                </Txt>
                <IconChevron color={T.muted2} size={14} />
              </Pressable>
              {/* A mesma fila em modo foco, que conta quantas já saíram. Mora aqui, no
                  cabeçalho dela, e não numa linha solta no rodapé. */}
              <Pressable
                onPress={() =>
                  navigation.navigate("Atencao", {
                    token,
                    timeName: time.name,
                  })
                }
                accessibilityRole="button"
                hitSlop={12}
                style={styles.queueLink}
              >
                <Txt role="note" tone="dim">
                  Uma por uma
                </Txt>
                <IconChevron color={T.muted2} size={14} />
              </Pressable>
            </View>
          </View>
        ) : null}

        {data && queue.length === 0 ? (
          <Band>
            <Txt role="body" tone="muted">
              Ninguém sumiu, ninguém marcou dor, ninguém está sem ficha. Pode voltar
              para a aula.
            </Txt>
          </Band>
        ) : null}

        {queue.map((row, i) => (
          <View key={row.id} style={[styles.row, i === 0 && styles.rowFirst]}>
            <Pressable
              onPress={() =>
                navigation.navigate("Aluna", {
                  token,
                  personId: row.person_id,
                  timeName: time.name,
                })
              }
              accessibilityRole="button"
              style={styles.who}
            >
              {/* O MESMO PAPEL nas três: a fila é uma fila. O primeiro tinha `title` e
                  rosto de 44 contra `body` e 34 dos outros — numa voz de duas faces isso
                  deixa de ser ênfase e vira inconsistência, porque a urgência já está dita
                  duas vezes (o traço forte em cima da linha e o acento do CTA, que só o
                  primeiro carrega cheio). */}
              <Initials name={row.name} size={34} />
              <View style={styles.whoCopy}>
                <Txt role="body" numberOfLines={2}>
                  {row.name}
                </Txt>
                <Txt role="note" style={styles.why}>
                  {whyFor(row)}
                </Txt>
              </View>
              <IconChevron color={T.muted2} size={16} />
            </Pressable>
            {/* A ação É a decisão: nenhum rótulo genérico cobrindo uma frase repetida
                logo acima, e nenhum destino fora do app. */}
            <View style={styles.act}>
              <AccentCTA
                label={row.decision || "Aplicar a sugestão"}
                onPress={() => void apply(row.id)}
                busy={busy === row.id}
                disabled={busy !== null && busy !== row.id}
                check
                quiet={i !== 0}
              />
            </View>
          </View>
        ))}

        {data ? (
          <Pressable
            onPress={() =>
              navigation.navigate("Retorno", {
                token,
                timeName: time.name,
              })
            }
            accessibilityRole="button"
            style={styles.linkRow}
          >
            <Txt role="body" style={styles.linkLabel}>
              Retornos por ler
            </Txt>
            <Txt role="body" tone={data.unread_returns > 0 ? "ink" : "dim"}>
              {data.unread_returns}
            </Txt>
            <IconChevron color={T.muted2} size={16} />
          </Pressable>
        ) : null}

      </ScrollView>
    </Phone>
  );
}

/** O motivo em palavra de personal. A API manda o enum; o fixture do gate manda a prosa
 *  já pronta — o default deixa as duas passarem sem um segundo mapa. */
/** O motivo em portugues. EXPORTADA porque a Atencao renderizava `row.reason` cru: a API
 *  manda enum (student_stopped, pain_flag, debut, high_effort) e o personal lia
 *  "student_stopped" na tela. A fixture escondia o defeito por ja vir em prosa. */
export function whyFor(row: Row): string {
  switch (row.reason) {
    case "student_stopped": {
      const n = row.days ?? 0;
      return `${n} ${n === 1 ? "dia" : "dias"} sem treinar`;
    }
    case "pain_flag":
      return "Marcou dor";
    case "debut":
      return "Estreia sem ficha";
    case "high_effort":
      return "Última sessão difícil";
    default:
      return row.reason;
  }
}

const BAR = 46;

/** Prescrito × feito lido SÓ da série por dia: `fio.prescribed`/`fio.done` do topo são o
 *  dia de hoje na API e a semana no fixture, e somar a série concorda com os dois.
 *
 *  A direção compara hoje contra os outros dias da MESMA semana, e a legenda diz os dois
 *  números — a marca é conferível na tela, não é enfeite. Sem dia de hoje prescrito não
 *  há comparação, e aí não se desenha marca nenhuma. */
function readFio(week: Day[]) {
  const key = dayKey();
  const total = week.reduce(
    (a, d) => ({ p: a.p + d.prescribed, d: a.d + d.done }),
    { p: 0, d: 0 },
  );
  const today = week.find((d) => d.for_date === key);
  const rest = today
    ? { p: total.p - today.prescribed, d: total.d - today.done }
    : { p: 0, d: 0 };
  const max = Math.max(1, ...week.map((d) => d.prescribed));

  const days = week.map((d) => {
    const height = Math.round((d.prescribed / max) * BAR);
    return {
      key: d.for_date,
      letter: letterOf(d.for_date),
      today: d.for_date === key,
      height,
      fill: d.prescribed === 0 ? 0 : Math.round((d.done / d.prescribed) * height),
    };
  });

  if (today && today.prescribed > 0) {
    return {
      value: today.done,
      total: today.prescribed,
      label: "Feitos hoje",
      note:
        rest.p > 0
          ? `nos outros dias da semana, ${rest.d} de ${rest.p}`
          : `primeiro dia prescrito da semana`,
      dir:
        rest.p > 0
          ? dirOf(today.done / today.prescribed, rest.d / rest.p)
          : undefined,
      days,
    };
  }
  return {
    value: total.d,
    total: total.p,
    label: "Feitos nesta semana",
    note: "hoje não tem ninguém prescrito",
    dir: undefined,
    days,
  };
}

function dirOf(a: number, b: number): "up" | "down" | "flat" {
  const gap = a - b;
  return Math.abs(gap) < 0.05 ? "flat" : gap > 0 ? "up" : "down";
}

// ponytail: chave local à mão. `toISOString()` é UTC e viraria o dia às 21h de Brasília,
// que é exatamente a hora em que o personal ainda está dando aula.
function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${String(d.getDate()).padStart(2, "0")}`;
}

// D S T Q Q S S é o cabeçalho de calendário que o Brasil inteiro lê. Três letras não
// cabem na coluna e quebravam em "QU/A".
function letterOf(iso: string): string {
  return weekdayShort(new Date(`${iso}T00:00:00`)).slice(0, 1);
}

const usarEstilos = estilos(({ T }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    retry: { marginTop: 14, alignSelf: "flex-start" },
    queueHead: {
      paddingHorizontal: T.pad,
      paddingTop: 14,
      paddingBottom: 6,
    },
    queueSub: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 2,
    },
    queueNote: { flexShrink: 1 },
    queueLink: { flexDirection: "row", alignItems: "center", gap: 6 },
    row: {
      paddingHorizontal: T.pad,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
    },
    // O primeiro da fila é o único com traço forte em cima: rank por posição e por peso
    // de traço, nunca por matiz.
    rowFirst: { borderTopWidth: 2, borderTopColor: T.divider },
    who: { flexDirection: "row", alignItems: "center", gap: 12 },
    whoCopy: { flex: 1, minWidth: 0 },
    why: { marginTop: 2 },
    act: { marginTop: 10 },
    fio: { paddingHorizontal: T.pad, paddingVertical: 12 },
    fioRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 18,
    },
    fioNote: { marginTop: 10 },
    week: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 5,
      flex: 1,
      maxWidth: 230,
    },
    day: { flex: 1, alignItems: "stretch" },
    bar: { justifyContent: "flex-end" },
    dayName: { marginTop: 6, textAlign: "center", letterSpacing: 0.4 },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
    },
    linkLabel: { flex: 1 },
  }),
);
