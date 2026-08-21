import { StyleSheet, View } from "react-native";
import { SPACE, UNIDADE_DE, folgaDaUnidade } from "../theme";
import { TrendMark } from "./Icons";
import { useTema } from "./tema";
import { Txt } from "./Txt";

/** As camadas que o número do eixo 1 carrega e o nosso não carregava. O ArcGauge entregava
 *  DUAS (número + rótulo); esta peça entrega CINCO e não inventa tela nenhuma:
 *    número · unidade · rótulo · direção · legenda
 *  (decomposição = uma fila de Figures; causa e ação são prosa e botão, da Fase 2.)
 *
 *  A UNIDADE é um nível tipográfico próprio, nunca parte da string do número, e SOME
 *  quando não existe — `85 %` leva unidade, `14.2` não leva. Ela cai exatamente dois
 *  degraus abaixo do número, o que a escala de razão 1,5 entrega de graça (≈45%), e o
 *  degrau sai de `UNIDADE_DE` em theme.ts: é a mesma tabela que o medidor lê.
 *
 *  Os dois níveis pousam na MESMA BASE, e a folga entre eles é proporcional ao corpo
 *  (`folgaDaUnidade`) — os dois defeitos que esta peça carregava desde que nasceu, e que
 *  `node tools/aparencia.mjs` agora mede por voz e por papel.
 *
 *  A BASELINE de verdade NÃO mora aqui: ela exige um número real ancorado na posição real
 *  do eixo, e isso é `src/ui/Baseline.tsx`. O que sobra aqui é `note` — legenda muda ao pé
 *  do número, prosa e nada mais. O slot antigo chamava-se `baseline` e aceitava string
 *  solta: era por ali que "MÉDIA" entrava sem nenhum número atrás. */
type Props = {
  value: string | number;
  label: string;
  unit?: string;
  /** MOEDA. O símbolo de dinheiro vem ANTES do algarismo em português, e sem este slot ele
   *  só tinha um lugar para morar: dentro do rótulo ("Receita do mês · R$"), que é o
   *  mesmo defeito que a `unit` existe para consertar — unidade virando string de outro
   *  nível tipográfico. */
  unitFirst?: boolean;
  /** legenda muda ao pé do número. Ela NÃO crava o tom: `note` nasce em `muted`, e `muted`
   *  é a única das três tintas que TODA folha deste produto suporta por construção — a
   *  peça preenchida só existe enquanto `preenchimentoMiudo` a mantém em 4,5:1, e a folha
   *  nunca declara tinta de apoio mais fraca do que aquela que ela aguenta. `dim` é
   *  `muted2`, que é calibrado contra os QUATRO FUNDOS e não contra o pixel da peça: era
   *  isso que a Figure escrevia dentro de toda célula preenchida de MetricGrid — 14 dos 84
   *  pares abaixo do piso, pior 3,34 no breu. A régua está na seção 30 de
   *  tools/aparencia.mjs, e ela lê deste arquivo o tom que esta peça declara. */
  note?: string;
  dir?: "up" | "down" | "flat";
  role?: "value" | "hero" | "mega";
  /** força o rótulo abaixo do número. Quem decide isto normalmente é a APARÊNCIA
   *  (`FORMA.numero.modo === "cartaz"`); a prop continua existindo como escape para a tela
   *  que precise do cartaz mesmo num tema empilhado. */
  labelBelow?: boolean;
  center?: boolean;
};

export function Figure({
  value,
  label,
  unit,
  unitFirst,
  note,
  dir,
  role = "value",
  labelBelow,
  center,
}: Props) {
  const { T, TYPE, SPACE, FORMA } = useTema();
  const { modo, rotuloAbaixo } = FORMA.numero;
  // O cartaz é do TEMA, e a prop é o escape: era o contrário de hoje — `labelBelow` existia
  // desde que a peça nasceu e NENHUMA das 24 chamadas passava, ou seja, meia anatomia morta
  // no código. Quem liga é a aparência escolhida pelo personal.
  const abaixo = labelBelow ?? rotuloAbaixo;
  const uni = unit ? (
    <Txt role={UNIDADE_DE[role]} tone="muted">
      {unit}
    </Txt>
  ) : null;
  // Sem `center` aqui: numa fila, `alignItems` é o eixo VERTICAL, e o
  // `center && styles.center` que morava nesta linha não centrava nada na horizontal —
  // quem faz isso é a coluna de fora, que encolhe a fila e a centra. O que ele fazia era
  // sobrescrever o alinhamento e pendurar a unidade no MEIO da altura do algarismo, em
  // toda célula de MetricGrid — que é onde a Figure quase sempre aparece.
  const line = (
    <View style={[styles.line, { gap: folgaDaUnidade(TYPE[role]) }]}>
      {unitFirst ? uni : null}
      <Txt role={role}>{value}</Txt>
      {unitFirst ? null : uni}
      {/* Sem caixa em volta: a seta é irmã do algarismo e pousa na MESMA base que ele. O
          `paddingBottom` que ela tinha era compensação do alinhamento por fundo de caixa —
          com a base comum, ele vira o deslocamento que ele mesmo devia corrigir. */}
      {dir ? (
        <TrendMark dir={dir} color={T.muted} size={Math.round(TYPE[role] * 0.28)} />
      ) : null}
    </View>
  );

  // `linha`: o rótulo vira PROSA à esquerda e o número encosta na direita — a anatomia de
  // tabela, para o personal que quer o app lendo como planilha e não como painel. Ela só é
  // honesta porque os três papéis desta peça (value/hero/mega) usam `FONTES.numero`, a face
  // com dígito de largura fixa: numa face sem `tnum` a borda direita dançaria a cada
  // algarismo, e uma coluna que dança não é coluna. `note` desce para baixo da fila inteira,
  // e não para dentro dela: dois textos empilhados dentro de uma linha de base comum
  // arrastariam o número para o meio da altura do par.
  if (modo === "linha") {
    return (
      <View style={styles.tabela}>
        <View style={[styles.fila, { gap: SPACE.tight }]}>
          <Txt role="body" tone="muted" style={styles.rotuloDaFila}>
            {label}
          </Txt>
          {line}
        </View>
        {note ? (
          <Txt role="note" style={styles.note}>
            {note}
          </Txt>
        ) : null}
      </View>
    );
  }

  // Texto que QUEBRA linha ocupa a caixa inteira e alinha à esquerda por padrão: numa
  // célula centrada isso desloca a tinta. O textAlign acompanha o center.
  const alignText = center ? styles.centerText : undefined;
  return (
    <View style={center ? styles.center : undefined}>
      {abaixo ? null : (
        <Txt role="label" style={alignText}>
          {label}
        </Txt>
      )}
      {line}
      {abaixo ? (
        <Txt role="label" style={alignText}>
          {label}
        </Txt>
      ) : null}
      {/* O VÃO DEPENDE DE QUEM ESTÁ EM CIMA, e era um literal `4` para os dois casos.
          Sob o NÚMERO (42 a 86 de entrelinha sobre um algarismo de 41 a 92) já sobra branco
          de sobra e 4 basta. Sob o RÓTULO — o caso `abaixo`, que é `cartaz` e as três
          chamadas com `labelBelow` — são duas linhas de 12pt/16 de entrelinha coladas: 4pt
          de margem sobre 4pt de folga da linha, e o par lê como um parágrafo só. Rótulo e
          legenda são duas linhas do MESMO objeto, e a distância entre duas linhas do mesmo
          objeto é `SPACE.hair` — o único degrau que o tema declara que NUNCA anda com a
          densidade, justamente por não ser gosto.
          Isto importa mais aqui do que parece: os outros dois canais que separam rótulo de
          legenda são caixa alta e tracking, e o primeiro deles é do CONTEÚDO. A legenda do
          Recorde é `+2,5 kg` — dois caracteres de caixa em oito —, e ali a caixa alta quase
          não separa nada. */}
      {note ? (
        <Txt role="note" style={[styles.note, abaixo ? { marginTop: SPACE.hair } : null, alignText]}>
          {note}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // BASE, e não fundo de caixa. `flex-end` alinha o rodapé das duas caixas de linha, e a
  // sobra abaixo da letra é diferente em cada degrau (meia-folga da entrelinha + descida
  // da face): as duas bases nunca coincidiam, e o erro trocava de sinal conforme a voz.
  line: { flexDirection: "row", alignItems: "baseline" },
  // A fila ocupa a célula inteira: sem o stretch, a `alignItems: center` da MetricGrid
  // encolheria a linha ao tamanho do conteúdo e o número pararia no meio da tela, que é
  // exatamente o que o modo tabela não é.
  tabela: { alignSelf: "stretch" },
  fila: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  rotuloDaFila: { flexShrink: 1 },
  center: { alignItems: "center" },
  centerText: { textAlign: "center" },
  // A LEGENDA respira o degrau mínimo, e não metade dele. Quatro pontos debaixo de um
  // número que pode medir 92 é a legenda encostada — e este é o par que mais aparece no
  // app, porque toda célula de número o desenha.
  note: { marginTop: SPACE.hair },
});
