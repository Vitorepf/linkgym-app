import { useContext, useEffect, useState, type ReactNode } from "react";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { neutroSobre, type Tema } from "../theme";
import { AccentBudget } from "./accent";
import { useProgresso } from "./motion";
import { estilos, useTema } from "./tema";
import { Txt } from "./Txt";

type PhoneProps = {
  children?: ReactNode;
};

/** Toda tela passa por aqui, então o orçamento de acento é montado aqui — nenhuma tela
 *  precisa lembrar de abrir escopo, e não existe tela fora do orçamento. */
export function Phone({ children }: PhoneProps) {
  const styles = usarEstilos();
  return (
    // Só o topo: embaixo quem paga o inset é o dock (tab) ou o DockFooter (stack).
    <SafeAreaView style={styles.phone} edges={PHONE_EDGES}>
      <AccentBudget>{children}</AccentBudget>
    </SafeAreaView>
  );
}

type HeadProps = {
  /** A MARCA do personal no canto do cabeçalho. É o logo que ele sobe no Perfil — a única
   *  peça de white-label que o produto cobra dele e que, até agora, ele era o único a ver:
   *  `logo_url` renderizava em UM lugar do app inteiro, a prévia da própria tela de
   *  Perfil. O rótulo embaixo do botão prometia "aparece no convite e no topo do dia" e
   *  não aparecia em nenhum dos dois. */
  marca?: ReactNode;
  kicker?: string;
  title?: string;
  body?: string;
  accent?: string;
  kickerMuted?: boolean;
  right?: ReactNode;
  children?: ReactNode;
};

export function Head({
  marca,
  kicker,
  title,
  body,
  accent,
  kickerMuted,
  right,
  children,
}: HeadProps) {
  const styles = usarEstilos();
  const { T, acentoEm } = useTema();
  // kicker é TEXTO, não enfeite: 4,5:1 contra o chão, com o matiz do personal preservado.
  const ac = acentoEm(accent, T.bg, 4.5);
  return (
    <View style={styles.head}>
      <View style={styles.headRow}>
        {marca}
        <View style={styles.headMain}>
          {kicker ? (
            <Txt role="label" color={kickerMuted ? T.muted : ac}>
              {kicker}
            </Txt>
          ) : null}
          {title ? (
            <Txt role="title" style={styles.title}>
              {title}
            </Txt>
          ) : null}
          {body ? (
            <Txt role="body" tone="muted" style={styles.lede}>
              {body}
            </Txt>
          ) : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

/** UMA régua para o D0 inteiro. Antes eram três: SobreVoce contava `n · 6`, Pronto `3 · 4`
 *  e Estreia `4 · 4`, com três espessuras de traço. Na sequência real o contador ANDAVA
 *  PARA TRÁS (6 · 6 → 3 · 4), que é a única coisa que uma barra de progresso não pode
 *  fazer. Oito paradas depois do convite: as seis perguntas, o Pronto e a Estreia.
 *  O convite tem a espinha rotulada dele, que é outro objeto — não entra nesta contagem. */
export const D0_STEPS = 8;

/** Cumprido é ESPESSURA antes de ser tinta: no time 13 o acento e o divider caem no mesmo
 *  cinza, e uma barra codificada só por matiz não diz nada ali. O passo de agora ACENDE ao
 *  chegar — é a própria barra andando, e não um salto. */
export function StepRail({ accent, now }: { accent?: string; now: number }) {
  const styles = usarEstilos();
  const { acento } = useTema();
  const mark = acento(accent).mark;
  const [arrived, setArrived] = useState(false);
  useEffect(() => setArrived(true), [now]);
  return (
    <View
      style={styles.rail}
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${now} de ${D0_STEPS}`}
      accessibilityValue={{ min: 1, max: D0_STEPS, now }}
    >
      {Array.from({ length: D0_STEPS }, (_, i) => (
        <Tick key={i} on={i + 1 < now || (i + 1 === now && arrived)} mark={mark} />
      ))}
    </View>
  );
}

/** O passo é UM sinal com duas metades — ele engorda e acende. As duas andavam em
 *  velocidades diferentes: a altura trocava de 2 para 6 no quadro zero (era estilo
 *  estático) enquanto a cor atravessava MOTION.enter. Do mesmo progresso, chegam juntas. */
const TICK = { off: 2, on: 6 };

function Tick({ on, mark }: { on: boolean; mark: string }) {
  const styles = usarEstilos();
  const { T, MOTION } = useTema();
  const p = useProgresso(on, MOTION.enter);
  const sinal = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [TICK.off, TICK.on]),
    backgroundColor: interpolateColor(p.value, [0, 1], [T.divider, mark]),
  }));
  return <Animated.View style={[styles.tick, sinal]} />;
}

type BandProps = {
  children?: ReactNode;
  rule?: "strong" | "hair" | "none";
  raised?: boolean;
  accentTop?: boolean;
  accent?: string;
  pad?: boolean;
  grow?: boolean;
};

/** A SUPERFÍCIE do app. Não nasceu peça nova: a Band já era o bloco de conteúdo de todas
 *  as 32 telas, então ela EVOLUIU — duas superfícies fazendo a mesma coisa seria o defeito
 *  que este trabalho veio consertar.
 *
 *  O diagnóstico do dono: o app põe o conteúdo em LINHAS sangradas separadas por fio, e o
 *  que sobra entre elas não pertence a ninguém — lê como buraco. A referência põe o
 *  conteúdo DENTRO de superfícies com respiro interno, e aí o mesmo vazio é padding de
 *  alguém e lê como intenção. Não é falta nem excesso de espaço: é falta de DONO.
 *
 *  Duas peças resolvem isso e são as duas que a Band ganhou:
 *    `raised` — o bloco vira superfície: fundo próprio (T.raised) e um vão de 12 acima
 *      separando da anterior. Raio continua 0; quem separa é FUNDO e RESPIRO, nunca canto.
 *      T.raised é o fundo mais claro que o sistema permite — muted2 mede 4,52:1 nele e
 *      divider 3,01:1, ambos raspando o piso. Um passo acima e tools/contrast.mjs reprova.
 *    `grow` — a superfície ENGORDA para comer a sobra da tela. Duas ou três numa tela
 *      dividem o vazio entre elas, e a conta de dividir é o que apaga o buraco único: o
 *      mesmo pixel vazio que era UM vão de 285 vira quatro de 70 com dono.
 */
/** ponytail: flag SÓ DE CAPTURA, para a decisão pendente "raised vira o padrão da Band?".
 *  `tools/lado-a-lado.mjs` a liga com addInitScript ANTES do bundle carregar e fotografa a
 *  mesma tela nas duas versões sem tocar nas 88 chamadas. Em produção ninguém define isto:
 *  fica `false`, `raised` continua chegando indefinido e a Band é byte a byte a de hoje.
 *  Some junto com a decisão do dono — não é alavanca, não passa pelo cardápio da Aparência. */
const RAISED_PADRAO =
  (globalThis as unknown as { __bandRaised?: boolean }).__bandRaised === true;

/** O DEGRAU NEUTRO DE QUEM POUSA DENTRO DE UMA BAND — a cor de toda peça que desenha
 *  um degrau neutro ali dentro (a linha "Você" da Liga, o selo, a calha da
 *  semana, a amostra da aparência, o chip escolhido).
 *
 *  Sem isto, a decisão pendente do dono é uma REGRESSÃO à espera: `T.raised` como destaque
 *  dentro de uma Band que passa a ser `T.raised` some por completo (ΔL* 0), e `T.fill`, que
 *  é um degrau contado a partir do CHÃO, cai de 14,9 para 8,3 de L* — meia peça. Aqui o
 *  degrau é recontado a partir do pixel em que a peça REALMENTE pousa, e hoje, com a Band
 *  no chão, `neutroSobre(T.bg)` devolve exatamente `T.fill`: a conversão não anda um pixel
 *  até o dono responder. */
export const neutroNaBand = (t: Tema): string =>
  neutroSobre(RAISED_PADRAO ? t.FORMA.folha.peca.composto : t.T.bg, t.T);

export function Band({
  children,
  rule = "strong",
  raised = RAISED_PADRAO,
  accentTop,
  accent,
  pad = true,
  grow,
}: BandProps) {
  const styles = usarEstilos();
  const { T, FORMA, acentoEm } = useTema();
  const ground = raised ? T.raised : T.bg;
  const ac = acentoEm(accent, ground, 3);
  const corpo = (
    <View
      style={[
        pad ? styles.bandPad : null,
        raised && styles.raised,
        // `contorno` + `grow` desenhava uma MOLDURA VAZIA: a superfície que engorda para
        // comer a sobra da tela virava um retângulo de borda em volta de nada. A borda é
        // do trecho que tem conteúdo; a sobra não tem contorno.
        raised && grow && FORMA.superficie === "contorno" && styles.semContorno,
        grow && styles.grow,
        rule === "strong" && styles.ruleStrong,
        rule === "hair" && styles.ruleHair,
        // ALTURA É UM SINAL SÓ, e os três moram na mesma aresta de cima: o fio de luz da
        // folha, a borda da própria folha (contorno e vidro) e a régua de acento que a
        // tela pede. Quando a tela declara `accentTop`, quem fala ali é a marca — o fio
        // sai. Dois traços na mesma aresta leem como erro de renderização.
        raised && !accentTop && styles.fioDeLuz,
        accentTop && { borderTopWidth: FORMA.borda, borderTopColor: ac },
      ]}
    >
      {children}
    </View>
  );
  // O VIDRO só é vidro quando há o que desfocar atrás. Numa Band, que pousa no chão liso,
  // o desfoque não teria o que fazer — quem carrega a família ali é o véu e a aresta de
  // luz, que já estão na folha.
  return corpo;
}

/** A MOLDURA de baixo das telas empilhadas — o outro dock do app, irmão da barra de abas.
 *
 *  Sem `BlurView`, e isso é medida e não economia: o rodapé é IRMÃO do conteúdo num flex
 *  em coluna, então nada passa por trás dele para desfocar, e a §10.4 da SPEC fechou por
 *  número o caminho que faria passar (com conteúdo real embaixo, o rótulo inativo cai de
 *  4,52 para 1,04 de contraste, e o véu que segurasse 4,5:1 precisaria de alfa 0,93 —
 *  acima do teto do vidro; vidro que exige parede não é vidro). Quem carrega a família de
 *  vidro aqui é o VÉU — `chrome.fundo`, que ali é `rgba(...)` e não hex —, mais a sombra
 *  no chão claro; o hex que o medidor sabe olhar é `chrome.composto`, o pixel de trás. A
 *  aresta de luz NÃO é pintada nesta moldura, e `chrome.aresta` é vazia para sempre: a
 *  aresta de cima daqui já é o delimitador (`chrome.corDaBorda`), e dois traços na mesma
 *  aresta leem como erro de renderização — o desfoque era custo de GPU por zero pixel de
 *  diferença. */
export function DockFooter({ children }: { children: ReactNode }) {
  const styles = usarEstilos();
  const { SPACE } = useTema();
  const abaixo = insetPorPagar();
  return (
    <View
      style={[
        styles.dock,
        { paddingBottom: Math.max(abaixo, SPACE.tight) + SPACE.hair },
      ]}
    >
      {children}
    </View>
  );
}

/** O QUE AINDA FALTA PAGAR EMBAIXO DESTA TELA.
 *
 *  Dentro de um Tab.Navigator: nada. O contêiner de telas é IRMÃO do dock num flex em
 *  coluna (`BottomTabView`), então a barra já ocupa a altura dela e já paga o próprio
 *  inset — somar a altura do dock aqui não descolaria a última linha de barra nenhuma,
 *  só abriria um vão morto. Fora dele, e sem `DockFooter` embaixo, ninguém paga: a
 *  última linha encosta no indicador de home.
 *
 *  É `BottomTabBarHeightContext` e não `useBottomTabBarHeight()` de propósito — o hook
 *  ESTOURA fora de um Tab.Navigator, e a Revisão é as duas coisas: a aba `Semana` e uma
 *  tela empilhada. Lendo o contexto direto, cada tela se localiza sozinha e nenhuma lista
 *  de "quem é aba" precisa ser mantida à mão. */
function insetPorPagar(): number {
  const inset = useSafeAreaInsets();
  return useContext(BottomTabBarHeightContext) === undefined ? inset.bottom : 0;
}

/** O FIM DA ROLAGEM, para a tela que não tem `DockFooter` embaixo. Era literal em todas
 *  elas — 28, 16, 8, 8, 8, 8, 8 e um ZERO (a FichaTab encostava o último toque na barra)
 *  — sete números que não pertencem a escala nenhuma e que a densidade não alcança: no
 *  arejado tudo respirava menos o último item da lista. É `step` porque é a MESMA coisa
 *  que `T.pad`: a margem do conteúdo, agora também embaixo. */
export function useFimDaRolagem() {
  const { SPACE } = useTema();
  return { paddingBottom: SPACE.step + insetPorPagar() };
}

const PHONE_EDGES = ["top"] as const;

const usarEstilos = estilos(({ T, SPACE, FORMA }) => {
  // A SUPERFÍCIE DE CONTEÚDO e a MOLDURA, lidas do tema em vez de re-derivadas aqui.
  // Antes disto este arquivo perguntava as quatro superfícies num ternário próprio, o
  // Metric perguntava duas e o dock só `vidro` — três respostas divergentes para a mesma
  // pergunta, e o resultado medido era `solida` e `elevada` saindo IDÊNTICAS byte a byte
  // nos quatro chãos escuros. Agora a tela pinta o MESMO objeto que o medidor lê.
  const peca = FORMA.folha.peca;
  const chrome = FORMA.folha.chrome;
  return StyleSheet.create({
    // O chão é bg — o mesmo de app.json. Antes era surface, e o token bg quase não existia.
    phone: {
      flex: 1,
      backgroundColor: T.bg,
    },
    // Deste ponto para baixo não existe mais número de espaço fora de SPACE. Era 8/16/14/5/22
    // /12/10 — sete valores que não pertenciam a escala nenhuma, no arquivo por onde passam
    // as 32 telas.
    head: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.hair,
      paddingBottom: SPACE.step,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    headRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: SPACE.tight,
    },
    headMain: { flex: 1, minWidth: 0 },
    rail: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: SPACE.hair,
      marginTop: SPACE.step,
    },
    tick: { flex: 1, height: TICK.off },
    title: { marginTop: SPACE.hair },
    lede: { marginTop: SPACE.hair },
    bandPad: {
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.block,
    },
    // A SUPERFÍCIE em quatro famílias. Nenhuma delas é um tema à parte: são o mesmo bloco
    // com outra resposta para "como esta peça se separa do chão".
    //   sólida  — degrau de luz (o app de sempre)
    //   elevada — degrau de luz + sombra
    //   contorno— nenhum fundo, só aresta
    //   vidro   — véu translúcido + aresta de luz
    raised: {
      backgroundColor: peca.fundo,
      marginTop: SPACE.tight,
      marginHorizontal: FORMA.inset,
      borderRadius: FORMA.raio,
      borderWidth: peca.borda,
      borderColor: peca.corDaBorda,
      ...peca.sombra,
    },
    // O fio de luz só existe onde a sombra não pode existir (chão escuro: preto sobre
    // preto não é sombra, é nada) E onde a folha não tem borda própria para ser a aresta.
    // Vazio nos outros casos — não é ausência de estilo, é a folha dizendo que ali quem
    // levanta a peça é outro sinal.
    fioDeLuz:
      peca.aresta && !peca.borda
        ? { borderTopWidth: FORMA.fio, borderTopColor: peca.aresta }
        : {},
    grow: { flex: 1, justifyContent: "center" },
    semContorno: { borderWidth: 0 },
    ruleStrong: {
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    ruleHair: {
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    dock: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.tight,
      // A régua que separa a moldura do conteúdo NUNCA some — é ela que impede a última
      // linha da lista de encostar no botão. Ela vem INTEIRA da folha do chrome, espessura
      // e cor, porque é UM traço que responde a DUAS perguntas: delimita (3:1 contra os
      // dois lados, sempre `divider` ou `ink` — SPEC §3) e, no chão escuro onde a sombra
      // não existe, é ele que diz que a moldura tem altura. Ver `reguaDoDock` no tema.
      //
      // Pintar `T.divider` cru aqui era a regressão: o dock passava a ler só `fundo` e
      // `sombra` da folha, e no escuro `solida`, `contorno` e `elevada` saíam byte a byte
      // idênticas — 15 dos 42 pares chão × superfície contra os 7 de propósito.
      borderTopWidth: chrome.borda,
      borderTopColor: chrome.corDaBorda,
      backgroundColor: chrome.fundo,
      ...chrome.sombra,
    },
  });
});
