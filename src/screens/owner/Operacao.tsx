import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ownerOperacao,
  pagarMensalidade,
  receberCobranca,
  type Cobranca,
  type OwnerOperacao,
  type Time,
} from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { abrirWhatsApp } from "../../whatsapp";
import { IconChevron } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { Figure } from "../../ui/Figure";
import { useEdgeTone } from "../../ui/motion";
import { formatNum } from "../../ui/format";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
};

/** A OPERAÇÃO do personal: as leituras da Mensalidade sobre a turma, quem está em aberto
 *  — com a única ação que o domínio permite, marcar pago — e quem está perto de sumir.
 *
 *  O app NUNCA cobra o aluno: tudo aqui é para o olho e o dedo do personal. Por isso a
 *  ação da linha é "Pago" (um fato que ele registra), nunca "cobrar". E o risco abre a
 *  pessoa, porque a resposta para quem está sumindo é um toque humano, não um aviso. */
export function Operacao({ token, time }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T, errorInk } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();
  const [data, setData] = useState<OwnerOperacao | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await ownerOperacao(token));
      setError("");
    } catch {
      setError("Não deu para abrir a operação.");
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function receber(cobrancaId: string) {
    if (busy) return;
    setBusy(cobrancaId);
    try {
      await receberCobranca(token, cobrancaId);
      await load();
    } catch {
      setError("Não deu para marcar. A cobrança continua em aberto.");
    } finally {
      setBusy(null);
    }
  }

  async function pagar(bondId: string) {
    if (busy) return;
    setBusy(bondId);
    try {
      await pagarMensalidade(token, bondId);
      await load();
    } catch {
      setError("Não deu para marcar como pago.");
    } finally {
      setBusy(null);
    }
  }

  const abertoCents = (data?.em_aberto ?? []).reduce(
    (sum, it) => sum + it.amount_cents,
    0,
  );

  return (
    <Phone>
      <Head kicker={time.name} kickerMuted title="Operação" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="hair">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
          </Band>
        ) : null}

        {!data && !error ? (
          <Band raised grow rule="none">
            <Txt role="body" tone="muted">
              Abrindo a operação…
            </Txt>
          </Band>
        ) : null}

        {data ? (
          <>
            <BarraDoMes data={data} />

            {data.risco.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">Vai sumir · {data.risco.length}</Txt>
                </View>
                {data.risco.map((r) => (
                  <LinhaDeRisco
                    key={r.person_id}
                    risco={r}
                    token={token}
                    timeName={time.name}
                    onRecebi={() => void pagar(r.bond_id)}
                    ocupado={busy === r.bond_id}
                  />
                ))}
              </>
            ) : (
              <Band raised grow rule="none">
                <Txt role="body" tone="muted">
                  Ninguém em risco hoje. As {data.student_count} estão dentro da
                  linha delas.
                </Txt>
              </Band>
            )}

            {data.em_aberto.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">Em aberto · {data.em_aberto.length}</Txt>
                </View>
                {data.em_aberto.map((it) => (
                  <LinhaEmAberto
                    key={it.bond_id}
                    item={it}
                    busy={busy === it.bond_id}
                    onRecebi={() => void pagar(it.bond_id)}
                  />
                ))}
              </>
            ) : (
              <Band raised grow rule="none">
                <Txt role="body" tone="muted">
                  Mês em dia: as {data.com_mensalidade} mensalidades estão
                  pagas.
                </Txt>
              </Band>
            )}

            {/* O QUE ELE VENDEU FORA DA MENSALIDADE e ainda não recebeu. A descrição está
                NA LINHA porque ela é a única coisa que distingue uma cobrança da outra —
                "Marina · Avaliação física · R$ 150" se lê inteiro sem abrir nada. */}
            {data.a_entregar.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">A entregar · {data.a_entregar.length}</Txt>
                </View>
                {data.a_entregar.map((c) => (
                  <LinhaAvulsa
                    key={c.id}
                    cobranca={c}
                    busy={busy === c.id}
                    onRecebi={() => void receber(c.id)}
                  />
                ))}
              </>
            ) : null}

            {/* A PORTA, e não mais o aviso. Esta faixa escrevia o número e mandava o
                personal "digitar na pessoa" — uma tela que não existia em lugar nenhum do
                app, enquanto a rota que grava o valor estava roteada e sem chamador. O
                número agora carrega os nomes que o compõem e abre a tela que os edita. */}
            {data.sem_combinado.length > 0 ? (
              <Pressable
                onPress={() =>
                  navigation.navigate("Combinado", {
                    token,
                    timeName: time.name,
                    pessoas: data.sem_combinado.map((p) => ({
                      bond_id: p.bond_id,
                      name: p.name,
                    })),
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Combinar o valor de ${data.sem_combinado.length} ${
                  data.sem_combinado.length === 1 ? "aluno" : "alunos"
                }`}
              >
                <Band rule="none">
                  <View style={styles.portaRow}>
                    <View style={styles.rowCopy}>
                      <Txt role="body">
                        {data.sem_combinado.length === 1
                          ? "1 sem valor combinado"
                          : `${data.sem_combinado.length} sem valor combinado`}
                      </Txt>
                      <Txt role="note" tone="dim" style={styles.rowNote}>
                        {nomesCurtos(data.sem_combinado.map((p) => p.name))}
                      </Txt>
                    </View>
                    <IconChevron color={T.muted2} size={16} />
                  </View>
                </Band>
              </Pressable>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

/** A LINHA DO DINHEIRO EM ABERTO: nome, quando venceu, quanto — e as duas coisas que o
 *  personal faz com isso.
 *
 *  [Pix] copia o código com o VALOR daquela pessoa já dentro. Hoje ele abre o WhatsApp,
 *  digita a chave na mão e escreve o número; metade das vezes a aluna lê errado e paga
 *  R$ 300 no lugar de R$ 350, e sobra uma diferença que ninguém concilia. O código sai
 *  pronto e o banco dela abre com o valor certo.
 *
 *  [Recebi] é o fato que ELE registra. O app nunca cobra o aluno — a frase de cobrança é
 *  dele, e um robô cobrando estraga exatamente a relação que este produto vende. */
function LinhaEmAberto({
  item,
  busy,
  onRecebi,
}: {
  item: OwnerOperacao["em_aberto"][number];
  busy: boolean;
  onRecebi: () => void;
}) {
  const styles = usarEstilos();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await Clipboard.setStringAsync(item.copia_e_cola);
    setCopiado(true);
    // Volta sozinho: a confirmação é do gesto, não um estado da linha. Sem isto, uma tela
    // com oito linhas copiadas vira oito avisos permanentes de nada.
    setTimeout(() => setCopiado(false), 2400);
  }

  return (
    <View style={styles.row}>
      {/* O VALOR desceu para a linha de baixo. Com [Pix] e [Recebi] lado a lado, os dois
          botões e uma coluna de dinheiro comiam ~200pt de uma linha de 393 e o nome
          truncava em "Marina Okam…" — e o nome é a única coisa desta linha que não pode
          ser adivinhada. Lida junto, "venceu há 9 dias · R$ 350" é uma frase só. */}
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {item.name}
        </Txt>
        <Txt role="note" tone="dim" style={styles.rowNote}>
          {copiado
            ? "Copiado. Manda pra ela."
            : `${vencimento(item.due_day, item.vencido_ha)} · R$ ${reais(item.amount_cents)}`}
        </Txt>
      </View>
      {item.copia_e_cola ? (
        <AcaoDaLinha
          rotulo="Pix"
          onPress={() => void copiar()}
          acessivel={`Copiar o Pix de ${item.name}, R$ ${reais(item.amount_cents)}`}
        />
      ) : null}
      <AcaoDaLinha
        rotulo="Recebi"
        busy={busy}
        onPress={onRecebi}
        acessivel={`Marcar a mensalidade de ${item.name} como recebida`}
      />
    </View>
  );
}

/** A LINHA DO QUE ELE VENDEU À PARTE. Mesma anatomia da mensalidade — e de propósito: uma
 *  avaliação de R$ 150 e uma mensalidade de R$ 350 são a mesma coisa para o dedo dele
 *  (copiar o Pix, marcar recebido), então duas gramáticas diferentes seriam dois sistemas
 *  visuais na mesma tela sem que a troca significasse nada. */
function LinhaAvulsa({
  cobranca,
  busy,
  onRecebi,
}: {
  cobranca: Cobranca;
  busy: boolean;
  onRecebi: () => void;
}) {
  const styles = usarEstilos();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await Clipboard.setStringAsync(cobranca.copia_e_cola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2400);
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {cobranca.name}
        </Txt>
        <Txt role="note" tone="dim" style={styles.rowNote} numberOfLines={1}>
          {copiado
            ? "Copiado. Manda pra ela."
            : `${cobranca.descricao} · R$ ${reais(cobranca.valor_cents)}`}
        </Txt>
      </View>
      {cobranca.copia_e_cola ? (
        <AcaoDaLinha
          rotulo="Pix"
          onPress={() => void copiar()}
          acessivel={`Copiar o Pix de ${cobranca.name}, ${cobranca.descricao}`}
        />
      ) : null}
      <AcaoDaLinha
        rotulo="Recebi"
        busy={busy}
        onPress={onRecebi}
        acessivel={`Marcar ${cobranca.descricao} de ${cobranca.name} como recebido`}
      />
    </View>
  );
}

/** A LINHA DE QUEM VAI SUMIR: nome, o MOTIVO, e a AÇÃO — nunca mais um chevron que só
 *  navega e devolve o trabalho para o personal descobrir sozinho.
 *
 *  A linha antiga dizia "9 dias sem treinar" e abria a pessoa. Duas coisas erradas nisso.
 *  A primeira: "9 dias" é o mesmo fato para quem treinava 4× por semana (perdeu) e para
 *  quem treina 1× (não perdeu nada) — o número absoluto não carrega o julgamento, e por
 *  isso a fila enchia de gente que estava bem. A segunda: navegar não é agir. A doutrina
 *  da casa condena exatamente isto na referência de mercado — "a ação sugerida NA PRÓPRIA
 *  LINHA em vez de um link para gráficos".
 *
 *  A ação vem do SINAL, e não é a mesma para todo mundo: quem deve dinheiro recebe
 *  [Recebi]; quem caiu de ritmo recebe [Mandar], que abre o WhatsApp com um rascunho que o
 *  personal edita e envia — o app nunca manda nada em nome dele; quem está sem ficha há
 *  três semanas recebe [Publicar], porque ali o problema é ELE, não ela. */
function LinhaDeRisco({
  risco,
  token,
  timeName,
  onRecebi,
  ocupado,
}: {
  risco: OwnerOperacao["risco"][number];
  token: string;
  timeName: string;
  onRecebi: () => void;
  ocupado: boolean;
}) {
  const styles = usarEstilos();
  const { T } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();

  const abrirPessoa = () =>
    navigation.navigate("Aluna", {
      token,
      personId: risco.person_id,
      timeName,
    });

  function agir() {
    switch (risco.acao) {
      case "recebi":
        onRecebi();
        return;
      case "mandar":
        // O rascunho é uma SAUDAÇÃO, nunca uma cobrança: a frase de dinheiro é dele, e um
        // robô cobrando estraga exatamente a relação que este produto vende.
        void abrirWhatsApp(
          risco.phone,
          `Oi, ${primeiroNome(risco.name)}! Tudo certo por aí?`,
        );
        return;
      case "publicar":
        navigation.navigate("Base", {
          token,
          timeName,
          personId: risco.person_id,
          personName: risco.name,
        });
        return;
      default:
        abrirPessoa();
    }
  }

  const rotulo = ROTULO_DA_ACAO[risco.acao];

  return (
    <Pressable
      onPress={abrirPessoa}
      accessibilityRole="button"
      accessibilityLabel={`${risco.name}. ${risco.motivo}`}
      accessibilityHint="Abre a pessoa"
      style={styles.row}
    >
      <Initials name={risco.name} size={34} />
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {risco.name}
        </Txt>
        <Txt role="note" tone="dim" style={styles.rowNote}>
          {risco.motivo}
        </Txt>
      </View>
      {rotulo ? (
        <AcaoDaLinha
          rotulo={rotulo}
          busy={ocupado}
          onPress={agir}
          acessivel={`${rotulo}, ${risco.name}`}
        />
      ) : (
        <IconChevron color={T.muted2} size={16} />
      )}
    </Pressable>
  );
}

const ROTULO_DA_ACAO: Record<string, string> = {
  recebi: "Recebi",
  mandar: "Mandar",
  publicar: "Publicar",
  abrir: "",
  pix: "Pix",
};

/** A DOBRA DA OPERAÇÃO: um número com âncora, e a barra que diz onde o mês está.
 *
 *  Aqui morreram quatro cartões empilhados — ALUNOS, EM ABERTO, RECEITA DO MÊS, TICKET
 *  MÉDIO —, e eles morreram por dois motivos independentes.
 *
 *  O primeiro é geometria. `FORMA.numero.colunas` recusa a segunda coluna quando o maior
 *  valor passa de 5 caracteres: "9.999" pede 150,6pt e cabe nos 160,5 que sobram numa tela
 *  de 393; "10.500" pede 175,2 e não cabe. A fila caía para uma coluna no instante em que
 *  o estúdio cruzava R$ 10.000/mês, e os quatro cartões passavam a comer 450 dos 618pt
 *  úteis. O personal que crescia perdia a dobra inteira — e o "quem" começava abaixo do
 *  fim da tela.
 *
 *  O segundo é honestidade. "RECEITA DO MÊS" era `SUM(mensalidades.amount_cents)`: o preço
 *  de tabela vezes a turma de hoje. Ele não mexia um centavo quando ninguém pagava, e
 *  ficava colado num "EM ABERTO · somam R$ 1.050" que dizia o contrário. Dois números da
 *  mesma tela, sentidos opostos, e o maior deles mentindo sobre o faturamento do mês.
 *
 *  No lugar: o que ENTROU, ancorado no que foi COMBINADO, e uma barra em que o combinado é
 *  a largura inteira. Três segmentos, e cada valor sai também POR ESCRITO — barra sem
 *  número é decoração, e a legenda é o que sobrevive a um daltônico e a um leitor de tela.
 *  Zero biblioteca: são três Views com flex. */
function BarraDoMes({ data }: { data: OwnerOperacao }) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const mes = mesPorExtenso(data.month);

  // O personal PAROU DE MARCAR, e isso é indistinguível de "ninguém pagou" — porque em
  // aberto é ausência de linha. Afirmar o primeiro quando é o segundo é o app chamando a
  // turma inteira de caloteira. Depois do dia 10, sem nenhuma marcação no mês, a barra não
  // desenha e o herói não imprime R$ 0: uma baseline falsa é pior que nenhuma.
  const diaDeHoje = new Date().getDate();
  const ninguemMarcado = data.recebido_cents === 0 && data.com_mensalidade > 0;
  if (ninguemMarcado && diaDeHoje > 10) {
    return (
      <Band raised rule="hair">
        <Txt role="body">Nada marcado em {mes} ainda.</Txt>
        <Txt role="note" tone="dim" style={styles.notaDoMes}>
          Se você já recebeu, marque — senão a conta de {mes} fica errada.
          {data.ultima_marcacao
            ? ` Última marcação: ${dataCurta(data.ultima_marcacao)}.`
            : ""}
        </Txt>
      </Band>
    );
  }

  const total = data.recebido_cents + data.a_vencer_cents + data.vencido_cents;
  // Sem combinado nenhum não há barra a desenhar: o denominador é zero e qualquer
  // proporção seria inventada.
  const temBarra = total > 0;

  return (
    <Band raised rule="hair">
      <Figure
        role="hero"
        value={reais(data.recebido_cents)}
        unit="R$"
        unitFirst
        label={`Recebido em ${mes}`}
        note={temBarra ? `de R$ ${reais(total)} combinado` : undefined}
      />
      {temBarra ? (
        <>
          <View style={styles.barra} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {/* Segmento não-zero nunca some: 3pt de largura mínima. Sem o piso, R$ 50 num
                mês de R$ 10.500 vira meio pixel e o personal lê zero onde há dívida. */}
            <Segmento cents={data.recebido_cents} total={total} cor={T.ink} />
            <Segmento cents={data.a_vencer_cents} total={total} cor={T.muted2} />
            <Segmento cents={data.vencido_cents} total={total} cor={errorInk} />
          </View>
          <View style={styles.legenda}>
            <Verbete cor={T.ink} texto={`recebido ${reais(data.recebido_cents)}`} />
            {data.a_vencer_cents > 0 ? (
              <Verbete cor={T.muted2} texto={`a vencer ${reais(data.a_vencer_cents)}`} />
            ) : null}
            {data.vencido_cents > 0 ? (
              <Verbete cor={errorInk} texto={`vencido ${reais(data.vencido_cents)}`} />
            ) : null}
          </View>
        </>
      ) : null}
    </Band>
  );
}

function Segmento({ cents, total, cor }: { cents: number; total: number; cor: string }) {
  const styles = usarEstilos();
  if (cents <= 0) return null;
  return (
    <View
      style={[styles.segmento, { backgroundColor: cor, flexGrow: cents / total }]}
    />
  );
}

/** A legenda ESCRITA, e ela não é acessório: quem separa os três segmentos é cor, e cor
 *  sozinha não sobrevive a um daltônico nem a um leitor de tela. O valor por extenso é a
 *  informação; a barra é a forma dela. */
function Verbete({ cor, texto }: { cor: string; texto: string }) {
  const styles = usarEstilos();
  return (
    <View style={styles.verbete}>
      <View style={[styles.ponto, { backgroundColor: cor }]} />
      <Txt role="note" tone="dim">
        {texto}
      </Txt>
    </View>
  );
}

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-08-01" -> "agosto". Fatiado da string, e não `new Date(iso)`: o construtor lê
 *  data sem hora como UTC e devolve o mês anterior em qualquer fuso a oeste de Greenwich —
 *  que é o Brasil inteiro. */
function mesPorExtenso(iso: string): string {
  const m = Number(iso.slice(5, 7));
  return MESES[m - 1] ?? "";
}

/** "2026-07-12" -> "12 de julho". Mesma fatia, mesmo motivo. */
function dataCurta(iso: string): string {
  return `${Number(iso.slice(8, 10))} de ${mesPorExtenso(iso)}`;
}

/** A AÇÃO DA LINHA, compacta: o fato que o personal registra com um toque. Borda como o
 *  GhostCTA
 *  (o tom do aperto vive nela), mas do tamanho de uma linha de lista — o GhostCTA cheio
 *  transformaria oito linhas em oito banners. */
function AcaoDaLinha({
  onPress,
  busy,
  disabled,
  rotulo,
  acessivel,
}: {
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  rotulo: string;
  acessivel: string;
}) {
  const styles = usarEstilos();
  const { T, MOTION } = useTema();
  const [down, setDown] = useState(false);
  const tone = useEdgeTone(down && !disabled, T.divider, T.ink, MOTION.press);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityLabel={acessivel}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      hitSlop={8}
    >
      <Animated.View style={[styles.pago, tone, (disabled || busy) && styles.off]}>
        <Txt role="label">{busy ? "…" : rotulo}</Txt>
      </Animated.View>
    </Pressable>
  );
}

/** Centavos em prosa de dinheiro. Inteiro limpo ("350"), quebrado com vírgula ("350,50"). */
function reais(cents: number): string {
  const inteiro = Math.trunc(cents / 100);
  const resto = Math.abs(cents % 100);
  return resto
    ? `${formatNum(inteiro)},${String(resto).padStart(2, "0")}`
    : formatNum(inteiro);
}

function primeiroNome(n: string): string {
  return n.trim().split(/\s+/)[0];
}

/** Os primeiros nomes, e quantos sobraram. Um número sozinho não abre porta nenhuma — a
 *  tela tem que dizer QUEM antes de o dedo decidir se vale o toque. */
function nomesCurtos(nomes: string[]): string {
  if (nomes.length <= 3) return nomes.map(primeiroNome).join(", ");
  return `${nomes.slice(0, 3).map(primeiroNome).join(", ")} e mais ${nomes.length - 3}`;
}

function vencimento(dueDay: number, vencidoHa: number): string {
  if (vencidoHa > 0)
    return `venceu há ${vencidoHa} ${vencidoHa === 1 ? "dia" : "dias"}`;
  if (vencidoHa === 0) return "vence hoje";
  return `vence dia ${dueDay}`;
}

const usarEstilos = estilos(({ T, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    secHead: {
      paddingHorizontal: T.pad,
      paddingTop: 18,
      paddingBottom: 8,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: T.pad,
      paddingVertical: 12,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    rowCopy: { flex: 1, minWidth: 0 },
    portaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    notaDoMes: { marginTop: 4 },
    barra: {
      flexDirection: "row",
      height: 10,
      marginTop: 16,
      borderRadius: FORMA.raio ? 5 : 0,
      overflow: "hidden",
      gap: 2,
    },
    // O piso de 3pt: um segmento que existe nunca desenha meio pixel.
    segmento: { minWidth: 3, height: "100%" },
    legenda: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10 },
    verbete: { flexDirection: "row", alignItems: "center", gap: 6 },
    ponto: { width: 8, height: 8, borderRadius: 4 },
    rowNote: { marginTop: 2 },
    money: { fontVariant: ["tabular-nums"] },
    pago: {
      borderWidth: FORMA.borda,
      borderRadius: FORMA.raioAcao,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    off: { opacity: 0.35 },
  }),
);
