import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { withAlpha } from "../theme";
import { useTone } from "./motion";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  flex?: boolean;
  accent?: string;
};

export function Choice({ label, selected, onPress, flex, accent }: Props) {
  const styles = usarEstilos();
  const { T, FORMA, acento } = useTema();
  // Peça, não massa: chip de 52 px que se repete em fila. Ver o verbete `piece`.
  const { fill, ink } = acento(accent).piece;
  // O chip DESMARCADO é a peça pequena da superfície escolhida — a mesma folha do campo
  // de texto e da célula solta —, e não uma caixa de contorno cravada aqui. Onde a folha
  // não pinta nada (contorno, vidro) o ponto de partida continua sendo o acento a alfa
  // zero, e não `T.bg`: o chip pousa em chão variável e interpolar de "transparent" é o
  // que faz o RN atravessar o preto no meio da animação.
  const repouso = FORMA.folha.miuda;
  const tone = useTone(
    selected,
    repouso.fundo === "transparent" ? withAlpha(fill, 0) : repouso.fundo,
    fill,
  );

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={flex && styles.flex}
    >
      <Animated.View
        style={[
          styles.box,
          flex && styles.flexBox,
          tone,
          // A largura da borda não muda com o estado — o chip não pode pular 2pt ao ser
          // tocado. O que muda é a tinta: marcada, é o acento; em repouso, é a borda que a
          // folha declara, ou o próprio preenchimento dela quando a folha é cheia (aí quem
          // dá o contorno é o degrau de luz, e uma borda por cima seria um segundo).
          {
            borderColor: selected
              ? fill
              : repouso.corDaBorda === "transparent"
                ? repouso.fundo
                : repouso.corDaBorda,
          },
          // O FIO DE LUZ, que era o defeito: `elevada` e `solida` entregam a MESMA folha
          // miúda em tudo que este chip lia, e a aresta é o único campo em que elas
          // diferem — a peça pequena não ganha sombra em chão nenhum. Depois do
          // `borderColor` de propósito: o fio é do material, não do estado, e continua
          // sendo o fio mesmo com o chip marcado.
          styles.fio,
        ]}
      >
        {/* O rótulo do chip é TEXTO, não apoio: fica em `T.ink` e não em `folha.tinta`.
            A folha declara a tinta mais APAGADA que a peça suporta, e o que se lê num
            botão de escolha nunca é a mais apagada. */}
        <Txt role="body" color={selected ? ink : T.ink}>
          {label}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

const usarEstilos = estilos(({ SPACE, FORMA }) => {
  const f = FORMA.folha.miuda;
  return StyleSheet.create({
    box: {
      minHeight: FORMA.alturaChip,
      paddingHorizontal: SPACE.step,
      justifyContent: "center",
      // A espessura é a que a FOLHA declara, não a do traço que delimita uma superfície
      // grande. No vidro a folha miúda pede `fio` — metade —, e o chip desenhava o fio de
      // luz com o DOBRO da espessura do campo de texto ao lado dele, na mesma fila.
      borderWidth: f.borda,
      borderRadius: FORMA.raioAcao,
    },
    fio: f.aresta && !f.borda ? { borderTopWidth: FORMA.fio, borderTopColor: f.aresta } : {},
    flex: { flex: 1 },
    flexBox: { paddingHorizontal: 0, alignItems: "center" },
  });
});
