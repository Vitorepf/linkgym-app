import { useNavigation, usePreventRemove } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ApiError, aparenciaDoTime, me, patchTime, type Time } from "../../api";
import {
  ACCENT_CHOICES,
  FAMILIAS_DA_MARCA,
  TONS_DA_FAMILIA,
  segundaValida,
  nomeDaCor,
  CHAOS,
  corLivre,
  escada,
  type Aparencia as Doc,
  type Densidade,
  type Movimento,
  type NomeDaForma,
  type NomeDoChao,
  type Peso,
  type Porte,
  type Acao,
  type Anel,
  type Contraste,
  type Hierarquia,
  type Numero,
  type Superficie,
  type Voz,
  ALVO,
  SPACE,
} from "../../theme";
import { AccentBudget } from "../../ui/accent";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Baseline } from "../../ui/Baseline";
import { Campo } from "../../ui/Campo";
import { Cena, CENAS, type NomeDaCena } from "../../ui/Cena";
import { Choice } from "../../ui/Choice";
import { IconCheck, IconChevron, IconClose } from "../../ui/Icons";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, neutroNaBand, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, TemaDoTime, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
  onTimeChange: (next: Time) => void;
};

/** A FÁBRICA NA MÃO DO PERSONAL.
 *
 *  O dono vende este app como se fosse dele, e até aqui a única coisa que ele podia
 *  trocar era uma cor de acento. Esta tela entrega o documento inteiro: fundo, marca,
 *  canto, material, traço, respiro, tamanho de botão e movimento — 11.757.312 combinações
 *  fechadas, cada uma já medida por `node tools/aparencia.mjs` antes de existir botão para
 *  escolhê-la.
 *
 *  Três decisões de desenho carregam a tela:
 *
 *  KIT PRIMEIRO, ALAVANCA DEPOIS. Ninguém começa de uma tela em branco com sete filas de
 *  escolha. Escolhe-se um kit inteiro — que é só o documento de oito campos já preenchido
 *  — e mexe-se numa alavanca depois. É o mesmo formato dos presets de "Como o app
 *  funciona", e pela mesma razão: combinação incoerente não deve nem ser representável.
 *
 *  A TELA INTEIRA É A PRÉVIA. O editor era desenhado com o tema SALVO, e só a caixinha do
 *  fim usava o rascunho: quem tocava "Vidro", "Grosso" ou "Arejado" não via NADA mudar
 *  sem rolar até o pé da página. Agora o corpo mora dentro de `TemaDoTime` com o
 *  rascunho, e é por isso que ele é um componente separado — `usarEstilos()` lê o tema do
 *  contexto, então precisa rodar DENTRO do provider, não no mesmo corpo que o abre.
 *
 *  A PRÉVIA USA AS PEÇAS DE VERDADE. Não é maquete: é `Head`, `Band`, `Metric`,
 *  `AccentCTA`, `Baseline` e `Avatar`, os mesmos componentes que o aluno vê, montados
 *  como a Hoje monta — logo no canto do cabeçalho incluído. Maquete mente na hora em que
 *  a peça real muda; esta não pode mentir, porque ela É a peça real. */
export function Aparencia({ token, time, onTimeChange }: Props) {
  const navigation = useNavigation();
  const gravado = aparenciaDoTime(time);
  const [doc, setDoc] = useState<Doc>(gravado);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");
  // O que está DIGITADO, que não é o mesmo que a cor escolhida: no meio da digitação
  // ainda não existe cor nenhuma, e o documento não pode piscar a cada tecla.
  const [digitado, setDigitado] = useState<string>(gravado.primaria);
  // O MESMO par para o chão, e por uma razão que a primária não tem: o chão gravado pode
  // ser um dos sete NOMES, e nome não se escreve no campo de hex. Campo vazio quando o
  // personal está num chão do cardápio; o hex dele quando não está.
  const [chaoDigitado, setChaoDigitado] = useState<string>(
    gravado.chao in CHAOS ? "" : gravado.chao,
  );

  const sujo = JSON.stringify(doc) !== JSON.stringify(gravado);
  // Todo caminho que muda o documento passa por aqui — chip, kit, descarte. Por isso o
  // campo do chão livre se limpa AQUI e não no toque de cada chip: hex velho parado num
  // campo enquanto o app já está no Papel é a tela mentindo sobre o próprio estado, e a
  // única versão dessa mentira que não volta é a que se conserta no funil.
  const muda = (parte: Partial<Doc>) => {
    if (parte.chao && parte.chao in CHAOS) setChaoDigitado("");
    setDoc((d: Doc) => ({ ...d, ...parte }));
  };
  const descartar = () => {
    setDoc(gravado);
    setDigitado(gravado.primaria);
    setChaoDigitado(gravado.chao in CHAOS ? "" : gravado.chao);
  };

  // SAIR SEM AVISAR era o outro jeito de perder as oito alavancas: `Voltar` e o gesto de
  // borda descartavam o rascunho calados. Quem intercepta é a NAVEGAÇÃO, não o botão —
  // assim o gesto e o toque caem na mesma pergunta, e ela só aparece quando há o que
  // perder. Salvando não pergunta: o rascunho já está a caminho do servidor.
  usePreventRemove(sujo && !busy, ({ data }) => {
    Alert.alert("Sair sem salvar?", "As mudanças de aparência voltam como estavam.", [
      { text: "Ficar", style: "cancel" },
      {
        text: "Descartar",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  async function salvar() {
    if (!sujo || busy) return;
    setBusy(true);
    try {
      // A cor primária mora na coluna `accent_color` — ela viaja no convite, onde config
      // não vai. O resto do documento vai no `config.aparencia`. Um campo, um dono.
      const { primaria, ...resto } = doc;
      await patchTime(token, {
        accent_color: primaria,
        config: { ...(time.config ?? {}), aparencia: resto },
      });
      const mine = await me(token);
      onTimeChange(mine.time);
      setErro("");
    } catch (e) {
      // Espelha PerfilTime: o servidor só sabe dizer `invalido`, e "Não deu para salvar."
      // é um beco sem saída — o personal não sabe se caiu a rede ou se ele escolheu algo
      // que a whitelist recusa. Aqui as escolhas saem de cardápio fechado; o que a mão
      // dele alcança fora dele é a cor livre.
      setErro(
        e instanceof ApiError && e.code === "invalido"
          ? "A cor ou uma das escolhas está fora do que a API aceita."
          : "Não deu para salvar.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <TemaDoTime aparencia={doc}>
      <Corpo
        doc={doc}
        time={time}
        sujo={sujo}
        busy={busy}
        erro={erro}
        digitado={digitado}
        setDigitado={setDigitado}
        chaoDigitado={chaoDigitado}
        setChaoDigitado={setChaoDigitado}
        muda={muda}
        salvar={salvar}
        descartar={descartar}
      />
    </TemaDoTime>
  );
}

type CorpoProps = {
  doc: Doc;
  time: Time;
  sujo: boolean;
  busy: boolean;
  erro: string;
  digitado: string;
  setDigitado: (v: string) => void;
  chaoDigitado: string;
  setChaoDigitado: (v: string) => void;
  muda: (parte: Partial<Doc>) => void;
  salvar: () => Promise<void>;
  descartar: () => void;
};

/** UMA FOLHA: uma decisão, uma tela dedicada, e o app de verdade atrás dela. */
type Folha = {
  id: keyof FichaParams;
  titulo: string;
  /** ONDE muda, na tela do aluno ou na dele. A pergunta que o dono fez: "muitas coisa so
   *  de ler eu não faça a menor ideia o que faz, aonde muda, para que serve". */
  onde: string;
  /** o valor de agora, EM PALAVRA. É a segunda linha da fila do índice — sem ela a fila
   *  seria dez portas iguais e o personal teria que abrir todas para saber onde está. */
  resumo: (doc: Doc) => string;
  /** a miniatura viva, desenhada com a peça de verdade no rascunho de agora. */
  mini?: ReactNode;
};

type FichaParams = {
  Indice: undefined;
  Ajustar: undefined;
  Cores: undefined;
  Comparacao: undefined;
  Fundo: undefined;
  Letra: undefined;
  Botao: undefined;
  Recuar: undefined;
  Numeros: undefined;
  Blocos: undefined;
  Traco: undefined;
  Espaco: undefined;
  Texto: undefined;
};

const rotuloDe = <V extends string>(lista: { valor: V; rotulo: string }[], v: V) =>
  lista.find((x) => x.valor === v)?.rotulo ?? "";


const Ficha = createNativeStackNavigator<FichaParams>();

/** O EDITOR: um índice e dez folhas, e não uma rolagem de oito telas.
 *
 *  O que havia aqui era um `ScrollView` com dezoito blocos: 6.333 pontos de rolagem — 8,3
 *  telas — e 77 alvos de toque numa página só, medidos no Chrome contra o bundle. O dono
 *  descreveu exatamente isso: "invez de ter que rolar a tela massivamente, cada item que
 *  muda alguma coisa da aparencia abrir um modal, com uma interaçao".
 *
 *  A folha é `presentation: "formSheet"` do próprio native-stack, e é ela que faz a
 *  promessa valer: com `sheetLargestUndimmedDetentIndex: 0` a metade de cima da tela NÃO
 *  escurece — é o app rodando, em tamanho real, repintando a cada toque. Ele toca em
 *  "Pílula" e a tela do aluno atrás do polegar arredonda. Prévia dentro do modal seria
 *  gastar os pontos que faltam para desenhar, menor e pior, o que o fundo já mostra de
 *  graça.
 *
 *  A PILHA É LOCAL, e isso não é detalhe de arrumação: o rascunho mora em `useState` no
 *  componente de cima, e `src/nav/types.ts` proíbe passar isso por parâmetro de rota
 *  ("parâmetro de rota é CONGELADO no momento do navigate"). Cada folha é uma função que
 *  fecha sobre `doc` e `muda`. Zero parâmetro, zero contexto, zero serialização.
 *
 *  Na web — que é onde `tools/shots.mjs` fotografa — `presentation` é ignorado e a folha
 *  vira uma tela comum. Não é perda: é exatamente o quadro que o medidor deve fotografar.
 *  (`transparentModal` seria o erro: é a única apresentação que deixa a tela de baixo
 *  visível no DOM, e aí o índice e a folha teriam alvos de toque simultâneos.) */
function Corpo(props: CorpoProps) {
  const { FORMA } = useTema();
  return (
    <Ficha.Navigator screenOptions={{ headerShown: false }}>
      <Ficha.Screen name="Indice">{() => <Palco {...props} />}</Ficha.Screen>
      {/* AJUSTAR não é folha de uma decisão só: é a lista das dez. Ela entra como tela
          empilhada, e não como `formSheet`, porque de dentro dela ainda se abre uma folha —
          e folha sobre folha é uma pilha que ninguém desfaz com um gesto só. */}
      <Ficha.Screen name="Ajustar" options={{ animation: "slide_from_right" }}>
        {() => <Ajustar {...props} />}
      </Ficha.Screen>
      {FOLHAS.map((f) => (
        <Ficha.Screen
          key={f.id}
          name={f.id}
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.55, 0.95],
            sheetInitialDetentIndex: 0,
            // O detente de baixo NÃO escurece o que está atrás: é aí que o app continua
            // visível e vivo enquanto ele escolhe.
            sheetLargestUndimmedDetentIndex: 0,
            sheetGrabberVisible: true,
            sheetCornerRadius: FORMA.raio,
          }}
        >
          {() => <FolhaDaDecisao folha={f} {...props} />}
        </Ficha.Screen>
      ))}
    </Ficha.Navigator>
  );
}

/** O ÍNDICE. Uma prévia grande em cima, dez portas embaixo, uma ação no rodapé. */
/** O PALCO — a porta da aparência deixou de ser uma tela de ajustes.
 *
 *  O que havia aqui era um índice: dez linhas com um nome, o valor de agora e uma seta.
 *  Correto, e a gramática errada. Aquilo é a gramática de "Ajustes" do sistema — ela CONFIRMA
 *  de volta o que a pessoa já escolheu. Escolher é o prazer; ser informado do que você já
 *  escolheu é escrituração. E nada naquela tela mostrava o que ele PODERIA ter.
 *
 *  Aqui a tela inteira é o app do aluno, em tamanho real, e o polegar corre as linguagens
 *  de lado. Ele não lê "Boutique" — ele VÊ o app dele em Boutique, com a marca dele, e
 *  arrasta para ver em Brutalista.
 *
 *  Três decisões carregam isto:
 *
 *  A LINGUAGEM É A UNIDADE, e não a alavanca. Oito posições inteiras, cada uma decidindo os
 *  quatorze campos de uma vez, e `tools/linguagens.mjs` prova que as vinte e oito duplas se
 *  separam em pelo menos três de seis canais grossos. As alavancas continuam existindo,
 *  atrás da última ficha da régua — quem quer mexer peça a peça mexe, e quem quer um app
 *  pronto arrasta.
 *
 *  O TOQUE É O CONTRATO, o gesto é o bônus. A régua embaixo é feita de botões de verdade,
 *  porque `tools/taps.mjs` e `tools/fixtures.ts` não sabem arrastar: caminho que só existe
 *  por gesto é caminho que nenhuma régua alcança, e o que não se mede apodrece.
 *
 *  A JANELA É DE TRÊS PÁGINAS. Montar oito apps completos de uma vez é oito árvores de
 *  componente vivas; a vizinhança basta para o arrasto nunca mostrar buraco.
 *  ponytail: janela de 3, sobe se a régua ficar áspera no aparelho. */
function Palco({ doc, time, sujo, busy, erro, muda, salvar, descartar }: CorpoProps) {
  const styles = usarEstilos();
  const navigation = useNavigation<NativeStackNavigationProp<FichaParams>>();
  const { T, errorInk, acento } = useTema();
  const { width } = useWindowDimensions();
  const [cena, setCena] = useState<NomeDaCena>("hoje");

  // A LISTA TEM TAMANHO FIXO, e isto é o conserto de um defeito que três juízes cegos
  // acharam sozinhos — o pior que eu embarquei nesta rodada.
  //
  // Ela era condicional: nove fichas quando o documento não batia com linguagem nenhuma,
  // oito quando batia. Então o PRIMEIRO arrasto gravava Ferro, a condição virava, o array
  // encolhia, e o deslocamento continuava em `1 * largura` — que agora apontava para outra
  // ficha. A tela mostrava Moderno, a régua acendia FERRO, o documento salvo era Ferro, e
  // "Do seu jeito" sumia levando junto todo ajuste que ele tivesse feito à mão.
  //
  // Lista de tamanho variável debaixo de um deslocamento em pixels é sempre isso. Agora a
  // ficha dele existe SEMPRE, na posição zero, e o índice não se mexe.
  const daCasa = KITS.findIndex((k) => KITS_IGUAIS(doc, k.doc));
  const cartoes = useMemo(
    () => [{ nome: "Do seu jeito", doc: docSemCor(doc) }, ...KITS],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(docSemCor(doc))],
  );
  const atual = daCasa >= 0 ? daCasa + 1 : 0;

  const rolagem = useRef<ScrollView>(null);
  const fila = useRef<ScrollView>(null);
  const alvoDaFila = useRef(0);
  useEffect(() => {
    fila.current?.scrollTo({ x: Math.max(0, alvoDaFila.current - T.pad), animated: true });
  }, [atual, T.pad]);
  const irPara = (i: number) => {
    rolagem.current?.scrollTo({ x: i * width, animated: true });
    muda(cartoes[i].doc);
  };

  return (
    <Phone>
      <Head
        title="Aparência"
        right={
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={8}
            style={styles.fechar}
          >
            <IconClose color={T.muted} size={20} />
          </Pressable>
        }
      />

      {/* QUAL TELA DO ALUNO está no palco. Cinco, e cada uma entra por ser o único lugar
          onde alguma alavanca aparece — a lista mostra o ritmo que um bloco sozinho
          esconde, o recorde mostra o topo da escala, o progresso é o único lugar onde a
          segunda cor justifica existir. */}
      {/* A FRASE QUE FALTAVA. Sem ela o personal olha um app e não sabe se é o dele ou o do
          aluno — e a resposta muda tudo sobre o que ele está decidindo. */}
      <View style={styles.dizOQueE}>
        <Txt role="note" tone="dim">
          é isto que o seu aluno vê
        </Txt>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filaDeCenas}
        contentContainerStyle={styles.filaDeCenasCorpo}
      >
        {CENAS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCena(c.id)}
            accessibilityRole="button"
            accessibilityLabel={`Ver a tela ${c.rotulo}`}
            accessibilityState={{ selected: cena === c.id }}
            style={styles.abaDeCena}
          >
            <Txt role="label" tone={cena === c.id ? "ink" : "dim"}>
              {c.rotulo}
            </Txt>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        ref={rolagem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.palcoRolagem}
        // A JANELA É DE TRÊS PÁGINAS e o deslocamento inicial é zero: sem isto, abrir a tela
        // com a sexta linguagem escolhida montava a página 0 (fora da janela) e o personal
        // encontrava um retângulo liso onde devia estar o app dele. Pior no vizinho: a
        // segunda linguagem abria mostrando o app da PRIMEIRA — um retângulo vazio se
        // percebe, uma tela errada se acredita.
        contentOffset={{ x: atual * width, y: 0 }}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (cartoes[i]) muda(cartoes[i].doc);
        }}
      >
        {cartoes.map((c, i) => (
          <View key={c.nome} style={[styles.pagina, { width }]}>
            {Math.abs(i - atual) <= 1 ? (
              // A CENA É PARA OLHAR. Sem isto, o "Começar" do aluno fica tocável no meio do
              // palco e não faz nada — botão morto é pior que botão nenhum, porque ele
              // ensina que a tela não responde.
              <TemaDoTime aparencia={{ ...doc, ...c.doc }}>
                <View pointerEvents="none" style={styles.pagina}>
                  <Cena
                    cena={cena}
                    nome={time.name}
                    logo={time.logo_url}
                    accent={doc.primaria}
                  />
                </View>
              </TemaDoTime>
            ) : (
              // A PÁGINA FORA DA JANELA PINTA O CHÃO DAQUELA LINGUAGEM, e não o do tema de
              // fora. Polaridade — claro contra escuro — é o canal mais alto que a régua
              // mede, e era exatamente ele que mentia durante o arrasto: a página do
              // Brutalista, que é papel, aparecia preta até terminar de montar.
              <ChaoDaLinguagem doc={{ ...doc, ...c.doc }} />
            )}
          </View>
        ))}
      </ScrollView>

      {/* A RÉGUA, e três decisões nela.
          A COR VEM PRIMEIRO. Trocar a cor da marca é a tarefa número um de um personal que
          abre esta tela, e ela estava a dois toques de profundidade, atrás da ficha
          "Ajustar" e de uma lista de dez. Agora é a primeira coisa da fila e é um quadrado
          da cor dele — não precisa nem de palavra.
          "AJUSTAR" SAI DA ROLAGEM. Ela estava vestida com o mesmo estilo das oito, dentro da
          mesma fila: navegação fantasiada de rádio. Fora, fixa à direita e com seta, ela
          volta a ser o que é — uma porta.
          E A FILA ROLA ATÉ A ESCOLHIDA: da sexta linguagem em diante ela ficava fora de
          vista, e a régua mostrava só fichas apagadas. */}
      <View style={styles.reguaLinha}>
        <ScrollView
          ref={fila}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reguaFila}
          contentContainerStyle={styles.regua}
        >
          <Pressable
            onPress={() => navigation.navigate("Cores")}
            accessibilityRole="button"
            accessibilityLabel={`A cor da sua marca: ${nomeDaCor(doc.primaria)}`}
            style={styles.cartaoDeCor}
          >
            <View style={[styles.pastilha, { backgroundColor: acento().piece.fill }]} />
          </Pressable>
          {cartoes.map((c, i) => (
            <Pressable
              key={c.nome}
              onPress={() => irPara(i)}
              accessibilityRole="button"
              accessibilityLabel={`Linguagem ${c.nome}`}
              accessibilityState={{ selected: i === atual }}
              style={[styles.cartao, i === atual && styles.cartaoOn]}
              onLayout={(e) => {
                if (i === atual) alvoDaFila.current = e.nativeEvent.layout.x;
              }}
            >
              {/* O QUADRADO DO CHÃO. Polaridade — claro contra escuro — é o canal mais
                  alto que a régua de linguagens mede, e era o único que a fila de nomes não
                  dizia: "Cartaz" e "Sereno" são duas palavras e o olho não sabe qual é
                  clara. Oito pontos de cor entregam quase todo o sinal de uma parede de
                  telefones vivos por quase nada do custo dela. */}
              <ChaoDaFicha doc={{ ...doc, ...c.doc }} />
              <Txt role="label" tone={i === atual ? "ink" : "muted"} numberOfLines={1}>
                {c.nome}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable
          onPress={() => navigation.navigate("Ajustar")}
          accessibilityRole="button"
          accessibilityLabel="Ajustar peça a peça"
          style={styles.porta2}
        >
          <Txt role="label" tone="muted">
            Ajustar
          </Txt>
          <IconChevron color={T.muted} />
        </Pressable>
      </View>

      <DockFooter>
        <View style={styles.avisoLinha}>
          <Txt role="note" tone="dim" style={styles.avisoCopy}>
            salvar troca o app de todos os seus alunos, não só o seu.
          </Txt>
          {sujo ? (
            <Pressable
              onPress={descartar}
              accessibilityRole="button"
              accessibilityLabel="Descartar mudanças"
              hitSlop={8}
              style={styles.desfazer}
            >
              <Txt role="label" tone="muted">
                Descartar
              </Txt>
            </Pressable>
          ) : null}
        </View>
        <AccentCTA
          label={busy ? "Salvando…" : sujo ? "Salvar" : "Salvo"}
          onPress={() => void salvar()}
          disabled={!sujo}
          busy={busy}
          check
        />
        {erro ? (
          <Txt role="body" color={errorInk} style={styles.nota}>
            {erro}
          </Txt>
        ) : null}
      </DockFooter>
    </Phone>
  );
}

/** Três linhas, e elas resolvem a mentira mais visível do arrasto: o fundo da página que
 *  ainda não montou é o fundo DAQUELA linguagem. */
function ChaoDaLinguagem({ doc }: { doc: Doc }) {
  return (
    <TemaDoTime aparencia={doc}>
      <ChaoLiso />
    </TemaDoTime>
  );
}

/** O quadradinho do chão daquela linguagem, dentro da ficha da régua. */
function ChaoDaFicha({ doc }: { doc: Doc }) {
  return (
    <TemaDoTime aparencia={doc}>
      <QuadradoDoChao />
    </TemaDoTime>
  );
}

function QuadradoDoChao() {
  const styles = usarEstilos();
  const { T, FORMA } = useTema();
  return (
    <View
      style={[
        styles.quadradoDoChao,
        { backgroundColor: T.bg, borderColor: T.divider, borderWidth: FORMA.fio },
      ]}
    />
  );
}

function ChaoLiso() {
  const { T } = useTema();
  return <View style={{ flex: 1, backgroundColor: T.bg }} />;
}

/** A cor é DELE e não da linguagem: arrastar de Ferro para Boutique não pode repintar a
 *  marca do estúdio. Mesma regra que os kits sempre tiveram. */
const docSemCor = (d: Doc): Omit<Doc, "primaria" | "secundaria"> => {
  const { primaria, secundaria, ...resto } = d;
  return resto;
};

/** AS ALAVANCAS, atrás da última ficha da régua. Era esta a porta da tela inteira; agora é
 *  a porta de quem quer mexer peça a peça, que é uma minoria com direito a existir. */
function Ajustar({ doc }: CorpoProps) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const navigation = useNavigation<NativeStackNavigationProp<FichaParams>>();
  return (
    <Phone>
      <Head
        title="Ajustar"
        body="cada peça do app, uma de cada vez. O que você mudar aqui vale por cima da linguagem escolhida."
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {FOLHAS.map((f) => (
          <Porta key={f.id} folha={f} doc={doc} onPress={() => navigation.navigate(f.id)} />
        ))}
      </ScrollView>
    </Phone>
  );
}

function Porta({ folha, doc, onPress }: { folha: Folha; doc: Doc; onPress: () => void }) {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${folha.titulo}: ${folha.resumo(doc)}`}
      style={styles.porta}
    >
      <View style={styles.portaCopy}>
        <Txt role="body">{folha.titulo}</Txt>
        <Txt role="note" tone="dim" numberOfLines={1}>
          {folha.resumo(doc)}
        </Txt>
      </View>
      {folha.mini ? <View style={styles.portaMini}>{folha.mini}</View> : null}
      <IconChevron color={T.muted} />
    </Pressable>
  );
}

/** O CORPO DE UMA FOLHA. O cabeçalho diz o nome e ONDE muda; embaixo vêm as alavancas
 *  daquela decisão, e só elas. */
function FolhaDaDecisao({
  folha,
  doc,
  time,
  digitado,
  setDigitado,
  chaoDigitado,
  setChaoDigitado,
  muda,
}: CorpoProps & { folha: Folha }) {
  const styles = usarEstilos();
  const corDigitada = corLivre(digitado);
  const chaoLivre = corLivre(chaoDigitado);
  const escadaLivre = chaoLivre ? escada(chaoLivre) : null;
  // A prova de que o chão ANDOU: o `bg` que sai da escada não é o hex que entrou.
  const chaoAndou = !!escadaLivre && escadaLivre.bg !== chaoLivre;

  return (
    <Phone>
      <Head title={folha.titulo} body={folha.onde} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {folha.id === "Cores" ? (
          <Band rule="none">
            <Paleta
              atual={doc.primaria}
              doc={doc}
              onPick={(c) => {
                muda({ primaria: c });
                setDigitado(c);
              }}
              prefixo="Cor"
            />
            {/* A COR LIVRE. As vinte e sete são sugestão — a marca dele pode não estar lá, e
                dizer "escolha uma das vinte e sete" a quem já tem uma marca é decidir pela
                marca de alguém. Quem garante que a cor digitada sobrevive aos quatro fundos
                é o motor de sempre, não o cardápio. */}
            <Campo
              label="A cor da marca em hexadecimal"
              hint="Seis dígitos, como no manual da sua marca"
              value={digitado}
              onChangeText={(v) => {
                setDigitado(v);
                const cor = corLivre(v);
                if (cor) muda({ primaria: cor });
              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="hex da sua marca"
              maxLength={7}
              erro={Boolean(digitado.trim()) && !corDigitada}
              style={styles.hex}
            />
          </Band>
        ) : null}

        {/* A SEGUNDA COR GANHOU FOLHA PRÓPRIA, e o motivo é medido: com os dois seletores
            juntos, `tools/rolagem.mjs` contou 42 alvos de toque numa página só, contra um
            teto de 30. Duas paletas completas empilhadas é a parede de fichinhas que o
            desenho de dois passos existe para não fazer. E são duas decisões diferentes:
            uma é a marca dele, a outra é como o app compara dois números. */}
        {folha.id === "Comparacao" ? (
          <Band rule="none">
            <Txt role="note" tone="dim">
              só aparecem aqui as cores que o app consegue manter exatamente como você
              escolher — as outras brigariam com a sua marca ou com o vermelho do aviso.
            </Txt>
            <View style={styles.fila}>
              <Choice
                label="Automática"
                selected={doc.secundaria === "auto"}
                onPress={() => muda({ secundaria: "auto" })}
              />
            </View>
            <Paleta
              atual={typeof doc.secundaria === "string" ? doc.secundaria : ""}
              doc={doc}
              onPick={(c) => muda({ secundaria: c })}
              prefixo="Cor de comparação"
              permitida={(c) => segundaValida(doc, c)}
            />
          </Band>
        ) : null}

        {folha.id === "Fundo" ? (
          <Band rule="none">
            <View style={styles.fila}>
              {(Object.keys(CHAOS) as NomeDoChao[]).map((c) => (
                <ChaoChip
                  key={c}
                  nome={c}
                  escolhido={doc.chao === c}
                  onPress={() => muda({ chao: c })}
                />
              ))}
            </View>
            <Campo
              label="Ou o hexadecimal do seu fundo"
              hint="O app resolve os outros nove tons a partir dele"
              value={chaoDigitado}
              onChangeText={(v) => {
                setChaoDigitado(v);
                const cor = corLivre(v);
                if (cor) muda({ chao: cor });
              }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="ou o hex do seu fundo"
              maxLength={7}
              erro={Boolean(chaoDigitado.trim()) && !chaoLivre}
              style={styles.hex}
            />
            {chaoAndou ? (
              <Txt role="note" tone="dim" style={styles.nota}>
                o app clareou o seu fundo o mínimo para as dez tintas ainda se lerem em
                cima dele.
              </Txt>
            ) : null}
          </Band>
        ) : null}

        {folha.id === "Letra" ? (
          <Alavanca
            nu
            larga
            valores={VOZES_DO_CARDAPIO}
            atual={doc.voz}
            onPick={(v) => muda({ voz: v })}
            doc={doc}
            campo="voz"
            amostra={AMOSTRA_VOZ}
          />
        ) : null}

        {folha.id === "Botao" ? (
          <>
            <Alavanca
              nu
              valores={ACOES_DO_CARDAPIO}
              atual={doc.acao}
              onPick={(v) => muda({ acao: v })}
              doc={doc}
              campo="acao"
              amostra={AMOSTRA_BOTAO}
              larga
            />
            <Alavanca
              titulo="O tamanho do botão"
              ondeMuda="a altura do botão principal em toda tela — nunca abaixo do que o dedo alcança"
              valores={PORTES_DO_CARDAPIO}
              atual={doc.porte}
              onPick={(v) => muda({ porte: v })}
              doc={doc}
              campo="porte"
              amostra={AMOSTRA_BOTAO}
              larga
            />
          </>
        ) : null}

        {/* O BOTÃO DE RECUAR TEM FOLHA PRÓPRIA. Com as quatro alavancas juntas,
            `tools/rolagem.mjs` contou 33 alvos de toque numa página só contra um teto de
            30 — e a folha existe justamente para uma decisão de cada vez. São dois
            objetos diferentes: o que faz a coisa acontecer e o que sai de perto dela. */}
        {folha.id === "Recuar" ? (
          <>
            <Alavanca
              nu
              valores={HIERARQUIAS}
              atual={doc.hierarquia}
              onPick={(v) => muda({ hierarquia: v })}
              doc={doc}
              campo="hierarquia"
            />
            <Alavanca
              titulo="A borda do botão principal"
              ondeMuda="o contorno na cor da sua marca em volta do botão que faz a coisa acontecer"
              valores={ANEIS}
              atual={doc.anel}
              onPick={(v) => muda({ anel: v })}
              doc={doc}
              campo="anel"
            />
          </>
        ) : null}

        {folha.id === "Numeros" ? (
          <Alavanca
            nu
            valores={NUMEROS}
            atual={doc.numero}
            onPick={(v) => muda({ numero: v })}
            doc={doc}
            campo="numero"
          />
        ) : null}

        {folha.id === "Blocos" ? (
          <Alavanca
            nu
            valores={SUPERFICIES}
            atual={doc.superficie}
            onPick={(v) => muda({ superficie: v })}
            doc={doc}
            campo="superficie"
            amostra={<AmostraSuperficie />}
          />
        ) : null}

        {folha.id === "Traco" ? (
          <>
            <Alavanca
              titulo="Os cantos"
              ondeMuda="botões, campos e blocos — arredondados ou retos"
              valores={FORMAS}
              atual={doc.forma}
              onPick={(v) => muda({ forma: v })}
              doc={doc}
              campo="forma"
              amostra={<AmostraCanto />}
            />
            <Alavanca
              titulo="A espessura das linhas"
              ondeMuda="a linha em volta de tudo que tem borda"
              valores={PESOS}
              atual={doc.peso}
              onPick={(v) => muda({ peso: v })}
              doc={doc}
              campo="peso"
              amostra={<AmostraTraco />}
            />
          </>
        ) : null}

        {folha.id === "Espaco" ? (
          <>
            <Alavanca
              titulo="O espaço"
              ondeMuda="o espaço entre os blocos — o tamanho do dedo nunca encolhe"
              valores={DENSIDADES}
              atual={doc.densidade}
              onPick={(v) => muda({ densidade: v })}
              doc={doc}
              campo="densidade"
              amostra={<AmostraRespiro />}
            />
            {/* MOVIMENTO é a única que não cabe numa amostra parada: ela é tempo. Quem
                mostra é a própria tela — trocar aqui muda a velocidade de tudo que se move
                a partir do toque seguinte. Por isso continua em palavra. */}
            <Alavanca
              titulo="A velocidade"
              ondeMuda="o quanto as coisas demoram para aparecer — toque e sinta na hora"
              valores={MOVIMENTOS}
              atual={doc.movimento}
              onPick={(v) => muda({ movimento: v })}
              doc={doc}
              campo="movimento"
            />
          </>
        ) : null}

        {folha.id === "Texto" ? (
          <Alavanca
            nu
            valores={CONTRASTES}
            atual={doc.contraste}
            onPick={(v) => muda({ contraste: v })}
            doc={doc}
            campo="contraste"
          />
        ) : null}
      </ScrollView>
    </Phone>
  );
}

/** AS MINIATURAS DA FILA. Cada uma é a peça de verdade no rascunho de agora — elas rodam
 *  dentro do `TemaDoTime` do editor, então mudam junto com a escolha —, e todas cabem na
 *  mesma caixa. Tamanho igual não é capricho: numa fila de dez, miniatura de altura livre
 *  faz a coluna da direita serrilhar, e a serra é a primeira coisa que tira o ar de
 *  acabado de uma lista. */
function MiniCores() {
  const styles = usarEstilos();
  const { acento } = useTema();
  return <View style={[styles.miniPonto, { backgroundColor: acento().piece.fill }]} />;
}

function MiniComparacao() {
  const styles = usarEstilos();
  const { acento, secundaria } = useTema();
  return <View style={[styles.miniPonto, { backgroundColor: acento(secundaria).piece.fill }]} />;
}

function MiniFundo() {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <View style={styles.miniEscada}>
      {[T.bg, T.raised, T.ink].map((c, i) => (
        <View key={i} style={[styles.miniDegrau, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

/** O BLOCO e o CANTO dividem a mesma peça porque são a mesma pergunta vista de dois lados:
 *  o que a superfície pinta e onde ela termina. A folha declara os dois. */
function MiniBloco() {
  const styles = usarEstilos();
  const { FORMA } = useTema();
  const peca = FORMA.folha.peca;
  return (
    <View
      style={[
        styles.miniBloco,
        {
          backgroundColor: peca.composto,
          borderWidth: peca.borda,
          borderColor: peca.corDaBorda || "transparent",
          borderRadius: FORMA.raioEm(32),
        },
      ]}
    />
  );
}

/** A FICHA DE UM CHÃO. A amostra é a própria escada daquele fundo — fundo, superfície e
 *  tinta. Nome de cor não diz nada; três degraus dizem tudo, e é por isso que o nome ao
 *  lado pôde deixar de ser poesia. */
function ChaoChip({
  nome,
  escolhido,
  onPress,
}: {
  nome: NomeDoChao;
  escolhido: boolean;
  onPress: () => void;
}) {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Fundo ${NOMES_DO_CHAO[nome]}`}
      accessibilityState={{ selected: escolhido }}
      style={[
        styles.chao,
        { borderColor: escolhido ? T.ink : T.divider },
        escolhido && styles.chaoOn,
      ]}
    >
      <View style={[styles.degrau, { backgroundColor: CHAOS[nome].bg }]} />
      <View style={[styles.degrau, { backgroundColor: CHAOS[nome].raised }]} />
      <View style={[styles.degrau, { backgroundColor: CHAOS[nome].ink }]} />
      <Txt role="note" tone={escolhido ? "ink" : "dim"} style={styles.chaoNome}>
        {NOMES_DO_CHAO[nome]}
      </Txt>
    </Pressable>
  );
}

/** A PRÉVIA: a tela do ALUNO, que é outra coisa do que o editor em volta. Não carrega mais
 *  `TemaDoTime` próprio — o corpo inteiro já é o rascunho —, mas mantém o orçamento de
 *  acento PRÓPRIO: sem isso, o botão de dentro e o "Salvar" de fora reivindicariam a mesma
 *  tela e o console gritaria, com razão.
 *
 *  Duas peças entraram porque a prévia se anuncia como "peças de verdade" e mentia em
 *  ambas. O LOGO no canto do cabeçalho é como a Hoje monta o `Head` (`marca`), e era a
 *  única coisa que o personal compra e não via aqui. A BASELINE é a única peça do app que
 *  a SEGUNDA COR pinta — sem ela ele escolhia uma cor cujo efeito não aparecia em canto
 *  nenhum da tela. */
/** O SELETOR DE COR, EM DOIS PASSOS.
 *
 *  Eram dez quadradinhos numa fila e o dono chamou a variedade de horrível. A resposta
 *  óbvia — pôr cinquenta — foi medida e é pior (ver `ACCENT_CHOICES`): acima de nove
 *  famílias de matiz o próprio motor do app deixa de conseguir separar duas cores, e o
 *  cardápio passa a vender escolha que não existe.
 *
 *  O que cresce sem mentir é a PROFUNDIDADE: oito famílias, três tons cada, mais três
 *  neutros. Vinte e sete cores medidas com zero colisão nos sete chãos. E para não virar
 *  uma parede de quadradinhos, a fila é de FAMÍLIA — ele vê onze coisas e alcança vinte e
 *  sete, com o tom aparecendo só depois de a família ser escolhida.
 *
 *  `permitida` existe para a segunda cor: lá o cardápio é filtrado pelo que o app
 *  consegue MANTER, e uma família cujos três tons seriam movidos não aparece. */
function Paleta({
  atual,
  doc,
  onPick,
  prefixo,
  permitida,
}: {
  atual: string;
  /** o rascunho: é ele que decide quais cores a segunda pode manter, e é a chave do memo. */
  doc: Doc;
  onPick: (c: string) => void;
  prefixo: string;
  permitida?: (c: string) => boolean;
}) {
  const styles = usarEstilos();
  const { acento } = useTema();
  // MEMOIZADO porque `permitida` da segunda cor chama `criarTema` uma vez por candidata:
  // sem isto são 27 fábricas de tema inteiras a cada toque em qualquer lugar da folha, e a
  // alavanca vendida como premium engasga no dedo. A chave é o documento — que é
  // exatamente o que muda a resposta.
  const chave = JSON.stringify(doc);
  const { familias, neutros } = useMemo(() => {
    const pode = (c: string) => (permitida ? permitida(c) : true);
    return {
      familias: FAMILIAS_DA_MARCA.map((nome, i) => ({
        nome,
        i,
        tons: ACCENT_CHOICES.slice(i * 3, i * 3 + 3).filter(pode),
      })).filter((f) => f.tons.length > 0),
      neutros: ACCENT_CHOICES.slice(FAMILIAS_DA_MARCA.length * 3).filter(pode),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);
  // Qual família está aberta: a da cor de agora, se ela for do cardápio. Quem digitou um
  // hex livre ou está no "Automática" cai na primeira — abrir vazio esconderia os tons.
  const daAtual = ACCENT_CHOICES.indexOf(atual as (typeof ACCENT_CHOICES)[number]);
  const [aberta, setAberta] = useState(
    daAtual >= 0 && daAtual < FAMILIAS_DA_MARCA.length * 3 ? Math.floor(daAtual / 3) : 0,
  );
  const familia = familias.find((f) => f.i === aberta) ?? familias[0];

  return (
    <>
      {/* AS OITO FAMÍLIAS NUMA FILA SÓ. Com largura fixa elas quebravam em três filas
          rasgadas (5+5+1) e a fila deixava de ler como "as cores que existem". Aqui cada
          ficha divide a linha por igual, o que também faz o cardápio caber em telas
          estreitas sem virar outra coisa. O alvo do dedo é garantido pelo `hitSlop`, que é
          o que `tools/aparencia.mjs` §12 mede: lado + duas folgas. */}
      <View style={styles.familias}>
        {familias.map((f) => {
          // A ficha da família mostra o tom VIVO — o do meio —, que é o que a pessoa
          // reconhece como "o vermelho". Se o vivo tiver sido filtrado, mostra o que sobrou.
          const cara = f.tons[Math.min(1, f.tons.length - 1)];
          const escolhida = f.i === familia?.i;
          return (
            <Pressable
              key={f.nome}
              onPress={() => setAberta(f.i)}
              accessibilityRole="button"
              accessibilityLabel={`${prefixo}: família ${f.nome}`}
              accessibilityState={{ selected: escolhida }}
              hitSlop={6}
              style={[styles.familia, { backgroundColor: cara }, escolhida && styles.familiaOn]}
            />
          );
        })}
      </View>
      {/* OS NEUTROS não têm família porque não têm matiz: são o preto, o cinza e o branco.
          Fila própria, e não o rabo da fila das famílias, senão a linha de cima passa a
          ter onze itens e a leitura "oito famílias" se perde. */}
      <View style={styles.paleta}>
        {neutros.map((c) => (
          <Pressable
            key={c}
            onPress={() => onPick(c)}
            accessibilityRole="button"
            accessibilityLabel={`${prefixo} ${nomeDaCor(c)}`}
            accessibilityState={{ selected: atual === c }}
            hitSlop={6}
            style={[styles.quadro, { backgroundColor: c }]}
          >
            {atual === c ? <IconCheck color={acento(c).piece.ink} size={24} /> : null}
          </Pressable>
        ))}
      </View>
      {familia ? (
        <View style={styles.paleta}>
          {familia.tons.map((c) => (
            <Pressable
              key={c}
              onPress={() => onPick(c)}
              accessibilityRole="button"
              accessibilityLabel={`${prefixo} ${nomeDaCor(c)}`}
              accessibilityState={{ selected: atual === c }}
              hitSlop={6}
              style={[styles.quadro, { backgroundColor: c }]}
            >
              {atual === c ? (
                <IconCheck color={acento(c).piece.ink} size={24} />
              ) : (
                // O NOME DO TOM sai da posição da cor no cardápio, e não da posição dela
                // na fila desenhada. Na segunda cor a fila é filtrada, e contar a fila
                // fazia um "claro" sobrar rotulado como "vivo" toda vez que o vivo era o
                // que tinha sido tirado — a tela mentindo exatamente no lugar onde ela
                // acabou de passar a dizer a verdade.
                <Txt role="note" color={acento(c).piece.ink}>
                  {TONS_DA_FAMILIA[ACCENT_CHOICES.indexOf(c) % TONS_DA_FAMILIA.length]}
                </Txt>
              )}
            </Pressable>
          ))}
        </View>
      ) : null}
    </>
  );
}

function Previa({
  doc,
  nome,
  logo,
  alto,
}: {
  doc: Doc;
  nome: string;
  logo?: string;
  /** o herói do índice, e não mais um cartão de visita no pé da rolagem. */
  alto?: boolean;
}) {
  const styles = usarEstilos();
  return (
    <View style={[styles.previa, alto && styles.previaAlta]}>
      <AccentBudget>
        <Head
          marca={logo ? <Avatar url={logo} name={nome} size={34} /> : undefined}
          kicker={nome}
          title="Hoje"
        />
        <Band raised rule="none">
          <View style={styles.previaLinha}>
            <Avatar name={nome} accent={doc.primaria} fill size={44} />
            <View style={styles.previaCopy}>
              <Txt role="title" numberOfLines={1}>
                Peito e tríceps
              </Txt>
              <Txt role="note" tone="dim">
                6 exercícios · 52 min
              </Txt>
            </View>
          </View>
          <Baseline value={72} label="média até ontem" />
        </Band>
        {/* AS CÉLULAS DE NÚMERO ficam FORA do herói do índice, e é uma conta de pontos:
            elas custam 125 pontos, e com elas a fila de portas começava a 600 — duas
            portas visíveis de dez, numa tela que existe para mostrar dez. O que o herói
            precisa provar é a cor, o fundo, o bloco, o canto, a letra e o botão, e ele
            prova os seis sem esta grade. O número tem a folha dele, com amostra própria. */}
        {alto ? null : (
          <MetricGrid
            cells={[
              { label: "Ofensiva", value: 12, note: "sessões seguidas" },
              { label: "XP", value: 1840 },
            ]}
          />
        )}
        <Band rule="none">
          <AccentCTA label="Começar" onPress={() => {}} meta="52 MIN" />
        </Band>
      </AccentBudget>
    </View>
  );
}

/** A ALAVANCA QUE SE MOSTRA.
 *
 *  O dono da conta apontou o defeito com todas as letras: "muitas coisas, só de ler, eu não
 *  faço a menor ideia do que faz, onde muda, para que serve". Ele estava certo, e a prova
 *  estava escrita na própria tela: "Traço — a espessura de toda borda · Fino · Médio ·
 *  Grosso" é uma frase que só um designer entende, oferecendo três palavras que não
 *  desenham nada.
 *
 *  A saída não é escrever explicações melhores: é PARAR DE ESCREVER. O tema é uma função
 *  pura — `criarTema(documento)` — então cada opção pode montar o SEU tema e desenhar
 *  dentro dele a peça de verdade que ela controla. A opção "Vidro" não diz "vidro": ela É
 *  um bloco de vidro. A opção "Pílula" é uma pílula. O personal escolhe olhando, que é
 *  como se escolhe aparência em qualquer lugar do mundo menos num painel de configuração.
 *
 *  Nenhuma peça é reimplementada aqui: a amostra usa `Band`, `AccentCTA` e `Txt`, os
 *  mesmos componentes das 36 telas. Amostra desenhada à mão divergiria do app no primeiro
 *  ciclo e passaria a mentir exatamente onde precisa dizer a verdade.
 *
 *  `ondeMuda` substituiu a nota de designer por uma frase que responde a pergunta dele:
 *  ONDE isso aparece. */
function Alavanca<V extends string>({
  titulo,
  ondeMuda,
  nu,
  valores,
  atual,
  onPick,
  doc,
  campo,
  amostra,
  larga,
}: {
  titulo?: string;
  ondeMuda?: string;
  /** NUA: a folha que tem uma alavanca só já disse o nome e o "onde muda" no cabeçalho
   *  dela. Repetir os dois logo abaixo é a tela dizendo a mesma frase duas vezes em quatro
   *  centímetros — e o dono já reclamou de ler coisa que não ajuda a decidir. */
  nu?: boolean;
  valores: { valor: V; rotulo: string }[];
  atual: V;
  onPick: (v: V) => void;
  /** o rascunho inteiro: a amostra tem que mostrar a opção DENTRO das outras escolhas
   *  dele, e não num tema de fábrica que ele nunca vai ver. */
  doc: Doc;
  campo: keyof Doc;
  /** ausente de propósito no movimento: ele é TEMPO, e uma figura parada seria a mesma
   *  figura em três opções — mentira desenhada no lugar exato onde a tela promete
   *  mostrar a verdade. Quem mostra o movimento é o próprio toque. */
  amostra?: ReactNode;
  /** amostra que precisa da largura da tela (botão, superfície, voz) fica uma por linha;
   *  as pequenas (canto, traço, respiro) dividem a fila. */
  larga?: boolean;
}) {
  const styles = usarEstilos();
  const { T, FORMA } = useTema();
  return (
    <Band rule="hair">
      {nu ? null : (
        <>
          <Txt role="label">{titulo}</Txt>
          <Txt role="note" tone="dim" style={styles.nota}>
            {ondeMuda}
          </Txt>
        </>
      )}
      <View style={larga ? styles.pilha : styles.grade}>
        {valores.map((v) => {
          const escolhida = atual === v.valor;
          return (
            <Pressable
              key={v.valor}
              onPress={() => onPick(v.valor)}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhida }}
              accessibilityLabel={`${titulo}: ${v.rotulo}`}
              style={larga ? undefined : styles.tile}
            >
              {/* A MOLDURA DA OPÇÃO NÃO PODE COMPETIR COM A AMOSTRA. As amostras deste
                  editor são peças de verdade, e peça de verdade quase sempre TEM borda —
                  o botão tem, a Band tem, o campo tem. Com a moldura na mesma espessura,
                  cada opção virava dois retângulos concêntricos de peso igual, que é o
                  desenho que faz uma tela parecer feita por gerador e não por mão.
                  Não escolhida, a moldura recua para o FIO, que é metade da borda e é o
                  degrau que este tema usa justamente para "dentro do mesmo objeto".
                  Escolhida, ela sobe para a borda cheia — a diferença entre as duas
                  espessuras é o que carrega a escolha, e não a cor sozinha.

                  E a tinta é `T.ink`, não a marca: UMA GRAMÁTICA DE SELEÇÃO na tela
                  inteira. A régua embaixo já dizia "escolhida" com traço na tinta e as
                  fichas diziam a mesma coisa com a cor do personal — duas gramáticas para
                  uma ideia, na mesma tela. E a segunda ainda gastava o acento, que neste
                  produto tem orçamento de um por tela e pertence ao APP, não ao editor do
                  app. A marca aparece onde ela deve aparecer: dentro da amostra, que é a
                  peça de verdade. */}
              <View
                style={[
                  styles.moldura,
                  escolhida
                    ? { borderWidth: FORMA.borda, borderColor: T.ink }
                    : { borderWidth: FORMA.fio, borderColor: T.divider },
                ]}
              >
                {/* A amostra vive no tema DAQUELA opção. O rótulo fica fora dele, no tema
                    do editor: se o nome da opção mudasse de letra junto com a amostra, a
                    fila viraria seis tipografias brigando e a comparação sumiria. */}
                {amostra ? (
                  <View style={styles.palco} pointerEvents="none">
                    <TemaDoTime aparencia={{ ...doc, [campo]: v.valor }}>
                      {amostra}
                    </TemaDoTime>
                  </View>
                ) : null}
                <View style={styles.rotulo}>
                  <Txt role="label" tone={escolhida ? "ink" : "muted"}>
                    {v.rotulo}
                  </Txt>
                  {escolhida ? <IconCheck color={T.ink} size={16} /> : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Band>
  );
}

/** AS AMOSTRAS. Cada uma é a menor coisa verdadeira que a alavanca controla — e é peça
 *  real, montada pelo tema da opção, não desenho. */
const AMOSTRA_BOTAO = <AccentCTA label="Começar" meta="52 MIN" onPress={() => {}} quiet />;

/** Fora do `estilos()` de propósito: estas amostras são constantes de módulo, montadas uma
 *  vez e reusadas em toda opção do cardápio. Um hook aqui rodaria fora de componente. */
const estilosDaAmostra = StyleSheet.create({
  // `SPACE` cru, e não o do tema: estas amostras são constantes de módulo, montadas uma vez
  // fora de qualquer provider. O vão delas não acompanha a densidade — é uma amostra, não
  // uma tela — mas cai num DEGRAU, que era o que faltava. Estavam em `gap: 2` e
  // `padding: 12`: dois é um quarto do piso que o tema declara com todas as letras ("abaixo
  // de 8 não existe separação, existe defeito de renderização"), e era justamente dentro
  // das peças que vendem o sistema de espaço.
  voz: { gap: SPACE.hair },
  superficie: { padding: SPACE.tight, gap: SPACE.hair },
});

/** A AMOSTRA DA VOZ, e ela é o defeito que o dono viu.
 *
 *  Ela mostrava duas linhas: um número em `value` e um corpo em `body`. `value` desenha na
 *  face do NÚMERO e `body` na de TEXTO — então a terceira face do par, a de DISPLAY, não
 *  aparecia. E a de display é justamente onde uma voz se declara: era ela que carregava a
 *  Playfair da editorial e o Oswald da condensada. O cardápio vendia seis vozes e a
 *  amostra escondia as duas mais distintas.
 *
 *  Agora são três linhas, uma por face do par, e nesta ordem por um motivo cada:
 *    TÍTULO em prosa portuguesa minúscula — "Supino reto" tem p, i, o, r: hastes, bojo e
 *      terminal, que é onde um desenho de letra se declara. "72 kg" não declara nada:
 *      dígitos de sans geométricas são quase o mesmo desenho em qualquer face.
 *    NÚMERO, que é o herói do produto.
 *    RÓTULO, e não corpo, porque é o rótulo que carrega o canal de CAIXA — a única
 *      diferença que se lê num sample do tamanho de um polegar sem reconhecer letra.
 *  Três linhas também são o que torna a RAZÃO visível: a condensada fala 1,2 e a suave
 *  0,88, e duas linhas de tamanhos parecidos não mostram isso. */
const AMOSTRA_VOZ = (
  <View style={estilosDaAmostra.voz}>
    <Txt role="title">Supino reto</Txt>
    <Txt role="value">72 kg</Txt>
    <Txt role="label" tone="muted">
      4 séries · 8 repetições
    </Txt>
  </View>
);

function AmostraSuperficie() {
  return (
    <Band raised rule="none" pad={false}>
      <View style={estilosDaAmostra.superficie}>
        <Txt role="label">Hoje</Txt>
        <Txt role="body">Peito e tríceps</Txt>
      </View>
    </Band>
  );
}

function AmostraCanto() {
  const { T, FORMA } = useTema();
  return (
    <View
      style={{
        height: 44,
        borderRadius: FORMA.raioAcao,
        borderWidth: FORMA.borda,
        borderColor: T.divider,
        backgroundColor: T.fill,
      }}
    />
  );
}

function AmostraTraco() {
  const { T, FORMA } = useTema();
  return (
    <View
      style={{
        height: 44,
        borderRadius: FORMA.raio,
        borderWidth: FORMA.borda,
        borderColor: T.ink,
      }}
    />
  );
}

/** Respiro é o VÃO, então a amostra é três blocos e o espaço entre eles — a única coisa
 *  que muda de uma opção para a outra. */
function AmostraRespiro() {
  const { T, SPACE, FORMA } = useTema();
  const barra = {
    height: 12,
    borderRadius: FORMA.raioEm(12),
    backgroundColor: T.fill,
  } as const;
  return (
    <View style={{ gap: SPACE.tight }}>
      <View style={barra} />
      <View style={barra} />
      <View style={barra} />
    </View>
  );
}

const FOLHAS: Folha[] = [
  {
    id: "Cores",
    titulo: "A cor da sua marca",
    onde: "pinta o botão principal, os destaques e o topo de toda tela do seu aluno",
    resumo: (d) => nomeDaCor(d.primaria),
    mini: <MiniCores />,
  },
  {
    id: "Comparacao",
    titulo: "A cor de comparação",
    onde: "a média ao lado do número do aluno, e a segunda série de todo gráfico",
    resumo: (d) => (d.secundaria === "auto" ? "automática" : nomeDaCor(d.secundaria)),
    mini: <MiniComparacao />,
  },
  {
    id: "Fundo",
    titulo: "A cor de fundo",
    onde: "a tela inteira, do seu app e do app dos seus alunos",
    resumo: (d) => (d.chao in CHAOS ? NOMES_DO_CHAO[d.chao as NomeDoChao] : d.chao),
    mini: <MiniFundo />,
  },
  {
    id: "Letra",
    titulo: "A letra",
    onde: "todo número e todo texto do app, o seu e o do aluno",
    resumo: (d) => rotuloDe(VOZES_DO_CARDAPIO, d.voz),
    // A miniatura da fila é UMA LINHA, e não a amostra da folha. A amostra da voz tem três
    // linhas e um título de 30pt: dentro de uma fila de 64 ela transbordava por cima da
    // linha de baixo. Aqui vai só a face de display num par de letras — que é onde uma
    // fonte se declara — e ela cabe.
    mini: <Txt role="title">Aa</Txt>,
  },
  {
    id: "Botao",
    titulo: "Os botões",
    onde: "o botão principal de cada tela — Começar, Publicar, Salvar — e o de recuar ao lado",
    resumo: (d) =>
      `${rotuloDe(ACOES_DO_CARDAPIO, d.acao)} · ${rotuloDe(PORTES_DO_CARDAPIO, d.porte).toLowerCase()}`,
  },
  {
    id: "Recuar",
    titulo: "O botão de recuar",
    onde: "o botão de sair que fica ao lado do principal — Agora não, Sair, Voltar",
    resumo: (d) => rotuloDe(HIERARQUIAS, d.hierarquia),
  },
  {
    id: "Numeros",
    titulo: "Os números",
    onde: "carga, série, prontidão e recorde — em toda tela que mostra um número",
    resumo: (d) => rotuloDe(NUMEROS, d.numero),
  },
  {
    id: "Blocos",
    titulo: "Os blocos",
    onde: "cada bloco de conteúdo: o treino de hoje, a ficha, os números",
    resumo: (d) => rotuloDe(SUPERFICIES, d.superficie),
    mini: <MiniBloco />,
  },
  {
    id: "Traco",
    titulo: "Cantos e traços",
    onde: "botões, campos e blocos — o canto deles e a grossura de toda linha",
    resumo: (d) => `${rotuloDe(FORMAS, d.forma)} · traço ${rotuloDe(PESOS, d.peso).toLowerCase()}`,
    mini: <MiniBloco />,
  },
  {
    id: "Espaco",
    titulo: "O espaço e a velocidade",
    onde: "o vão entre os blocos e o quanto as coisas demoram para aparecer",
    resumo: (d) =>
      `${rotuloDe(DENSIDADES, d.densidade)} · ${rotuloDe(MOVIMENTOS, d.movimento).toLowerCase()}`,
  },
  {
    id: "Texto",
    titulo: "A força do texto",
    onde: "o quanto o texto de apoio se destaca do fundo — mais firme para quem enxerga menos",
    resumo: (d) => rotuloDe(CONTRASTES, d.contraste),
  },
];

const NOMES_DO_CHAO: Record<NomeDoChao, string> = {
  // "Carvão, Breu, Grafite, Tabaco" são quatro palavras para ESCURO, e o dono não tem como
  // ordenar quatro poesias. O que elas são de verdade é temperatura mais luz, e é isso que
  // o nome passa a dizer. A escadinha de três degraus ao lado do nome continua fazendo a
  // explicação real; o nome só parou de competir com ela.
  carvao: "Preto",
  breu: "Preto puro",
  grafite: "Cinza azulado",
  tabaco: "Marrom escuro",
  papel: "Branco quente",
  neve: "Branco frio",
  linho: "Branco cru",
};

const ACOES_DO_CARDAPIO: { valor: Acao; rotulo: string }[] = [
  { valor: "linha", rotulo: "Linha" },
  { valor: "centro", rotulo: "Centro" },
  { valor: "caixa", rotulo: "Caixa alta" },
  { valor: "empilhada", rotulo: "Empilhado" },
];

/** O PORTE só desce. `folgado` é o tamanho que o app tinha; `justo` para em 48, quatro
 *  pontos acima do alvo de dedo — o personal não consegue escolher um botão difícil de
 *  acertar. Os rótulos dizem o efeito, não o número: ninguém escolhe "52 pontos". */
const PORTES_DO_CARDAPIO: { valor: Porte; rotulo: string }[] = [
  { valor: "justo", rotulo: "Enxuto" },
  { valor: "padrao", rotulo: "Normal" },
  { valor: "folgado", rotulo: "Alto" },
];

const HIERARQUIAS: { valor: Hierarquia; rotulo: string }[] = [
  { valor: "salto", rotulo: "Só o principal" },
  { valor: "parelha", rotulo: "Os dois cheios" },
  { valor: "eco", rotulo: "O segundo apagado" },
];

const ANEIS: { valor: Anel; rotulo: string }[] = [
  { valor: "resgate", rotulo: "Só quando falta" },
  { valor: "sempre", rotulo: "Sempre" },
];

const NUMEROS: { valor: Numero; rotulo: string }[] = [
  { valor: "empilhado", rotulo: "Empilhado" },
  { valor: "linha", rotulo: "Em tabela" },
  { valor: "cartaz", rotulo: "Cartaz" },
];

const CONTRASTES: { valor: Contraste; rotulo: string }[] = [
  { valor: "normal", rotulo: "Normal" },
  { valor: "alto", rotulo: "Alta" },
];

const VOZES_DO_CARDAPIO: { valor: Voz; rotulo: string }[] = [
  { valor: "bloco", rotulo: "Bloco" },
  { valor: "neutra", rotulo: "Neutra" },
  { valor: "tecnica", rotulo: "Técnica" },
  { valor: "editorial", rotulo: "Editorial" },
  { valor: "suave", rotulo: "Suave" },
  { valor: "condensada", rotulo: "Condensada" },
];

const FORMAS: { valor: NomeDaForma; rotulo: string }[] = [
  { valor: "reta", rotulo: "Reto" },
  { valor: "macia", rotulo: "Macio" },
  { valor: "pilula", rotulo: "Pílula" },
];

const SUPERFICIES: { valor: Superficie; rotulo: string }[] = [
  { valor: "solida", rotulo: "Sólida" },
  { valor: "contorno", rotulo: "Contorno" },
  { valor: "elevada", rotulo: "Elevada" },
  // O VIDRO ERA MENTIRA ATÉ AQUI. O cardápio vendia "Vidro" desde o ciclo 6, o tema
  // resolvia o véu e o desfoque inteiros, e nenhum componente lia nada disso: quem tocava
  // Vidro ganhava uma sombra. Não era mentira de desenho, era de encanamento.
  { valor: "vidro", rotulo: "Vidro" },
  { valor: "fio", rotulo: "Fio duplo" },
  { valor: "vinco", rotulo: "Vinco" },
  // CARIMBO é o bloco impresso: uma laje opaca deslocada atrás da peça, sem desfoque e sem
  // alfa. Não é "contorno grosso" — isso é uma regulagem do traço, não um material. É a
  // única família cujo contraste é garantido por construção nos DOIS chãos, porque o bloco
  // é um degrau da escada e não uma sombra que só existe no claro.
  { valor: "carimbo", rotulo: "Carimbo" },
  // SEM BLOCO é o oposto do contorno, não uma versão fraca dele: o conteúdo pousa direto
  // no chão e quem separa dois blocos é o vão. É o material que faltava para o app poder
  // ser realmente silencioso — sem ele, "minimalista" só sabia escolher entre cartão e
  // gaiola, que são as duas mais cromo, não menos.
  { valor: "nenhuma", rotulo: "Sem bloco" },
];

const PESOS: { valor: Peso; rotulo: string }[] = [
  { valor: "fino", rotulo: "Fino" },
  { valor: "medio", rotulo: "Médio" },
  { valor: "grosso", rotulo: "Grosso" },
];

const DENSIDADES: { valor: Densidade; rotulo: string }[] = [
  { valor: "compacta", rotulo: "Compacto" },
  { valor: "normal", rotulo: "Normal" },
  { valor: "arejada", rotulo: "Arejado" },
];

const MOVIMENTOS: { valor: Movimento; rotulo: string }[] = [
  { valor: "seco", rotulo: "Seco" },
  { valor: "normal", rotulo: "Normal" },
  { valor: "generoso", rotulo: "Generoso" },
];

/** AS OITO LINGUAGENS. Não são "temas": cada uma é uma posição inteira, decidindo os
 *  quatorze campos de uma vez, e cada uma existe porque alguém a quer.
 *
 *  Eram seis, e duas coisas estavam erradas nelas. A primeira: `grafite` e `tabaco` — dois
 *  dos sete chãos que este produto mede — não tinham dono nenhum. Estoque parado. Agora as
 *  oito ocupam os sete.
 *
 *  A segunda é a que interessa: "flat" NÃO virou linguagem, e a recusa tem motivo. `solida`
 *  já É flat — sem sombra, sem borda, sem brilho — e duas linguagens já a usavam. O que
 *  distingue flat no mundo é acento como cromo (barra colorida, ficha colorida), e isso
 *  está fechado por lei neste app com um número: acento que aparece três vezes deixa de ser
 *  acento. Vender "Flat" seria duplicar o Ferro ou reabrir uma decisão ganha na medida. A
 *  palavra foi para onde ela entrega de verdade: o material chama-se Sólida.
 *
 *  A PROVA DE QUE SÃO OITO e não menos: seis canais grossos — polaridade, material, canto,
 *  voz, densidade e traço —, e o piso é TRÊS. Não um. Um serve para uma alavanca (é o piso
 *  da voz); uma linguagem que decide quatorze campos e só entrega um canal diferente é um
 *  preset de uma alavanca com nome caro. Os 28 pares medem de 3 a 6, e os quatro que ficam
 *  no piso são Moderno×Vitrine, Moderno×Boutique, Minimalista×Boutique e Vitrine×Sereno.
 *
 *  `Ferro` é o app de hoje, byte a byte: o padrão tem que estar no cardápio, senão voltar
 *  atrás vira adivinhação — e ele é o teste de regressão da fábrica. */
const KITS: { nome: string; doc: Omit<Doc, "primaria" | "secundaria"> }[] = [
  { nome: "Ferro", doc: { acao: "linha", voz: "bloco", chao: "carvao", porte: "padrao", forma: "reta", superficie: "solida", peso: "medio", densidade: "normal", movimento: "normal", hierarquia: "salto", anel: "resgate", numero: "empilhado", contraste: "normal" } },
  { nome: "Moderno", doc: { acao: "empilhada", voz: "neutra", chao: "grafite", porte: "padrao", forma: "macia", superficie: "elevada", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" } },
  { nome: "Minimalista", doc: { acao: "centro", voz: "neutra", chao: "linho", porte: "justo", forma: "reta", superficie: "nenhuma", peso: "fino", densidade: "arejada", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "normal" } },
  { nome: "Cartaz", doc: { acao: "caixa", voz: "condensada", chao: "papel", porte: "folgado", forma: "reta", superficie: "carimbo", peso: "grosso", densidade: "compacta", movimento: "seco", hierarquia: "parelha", anel: "sempre", numero: "empilhado", contraste: "alto" } },
  { nome: "Vitrine", doc: { acao: "linha", voz: "tecnica", chao: "breu", porte: "padrao", forma: "pilula", superficie: "vidro", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "parelha", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  { nome: "Boutique", doc: { acao: "centro", voz: "editorial", chao: "papel", porte: "folgado", forma: "macia", superficie: "elevada", peso: "fino", densidade: "arejada", movimento: "normal", hierarquia: "salto", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  { nome: "Clínica", doc: { acao: "centro", voz: "tecnica", chao: "neve", porte: "justo", forma: "macia", superficie: "fio", peso: "medio", densidade: "compacta", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "alto" } },
  { nome: "Sereno", doc: { acao: "centro", voz: "suave", chao: "tabaco", porte: "folgado", forma: "pilula", superficie: "solida", peso: "fino", densidade: "arejada", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" } },
];

/** Um kit está ativo quando os seis campos dele batem. A cor não entra na conta: trocar a
 *  marca não deve apagar o kit escolhido. */
const KITS_IGUAIS = (doc: Doc, kit: Omit<Doc, "primaria" | "secundaria">) =>
  (Object.keys(kit) as (keyof typeof kit)[]).every((k) => doc[k] === kit[k]);

const usarEstilos = estilos((tema) => {
  const { T, SPACE, FORMA, FONT, TYPE } = tema;
  return StyleSheet.create({
    scroll: { flex: 1 },
    // A FILA DE CENAS: cinco abas de texto, altura de alvo, sem cromo nenhum. Ela não é
    // navegação do app — é a lente sobre o palco.
    // A FILA DE CENAS tem ALTURA FIXA e largura natural. Com `flex: 1` os cinco rótulos
    // dividiam a tela em cinco fatias iguais e "RECORDE" encavalava em "PROGRESSO" — texto
    // não encolhe, ele transborda. Aqui cada aba mede o que a palavra mede, e a fila rola
    // se a voz escolhida for larga demais para caber.
    dizOQueE: { paddingHorizontal: T.pad, paddingTop: SPACE.hair },
    filaDeCenas: {
      flexGrow: 0,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
    },
    filaDeCenasCorpo: {
      flexDirection: "row",
      gap: SPACE.step,
      paddingHorizontal: T.pad,
    },
    abaDeCena: {
      minHeight: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
    palcoRolagem: { flex: 1 },
    pagina: { flex: 1 },
    paginaVazia: { flex: 1, backgroundColor: T.bg },
    // A RÉGUA. Fichas de nome, roláveis, com a escolhida em traço cheio na tinta.
    // A RÉGUA NÃO CRESCE. Sem `flexGrow: 0` a rolagem horizontal reivindica a sobra da
    // coluna e as fichas viravam colunas de 600pt — a régua comia o palco, que é a única
    // coisa que esta tela existe para mostrar.
    reguaFila: { flexGrow: 0 },
    regua: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
    },
    cartao: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      minHeight: FORMA.alturaChip,
      justifyContent: "center",
      paddingHorizontal: SPACE.tight,
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioAcao,
    },
    cartaoOn: { borderWidth: FORMA.borda, borderColor: T.ink },
    reguaLinha: { flexDirection: "row", alignItems: "center" },
    quadradoDoChao: { width: 12, height: 12 },
    cartaoDeCor: {
      minHeight: FORMA.alturaChip,
      minWidth: FORMA.alturaChip,
      alignItems: "center",
      justifyContent: "center",
    },
    pastilha: { width: 24, height: 24, borderRadius: FORMA.raioEm(24) },
    porta2: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      minHeight: FORMA.alturaChip,
      paddingHorizontal: T.pad,
    },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
    // A FILA DO ÍNDICE. `ALVO.linha` é o degrau de 64 que este app declara desde sempre e
    // que nada consumia — é exatamente a altura de uma linha de lista tocável com duas
    // linhas de texto dentro.
    porta: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      minHeight: ALVO.linha,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
    },
    portaCopy: { flex: 1, minWidth: 0 },
    // A caixa da miniatura NUNCA empurra a fila: o que não couber em uma linha da lista é
    // cortado, porque a fila é o índice e não a amostra. Quem mostra tamanho grande é a
    // folha, e quem mostra o app inteiro é o herói lá em cima.
    miniLinha: { flexDirection: "row", gap: SPACE.hair },
    // O canto sai da alavanca, não de um literal: com `borderRadius: 10` cravado, escolher
    // "reto" deixava os pontos de cor redondos ao lado de uma escadinha de cantos vivos —
    // a alavanca de cantos alcançava tudo no índice menos eles.
    miniPonto: { width: 20, height: 20, borderRadius: FORMA.raioEm(20) },
    miniEscada: {
      flexDirection: "row",
      overflow: "hidden",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(20),
    },
    miniDegrau: { width: 10, height: 20 },
    miniBloco: { width: 32, height: 20 },
    portaMini: { maxWidth: "40%", maxHeight: ALVO.chip, overflow: "hidden", justifyContent: "center" },
    avisoLinha: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      marginBottom: SPACE.hair,
    },
    avisoCopy: { flex: 1, minWidth: 0 },
    desfazer: {
      minHeight: FORMA.alturaMinima,
      justifyContent: "center",
      paddingHorizontal: SPACE.hair,
    },
    content: { flexGrow: 1 },
    nota: { marginTop: SPACE.hair },
    // A amostra larga ocupa a linha inteira; a pequena divide a fila em duas colunas de
    // largura igual, para os cantos e os contornos poderem ser comparados lado a lado —
    // que é a única forma de enxergar a diferença entre 1 e 2 pontos de borda.
    pilha: { gap: SPACE.tight, marginTop: SPACE.tight },
    grade: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    tile: { flexGrow: 1, flexBasis: "45%" },
    moldura: {
      borderRadius: FORMA.raio,
      padding: SPACE.tight,
      gap: SPACE.tight,
    },
    // ALTURA FIXA, e não piso. Com `minHeight` cada ficha crescia até o que a amostra dela
    // por acaso medisse: as seis do material saíram com 136, 140, 137, 138, 138 e 137 —
    // nenhuma fila com a mesma base, e as legendas de uma mesma linha 4pt fora de um
    // alinhamento comum. Fila serrilhada é a primeira coisa que denuncia trabalho não
    // acabado. O caminho `larga` já provava o contrário: todas as fichas dele medem exatos
    // 120pt, porque lá quem manda é a peça e não a sobra.
    palco: { height: ALVO.linha + SPACE.tight, justifyContent: "center" },
    rotulo: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    fila: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    paleta: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    familias: {
      flexDirection: "row",
      gap: SPACE.hair,
      marginTop: SPACE.tight,
    },
    familia: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: ALVO.chip,
    },
    // A família escolhida ganha o traço da tinta, não um preenchimento: o preenchimento é
    // a própria cor da família, e não há como destacá-la com ela mesma.
    familiaOn: { borderWidth: FORMA.borda, borderColor: T.ink },
    quadro: {
      width: 52,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(52),
    },
    hex: { marginTop: SPACE.tight },
    duas: { flexDirection: "row", alignItems: "center", gap: SPACE.tight, marginTop: SPACE.tight },
    amostra: {
      width: 34,
      height: 34,
      borderRadius: FORMA.raioEm(34),
    },
    duasNota: { flex: 1, minWidth: 0 },
    chao: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.hair,
      paddingHorizontal: SPACE.tight,
      paddingVertical: SPACE.hair,
      minHeight: FORMA.alturaChip,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioAcao,
    },
    // O escolhido pousa dentro da Band, então o degrau é contado a partir dela. Hoje é
    // exatamente `T.fill`; numa Band levantada, `T.fill` valeria metade do degrau.
    chaoOn: { backgroundColor: neutroNaBand(tema) },
    escada: {
      flexDirection: "row",
      overflow: "hidden",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(24),
    },
    degrau: { width: 12, height: 24 },
    chaoNome: { marginLeft: SPACE.hair },
    avisoDoSalvar: { marginBottom: SPACE.tight },
    // O HERÓI DO ÍNDICE não tem margem lateral nem canto: ele não é um cartão com a tela
    // dentro, ele É a tela. A moldura era o que fazia a prévia ler como maquete, e maquete
    // é exatamente o que esta peça não pode parecer — ela monta `Head`, `Band`, `Metric`,
    // `Baseline` e `AccentCTA` de verdade.
    previaAlta: {
      marginHorizontal: 0,
      borderWidth: 0,
      borderRadius: 0,
      borderBottomWidth: FORMA.borda,
    },
    previa: {
      marginHorizontal: T.pad,
      backgroundColor: T.bg,
      borderColor: T.divider,
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raio,
      overflow: "hidden",
    },
    saida: { paddingHorizontal: T.pad, paddingTop: SPACE.block, paddingBottom: SPACE.step },
    previaLinha: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    previaCopy: { flex: 1, minWidth: 0 },
  });
});
