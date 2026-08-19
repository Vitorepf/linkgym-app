import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { mediaUrl } from "../api";
import { ANEL_DO_ROSTO, withAlpha } from "../theme";
import { initials } from "./format";
import { useTema } from "./tema";
import { Txt } from "./Txt";

type Props = {
  name: string;
  /** foto (URL presignada). Ganha de tudo. */
  url?: string;
  /** avatar sem foto: cor de fundo das iniciais, escolhida pela Pessoa. */
  color?: string;
  accent?: string;
  fill?: boolean;
  size?: number;
};

/** O ROSTO em três degraus: foto > cor escolhida > iniciais — o degrau de cima só
 *  existe se a Pessoa o criou, e o de baixo nunca falha. Quadrado como a Initials
 *  (canto reto é a linguagem da marca) e do mesmo tamanho de peça: 34–54 px. */
export function Avatar({ name, url, color, accent, fill, size = 34 }: Props) {
  // O ROSTO acompanha a família de forma: quadrado no reto (a linguagem de hoje), macio
  // no macio, CÍRCULO na pílula. Sem isto, escolher "pílula" arredondava o botão e
  // deixava o avatar em canto vivo ao lado dele — o defeito clássico de tema meia-boca.
  const { T, FORMA, acento } = useTema();
  const raio = FORMA.raioEm(size);
  // Foto que FALHA cai para o degrau de baixo, nunca para o nada: uma <Image> quebrada
  // em fundo escuro é invisível — foi exatamente o defeito que este fallback mata.
  const [broke, setBroke] = useState(false);
  const src = mediaUrl(url);
  if (src && !broke) {
    return (
      // A FOTO é a única superfície do app que o sistema não pintou, e por isso era a
      // única sem fronteira: logo PNG de fundo branco em chão claro terminava onde
      // ninguém via. O anel é tinta translúcida — ele compõe sobre o fundo em que o rosto
      // pousou, então existe nos sete chãos sem precisar saber em qual pousou.
      <Image
        source={{ uri: src }}
        onError={() => setBroke(true)}
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: raio,
            borderWidth: FORMA.fio,
            borderColor: withAlpha(T.ink, ANEL_DO_ROSTO),
          },
        ]}
        accessibilityIgnoresInvertColors
      />
    );
  }
  if (color) {
    // a cor escolhida passa pelo MESMO motor de peça do acento: fundo legível nos
    // quatro chãos e tinta que existe sobre ele — um avatar preto continua com letra.
    const pc = acento(color).piece;
    return (
      <View
        style={[
          styles.box,
          styles.center,
          { width: size, height: size, backgroundColor: pc.fill, borderRadius: raio },
        ]}
      >
        <Txt role="label" color={pc.ink} style={styles.letters}>
          {initials(name)}
        </Txt>
      </View>
    );
  }
  const ac = acento(accent).piece;
  return (
    <View
      style={[
        styles.box,
        styles.center,
        {
          width: size,
          height: size,
          backgroundColor: fill ? ac.fill : T.fill,
          borderRadius: raio,
        },
      ]}
    >
      <Txt role="label" color={fill ? ac.ink : T.ink} style={styles.letters}>
        {initials(name)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexShrink: 0 },
  center: { alignItems: "center", justifyContent: "center" },
  letters: { letterSpacing: 0 },
});
