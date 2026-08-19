import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { pressedFill } from "../theme";
import { useTone, useEdgeTone } from "./motion";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** O FUNDO REAL onde este botão pousa — `T.bg`, `FORMA.folha.peca.composto` dentro de
   *  uma Band, `FORMA.folha.chrome.composto` num rodapé de ação. Quem escolhe é a TELA,
   *  porque só ela sabe onde montou a peça, e a hierarquia `parelha` deriva o
   *  preenchimento dele a partir daqui: sem o fundo verdadeiro, um secundário dentro de
   *  uma Band levantada pousa com metade do degrau que ele precisa e some no cartão. */
  fundo?: string;
  /** `perigo` é declarado pela TELA, não adivinhado pelo rótulo: "Sair" e "Voltar" são
   *  hoje pixel a pixel o mesmo botão, e um deles derruba a sessão. */
  tom?: "neutro" | "perigo";
};

export function GhostCTA({ label, onPress, disabled, fundo, tom }: Props) {
  const styles = usarEstilos();
  const [down, setDown] = useState(false);
  const { T, MOTION, FORMA, secundario, errorInk } = useTema();
  const chao = fundo ?? T.bg;
  const s = secundario(chao);
  // PERIGO NÃO PINTA ÁREA. Ele é borda e tinta, e nada mais: uma caixa cheia de vermelho
  // é o segundo elemento da tela reivindicando o orçamento de acento que o AccentCTA já
  // tem. E ele volta ao CONTORNO mesmo sob `parelha`, porque `errorInk` é calibrado
  // contra os quatro fundos do produto — sobre um preenchimento derivado em tempo de
  // execução ele viraria um par de cores que medidor nenhum olhou.
  const perigo = tom === "perigo";
  const preenchido = !perigo && s.fundo !== "transparent";
  const corDaBorda = perigo ? errorInk : s.borda;
  const tinta = disabled ? s.desligada : perigo ? errorInk : s.tinta;
  // Onde há massa, o aperto é a MASSA que muda; onde não há, é a borda. Sem esta metade a
  // hierarquia `parelha` entregava um botão cheio cujo único sinal de toque era uma borda
  // transparente escurecendo — um contorno preto brotando no aperto, que é pior que nada.
  const massa = useTone(
    down && !disabled,
    preenchido ? s.fundo : T.fill,
    pressedFill(preenchido ? s.fundo : T.fill, tinta),
    MOTION.press,
  );
  const aresta = useEdgeTone(down && !disabled, corDaBorda, T.ink, MOTION.press);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
    >
      {/* Desligado é a TINTA descendo um degrau, não o botão inteiro a 35%: naquela
          opacidade o rótulo caía para ~3,3:1 e a borda sumia junto. Isto acontece com o
          "Descansar" do Descanso e o "Agora não" da Retomada, que nascem desligados —
          e o degrau vem do PAR (`s.desligada`), não de `T.muted` escolhido aqui: sob
          `parelha` o botão pousa num preenchimento derivado que token nenhum do produto
          conhece, e ali o rótulo apagado media 1,00:1 em 441 de 630 paletas. */}
      <Animated.View
        style={[
          styles.btn,
          // A espessura vem do par de ações, não do peso solto: `eco` recua para o fio e
          // `parelha` mantém a borda no layout com a cor apagada, e as duas contas moram
          // em `Tema.secundario` para o medidor ler o MESMO objeto que a tela pinta.
          { borderWidth: perigo ? FORMA.borda : s.larguraDaBorda },
          preenchido ? massa : { backgroundColor: "transparent" },
          preenchido ? { borderColor: s.borda } : aresta,
        ]}
      >
        <Txt role="body" color={tinta} style={styles.label}>
          {FORMA.acao.caixaAlta ? label.toUpperCase() : label}
        </Txt>
      </Animated.View>
    </Pressable>
  );
}

const usarEstilos = estilos(({ SPACE, TRACK, FORMA }) =>
  StyleSheet.create({
    btn: {
      paddingVertical: SPACE.step,
      paddingHorizontal: SPACE.step,
      minHeight: FORMA.alturaAcao,
      justifyContent: "center",
      alignItems: FORMA.acao.alinha,
      borderRadius: FORMA.raioAcao,
    },
    label: { letterSpacing: TRACK.body + FORMA.acao.tracking },
  }),
);
