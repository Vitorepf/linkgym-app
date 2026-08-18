import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  completeComeback,
  records,
  today,
  type Person,
  type RecordItem,
  type Studio,
  type TodayPayload,
} from "../../api";
import { studentHomeTarget, STUDENT_HOME_ROUTE } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { createSession, newClientId } from "../../offline/sessionQueue";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { dateShort, formatKg, formatXp } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
  comeback: NonNullable<TodayPayload["comeback"]>;
};

/** A Retomada é CARTÃO, não porta trancada. A referência do eixo 3 mede o formato: faixa
 *  no topo, X para fechar, e o caminho continua rolável e clicável ATRÁS — o app não fica
 *  refém do sumiço. O CONTEXT.md diz a outra metade: Retomada não apaga PR, carga nem
 *  histórico. As duas juntas dão esta tela: o aviso ocupa uma faixa, e o resto do vidro é
 *  o acervo do corpo, com número, comparação e data.
 *
 *  A tela ANTERIOR era o contrário: `18 minutos.` como título, uma frase, dois botões
 *  colados no rodapé e DOIS TERÇOS de preto vazio no meio. Nada atrás, nada para rolar,
 *  nada para conferir — e o aluno sem saída a não ser aceitar ou recusar.
 *
 *  O fato — a Ofensiva zerou — é dito UMA vez, no número, em corpo de métrica, ao lado do
 *  XP que continua inteiro. Não existe contagem de dias perdidos em corpo grande, não
 *  existe a palavra culpa, não existe tinta de erro: falha é AUSÊNCIA de marca. */
export function Retomada({ token, studio, needsCommitment, comeback }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Retomada">>();
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [acervo, setAcervo] = useState<RecordItem[]>([]);
  const [streak, setStreak] = useState<number | null>(null);
  const [xp, setXp] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const [rec, payload] = await Promise.all([records(token), today(token)]);
        if (!alive) return;
        setAcervo(rec.items);
        setStreak(payload.streak.current_count);
        setXp(payload.xp_total);
      } catch {
        /* sem acervo: nada abaixo da faixa é desenhado. Nenhum placeholder inventado. */
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  async function startNow() {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await completeComeback(token, comeback.id);
      const payload = await today(token);
      const prescription = payload.prescription;
      if (!prescription) {
        navigation.reset({ index: 0, routes: [studentHomeTarget] });
        return;
      }
      const session = await createSession(prescription.id, newClientId());
      navigation.reset({
        index: 1,
        routes: [
          studentHomeTarget,
          {
            name: "Serie",
            params: {
              token,
              studioName: studio.name,
              accent,
              clientId: session.client_id,
              prescriptionId: prescription.id,
              items: prescription.items,
              itemIndex: 0,
              setIndex: 1,
              streakCount: payload.streak.current_count,
              xpTotal: payload.xp_total,
              needsCommitment,
            },
          },
        ],
      });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  // O herói é a carga mais pesada do acervo, não a primeira da lista: com a ordem do
  // servidor um 127,5 podia cair embaixo de um 62,5 em corpo hero.
  const hero = acervo.reduce<RecordItem | null>(
    (best, r) => (!best || r.load_kg > best.load_kg ? r : best),
    null,
  );
  const first = hero ? oldest(hero) : null;
  const past = ledger(acervo, hero);

  function openPR(r: RecordItem) {
    navigation.navigate("Recorde", {
      accent,
      needsCommitment,
      records: [
        {
          exercise_name: r.exercise_name,
          load_kg: r.load_kg,
          previous_kg: oldest(r)?.load_kg ?? 0,
        },
      ],
    });
  }

  return (
    <Phone>
      {/* A FAIXA. Desenho + uma linha + um botão, e o X. Nada mais entra aqui. */}
      <Band accentTop accent={accent}>
        <View style={styles.row}>
          {/* ponytail: o desenho é a marca do personal, que já existe. Um mascote novo
              seria arte nova para dizer o que estas duas letras já dizem. */}
          <Initials name={studio.name} size={44} />
          <View style={styles.grow}>
            <Txt role="label" color={A.text}>
              Retomada
            </Txt>
            <Txt role="body">{studio.name}</Txt>
          </View>
          <Pressable
            onPress={() => navigation.navigate(STUDENT_HOME_ROUTE)}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Fechar o aviso"
          >
            <IconClose color={T.muted} />
          </Pressable>
        </View>

        <Txt role="body" style={styles.line}>
          {comeback.coach_line}
        </Txt>

        <View style={styles.cta}>
          <AccentCTA
            label="Fazer agora"
            meta={`${comeback.minutes} MIN`}
            onPress={() => void startNow()}
            busy={busy}
            accent={accent}
          />
        </View>

        {failed ? (
          <Txt role="note" tone="dim" style={styles.failed}>
            Não subiu agora. Tente de novo.
          </Txt>
        ) : null}
      </Band>

      {/* ATRÁS DO AVISO: o acervo, rolável e clicável. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {hero ? (
          <Band rule="none">
            <Txt role="label" tone="dim">
              Sua carga mais pesada
            </Txt>
            <Txt role="title" style={styles.name}>
              {hero.exercise_name}
            </Txt>
            {/* ponytail: `src/ui/Baseline.tsx` não serve aqui, e não é esquecimento — o
                eixo dela é min..max e a carga de partida fica a 86% do PR, onde a âncora
                nasce fora da faixa (o teto que o próprio arquivo declara). A comparação
                vira o rótulo sob o número, com o número dito. */}
            <View style={styles.figure}>
              <Figure
                role="hero"
                value={formatKg(hero.load_kg)}
                unit="kg"
                dir={first ? "up" : undefined}
                labelBelow
                label={
                  first
                    ? `Começou em ${formatKg(first.load_kg)} kg · ${dateShort(new Date(first.achieved_at))}`
                    : `${hero.reps} repetições`
                }
                note={`${hero.reps} reps · ${dateShort(new Date(hero.achieved_at))}`}
              />
            </View>
          </Band>
        ) : null}

        {/* O fato, dito UMA vez e no número — e do lado dele o que não foi embora. */}
        {streak !== null && xp !== null ? (
          <MetricGrid
            cells={[
              { label: "Ofensiva", value: streak, note: "recomeça na próxima" },
              { label: "XP", value: formatXp(xp), note: "continua seu" },
            ]}
          />
        ) : null}

        {/* Utilizável, não só visível: cada linha abre o PR daquele exercício. É a linha
            que é clicável, e não um botão a mais — navegação é linha, escolha é cartão. */}
        {past.length ? (
          <Band rule="none">
            <Txt role="label">Histórico de carga ({past.length})</Txt>
            {past.map((e) => (
              <Pressable
                key={`${e.name}-${e.at}`}
                onPress={() => openPR(e.of)}
                accessibilityRole="button"
                style={styles.entry}
              >
                <View style={styles.grow}>
                  <Txt role="body" numberOfLines={1}>
                    {e.name}
                  </Txt>
                </View>
                <Txt role="note" tone="dim">
                  {dateShort(new Date(e.at))}
                </Txt>
                <Txt role="body" style={styles.kg}>
                  {formatKg(e.kg)} kg
                </Txt>
              </Pressable>
            ))}
          </Band>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

/** A entrada mais antiga do exercício: é contra ela que a carga de hoje é comparada. */
function oldest(r: RecordItem): RecordItem["history"][number] | null {
  return r.history.reduce<RecordItem["history"][number] | null>(
    (old, h) => (!old || h.achieved_at < old.achieved_at ? h : old),
    null,
  );
}

type Entry = { name: string; kg: number; at: string; of: RecordItem };

/** Toda carga registrada, do mais novo para o mais velho, menos a que já está no herói.
 *  É esta lista que prova a linha do personal: o acervo não foi embora.
 *
 *  ponytail: dedupe O(n²) com findIndex. Teto conhecido: um acervo de centenas de PRs
 *  começa a custar. Upgrade quando incomodar: Set de chave `nome|data`. */
function ledger(items: RecordItem[], hero: RecordItem | null): Entry[] {
  return items
    .flatMap((r) =>
      [...r.history, { load_kg: r.load_kg, achieved_at: r.achieved_at }].map(
        (h) => ({
          name: r.exercise_name,
          kg: h.load_kg,
          at: h.achieved_at,
          of: r,
        }),
      ),
    )
    .filter(
      (e, i, all) =>
        all.findIndex((o) => o.name === e.name && o.at === e.at) === i &&
        !(hero && e.name === hero.exercise_name && e.at === hero.achieved_at),
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);
}

function IconClose({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5l14 14M19 5 5 19"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="square"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  grow: { flex: 1, minWidth: 0 },
  line: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  cta: { marginTop: 16 },
  failed: { marginTop: 10 },
  name: { marginTop: 4 },
  figure: { marginTop: 10 },
  entry: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
  kg: { minWidth: 78, textAlign: "right" },
});
