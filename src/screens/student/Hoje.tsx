import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  configDoTime,
  progress,
  putProntidao,
  resultadoDaSessao,
  today,
  type Person,
  type Prontidao,
  type Time,
  type TodayPayload,
} from "../../api";
import type { StudentTabNavigation } from "../../nav/types";
import {
  createSession,
  flush,
  loadCurrent,
  newLocalId,
  resumeCursor,
  sessionProof,
} from "../../offline/sessionQueue";
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
import { Avatar } from "../../ui/Avatar";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { RetomadaBand } from "./Retomada";
import { dateShort, plannedSets, weekdayLong } from "../../ui/format";

type Props = {
  token: string;
  person: Person;
  time: Time;
  needsCommitment: boolean;
};

export function Hoje({ token, time, needsCommitment }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, acento, errorInk } = useTema();
  const navigation = useNavigation<StudentTabNavigation>();
  const A = acento();
  const cfg = configDoTime(time);
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
  // Faixa FECHÁVEL: o X some com o aviso e o dia continua inteiro atrás. O estado é local
  // de propósito — fechar é "agora não", não "resolvido". A Retomada segue aberta no
  // servidor até a sessão curta ser feita, e volta na próxima abertura.
  const [comebackOff, setComebackOff] = useState(false);
  const savingRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const payload = await today(token);
      setData(payload);
      setEnergy(payload.prontidao.energy);
      setSoreness(payload.prontidao.soreness);
      setSleep(payload.prontidao.sleep);
      setError("");
    } catch {
      setError("Não deu para abrir o hoje.");
    }
    try {
      // A série de prontidão da semana já é servida para a Progresso. É dela que saem o
      // delta e a baseline daqui — números reais, do mesmo corpo. Sem ela, os dois somem.
      const p = await progress(token);
      setWeek(p.prontidao_week);
    } catch {
      /* sem histórico: o 84 fica sem delta e sem baseline, e é só isso. */
    }
    const result = await flush(token);
    const leftover = await loadCurrent();
    setPendingLocal(!result.ok);
    setResume(leftover !== null && leftover.finished === undefined);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const prescription = data?.prescription ?? null;
  const answered = inScale(energy) && inScale(soreness) && inScale(sleep);
  const dirty =
    energy !== (data?.prontidao.energy ?? 0) ||
    soreness !== (data?.prontidao.soreness ?? 0) ||
    sleep !== (data?.prontidao.sleep ?? 0);

  useEffect(() => {
    if (!answered || !dirty || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    void (async () => {
      try {
        const prontidao = await putProntidao(token, {
          energy,
          soreness,
          sleep,
        });
        setData((prev) => (prev ? { ...prev, prontidao } : prev));
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
      timeName: time.name,
      prescriptionId: prescription.id,
      items: prescription.items,
      ofensivaCount: data.ofensiva.current_count,
      xpTotal: data.xp_total,
      needsCommitment,
      passoKg: cfg.passo_kg,
    };
    const existing = await loadCurrent();
    if (existing && existing.prescription_id === prescription.id) {
      if (existing.finished) {
        const proof = sessionProof(existing);
        const result = await flush(token, existing.local_id);
        const finish = result.ok ? result.finish : undefined;
        const resultado = resultadoDaSessao(finish, !result.ok, {
          ofensiva: data.ofensiva.current_count,
          xpTotal: data.xp_total,
        });
        navigation.navigate("Feito", {
          timeName: time.name,
          ofensivaCount: resultado.ofensivaCount,
          xpGained: resultado.xpGained,
          xpTotal: resultado.xpTotal,
          records: resultado.records,
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
          localId: existing.local_id,
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
        localId: existing.local_id,
        itemIndex: cursor.itemIndex,
        setIndex: cursor.setIndex,
      });
      return;
    }
    const session = await createSession(prescription.id, newLocalId());
    navigation.navigate("Serie", {
      ...base,
      localId: session.local_id,
      itemIndex: 0,
      setIndex: 1,
    });
  }

  const now = new Date();
  const score = data?.prontidao.score ?? 0;
  const sets = prescription ? plannedSets(prescription.items) : 0;
  const cta = resume ? "Continuar" : ctaLabel(data?.prontidao.label ?? "");

  // Dias ANTERIORES e REGISTRADOS: o de hoje é o próprio 84, e comparar um número consigo
  // mesmo é o empate que não diz nada. `score` 0 é dia sem registro, não dia ruim — a
  // Progresso já o descarta, e contá-lo aqui puxava esta média para baixo da de lá: a
  // mesma prontidão lida com dois números em duas abas vizinhas.
  const past = week.filter((d) => d.for_date < isoDay(now) && d.score > 0);
  const prev = past.length ? past[past.length - 1].score : null;
  const mean = past.length
    ? Math.round(past.reduce((s, d) => s + d.score, 0) / past.length)
    : null;
  // A leitura sai da prontidão SALVA — a mesma que gerou o 84. Enquanto uma escala nova
  // não voltou da API, a frase não fala por ela.
  const reading = data ? readingOf(data.prontidao) : null;

  return (
    <Phone>
      <Head
        marca={
          time.logo_url ? (
            <Avatar url={time.logo_url} name={time.name} size={34} />
          ) : undefined
        }
        kicker={`${weekdayLong(now)} · ${dateShort(now)}`}
        kickerMuted
        right={
          /* CONTADOR DA OFENSIVA NO CHROME. Estava só no rodapé da rolagem (linha ~430),
             em corpo de rótulo: custava rolar até o fim para saber o próprio número. Aqui
             custa zero toque.

             Mesma posição e MESMA FORMA nos dois estados — o que muda é a saturação: mudo
             antes do Cumprimento do dia, aceso depois. Não pode ser cor semântica, porque
             o único matiz da tela é o do personal e ele não significa bom nem ruim; então
             o estado sai da SATURAÇÃO do mesmo matiz, não de outro matiz.

             Ofensiva zerada não vira "0" aceso: sem contagem, fica só a marca muda. Falha
             é AUSÊNCIA de marca. */
          <View style={styles.streak}>
            <IconMark color={data?.cumprido ? A.mark : T.muted} />
            {data && data.ofensiva.current_count > 0 ? (
              <Txt role="label" tone={data.cumprido ? "ink" : "dim"}>
                {data.ofensiva.current_count}
              </Txt>
            ) : null}
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="none">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
            <View style={styles.retry}>
              <GhostCTA
                label="Tentar de novo"
                onPress={() => void load()}
                fundo={T.bg}
              />
            </View>
          </Band>
        ) : null}

        {pendingLocal ? (
          <Band raised rule="none">
            <Txt role="body">Sessão neste celular. Sobe quando tiver rede.</Txt>
          </Band>
        ) : null}

        {data?.comeback && !comebackOff ? (
          <RetomadaBand
            token={token}
            time={time}
            needsCommitment={needsCommitment}
            comeback={data.comeback}
            ofensiva={data.ofensiva.current_count}
            xp={data.xp_total}
            onDismiss={() => setComebackOff(true)}
          />
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
            para o vermelho ler como UM lugar e não como três magnitudes.

            Dia vazio: esta faixa e a de prontidão crescem e dividem a sobra da tela entre
            si — era um vão de 235pt de chão nu entre as escalas e a tab bar. */}
        {data ? (
        <Band grow={!prescription}>
          <View style={styles.anchorRow}>
            <IconFicha color={T.muted} size={14} />
            <Txt role="label" color={A.text}>
              Hoje
            </Txt>
          </View>
          <Txt role="title" style={styles.title}>
            {prescription ? prescription.name : "Ainda não tem nada para hoje."}
          </Txt>
          {data && !prescription ? (
            <Txt role="body" tone="muted" style={styles.reading}>
              Aparece aqui quando {time.name} publicar.
            </Txt>
          ) : null}
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
                />
              </View>
            </>
          ) : null}
        </Band>
        ) : null}

        {cfg.prontidao && answered ? (
          <>
            <Band rule="none">
              {/* Âncora de varredura: a seção se acha pelo ícone, antes de ler a palavra. */}
              <View style={styles.anchored}>
                <View >
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
                  {/* "média da semana" era o mesmo nome que a Progresso dá a OUTRO
                      número (lá entra o dia de hoje, aqui não): duas abas vizinhas
                      mostravam a mesma prontidão com dois valores. O nome diz a janela. */}
                  {mean === null ? null : (
                    <Baseline value={mean} label="média até ontem" />
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
        {cfg.prontidao ? (
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
              />
              <ScaleRow
                name="Dor"
                value={soreness}
                onChange={setSoreness}
              />
              <ScaleRow
                name="Sono"
                value={sleep}
                onChange={setSleep}
              />
            </View>
          ) : null}
          {saving ? (
            <Txt role="note" style={styles.saving}>
              Registrando
            </Txt>
          ) : null}
          {/* Dia vazio: a prontidão ainda não virou número, então a faixa diz o que os
              três valores formam — e a frase quebra o vão da faixa crescida. */}
          {data && !prescription ? (
            <Txt role="body" tone="muted" style={styles.reading}>
              Energia, dor e sono viram sua prontidão do dia.
            </Txt>
          ) : null}
        </Band>
        ) : null}

        {/* A VOZ DO PERSONAL. O bloco inteiro só existe quando ele escreveu a frase ao
            publicar: `coach_line` vem literal de prescriptions.coach_line, e sem frase a
            API devolve vazio e nada disto é montado. Era o contrário — o servidor gerava
            "<exercício> em <carga>. Técnica, não ego." e este bloco assinava a frase de
            produto com o rosto e o nome de uma pessoa real.

            E o rótulo perdeu "revisou sua semana" pelo mesmo motivo: ninguém revisou
            semana nenhuma: ele publicou o dia e escreveu uma linha. Rosto, nome e data são
            a assinatura inteira de que este slot precisa. */}
        {data?.coach_line ? (
          <Band rule="hair">
            <View style={styles.row}>
              <Initials name={time.name} size={34} />
              <View style={styles.grow}>
                <Txt role="body">{time.name}</Txt>
                <Txt role="note">hoje</Txt>
              </View>
            </View>
            <Txt role="body" tone="muted" style={styles.coachLine}>
              {data.coach_line}
            </Txt>
          </Band>
        ) : null}

        {/* Ofensiva zerada não vira "OFENSIVA 0" no rodapé: falha é AUSÊNCIA de marca. */}
        {data && data.ofensiva.current_count > 0 ? (
          <Band rule="none">
            <View style={styles.anchorRow}>
              <IconCheck color={T.muted} size={14} />
              <Txt role="label" tone="dim">
                Ofensiva {data.ofensiva.current_count}
                {data.ofensiva.protector_available ? " · 1 protetor guardado" : ""}
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
  const styles = usarEstilos();
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
function readingOf(r: Prontidao): string | null {
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

/** TODO VÃO DESTA TELA SAI DA ESCADA, e antes nenhum saía.
 *
 *  Esta é a tela que a aluna abre todos os dias, e ela pagava doze vãos escritos à mão:
 *  quatro irmãos numa coluna com quatro margens diferentes (18, 14, 10, 12), um `marginTop:
 *  5` para a mesma relação que o cabeçalho resolve com `SPACE.hair`, um `gap: 20` que não
 *  existe em degrau nenhum, e um `paddingTop: 1` de empurrão óptico numa linha que já
 *  centraliza sozinha. `theme.ts` declara o PISO 8 com todas as letras — "abaixo de 8 não
 *  existe separação, existe defeito de renderização" — e esta tela tinha seis vãos abaixo
 *  dele.
 *
 *  Nada disso se via numa revisão: são números plausíveis, um por linha, escritos em
 *  meses diferentes. Quem vê é `tools/vaos.mjs`, que conta literal de espaço fora dos seis
 *  degraus e achou 161 no app inteiro. */
const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    streak: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    row: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    grow: { flex: 1, minWidth: 0 },
    title: { marginTop: SPACE.hair },
    stats: { flexDirection: "row", gap: SPACE.step, marginTop: SPACE.tight },
    // Base comum, como na Figure: alinhar pelo fundo da caixa desalinha as duas bases,
    // porque a sobra da entrelinha é diferente em cada degrau.
    stat: { flexDirection: "row", alignItems: "baseline", gap: SPACE.hair },
    // A AÇÃO respira um degrau a mais que os irmãos dela; os irmãos respiram igual entre
    // si. Era o contrário: quatro margens distintas sem hierarquia nenhuma.
    cta: { marginTop: SPACE.step },
    scales: { marginTop: SPACE.tight },
    saving: { marginTop: SPACE.tight },
    // Âncoras de varredura: ícone mudo à esquerda do rótulo da seção. Monocromático de
    // propósito — matiz aqui é do personal e nunca significa nada.
    anchorRow: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    anchored: { flexDirection: "row", gap: SPACE.hair },
    delta: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      marginTop: SPACE.hair,
    },
    reading: { marginTop: SPACE.tight },
    ghost: { marginTop: SPACE.tight },
    // A LINHA DO PERSONAL É UM DELIMITADOR, e delimitador é `divider` ou `ink` (SPEC §3).
    // Estava em `T.hairline`, que mede 1,23:1 contra o chão — o mesmo defeito que o filete
    // fino da Band embarcava, no mesmo dia, em outro arquivo.
    coachLine: {
      marginTop: SPACE.tight,
      paddingTop: SPACE.tight,
      borderTopWidth: FORMA.fio,
      borderTopColor: T.divider,
    },
  }),
);
