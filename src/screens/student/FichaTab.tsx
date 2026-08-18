import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  today,
  type Person,
  type Time,
  type TodayItem,
  type TodayPayload,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { accentSet, productTheme as T } from "../../theme";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron } from "../../ui/Icons";
import { Band, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { Figure } from "../../ui/Figure";
import { dateShort, formatKg, plannedSets, weekdayShort } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  time: Time;
};

type Prescription = TodayPayload["prescription"];

/** A aba é a LEITURA da prescrição do dia: um documento, não um cartão.
 *
 *  Não reusa `FichaBody` de propósito. A tela empilhada nasce de route params (itens e
 *  nada mais, no meio da sessão) e fecha com "Voltar à sessão"; a aba busca o payload
 *  inteiro e é a única que tem o NOME da prescrição, a DATA e os MINUTOS — três fatos
 *  reais que a versão empilhada jogava fora, e que são exatamente o que separa este
 *  documento de "mais um cartão idêntico".
 *
 *  ponytail: sem MetricGrid. Minutos e faixa de carga são secundários e cabem na legenda
 *  do herói em uma linha muda; três células de 41px seriam área grande carregando pouco —
 *  o defeito que esta tela existe para não ter. */
export function FichaTab({ token, time }: Props) {
  const ac = time.accent_color || T.accentFallback;
  const A = accentSet(ac);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pres, setPres] = useState<Prescription>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const payload = await today(token);
      setPres(payload.prescription);
      setError("");
    } catch {
      // Sem vermelho para o aluno: a falha é dita, não acusada.
      setError("Não deu para carregar agora.");
    }
  }, [token]);

  // ponytail: uma requisição por foco, sem guarda de "alive" — não há duas em voo e
  // setState em componente desmontado não avisa mais nada no React 19.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const rows = [...(pres?.items ?? [])].sort((a, b) => a.position - b.position);

  return (
    <Phone>
      <Head
        kicker={time.name}
        kickerMuted
        title={pres?.name || "Nada para hoje"}
        accent={ac}
        right={
          pres?.for_date ? (
            <Txt role="label" tone="dim" style={styles.stamp}>
              {stamp(pres.for_date)}
            </Txt>
          ) : null
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band>
            <Txt role="body" tone="muted" style={styles.said}>
              {error}
            </Txt>
            <GhostCTA label="Tentar de novo" onPress={load} />
          </Band>
        ) : rows.length === 0 ? (
          <Band>
            <Txt role="body" tone="muted">
              {time.name} ainda não publicou nada para hoje.
            </Txt>
          </Band>
        ) : (
          <>
            <Band>
              <Figure
                value={plannedSets(rows)}
                label="Séries previstas"
                note={ledger(rows, pres?.minutes ?? 0)}
                role="hero"
              />
            </Band>

            <View style={styles.colHead}>
              <Txt role="label" style={styles.colName}>
                Exercício
              </Txt>
              <Txt role="label" style={styles.colKg}>
                Carga kg
              </Txt>
              <View style={styles.chev} />
            </View>

            {rows.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (!pres?.id) return;
                  nav.navigate("ComoFazer", {
                    item,
                    items: rows,
                    timeName: time.name,
                    accent: ac,
                    token,
                    prescriptionId: pres.id,
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel={say(item)}
                accessibilityHint="Abre como fazer este exercício"
                style={[styles.row, i === rows.length - 1 && styles.last]}
              >
                <View style={styles.line}>
                  <Txt role="body" style={styles.name}>
                    {item.name}
                  </Txt>
                  <Txt role="body" style={styles.kg}>
                    {formatKg(item.load_kg)}
                  </Txt>
                  {/* navegação é LINHA com seta; escolha é cartão. A seta é âncora muda,
                      do tamanho do rótulo, nunca protagonista. */}
                  <View style={[styles.chev, styles.chevPad]}>
                    <IconChevron color={T.muted2} size={16} />
                  </View>
                </View>
                <Txt role="note" tone="dim" style={styles.meta}>
                  {String(i + 1).padStart(2, "0")} · {item.planned_sets} ×{" "}
                  {item.planned_reps}
                  {item.rest_seconds ? ` · descanso ${item.rest_seconds}s` : ""}
                </Txt>
                {item.notes ? (
                  <Txt
                    role="note"
                    style={[styles.notes, { borderLeftColor: A.mark }]}
                  >
                    {item.notes}
                  </Txt>
                ) : null}
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </Phone>
  );
}

/** Legenda do herói: o que a lista abaixo soma, com valor REAL dos dois lados.
 *  ponytail: prosa muda, não `Baseline` — baseline exige um número contra o qual comparar
 *  e a prescrição não traz nenhum. Faixa inventada é pior que faixa nenhuma. */
function ledger(rows: TodayItem[], minutes: number): string {
  const n = rows.length;
  const parts = [`${n} exercício${n > 1 ? "s" : ""}`];
  if (minutes > 0) parts.push(`${minutes} min`);
  const loads = rows.map((r) => r.load_kg).filter((kg) => kg > 0);
  if (loads.length) {
    const lo = Math.min(...loads);
    const hi = Math.max(...loads);
    parts.push(
      lo === hi ? `${formatKg(lo)} kg` : `${formatKg(lo)} a ${formatKg(hi)} kg`,
    );
  }
  return parts.join(" · ");
}

/** `for_date` é dia civil, não instante: `new Date("2026-08-18")` é meia-noite UTC e
 *  volta 17 de agosto em Brasília. Parse por campo, sempre. */
function stamp(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  const dt = new Date(y, m - 1, d);
  return `${weekdayShort(dt)} · ${dateShort(dt)}`;
}

function say(item: TodayItem): string {
  const kg = item.load_kg > 0 ? `, ${formatKg(item.load_kg)} quilos` : "";
  const rest = item.rest_seconds ? `, descanso ${item.rest_seconds} segundos` : "";
  return `${item.name}, ${item.planned_sets} séries de ${item.planned_reps}${kg}${rest}`;
}

const CHEV = 16;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  stamp: { paddingTop: 2 },
  said: { marginBottom: 16 },
  colHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: T.pad,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: T.divider,
  },
  colName: { flex: 1 },
  colKg: { width: 100, textAlign: "right" },
  row: {
    paddingHorizontal: T.pad,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.hairline,
  },
  // A última linha não fecha com régua própria: quem fecha a lista é a barra de abas.
  last: { borderBottomWidth: 0 },
  line: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  name: { flex: 1 },
  kg: { width: 70, textAlign: "right", fontVariant: ["tabular-nums"] },
  chev: { width: CHEV },
  chevPad: { paddingBottom: 2 },
  meta: { marginTop: 2 },
  notes: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
});
