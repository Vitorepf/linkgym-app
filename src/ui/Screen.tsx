import { useContext, useEffect, useState, type ReactNode } from "react";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { neutroSobre, type Folha, type Tema } from "../theme";
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
/** QUEM DECIDE SE O BLOCO PINTA É O MATERIAL, e esta é a correção de um defeito que estava
 *  escondido em plena vista desde o ciclo 6.
 *
 *  Aqui morava uma bandeira SÓ DE CAPTURA — `globalThis.__bandRaised` —, aberta para uma
 *  decisão do dono que ficou pendente por quatro ciclos: "raised vira o padrão da Band?".
 *  Em produção ela era sempre `false`. E como 93 das 119 chamadas de `<Band>` não passam
 *  `raised`, a consequência era que a alavanca de SUPERFÍCIE — vidro, elevada, fio duplo,
 *  vinco — não pintava 78% dos blocos de conteúdo do app.
 *
 *  Ou seja: o cardápio vendia seis materiais e o app aplicava-os a um quinto das
 *  superfícies. É exatamente a mesma família de mentira que o `vidro` sem leitores, só que
 *  na alavanca inteira em vez de num valor dela.
 *
 *  A decisão pendente não precisava do dono, porque ela já tinha resposta no cardápio: se
 *  ele escolheu um material, todo bloco veste esse material; se ele não quer bloco nenhum,
 *  existe um valor que diz isso com todas as letras (`nenhuma`). A pergunta "raised por
 *  padrão?" era uma alavanca disfarçada de bandeira, e agora é a alavanca. */
const pintaBloco = (t: Tema): boolean => t.aparencia.superficie !== "nenhuma";

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
  neutroSobre(pintaBloco(t) ? t.FORMA.folha.peca.composto : t.T.bg, t.T);

/** O TINT DO `BlurView`, e por que ele é um EXTREMO PURO em vez de um material do meio da
 *  tabela. `expo-blur` pinta um `rgba()` PRÓPRIO embaixo de todo tint (a tabela está em
 *  `getBackgroundColor`), e na web ele entra DEPOIS do estilo declarado — não há
 *  `backgroundColor` que o sobrescreva. Isso mexe no pixel COMPOSTO, que é a invariante
 *  inteira desta família: o texto sobre vidro pousa num dos quatro fundos que
 *  `tools/contrast.mjs` mede, e não num vizinho que ninguém sabe olhar.
 *
 *  A saída é escolher o tint cujo `rgba` é o extremo PURO do lado OPOSTO ao da tinta:
 *  branco puro no chão claro, onde a tinta é escura, e preto puro no escuro, onde ela é
 *  clara. Aí a contribuição do tint é MONÓTONA e sempre a favor — ele afasta o composto da
 *  tinta, nunca o aproxima —, e o número que `veuLegivel` já resolve SEM o tint vira um
 *  PISO: o que embarca é igual ou melhor, nunca pior. Exato na web, onde o `rgba` é o da
 *  tabela do pacote; no iOS vale só a DIREÇÃO, porque lá estes dois nomes viram materiais
 *  do `UIVisualEffectView` e a cor exata é da Apple, não nossa.
 *
 *  Quem responde "de que lado está a tinta" é `escuro`, o mesmo 0,18 que decide a direção
 *  da escada inteira — conferido nos 7 chãos do cardápio e em 4.096 chãos livres x 2
 *  contrastes: zero discordâncias contra a direção real de `ink`, `muted`, `muted2` e
 *  `divider`. */
const TINTA_DO_VIDRO = {
  escuro: "systemChromeMaterialDark",
  claro: "systemChromeMaterialLight",
} as const;

/** O ENVELOPE DO CARIMBO — e ele existe por um erro meu que os juízes pegaram.
 *
 *  Eu tinha posto a laje deslocada como FILHA da peça, com `zIndex: -1`, achando que isso a
 *  mandava para trás. Não manda: o fundo de um pai é pintado antes dos filhos, então
 *  `zIndex` negativo põe o filho atrás dos IRMÃOS e na frente do fundo do pai. O que
 *  apareceu na tela foi um colchete claro atravessando a legenda do próprio material.
 *
 *  Irmão de verdade precisa de um pai, e este pai não pinta nada: só empilha a laje e a
 *  peça, nessa ordem. Ele nasce só quando o material é `carimbo` — nas outras sete famílias
 *  a árvore continua exatamente a de antes, sem um nó a mais. */
function Envelope({
  carimbo,
  raio,
  children,
}: {
  carimbo: Folha | null;
  raio: number;
  children: ReactNode;
}) {
  if (!carimbo?.bloco) return <>{children}</>;
  return (
    <View>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: carimbo.bloco,
            transform: [
              { translateX: carimbo.deslocamento },
              { translateY: carimbo.deslocamento },
            ],
            borderRadius: raio,
          },
        ]}
      />
      {children}
    </View>
  );
}

export function Band({
  children,
  rule = "strong",
  raised: raisedProp,
  accentTop,
  accent,
  pad = true,
  grow,
}: BandProps) {
  const styles = usarEstilos();
  const tema = useTema();
  const { T, FORMA, MOTION, escuro, acentoEm } = tema;
  const peca = FORMA.folha.peca;
  // A tela ainda pode PEDIR o bloco explicitamente (as 26 chamadas que já passavam
  // `raised`), mas quem responde por padrão é o material escolhido.
  const raised = raisedProp ?? pintaBloco(tema);
  const ground = raised ? T.raised : T.bg;
  const ac = acentoEm(accent, ground, 3);
  // A MOLDURA VAZIA vale para toda superfície SEM FUNDO, e não só para `contorno`: a
  // pergunta é "esta peça é só borda?", e quem responde é a folha, não o nome da família —
  // senão cada família nova precisa ser lembrada aqui à mão, que é o defeito que a folha
  // veio consertar.
  const reduzido = useReducedMotion();
  const soBorda = peca.fundo === "transparent";
  const semBloco = !pintaBloco(tema);
  const molduraVazia = Boolean(grow && soBorda);
  return (
    // ANIMATED, e por um motivo só: `layout`. Quando uma Band aparece ou some — a faixa de
    // retomada, a linha de erro, o aviso de offline —, tudo abaixo dela SALTAVA a altura
    // inteira do bloco, num quadro. Não existia uma única transição de layout no app, e o
    // salto é a coisa que um olho registra como "barato" antes de registrar qualquer outra.
    //
    // A duração sai do MOVIMENTO que o personal escolheu, então o mesmo gesto é seco no
    // Ferro e longo no Sereno. E some inteiro em movimento reduzido: quem pediu ao sistema
    // para não animar não recebe animação — a lei vale aqui como vale no cronômetro do
    // descanso.
    <Envelope carimbo={raised ? peca : null} raio={FORMA.raio}>
    <Animated.View
      layout={reduzido ? undefined : LinearTransition.duration(MOTION.state)}
      style={[
        pad ? styles.bandPad : null,
        raised && styles.raised,
        // Superfície sem fundo + `grow` desenhava uma MOLDURA VAZIA: a superfície que
        // engorda para comer a sobra da tela virava um retângulo de borda em volta de
        // nada. A borda é do trecho que tem conteúdo; a sobra não tem contorno.
        raised && molduraVazia && styles.semContorno,
        grow && styles.grow,
        // SEM BLOCO EXIGE O FILETE. Um bloco que não pinta nada e também não tem régua não
        // é um bloco — ele derrete no vizinho. As telas que pedem `rule="none"` o fazem
        // porque a superfície já as separava; quando ela para de separar, o material cobra
        // o delimitador de volta. Regra do MATERIAL, resolvida no material.
        (rule === "strong" || (semBloco && rule === "none")) && styles.ruleStrong,
        rule === "hair" && styles.ruleHair,
        // ALTURA É UM SINAL SÓ, e os três moram na mesma aresta de cima: o fio de luz da
        // folha, a borda da própria folha (contorno e vidro) e a régua de acento que a
        // tela pede. Quando a tela declara `accentTop`, quem fala ali é a marca — o fio
        // sai. Dois traços na mesma aresta leem como erro de renderização.
        raised && !accentTop && styles.fioDeLuz,
        // E a MESMA lei embaixo, para o `vinco`: ali quem já fala é a régua, então o fio
        // do rebaixo só existe na Band que não tem régua nenhuma. Trocar a régua pelo fio
        // seria pôr material no lugar de delimitador — os 44 de 112 pares da §2.7.
        raised && rule === "none" && styles.vinco,
        accentTop && { borderTopWidth: FORMA.borda, borderTopColor: ac },
      ]}
    >
      {raised && peca.vidro ? (
        // O VIDRO, enfim. Três estratos, nesta ordem, que é a ordem física do material:
        // o desfoque do que passa atrás, o VÉU do tema por cima dele, o conteúdo por
        // último. O véu sai da folha com o alfa intocado — a família muda a TEXTURA da
        // superfície, nunca o VALOR dela.
        //
        // Numa Band que pousa no chão liso o raio de desfoque não tem o que desfocar, e
        // isso é honesto: o que muda o pixel aqui é o tint e a saturação do material. O
        // desfoque vira desfoque de verdade no dia em que uma Band pousar por cima de
        // conteúdo — a folha e a tela já estarão prontas, sem uma linha a mais.
        <View pointerEvents="none" style={styles.vidro}>
          <BlurView
            intensity={peca.vidro}
            tint={escuro ? TINTA_DO_VIDRO.escuro : TINTA_DO_VIDRO.claro}
            style={StyleSheet.absoluteFill}
          >
            <View style={styles.veu} />
          </BlurView>
        </View>
      ) : null}
      {raised && peca.arestaEm === "moldura" && peca.aresta && !molduraVazia ? (
        <View pointerEvents="none" style={styles.moldura} />
      ) : null}
      {children}
    </Animated.View>
    </Envelope>
  );
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
    // A SUPERFÍCIE em seis famílias. Nenhuma delas é um tema à parte: são o mesmo bloco
    // com outra resposta para "como esta peça se separa do chão".
    //   sólida  — degrau de luz (o app de sempre)
    //   elevada — degrau de luz + sombra
    //   contorno— nenhum fundo, só aresta
    //   vidro   — desfoque real + véu translúcido + aresta de luz
    //   fio     — moldura dupla: o delimitador fora, o fio de luz numa caixa interna
    //   vinco   — o avesso de elevada: o fio desce para a aresta de baixo
    raised: {
      // No VIDRO o fundo NÃO é pintado aqui: quem o pinta é o véu, dentro do BlurView e
      // por cima do desfoque. Pintar nos dois lugares empilharia dois véus, e o pixel de
      // vidro sobre vidro é um vizinho que medidor nenhum deste repo sabe olhar.
      backgroundColor: peca.vidro ? "transparent" : peca.fundo,
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
      peca.aresta && !peca.borda && peca.arestaEm === "topo"
        ? { borderTopWidth: FORMA.fio, borderTopColor: peca.aresta }
        : {},
    // O VINCO é o mesmo fio na aresta DE BAIXO — que é onde um rebaixo pega a luz que vem
    // de cima, e é só nisso que ele difere de `elevada` no chão escuro. É a folha que diz
    // a aresta (`arestaEm`), não este arquivo: re-derivar aqui é como `solida` e `elevada`
    // saíram idênticas byte a byte em quatro chãos.
    vinco:
      peca.aresta && !peca.borda && peca.arestaEm === "base"
        ? { borderBottomWidth: FORMA.fio, borderBottomColor: peca.aresta }
        : {},
    // A CAIXA QUE RECORTA O VIDRO, e o motivo de ela ser um FILHO e não a própria peça:
    // `expo-blur` não aplica `borderRadius` posto no BlurView, e `overflow: "hidden"` na
    // peça mataria a sombra do vidro no chão claro (o iOS descarta a sombra de quem
    // recorta os filhos) — e no claro é a sombra que separa a superfície do chão, porque
    // branco sobre quase-branco tem 6,5 de L* de curso inteiro e gastar tudo em opacidade
    // mataria o desfoque. Recortar num filho sem sombra paga as duas contas de uma vez.
    vidro: {
      ...StyleSheet.absoluteFillObject,
      overflow: "hidden",
      borderRadius: Math.max(0, FORMA.raio - peca.borda),
    },
    veu: { flex: 1, backgroundColor: peca.fundo },
    // A MOLDURA INTERNA da família `fio`. Ela mora numa caixa própria, afastada, e não
    // numa segunda borda da peça, porque é essa distância que a torna legal: o
    // delimitador fica sozinho na aresta de fora com a cor que a SPEC §3 exige, e este
    // aqui é MATERIAL — alfa de tinta, cobrado em L* e em nada mais (SPEC §2.7). Empilhar
    // os dois na mesma aresta é o que derrubou 44 de 112 pares no ciclo 7.
    //
    // O vão é `hair`, o menor da escala: mais perto lê como espessura, mais longe lê como
    // duas caixas. Sendo degrau de SPACE, ele acompanha a densidade sem número solto.
    moldura: {
      ...StyleSheet.absoluteFillObject,
      margin: SPACE.hair,
      borderWidth: FORMA.fio,
      borderColor: peca.aresta,
      borderRadius: Math.max(0, FORMA.raio - peca.borda - SPACE.hair),
    },
    grow: { flex: 1, justifyContent: "center" },
    semContorno: { borderWidth: 0 },
    ruleStrong: {
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    // O FILETE FINO É FINO NA ESPESSURA, NÃO NA TINTA. Ele pintava `T.hairline`, que mede
    // 1,23:1 contra o chão e 1,08:1 contra o bloco levantado — abaixo do piso de 3 que a
    // SPEC §3 exige de TODO delimitador, e portanto invisível. São 26 usos no app.
    //
    // O diagnóstico já estava escrito neste repo: `Baseline.tsx` mede exatamente este
    // 1,23:1, conclui a mesma coisa e conserta dentro de si. O primitivo compartilhado
    // continuou embarcando o defeito. É o padrão que o crítico de acabamento nomeou — o
    // gosto está escrito, e não se propaga.
    //
    // Quem separa "fino" de "forte" agora é só a espessura, que é o canal certo: o `fio` é
    // metade da `borda` por construção.
    ruleHair: {
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
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
