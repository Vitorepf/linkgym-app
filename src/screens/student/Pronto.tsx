import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { today, type Person, type Studio, type TodayPayload } from "../../api";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { plannedSets } from "../../ui/format";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  onContinue: () => void;
};

/** O D0 do aluno tem QUATRO paradas — convite, Sobre você, Pronto, Estreia — e a barra
 *  do eixo 3 tem que estar visível em todas. Esta é a terceira. */
const STEPS = 4;
const HERE = 3;

/** "O que acontece agora": um número, uma instrução curta, um botão.
 *
 *  Eram três faixas de prosa de peso idêntico — nada dominava, e dois terços da tela
 *  ficavam vazios embaixo delas. ponytail: as três faixas morreram. O que sobrou é o que
 *  o aluno precisa saber antes do ritual começar: quanto dura a primeira sessão, e por
 *  onde a próxima chega. O nome dele e o "bem-vindo" saíram junto — a saudação não era o
 *  trabalho desta tela, e o nome longo comia duas linhas de título.
 *
 *  A instrução é UMA frase com UMA palavra no acento, e ela é o MOTIVO do botão: a
 *  permissão é emoldurada aqui, na tela do produto, antes de qualquer diálogo do sistema.
 */
export function Pronto({ token, studio, onContinue }: Props) {
  const accent = studio.accent_color || T.accentFallback;
  const A = accentSet(accent);
  const [pres, setPres] = useState<TodayPayload["prescription"]>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) setPres(payload.prescription);
      } catch {
        // ponytail: sem prescrição, sem número. A tela não desenha um 0 nem um "—" para
        // preencher buraco — número inventado é pior que número ausente.
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <Phone>
      <Head kicker={`${HERE} · ${STEPS}`} title="O que acontece agora" accent={accent}>
        {/* ponytail: barra estática. O traço é fino — marca, não massa — então não
            disputa o orçamento de acento com o botão. Feito x a fazer é ESPESSURA antes
            de ser tinta: no time 13 o acento e o divider caem no mesmo cinza, e uma
            barra codificada só por matiz não diz nada ali. */}
        <View
          style={styles.bar}
          accessible
          accessibilityLabel={`Passo ${HERE} de ${STEPS}`}
        >
          {Array.from({ length: STEPS }, (_, i) => (
            <View
              key={i}
              style={
                i < HERE
                  ? [styles.tick, styles.done, { backgroundColor: A.mark }]
                  : styles.tick
              }
            />
          ))}
        </View>
      </Head>

      <View style={styles.mid}>
        {pres ? (
          <Figure
            role="mega"
            label="Primeira sessão"
            value={pres.minutes}
            unit="min"
            note={`${pres.name} · ${pres.items.length} exercícios · ${plannedSets(pres.items)} séries`}
          />
        ) : null}
      </View>

      <Band rule="none">
        <Txt role="title">
          Toda sessão nova chega por{" "}
          <Txt role="title" color={A.text}>
            aviso
          </Txt>
          .
        </Txt>
      </Band>

      <DockFooter>
        {/* ponytail: expo-notifications não está instalado e dependência nova é proibida,
            então o toque só avança. O quadro — motivo dito primeiro, um botão, sempre o
            mesmo rótulo — é a parte que fica. Upgrade: chamar requestPermissionsAsync()
            aqui, antes do onContinue, no dia em que a dependência entrar. */}
        <AccentCTA label="Quero o aviso" onPress={onContinue} accent={accent} />
      </DockFooter>
    </Phone>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginTop: 14 },
  tick: { flex: 1, height: 1, backgroundColor: T.divider },
  done: { height: 3 },
  // O terço de baixo é da instrução e do botão. O número sobe do centro geométrico para
  // o terço óptico com o paddingBottom — centrado exato ele FLUTUA, com vão igual em
  // cima e embaixo, e vão igual não compõe nada.
  mid: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: T.pad,
    paddingBottom: 96,
  },
});
