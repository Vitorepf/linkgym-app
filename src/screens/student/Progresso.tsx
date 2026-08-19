import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  configDoTime,
  progress,
  type Person,
  type ProgressPayload,
  type Time,
} from "../../api";
import { useAccentMass } from "../../ui/accent";
import { Baseline } from "../../ui/Baseline";
import { Figure } from "../../ui/Figure";
import { formatNum } from "../../ui/format";
import { Band, Head, neutroNaBand, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  time: Time;
};

/** Os quatro selos que a API escreve de verdade. Só o CONQUISTADO aparece: quem não tem
 *  não ganha caixa vazia nem contorno de falta — ausência é a marca. */
const SELOS: Record<string, string> = {
  estreia: "ESTREIA",
  primeiro_pr: "PRIMEIRO PR",
  ofensiva_4: "4 SEGUIDAS",
  retomada: "RETOMADA",
};

const BAR = 62;

export function Progresso({ token, time }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, acento, errorInk, secundaria } = useTema();
  const A = acento();
  // A SEGUNDA COR, no mesmo papel que ela já tem sob o medidor da Hoje (ui/Baseline):
  // SEGUNDA SÉRIE. A semana tem duas — HOJE, que é o dado, e os dias que passaram, que
  // são a referência contra a qual ele se lê (e de onde sai a média que a Baseline
  // desenha logo abaixo, nesta mesma cor). Até aqui as duas se distinguiam só por degrau
  // de cinza. O matiz não diz "bom" nem "ruim": diz "esta é a OUTRA".
  // A cor da MARCA (a primária) não entra: a massa dela é da ação, e o gráfico não
  // disputa com ela. Decisão do dono, e é por isso que aqui está a segunda cor.
  // `piece` e não `mark` porque a barra é peça pequena e REPETIDA que pinta área: ele
  // garante o piso contra o fundo difícil da paleta, logo contra os quatro. A Band desta
  // tela pousa no chão hoje e pode passar a `raised` — o gráfico não pode depender de
  // qual dos dois é.
  const referencia = acento(secundaria).piece.fill;
  const cfg = configDoTime(time);
  // O ÚNICO elemento em ÁREA da tela. A Ofensiva é o número do ritual; tudo o mais aqui
  // é neutro, inclusive a barra de hoje e a linha da liga.
  const hero = useAccentMass("Ofensiva");
  const [data, setData] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await progress(token);
        if (alive) {
          setData(payload);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o progresso.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const selos = Object.keys(SELOS).filter((k) => earned.has(k));

  const week = data?.prontidao_week ?? [];
  const registrados = week.filter((d) => d.score > 0);
  const media = registrados.length
    ? Math.round(
        registrados.reduce((s, d) => s + d.score, 0) / registrados.length,
      )
    : null;

  const league = data?.league ?? [];
  const me = league.findIndex((row) => row.me);
  // Estreante: só existe a Ofensiva. O que a acompanha são os dois fatos reais do começo
  // (XP e Protetor), em superfícies que dividem a sobra da tela — não um herói engordado
  // com dois terços de massa que não dizem nada.
  const solo = !selos.length && !week.length && !league.length;

  return (
    <Phone>
      <Head kicker={time.name} title="Progresso" kickerMuted />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Txt role="body" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {data ? (
          <>
            <View style={[styles.hero, { backgroundColor: hero.fill }]}>
              <Txt role="label" color={hero.ink}>
                Ofensiva
              </Txt>
              <Txt role="mega" color={hero.ink}>
                {data.ofensiva.current_count}
              </Txt>
              <Txt role="body" color={hero.ink} style={styles.heroProse}>
                {data.ofensiva.current_count === 0
                  ? `Sua primeira sessão com ${time.name} abre a ofensiva.`
                  : `Sessões seguidas com ${time.name}.`}
              </Txt>
              {data.ofensiva.current_count > 0 ? (
                <Txt role="label" color={hero.ink} style={styles.heroState}>
                  {data.ofensiva.protector_available
                    ? "Protetor guardado"
                    : "Protetor gasto"}
                </Txt>
              ) : null}
            </View>

            {solo ? (
              <>
                {cfg.xp ? (
                <Band raised grow rule="none">
                  <Figure
                    label="XP"
                    value={data.xp_total}
                    note={`Cada sessão fechada com ${time.name} soma.`}
                  />
                </Band>
                ) : null}
                <Band raised grow rule="none">
                  <Figure
                    label="Protetor"
                    value={0}
                    note="Abre com a ofensiva e segura o primeiro dia sem sessão."
                  />
                </Band>
              </>
            ) : null}

            {cfg.selos && selos.length ? (
              <Band>
                <Txt role="label">Selos · {selos.length}</Txt>
                <View style={styles.selos}>
                  {selos.map((k) => (
                    <View key={k} style={styles.selo}>
                      <Txt role="label" tone="ink">
                        {SELOS[k]}
                      </Txt>
                    </View>
                  ))}
                </View>
              </Band>
            ) : null}

            {week.length ? (
              <Band>
                <Txt role="label">
                  Prontidão · {registrados.length} de {week.length} dias
                </Txt>
                <View style={styles.week}>
                  {week.map((d, i) => (
                    <View key={d.for_date} style={styles.day}>
                      <View style={styles.dayBar}>
                        {d.score > 0 ? (
                          <View
                            style={[
                              styles.bar,
                              {
                                height: Math.max(4, (d.score / 100) * BAR),
                                // TRÊS canais, e nenhum sozinho: POSIÇÃO (hoje é o
                                // último da fila), TOM (a tinta é o degrau mais alto do
                                // chão, e o medidor exige 5 de L* contra a referência) e
                                // matiz. Tire a cor e a leitura fica inteira.
                                backgroundColor:
                                  i === week.length - 1 ? T.ink : referencia,
                              },
                            ]}
                          />
                        ) : null}
                      </View>
                      {/* dia sem registro fica com o MESMO numeral cinza de qualquer
                          outro: o histórico registra, não acusa. */}
                      <Txt role="label" tone="dim" style={styles.dayNum}>
                        {d.for_date.slice(8, 10)}
                      </Txt>
                    </View>
                  ))}
                </View>
                {media !== null ? (
                  <Baseline
                    value={media}
                    label={`sua média de ${registrados.length} dias`}
                  />
                ) : null}
                {registrados.length < week.length ? (
                  <Txt role="body" tone="muted" style={styles.legend}>
                    Dia sem barra é dia que você não registrou.
                  </Txt>
                ) : null}
              </Band>
            ) : null}

            {cfg.liga !== "off" && league.length ? (
              <Band rule="none">
                <Txt role="label">
                  {me >= 0 ? `Liga · ${me + 1}º de ${league.length}` : "Liga"}
                </Txt>
                <View style={styles.league}>
                  {league.map((row, i) => (
                    <View
                      key={`${row.name}-${i}`}
                      style={[styles.row, row.me && styles.rowMe]}
                    >
                      <Txt
                        role="label"
                        tone="dim"
                        color={row.me ? A.text : undefined}
                        style={styles.rank}
                      >
                        {i + 1}
                      </Txt>
                      <Txt
                        role="body"
                        tone={row.me ? "ink" : "muted"}
                        numberOfLines={1}
                        style={styles.name}
                      >
                        {row.me
                          ? "Você"
                          : cfg.liga === "anonima"
                            ? `Aluno ${i + 1}`
                            : row.name}
                      </Txt>
                      <Txt
                        role="body"
                        tone={row.me ? "ink" : "muted"}
                        style={styles.xp}
                      >
                        {formatNum(row.xp_total)}
                      </Txt>
                    </View>
                  ))}
                </View>
              </Band>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

const usarEstilos = estilos((tema) => {
  const { T } = tema;
  // O selo e a linha "Você" pousam DENTRO da Band, não no chão: o degrau é contado a
  // partir do fundo dela. Hoje isso é exatamente `T.fill`; no dia em que a Band for
  // levantada os dois continuam existindo em vez de sumirem no próprio fundo.
  const degrau = neutroNaBand(tema);
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    error: { paddingHorizontal: T.pad, paddingTop: 12 },

    hero: {
      paddingHorizontal: T.pad,
      paddingTop: 20,
      paddingBottom: 20,
    },
    heroProse: { marginTop: 8 },
    heroState: { marginTop: 8 },

    selos: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
    selo: {
      backgroundColor: degrau,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },

    week: { flexDirection: "row", gap: 6, marginTop: 16 },
    day: { flex: 1, alignItems: "center" },
    dayBar: { height: BAR, alignSelf: "stretch", justifyContent: "flex-end" },
    bar: { alignSelf: "stretch" },
    dayNum: { marginTop: 6, letterSpacing: 0 },
    legend: { marginTop: 4 },

    league: { marginTop: 6 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 7,
    },
    rowMe: {
      backgroundColor: degrau,
      marginHorizontal: -T.pad,
      paddingHorizontal: T.pad,
    },
    // 22: dois dígitos de rank ("10") quebravam em duas linhas com 16.
    rank: { width: 22 },
    name: { flex: 1, minWidth: 0 },
    xp: { fontVariant: ["tabular-nums"] },
  });
});
