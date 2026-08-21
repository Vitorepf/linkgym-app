import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Figure } from "./Figure";
import { estilos, useTema } from "./tema";

/** A fila de pares do eixo 1: mesmo peso visual, um rótulo mudo em caps, o valor com a
 *  cor e o tamanho. Cada célula é uma Figure, então unidade e direção já vêm de graça — e
 *  ninguém precisa reinventar o par número/rótulo.
 *
 *  O conteúdo é CENTRADO na célula. Os fios dividem a largura em partes geometricamente
 *  iguais, mas com conteúdo à esquerda a linha lia torta — 36px antes da tinta, ~90px
 *  depois ("SONO sobra à direita, ENERGIA cola na esquerda"). Centrado, a folga fecha dos
 *  dois lados e a divisão que o fio faz é a que o olho lê. `node tools/grade.mjs` mede.
 *
 *  QUEM SEPARA DUAS CÉLULAS sai da SUPERFÍCIE escolhida, e não de um campo novo: é
 *  `FORMA.celula`. Em `solida` de canto reto é a grade de fios (o app de sempre); em
 *  `contorno` cada célula vira caixa; em `elevada` e `vidro` vira cartão. Fora da grade o
 *  vão que separa é `SPACE.tight`, o mesmo que a Band põe entre duas superfícies
 *  empilhadas — metade em cada vizinha, e o padding do conteúdo migra do vão para dentro
 *  da peça. Antes disto, sem grade as células simplesmente encostavam: a alavanca mais
 *  cara do cardápio não chegava à tela de número. */
type Cell = {
  label: string;
  value: string | number;
  /** legenda muda ao pé do número. NÃO é baseline — baseline exige número, e mora em
   *  src/ui/Baseline.tsx. */
  note?: string;
  unit?: string;
  /** moeda: o símbolo vem antes do algarismo. Ver `Figure`. */
  unitFirst?: boolean;
  dir?: "up" | "down" | "flat";
};

type Props = {
  cells: Cell[];
  /** quantas colunas a TELA pede. Pedido, e não verdade: quem responde é a aparência, que
   *  sabe o corpo do algarismo e a densidade. Ver `colunas` abaixo. */
  columns?: 2 | 3;
};

export function MetricGrid({ cells, columns = 2 }: Props) {
  const styles = usarEstilos();
  const { FORMA } = useTema();
  const naGrade = FORMA.celula.modo === "fio";
  // A LARGURA REAL, e não a da janela: a mesma grade aparece solta na rolagem e dentro de
  // uma Band com respiro, e a diferença entre as duas é exatamente a coluna que cabe ou
  // não cabe. A janela é o palpite do primeiro quadro; o layout corrige no mesmo.
  const janela = useWindowDimensions().width;
  const [largura, setLargura] = useState(janela);
  // O MAIOR NÚMERO DA FILA é quem manda. O default 4 de `colunas` é conservador de
  // propósito — errar para menos corta algarismo na tela de alguém —, mas cobrar quatro
  // algarismos de uma fila de "5" recusaria uma coluna que cabia folgada. Contamos
  // caractere, não dígito: o separador de milhar é mais estreito que o algarismo tabular,
  // então contá-lo como um dígito erra para o lado seguro.
  const digitos = Math.max(1, ...cells.map((c) => String(c.value).length));
  // A resposta ao estouro é RECUSAR a coluna, nunca encolher a fonte: fonte encolhida
  // quebra a catraca `escala` e é o que faz um app parecer template.
  const colunas = FORMA.numero.colunas(columns, largura, digitos);
  return (
    <View
      style={styles.grid}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {cells.map((cell, i) => {
        const lastCol = (i + 1) % colunas === 0;
        const lastRow = i >= cells.length - (cells.length % colunas || colunas);
        const figura = (
          <Figure
            value={cell.value}
            label={cell.label}
            unit={cell.unit}
            unitFirst={cell.unitFirst}
            note={cell.note}
            dir={cell.dir}
            role="value"
            center
          />
        );
        return (
          <View
            key={cell.label}
            style={[
              styles.cell,
              { width: `${100 / colunas}%` as `${number}%` },
              !lastCol && styles.right,
              !lastRow && styles.bottom,
            ]}
          >
            {naGrade ? (
              figura
            ) : (
              <View style={[styles.peca, styles.fioDaCelula]}>{figura}</View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) => {
  const { modo, tinta } = FORMA.celula;
  const naGrade = modo === "fio";
  // A CÉLULA SOLTA é a peça pequena que pousa DENTRO da superfície — a mesma coisa que o
  // chip e o campo de texto —, então ela lê a folha `miuda` e não re-deriva a superfície
  // aqui. O que a folha traz e o ternário local não trazia: o preenchimento anda de volta
  // até `muted` voltar ao piso de 4,5:1 (medido: o degrau cheio o derrubava para 3,66 no
  // tabaco), a peça miúda NUNCA ganha sombra — sombra é da superfície, não do chip — e
  // sobra o fio de luz como único sinal de altura, que é o que separa `elevada` de
  // `solida` nos dois mundos.
  const f = FORMA.folha.miuda;
  // Metade do vão em cada vizinha: duas peças fecham o mesmo SPACE.tight que separa duas
  // superfícies empilhadas. Na grade não existe — ali o fio já é a divisão.
  const meioVao = naGrade ? 0 : Math.round(SPACE.tight / 2);
  return StyleSheet.create({
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      // A régua sob a grade é da GRADE: embaixo de peças soltas ela vira um traço órfão.
      borderBottomWidth: naGrade ? FORMA.borda : 0,
      borderBottomColor: T.divider,
      // Peça de canto arredondado não encosta na borda da tela — o mesmo recuo da Band,
      // já descontado o respiro que a própria célula paga.
      marginHorizontal: Math.max(0, FORMA.inset - meioVao),
    },
    cell: {
      paddingHorizontal: naGrade ? T.pad : meioVao,
      // `SPACE.block`, e não 22. O 22 estava fora de qualquer degrau e, ao contrário do seu
      // par horizontal (`T.pad`, que a densidade remapeia), ele NUNCA andava: escolher
      // "arejada" engordava a célula 9pt na horizontal e 0 na vertical — a proporção da
      // célula de número mudava por baixo de uma alavanca que não é dela.
      paddingVertical: naGrade ? SPACE.block : meioVao,
      alignItems: "center",
      // A altura da fila é ditada pela célula MAIS ALTA, e a célula sem `note` colava no
      // topo dessa altura: um buraco embaixo do número, do tamanho exato da legenda que a
      // vizinha tem. Centrado nos dois eixos, a sobra fica metade em cima e metade
      // embaixo, e a fila lê como fila.
      justifyContent: "center",
    },
    right: {
      borderRightWidth: naGrade ? FORMA.fio : 0,
      borderRightColor: tinta,
    },
    bottom: {
      borderBottomWidth: naGrade ? FORMA.fio : 0,
      borderBottomColor: tinta,
    },
    // A célula solta responde ao chão do mesmo jeito que a Band responde ao dela — caixa
    // no contorno, cartão no resto —, mas com o teto da peça pequena: sem sombra em chão
    // nenhum, e com o fio de luz como único sinal de altura.
    peca: {
      // Preenche a célula nos dois eixos: sem isto, duas peças da MESMA fila terminam em
      // alturas diferentes quando só uma delas tem legenda — e uma fila de cartões tortos
      // é o que faz um app parecer montado no susto.
      flex: 1,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
      // O meio-vão que a célula já paga SAI do padding da peça: assim a distância de tinta
      // a tinta entre duas vizinhas continua sendo a mesma da grade de fios, em qualquer
      // densidade. Sem descontar, a peça de 1/3 de largura na densidade arejada gastava
      // 54pt de margem numa coluna de 120.
      paddingHorizontal: Math.max(0, T.pad - meioVao),
      paddingVertical: Math.max(0, SPACE.block - meioVao),
      borderRadius: FORMA.raio,
      backgroundColor: f.fundo,
      borderWidth: f.borda,
      // A ARESTA DA CAIXA É A TINTA DA CÉLULA, e não a da folha. As duas valem o mesmo
      // pixel no contorno (`chao.divider` nas duas pontas), mas só uma delas é a que o
      // medidor afere: a seção 9 mede `FORMA.celula.tinta` nos três modos, e este arquivo
      // só a punha nas bordas da grade de fios. Nos outros dois modos ela era medida e não
      // pintada — 21 dos 28 pares —, que é um verde falso: o dia em que `celula.tinta`
      // mudasse, a seção 9 continuaria verde e a tela sairia com outra cor.
      borderColor: modo === "caixa" ? tinta : f.corDaBorda,
      ...f.sombra,
    },
    // O fio de luz da célula, quando a folha não tem borda para ser a aresta. Não entra em
    // `peca` porque é borda de UM lado só: somado ali, o `borderWidth` de baixo viraria
    // linha embaixo do número em toda superfície levantada.
    fioDaCelula:
      f.aresta && !f.borda
        ? { borderTopWidth: FORMA.fio, borderTopColor: f.aresta }
        : {},
  });
});
