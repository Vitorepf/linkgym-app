import { useNavigation } from "@react-navigation/native";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { configDoTime, me, patchTime, type Time, type TimeConfig } from "../../api";
import { AccentCTA } from "../../ui/AccentCTA";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconCheck, IconClose } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
  onTimeChange: (next: Time) => void;
};

type Cfg = ReturnType<typeof configDoTime>;

/** COMO O APP FUNCIONA — a porta própria, e cada opção mostrando o que ela faz.
 *
 *  Duas queixas do dono, e as duas são a mesma: "em Perfil tem a configuração do app,
 *  personalização etc.; seria muito mais premium se tivesse um botão que leva a uma tela
 *  exclusivamente sobre isso" e "muitas coisas, só de ler, eu não faço a menor ideia do que
 *  faz, onde muda, para que serve".
 *
 *  A primeira é de arquitetura: estas seis decisões mudam o app de TODOS os alunos dele e
 *  estavam espremidas entre o campo de nome e o botão de sair, na mesma tela em que ele
 *  troca a foto. Coisa importante em corredor de passagem parece pouco importante.
 *
 *  A segunda é de linguagem, e a resposta é a mesma da tela de Aparência: parar de
 *  escrever. "Liga · Nomes · Anônima · Sem liga" não diz nada; três listas de verdade, uma
 *  com nomes, uma com "Aluno 4", e uma que não existe, dizem tudo sem uma palavra.
 *
 *  As amostras são peças reais (`Initials`, `MetricGrid`, `Txt`) no tema vivo do estúdio —
 *  amostra desenhada à mão divergiria do app no primeiro ciclo e passaria a mentir
 *  exatamente onde a tela promete mostrar a verdade. */
export function ComoFunciona({ token, time, onTimeChange }: Props) {
  const styles = usarEstilos();
  const navigation = useNavigation();
  const { T, errorInk } = useTema();
  const inicial = configDoTime(time);
  const [cfg, setCfg] = useState(inicial);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  const dirty = JSON.stringify(cfg) !== JSON.stringify(inicial);

  function muda(parte: Partial<Cfg>) {
    setCfg((c) => {
      const next = { ...c, ...parte };
      // O acoplamento da fábrica, que impede combinação incoerente de ser representável:
      // ranking por número que o aluno não vê não é ranking, é sorteio.
      if (parte.xp === false) next.liga = "off";
      if (parte.liga && parte.liga !== "off") next.xp = true;
      return next;
    });
  }

  async function salvar() {
    if (!dirty || busy) return;
    setBusy(true);
    try {
      // O PATCH grava o documento INTEIRO, então esta tela carrega junto o que é das
      // outras: a aparência (que mora na tela de Aparência) e as duas frases da voz (que
      // moram no Perfil). Sem isso, salvar aqui apagaria as duas coisas pela porta dos
      // fundos e sem mensagem nenhuma — foi exatamente o que já aconteceu uma vez, com a
      // cor da marca.
      const config: TimeConfig = {
        ...(time.config?.aparencia ? { aparencia: time.config.aparencia } : {}),
        liga: cfg.liga,
        selos: cfg.selos,
        xp: cfg.xp,
        prontidao: cfg.prontidao,
        passo_kg: cfg.passo_kg,
        dias_padrao: cfg.dias_padrao,
        ...(cfg.boas_vindas ? { boas_vindas: cfg.boas_vindas } : {}),
        ...(cfg.retomada ? { retomada: cfg.retomada } : {}),
      };
      await patchTime(token, { config });
      onTimeChange((await me(token)).time);
      setErro("");
      navigation.goBack();
    } catch {
      setErro("Não deu para salvar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      <Head
        kicker={time.name}
        title="Como o app funciona"
        body="Seis decisões que valem para todos os seus alunos. Cada uma mostra aqui o que o aluno passa a ver."
        // A SAÍDA MORA NO CABEÇALHO. A regra que saiu do ciclo 9: uma ação de largura
        // cheia por tela, a saída no cabeçalho, e uma terceira ação não existe. Aqui ela
        // era uma laje no rodapé — 68 pontos de cromo permanente, sempre na tela, para
        // duplicar o gesto de borda que a navegação já entende. No cabeçalho ela não custa
        // ponto vertical nenhum: a linha já existe e já estava vazia.
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Os presets primeiro, porque a maioria vai escolher um e ir embora — e porque
            eles são a única linha desta tela que já saiu medida como conjunto. */}
        <Band rule="hair">
          <Txt role="label">O tipo do seu trabalho</Txt>
          <Txt role="note" tone="dim" style={styles.nota}>
            escolha um e pronto — ou ajuste peça por peça abaixo
          </Txt>
          <View style={styles.grade}>
            {PRESETS.map((p) => (
              <Opcao
                key={p.nome}
                rotulo={p.nome}
                escolhida={presetAtivo(cfg, p.cfg)}
                onPress={() => muda(p.cfg)}
                titulo="O tipo do seu trabalho"
                abaixo={p.explica}
              />
            ))}
          </View>
        </Band>

        <Grupo
          titulo="A liga"
          oQueE="a lista que compara seus alunos entre si, no Progresso de cada um"
        >
          <Opcao
            rotulo="Com nomes"
            escolhida={cfg.liga === "nomes"}
            onPress={() => muda({ liga: "nomes" })}
            titulo="A liga"
            larga
          >
            <AmostraLiga nomes={["Marina", "Você", "Diego"]} />
          </Opcao>
          <Opcao
            rotulo="Sem nomes"
            escolhida={cfg.liga === "anonima"}
            onPress={() => muda({ liga: "anonima" })}
            titulo="A liga"
            larga
          >
            <AmostraLiga nomes={["Aluno 3", "Você", "Aluno 5"]} />
          </Opcao>
          <Opcao
            rotulo="Sem liga nenhuma"
            escolhida={cfg.liga === "off"}
            onPress={() => muda({ liga: "off" })}
            titulo="A liga"
            larga
          >
            <Txt role="note" tone="dim">
              o aluno não vê os outros — o Progresso é só o dele
            </Txt>
          </Opcao>
        </Grupo>

        <Grupo
          titulo="Os números do aluno"
          oQueE="o que aparece no Progresso e no Perfil dele"
        >
          <Opcao
            rotulo={cfg.xp ? "XP ligado" : "XP desligado"}
            escolhida={cfg.xp}
            onPress={() => muda({ xp: !cfg.xp })}
            titulo="Os números do aluno"
            larga
          >
            <MetricGrid cells={[{ label: "XP", value: 1840, note: "no total" }]} />
          </Opcao>
          <Opcao
            rotulo={cfg.selos ? "Selos ligados" : "Selos desligados"}
            escolhida={cfg.selos}
            onPress={() => muda({ selos: !cfg.selos })}
            titulo="Os números do aluno"
            larga
          >
            <Txt role="note" tone="dim">
              marcos como "10 sessões" e "primeiro recorde"
            </Txt>
          </Opcao>
          <Opcao
            rotulo={cfg.prontidao ? "Prontidão ligada" : "Prontidão desligada"}
            escolhida={cfg.prontidao}
            onPress={() => muda({ prontidao: !cfg.prontidao })}
            titulo="Os números do aluno"
            larga
          >
            <MetricGrid cells={[{ label: "Prontidão", value: 72, unit: "de 100" }]} />
          </Opcao>
        </Grupo>

        <Grupo
          titulo="O passo da carga"
          oQueE="de quanto em quanto o aluno sobe o peso, no botão da série"
        >
          {[0.5, 1, 2.5].map((n) => (
            <Opcao
              key={n}
              rotulo={`${String(n).replace(".", ",")} kg`}
              escolhida={cfg.passo_kg === n}
              onPress={() => muda({ passo_kg: n })}
              titulo="O passo da carga"
            >
              <Txt role="body">{`− ${String(n).replace(".", ",")}  ·  + ${String(n).replace(".", ",")}`}</Txt>
            </Opcao>
          ))}
        </Grupo>

        <Grupo
          titulo="Dias por semana"
          oQueE="quantos dias já vêm marcados quando o aluno assume o compromisso"
        >
          {[2, 3, 4, 5, 6].map((n) => (
            <Opcao
              key={n}
              rotulo={`${n} dias`}
              escolhida={cfg.dias_padrao === n}
              onPress={() => muda({ dias_padrao: n })}
              titulo="Dias por semana"
            />
          ))}
        </Grupo>

        {erro ? (
          <Band rule="none">
            <Txt role="body" color={errorInk} accessibilityRole="alert">
              {erro}
            </Txt>
          </Band>
        ) : null}
      </ScrollView>

      <DockFooter>
        <AccentCTA
          label={busy ? "Salvando…" : "Salvar"}
          onPress={() => void salvar()}
          disabled={!dirty}
          busy={busy}
          check
        />
      </DockFooter>
    </Phone>
  );
}

function Grupo({
  titulo,
  oQueE,
  children,
}: {
  titulo: string;
  oQueE: string;
  children: ReactNode;
}) {
  const styles = usarEstilos();
  return (
    <Band rule="hair">
      <Txt role="label">{titulo}</Txt>
      <Txt role="note" tone="dim" style={styles.nota}>
        {oQueE}
      </Txt>
      <View style={styles.grade}>{children}</View>
    </Band>
  );
}

/** A opção com a amostra dentro. Sem amostra, é só o rótulo — e isso é honesto: "5 dias"
 *  não tem figura, e inventar uma para preencher a grade seria decoração fingindo de
 *  explicação. */
function Opcao({
  rotulo,
  escolhida,
  onPress,
  titulo,
  larga,
  children,
  abaixo,
}: {
  rotulo: string;
  escolhida: boolean;
  onPress: () => void;
  titulo: string;
  larga?: boolean;
  /** amostra VISUAL, que vem antes do nome porque é ela que se olha primeiro. */
  children?: ReactNode;
  /** legenda, que vem DEPOIS do nome: "Fisio" tem que ser lido antes de "sem comparação
   *  e sem pontos", senão a frase fica órfã de assunto. */
  abaixo?: string;
}) {
  const styles = usarEstilos();
  const { T, acento } = useTema();
  const marca = acento().piece;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: escolhida }}
      accessibilityLabel={`${titulo}: ${rotulo}`}
      style={larga ? styles.larga : styles.tile}
    >
      <View
        style={[styles.moldura, { borderColor: escolhida ? marca.fill : T.divider }]}
      >
        {children ? (
          <View style={styles.palco} pointerEvents="none">
            {children}
          </View>
        ) : null}
        <View style={styles.rotulo}>
          <Txt role="label" tone={escolhida ? "ink" : "muted"}>
            {rotulo}
          </Txt>
          {escolhida ? <IconCheck color={marca.fill} size={16} /> : null}
        </View>
        {abaixo ? (
          <Txt role="note" tone="dim">
            {abaixo}
          </Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

/** A liga de verdade: três linhas, a do meio é a do aluno. É o mesmo `Initials` das telas
 *  do dono, então o rosto anônimo continua sendo o rosto anônimo do app. */
function AmostraLiga({ nomes }: { nomes: string[] }) {
  const styles = usarEstilos();
  return (
    <View style={styles.liga}>
      {nomes.map((n, i) => (
        <View key={n} style={styles.ligaLinha}>
          <Txt role="label" tone="dim">
            {i + 3}
          </Txt>
          <Initials name={n} size={24} />
          <Txt role="body" numberOfLines={1}>
            {n}
          </Txt>
        </View>
      ))}
    </View>
  );
}

/** Perfis de fábrica: configurações inteiras que já saíram medidas. A frase de cada um
 *  existe porque "Fisio" só quer dizer alguma coisa para quem já sabe o que ela liga. */
const PRESETS: { nome: string; explica: string; cfg: Partial<Cfg> }[] = [
  {
    nome: "Performance",
    explica: "compara, pontua e sobe rápido",
    cfg: { liga: "nomes", selos: true, xp: true, prontidao: true, passo_kg: 2.5, dias_padrao: 5 },
  },
  {
    nome: "Studio",
    explica: "compara sem expor nome",
    cfg: { liga: "anonima", selos: true, xp: true, prontidao: true, passo_kg: 2.5, dias_padrao: 3 },
  },
  {
    nome: "Fisio",
    explica: "sem comparação e sem pontos",
    cfg: { liga: "off", selos: false, xp: false, prontidao: true, passo_kg: 1, dias_padrao: 2 },
  },
  {
    nome: "Sênior",
    explica: "passo curto e semana leve",
    cfg: { liga: "off", selos: true, xp: false, prontidao: true, passo_kg: 0.5, dias_padrao: 2 },
  },
];

function presetAtivo(cfg: Cfg, alvo: Partial<Cfg>): boolean {
  return (Object.keys(alvo) as (keyof Cfg)[]).every((k) => cfg[k] === alvo[k]);
}

const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    conteudo: { paddingBottom: SPACE.step },
    nota: { marginTop: SPACE.hair },
    grade: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    tile: { flexGrow: 1, flexBasis: "45%" },
    larga: { width: "100%" },
    moldura: {
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raio,
      padding: SPACE.tight,
      gap: SPACE.tight,
      minHeight: FORMA.alturaChip,
      justifyContent: "center",
    },
    palco: { gap: SPACE.hair },
    rotulo: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    liga: { gap: SPACE.hair },
    ligaLinha: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);
