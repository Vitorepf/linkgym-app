import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FinishRecord } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { formatKg } from "../../ui/format";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos } from "../../ui/tema";
import { Troca } from "../../ui/Troca";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Recorde">;

/** O PR é DA PESSOA num EXERCÍCIO. A tela antiga dizia `127.5 / KG` e mais nada: número
 *  sem dono (que exercício?) e sem baseline conferível — o recorde anterior aparecia
 *  riscado, que é marca de falha justo na tela de comemoração.
 *
 *  As cinco camadas do número moram aqui: exercício (título), número (mega), unidade,
 *  direção (forma, nunca matiz) e a baseline com o valor dito — o recorde ANTERIOR da
 *  pessoa. Sem valor anterior, a baseline não é desenhada: em vez dela, o fato honesto
 *  ("primeiro neste exercício"), que é ausência de marca, não marca inventada.
 *
 *  ponytail: `src/ui/Baseline.tsx` não serve AQUI e não é esquecimento. O eixo dela é
 *  min..max e o recorde anterior de um PR fica sempre a um passo do novo (120 de 127,5 =
 *  94%), então a âncora nasceria colada na borda direita — o teto que o próprio arquivo
 *  declara. A baseline vira o rótulo sob o número, com o número dito. */
export function Recorde({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { records, needsCommitment } = route.params;
  // O herói é o MAIOR número da lista, não o primeiro: com a ordem do servidor, um PR de
  // 127,5 podia cair na lista de baixo com 62,5 no corpo mega. Hierarquia invertida.
  const [top, ...rest] = [...records].sort((a, b) => b.load_kg - a.load_kg);
  const before = olderLoad(top);
  const gain = before === null ? null : Math.round((top.load_kg - before) * 10) / 10;
  const baseline =
    before === null ? "Primeiro neste exercício" : `Antes: ${formatKg(before)} kg`;

  // O número de AGORA. Ele é quem manda no layout da troca — a caixa tem a altura dele do
  // primeiro ao último quadro, e o rótulo não anda quando a substituição acontece.
  const agora = top ? (
    <Figure
      role="mega"
      value={formatKg(top.load_kg)}
      unit="kg"
      dir={before === null ? undefined : "up"}
      labelBelow
      label={baseline}
      note={gain === null ? undefined : `+${formatKg(gain)} kg`}
    />
  ) : null;

  return (
    <Phone>
      <Head
        kicker="Recorde"
        title={top ? top.exercise_name : "Nada novo hoje"}
      />

      {/* O vazio era dividido em dois — e os dois ficavam no chão nu, 194pt e 189pt sem
          dono, com o número boiando entre eles. Agora a folga é o respiro INTERNO da
          superfície do recorde: mesmo pixel vazio, com dono e com fundo. */}
      <Band raised grow rule="none">
        {top ? (
          <View
            accessible
            accessibilityLabel={`${formatKg(top.load_kg)} quilos. ${baseline}.`}
          >
            {/* A CONQUISTA É O NÚMERO TROCANDO DE LUGAR CONSIGO MESMO. O teto anterior —
                `previous_kg`, lido de personal_records, não estimado — abre a tela em corpo
                mega e é SUBSTITUÍDO pelo de agora. A tela dizia a mesma coisa com os dois
                números parados, um em mega e o outro em rótulo: o fato estava lá, o momento
                não. Sem recorde anterior não há troca — primeira vez no exercício não ganha
                teatro inventado, e o rótulo abaixo do número segue dizendo o fato inteiro
                para quem chegou depois da animação ou desligou movimento. */}
            {before === null ? (
              agora
            ) : (
              <Troca
                antes={
                  <Figure
                    role="mega"
                    value={formatKg(before)}
                    unit="kg"
                    labelBelow
                    label="Seu recorde até hoje"
                  />
                }
                depois={agora}
              />
            )}
          </View>
        ) : null}

        {/* Um recorde não zera com a ausência — ele é o único patrimônio do produto que a
            Retomada não toca. E quem monta a sessão RECEBE este número hoje
            (`ReturnItem.Records`, internal/owner/service.go:121): é fato do sistema, dito
            pelo produto. Nada aqui é assinado por ele. */}
        <Txt role="body" tone="muted" style={styles.copy}>
          Este recorde é seu e não zera. Quem monta sua sessão vê isso hoje.
        </Txt>
      </Band>

      {rest.length > 0 ? (
        <Band raised rule="none">
          <Txt role="label">Também hoje</Txt>
          {rest.map((row) => {
            const older = olderLoad(row);
            return (
              <View key={row.exercise_name} style={styles.row}>
                <View style={styles.rowName}>
                  <Txt role="body">{row.exercise_name}</Txt>
                  {older !== null ? (
                    <Txt role="note" tone="dim">
                      Antes: {formatKg(older)} kg
                    </Txt>
                  ) : null}
                </View>
                <Txt role="body">{formatKg(row.load_kg)} kg</Txt>
              </View>
            );
          })}
        </Band>
      ) : null}

      <DockFooter>
        {/* ponytail: o acento em ÁREA desta tela é este botão, e ele basta. A virada de
            fundo da comemoração já aconteceu na Feito, um toque atrás; repetir aqui seria
            o segundo reivindicante do orçamento. */}
        <AccentCTA
          label="Seguir"
          onPress={() => {
            if (needsCommitment) {
              navigation.navigate("Compromisso");
              return;
            }
            navigation.reset({
              index: 0,
              routes: [studentHomeTarget],
            });
          }}
        />
      </DockFooter>
    </Phone>
  );
}

function olderLoad(row: FinishRecord | undefined): number | null {
  if (!row || !(row.previous_kg > 0) || row.previous_kg >= row.load_kg) {
    return null;
  }
  return row.previous_kg;
}

const usarEstilos = estilos(({ SPACE }) =>
  StyleSheet.create({
    copy: { marginTop: SPACE.room },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    rowName: { flex: 1, minWidth: 0 },
  }),
);
