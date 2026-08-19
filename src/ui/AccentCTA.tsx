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
  const DESLIGADO = { fill: T.fill, ink: T.muted, ring: T.divider };
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
      <Txt role="body" color={ink} style={styles.label}>
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
      style={block && styles.block}
    >
      <Animated.View
        style={[
          styles.btn,
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
    block: { alignSelf: "stretch", marginTop: SPACE.tight },
    btn: {
      minHeight: FORMA.alturaAcao,
      // O respiro vertical é `step` em TODA anatomia, inclusive a empilhada. Medido: com
      // `tight` — a conta que `FORMA.alturaAcao` faz — o empilhado fica em 66pt enquanto o
      // GhostCTA ao lado dele mede 80 em `arejada`, e o botão PRINCIPAL vira o menor dos
      // dois. Com `step` os dois crescem juntos e o empilhado é mais alto por exatamente
      // uma linha de rótulo, em qualquer densidade — que é o que um botão de duas linhas
      // deve ser. Ver o relatório: `alturaAcao` conta `2*tight` e os dois CTAs pagam
      // `2*step`, então hoje o token nunca governa fora de `compacta`.
      paddingVertical: SPACE.step,
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
      flex: FORMA.acao.empilha ? 0 : 1,
      textAlign: FORMA.acao.alinha === "center" ? "center" : "left",
      letterSpacing: TRACK.body + FORMA.acao.tracking,
    },
    chev: { flexShrink: 0 },
    fantasma: { opacity: 0 },
  }),
);
