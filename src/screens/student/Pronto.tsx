import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { today, type Person, type Time, type TodayPayload } from "../../api";
import { accentSet, productTheme as T } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { plannedSets } from "../../ui/format";
import { Band, D0_STEPS, DockFooter, Head, Phone, StepRail } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  time: Time;
  onContinue: () => void;
};

/** Penúltima parada do D0. A contagem e a barra são as de `StepRail`, uma só para as oito
 *  paradas — aqui não se inventa denominador. */
const HERE = D0_STEPS - 1;

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
export function Pronto({ token, time, onContinue }: Props) {
  const accent = time.accent_color || T.accentFallback;
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
      <Head kicker={`${HERE} · ${D0_STEPS}`} title="O que acontece agora" accent={accent}>
        <StepRail accent={accent} now={HERE} />
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
