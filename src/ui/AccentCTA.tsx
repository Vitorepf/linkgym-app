import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { pressedFill } from "../theme";
import { useAccentMass } from "./accent";
import { IconCheck, IconChevron } from "./Icons";
import { useTone } from "./motion";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

/** O único botão cheio do app, e o dono natural do acento em MASSA: massa proporcional à
 *  ação e o custo DENTRO do botão ("52 MIN"). PrimaryButton era ~90% este arquivo e
 *  morreu; `block` veio de lá.
 *
 *  Reivindica o orçamento de acento da tela. Se um segundo elemento pintar área com o
 *  acento na mesma tela, o console grita com os dois nomes e tools/shots.mjs reprova. */
type Props = {
  label: string;
  onPress: () => void;
  accent?: string;
  meta?: string;
  disabled?: boolean;
  busy?: boolean;
  check?: boolean;
  block?: boolean;
  /** Encolhe até o rótulo. O padrão é a largura do pai — "Mandar a retomada de 9
   *  minutos" numa pílula de 120pt vira a merda que o dono fotografou. */
  fit?: boolean;
  /** ação repetida numa lista: mesma massa, tinta neutra, e não gasta o orçamento. */
  quiet?: boolean;
};

export function AccentCTA({
  label,
  onPress,
  accent,
  meta,
  disabled,
  busy,
  check,
  block,
  fit,
  quiet,
}: Props) {
  const styles = usarEstilos();
  const mass = useAccentMass(`AccentCTA "${label}"`, accent, !quiet);
  const { T, MOTION, FORMA } = useTema();
  const off = disabled || busy;
  // Desligado NÃO é o acento a 35% de opacidade: naquela conta o preenchimento e o rótulo
  // caem JUNTOS para o chão, e o maior elemento da tela vira um bloco ilegível. Quem pagou
  // foi o "Salvar" do Perfil do personal, que fica desligado o tempo inteiro em que não há
  // o que salvar — a tela abria com o bloco mais gritante dela morto e sem letra.
  // Sem o que fazer, o botão é NEUTRO e legível (muted sobre fill, 4,87:1); quando há, ele
  // ACENDE na cor do personal. `busy` segue com o acento: ali a ação está acontecendo.
  /** A cara do botão sem ação possível: um PAR preenchimento/tinta, a mesma forma que
   *  `useAccentMass` devolve para quem não reivindica o acento. */
  /** DESLIGADO NÃO GANHA CONTORNO. Ele tinha `ring: T.divider`, e o resultado media assim:
   *  o botão LIGADO é acento chapado sem borda nenhuma, e o DESLIGADO ganhava uma borda de
   *  2pt em volta — ou seja, o controle ganhava um contorno visível exatamente quando
   *  parava de funcionar, e passava a ler como quebrado em vez de esperando.
   *  Quem carrega o estado é o preenchimento, que já separa 14,9 de L* do chão. */
  const DESLIGADO = { fill: T.fill, ink: T.muted, ring: "" };
  /** SÓ CAPTURA, e some junto com a decisão do dono — não é alavanca, não passa pelo
   *  cardápio da Aparência. Mesmo desenho do `__bandRaised` da Band.
   *
   *  A pergunta que ela existe para responder: numa fila de três ações iguais, o
   *  `quiet` continua sendo uma CAIXA CHEIA de 56pt de largura inteira. Ele perde o
   *  acento e mantém a massa — ação secundária vestindo o corpo de uma primária. O
   *  contorno tira a massa sem tirar um ponto do alvo de dedo, que é o que não pode
   *  encolher. */
  const CONTORNO =
    (globalThis as unknown as { __ctaQuietContorno?: boolean }).__ctaQuietContorno === true;
  const SILENCIADO = { fill: T.bg, ink: T.ink, ring: T.divider };
  const { fill, ink, ring } =
    disabled && !busy ? DESLIGADO : quiet && CONTORNO ? SILENCIADO : mass;
  const [down, setDown] = useState(false);
  // O botão não salta: o tom do MESMO elemento muda, e sempre para longe da tinta —
  // o rótulo não perde contraste enquanto o dedo está em cima.
  const tone = useTone(down && !off, fill, pressedFill(fill, ink), MOTION.press);

  /** O rótulo e o custo. Na anatomia `empilhada` eles viram as DUAS LINHAS de uma coluna;
   *  nas outras, dois itens da mesma linha. É o mesmo par nos dois casos porque `empilhada`
   *  não é um botão diferente — é a mesma peça em outra ordem. */
  const miolo = (
    <>
      <Txt role="body" color={ink} style={[styles.label, fit && styles.labelFit]}>
        {FORMA.acao.caixaAlta ? label.toUpperCase() : label}
      </Txt>
      {meta ? (
        <Txt role="label" color={ink}>
          {meta}
        </Txt>
      ) : null}
    </>
  );

  return (
    <Pressable
      // `busy` NÃO desliga mais o Pressable: `disabled` faz o leitor de tela anunciar
      // "desativado" durante o salvamento, que é falso — a ação está ACONTECENDO, e quem
      // ouve isso entende que o toque não pegou e toca de novo. `busy` é o estado ARIA que
      // existe exatamente para isto; o toque repetido morre no `onPress` indefinido.
      onPress={off ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!busy }}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      style={fit ? styles.fit : block ? styles.block : undefined}
    >
      <Animated.View
        style={[
          styles.btn,
          fit && styles.btnFit,
          tone,
          // O ANEL entra SEMPRE no layout, mesmo sem ser pintado. Enquanto a borda só
          // existia quando `ring` existia, a caixa de conteúdo encolhia 2pt no instante em
          // que o botão ACENDIA (desligado → ligado troca o par, e com ele o anel), e o
          // rótulo pulava. Reservar a espessura e apagar a COR custa zero pixel e não tem
          // estado nenhum. Ver `Anel` em src/theme.ts: com `sempre` o anel é declarado, com
          // `resgate` ele só aparece quando o preenchimento não se separa do chão.
          { borderWidth: FORMA.borda, borderColor: ring || "transparent" },
        ]}
      >
        {/* A COLUNA FANTASMA. Com o rótulo centrado, o custo só existia à direita: o
            `flex: 1` do rótulo comia toda a sobra e o texto centrava na PORÇÃO
            ESQUERDA do botão — meia coluna fora do centro, visível em qualquer kit de
            ação centrada com um "52 MIN" no botão. Reservar a mesma coluna à esquerda
            devolve o rótulo ao centro do BOTÃO. É o próprio `meta`, na mesma face e no
            mesmo degrau, porque texto igual mede igual: nada a medir em tempo de
            execução, e nenhuma largura cravada para envelhecer. */}
        {FORMA.acao.reservaMeta && meta ? (
          <Txt role="label" style={styles.fantasma} aria-hidden>
            {meta}
          </Txt>
        ) : null}
        {/* O ESPELHO DO CARREGANDO, pelo mesmo motivo e com a mesma técnica: numa anatomia
            centrada o indicador é uma coluna à direita, e sem o par à esquerda o rótulo sai
            do centro justo no quadro em que o dono está esperando resposta. Nas anatomias
            de linha o indicador ocupa o lugar da seta, que já é uma coluna declarada, e
            espelho nenhum é preciso. */}
        {busy && FORMA.acao.alinha === "center" ? (
          <ActivityIndicator color={ink} style={styles.fantasma} aria-hidden />
        ) : null}

        {FORMA.acao.empilha ? <View style={styles.pilha}>{miolo}</View> : miolo}

        {/* CARREGANDO VENCE O CHECK: o indicador e a marca de confirmado disputam a mesma
            coluna, e enquanto a resposta não voltou não há o que confirmar. O rótulo FICA —
            as telas já calculam "Salvando…", e trocar o botão inteiro por um indicador
            jogava fora a única frase que dizia o que estava acontecendo.
            A SETA é da anatomia `linha`: ela fecha a linha do rótulo à esquerda com o custo
            à direita. Num botão de rótulo CENTRADO ela empurra o centro óptico para o lado
            e o botão fica torto — por isso some, mas o carregando não some com ela. */}
        {busy ? (
          <ActivityIndicator color={ink} />
        ) : !FORMA.acao.seta ? null : check ? (
          <IconCheck color={ink} size={18} />
        ) : (
          <View style={styles.chev}>
            <IconChevron color={ink} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const usarEstilos = estilos(({ SPACE, TRACK, FORMA }) =>
  StyleSheet.create({
    fit: { alignSelf: "center", maxWidth: "100%" },
    block: { alignSelf: "stretch", marginTop: SPACE.tight },
    labelFit: { flexGrow: 0 },
    btnFit: { justifyContent: "center", minWidth: SPACE.max * 2 },
    btn: {
      minHeight: FORMA.alturaAcao,
      // O respiro vertical é `hair`, e quem manda na altura é `FORMA.alturaAcao`.
      //
      // Era `step`, com o argumento de que os dois CTAs cresciam juntos. Cresciam mesmo —
      // juntos e demais: `step` empurrava a ação de uma linha para 60-82pt e a empilhada
      // para 100pt na densidade arejada, contra os 48-52 que Linear, Things, Whoop e Oura
      // desenham. O dono olhou três desses empilhados e chamou de slop, com razão.
      //
      // `hair` não encolhe o alvo do dedo: `minHeight` continua sendo `alturaAcao`, que
      // tem `ALVO.acao` como piso e nunca desce dele. O que o degrau menor tira é a sobra
      // ACIMA do piso — e é a sobra que fazia a laje. `tools/botao.mjs` mede as 144
      // combinações e prova os dois lados: nada abaixo de 44, nada acima do teto premium.
      // O mesmo degrau está orçado em `alturaAcao`; trocar um sem o outro reprova.
      paddingVertical: SPACE.hair,
      paddingHorizontal: SPACE.step,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: FORMA.acao.alinha,
      gap: SPACE.tight,
      // O botão é a peça de AÇÃO: quem manda no canto dele é `raioAcao`, e é por isso que
      // a família pílula arredonda o botão sem arredondar a superfície de conteúdo.
      borderRadius: FORMA.raioAcao,
      ...FORMA.sombra,
    },
    // Empilhada, o rótulo é uma LINHA dentro da coluna: quem come a sobra horizontal passa
    // a ser a coluna, e um `flex: 1` aqui esticaria o texto na vertical.
    pilha: { flex: 1, alignItems: "center" },
    label: {
      // `flexBasis: "auto"`, e NÃO `flex: 1`.
      //
      // `flex: 1` é `grow:1 shrink:1 basis:0%`, e a base zero é a armadilha: num pai que
      // ENCOLHE para o conteúdo (`alignSelf: "flex-start"`, que é como um botão secundário
      // dentro de uma Band se posiciona), não existe espaço livre para o grow distribuir, o
      // rótulo resolve para 0pt, e sobra só o chevron — que tem `flexShrink: 0` e sobrevive.
      // O resultado é um quadradinho com uma seta dentro, sem palavra nenhuma. Aconteceu em
      // três telas ao mesmo tempo e foi a coisa que mais fez o app parecer amador.
      //
      // Com base automática o texto parte da largura natural dele: continua empurrando o
      // chevron para a direita quando o botão é largo (o motivo de o grow existir), e
      // continua existindo quando o botão é do tamanho da palavra.
      flexGrow: FORMA.acao.empilha ? 0 : 1,
      flexShrink: 1,
      flexBasis: "auto",
      textAlign: FORMA.acao.alinha === "center" ? "center" : "left",
      letterSpacing: TRACK.body + FORMA.acao.tracking,
    },
    chev: { flexShrink: 0 },
    fantasma: { opacity: 0 },
  }),
);
