import type { ComponentProps } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

/** O CAMPO DE TEXTO, uma vez só.
 *
 *  Eram SETE cópias (Access, Turma, Convite, PerfilTime ×3, Publicar, Perfil, Aparência)
 *  do mesmo `StyleSheet` — e sete cópias de uma decisão divergem sempre na mesma direção:
 *  quatro delas cravavam o corpo do texto à mão em vez de `TYPE.body` (e eram esses os
 *  literais que a catraca `escala` contava, porque ela lê texto cru — inclusive comentário),
 *  três escolhiam `paddingHorizontal` diferente, e TODAS falavam a língua do `contorno`
 *  — caixa transparente com borda de divider — em qualquer superfície que o personal
 *  escolhesse. A alavanca mais cara do cardápio não chegava a nenhum campo do app.
 *
 *  Aqui ele pergunta a `FORMA.folha.miuda`, que é a resposta do tema para "a peça pequena
 *  que pousa DENTRO da peça": no sólido ela é preenchida (e o preenchimento é a única
 *  affordance de que se pode escrever ali), no contorno é caixa, no vidro é a aresta de
 *  luz. O placeholder é `folha.miuda.tinta` e não `T.muted`: `muted` é calibrado contra os
 *  QUATRO FUNDOS do chão, não contra o degrau que a peça preenchida acabou de criar — a
 *  folha é quem sabe qual é a tinta mais apagada que ainda escreve 4,5:1 ali dentro.
 *
 *  `label` é UMA string para os dois canais — o rótulo que se vê e o nome que o leitor de
 *  tela fala. Divergência entre os dois já foi apontada como defeito real neste app, e a
 *  única forma de ela não voltar é não existirem duas strings para escolher. */
type Props = Omit<ComponentProps<typeof TextInput>, "placeholderTextColor"> & {
  /** o nome acessível, sempre. `rotulo` mostra a MESMA string em cima. */
  label: string;
  rotulo?: boolean;
  /** a linha muda entre o rótulo e o campo — o que o valor faz, não o que ele é. */
  nota?: string;
  hint?: string;
  /** o que foi digitado não serve. Borda de aviso: é o único momento em que o campo
   *  ganha traço no sólido, porque aí o traço CARREGA informação. */
  erro?: boolean;
};

export function Campo({ label, rotulo, nota, hint, erro, style, ...rest }: Props) {
  const styles = usarEstilos();
  const { FORMA, errorInk } = useTema();
  const acima = rotulo || nota;
  return (
    <View style={style}>
      {rotulo ? <Txt role="label">{label}</Txt> : null}
      {nota ? (
        <Txt role="note" tone="dim" style={rotulo ? styles.nota : undefined}>
          {nota}
        </Txt>
      ) : null}
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={FORMA.folha.miuda.tinta}
        style={[
          styles.campo,
          acima && styles.abaixo,
          // O fio de luz é o ÚNICO sinal que separa `elevada` de `solida` na peça pequena
          // — ali a folha zera a sombra —, e o campo o descartava: em 7 de 7 chãos os
          // quatro campos que ele lia (`fundo`/`borda`/`corDaBorda`/`tinta`) saíam byte a
          // byte iguais nas duas superfícies. Fora do estado de ERRO: lá o traço carrega
          // informação, e `borderTopWidth` venceria o `borderWidth` do aviso num lado só.
          !erro && styles.fio,
          erro && { borderWidth: FORMA.borda, borderColor: errorInk },
        ]}
      />
    </View>
  );
}

const usarEstilos = estilos(({ T, SPACE, TYPE, FONTES, FORMA }) => {
  const f = FORMA.folha.miuda;
  return StyleSheet.create({
    nota: { marginTop: SPACE.hair },
    abaixo: { marginTop: SPACE.tight },
    campo: {
      color: T.ink,
      fontFamily: FONTES.texto,
      fontSize: TYPE.body,
      minHeight: FORMA.alturaChip,
      paddingVertical: SPACE.tight,
      paddingHorizontal: SPACE.tight,
      borderRadius: FORMA.raioAcao,
      backgroundColor: f.fundo,
      borderWidth: f.borda,
      borderColor: f.corDaBorda,
    },
    // Só onde a folha não tem borda para SER a aresta: no vidro ela já é o contorno
    // inteiro, e somar um segundo fio em cima dele seria dois traços na mesma aresta.
    fio: f.aresta && !f.borda ? { borderTopWidth: FORMA.fio, borderTopColor: f.aresta } : {},
  });
});
