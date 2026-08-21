import { StyleSheet, View } from "react-native";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

/** BASELINE DE VERDADE.
 *
 *  Dois juízes independentes bateram no mesmo ponto: sob o medidor da Hoje havia uma
 *  régua `0 — MÉDIA — 100` com a palavra MÉDIA CENTRALIZADA, ou seja, exatamente onde o
 *  eixo lê 50. Lia-se "a média é 50". Média de quem? Ninguém sabia, porque não havia
 *  número nenhum atrás daquilo.
 *
 *  Uma baseline falsa é PIOR que nenhuma. Então esta peça:
 *    - EXIGE um número real (`value`), tipado, não uma string de prosa;
 *    - ancora esse número na POSIÇÃO real dele no eixo, não no meio;
 *    - DIZ o número junto do rótulo, para a âncora poder ser conferida;
 *    - e, se o chamador não tiver o valor, ele não passa `baseline` e nada é desenhado.
 *      Não desenhar é a resposta certa — não existe placeholder de baseline.
 *
 *  Hoje é o caso vivo disso: /v1/today devolve `prontidao.score` e mais nada com que
 *  comparar, então a Prontidão fica SEM baseline até a API mandar uma. A camada continua
 *  faltando; o que sumiu foi a mentira. */
type BaselineSpec = {
  /** o número contra o qual a métrica está sendo comparada. Sem ele, sem baseline. */
  value: number;
  /** de quem é este número: "MÉDIA ATÉ ONTEM", "SUA MÉDIA DE 7 DIAS". */
  label: string;
};

// ponytail: eixo fixo 0–100. Os dois chamadores são prontidão, e um eixo configurável era
// três props que ninguém nunca passou. Volta a ser parâmetro no dia do primeiro caso real.
const MIN = 0;
const MAX = 100;

export function Baseline({ value, label }: BaselineSpec) {
  const styles = usarEstilos();
  // A SEGUNDA COR ganha aqui o único papel que ela pode ter: SEGUNDA SÉRIE. Esta peça
  // desenha a série de REFERÊNCIA (a média) ao lado da série MEDIDA (o número do dia), e
  // até agora pintava a referência com os mesmos dois neutros que o resto da tela usa —
  // duas séries no mesmo eixo de tom, distinguidas só por posição. O matiz aqui não
  // significa "bom" nem "ruim": significa "esta é a outra".
  // O chão é `raised`: é o fundo DIFÍCIL da paleta nos sete chãos, então o piso limpo
  // contra ele está limpo contra os quatro.
  const { T, secundaria, acento } = useTema();
  const ref = acento(secundaria, T.raised);
  // ponytail: fora do eixo não é baseline, é ruído — some, mesmo com valor.
  if (!Number.isFinite(value) || value < MIN || value > MAX) return null;
  const t = (value - MIN) / (MAX - MIN);

  return (
    <View style={styles.wrap}>
      <View style={styles.axis}>
        <Txt role="label" tone="dim">
          {MIN}
        </Txt>
        <Txt role="label" tone="dim">
          {MAX}
        </Txt>
      </View>
      <View style={styles.rule} />
      <View style={[styles.anchor, { left: `${t * 100}%` }]}>
        <View style={[styles.tick, { backgroundColor: ref.mark }]} />
        <Txt role="label" color={ref.text} style={styles.num}>
          {value}
        </Txt>
        <Txt role="label" tone="dim" numberOfLines={1}>
          {label}
        </Txt>
      </View>
    </View>
  );
}

// ponytail: caixa de largura fixa centrada na fração, em vez de medir o texto com
// onLayout. Teto conhecido: com o valor muito perto de 0 ou de 100 o rótulo passa da
// margem da faixa. Upgrade quando incomodar: onLayout na régua e no rótulo, e grudar o
// rótulo na ponta em vez de centrar.
const ANCHOR = 160;

const usarEstilos = estilos(({ T, FORMA, SPACE, LEAD }) =>
  StyleSheet.create({
    // O RODAPÉ RESERVA A ÂNCORA, e agora ele SABE quanto ela mede: duas linhas de rótulo
    // mais o tique. Era 38 cravado — um número que ninguém podia conferir e que não andava
    // quando a voz escolhida tinha entrelinha maior, ou seja, o rótulo da âncora escapava
    // da reserva justamente nas vozes que precisam de mais espaço.
    wrap: { marginTop: SPACE.tight, paddingBottom: LEAD.label * 2 + SPACE.hair },
    axis: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: SPACE.hair,
    },
    // O EIXO é elemento de UI, não fio interno de bloco: é ele que dá lugar ao número, e
    // um eixo que não se vê transforma a âncora em um traço solto no vazio. `T.hairline`
    // media 1,23:1 contra o chão — abaixo do piso 3 —, e a espessura era 1 cravado,
    // ignorando o traço que o personal escolheu.
    rule: { height: FORMA.fio, backgroundColor: T.divider },
    anchor: {
      position: "absolute",
      top: 22,
      width: ANCHOR,
      marginLeft: -ANCHOR / 2,
      alignItems: "center",
    },
    tick: { width: 2, height: 9 },
    num: { letterSpacing: 0 },
  }),
);
