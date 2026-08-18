import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import { accentSet, errorInk, productTheme as T } from "../../theme";
import { useAccentMass } from "../../ui/accent";
import { Baseline } from "../../ui/Baseline";
import { formatXp } from "../../ui/format";
import { Band, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
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

export function Progresso({ token, studio }: Props) {
  const A = accentSet(studio.accent_color);
  // O ÚNICO elemento em ÁREA da tela. A Ofensiva é o número do ritual; tudo o mais aqui
  // é neutro, inclusive a barra de hoje e a linha da liga.
  const hero = useAccentMass("Ofensiva", studio.accent_color);
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

  const week = data?.readiness_week ?? [];
  const registrados = week.filter((d) => d.score > 0);
  const media = registrados.length
    ? Math.round(
        registrados.reduce((s, d) => s + d.score, 0) / registrados.length,
      )
    : null;

  const league = data?.league ?? [];
  const me = league.findIndex((row) => row.me);
  // Estreante: só existe a Ofensiva. Então ela ocupa a tela inteira, em vez de deixar
  // dois terços de preto que não separam nada.
  const solo = !selos.length && !week.length && !league.length;

  return (
    <Phone tab>
      <Head kicker={studio.name} title="Progresso" kickerMuted />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Txt role="body" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {data ? (
          <>
            <View
              style={[
                styles.hero,
                solo && styles.solo,
                { backgroundColor: hero.fill },
              ]}
            >
              <Txt role="label" color={hero.ink}>
                Ofensiva
              </Txt>
              <Txt role="mega" color={hero.ink}>
                {data.streak.current_count}
              </Txt>
              <Txt role="body" color={hero.ink} style={styles.heroProse}>
                {data.streak.current_count === 0
                  ? `Sua primeira sessão com ${studio.name} abre a ofensiva.`
                  : `Sessões seguidas com ${studio.name}.`}
              </Txt>
              {data.streak.current_count > 0 ? (
                <Txt role="label" color={hero.ink} style={styles.heroState}>
                  {data.streak.protector_available
                    ? "Protetor guardado"
                    : "Protetor gasto"}
                </Txt>
              ) : null}
            </View>

            {selos.length ? (
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
                                // hoje é o último da fila: POSIÇÃO e tom, nunca matiz.
                                backgroundColor:
                                  i === week.length - 1 ? T.ink : T.divider,
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

            {league.length ? (
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
                        {row.me ? "Você" : row.name}
                      </Txt>
                      <Txt
                        role="body"
                        tone={row.me ? "ink" : "muted"}
                        style={styles.xp}
                      >
                        {formatXp(row.xp_total)}
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

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: { paddingHorizontal: T.pad, paddingTop: 12 },

  hero: {
    paddingHorizontal: T.pad,
    paddingTop: 20,
    paddingBottom: 20,
  },
  solo: { flexGrow: 1 },
  heroProse: { marginTop: 8 },
  heroState: { marginTop: 8 },

  selos: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  selo: {
    backgroundColor: T.fill,
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
    backgroundColor: T.raised,
    marginHorizontal: -T.pad,
    paddingHorizontal: T.pad,
  },
  rank: { width: 16 },
  name: { flex: 1, minWidth: 0 },
  xp: { fontVariant: ["tabular-nums"] },
});
