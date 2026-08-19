import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useState, type ReactNode } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ApiError, aparenciaDoTime, me, patchTime, type Time } from "../../api";
import {
  ACCENT_CHOICES,
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
  type Acao,
  type Anel,
  type Contraste,
  type Hierarquia,
  type Numero,
  type Superficie,
  type Voz,
} from "../../theme";
import { AccentBudget } from "../../ui/accent";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Baseline } from "../../ui/Baseline";
import { Campo } from "../../ui/Campo";
import { Choice } from "../../ui/Choice";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconCheck } from "../../ui/Icons";
import { MetricGrid } from "../../ui/Metric";
import { Band, Head, neutroNaBand, Phone, useFimDaRolagem } from "../../ui/Screen";
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
 *  trocar era uma cor de acento. Esta tela entrega o documento inteiro: chão, marca,
 *  canto, superfície, traço, respiro e movimento — 1.959.552 combinações fechadas, cada uma
 *  já medida por `node tools/aparencia.mjs` antes de existir botão para escolhê-la.
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

function Corpo({
  doc,
  time,
  sujo,
  busy,
  erro,
  digitado,
  setDigitado,
  chaoDigitado,
  setChaoDigitado,
  muda,
  salvar,
  descartar,
}: CorpoProps) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const navigation = useNavigation();
  const { T, acento, errorInk, secundaria } = useTema();
  const corDigitada = corLivre(digitado);
  // O chão livre resolvido: a escada inteira que aquele hex produz. É o MESMO `escada()`
  // que `criarTema` chama, não uma prévia paralela — prévia paralela é a que mente.
  const chaoLivre = corLivre(chaoDigitado);
  const escadaLivre = chaoLivre ? escada(chaoLivre) : null;
  // A prova de que o chão ANDOU: o `bg` que sai da escada não é o hex que entrou. Não se
  // anuncia a janela em L* para quem digitou uma cor que já está dentro dela.
  const chaoAndou = !!escadaLivre && escadaLivre.bg !== chaoLivre;

  return (
    <Phone>
      <Head kicker={time.name} title="Aparência" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        <Band rule="hair">
          <Txt role="label">Kits prontos</Txt>
          <Txt role="note" tone="dim" style={styles.nota}>
            um clique monta o app inteiro. Depois ajuste peça a peça.
          </Txt>
          <View style={styles.fila}>
            {KITS.map((k) => (
              <Choice
                key={k.nome}
                label={k.nome}
                selected={KITS_IGUAIS(doc, k.doc)}
                onPress={() => muda(k.doc)}
              />
            ))}
          </View>
        </Band>

        <Band rule="hair">
          <Txt role="label">A cor da marca</Txt>
          <View style={styles.paleta}>
            {ACCENT_CHOICES.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  muda({ primaria: c });
                  setDigitado(c);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Cor ${nomeDaCor(c)}`}
                accessibilityState={{ selected: doc.primaria === c }}
                hitSlop={4}
                style={[styles.quadro, { backgroundColor: c }]}
              >
                {doc.primaria === c ? (
                  <IconCheck color={acento(c).piece.ink} size={24} />
                ) : null}
              </Pressable>
            ))}
          </View>
          {/* A COR LIVRE. As dez acima são sugestão — a marca dele pode não estar lá, e
              dizer "escolha uma das dez" a quem já tem uma marca é decidir pela marca de
              alguém. Quem garante que a cor digitada sobrevive aos quatro fundos é o
              mesmo motor de sempre (`acento`), não o cardápio: o cardápio nunca foi a
              garantia, e é por isso que abrir o campo não abre buraco nenhum. */}
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
          <View style={styles.duas}>
            {/* As duas amostras são a PRÉVIA da decisão, e prévia muda não é prévia: sem
                nome acessível elas eram dois retângulos silenciosos para quem escolhe a
                marca do próprio estúdio no escuro. `nomeDaCor` alcança também a cor
                digitada, que cardápio nenhum saberia nomear. */}
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel={`A sua cor: ${nomeDaCor(doc.primaria)}`}
              style={[styles.amostra, { backgroundColor: acento(doc.primaria).piece.fill }]}
            />
            <View
              accessible
              accessibilityRole="image"
              accessibilityLabel={`A segunda cor: ${nomeDaCor(secundaria)}`}
              style={[styles.amostra, { backgroundColor: acento(secundaria).piece.fill }]}
            />
            <Txt role="note" tone="dim" style={styles.duasNota}>
              a segunda cor marca a SEGUNDA SÉRIE — a média ao lado do seu número. Sai da
              primeira por harmonia, e o app garante que as duas nunca cheguem iguais na
              tela, nem perto do vermelho do aviso.
            </Txt>
          </View>
        </Band>

        {/* A SEGUNDA COR, se o personal quiser cravar. O padrão é derivar: duas cores
            escolhidas à mão por quem não é designer brigam, e a harmonia acerta sozinha.
            Mas a marca é dele, e às vezes ela TEM uma segunda cor de verdade — negar isso
            seria decidir pela marca de alguém. Cravada ou derivada, ela passa pelo mesmo
            afastamento: contra a primeira depois do motor de peça, e contra o aviso. */}
        <Band rule="hair">
          <Txt role="label">A segunda cor</Txt>
          <View style={styles.fila}>
            <Choice
              label="Automática"
              selected={doc.secundaria === "auto"}
              onPress={() => muda({ secundaria: "auto" })}
            />
          </View>
          <View style={styles.paleta}>
            {ACCENT_CHOICES.map((c) => (
              <Pressable
                key={c}
                onPress={() => muda({ secundaria: c })}
                accessibilityRole="button"
                accessibilityLabel={`Segunda cor ${nomeDaCor(c)}`}
                accessibilityState={{ selected: doc.secundaria === c }}
                hitSlop={4}
                style={[styles.quadro, { backgroundColor: c }]}
              >
                {doc.secundaria === c ? (
                  <IconCheck color={acento(c).piece.ink} size={24} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Band>

        <Band rule="hair">
          <Txt role="label">Chão</Txt>
          <View style={styles.fila}>
            {(Object.keys(CHAOS) as NomeDoChao[]).map((c) => (
              <Pressable
                key={c}
                onPress={() => muda({ chao: c })}
                accessibilityRole="button"
                accessibilityLabel={`Chão ${NOMES_DO_CHAO[c]}`}
                accessibilityState={{ selected: doc.chao === c }}
                style={[
                  styles.chao,
                  { borderColor: doc.chao === c ? T.ink : T.divider },
                  doc.chao === c && styles.chaoOn,
                ]}
              >
                {/* A amostra é a própria escada daquele chão: fundo, superfície e tinta.
                    Nome de cor não diz nada; três degraus dizem tudo. */}
                <View style={[styles.degrau, { backgroundColor: CHAOS[c].bg }]} />
                <View style={[styles.degrau, { backgroundColor: CHAOS[c].raised }]} />
                <View style={[styles.degrau, { backgroundColor: CHAOS[c].ink }]} />
                <Txt role="note" tone={doc.chao === c ? "ink" : "dim"} style={styles.chaoNome}>
                  {NOMES_DO_CHAO[c]}
                </Txt>
              </Pressable>
            ))}
          </View>
          {/* O CHÃO LIVRE. Os sete acima são dado medido, e continuam sendo o que o app
              entrega a quem os escolheu — mas o estúdio dele tem uma parede, e mandar o
              dono de uma marca escolher entre sete cinzas é o mesmo erro que "escolha uma
              das dez" era na cor da marca. O campo é o mesmo campo: `corLivre` valida,
              `nomeDaCor` nomeia, a amostra é a prévia ao vivo.

              A diferença que a marca não tem: o chão ANDA. Fundo no meio da escala não
              sustenta nem texto a 4,5 nem linha a 3 — então em vez de recusar a cor, a
              janela de L* aproxima para a versão usável mais perto, guardando matiz e
              croma. Recusar seria devolver um erro para quem digitou a cor certa da
              parede errada; aproximar devolve o app dele funcionando. */}
          <Campo
            label="A cor do chão em hexadecimal"
            hint="Seis dígitos; o app aproxima para o tom que sustenta texto e linha"
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
          {escadaLivre ? (
            <View style={styles.duas}>
              {/* Três degraus, como nos sete do cardápio: fundo, superfície e tinta. É a
                  única resposta honesta a "que cor vai ficar" quando a cor que sai não é
                  a que entrou. */}
              <View
                accessible
                accessibilityRole="image"
                accessibilityLabel={`O seu chão: ${nomeDaCor(escadaLivre.bg)}`}
                style={styles.escada}
              >
                <View style={[styles.degrau, { backgroundColor: escadaLivre.bg }]} />
                <View style={[styles.degrau, { backgroundColor: escadaLivre.raised }]} />
                <View style={[styles.degrau, { backgroundColor: escadaLivre.ink }]} />
              </View>
              <Txt role="note" tone="dim" style={styles.duasNota}>
                {chaoAndou
                  ? "o app aproximou: no meio da escala nenhum fundo sustenta texto e linha ao mesmo tempo. O matiz e a força da cor são os seus."
                  : "daí saem os outros nove tons — superfície, linha e texto, todos medidos contra este fundo."}
              </Txt>
            </View>
          ) : null}
        </Band>

        {/* `ondeMuda` responde a pergunta que o dono fez — ONDE isso aparece — em vez de
            definir o termo de design. "a espessura de toda borda" não ajuda ninguém a
            decidir; "os botões e o cabeçalho de cada aluno" ajuda. */}
        <Alavanca
          titulo="A letra"
          ondeMuda="todo número e todo texto do app, o seu e o do aluno"
          valores={VOZES_DO_CARDAPIO}
          atual={doc.voz}
          onPick={(v) => muda({ voz: v })}
          doc={doc}
          campo="voz"
          amostra={AMOSTRA_VOZ}
          larga
        />
        <Alavanca
          titulo="O botão"
          ondeMuda="o botão principal de cada tela — Começar, Publicar, Salvar"
          valores={ACOES_DO_CARDAPIO}
          atual={doc.acao}
          onPick={(v) => muda({ acao: v })}
          doc={doc}
          campo="acao"
          amostra={AMOSTRA_BOTAO}
          larga
        />
        {/* AS QUATRO NOVAS SAEM EM PALAVRA, e é decisão, não pressa: a amostra desta tela
            monta as peças DE VERDADE, e enquanto o campo, a fila e a célula não obedecerem
            à folha nova, uma figura aqui desenharia uma promessa que o app ainda não paga —
            mentira exatamente no lugar onde a tela existe para dizer a verdade. Mesma
            regra que já vale para o movimento. */}
        <Alavanca
          titulo="O segundo botão"
          ondeMuda="quanto o botão de recuar pesa ao lado do principal — Agora não, Sair, Voltar"
          valores={HIERARQUIAS}
          atual={doc.hierarquia}
          onPick={(v) => muda({ hierarquia: v })}
          doc={doc}
          campo="hierarquia"
        />
        <Alavanca
          titulo="O anel do botão"
          ondeMuda="o contorno na cor da sua marca em volta do botão principal"
          valores={ANEIS}
          atual={doc.anel}
          onPick={(v) => muda({ anel: v })}
          doc={doc}
          campo="anel"
        />
        <Alavanca
          titulo="Os números"
          ondeMuda="como cada número se apresenta — carga, série, prontidão, recorde"
          valores={NUMEROS}
          atual={doc.numero}
          onPick={(v) => muda({ numero: v })}
          doc={doc}
          campo="numero"
        />
        <Alavanca
          titulo="A força da tinta"
          ondeMuda="o quanto o texto secundário se destaca do fundo — mais firme para quem enxerga menos"
          valores={CONTRASTES}
          atual={doc.contraste}
          onPick={(v) => muda({ contraste: v })}
          doc={doc}
          campo="contraste"
        />
        <Alavanca
          titulo="Os blocos"
          ondeMuda="cada bloco de conteúdo: o treino de hoje, a ficha, os números"
          valores={SUPERFICIES}
          atual={doc.superficie}
          onPick={(v) => muda({ superficie: v })}
          doc={doc}
          campo="superficie"
          amostra={<AmostraSuperficie />}
          larga
        />
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
          titulo="O contorno"
          ondeMuda="a linha em volta de tudo que tem borda"
          valores={PESOS}
          atual={doc.peso}
          onPick={(v) => muda({ peso: v })}
          doc={doc}
          campo="peso"
          amostra={<AmostraTraco />}
        />
        <Alavanca
          titulo="O respiro"
          ondeMuda="o espaço entre os blocos — o tamanho do dedo nunca encolhe"
          valores={DENSIDADES}
          atual={doc.densidade}
          onPick={(v) => muda({ densidade: v })}
          doc={doc}
          campo="densidade"
          amostra={<AmostraRespiro />}
        />
        {/* MOVIMENTO é a única que não cabe numa amostra parada: ela é tempo. Quem mostra
            é a própria tela — trocar aqui muda a velocidade de tudo que se move a partir
            do toque seguinte, inclusive das outras escolhas desta tela. Por isso ela
            continua em palavra, e a palavra diz o que se sente. */}
        <Alavanca
          titulo="O movimento"
          ondeMuda="o quanto as coisas demoram para aparecer — toque e sinta na hora"
          valores={MOVIMENTOS}
          atual={doc.movimento}
          onPick={(v) => muda({ movimento: v })}
          doc={doc}
          campo="movimento"
        />

        <Band rule="none">
          <Txt role="label">O que o aluno vê</Txt>
          <Txt role="note" tone="dim" style={styles.nota}>
            peças de verdade, não maquete
          </Txt>
        </Band>
        <Previa doc={doc} nome={time.name} logo={time.logo_url} />

        <Band raised grow rule="none">
          {/* QUEM PAGA A CONTA não estava escrito em lugar nenhum: este Salvar não muda o
              app do personal, muda o de TODOS os alunos dele de uma vez. */}
          <Txt role="note" tone="dim" style={styles.avisoDoSalvar}>
            salvar troca o app de todos os seus alunos, não só o seu.
          </Txt>
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
        </Band>

        {/* A saída EXPLÍCITA — e o DESFAZER, que é a mesma peça. Tocar um kit sobrescreve
            as oito alavancas de uma vez, e até aqui não havia volta: o único caminho de
            regresso era lembrar o documento anterior de cabeça. Com rascunho sujo o botão
            devolve o que está gravado; limpo, ele é a porta de saída de sempre — o app
            inteiro volta por gesto de borda, e prender quem não conhece o gesto numa tela
            de ajuste é o pior lugar possível para prender alguém. */}
        <View style={styles.saida}>
          <GhostCTA
            label={sujo ? "Descartar mudanças" : "Voltar"}
            onPress={sujo ? descartar : () => navigation.goBack()}
            fundo={T.bg}
          />
        </View>
      </ScrollView>
    </Phone>
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
function Previa({ doc, nome, logo }: { doc: Doc; nome: string; logo?: string }) {
  const styles = usarEstilos();
  return (
    <View style={styles.previa}>
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
        <MetricGrid
          cells={[
            { label: "Ofensiva", value: 12, note: "sessões seguidas" },
            { label: "XP", value: 1840 },
          ]}
        />
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
  valores,
  atual,
  onPick,
  doc,
  campo,
  amostra,
  larga,
}: {
  titulo: string;
  ondeMuda: string;
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
  const { T, acento } = useTema();
  const marca = acento().piece;
  return (
    <Band rule="hair">
      <Txt role="label">{titulo}</Txt>
      <Txt role="note" tone="dim" style={styles.nota}>
        {ondeMuda}
      </Txt>
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
              <View
                style={[
                  styles.moldura,
                  { borderColor: escolhida ? marca.fill : T.divider },
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
                  {escolhida ? <IconCheck color={marca.fill} size={16} /> : null}
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

const AMOSTRA_VOZ = (
  <View style={{ gap: 2 }}>
    <Txt role="value">72 kg</Txt>
    <Txt role="body" tone="muted">
      Supino reto · 4 séries
    </Txt>
  </View>
);

function AmostraSuperficie() {
  return (
    <Band raised rule="none" pad={false}>
      <View style={{ padding: 12, gap: 2 }}>
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

const NOMES_DO_CHAO: Record<NomeDoChao, string> = {
  carvao: "Carvão",
  breu: "Breu",
  grafite: "Grafite",
  tabaco: "Tabaco",
  papel: "Papel",
  neve: "Neve",
  linho: "Linho",
};

const ACOES_DO_CARDAPIO: { valor: Acao; rotulo: string }[] = [
  { valor: "linha", rotulo: "Linha" },
  { valor: "centro", rotulo: "Centro" },
  { valor: "caixa", rotulo: "Caixa alta" },
  { valor: "empilhada", rotulo: "Empilhado" },
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
  { valor: "vidro", rotulo: "Vidro" },
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

/** KITS DE FÁBRICA: documentos inteiros que já saíram medidos. `Ferro` é o app de hoje —
 *  o padrão tem que estar no cardápio, senão voltar atrás vira adivinhação. */
const KITS: { nome: string; doc: Omit<Doc, "primaria" | "secundaria"> }[] = [
  { nome: "Ferro", doc: { acao: "linha", voz: "bloco", chao: "carvao", forma: "reta", superficie: "solida", peso: "medio", densidade: "normal", movimento: "normal", hierarquia: "salto", anel: "resgate", numero: "empilhado", contraste: "normal" } },
  { nome: "Clínica", doc: { acao: "centro", voz: "tecnica", chao: "neve", forma: "reta", superficie: "contorno", peso: "medio", densidade: "arejada", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "alto" } },
  { nome: "Boutique", doc: { acao: "centro", voz: "editorial", chao: "papel", forma: "macia", superficie: "elevada", peso: "fino", densidade: "arejada", movimento: "normal", hierarquia: "salto", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  { nome: "Vitrine", doc: { acao: "linha", voz: "tecnica", chao: "breu", forma: "pilula", superficie: "vidro", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "parelha", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  { nome: "Garagem", doc: { acao: "caixa", voz: "condensada", chao: "papel", forma: "reta", superficie: "solida", peso: "grosso", densidade: "compacta", movimento: "seco", hierarquia: "parelha", anel: "sempre", numero: "empilhado", contraste: "alto" } },
  { nome: "Sereno", doc: { acao: "centro", voz: "suave", chao: "linho", forma: "macia", superficie: "solida", peso: "fino", densidade: "arejada", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" } },
];

/** Um kit está ativo quando os seis campos dele batem. A cor não entra na conta: trocar a
 *  marca não deve apagar o kit escolhido. */
const KITS_IGUAIS = (doc: Doc, kit: Omit<Doc, "primaria" | "secundaria">) =>
  (Object.keys(kit) as (keyof typeof kit)[]).every((k) => doc[k] === kit[k]);

const usarEstilos = estilos((tema) => {
  const { T, SPACE, FORMA, FONT, TYPE } = tema;
  return StyleSheet.create({
    scroll: { flex: 1 },
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
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raio,
      padding: SPACE.tight,
      gap: SPACE.tight,
    },
    palco: { minHeight: 44, justifyContent: "center" },
    rotulo: { flexDirection: "row", alignItems: "center", gap: 6 },
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
