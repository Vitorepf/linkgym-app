import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  progress,
  type Person,
  type ProgressPayload,
  type Studio,
} from "../../api";
import { errorInk, productTheme as T } from "../../theme";
import { formatNum } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onLeave: () => void;
};

/** A tela que MAIS destoava do resto do app, e o que mudou nesta costura:
 *    - era a única das trinta que não usava `Head`: cabeçalho próprio, com o nome em 22 px
 *      (degrau que não existe na escala) e a linha de baixo em 13 px SEM fontFamily — ou
 *      seja, em San Francisco/Roboto, no meio de um app inteiro em Archivo. Eram os quatro
 *      últimos blocos com fontSize e sem família do repositório.
 *    - tinha DUAS convenções de rótulo dentro dela mesma: um kicker acentuado e um mudo,
 *      ambos em 11 px/1,43 — e o resto do app escreve rótulo em `Txt role="label"`
 *      (12 px/1,3, mudo). Sobrou uma convenção, a do sistema.
 *    - a segunda célula da grade dizia "Recorde" e desenhava `streak.current_count`: o
 *      MESMO número da célula ao lado, com outro nome. O payload não tem recorde de
 *      ofensiva, então a célula que mentia saiu e entrou o Protetor, que é dado real.
 *    - a barra "Quanto falta" media o selo de 4 semanas — o MESMO selo que a fila logo
 *      abaixo desenha, com outro nome e outra forma. A tela dizia duas vezes; ficou uma.
 *    - "Sair" era um rótulo em caixa alta sem moldura, do tamanho e do tom dos títulos de
 *      seção acima dele: lia como cabeçalho, não como saída. Virou o botão fantasma que o
 *      resto do app já usa para a ação que não é a principal.
 *
 *  ponytail: nenhuma peça nova. Head, Band, MetricGrid, GhostCTA, Initials e Txt já
 *  existiam — esta tela só não estava usando nenhum deles. */
const SELOS = [
  { key: "estreia", label: "Estreia", mark: "1" },
  { key: "ofensiva_4", label: "Semanas", mark: "4" },
  { key: "primeiro_pr", label: "PR", mark: "PR" },
  { key: "retomada", label: "Retomada", mark: "R" },
] as const;

export function Perfil({ token, person, studio, onLeave }: Props) {
  const accent = studio.accent_color || T.accentFallback;
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
        if (alive) setError("Não deu para abrir o perfil.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const name = person.name.trim() || "Você";
  const place = data ? data.league.findIndex((row) => row.me) + 1 : 0;
  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const streak = data?.streak.current_count ?? 0;

  return (
    <Phone tab>
      <Head
        kicker={studio.name}
        kickerMuted
        title={name}
        right={<Initials name={name} accent={accent} fill size={54} />}
      />

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
            <MetricGrid
              cells={[
                {
                  label: "Ofensiva",
                  value: streak,
                  note: "sessões seguidas",
                },
                {
                  label: "Protetor",
                  value: data.streak.protector_available ? "1" : "—",
                  note: data.streak.protector_available
                    ? "guardado"
                    : "gasto nesta ofensiva",
                },
                {
                  label: "XP total",
                  value: formatNum(data.xp_total),
                },
                {
                  label: "Liga",
                  value: place > 0 ? `${place}º` : "—",
                  note: studio.name,
                },
              ]}
            />

            <Band>
              <Txt role="label">Selos</Txt>
              <View style={styles.selos}>
                {SELOS.map((selo) => {
                  const on = earned.has(selo.key);
                  return (
                    <View key={selo.key} style={styles.seloCol}>
                      {/* Selo não conquistado é AUSÊNCIA de tinta, nunca outro matiz:
                          moldura vazia contra caixa cheia. */}
                      <View
                        style={[
                          styles.selo,
                          on ? styles.seloOn : styles.seloOff,
                        ]}
                      >
                        <Txt role="body" tone={on ? "ink" : "dim"}>
                          {selo.mark}
                        </Txt>
                      </View>
                      <Txt
                        role="note"
                        tone={on ? "muted" : "dim"}
                        style={styles.seloLabel}
                        numberOfLines={1}
                      >
                        {selo.label}
                      </Txt>
                    </View>
                  );
                })}
              </View>
            </Band>
          </>
        ) : null}

        <View style={styles.leave}>
          <GhostCTA label="Sair" onPress={onLeave} />
        </View>
      </ScrollView>
    </Phone>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 8 },
  error: { paddingHorizontal: T.pad, paddingTop: 12 },

  selos: { flexDirection: "row", gap: 8, marginTop: 14 },
  seloCol: { flex: 1 },
  selo: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  seloOn: { backgroundColor: T.fill },
  seloOff: { borderWidth: 2, borderColor: T.fill },
  seloLabel: { marginTop: 6 },

  leave: { paddingHorizontal: T.pad, paddingTop: 24, paddingBottom: 16 },
});
