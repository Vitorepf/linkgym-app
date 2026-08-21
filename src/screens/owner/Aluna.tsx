import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import {
  cancelarAssinatura,
  applyOwnerAttention,
  criarExtra,
  mudarEstadoDoVinculo,
  ownerAttention,
  ownerStudent,
  type Extra,
  type OwnerAttention,
  type OwnerStudent,
} from "../../api";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { formatKg } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
// A MESMA leitura de dinheiro do Combinado. Eram duas cópias com o mesmo defeito — "1.500"
// recusado nas duas —, e duas cópias de uma regra divergem sempre.
import { centavosDe } from "./Combinado";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = NativeStackScreenProps<RootStackParamList, "Aluna">;

/** A pessoa e a UMA coisa que vai acontecer com ela.
 *
 *  Contra a operação da referência: a ficha de aluno de lá abre com quatro blocos de
 *  avaliação (física, postural, neuromotores, anamnese) antes de qualquer coisa sobre a
 *  prescrição — a pessoa modelada como prontuário. Aqui o corpo da tela é o trabalho: a ficha
 *  que está publicada agora, com a carga de cada exercício, e nada atrás de um toque.
 *
 *  Contra o ofício do eixo 1: o número carrega o que ele estava carecendo. `12` vem com
 *  rótulo mudo, com a prosa do combinado que ele está contando (a âncora, e ela é do
 *  domínio — não é uma régua inventada) e com o esforço da última sessão marcado por
 *  FORMA na escala, nunca por matiz.
 *
 *  Cada ação DIZ o que vai acontecer. A decisão da fila se aplica aqui mesmo — o botão
 *  faz, não navega — e publicar continua ao lado dela: enquanto a decisão era o único
 *  CTA, a pessoa sinalizada hoje era justamente a que não tinha porta para prescrever.
 *  Duas ações, um orçamento: a decisão é `quiet` e o acento em ÁREA fica com publicar,
 *  que é o trabalho. Nada de "Manter": verbo genérico num retângulo cheio de acento era o
 *  maior elemento da tela fazendo nada. */
export function Aluna({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const { token, personId } = route.params;
  const [card, setCard] = useState<OwnerStudent | null>(null);
  const [flag, setFlag] = useState<OwnerAttention | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);

  const load = useCallback(async () => {
    try {
      const [student, queue] = await Promise.all([
        ownerStudent(token, personId),
        // A fila é a única fonte da CAUSA (/v1/owner/students não devolve motivo) e a
        // única ação que se resolve sem sair da tela. Se ela cair, a ficha abre igual.
        ownerAttention(token).catch(() => ({ items: [] as OwnerAttention[] })),
      ]);
      setCard(student);
      setFlag(queue.items.find((it) => it.person_id === personId) ?? null);
      setError("");
    } catch {
      setError("Não deu para abrir a ficha.");
    }
  }, [token, personId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function goBase() {
    if (!card) return;
    navigation.navigate("Base", {
      token,
      timeName: route.params.timeName,
      personId: card.person_id,
      personName: card.name,
    });
  }

  async function applyFlag(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      await applyOwnerAttention(token, id);
      setFlag(null);
      setApplied(true);
      setError("");
    } catch {
      setError("Não deu para aplicar.");
    } finally {
      setBusy(false);
    }
  }

  const loads = card?.last_loads ?? [];
  const first = loads.length === 0;

  // A decisão da fila, quando existe. Some ao ser aplicada.
  const decision = flag
    ? {
        label: flag.decision,
        why: reasonLine(flag),
        // O que o toque FAZ, sem inflar: aplicar resolve o item de hoje e, quando a causa
        // é o sumiço, abre a retomada do vínculo. Nada além disso acontece no servidor.
        effect:
          flag.reason === "student_stopped"
            ? "Aplicar abre a retomada e tira ela da fila de hoje."
            : "Aplicar tira ela da fila de hoje.",
        run: () => void applyFlag(flag.id),
      }
    : null;

  // Prescrever está SEMPRE aqui: é a razão de o personal abrir a ficha de alguém.
  const publish = card
    ? {
        label: first ? "Publicar a primeira ficha" : "Publicar a próxima ficha",
        why: applied ? "Resolvido agora." : whyPublish(card, first),
        effect: "Abre de onde partir: a última carga deste corpo ou o modelo.",
      }
    : null;

  const said = decision ?? publish;

  return (
    <Phone>
      <Head
        title={card?.name}
        right={
          card ? (
            // Sem `fill`: o acento em ÁREA desta tela é o botão da ação, e ele é um só.
            <Initials name={card.name} size={46} />
          ) : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Band rule="none">
            <Txt role="body" color={errorInk}>
              {error}
            </Txt>
            <View style={styles.retry}>
              <GhostCTA
                label="Tentar de novo"
                onPress={() => void load()}
                fundo={T.bg}
              />
            </View>
          </Band>
        ) : null}

        {!card && !error ? (
          <Band rule="none">
            <Txt role="body" tone="muted">
              Abrindo a ficha…
            </Txt>
          </Band>
        ) : null}

        {card ? (
          <>
            {/* O trabalho primeiro: o que está publicado, com a carga de cada corpo.
                Contagem no rótulo — o "3" que era uma célula de métrica sem baseline
                (trivia) virou contexto do título, onde ele significa alguma coisa. */}
            <Band rule="hair" pad={false}>
              <View style={styles.sectionHead}>
                <Txt role="label">
                  {loads.length > 0
                    ? `Ficha atual · ${loads.length} exercícios`
                    : "Ficha atual"}
                </Txt>
              </View>

              {loads.length === 0 ? (
                <View style={styles.sectionHead}>
                  <Txt role="body" tone="muted">
                    Nenhuma ficha publicada ainda.
                  </Txt>
                </View>
              ) : null}

              {loads.map((row) => (
                <View key={row.exercise_name} style={styles.loadRow}>
                  <Txt role="body" style={styles.loadName} numberOfLines={1}>
                    {row.exercise_name}
                  </Txt>
                  <Txt role="body" style={styles.loadKg}>
                    {formatKg(row.load_kg)}
                  </Txt>
                  <Txt role="label" tone="muted" style={styles.unit} numberOfLines={1}>
                    kg
                  </Txt>
                </View>
              ))}
            </Band>

            {/* Ofensiva não é contagem solta: a nota diz o combinado que ela está
                contando. Esforço é posição numa escala de 3 e a direção sai da FORMA da
                marca, nunca de matiz — o único matiz da tela é o do personal. */}
            <MetricGrid
              columns={2}
              cells={[
                {
                  label: "Ofensiva",
                  value: card.ofensiva.current_count,
                  note: card.commitment_text ?? undefined,
                },
                {
                  label: "Esforço",
                  value: card.last_effort ?? "—",
                  unit: card.last_effort ? "de 3" : undefined,
                  dir: effortDir(card.last_effort),
                  note: card.last_effort
                    ? `${effortWord(card.last_effort)} na última`
                    : "Sem sessão ainda",
                },
              ]}
            />

            {card.onboarding ? (
              <Band rule="hair">
                <Txt role="label">Na entrada</Txt>
                <Txt role="body" style={styles.effect}>
                  {onboardingLine(card.onboarding)}
                </Txt>
              </Band>
            ) : null}

            <Dinheiro
              token={token}
              card={card}
              timeName={route.params.timeName}
              navigation={navigation}
            />

            {/* A causa vive NA tela, colada na ação. Sem isto o botão é uma ordem sem
                motivo, e o motivo estava atrás de um toque (ou não existia). */}
            {said ? (
              <View style={styles.why}>
                <Band rule="none">
                  <Txt role="body">{said.why}</Txt>
                  <Txt role="body" tone="muted" style={styles.effect}>
                    {said.effect}
                  </Txt>
                </Band>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      {publish ? (
        <DockFooter>
          {decision ? (
            <View style={styles.second}>
              <AccentCTA
                label={decision.label}
                onPress={decision.run}
                busy={busy}
                check
                quiet
              />
            </View>
          ) : null}
          <AccentCTA label={publish.label} onPress={goBase} />
        </DockFooter>
      ) : null}
    </Phone>
  );
}

/** O `reason` chega cru do banco (`student_stopped`) e a fila de hoje o desenha como
 *  prosa. Traduzir aqui é o que impede um identificador de tabela de virar texto de tela;
 *  o que não estiver no mapa já é frase e passa direto.
 *  `days` conta dias desde o último cumprimento, então ele só é a causa quando a causa É
 *  o sumiço — em "marcou dor" o mesmo número seria uma data errada com cara de precisão. */
const REASON: Record<string, string> = {
  student_stopped: "Parou de treinar",
  pain_flag: "Marcou dor na última sessão",
  debut: "Entrou e ainda não treinou",
  high_effort: "Esforço alto na última sessão",
};

function reasonLine(f: OwnerAttention): string {
  const base = REASON[f.reason] ?? f.reason;
  return f.reason === "student_stopped" && f.days
    ? `${base} há ${f.days} dias.`
    : `${base}.`;
}

function onboardingLine(
  ob: NonNullable<OwnerStudent["onboarding"]>,
): string {
  const exp =
    ob.experience === "never"
      ? "Nunca treinou"
      : ob.experience === "before"
        ? "Já treinou antes"
        : "Treina hoje";
  const days = `${ob.days_per_week} ${ob.days_per_week === 1 ? "dia" : "dias"} por semana`;
  const dor = ob.pain ? "Marcou dor na entrada" : "Sem dor na entrada";
  const corpo =
    ob.height_cm && ob.weight_kg
      ? ` · ${ob.height_cm} cm, ${ob.weight_kg} kg`
      : "";
  return `${exp}. ${days}. ${dor}${corpo}.`;
}

function whyPublish(card: OwnerStudent, first: boolean): string {
  if (first) return "Sem ficha publicada, a estreia é o primeiro toque.";
  if (card.suggested === "nudge") return "Sumiu do fio. A próxima ficha é o caminho de volta.";
  const n = card.ofensiva.current_count;
  const effort = effortWord(card.last_effort);
  if (n <= 0) return "A ofensiva está zerada. O combinado precisa de uma ficha nova.";
  const tail = effort ? `, esforço ${effort.toLowerCase()} na última` : "";
  return `${n} cumprimentos seguidos do combinado${tail}.`;
}

// Posição na escala de 3, não julgamento: fácil fica abaixo do ponto, difícil acima.
function effortDir(n: number | null): "up" | "down" | "flat" | undefined {
  if (n === 1) return "down";
  if (n === 3) return "up";
  if (n === 2) return "flat";
  return undefined;
}

function effortWord(n: number | null): string {
  if (n === 1) return "Fácil";
  if (n === 3) return "Difícil";
  if (n === 2) return "No ponto";
  return "";
}

/** O DINHEIRO DESTA PESSOA, na tela dela.
 *
 *  A ficha do aluno tinha 332 linhas e nenhuma palavra sobre dinheiro — enquanto a tela de
 *  Operação escrevia "o combinado se digita uma vez, NA PESSOA" e apontava para cá. Este
 *  bloco é a porta que aquela frase prometia.
 *
 *  Três coisas, na ordem em que o personal precisa delas: o combinado (ou a porta para
 *  criá-lo), o que ele vende à parte, e a saída. A saída fica por último e é a única peça
 *  em tom de perigo do produto inteiro — encerrar não é um gesto de rotina, mas precisa
 *  existir: sem ela, quem sai do estúdio conta e fatura para sempre. */
function Dinheiro({
  token,
  card,
  timeName,
  navigation,
}: {
  token: string;
  card: OwnerStudent;
  timeName: string;
  navigation: Props["navigation"];
}) {
  const styles = usarEstilos();
  const { FORMA, errorInk } = useTema();
  const [aberto, setAberto] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [criando, setCriando] = useState(false);
  const [criada, setCriada] = useState<Extra | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");
  const [encerrado, setEncerrado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [mudando, setMudando] = useState(false);
  const [encerrando, setEncerrando] = useState<string | null>(null);
  // A assinatura encerrada NAO some da tela no toque: o slot vira a frase do que aconteceu,
  // e e ela que diz que o mes recebido continua valendo. Sumir e o app apagando a prova de
  // que ele acabou de mexer no dinheiro de alguem.
  const [encerrada, setEncerrada] = useState<string | null>(null);

  const cents = centavosDe(valor);
  const podeCriar = descricao.trim() !== "" && cents !== null;

  async function criar() {
    if (!podeCriar || criando) return;
    setCriando(true);
    setErro("");
    try {
      setCriada(
        await criarExtra(token, {
          bond_id: card.bond_id,
          descricao: descricao.trim(),
          valor_cents: cents as number,
        }),
      );
      setDescricao("");
      setValor("");
    } catch {
      setErro("Não deu para criar. Nada foi lançado.");
    } finally {
      setCriando(false);
    }
  }

  async function encerrar() {
    if (mudando) return;
    setMudando(true);
    setErro("");
    try {
      await mudarEstadoDoVinculo(token, card.bond_id, "ended");
      setEncerrado(true);
      setConfirmando(false);
    } catch {
      setErro(`Não deu para encerrar. ${primeiroNomeDe(card.name)} continua no time.`);
    } finally {
      setMudando(false);
    }
  }

  async function reativar() {
    if (mudando) return;
    setMudando(true);
    setErro("");
    try {
      await mudarEstadoDoVinculo(token, card.bond_id, "active");
      setEncerrado(false);
    } catch {
      setErro(`Não deu para desfazer. ${primeiroNomeDe(card.name)} continua fora.`);
    } finally {
      setMudando(false);
    }
  }

  /** PARAR DE COBRAR não apaga: grava a última competência cobrada. O que ela pagou continua sendo
   *  fato, e o mês corrente continua devido — encerrar no dia 20 não devolve o mês. */
  async function pararAssinatura(id: string) {
    if (encerrando) return;
    setEncerrando(id);
    setErro("");
    try {
      await cancelarAssinatura(token, id);
      setEncerrada(id);
    } catch {
      setErro("Não deu para encerrar. Continua valendo como estava.");
    } finally {
      setEncerrando(null);
    }
  }

  return (
    <>
      <View style={styles.sectionHead}>
        <Txt role="label">Dinheiro</Txt>
      </View>

      <Band rule="hair">
        {card.combinado ? (
          <>
            <Txt role="body">
              R$ {reaisDaAluna(card.combinado.amount_cents)} por mês, todo dia{" "}
              {card.combinado.due_day}
            </Txt>
            <Txt role="note" tone="dim" style={styles.effect}>
              Dá para corrigir quando o combinado mudar.
            </Txt>
          </>
        ) : (
          <Txt role="body">
            Sem valor combinado. Sem ele, {primeiroNomeDe(card.name)} não entra na conta do
            mês.
          </Txt>
        )}
        <View style={styles.acaoDoDinheiro}>
          <GhostCTA
            label={card.combinado ? "Mudar o combinado" : "Combinar o valor"}
            fundo={FORMA.folha.peca.composto}
            onPress={() =>
              navigation.navigate("Combinado", {
                token,
                timeName,
                pessoas: [
                  {
                    bond_id: card.bond_id,
                    name: card.name,
                    amount_cents: card.combinado?.amount_cents,
                    due_day: card.combinado?.due_day,
                  },
                ],
              })
            }
          />
        </View>
      </Band>

      {/* O QUE ELA ASSINA — e a porta de saída, que não existia em lugar nenhum.
          `cancelarAssinatura` estava escrita, roteada e sem um único chamador: a aluna
          assinava a marmita com um toque no rodapé do Perfil dela e aquilo virava uma dívida
          mensal para sempre. Ela agora desfaz o próprio toque enquanto nada foi recebido; a
          partir do primeiro mês na mão dele, é aqui que acaba.

          Mora na PESSOA e não na fila "Todo mês" da Operação de propósito: aquela lista é o
          trabalho do mês (quem deve o quê), e encerrar não é trabalho do mês — é mudança de
          combinado, e combinado é assunto da pessoa. É a mesma razão pela qual o valor
          combinado mora aqui em cima e não na fila de "Em aberto". */}
      {card.assinaturas.length > 0 ? (
        <Band rule="hair">
          <Txt role="label">Todo mês</Txt>
          {card.assinaturas.map((a) => (
            <View key={a.id} style={styles.acaoDoDinheiro}>
              <Txt role="body">
                {a.nome} · R$ {reaisDaAluna(a.valor_cents)} por mês
              </Txt>
              <Txt role="note" tone="dim" style={styles.effect}>
                {encerrada === a.id
                  ? "Parou. O que já foi recebido continua no seu mês."
                  : `Desde ${mesDeAssinatura(a.desde)}. Parar não apaga o que já entrou.`}
              </Txt>
              {encerrada === a.id ? null : (
                <View style={styles.acaoDoDinheiro}>
                  <GhostCTA
                    label={encerrando === a.id ? "…" : "Parar"}
                    fundo={FORMA.folha.peca.composto}
                    onPress={() => void pararAssinatura(a.id)}
                  />
                </View>
              )}
            </View>
          ))}
        </Band>
      ) : null}

      {/* COBRAR À PARTE: dois campos, e nada mais. Avaliação, whey, marmita, aula avulsa —
          "qualquer tipo de produto" com categoria, foto, estoque, variante e frete são seis
          decisões entre ele e o dinheiro, e nenhuma delas ele sabe tomar às 22h. */}
      <Band rule="hair">
        {criada ? (
          <>
            <Txt role="body">
              {criada.descricao} · R$ {reaisDaAluna(criada.valor_cents)}
            </Txt>
            <Txt role="note" tone="dim" style={styles.effect}>
              {copiado
                ? "Copiado. Cole no WhatsApp."
                : "Entrou em A entregar, na Operação."}
            </Txt>
            <View style={styles.acaoDoDinheiro}>
              {criada.copia_e_cola ? (
                <GhostCTA
                  label="Copiar o Pix"
                  fundo={FORMA.folha.peca.composto}
                  onPress={() => {
                    void Clipboard.setStringAsync(criada.copia_e_cola);
                    setCopiado(true);
                  }}
                />
              ) : (
                <GhostCTA
                  label="Vender outra coisa"
                  fundo={FORMA.folha.peca.composto}
                  onPress={() => {
                    setCriada(null);
                    setCopiado(false);
                  }}
                />
              )}
            </View>
          </>
        ) : aberto ? (
          <>
            <Campo
              label="O que você vendeu"
              rotulo
              placeholder="Avaliação física"
              maxLength={60}
              value={descricao}
              onChangeText={setDescricao}
            />
            <View style={styles.acaoDoDinheiro}>
              <Campo
                label="Valor"
                rotulo
                placeholder="150"
                keyboardType="decimal-pad"
                value={valor}
                onChangeText={setValor}
                style={styles.valorAvulso}
              />
            </View>
            <View style={styles.acaoDoDinheiro}>
              <AccentCTA
                label="Vender"
                busy={criando}
                disabled={!podeCriar}
                onPress={() => void criar()}
                quiet
              />
            </View>
          </>
        ) : (
          <>
            <Txt role="body">Vender à parte</Txt>
            <Txt role="note" tone="dim" style={styles.effect}>
              Avaliação, suplemento, marmita, aula avulsa. Dois campos.
            </Txt>
            <View style={styles.acaoDoDinheiro}>
              <GhostCTA
                label="Vender à parte"
                fundo={FORMA.folha.peca.composto}
                onPress={() => setAberto(true)}
              />
            </View>
          </>
        )}
      </Band>

      {erro ? (
        <Band rule="none">
          <Txt role="body" color={errorInk}>
            {erro}
          </Txt>
        </Band>
      ) : null}

      {/* A SAÍDA. Sem ela, quem foi embora continua contando, faturando e devendo — e o
          erro cresce todo mês. É reversível: encerrar por engano não pode ser porta de mão
          única, e "voltei a treinar com o Fred" é comum. */}
      <Band rule="none">
        {encerrado ? (
          <>
            <Txt role="body">
              {primeiroNomeDe(card.name)} saiu. Sai das contas do mês a partir de agora.
            </Txt>
            <View style={styles.acaoDoDinheiro}>
              <GhostCTA
                label={mudando ? "…" : "Desfazer"}
                fundo={FORMA.folha.peca.composto}
                onPress={() => void reativar()}
              />
            </View>
          </>
        ) : confirmando ? (
          <>
            {/* A ÚNICA confirmação do produto, e ela é aqui porque encerrar mexe em todos
                os números do mês de uma vez — e porque a frase tem que dizer o que vai
                acontecer, não perguntar "tem certeza?". O resto do app não confirma nada:
                confirmação em toda ação é o que faz app parecer formulário. */}
            <Txt role="body">
              {primeiroNomeDe(card.name)} sai das contas do mês e da fila. O histórico dela
              fica.
            </Txt>
            <View style={styles.acaoDoDinheiro}>
              <GhostCTA
                label={mudando ? "…" : "Encerrar"}
                tom="perigo"
                fundo={FORMA.folha.peca.composto}
                onPress={() => void encerrar()}
              />
            </View>
            <View style={styles.acaoDoDinheiro}>
              <GhostCTA
                label="Deixar como está"
                fundo={FORMA.folha.peca.composto}
                onPress={() => setConfirmando(false)}
              />
            </View>
          </>
        ) : (
          <GhostCTA
            label={`${primeiroNomeDe(card.name)} saiu`}
            tom="perigo"
            fundo={FORMA.folha.peca.composto}
            onPress={() => setConfirmando(true)}
          />
        )}
      </Band>
    </>
  );
}

/** Centavos em prosa de dinheiro: inteiro limpo, quebrado com vírgula. */
/** "2026-05-01" -> "maio". Fatiado da string, e nao `new Date(iso)`: o construtor le data
 *  sem hora como UTC e devolve o mes anterior em todo fuso a oeste de Greenwich. */
const MESES_DA_ASSINATURA = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function mesDeAssinatura(iso: string): string {
  return MESES_DA_ASSINATURA[Number(iso.slice(5, 7)) - 1] ?? "";
}

function reaisDaAluna(cents: number): string {
  const resto = cents % 100;
  const inteiro = Math.trunc(cents / 100).toLocaleString("pt-BR");
  return resto ? `${inteiro},${String(resto).padStart(2, "0")}` : inteiro;
}

function primeiroNomeDe(n: string): string {
  return n.trim().split(/\s+/)[0];
}

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    // O par causa+ação desce para o pé da rolagem em vez de deixar o terço de baixo morto.
    // Uma folga só, entre o bloco de fatos e a decisão — não duas, que leem como buraco.
    // Com ficha longa a margem automática vira zero e a rolagem manda.
    why: { marginTop: "auto" },
    sectionHead: {
      paddingHorizontal: T.pad,
      paddingTop: 18,
      paddingBottom: SPACE.tight,
    },
    loadRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: SPACE.hair,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.block,
      borderTopWidth: 1,
      borderTopColor: T.hairline,
    },
    loadName: { flex: 1, minWidth: 0 },
    // Coluna de número com largura fixa: as cargas alinham à direita entre si e a unidade
    // fica num degrau tipográfico próprio, do lado de fora do número.
    loadKg: { fontVariant: ["tabular-nums"], minWidth: 76, textAlign: "right" },
    unit: { minWidth: 26 },
    effect: { marginTop: SPACE.hair },
    // A decisão fica ACIMA do acento: mesma massa, tinta neutra, e o dedo cai primeiro no
    // trabalho. Sem folga entre os dois — são um par, não duas listas.
    second: { marginBottom: 2 },
    acaoDoDinheiro: { marginTop: 12, alignSelf: "flex-start" },
    valorAvulso: { width: 120 },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
  }),
);
