import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ApiError,
  desfazerPagamento,
  patchTime,
  registrarToque,
  ownerOperacao,
  pagarMensalidade,
  receberAssinatura,
  receberExtra,
  type Assinatura as AssinaturaAberta,
  type Extra,
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
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { ALVO, AVANCO_DO_DIGITO, TYPE } from "../../theme";
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
  // O aviso é do ATO e do load, e de mais nada. Ele nunca era limpo no caminho feliz: uma
  // falha na Ana + um retry que dá certo deixava "Não deu para marcar. A de Ana continua em
  // aberto." no topo até o próximo focus — a frase sobrevivendo à própria verdade. Toda
  // escrita nova apaga a frase da tentativa anterior.
  const [error, setError] = useState("");
  // QUEM ESTA EM VOO, e não "há algo em voo".
  //
  // Era `busy: string | null`: uma escrita por vez, e enquanto ela ia e voltava TODA a
  // outra linha ficava desligada. Marcar cinco recebidos numa manhã custava cinco idas à
  // rede em fila indiana, com a tela morta entre elas — e são cinco fatos independentes,
  // sobre cinco pessoas diferentes, com escrita idempotente do outro lado. Nada ali pedia
  // ordem; o que pedia ordem era a variável.
  //
  // O ref é a verdade e o Set é o espelho de render: o guarda `has(id)` lido do estado é a
  // fotografia do render anterior, e dois toques no mesmo botão dentro do mesmo quadro
  // passariam os dois. Em `pagar` isso seria inócuo (o servidor tem ON CONFLICT DO
  // NOTHING), mas `receberDoMes` quita a competência ABERTA MAIS ANTIGA: dois toques
  // quitariam DOIS meses. O guarda tem que ser síncrono.
  const emVooRef = useRef<Set<string>>(new Set());
  const [emVoo, setEmVoo] = useState<ReadonlySet<string>>(new Set());
  // A FALHA MORA NA LINHA QUE A CAUSOU. O aviso nascia no topo da rolagem, a ~500pt do dedo
  // que apertou: ele tocava [Recebi] na Marina, nada visível acontecia, e a frase que
  // explicava o porquê estava fora da tela. Aqui a nota da própria linha vira o aviso.
  const [falhas, setFalhas] = useState<Record<string, string>>({});
  // O que ele marcou NESTA abertura da tela. A linha vira recibo em vez de sumir, e o
  // recibo é o alvo do desfazer. `load()` zera: recibo é do gesto, não é estado do mês.
  const [recibos, setRecibos] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setData(await ownerOperacao(token));
      setRecibos({});
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

  /** UMA ESCRITA DE LINHA, e as cinco passam por aqui.
   *
   *  Eram cinco cópias do mesmo try/catch/finally, e as cinco erravam a mesma coisa duas
   *  vezes: travavam a tela inteira e mandavam o aviso para o topo. Um lugar só é o que faz
   *  a próxima escrita nascer certa. */
  async function escrever(id: string, aviso: string, fazer: () => Promise<void>) {
    if (emVooRef.current.has(id)) return;
    emVooRef.current.add(id);
    setEmVoo(new Set(emVooRef.current));
    // O aviso da tentativa anterior morre no começo da próxima: uma falha na Ana seguida de
    // um retry que dá certo deixava a frase sobrevivendo à própria verdade.
    setFalhas((f) => {
      if (!(id in f)) return f;
      const proximo = { ...f };
      delete proximo[id];
      return proximo;
    });
    setError("");
    try {
      await fazer();
    } catch {
      setFalhas((f) => ({ ...f, [id]: aviso }));
    } finally {
      emVooRef.current.delete(id);
      setEmVoo(new Set(emVooRef.current));
    }
  }

  function receber(extraId: string, nome: string) {
    return escrever(extraId, `Não deu para marcar. O de ${primeiroNome(nome)} continua em aberto.`, async () => {
      await receberExtra(token, extraId);
      setRecibos((r) => ({ ...r, [extraId]: agora() }));
    });
  }

  /** MARCAR RECEBIDO, e a linha NÃO some.
   *
   *  Era `await load()`: a linha evaporava no toque e o único registro do que ele acabou de
   *  escrever ia embora junto. Um dedo errado entre dois nomes vizinhos congelava o valor de
   *  quem não pagou, entrava no recebido do mês e, na virada, ia para a lista de quem pagou
   *  na fita — sem nenhum caminho de volta pela interface.
   *
   *  Agora o slot do botão vira o RECIBO, e o recibo é o alvo do desfazer. Sem diálogo de
   *  confirmação: confirmação em toda ação é o que faz app parecer formulário, e aqui o
   *  desfazer É a confirmação. Some sozinho na próxima abertura da tela — recibo é do gesto,
   *  não é estado do mês. */
  function pagar(bondId: string, nome: string) {
    return escrever(bondId, `Não deu para marcar. A de ${primeiroNome(nome)} continua em aberto.`, async () => {
      await pagarMensalidade(token, bondId);
      setRecibos((r) => ({ ...r, [bondId]: agora() }));
    });
  }

  function desfazer(bondId: string, nome: string) {
    return escrever(bondId, `Não deu para desfazer. A de ${primeiroNome(nome)} continua recebida.`, async () => {
      await desfazerPagamento(token, bondId);
      setRecibos((r) => {
        const proximo = { ...r };
        delete proximo[bondId];
        return proximo;
      });
    });
  }

  function receberDoMes(assinaturaID: string, nome: string) {
    return escrever(assinaturaID, `Não deu para marcar. A de ${primeiroNome(nome)} continua em aberto.`, async () => {
      await receberAssinatura(token, assinaturaID);
      // A assinatura tem N competências: quitar uma não fecha a linha. Em vez do recibo,
      // recarrega — o número de meses tem que encolher na frente dele, senão o toque não
      // parece ter feito nada.
      await load();
    });
  }

  function desfazerExtra(extraId: string, nome: string) {
    return escrever(extraId, `Não deu para desfazer. O de ${primeiroNome(nome)} continua recebido.`, async () => {
      await receberExtra(token, extraId, true);
      setRecibos((r) => {
        const proximo = { ...r };
        delete proximo[extraId];
        return proximo;
      });
    });
  }

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
          <Band grow rule="none">
            <Txt role="body" tone="muted">
              Abrindo a operação…
            </Txt>
          </Band>
        ) : null}

        {/* O PRIMEIRO DIA tem DUAS coisas verdadeiras, e a segunda estava escondida atrás
            da turma que ele ainda não tem: onde o dinheiro cai. Chamar o primeiro aluno e
            guardar a chave são o trabalho inteiro desse minuto — e a chave não afirma nada
            sobre uma turma que não existe, que era o motivo de todo o resto ter saído. */}
        {data && data.student_count === 0 ? (
          <>
            <PrimeiroDia onChamar={() => navigation.navigate("Convite")} />
            <ChaveDeRecebimento token={token} pix={data.pix} onSalvo={() => void load()} />
          </>
        ) : null}

        {data && data.student_count > 0 ? (
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
                    onRecebi={() => void pagar(r.bond_id, r.name)}
                    recibo={recibos[r.bond_id]}
                    onDesfazer={() => void desfazer(r.bond_id, r.name)}
                    ocupado={emVoo.has(r.bond_id)}
                    erro={falhas[r.bond_id]}
                  />
                ))}
              </>
            ) : data.com_mensalidade > 0 ? (
              /* "Ninguém em risco hoje" é tranquilização, e ela só vale depois que a conta
                 do mês existe. Antes disso é uma frase de tudo-certo no topo de uma tela em
                 que nada foi combinado ainda — e ela empurrava a única ação do dia para
                 baixo dela. */
              <View style={styles.vazio}>
                <Txt role="note" tone="dim">
                  Ninguém em risco hoje.
                </Txt>
              </View>
            ) : null}

            {data.em_aberto.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">Em aberto · {data.em_aberto.length}</Txt>
                </View>
                {data.em_aberto.map((it) => (
                  <LinhaEmAberto
                    key={it.bond_id}
                    item={it}
                    busy={emVoo.has(it.bond_id)}
                    erro={falhas[it.bond_id]}
                    recibo={recibos[it.bond_id]}
                    onRecebi={() => void pagar(it.bond_id, it.name)}
                    onDesfazer={() => void desfazer(it.bond_id, it.name)}
                  />
                ))}
              </>
            ) : (
              /* "Mês em dia: as 0 mensalidades estão pagas" é um sinal de tudo certo em
                 cima do caso em que NADA foi feito — e é o caso mais comum do primeiro dia.
                 Sem combinado nenhum, a faixa não desenha: a porta do Combinado, logo
                 abaixo, é a única coisa que ele precisa ver. */
              data.com_mensalidade > 0 ? (
                <View style={styles.vazio}>
                  <Txt role="note" tone="dim">
                    {data.com_mensalidade === 1
                      ? "A mensalidade está paga."
                      : `As ${data.com_mensalidade} mensalidades estão pagas.`}
                  </Txt>
                </View>
              ) : null
            )}

            {/* O QUE REPETE TODO MÊS. Fica ao lado do "em aberto" e não dentro dele: as
                duas coisas são dívida recorrente, mas uma é o combinado do treino e a outra
                é a marmita — e o personal cobra as duas em conversas diferentes. */}
            {data.assinaturas.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">Todo mês · {data.assinaturas.length}</Txt>
                </View>
                {data.assinaturas.map((a) => (
                  <LinhaAssinatura
                    key={a.id}
                    assinatura={a}
                    busy={emVoo.has(a.id)}
                    erro={falhas[a.id]}
                    recibo={recibos[a.id]}
                    onRecebi={() => void receberDoMes(a.id, a.name)}
                  />
                ))}
              </>
            ) : null}

            {/* O QUE ELE VENDEU FORA DA MENSALIDADE e ainda não recebeu. A descrição está
                NA LINHA porque ela é a única coisa que distingue uma extra da outra —
                "Marina · Avaliação física · R$ 150" se lê inteiro sem abrir nada. */}
            {data.a_entregar.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">A entregar · {data.a_entregar.length}</Txt>
                </View>
                {data.a_entregar.map((c) => (
                  <LinhaAvulsa
                    key={c.id}
                    extra={c}
                    busy={emVoo.has(c.id)}
                    erro={falhas[c.id]}
                    recibo={recibos[c.id]}
                    onRecebi={() => void receber(c.id, c.name)}
                    onDesfazer={() => void desfazerExtra(c.id, c.name)}
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
            {/* O CARDÁPIO: a porta, e ela carrega o dinheiro que já fez. Um número que não
                abre nada é um número que ele olha e fecha; este abre a lista de produtos e a
                tela de criar. */}
            <Pressable
              onPress={() =>
                navigation.navigate("Produtos", {
                  token,
                  timeName: time.name,
                  produtos: data.produtos,
                })
              }
              accessibilityRole="button"
              accessibilityLabel={
                data.produtos.length === 0
                  ? "Criar o que você vende além da mensalidade"
                  : `Ver os ${data.produtos.length} produtos do seu cardápio`
              }
            >
              <Band rule="none">
                <View style={styles.portaRow}>
                  <View style={styles.rowCopy}>
                    <Txt role="body">
                      {data.produtos.length === 0
                        ? "Você vende algo além da mensalidade?"
                        : `Seu cardápio · ${data.produtos.length}`}
                    </Txt>
                    <Txt role="note" tone="dim" style={styles.rowNote}>
                      {data.produtos.length === 0
                        ? "Suplemento, marmita, avaliação, pacote de sessões."
                        : resumoDoCardapio(data.produtos)}
                    </Txt>
                  </View>
                  <IconChevron color={T.muted2} size={16} />
                </View>
              </Band>
            </Pressable>

            {/* O PLACAR, e ele é sobre o que ELE fez — nunca uma faixa de engajamento da
                turma. Só existe quando ele agiu: um "0 de 0" seria o app cobrando quem
                acabou de instalar. */}
            {data.placar.tocados > 0 ? (
              <Band rule="none">
                <Txt role="body" tone="muted">
                  Você tocou em {data.placar.tocados}{" "}
                  {data.placar.tocados === 1 ? "pessoa" : "pessoas"} este mês.{" "}
                  {data.placar.voltaram === 0
                    ? "Nenhuma voltou a treinar ainda."
                    : `${data.placar.voltaram} ${
                        data.placar.voltaram === 1 ? "voltou" : "voltaram"
                      } a treinar.`}
                </Txt>
              </Band>
            ) : null}

            <ChaveDeRecebimento token={token} pix={data.pix} onSalvo={() => void load()} />

            <AOperacaoInteira data={data} token={token} timeName={time.name} />

            <Fita meses={data.meses} />
          </>
        ) : null}
      </ScrollView>
    </Phone>
  );
}

/** O PRIMEIRO DIA, e ele é uma tela diferente — não a Operação cheia com zero dentro dela.
 *
 *  Turma zero desenhava sete zeros em 1055pt de rolagem: o herói imprimia "R$ 0", a grade
 *  afirmava "ninguém vencido" e "turma nova · 1º mês" sobre uma turma que não existe, e a
 *  linha mais gritante era "Você vende algo além da mensalidade?" — venda antes da primeira
 *  pessoa. Um vazio não pode afirmar o que não sabe, e nenhuma dessas frases era falsificável.
 *
 *  Sobra a única coisa verdadeira nesse minuto: ele não tem aluno, e a operação inteira
 *  espera o primeiro nome. Uma frase, uma ação, e o único acento da tela. */
function PrimeiroDia({ onChamar }: { onChamar: () => void }) {
  const styles = usarEstilos();
  return (
    <Band rule="none">
      <Txt role="title">Sua operação começa com um nome.</Txt>
      <Txt role="note" tone="dim" style={styles.notaDoMes}>
        Chame o primeiro aluno. Quando ele entrar, o valor combinado se digita aqui.
      </Txt>
      <View style={styles.chaveAcao}>
        <AccentCTA label="Chamar um aluno" onPress={onChamar} />
      </View>
    </Band>
  );
}

/** A LINHA DO DINHEIRO EM ABERTO: nome, quando venceu, quanto — e as duas coisas que o
 *  personal faz com isso.
 *
 *  [Pix] copia o código com o VALOR daquela pessoa já dentro. Hoje ele abre o WhatsApp,
 *  digita a chave na mão e escreve o número; metade das vezes a aluna lê errado e paga
 *  R$ 300 no lugar de R$ 350, e sobra uma diferença que ninguém concilia.
 *
 *  [Recebi] é o fato que ELE registra — o app nunca cobra o aluno. E a linha NÃO some no
 *  toque: o slot vira o recibo, e o recibo é o alvo do desfazer. Sem diálogo: confirmação em
 *  toda ação é o que faz app parecer formulário, e aqui o desfazer É a confirmação.
 *
 *  QUANDO A ALUNA DISSE que já pagou, a linha troca de trabalho: deixa de ser "lembrar" e
 *  passa a ser "conferir", e o rótulo do botão acompanha. Sem essa troca, o verbo dela — a
 *  tabela, a rota, o botão no Perfil e a reordenação — não produzia um pixel do lado dele. */
function LinhaEmAberto({
  item,
  busy,
  erro,
  recibo,
  onRecebi,
  onDesfazer,
}: {
  item: OwnerOperacao["em_aberto"][number];
  busy: boolean;
  /** A falha DESTA linha. Mora aqui e não no topo da rolagem: o aviso nascia a ~500pt
   *  do dedo que o causou, fora da tela. */
  erro?: string;
  recibo?: string;
  onRecebi: () => void;
  onDesfazer: () => void;
}) {
  const styles = usarEstilos();
  const { errorInk } = useTema();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await Clipboard.setStringAsync(item.copia_e_cola);
    setCopiado(true);
  }

  const nota = copiado
    ? "Copiado. Cole no WhatsApp."
    : item.diz_que_ja_pagou
      ? // O VALOR PRIMEIRO. A coluna é estreita (avatar + duas ações) e o corte cai no fim
        // da frase: com "disse que pagou" na frente, o que se perdia era o dinheiro.
        `R$ ${reais(item.devido_cents)} · disse que pagou`
      : // A DÍVIDA COM O TAMANHO DELA, E DESDE QUANDO — nesta ordem, e a ordem é a regra.
        //
        // O VALOR PRIMEIRO, nas TRÊS notas. A coluna é estreita (avatar + duas ações) e o
        // corte de `numberOfLines={1}` cai no FIM da frase: com o dinheiro no fim, "3 meses
        // desde 15 de junho · R$ 900" virava "3 meses desde 15 de junho…" e o "…" comia
        // exatamente o número que ele precisa para escrever a mensagem. A linha de quem
        // disse que pagou já obedecia a esta regra, e as outras duas não.
        //
        // E a DATA: "3 meses" sem desde-quando era o texto ficando MAIS vago quanto mais
        // velha a dívida, o inverso do que ele precisa. A data é a que ele pediu por escrito.
        item.meses_abertos > 1
        ? `R$ ${reais(item.devido_cents)} · ${item.meses_abertos} meses desde ${dataCurta(item.venceu_em)}`
        : `R$ ${reais(item.amount_cents)} · ${vencimento(item.due_day, item.vencido_ha, item.venceu_em)}`;

  return (
    <View style={styles.row}>
      {/* UMA PESSOA, UMA ANATOMIA. A Marina aparecia duas vezes na mesma tela com dois
          desenhos: com rosto na fila do dia, sem rosto no livro-caixa. É o que faz a lista
          ler como montada no susto em vez de construída. */}
      <Initials name={item.name} size={34} />
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {item.name}
        </Txt>
        <Txt
          role="note"
          tone={erro ? undefined : "dim"}
          color={erro ? errorInk : undefined}
          style={styles.rowNote}
          numberOfLines={1}
        >
          {erro ?? (recibo ? `Recebi · ${recibo}` : nota)}
        </Txt>
      </View>
      {recibo ? (
        <AcaoDaLinha
          rotulo="Desfazer"
          busy={busy}
          onPress={onDesfazer}
          acessivel={`Desfazer o recebimento de ${item.name}`}
        />
      ) : (
        <>
          {item.copia_e_cola ? (
            <AcaoDaLinha
              rotulo="Pix"
              discreta
              onPress={() => void copiar()}
              acessivel={`Copiar o Pix de ${item.name}, R$ ${reais(item.devido_cents)}`}
            />
          ) : null}
          <AcaoDaLinha
            rotulo={item.diz_que_ja_pagou ? "Conferir" : "Recebi"}
            busy={busy}
            onPress={onRecebi}
            acessivel={`Marcar a mensalidade de ${item.name} como recebida`}
          />
        </>
      )}
    </View>
  );
}

/** A LINHA DO QUE REPETE TODO MÊS.
 *
 *  Mesma anatomia da mensalidade, e pelo mesmo motivo: para o dedo do personal, a marmita de
 *  R$ 890 e a mensalidade de R$ 350 são o mesmo gesto — copiar o Pix, marcar recebido. Duas
 *  gramáticas na mesma tela seriam dois sistemas visuais sem que a troca significasse nada.
 *
 *  O valor é o da DÍVIDA, não o de um mês: quem assinou em março e nunca pagou deve quatro
 *  competências, e mostrar R$ 890 faria o personal cobrar um quarto do que tem a receber. */
function LinhaAssinatura({
  assinatura,
  busy,
  erro,
  recibo,
  onRecebi,
}: {
  assinatura: AssinaturaAberta;
  busy: boolean;
  /** A falha DESTA linha. Mora aqui e não no topo da rolagem: o aviso nascia a ~500pt
   *  do dedo que o causou, fora da tela. */
  erro?: string;
  recibo?: string;
  onRecebi: () => void;
}) {
  const styles = usarEstilos();
  const { errorInk } = useTema();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await Clipboard.setStringAsync(assinatura.copia_e_cola);
    setCopiado(true);
  }

  // O VALOR PRIMEIRO, a mesma regra das outras linhas de dinheiro: com o número no fim,
  // "Marmita fitness · 3 meses · R$ 2.670" virava "Marmita fitness · 3 meses · …" e o corte
  // comia justamente o que ele precisa — e o nome do produto que sobrava já está repetido na
  // linha de cima, porque duas assinantes da mesma marmita são duas linhas vizinhas.
  const nota = copiado
    ? "Copiado. Cole no WhatsApp."
    : assinatura.meses_abertos > 1
      ? `R$ ${reais(assinatura.devido_cents)} · ${assinatura.meses_abertos} meses de ${assinatura.nome}`
      : `R$ ${reais(assinatura.valor_cents)} · ${assinatura.nome}`;

  return (
    <View style={styles.row}>
      <Initials name={assinatura.name} size={34} />
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {assinatura.name}
        </Txt>
        <Txt
          role="note"
          tone={erro ? undefined : "dim"}
          color={erro ? errorInk : undefined}
          style={styles.rowNote}
          numberOfLines={1}
        >
          {erro ?? (recibo ? `Recebi · ${recibo}` : nota)}
        </Txt>
      </View>
      {assinatura.copia_e_cola ? (
        <AcaoDaLinha
          rotulo="Pix"
          discreta
          onPress={() => void copiar()}
          acessivel={`Copiar o Pix de ${assinatura.name}, ${assinatura.nome}, R$ ${reais(assinatura.devido_cents)}`}
        />
      ) : null}
      <AcaoDaLinha
        rotulo="Recebi"
        busy={busy}
        onPress={onRecebi}
        acessivel={`Marcar um mês de ${assinatura.nome} de ${assinatura.name} como recebido`}
      />
    </View>
  );
}

/** A LINHA DO QUE ELE VENDEU À PARTE. Mesma anatomia da mensalidade — e de propósito: uma
 *  avaliação de R$ 150 e uma mensalidade de R$ 350 são a mesma coisa para o dedo dele, então
 *  duas gramáticas na mesma tela seriam dois sistemas visuais sem que a troca significasse
 *  nada. */
function LinhaAvulsa({
  extra,
  busy,
  erro,
  recibo,
  onRecebi,
  onDesfazer,
}: {
  extra: Extra;
  busy: boolean;
  /** A falha DESTA linha. Mora aqui e não no topo da rolagem: o aviso nascia a ~500pt
   *  do dedo que o causou, fora da tela. */
  erro?: string;
  recibo?: string;
  onRecebi: () => void;
  onDesfazer: () => void;
}) {
  const styles = usarEstilos();
  const { errorInk } = useTema();
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await Clipboard.setStringAsync(extra.copia_e_cola);
    setCopiado(true);
  }

  return (
    <View style={styles.row}>
      <Initials name={extra.name} size={34} />
      <View style={styles.rowCopy}>
        <Txt role="body" numberOfLines={1}>
          {extra.name}
        </Txt>
        <Txt
          role="note"
          tone={erro ? undefined : "dim"}
          color={erro ? errorInk : undefined}
          style={styles.rowNote}
          numberOfLines={1}
        >
          {erro ??
            (recibo
              ? `Recebi · ${recibo}`
              : copiado
                ? "Copiado. Cole no WhatsApp."
                : `${extra.descricao} · R$ ${reais(extra.valor_cents)}`)}
        </Txt>
      </View>
      {recibo ? (
        <AcaoDaLinha
          rotulo="Desfazer"
          busy={busy}
          onPress={onDesfazer}
          acessivel={`Desfazer o recebimento de ${extra.descricao} de ${extra.name}`}
        />
      ) : (
        <>
          {extra.copia_e_cola ? (
            <AcaoDaLinha
              rotulo="Pix"
              discreta
              onPress={() => void copiar()}
              acessivel={`Copiar o Pix de ${extra.name}, ${extra.descricao}`}
            />
          ) : null}
          <AcaoDaLinha
            rotulo="Recebi"
            busy={busy}
            onPress={onRecebi}
            acessivel={`Marcar ${extra.descricao} de ${extra.name} como recebido`}
          />
        </>
      )}
    </View>
  );
}

/** A CHAVE DE RECEBIMENTO — e sem ela o Pix inteiro é teatro.
 *
 *  O gerador de BR Code, a coluna no banco, o campo no payload e o botão na linha estavam
 *  todos escritos e testados, e nenhuma tela do app gravava a chave: `studios.chave_pix`
 *  nascia NULL em toda instalação, `configurado` era sempre falso e as três guardas
 *  `{copia_e_cola ? ...}` escondiam o botão para sempre. Um subsistema inteiro entregue e
 *  inalcançável — o mesmo defeito que a rota órfã do Combinado tinha, repetido.
 *
 *  Mora AQUI, e não no Perfil do Time, por dois motivos: é nesta tela que a falta é sentida
 *  (é aqui que o [Pix] não aparece), e a chave não viaja no payload do Time — que é
 *  compartilhado com o convite e com o /v1/me do aluno. Chave de recebimento não é assunto
 *  de quem paga.
 *
 *  O VAZIO É O FORMULÁRIO: sem chave, os três campos estão na tela; com chave, sobra uma
 *  linha discreta. Configuração de uma vez não merece uma tela própria. */
function ChaveDeRecebimento({
  token,
  pix,
  onSalvo,
}: {
  token: string;
  pix: OwnerOperacao["pix"];
  onSalvo: () => void;
}) {
  const styles = usarEstilos();
  const { FORMA, errorInk } = useTema();
  const [abrindo, setAbrindo] = useState(false);
  const [chave, setChave] = useState(pix.chave);
  const [nome, setNome] = useState(pix.nome);
  const [cidade, setCidade] = useState(pix.cidade);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const completo =
    chave.trim() !== "" && nome.trim() !== "" && cidade.trim() !== "";

  async function salvar() {
    if (!completo || salvando) return;
    setSalvando(true);
    setErro("");
    try {
      await patchTime(token, {
        chave_pix: chave.trim(),
        nome_recebedor: nome.trim(),
        cidade_recebedor: cidade.trim(),
      });
      setAbrindo(false);
      onSalvo();
    } catch (e) {
      setErro(
        e instanceof ApiError && e.code === "invalido"
          ? "Essa chave não é uma chave Pix. Vale CPF, CNPJ, telefone, e-mail ou chave aleatória."
          : "Não deu para salvar. A chave continua como estava.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (pix.configurado && !abrindo) {
    return (
      <Band rule="none">
        <Txt role="note" tone="dim">
          O Pix das linhas vai para {pix.chave}.
        </Txt>
        <View style={styles.chaveAcao}>
          <GhostCTA
            label="Mudar a chave"
            fundo={FORMA.folha.peca.composto}
            onPress={() => setAbrindo(true)}
          />
        </View>
      </Band>
    );
  }

  return (
    <Band rule="none">
      <Txt role="label">Receber por Pix</Txt>
      <Txt role="note" tone="dim" style={styles.chaveDica}>
        É pra cá que o dinheiro do aluno vai — direto, sem passar por ninguém.
      </Txt>
      <Campo
        label="Sua chave Pix"
        placeholder="CPF, telefone, e-mail ou chave aleatória"
        autoCapitalize="none"
        value={chave}
        onChangeText={setChave}
        style={styles.chaveCampo}
      />
      <Campo
        label="Nome de quem recebe"
        placeholder="Fred Personal"
        value={nome}
        onChangeText={setNome}
        style={styles.chaveCampo}
      />
      <Campo
        label="Cidade"
        placeholder="São Paulo"
        value={cidade}
        onChangeText={setCidade}
        style={styles.chaveCampo}
      />
      {erro ? (
        <Txt role="note" color={errorInk} style={styles.chaveDica}>
          {erro}
        </Txt>
      ) : null}
      <View style={styles.chaveAcao}>
        <AccentCTA
          label="Guardar a chave"
          busy={salvando}
          disabled={!completo}
          quiet
          onPress={() => void salvar()}
        />
      </View>
    </Band>
  );
}

/** A OPERAÇÃO INTEIRA — o pedido era "toda", e essa palavra é o requisito.
 *
 *  A dobra desta tela é a FILA: o que ele faz nos próximos dez minutos. Estes números não
 *  cabem lá e não deveriam — quatro cartões de "quantos" na dobra foi exatamente o defeito
 *  que a reconstrução consertou. Mas eles também não podem NÃO existir: total de alunos e
 *  ticket médio saíram da tela quando a dobra foi refeita, e eram dois dos cinco números que
 *  o dono do produto pediu por escrito. Some no nome do espaço é sumir.
 *
 *  Então eles moram aqui, abaixo do trabalho, e obedecem à mesma lei que o resto: TODO
 *  número abre uma lista de nomes. "28 alunos" abre a turma. "R$ 1.050 vencido" rola até os
 *  nomes. "Ana é 15% da sua receita" já É o nome.
 *
 *  E há os que ele NÃO TEM EM LUGAR NENHUM, que é onde este bloco se paga: quantos entraram
 *  e quantos saíram no mês (um estúdio que ganha 3 e perde 3 tem o mesmo total do mês
 *  passado e está numa situação completamente diferente); há quantos meses a turma ativa
 *  está com ele; e a concentração — se uma pessoa é 15% da receita, perder ela é um evento,
 *  e ninguém sabe disso antes de acontecer. */
function AOperacaoInteira({
  data,
  token,
  timeName,
}: {
  data: OwnerOperacao;
  token: string;
  timeName: string;
}) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();
  const v = data.visao;
  const mes = mesPorExtenso(data.month);
  // A DÍVIDA, que a barra do mês não sabe dizer: a barra é deste mês, isto é de TODAS as
  // competências abertas. Existia solto no topo do arquivo, morto — calculado, nunca usado,
  // e ainda somando o campo de um mês só.
  const abertoCents = data.em_aberto.reduce((soma, it) => soma + it.devido_cents, 0);
  const mesesAbertos = data.em_aberto.reduce((soma, it) => soma + it.meses_abertos, 0);

  return (
    <>
      <View style={styles.secHeadFria}>
        <Txt role="label" tone="dim">
          A operação inteira · {mes}
        </Txt>
      </View>

      {/* OS CINCO NÚMEROS pedidos, em duas colunas, com o rótulo mudo e o valor com o peso.
          Duas colunas cabem aqui porque estes valores são curtos — e a fila de quatro
          cartões que colapsava em uma coluna acima de R$ 9.999 morava na DOBRA, que é onde
          o custo era a tela inteira. Aqui embaixo, o mesmo desenho é barato. */}
      <View style={styles.grade}>
        <Celula
          rotulo="Alunos"
          valor={String(data.student_count)}
          nota={movimento(v.entraram, v.sairam)}
          onPress={() => navigation.navigate("Alunos")}
        />
        {/* AS TRÊS CÉLULAS DE MENSALIDADE só existem quando existe mensalidade.
            Enquanto não checavam, o SEGUNDO DIA — três alunos dentro, nenhum valor combinado
            — imprimia "TICKET MÉDIO R$ 0 / de 0 combinados", "COMBINADO NO MÊS R$ 0 / o preço
            de tabela da turma" e "EM ABERTO R$ 0 / ninguém em aberto": os quatro zeros que o
            PrimeiroDia foi construído para matar, de volta no dia seguinte, e o último deles
            é um TUDO-CERTO por cima de um nada-feito.
            "Alunos" e "Tempo de casa" ficam: os dois são verdade com zero combinados. */}
        {data.com_mensalidade > 0 ? (
          <>
            <Celula
              rotulo="Ticket médio"
              valor={`R$ ${reais(data.ticket_cents)}`}
              nota={`de ${data.com_mensalidade} ${data.com_mensalidade === 1 ? "combinado" : "combinados"}`}
            />
            <Celula
              rotulo="Combinado no mês"
              valor={`R$ ${reais(data.receita_cents)}`}
              nota="o preço de tabela da turma"
            />
          </>
        ) : null}
        {/* A DÍVIDA, e não o mês. O valor era `vencido_cents` — um mês por pessoa, a soma
            que a barra precisa — e a nota contava as pessoas da lista inteira: quem deve
            cinco competências aparecia aqui como R$ 350. Além de repetir verbatim a
            legenda da barra, 300pt acima. Agora a barra é do mês, a célula é da dívida, e
            cada uma diz qual das duas é. */}
        {data.com_mensalidade > 0 ? (
          <Celula
            rotulo="Em aberto"
            valor={`R$ ${reais(abertoCents)}`}
            nota={
              data.em_aberto.length === 0
                ? "ninguém em aberto"
                : `${data.em_aberto.length} ${data.em_aberto.length === 1 ? "pessoa" : "pessoas"} · ${mesesAbertos} ${mesesAbertos === 1 ? "mês" : "meses"}`
            }
            cor={contarVencidos(data) > 0 ? errorInk : undefined}
          />
        ) : null}
        {/* Sem cardápio E sem venda, "R$ 0 · sem cardápio ainda" é o rodapé oferecendo venda
            antes da primeira pessoa — a mesma frase que já foi cortada da dobra por isso. */}
        {data.produtos.length > 0 || v.produto_cents > 0 ? (
          <Celula
            rotulo="Venda de produto"
            valor={`R$ ${reais(v.produto_cents)}`}
            nota={
              data.produtos.length === 0
                ? "fora do cardápio"
                : `${data.produtos.length} no cardápio`
            }
          />
        ) : null}
        <Celula
          rotulo="Tempo de casa"
          valor={mesesPorExtenso(v.permanencia_meses)}
          nota={v.permanencia_meses < 1 ? "turma nova" : "em média, quem está hoje"}
        />
      </View>

      {/* COLADA na grade, e sem porta programática: a célula que ela desmente é a de cima. */}
      <Escada
        combinados={data.combinados}
        ticketCents={data.ticket_cents}
        token={token}
        timeName={timeName}
      />

      {/* A CONCENTRAÇÃO é o único número desta tela que já nasce sendo um nome — e é o que
          o personal menos costuma saber sobre o próprio negócio. */}
      {v.maior_fatia_bps >= 1000 && v.maior_nome ? (
        <Band rule="none">
          <Txt role="body" tone="muted">
            {/* Sem gênero cravado: a frase saía "sozinha" embaixo de um nome masculino. */}
            {primeiroNome(v.maior_nome)} é {fracaoPorExtenso(v.maior_fatia_bps)} do que você
            tem combinado. Se sair, é um mês diferente.
          </Txt>
        </Band>
      ) : null}
    </>
  );
}

/** Uma célula da grade. `onPress` é opcional só porque nem todo número tem para onde ir
 *  ainda — quando tiver, a porta entra aqui e nada mais muda. */
function Celula({
  rotulo,
  valor,
  nota,
  cor,
  onPress,
}: {
  rotulo: string;
  valor: string;
  nota?: string;
  cor?: string;
  onPress?: () => void;
}) {
  const styles = usarEstilos();
  const corpo = (
    <>
      <Txt role="label" tone="dim">
        {rotulo}
      </Txt>
      {/* UMA linha, sempre. Uma célula de duas linhas ao lado de uma de uma desalinha a
          base da fila inteira, e é o tipo de torto que o olho vê sem saber nomear. */}
      <Txt role="title" color={cor} numberOfLines={1} style={styles.celulaValor}>
        {valor}
      </Txt>
      {nota ? (
        <Txt role="note" tone="dim" numberOfLines={1}>
          {nota}
        </Txt>
      ) : null}
    </>
  );
  if (!onPress) return <View style={styles.celula}>{corpo}</View>;
  return (
    <Pressable
      style={styles.celula}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${rotulo}: ${valor}. ${nota ?? ""}`}
    >
      {corpo}
    </Pressable>
  );
}

/** "3 entraram · 1 saiu" — e nada quando o mês não moveu ninguém. O saldo sozinho ("+2")
 *  esconde que ele ganhou 5 e perdeu 3, que é uma situação completamente diferente. */
function movimento(entraram: number, sairam: number): string {
  const partes: string[] = [];
  if (entraram > 0) partes.push(`${entraram} ${entraram === 1 ? "entrou" : "entraram"}`);
  if (sairam > 0) partes.push(`${sairam} ${sairam === 1 ? "saiu" : "saíram"}`);
  return partes.length ? partes.join(" · ") : "sem movimento no mês";
}

function contarVencidos(data: OwnerOperacao): number {
  return data.em_aberto.filter((i) => i.vencido_ha >= 0).length;
}

/** Meses em prosa: abaixo de dois, o número em mês mente sobre a precisão que não existe. */
function mesesPorExtenso(m: number): string {
  // "menos de 1 mês" quebrava em duas linhas dentro da célula e desalinhava a fila inteira.
  // O valor da célula é sempre UMA linha, por construção — a precisão que não cabe vira nota.
  if (m < 1) return "1º mês";
  if (m < 24) return `${Math.round(m)} ${Math.round(m) === 1 ? "mês" : "meses"}`;
  return `${(m / 12).toFixed(1).replace(".", ",")} anos`;
}

/** A FITA: o único retrovisor da Operação, e ele mora no RODAPÉ — abaixo de todas as
 *  listas de nomes, porque nenhum desenho compete com trabalho pela dobra.
 *
 *  ELA ERA UMA COLUNA EM PÉ, e o defeito não era a escala: era o EIXO. Num telefone de
 *  390pt o eixo longo é a LARGURA (259pt úteis contra 72pt de altura), e a fita gastava a
 *  altura curta na variável de maior amplitude — o dinheiro — e a largura longa em seis
 *  rótulos de três letras. Medido na turma do fixture (R$ 7.800 a R$ 10.100): a série
 *  inteira desenhava 16,4pt de diferença e a queda de maio para junho desenhava 2,1pt.
 *  Deitada, o mesmo dado no mesmo trilho proporcional — a âncora continua no zero, que é o
 *  que não se negocia em gráfico de dinheiro — vale 59,0pt e 7,6pt.
 *
 *  E a largura que sobra é onde finalmente cabe o VALOR EXATO ao lado de cada mês: o
 *  segundo canal, que a coluna em pé nunca teve onde pôr. Cor e comprimento nunca são o
 *  único canal.
 *
 *  A regra que ela obedece é a que a doutrina da casa escreve por extenso: nenhum número
 *  existe se tocá-lo não produzir uma lista de pessoas. A referência de mercado tem uma
 *  tela de retenção com quatro KPIs e cinco faixas coloridas, zero nomes e zero ações. A
 *  diferença aqui não é a tipografia: é que a linha ABRE, no lugar, com os nomes.
 *
 *  Só mês FECHADO, e só a partir de dois. O mês corrente cresceria durante o mês e a fita
 *  mentiria sobre a forma da própria série. Sem esqueleto e sem eixo inventado: não
 *  desenhar é a resposta certa.
 *
 *  Zero biblioteca: são duas Views por linha. */
function Fita({ meses }: { meses: OwnerOperacao["meses"] }) {
  const styles = usarEstilos();
  const { T } = useTema();
  const [aberto, setAberto] = useState<string | null>(null);

  const serie = preencherMeses(meses);
  if (serie.length < 2) return null;

  const teto = Math.max(...serie.map((m) => m.recebido_cents));
  // Sem isto, `(v / teto) * 100` devolve NaN e sai `width: "NaN%"`. Um mês só entra na
  // série se teve pagamento, então não é alcançável hoje — é uma linha.
  if (teto <= 0) return null;

  // LARGURA FIXA para a coluna do valor, calculada pelo maior rótulo da série. Auto por
  // linha daria trilhos de comprimentos diferentes, e aí a escala deixa de existir.
  const larguraDoValor = Math.ceil(
    Math.max(...serie.map((m) => reais(m.recebido_cents).length)) *
      TYPE.label *
      AVANCO_DO_DIGITO,
  );

  const i = serie.findIndex((m) => m.month === aberto);
  const escolhido = i >= 0 ? serie[i] : null;

  if (escolhido) {
    const dif = diferencaDoMes(serie, i);
    return (
      <>
        <View style={styles.secHeadFria}>
          <Txt role="label" tone="dim">
            {mesPorExtenso(escolhido.month)} · R$ {reais(escolhido.recebido_cents)} ·{" "}
            {escolhido.quantos === 1 ? "1 pagou" : `${escolhido.quantos} pagaram`}
          </Txt>
        </View>
        {dif && dif.sumiram.length > 0 ? (
          <Band rule="none">
            <Txt role="note" tone="dim">
              Pagou em {mesPorExtenso(serie[i - 1].month)} e não aparece aqui:{" "}
              {nomesCurtos(dif.sumiram)}.
            </Txt>
          </Band>
        ) : null}
        {dif && dif.entraram.length > 0 ? (
          <Band rule="none">
            <Txt role="note" tone="dim">Só aparece aqui: {nomesCurtos(dif.entraram)}.</Txt>
          </Band>
        ) : null}
        {escolhido.nomes.map((n) => (
          <View key={n} style={styles.row}>
            <View style={styles.rowCopy}>
              <Txt role="body" numberOfLines={1}>
                {n}
              </Txt>
            </View>
          </View>
        ))}
        <Band rule="none">
          <Pressable
            onPress={() => setAberto(null)}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a fita dos meses"
          >
            <Txt role="label">Voltar</Txt>
          </Pressable>
        </Band>
      </>
    );
  }

  return (
    <>
      <View style={styles.secHeadFria}>
        <Txt role="label" tone="dim">
          Meses fechados
        </Txt>
      </View>
      <Band rule="none">
        {serie.map((m) => {
          const vazio = m.quantos === 0;
          const linha = (
            <View style={styles.mesLinha}>
              <Txt role="note" tone="dim" style={styles.mesRotulo}>
                {mesCurto(m.month)}
              </Txt>
              {/* O valor é o canal que carrega a série: um degrau ACIMA do rótulo do mês,
                  nunca a tinta mais apagada da linha. */}
              <Txt role="note" numberOfLines={1} style={[styles.mesValor, { width: larguraDoValor }]}>
                {reais(m.recebido_cents)}
              </Txt>
              {/* Sem pista de fundo: cinco faixas cinzas atrás de cinco barras cheias são
                  tinta que não carrega informação, e o zero já está escrito a 12pt daqui. */}
              <View style={styles.mesTrilho}>
                {m.recebido_cents > 0 ? (
                  <View
                    style={[
                      styles.segmento,
                      styles.mesBarra,
                      { backgroundColor: T.ink, width: `${(m.recebido_cents / teto) * 100}%` },
                    ]}
                  />
                ) : null}
              </View>
            </View>
          );
          // "nada marcado", e não "ninguém pagou": ausência de linha tem duas causas
          // indistinguíveis, e uma delas é ele ter esquecido de marcar.
          if (vazio) {
            return (
              <View
                key={m.month}
                accessible
                accessibilityLabel={`${mesPorExtenso(m.month)}, nada marcado`}
              >
                {linha}
              </View>
            );
          }
          return (
            <Pressable
              key={m.month}
              onPress={() => setAberto(m.month)}
              accessibilityRole="button"
              accessibilityLabel={`${mesPorExtenso(m.month)}, R$ ${reais(m.recebido_cents)}, ${
                m.quantos === 1 ? "1 pagou" : `${m.quantos} pagaram`
              }. Abre os nomes.`}
            >
              {linha}
            </Pressable>
          );
        })}
        {/* A ESCALA em prosa, e não em eixo. Um eixo com marcas de valor custa duas linhas
            de tinta e ainda exige o olho ir e voltar; a frase entrega o piso e o teto de uma
            vez. E o que a geometria NÃO sabe dizer: o nome por trás do degrau. */}
        <Txt role="note" tone="dim" style={styles.notaDaFita}>
          {frasesDaFita(serie, teto).join(" ")}
        </Txt>
      </Band>
    </>
  );
}

/** O MÊS EM QUE NINGUÉM MARCOU não existe no payload: `meses.go` agrupa pagamentos, e mês
 *  sem pagamento não vira linha zerada — ele simplesmente some. Abril colado em junho
 *  afirma uma continuidade que não há.
 *
 *  Anda de mês em mês por FATIA DA STRING, nunca `new Date(iso)`: o construtor lê data sem
 *  hora como UTC e devolve o mês anterior em todo fuso a oeste de Greenwich, que é o Brasil
 *  inteiro. */
function preencherMeses(meses: OwnerOperacao["meses"]): OwnerOperacao["meses"] {
  if (meses.length < 2) return meses;
  const fim = meses[meses.length - 1].month;
  const out: OwnerOperacao["meses"] = [];
  let ano = Number(meses[0].month.slice(0, 4));
  let mes = Number(meses[0].month.slice(5, 7));
  // ponytail: teto de 24 é a trava contra payload torto (fim anterior ao início) — a fita
  // pede 6 meses e nenhum caminho pede mais.
  while (out.length < 24) {
    const iso = `${ano}-${String(mes).padStart(2, "0")}-01`;
    out.push(
      meses.find((m) => m.month === iso) ?? { month: iso, recebido_cents: 0, quantos: 0, nomes: [] },
    );
    if (iso >= fim) break;
    mes += 1;
    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
  }
  return out;
}

/** QUEM PAGOU NUM MÊS E NÃO APARECE NO SEGUINTE — e o espelho.
 *
 *  R$ 300 a menos não é um retângulo 7,6pt mais curto: é a Bruna. E este é o único lugar do
 *  app onde alguém que parou de aparecer volta a ser NOMEADO — `risco` e `em_aberto` só
 *  carregam quem ainda está na turma ativa.
 *
 *  O VERBO É O DA PROVA. Nunca "saiu", "perdeu" ou "cancelou": não existe registro de "não
 *  pagou" no schema, existe AUSÊNCIA de linha — e ausência tem duas causas indistinguíveis
 *  (ela não pagou, ou ele não marcou). A frase de PAGAMENTO é verdadeira nos dois mundos; a
 *  de saída só é verdadeira num deles. A ação da manhã é a mesma: abrir o WhatsApp e
 *  perguntar.
 *
 *  Os dois conjuntos são completos, não amostra: `meses.go` faz array_agg dos nomes sem
 *  limite — o LIMIT da query é de MESES. */
function diferencaDoMes(
  serie: OwnerOperacao["meses"],
  i: number,
): { sumiram: string[]; entraram: string[] } | null {
  if (i <= 0) return null;
  const atual = serie[i];
  const anterior = serie[i - 1];
  // Mês preenchido como zero: sem esta guarda ele listaria a turma inteira do mês anterior
  // como se algo tivesse acontecido com cada uma, e o mês seguinte como recém-chegadas.
  if (atual.quantos === 0 || anterior.quantos === 0) return null;
  const dentro = new Set(atual.nomes);
  const antes = new Set(anterior.nomes);
  return {
    sumiram: anterior.nomes.filter((n) => !dentro.has(n)),
    entraram: atual.nomes.filter((n) => !antes.has(n)),
  };
}

/** A prosa embaixo do desenho, em ordem fixa: a escala, o nome por trás do último degrau,
 *  e o convite. O DELTA EM REAIS não entra — os dois valores já estão impressos um sob o
 *  outro, em dígito tabular, a 44pt de distância. */
function frasesDaFita(serie: OwnerOperacao["meses"], teto: number): string[] {
  const valores = serie.map((m) => m.recebido_cents);
  const piso = Math.min(...valores);
  const cheio = serie[valores.lastIndexOf(teto)];
  const ordenados = [...valores].sort((a, b) => a - b);
  const mediana = ordenados[Math.floor(ordenados.length / 2)];
  const fora = serie.filter((m) => m.recebido_cents !== teto).map((m) => m.recebido_cents);

  const frases: string[] = [];
  if (piso === teto) {
    // Honesto e inútil, que é o certo: seis barras cheias e a frase que diz por quê.
    frases.push(
      `Os ${serie.length} meses fecharam iguais, R$ ${reais(teto)}.`,
    );
  } else if (mediana > 0 && teto > 3 * mediana && fora.length > 0) {
    // A geometria NÃO reescala e NÃO trunca: o mês fora de curva fica com o trilho inteiro
    // e os outros ficam curtos, que é a verdade. Quem nomeia o caso é a prosa.
    frases.push(
      `${mesPorExtenso(cheio.month)} fechou muito acima dos outros (R$ ${reais(teto)}) e é ele que enche o trilho; os outros ficaram entre R$ ${reais(Math.min(...fora))} e R$ ${reais(Math.max(...fora))}.`,
    );
  } else {
    frases.push(
      `Trilho cheio = ${mesPorExtenso(cheio.month)}, seu melhor mês fechado: R$ ${reais(teto)}.`,
    );
  }

  const dif = diferencaDoMes(serie, serie.length - 1);
  if (dif && dif.sumiram.length > 0) {
    frases.push(
      `Pagou em ${mesPorExtenso(serie[serie.length - 2].month)} e não aparece em ${mesPorExtenso(serie[serie.length - 1].month)}: ${nomesCurtos(dif.sumiram)}.`,
    );
  }
  frases.push("Toque um mês para ver quem pagou.");
  return frases;
}

/** A ESCADA DO COMBINADO: uma coluna por faixa de preço, e a altura conta PESSOAS.
 *
 *  Ela existe para desmentir a única mentira que já estava na tela: "Ticket médio R$ 375"
 *  apresenta uma média como se fosse a distribuição. É o mesmo número para uma turma toda
 *  em 375 e para metade em 250 e metade em 500 — e as duas pedem manhãs diferentes.
 *
 *  E desmente com a grandeza que SOBREVIVE à âncora no zero: contagem de gente. Duas contra
 *  nove pessoas é 4,5× e se lê de longe; R$ 7.800 contra R$ 10.100 é 1,29× e some. A altura
 *  CONTA — não interpola —, então a razão entre duas colunas é a razão entre duas
 *  contagens, exata.
 *
 *  As faixas são CONTÍGUAS, e as vazias desenham o próprio slot: o buraco entre dois lumps
 *  é a história inteira, e é exatamente o que a média existe para esconder.
 *
 *  Ela é a única peça desta tela que termina num botão que grava dinheiro: a faixa abre os
 *  nomes e manda todos de uma vez para o Combinado em lote — rota que já existe e que hoje
 *  só se abre pela porta de "sem valor combinado", ou seja UMA vez na vida de cada aluna. */
function Escada({
  combinados,
  ticketCents,
  token,
  timeName,
}: {
  combinados: OwnerOperacao["combinados"];
  ticketCents: number;
  token: string;
  timeName: string;
}) {
  const styles = usarEstilos();
  const { T } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();
  const [aberta, setAberta] = useState<number | null>(null);

  // Quatro valores são uma lista, não uma forma — mesmo idioma do `meses.length < 2`.
  if (combinados.length < 5) return null;

  const { passo, faixas } = faixasDePreco(combinados);
  const escolhida = aberta !== null ? faixas[aberta] : null;

  if (escolhida) {
    const soma = escolhida.gente.reduce((s, c) => s + c.amount_cents, 0);
    return (
      <>
        <View style={styles.secHeadFria}>
          <Txt role="label" tone="dim">
            De R$ {formatNum(escolhida.inicio)} a R$ {formatNum(escolhida.fim)} ·{" "}
            {escolhida.gente.length === 1 ? "1 pessoa" : `${escolhida.gente.length} pessoas`} · R${" "}
            {reais(soma)} no mês
          </Txt>
        </View>
        {escolhida.gente.map((c) => (
          <Pressable
            key={c.bond_id}
            style={styles.row}
            onPress={() =>
              navigation.navigate("Combinado", { token, timeName, pessoas: [pessoaDe(c)] })
            }
            accessibilityRole="button"
            accessibilityLabel={`${c.name}, R$ ${reais(c.amount_cents)}, vence dia ${c.due_day}. Abre o combinado.`}
          >
            <View style={styles.rowCopy}>
              <Txt role="body" numberOfLines={1}>
                {c.name}
              </Txt>
              <Txt role="note" tone="dim" style={styles.rowNote}>
                R$ {reais(c.amount_cents)} · vence dia {c.due_day}
              </Txt>
            </View>
            <IconChevron color={T.muted2} size={16} />
          </Pressable>
        ))}
        {/* Os dois toques são o par que esta tela já desenha em todo lugar onde grava
            dinheiro: a caixa fica com quem grava, e a saída é discreta. `AcaoDaLinha` traz
            a borda com o tom do aperto, o alvo de 44pt e o hitSlop que impede o vizinho de
            roubar o toque — reescrever isso aqui seria um terceiro botão do app. */}
        <Band rule="none">
          <View style={styles.portaRow}>
            <AcaoDaLinha
              rotulo={
                escolhida.gente.length === 1 ? "Ajustar" : `Ajustar as ${escolhida.gente.length}`
              }
              acessivel={`Ajustar o combinado de ${escolhida.gente.length} ${
                escolhida.gente.length === 1 ? "pessoa" : "pessoas"
              }`}
              onPress={() =>
                navigation.navigate("Combinado", {
                  token,
                  timeName,
                  pessoas: escolhida.gente.map(pessoaDe),
                })
              }
            />
            <AcaoDaLinha
              discreta
              rotulo="Voltar"
              acessivel="Voltar para as faixas de preço"
              onPress={() => setAberta(null)}
            />
          </View>
        </Band>
      </>
    );
  }

  const maior = Math.max(...faixas.map((f) => f.gente.length));
  // O teto de 18pt existe para "uma pessoa" nunca desenhar um bloco. Altura em PONTOS e não
  // em porcentagem: não há denominador, logo não há a classe de NaN que a fita em pé tinha.
  const degrau = Math.min(18, 72 / maior);

  return (
    <>
      <View style={styles.secHeadFria}>
        <Txt role="label" tone="dim">
          O que cada uma paga
        </Txt>
      </View>
      <Band rule="none">
        <View style={styles.escada}>
          {faixas.map((f, k) => {
            const corpo = (
              <>
                <Txt role="label" tone={f.gente.length ? undefined : "dim"} style={styles.centrado}>
                  {f.gente.length || ""}
                </Txt>
                <View style={styles.trilhoAlto}>
                  {f.gente.length > 0 ? (
                    <View
                      style={[
                        styles.barraDaFaixa,
                        { backgroundColor: T.ink, height: f.gente.length * degrau },
                      ]}
                    />
                  ) : null}
                </View>
                <Txt role="note" tone="dim" style={styles.centrado}>
                  {formatNum(f.inicio)}
                </Txt>
              </>
            );
            // A coluna vazia OCUPA o slot: o eixo de preço continua linear, e o buraco entre
            // dois lumps só se lê porque os vizinhos têm barra e ela não.
            if (f.gente.length === 0) {
              return (
                <View
                  key={f.inicio}
                  accessible
                  style={styles.faixaCol}
                  accessibilityLabel={`De R$ ${formatNum(f.inicio)} a R$ ${formatNum(f.fim)}, ninguém.`}
                >
                  {corpo}
                </View>
              );
            }
            return (
              <Pressable
                key={f.inicio}
                style={styles.faixaCol}
                onPress={() => setAberta(k)}
                accessibilityRole="button"
                accessibilityLabel={`De R$ ${formatNum(f.inicio)} a R$ ${formatNum(f.fim)}, ${
                  f.gente.length === 1 ? "1 pessoa" : `${f.gente.length} pessoas`
                }. Abre os nomes.`}
              >
                {corpo}
              </Pressable>
            );
          })}
        </View>
        <Txt role="note" tone="dim" style={styles.notaDaFita}>
          {frasesDaEscada(faixas, passo, ticketCents).join(" ")}
        </Txt>
      </Band>
    </>
  );
}

/** O que a rota do Combinado espera. A lista já veio no payload da Operação: converter é
 *  escolher campos, não buscar de novo. */
function pessoaDe(c: OwnerOperacao["combinados"][number]) {
  return {
    bond_id: c.bond_id,
    name: c.name,
    amount_cents: c.amount_cents,
    due_day: c.due_day,
  };
}

/** O PASSO sai de uma tabela, e nunca é indefinido. Seis colunas é o teto e quem decide é o
 *  dedo: 354pt úteis menos cinco vãos de 12 dá 49pt por coluna; com sete seriam 40,3 e
 *  furaria `ALVO.minimo`. Passo maior nunca mente, só perde resolução — e a prosa avisa
 *  quando perdeu. */
const PASSOS = [25, 50, 100, 250, 500, 1000, 2500];

type Faixa = { inicio: number; fim: number; gente: OwnerOperacao["combinados"] };

function faixasDePreco(combinados: OwnerOperacao["combinados"]): {
  passo: number;
  faixas: Faixa[];
} {
  // Em REAIS inteiros, para o passo sair legível: ninguém lê "faixas de R$ 5.000 em
  // centavos".
  const emReais = combinados.map((c) => Math.trunc(c.amount_cents / 100));
  const min = Math.min(...emReais);
  const max = Math.max(...emReais);
  const bruto = (max - min + 1) / 6;
  let passo = PASSOS.find((p) => p >= bruto) ?? Math.ceil(bruto / 2500) * 2500;
  let base = Math.floor(min / passo) * passo;
  let n = Math.ceil((max + 1 - base) / passo);
  // O ALINHAMENTO AO MÚLTIPLO custa uma coluna a mais quando o menor preço cai logo depois
  // de um degrau: 251 a 550 dá passo 50, base 250 e SETE faixas — 40,3pt cada, abaixo do
  // alvo de dedo. Sobe um degrau até caber. O passo dobra no fim da tabela, então `n` cai
  // sempre e o laço termina.
  while (n > 6) {
    passo = PASSOS.find((p) => p > passo) ?? passo * 2;
    base = Math.floor(min / passo) * passo;
    n = Math.ceil((max + 1 - base) / passo);
  }
  const faixas = Array.from({ length: n }, (_, k) => {
    const inicio = base + k * passo;
    const fim = inicio + passo - 1;
    return {
      inicio,
      fim,
      gente: combinados.filter((_, j) => emReais[j] >= inicio && emReais[j] <= fim),
    };
  });
  return { passo, faixas };
}

/** A prosa da escada: o passo, onde a média cai, o outlier quando existe, e o convite.
 *
 *  A MARCA DA MÉDIA — um traço atravessando o trilho — está cortada de propósito: é uma
 *  gridline, some por baixo da barra justamente quando a faixa da média é a mais alta (ou
 *  seja, quando a média NÃO está mentindo), não é tocável e não abre nada. A frase faz o
 *  mesmo trabalho em todos os canais. */
function frasesDaEscada(faixas: Faixa[], passo: number, ticketCents: number): string[] {
  const ocupadas = faixas.filter((f) => f.gente.length > 0);
  const frases = [`Faixas de R$ ${formatNum(passo)}.`];

  // Com uma faixa ocupada só, a média É o preço e dizer onde ela cai é ruído. É o dia em
  // que a média não mente, e a escada diz isso desenhando uma coluna só.
  const ticket = Math.trunc(ticketCents / 100);
  const daMedia = faixas.find((f) => ticket >= f.inicio && ticket <= f.fim);
  if (ocupadas.length > 1 && daMedia) {
    frases.push(
      `Sua média, R$ ${reais(ticketCents)}, cai na faixa de R$ ${formatNum(daMedia.inicio)}.`,
    );
  }

  // O OUTLIER que abre a régua: uma pessoa lá em cima, um vão embaixo dela, e as outras
  // espremidas numa faixa só. A escada não mente, mas fica muda — quem fala é a frase.
  const topo = ocupadas[ocupadas.length - 1];
  const k = faixas.indexOf(topo);
  if (ocupadas.length > 1 && topo.gente.length === 1 && k > 0 && faixas[k - 1].gente.length === 0) {
    const resto = faixas.flatMap((f) => (f === topo ? [] : f.gente)).map((c) => c.amount_cents);
    frases.push(
      `Uma pessoa em R$ ${reais(topo.gente[0].amount_cents)} abre a régua; as outras ${resto.length} estão entre R$ ${reais(Math.min(...resto))} e R$ ${reais(Math.max(...resto))}.`,
    );
  }

  frases.push("Toque uma faixa para ver quem está nela.");
  return frases;
}

/** "2026-06-01" -> "jun". */
function mesCurto(iso: string): string {
  return MESES[Number(iso.slice(5, 7)) - 1]?.slice(0, 3) ?? "";
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
  onDesfazer,
  recibo,
  ocupado,
  erro,
}: {
  risco: OwnerOperacao["risco"][number];
  token: string;
  timeName: string;
  onRecebi: () => void;
  onDesfazer: () => void;
  recibo?: string;
  ocupado: boolean;
  erro?: string;
}) {
  const styles = usarEstilos();
  const { T, errorInk } = useTema();
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
        // O toque é gravado ANTES de abrir o WhatsApp, e de propósito: depois de sair do
        // app não há retorno para gravar nada. É o registro que torna a fila falsificável —
        // sem ele, daqui a um ano ninguém sabe se ela acertou.
        // ponytail: falhar aqui erra para o lado seguro — sem registro, a pessoa CONTINUA
        // na fila (risco.go: `jaTocada`), que é o estado verdadeiro. Não há frase a dizer;
        // há uma rejeição a não deixar solta.
        void registrarToque(token, risco.person_id, risco.sinal).catch(() => {});
        // O rascunho é uma SAUDAÇÃO, nunca uma exigência: a frase de dinheiro é dele, e um
        // robô no meio estraga exatamente a relação que este produto vende.
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

  // CONFERIR, E NÃO RECEBI, quando ela já disse que pagou. O verbo é o mesmo que a linha
  // dela usa na lista de "Em aberto" 275pt abaixo — e o dedo dele faz a mesma coisa nas
  // duas: conferir se caiu. Enquanto o servidor não sabia de `ja_paguei`, esta linha dizia
  // "R$ 350 em aberto há 9 dias" sobre alguém que tinha respondido, e a mesma pessoa
  // aparecia duas vezes na mesma dobra dizendo coisas contrárias.
  const rotulo = recibo
    ? "Desfazer"
    : risco.sinal === "disse_que_pagou_e_sumico"
      ? "Conferir"
      : ROTULO_DA_ACAO[risco.acao];

  // A RAIZ é uma View, e só o bloco do nome é tocável.
  //
  // Era um Pressable envolvendo a linha inteira, com o botão de ação DENTRO. `Pressable`
  // marca `accessible` por padrão, e no iOS uma view acessível engole as subviews: [Recebi],
  // [Mandar] e [Publicar] — a ação na própria linha, que é o argumento inteiro deste eixo
  // contra a referência de mercado — não eram anunciados nem ativáveis pelo VoiceOver.
  // Sobrava a navegação, que é exatamente o que a doutrina condena. A LinhaEmAberto aqui do
  // lado já tinha a forma certa; esta agora copia.
  return (
    <View style={styles.row}>
      <Pressable
        onPress={abrirPessoa}
        accessibilityRole="button"
        accessibilityLabel={`${risco.name}. ${risco.motivo}`}
        accessibilityHint="Abre a pessoa"
        style={styles.riscoToque}
      >
        <Initials name={risco.name} size={34} />
        <View style={styles.rowCopy}>
          <Txt role="body" numberOfLines={1}>
            {risco.name}
          </Txt>
          <Txt
            role="note"
            tone={erro ? undefined : "dim"}
            color={erro ? errorInk : undefined}
            style={styles.rowNote}
          >
            {erro ?? (recibo ? `Recebi · ${recibo}` : risco.motivo)}
          </Txt>
        </View>
      </Pressable>
      {rotulo ? (
        <AcaoDaLinha
          rotulo={rotulo}
          busy={ocupado}
          onPress={recibo ? onDesfazer : agir}
          acessivel={`${rotulo}, ${risco.name}`}
        />
      ) : (
        <IconChevron color={T.muted2} size={16} />
      )}
    </View>
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
      <Band rule="none">
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

  // O SEGUNDO DIA: alunos entraram, nenhum valor combinado. Aqui o herói imprimia "R$ 0"
  // com o rótulo "recebido em agosto" — verdadeiro e inútil, porque não existe mês a contar
  // enquanto não existe combinado. A guarda de cima só cobria `com_mensalidade > 0`, ou
  // seja, protegia contra o zero em toda situação MENOS a que o produz de fábrica.
  // O que falta não é dinheiro: é o valor combinado. Então o topo é essa frase e a porta
  // que a resolve — a mesma que o rodapé desenha, e por isso o rodapé se cala (ver
  // `semCombinadoNoTopo` na tela).
  // Nada desenha: a porta do combinado, logo abaixo, sobe para o topo da dobra e é a
  // primeira e única coisa da tela.
  if (data.com_mensalidade === 0) return null;

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
  discreta,
}: {
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  rotulo: string;
  acessivel: string;
  /** SEM CAIXA. Numa linha com duas ações, duas caixas idênticas não dizem qual é a
   *  principal — e comem a largura do nome, que é a única coisa da linha que não se
   *  adivinha. Copiar o Pix é inócuo e repetível; registrar que o dinheiro entrou grava um
   *  fato. A caixa fica com quem grava. */
  discreta?: boolean;
}) {
  const styles = usarEstilos();
  const { T, MOTION } = useTema();
  const [down, setDown] = useState(false);
  const tone = useEdgeTone(down && !disabled, T.divider, T.ink, MOTION.press);
  return (
    <Pressable
      onPress={onPress}
      // `busy` NÃO desliga o Pressable, e `disabled` sozinho é quem desliga. Um leitor de
      // tela que ouve "desativado" enquanto a coisa está salvando entende que o toque não
      // pegou e toca de novo — o AccentCTA já tinha essa decisão escrita.
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={acessivel}
      accessibilityState={{ disabled: !!disabled, busy: !!busy }}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      // 4 e não 8: com a caixa em 44pt, dois botões vizinhos separados por 12pt de gap
      // tinham as áreas de toque SOBREPOSTAS em 4pt — e na faixa sobreposta vencia o
      // irmão desenhado por último. Era entre copiar um Pix (inócuo) e registrar que o
      // dinheiro entrou (grava e vai para a fita do mês).
      hitSlop={4}
    >
      <Animated.View
        style={[
          styles.pago,
          discreta ? styles.semCaixa : tone,
          !discreta && disabled && styles.off,
        ]}
      >
        {/* O VERBO FICA. Trocar o rótulo por "…" apaga a única palavra do botão por 300ms,
            e um botão que perde a própria palavra lê como quebrado, não como pensando. */}
        <Txt role="label" tone={busy || discreta ? "dim" : undefined}>
          {rotulo}
        </Txt>
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

/** A hora do recibo, no relógio de quem tocou: "08:12". */
function agora(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** O que o cardápio fez este mês, em prosa. Sem percentual: o personal quer saber quanto
 *  entrou de venda, não que 23% da receita é de produto. */
function resumoDoCardapio(produtos: OwnerOperacao["produtos"]): string {
  const mes = produtos.reduce((s, p) => s + p.recebido_mes_cents, 0);
  const aberto = produtos.reduce((s, p) => s + p.aberto_cents, 0);
  if (mes === 0 && aberto === 0) return "Nenhuma venda ainda.";
  const partes: string[] = [];
  if (mes > 0) partes.push(`R$ ${reais(mes)} este mês`);
  if (aberto > 0) partes.push(`R$ ${reais(aberto)} a receber`);
  return partes.join(" · ");
}

/** A CONCENTRAÇÃO em prosa, e não em percentual.
 *
 *  "11% do que você tem combinado" era o último percentual da tela, e percentual é a régua
 *  que esta tela recusa: ela não tem eixo, não tem faixa nomeada e não tem score. Um oitavo
 *  se lê sem contar casas, e é a mesma verdade.
 *
 *  Só chega aqui acima de 1000bps, então o denominador nunca passa de 10. */
const FRACOES = [
  "", "", "metade", "um terço", "um quarto", "um quinto",
  "um sexto", "um sétimo", "um oitavo", "um nono", "um décimo",
];

function fracaoPorExtenso(bps: number): string {
  const denominador = Math.round(10000 / bps);
  return FRACOES[denominador] ?? "um décimo";
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

/** O ATRASO EM PROSA, e a prosa arredonda.
 *
 *  "venceu há 400 dias" é verdade e é ilegível: ninguém lê quatrocentos dias, lê "mais de um
 *  ano". Precisão que o olho não usa é ruído, e uma linha de dinheiro com ruído é uma linha
 *  que o personal deixa de conferir.
 *
 *  A régua: dia a dia enquanto o dia importa (é a janela em que ele ainda liga e resolve),
 *  depois semana, depois mês, depois ano. */
function vencimento(dueDay: number, vencidoHa: number, venceuEm: string): string {
  if (vencidoHa < 0) return `vence dia ${dueDay}`;
  if (vencidoHa === 0) return "vence hoje";
  if (vencidoHa === 1) return "venceu ontem";
  // A PARTIR DE UMA SEMANA, A DATA. "venceu há 9 dias" não escreve mensagem nenhuma: ele
  // precisa dizer QUAL mensalidade, e o dia é o que a aluna reconhece. Dentro da semana o
  // decorrido ainda é mais legível que a data, e é ele que carrega a urgência.
  if (vencidoHa < 7) return `venceu há ${vencidoHa} dias`;
  if (venceuEm) return `venceu ${dataCurta(venceuEm)}`;
  if (vencidoHa < 60) return `venceu há ${Math.round(vencidoHa / 7)} semanas`;
  if (vencidoHa < 365) return `venceu há ${Math.round(vencidoHa / 30)} meses`;
  const anos = Math.floor(vencidoHa / 365);
  return anos === 1 ? "venceu há mais de um ano" : `venceu há mais de ${anos} anos`;
}

const usarEstilos = estilos(({ T, SPACE, FORMA, secundario }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    // A FAIXA DE SEÇÃO tem DOIS graus, e o esqueleto nunca some.
    //
    // Antes eram cinco faixas byte a byte idênticas — e idênticas também ao rótulo do botão
    // da linha, nos cinco canais (corpo, peso, tracking, caixa, cor). Nada dizia que "Vai
    // sumir" (o trabalho de agora) importa mais que "Meses fechados" (o retrovisor), e o
    // rótulo que explica POR QUE aqueles nomes estão ali era o quinto item que o olho lia.
    //
    // QUENTE é trabalho: tinta cheia, borda de 2pt, e o ar de um bloco antes.
    // FRIA é retrovisor: tinta apagada, fio de 1pt, e o ar de `room` — o degrau que o tema
    // define como "entre seções que não se pertencem" e que esta tela nunca usou.
    secHead: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.block,
      paddingBottom: SPACE.hair,
      borderBottomWidth: FORMA.borda,
      borderBottomColor: T.divider,
    },
    secHeadFria: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.room,
      paddingBottom: SPACE.hair,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
    },
    // O VAZIO é uma linha da lista, não um bloco: uma frase que informa que NÃO HÁ TRABALHO
    // não é dona da sobra da tela. Antes eram ~200pt de parágrafo em superfície levantada
    // com `grow` — a coisa mais imponente da tela no dia em que estava tudo certo.
    vazio: {
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      paddingHorizontal: T.pad,
      // 8 e nao 12: o botao agora traz 44pt de altura propria, entao o respiro da linha
      // desce e a linha inteira encurta de 68 para 60pt.
      paddingVertical: SPACE.hair,
      borderBottomWidth: FORMA.fio,
      // T.divider (3,44:1) e nao T.hairline (1,23:1). O separador entre duas PESSOAS era
      // o traco mais fraco da tela enquanto a borda de um botao era o mais forte.
      borderBottomColor: T.divider,
    },
    rowCopy: { flex: 1, minWidth: 0 },
    portaRow: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    // O alvo do "abrir a pessoa" na linha de risco: ele cresce, o botão de ação fica de
    // fora, e os dois são irmãos — que é o que devolve o botão ao leitor de tela.
    riscoToque: { flex: 1, flexDirection: "row", alignItems: "center", gap: SPACE.tight, minWidth: 0 },
    chaveDica: { marginTop: SPACE.hair / 2 },
    chaveCampo: { marginTop: SPACE.tight },
    chaveAcao: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    notaDoMes: { marginTop: SPACE.hair / 2 },
    barra: {
      flexDirection: "row",
      height: 10,
      marginTop: SPACE.step,
      borderRadius: FORMA.raio ? 5 : 0,
      overflow: "hidden",
      gap: 2,
    },
    // O piso de 3pt: um segmento que existe nunca desenha meio pixel.
    segmento: { minWidth: 3, height: "100%" },
    legenda: { flexDirection: "row", flexWrap: "wrap", gap: SPACE.tight, marginTop: SPACE.tight },
    verbete: { flexDirection: "row", alignItems: "center", gap: SPACE.hair },
    ponto: { width: 8, height: 8, borderRadius: 4 },
    // ponytail: 12/18/72 sao GEOMETRIA DE GRAFICO, nao respiro — nao entram na escala de
    // espaco, e por isso ficam em numero.
    //
    // A FITA DEITADA. Sem borda inferior e sem vao entre as linhas: uma regua a cada 44pt
    // cortaria a escada horizontalmente e competiria com a unica forma que a peca tem.
    mesLinha: {
      minHeight: ALVO.minimo,
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      paddingHorizontal: T.pad,
    },
    mesRotulo: { width: SPACE.block },
    mesValor: { textAlign: "right" },
    mesTrilho: { flex: 1, height: SPACE.tight },
    // O raio pergunta ao tema, ao contrario do literal de `styles.barra`.
    mesBarra: { borderRadius: FORMA.raioEm(SPACE.tight) },
    // A ESCADA. O 100% fica no TRILHO e o 56% na BARRA: a coluna inteira precisa ser o alvo
    // de 49pt, e o ar entre as barras e o que faz o olho CONTAR as faixas em vez de ler um
    // bloco branco so.
    escada: { flexDirection: "row", alignItems: "flex-end", gap: SPACE.tight },
    faixaCol: { flex: 1, alignItems: "center", gap: SPACE.hair },
    trilhoAlto: { width: "100%", height: 72, justifyContent: "flex-end", alignItems: "center" },
    barraDaFaixa: { width: "56%", borderRadius: FORMA.raioEm(SPACE.tight) },
    centrado: { textAlign: "center" },
    notaDaFita: { marginTop: SPACE.tight },
    grade: { flexDirection: "row", flexWrap: "wrap" },
    // Duas colunas fixas: os valores aqui são curtos por construção (o herói da dobra é
    // quem carrega o número grande), então a coluna não precisa negociar largura.
    celula: {
      width: "50%",
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.step,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.divider,
    },
    celulaValor: { marginTop: SPACE.hair / 2, marginBottom: SPACE.hair / 2 },
    rowNote: { marginTop: SPACE.hair / 2 },
    // O ALVO DE DEDO é `ALVO.minimo`, e o tema já o declarava: os botões que registram
    // dinheiro mediam 36pt, contra os 44 que theme.ts:1771 chama de trava mais importante.
    // A altura extra sai do padding da própria linha (12 -> 8), então a linha fica MAIS
    // curta e cabe mais gente na dobra.
    //
    // E a borda cai de `borda` (2pt) para `fio` (1pt): o botão mora DENTRO da linha, e o
    // tema escreve a lei em theme.ts — borda separa blocos, fio separa dentro do bloco.
    // Antes, o contorno do botão era 2,8× mais visível que o separador entre duas pessoas,
    // e a lista lia como um campo de caixinhas soltas em vez de uma lista.
    pago: {
      minHeight: ALVO.minimo,
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderRadius: FORMA.raioAcao,
      paddingHorizontal: SPACE.tight,
    },
    // DESLIGADO é a tinta descendo um degrau, nunca o botão inteiro em opacidade. Com
    // `opacity: 0.35` o rótulo caía para 1,78:1 — ilegível — e a fila inteira piscava para
    // o nada enquanto uma linha salvava, o que lê como defeito e não como estado. O
    // GhostCTA já tinha resolvido isso e escrito o porquê; aqui era a regra condenada.
    off: { borderColor: secundario(T.bg).desligada },
    // A ação discreta mantém os 44pt de alvo e perde a moldura: ela continua sendo do
    // tamanho do dedo, só não disputa a atenção com quem grava o fato.
    semCaixa: { borderWidth: 0, backgroundColor: "transparent" },
  }),
);
