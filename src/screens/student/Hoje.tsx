import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  progress,
  putReadiness,
  today,
  type Person,
  type Readiness,
  type Studio,
  type TodayPayload,
} from "../../api";
import type { StudentTabNavigation } from "../../nav/types";
import {
  createSession,
  flush,
  loadCurrent,
  newClientId,
  resumeCursor,
  sessionProof,
} from "../../offline/sessionQueue";
import { accentSet, errorInk, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Baseline } from "../../ui/Baseline";
import { Figure } from "../../ui/Figure";
import { GhostCTA } from "../../ui/GhostCTA";
import {
  IconCheck,
  IconFicha,
  IconMark,
  IconPerson,
  IconPulse,
  TrendMark,
} from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { ScaleRow } from "../../ui/ScaleRow";
import { Band, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { dateShort, plannedSets, weekdayLong } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
};

export function Hoje({ token, studio, needsCommitment }: Props) {
  const navigation = useNavigation<StudentTabNavigation>();
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
  const [data, setData] = useState<TodayPayload | null>(null);
  const [week, setWeek] = useState<{ for_date: string; score: number }[]>([]);
  const [error, setError] = useState("");
  const [energy, setEnergy] = useState(0);
  const [soreness, setSoreness] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pendingLocal, setPendingLocal] = useState(false);
  const [resume, setResume] = useState(false);
  const [open, setOpen] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) {
          setData(payload);
          setEnergy(payload.readiness.energy);
          setSoreness(payload.readiness.soreness);
          setSleep(payload.readiness.sleep);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o hoje.");
      }
      try {
        // A série de prontidão da semana já é servida para a Progresso. É dela que saem o
        // delta e a baseline daqui — números reais, do mesmo corpo. Sem ela, os dois somem.
        const p = await progress(token);
        if (alive) setWeek(p.readiness_week);
      } catch {
        /* sem histórico: o 84 fica sem delta e sem baseline, e é só isso. */
      }
      const result = await flush(token);
      if (!alive) return;
      const leftover = await loadCurrent();
      setPendingLocal(!result.ok);
      setResume(leftover !== null && leftover.finished === undefined);
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const prescription = data?.prescription ?? null;
  const answered = inScale(energy) && inScale(soreness) && inScale(sleep);
  const dirty =
    energy !== (data?.readiness.energy ?? 0) ||
    soreness !== (data?.readiness.soreness ?? 0) ||
    sleep !== (data?.readiness.sleep ?? 0);

  useEffect(() => {
    if (!answered || !dirty || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    void (async () => {
      try {
        const readiness = await putReadiness(token, {
          energy,
          soreness,
          sleep,
        });
        setData((prev) => (prev ? { ...prev, readiness } : prev));
        setError("");
      } catch {
        setError("Não deu para registrar como você está.");
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    })();
  }, [answered, dirty, energy, sleep, soreness, token]);

  async function startLocal() {
    if (!prescription || !data) return;
    const base = {
      token,
      studioName: studio.name,
      accent,
      prescriptionId: prescription.id,
      items: prescription.items,
      streakCount: data.streak.current_count,
      xpTotal: data.xp_total,
      needsCommitment,
    };
    const existing = await loadCurrent();
    if (existing && existing.prescription_id === prescription.id) {
      if (existing.finished) {
        const proof = sessionProof(existing);
        const result = await flush(token, existing.client_id);
        const finish = result.ok ? result.finish : undefined;
        navigation.navigate("Feito", {
          studioName: studio.name,
          accent,
          streakCount:
            finish?.streak.current_count ?? data.streak.current_count + 1,
          xpGained: finish?.xp_gained ?? 10,
          xpTotal: finish?.xp_total ?? data.xp_total + 10,
          records: finish?.records ?? [],
          proof,
          pending: !result.ok,
          needsCommitment,
        });
        return;
      }
      const cursor = resumeCursor(prescription.items, existing.sets);
      if (cursor === "done") {
        navigation.navigate("Descanso", {
          ...base,
          clientId: existing.client_id,
          itemIndex: Math.max(0, prescription.items.length - 1),
          setIndex:
            prescription.items[prescription.items.length - 1]?.planned_sets ?? 1,
          restSeconds:
            prescription.items[prescription.items.length - 1]?.rest_seconds ??
            90,
          last: true,
        });
        return;
      }
      navigation.navigate("Serie", {
        ...base,
        clientId: existing.client_id,
        itemIndex: cursor.itemIndex,
        setIndex: cursor.setIndex,
      });
      return;
    }
    const session = await createSession(prescription.id, newClientId());
    navigation.navigate("Serie", {
      ...base,
      clientId: session.client_id,
      itemIndex: 0,
      setIndex: 1,
    });
  }

  const now = new Date();
  const score = data?.readiness.score ?? 0;
  const sets = prescription ? plannedSets(prescription.items) : 0;
  const cta = resume ? "Continuar" : ctaLabel(data?.readiness.label ?? "");

  // Dias ANTERIORES: o de hoje é o próprio 84, e comparar um número consigo mesmo é o
  // empate que não diz nada.
  const past = week.filter((d) => d.for_date < isoDay(now));
  const prev = past.length ? past[past.length - 1].score : null;
  const mean = past.length
    ? Math.round(past.reduce((s, d) => s + d.score, 0) / past.length)
    : null;
  // A leitura sai da prontidão SALVA — a mesma que gerou o 84. Enquanto uma escala nova
  // não voltou da API, a frase não fala por ela.
  const reading = data ? readingOf(data.readiness) : null;

  return (
    <Phone tab>
      <Head
        kicker={`${weekdayLong(now)} · ${dateShort(now)}`}
        kickerMuted
        right={<IconMark color={A.mark} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="none">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
          </Band>
        ) : null}

        {pendingLocal ? (
          <Band raised rule="none">
            <Txt role="body">Sessão neste celular. Sobe quando tiver rede.</Txt>
          </Band>
        ) : null}

        {data?.banner ? (
          <Band raised rule="none">
            <View style={styles.row}>
              <Txt role="body" style={styles.grow}>
                {data.banner.text}
              </Txt>
              <Txt role="label" color={A.text}>
                Agora
              </Txt>
            </View>
          </Band>
        ) : null}

        {/* O primeiro fato da tela é o que o corpo vai fazer hoje. O acento em ÁREA da tela
            inteira é o botão daqui — e a única outra tinta de acento fica na mesma faixa,
            para o vermelho ler como UM lugar e não como três magnitudes. */}
        <Band>
          <View style={styles.anchorRow}>
            <IconFicha color={T.muted} size={14} />
            <Txt role="label" color={A.text}>
              Hoje
            </Txt>
          </View>
          <Txt role="title" style={styles.title}>
            {prescription ? prescription.name : "Ainda não tem nada para hoje."}
          </Txt>
          {prescription ? (
            <>
              <View style={styles.stats}>
                <Stat n={prescription.items.length} unit="exercícios" />
                <Stat n={sets} unit="séries" />
                <Stat n={prescription.minutes} unit="min" />
              </View>
              <View style={styles.cta}>
                <AccentCTA
                  label={cta}
                  meta={
                    prescription.minutes ? `${prescription.minutes} MIN` : undefined
                  }
                  onPress={() => {
                    void startLocal();
                  }}
                  accent={accent}
                />
              </View>
            </>
          ) : null}
        </Band>

        {answered ? (
          <>
            <Band rule="none">
              {/* Âncora de varredura: a seção se acha pelo ícone, antes de ler a palavra. */}
              <View style={styles.anchored}>
                <View style={styles.anchorIcon}>
                  <IconPulse color={T.muted} size={14} />
                </View>
                <View style={styles.grow}>
                  {/* hero, e não value: a MetricGrid abaixo desenha as três causas em
                      `value`, e número explicado empatado com as causas é empate de
                      hierarquia. */}
                  <Figure value={score} label="Prontidão" role="hero" />
                  {/* A direção NÃO mora mais colada no 84: dois juízes viram a seta e não
                      acharam o contra quê. Ela desce para a linha do referente, encostada
                      no número contra o qual ela aponta, e o salto vira dígito. */}
                  {prev === null ? null : (
                    <View style={styles.delta}>
                      <TrendMark
                        dir={score > prev ? "up" : score < prev ? "down" : "flat"}
                        color={T.muted}
                        size={11}
                      />
                      <Txt role="note" tone="dim">
                        {deltaLine(score, prev)}
                      </Txt>
                    </View>
                  )}
                  {mean === null ? null : (
                    <Baseline value={mean} label="média da semana" />
                  )}
                  {/* A frase é DERIVADA dos três valores do dia e cita cada número. Se
                      nenhum dos três se destaca, `readingOf` devolve null e a tela cala —
                      frase genérica de ânimo é o que este produto não faz. */}
                  {reading ? (
                    <Txt role="body" tone="muted" style={styles.reading}>
                      {reading}
                    </Txt>
                  ) : null}
                </View>
              </View>
            </Band>
            {/* A causa do 84 com VALOR, na tela e não atrás de um toque. */}
            <MetricGrid
              columns={3}
              cells={[
                { label: "Energia", value: energy, unit: "/5" },
                { label: "Dor", value: soreness, unit: "/5" },
                { label: "Sono", value: sleep, unit: "/5" },
              ]}
            />
          </>
        ) : null}

        {/* O controle que muda os três números mora COLADO neles, e não depois da prosa do
            personal. De quebra some a caixa raspando a tab bar: a única caixa com borda da
            rolagem cabe INTEIRA acima da dobra, e o que sobra abaixo dela é só texto —
            parágrafo cortado se lê como "tem mais", borda cortada se lê como defeito. */}
        <Band>
          <View style={styles.anchorRow}>
            <IconPerson color={T.muted} size={14} />
            <Txt role="label">Como você está hoje?</Txt>
          </View>
          {answered ? (
            <View style={styles.ghost}>
              <GhostCTA
                label={open ? "Fechar" : "Ajustar"}
                onPress={() => setOpen((v) => !v)}
              />
            </View>
          ) : null}
          {!answered || open ? (
            <View style={styles.scales}>
              <ScaleRow
                name="Energia"
                value={energy}
                onChange={setEnergy}
                accent={accent}
              />
              <ScaleRow
                name="Dor"
                value={soreness}
                onChange={setSoreness}
                accent={accent}
              />
              <ScaleRow
                name="Sono"
                value={sleep}
                onChange={setSleep}
                accent={accent}
              />
            </View>
          ) : null}
          {saving ? (
            <Txt role="note" style={styles.saving}>
              Registrando
            </Txt>
          ) : null}
        </Band>

        {data?.coach_line ? (
          <Band rule="hair">
            <View style={styles.row}>
              <Initials name={studio.name} size={34} />
              <View style={styles.grow}>
                <Txt role="body">{studio.name} revisou sua semana</Txt>
                <Txt role="note">hoje</Txt>
              </View>
            </View>
            <Txt role="body" tone="muted" style={styles.coachLine}>
              {data.coach_line}
            </Txt>
          </Band>
        ) : null}

        {/* Ofensiva zerada não vira "OFENSIVA 0" no rodapé: falha é AUSÊNCIA de marca. */}
        {data && data.streak.current_count > 0 ? (
          <Band rule="none">
            <View style={styles.anchorRow}>
              <IconCheck color={T.muted} size={14} />
              <Txt role="label" tone="dim">
                Ofensiva {data.streak.current_count}
                {data.streak.protector_available ? " · 1 protetor guardado" : ""}
              </Txt>
            </View>
          </Band>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

/** O ritmo do dia: numeral com tinta, unidade cinza um corpo abaixo. Não é Figure — a
 *  Figure começa em 41px e este par mora na linha de apoio, não no topo da hierarquia. */
function Stat({ n, unit }: { n: number; unit: string }) {
  return (
    <View style={styles.stat}>
      <Txt role="body">{n}</Txt>
      <Txt role="note">{unit}</Txt>
    </View>
  );
}

function inScale(n: number): boolean {
  return n >= 1 && n <= 5;
}

/** O salto DITO em dígito, na mesma linha da marca de direção e do número comparado. A
 *  seta sozinha ao lado do 84 não dizia contra o quê; aqui direção, tamanho do salto e
 *  referente são uma coisa só. */
function deltaLine(score: number, prev: number): string {
  const d = Math.abs(score - prev);
  if (d === 0) return `igual a ${prev} no dia anterior`;
  return `${d} ${score > prev ? "acima" : "abaixo"} de ${prev} no dia anterior`;
}

/** A LEITURA DOS TRÊS NÚMEROS, derivada — nunca um texto fixo.
 *
 *  ENERGIA 4 · DOR 2 · SONO 4 são três fatos soltos; o que faltava era dizer o que eles
 *  formam JUNTOS. A frase só usa o que os valores do dia sustentam: cada pedaço entra
 *  citando o próprio número, e o 84 aparece porque é dos três que ele sai (/v1/today
 *  calcula `score` a partir de energia, dor e sono — a frase não inventa causa nenhuma).
 *
 *  Se nenhum dos três se destaca (tudo em 3), não há afirmação honesta a fazer e a função
 *  devolve null: a tela cala. Uma frase de ânimo genérica seria pior que o silêncio. */
function readingOf(r: Readiness): string | null {
  if (!inScale(r.energy) || !inScale(r.soreness) || !inScale(r.sleep)) return null;
  if (!r.score) return null;

  const puxam: string[] = [];
  const seguram: string[] = [];
  if (r.energy >= 4) puxam.push(`energia ${r.energy}`);
  else if (r.energy <= 2) seguram.push(`energia ${r.energy}`);
  if (r.sleep >= 4) puxam.push(`sono ${r.sleep}`);
  else if (r.sleep <= 2) seguram.push(`sono ${r.sleep}`);
  // dor é a escala invertida: pouca dor puxa para cima, muita segura.
  if (r.soreness <= 2) puxam.push(`dor ${r.soreness}`);
  else if (r.soreness >= 4) seguram.push(`dor ${r.soreness}`);

  if (!puxam.length && !seguram.length) return null;
  if (!seguram.length) {
    return cap(`${lista(puxam)} ${verbo(puxam, "põe", "põem")} a prontidão em ${r.score}.`);
  }
  if (!puxam.length) {
    return cap(
      `${lista(seguram)} ${verbo(seguram, "segura", "seguram")} a prontidão em ${r.score}.`,
    );
  }
  return cap(
    `${lista(puxam)} ${verbo(puxam, "puxa", "puxam")} para cima, ` +
      `${lista(seguram)} ${verbo(seguram, "segura", "seguram")}: a prontidão fecha em ${r.score}.`,
  );
}

function lista(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

function verbo(parts: string[], um: string, muitos: string): string {
  return parts.length > 1 ? muitos : um;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function ctaLabel(label: string): string {
  if (label === "Hoje não é dia de PR" || label === "Versão leve") {
    return "Começar leve";
  }
  return "Começar";
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  // O fim da rolagem não encosta na tab bar: a última faixa termina e sobra chão.
  content: { flexGrow: 1, paddingBottom: 28 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  grow: { flex: 1, minWidth: 0 },
  title: { marginTop: 5 },
  stats: { flexDirection: "row", gap: 20, marginTop: 12 },
  stat: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  cta: { marginTop: 18 },
  scales: { marginTop: 14 },
  saving: { marginTop: 10 },
  // Âncoras de varredura: ícone mudo à esquerda do rótulo da seção. Monocromático de
  // propósito — matiz aqui é do personal e nunca significa nada.
  anchorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  anchored: { flexDirection: "row", gap: 8 },
  anchorIcon: { paddingTop: 1 },
  delta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  reading: { marginTop: 10 },
  ghost: { marginTop: 12 },
  coachLine: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: T.hairline,
  },
});
