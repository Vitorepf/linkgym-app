import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  configDoTime,
  dizerQueJaPaguei,
  minhaLoja,
  minhaMensalidade,
  desistirDoPedido,
  queroEsse,
  patchMe,
  progress,
  type ItemDaLoja,
  type MensalidadeDoAluno,
  type Person,
  type ProgressPayload,
  type Time,
} from "../../api";
import { CORES_DE_ROSTO, nomeDaCor } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Campo } from "../../ui/Campo";
import { escolherFoto } from "../../ui/foto";
import { formatNum } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconCheck } from "../../ui/Icons";
import { MetricGrid } from "../../ui/Metric";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  time: Time;
  onPersonChange: (next: Person) => void;
  onLeave: () => void;
};

/** A tela que MAIS destoava do resto do app, e o que mudou nesta costura:
 *    - era a única das trinta que não usava `Head`: cabeçalho próprio, com o nome em 22 px
 *      (degrau que não existe na escala) e a linha de baixo em 13 px SEM fontFamily — ou
 *      seja, em San Francisco/Roboto, no meio de um app inteiro em Archivo. Eram os quatro
 *      últimos blocos com fontSize e sem família do repositório.
 *    - tinha DUAS convenções de rótulo dentro dela mesma: um kicker acentuado e um mudo,
 *      ambos em 11 px/1,43 — e o resto do app escreve rótulo em `Txt role="label"`
 *      (12 px/1,3, mudo). Sobrou uma convenção, a do sistema.
 *    - a segunda célula da grade dizia "Recorde" e desenhava `ofensiva.current_count`: o
 *      MESMO número da célula ao lado, com outro nome. O payload não tem recorde de
 *      ofensiva, então a célula que mentia saiu e entrou o Protetor, que é dado real.
 *    - a barra "Quanto falta" media o selo de 4 semanas — o MESMO selo que a fila logo
 *      abaixo desenha, com outro nome e outra forma. A tela dizia duas vezes; ficou uma.
 *    - "Sair" era um rótulo em caixa alta sem moldura, do tamanho e do tom dos títulos de
 *      seção acima dele: lia como cabeçalho, não como saída. Virou o botão fantasma que o
 *      resto do app já usa para a ação que não é a principal.
 *
 *  ponytail: nenhuma peça nova. Head, Band, MetricGrid, GhostCTA, Initials e Txt já
 *  existiam — esta tela só não estava usando nenhum deles. */
const SELOS = [
  { key: "estreia", label: "Estreia", mark: "1" },
  { key: "ofensiva_4", label: "Semanas", mark: "4" },
  { key: "primeiro_pr", label: "PR", mark: "PR" },
  { key: "retomada", label: "Retomada", mark: "R" },
] as const;

export function Perfil({ token, person, time, onPersonChange, onLeave }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  // `acento(c).piece.fill` e não o hex cru `c`: era a única peça do app que pintava fora
  // do motor de tinta. No chão claro o quadrado mostrava o amarelo do cardápio e o avatar
  // que ele produz saía oliva — o seletor mentia sobre o próprio resultado.
  const { T, acento, errorInk } = useTema();
  const [data, setData] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState("");
  const [nome, setNome] = useState(person.name);
  const [busy, setBusy] = useState(false);
  // prévia imediata da foto que acabou de subir, antes de o /v1/me devolver a URL.
  const [fotoLocal, setFotoLocal] = useState("");

  const load = useCallback(async () => {
    try {
      const payload = await progress(token);
      setData(payload);
      setError("");
    } catch {
      setError("Não deu para abrir o perfil.");
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const cfg = configDoTime(time);
  const name = person.name.trim() || "Você";
  const nomeLimpo = nome.trim();
  const nomeDirty = nomeLimpo !== person.name && nomeLimpo !== "";

  // Foto e cor aplicam NO TOQUE — o combinado do produto é mudar em poucos toques.
  // Só o nome, que é digitação, pede o confirmar.
  async function foto() {
    if (busy) return;
    setBusy(true);
    try {
      const up = await escolherFoto(token, "avatar");
      if (up) {
        const mine = await patchMe(token, { avatar_object_key: up.objectKey });
        setFotoLocal(up.localUri);
        onPersonChange(mine.person);
        setError("");
      }
    } catch {
      setError("Não deu para subir a foto.");
    } finally {
      setBusy(false);
    }
  }

  async function corDeAvatar(c: string) {
    if (busy) return;
    setBusy(true);
    try {
      // escolher cor é escolher NÃO usar foto: os dois toques viram um estado só.
      const mine = await patchMe(token, { avatar_color: c, avatar_object_key: "" });
      setFotoLocal("");
      onPersonChange(mine.person);
      setError("");
    } catch {
      setError("Não deu para trocar o avatar.");
    } finally {
      setBusy(false);
    }
  }

  async function salvarNome() {
    if (!nomeDirty || busy) return;
    setBusy(true);
    try {
      const mine = await patchMe(token, { name: nomeLimpo });
      onPersonChange(mine.person);
      setError("");
    } catch {
      setError("Não deu para salvar o nome.");
    } finally {
      setBusy(false);
    }
  }
  const place = data ? data.league.findIndex((row) => row.me) + 1 : 0;
  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const ofensiva = data?.ofensiva.current_count ?? 0;

  return (
    <Phone>
      <Head
        kicker={time.name}
        kickerMuted
        title={name}
        right={
          <Avatar
            name={name}
            url={fotoLocal || person.avatar_url}
            color={person.avatar_color}
            fill
            size={54}
          />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.error}>
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
          </View>
        ) : null}

        {/* COMO VOCÊ APARECE: nome, foto e avatar — para o Fred e para a liga. Foto e
            cor aplicam no toque; o nome confirma porque é digitação. */}
        <Band rule="hair">
          <Txt role="label">Como você aparece</Txt>
          <View style={styles.editRow}>
            <Avatar
              name={nomeLimpo || name}
              url={fotoLocal || person.avatar_url}
              color={person.avatar_color}
              fill
              size={54}
            />
            <Campo
              label="Seu nome"
              hint="O nome que aparece para o personal e na liga"
              value={nome}
              onChangeText={setNome}
              placeholder={name}
              maxLength={40}
              style={styles.campo}
            />
          </View>
          <View style={styles.avatarRow}>
            <Pressable
              onPress={() => void foto()}
              accessibilityRole="button"
              accessibilityLabel="Subir uma foto"
              disabled={busy}
              style={styles.fotoBtn}
            >
              <Txt role="label">{busy ? "…" : "Foto"}</Txt>
            </Pressable>
            {/* AS DEZ, e a marca por DENTRO. Eram seis: as quatro últimas do cardápio
                (roxo, rosa, quase-branco, quase-preto) não renderizavam em lugar nenhum
                do app. E a seleção era um anel de `T.ink` em volta — que desaparece
                justamente na cor quase-branca, a única em que o aluno precisaria dele.
                A tinta de dentro vem do mesmo motor que pinta a peça, então ela existe
                sobre QUALQUER uma das dez, por construção. */}
            {CORES_DE_ROSTO.map((c) => (
              <Pressable
                key={c}
                onPress={() => void corDeAvatar(c)}
                accessibilityRole="button"
                accessibilityLabel={`Avatar na cor ${nomeDaCor(c)}`}
                accessibilityState={{ selected: person.avatar_color === c }}
                disabled={busy}
                hitSlop={6}
                style={[styles.corAvatar, { backgroundColor: acento(c).piece.fill }]}
              >
                {person.avatar_color === c && !person.avatar_url ? (
                  <IconCheck color={acento(c).piece.ink} size={20} />
                ) : null}
              </Pressable>
            ))}
          </View>
          {nomeDirty ? (
            <View style={styles.salvarNome}>
              <AccentCTA
                label="Salvar nome"
                onPress={() => void salvarNome()}
                busy={busy}
                check
              />
            </View>
          ) : null}
        </Band>

        <MinhaMensalidade token={token} timeName={time.name} />

        <Loja token={token} timeName={time.name} />

        {data ? (
          <>
            <MetricGrid
              cells={[
                {
                  label: "Ofensiva",
                  value: ofensiva,
                  note: "sessões seguidas",
                },
                {
                  label: "Protetor",
                  value: data.ofensiva.protector_available ? "1" : "—",
                  note: data.ofensiva.protector_available
                    ? "guardado"
                    : "gasto nesta ofensiva",
                },
                // XP e Liga respeitam a config do Time: célula que o personal desligou
                // não vira caixa vazia — some, e a grade re-flui (ausência é a marca).
                ...(cfg.xp
                  ? [{ label: "XP total", value: formatNum(data.xp_total) }]
                  : []),
                ...(cfg.liga !== "off"
                  ? [
                      {
                        label: "Liga",
                        value: place > 0 ? `${place}º` : "—",
                        note: time.name,
                      },
                    ]
                  : []),
              ]}
            />

            {/* A superfície dos selos CRESCE, e por isso o buraco de 120pt entre o botão
                Sair e a barra de abas deixou de existir: a sobra da rolagem é o respiro
                interno dela, não um vazio no chão nu depois do último traço. */}
            <Band raised grow rule="none">
              <Txt role="label">Selos</Txt>
              <View style={styles.selos}>
                {SELOS.map((selo) => {
                  const on = earned.has(selo.key);
                  return (
                    <View key={selo.key} style={styles.seloCol}>
                      {/* Selo não conquistado é AUSÊNCIA de tinta, nunca outro matiz:
                          moldura vazia contra caixa cheia. Era isso que estava escrito
                          aqui e não era isso que a tela desenhava — cheia e vazia usavam
                          a MESMA cor (`T.fill` nas duas), e sobre a superfície levantada
                          nenhuma das duas existia. Agora quem marca a conquista é a
                          presença da MARCA do personal. */}
                      <View
                        style={[
                          styles.selo,
                          on ? styles.seloOn : styles.seloOff,
                        ]}
                      >
                        <Txt role="body" tone="dim" color={on ? acento().piece.ink : undefined}>
                          {selo.mark}
                        </Txt>
                      </View>
                      <Txt
                        role="note"
                        tone={on ? "muted" : "dim"}
                        style={styles.seloLabel}
                        numberOfLines={1}
                      >
                        {selo.label}
                      </Txt>
                    </View>
                  );
                })}
              </View>
            </Band>
          </>
        ) : null}

        <View style={styles.leave}>
          <GhostCTA label="Sair" onPress={onLeave} fundo={T.bg} tom="perigo" />
        </View>
      </ScrollView>
    </Phone>
  );
}

/** O COMBINADO DELA, e o único verbo que ela tem sobre dinheiro.
 *
 *  A LEI desta peça, e ela é do domínio, não de estilo: esta linha NUNCA muda de tom. Nunca
 *  diz vencido, nunca diz atrasado, nunca diz em aberto, nunca fica vermelha, nunca vira
 *  push. Ela enuncia o combinado e oferece "já paguei". O app não cobra o aluno — quem cobra
 *  é o personal, com a frase dele, e um robô cobrando estraga exatamente a relação que este
 *  produto vende. O payload do servidor nem sequer TEM um campo de atraso, para que nenhuma
 *  tela futura consiga desenhar um.
 *
 *  Por que ela existe: a Operação inteira é aritmética sobre o personal lembrar de tocar
 *  "Recebi" 28 vezes por mês, para sempre. No terceiro mês ele para — e como "em aberto" é
 *  ausência de linha, o esquecimento dele fica indistinguível de calote e a tela passa a
 *  acusar a turma inteira. Ela é a única outra pessoa do sistema com incentivo próprio de
 *  corrigir isso: quem pagou não quer aparecer devendo. O que ela diz não marca nada — vira
 *  um nome no topo da lista dele, para o dedo dele confirmar. */
function MinhaMensalidade({ token, timeName }: { token: string; timeName: string }) {
  const styles = usarEstilos();
  const { FORMA } = useTema();
  const [m, setM] = useState<MensalidadeDoAluno | null>(null);
  const [dizendo, setDizendo] = useState(false);

  useEffect(() => {
    let vivo = true;
    minhaMensalidade(token)
      .then((got) => vivo && setM(got))
      .catch(() => {
        /* sem combinado, sem bloco: dinheiro não é assunto do ritual dela */
      });
    return () => {
      vivo = false;
    };
  }, [token]);

  async function dizer() {
    if (dizendo || !m) return;
    setDizendo(true);
    try {
      await dizerQueJaPaguei(token);
      setM({ ...m, ja_disse: true });
    } catch {
      /* silêncio: falar de novo depois não custa nada, e um erro aqui não é dela */
    } finally {
      setDizendo(false);
    }
  }

  // Sem combinado digitado, ou mês já fechado pelo personal: a peça não existe. Não desenhar
  // é a resposta certa — não há placeholder de dinheiro na tela de quem treina.
  if (!m || m.valor_cents === null || m.due_day === null || m.recebido) return null;

  return (
    <Band rule="hair">
      <Txt role="label">Do {timeName}</Txt>
      <Txt role="body" style={styles.mensalidade}>
        R$ {reaisDoAluno(m.valor_cents)} por mês, todo dia {m.due_day}.
      </Txt>
      {m.ja_disse ? (
        <Txt role="note" tone="dim" style={styles.avisado}>
          Avisado. Ele confirma quando vir.
        </Txt>
      ) : (
        <View style={styles.avisado}>
          <GhostCTA
            label={dizendo ? "…" : "Já paguei"}
            fundo={FORMA.folha.peca.composto}
            onPress={() => void dizer()}
          />
        </View>
      )}
    </Band>
  );
}

/** A LOJA — e o que ela NÃO é.
 *
 *  Não tem busca, filtro, categoria, ordenação nem carrinho: é a lista do que o personal
 *  DELA vende, com um verbo por linha. Vinte e oito alunos não são um marketplace, e uma
 *  vitrine dentro de um app de treino não é navegada — ela também TIRA o personal da
 *  transação, e o personal dentro da transação é o produto inteiro.
 *
 *  Mora no PERFIL, nunca na Hoje. A Hoje é o ritual, e o ritual é o único lugar onde "isto
 *  pertence aqui?" não se responde com medidor: quando o medidor acusar, já custou a
 *  confiança de quem abriu o app para treinar.
 *
 *  E o verbo não é COMPRAR. Ela não paga aqui, não escolhe forma de pagamento e não recebe
 *  cobrança nenhuma: ela diz "quero", e isso vira um nome na tela dele. Quem fecha é o dedo
 *  do personal, com a frase dele — a mesma lei do "já paguei". */
function Loja({ token, timeName }: { token: string; timeName: string }) {
  const styles = usarEstilos();
  const { FORMA } = useTema();
  const [itens, setItens] = useState<ItemDaLoja[]>([]);
  const [pedindo, setPedindo] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    minhaLoja(token)
      .then((r) => vivo && setItens(r.items))
      .catch(() => {
        /* sem loja, sem bloco: o personal dela não vende nada além da mensalidade */
      });
    return () => {
      vivo = false;
    };
  }, [token]);

  async function quero(id: string) {
    if (pedindo) return;
    setPedindo(id);
    try {
      await queroEsse(token, id);
      setItens((l) => l.map((i) => (i.produto_id === id ? { ...i, ja_pedi: true } : i)));
    } catch {
      /* silêncio: pedir de novo depois não custa nada, e o erro não é dela */
    } finally {
      setPedindo(null);
    }
  }

  /** O DESFAZER, e ele é o que torna o toque de cima aceitável.
   *
   *  "Assinar" numa marmita criava uma dívida MENSAL RECORRENTE com um toque, sem
   *  confirmação, e o botão virava "Assinado" e acabava: um dedo errado no rodapé do Perfil
   *  comprometia ela com um valor todo mês, e o caminho de volta não existia — nem aqui, nem
   *  na tela dele. A casa recusa diálogo de confirmação ("confirmação em toda ação é o que
   *  faz app parecer formulário"), e a saída que ela prescreve é esta: o desfazer É a
   *  confirmação.
   *
   *  Vale enquanto nada foi recebido. Depois disso o servidor não desfaz, e a linha volta
   *  ao estado dela sozinha — o dinheiro na mão dele é fato, e fato não se apaga por aqui. */
  async function desisto(id: string) {
    if (pedindo) return;
    setPedindo(id);
    try {
      await desistirDoPedido(token, id);
      setItens((l) => l.map((i) => (i.produto_id === id ? { ...i, ja_pedi: false } : i)));
    } catch {
      /* silêncio: a linha continua como estava, que é a verdade */
    } finally {
      setPedindo(null);
    }
  }

  // Sem produto no cardápio dele, a peça não existe. Não desenhar é a resposta certa.
  if (itens.length === 0) return null;

  return (
    <Band rule="hair">
      {/* Rótulo próprio: o bloco da mensalidade logo acima também diz "Do Fred", e duas
          faixas iguais seguidas leem como uma peça repetida. */}
      <Txt role="label">{timeName} também vende</Txt>
      {itens.map((i) => (
        <View key={i.produto_id} style={styles.itemDaLoja}>
          <View style={styles.itemCopy}>
            <Txt role="body" numberOfLines={1}>
              {i.nome}
            </Txt>
            <Txt role="note" tone="dim">
              R$ {reaisDoAluno(i.preco_cents)}
              {i.tipo === "assinatura" ? " por mês" : ""}
              {i.sessoes ? ` · ${i.sessoes} sessões` : ""}
            </Txt>
          </View>
          {/* ASSINAR É OUTRO VERBO, e o botão tem que dizer o que vai acontecer. "Quero"
              numa marmita que repete todo mês esconde que o toque combina um valor MENSAL,
              e o rótulo depois do toque ("Pedido") diria que aconteceu uma compra única —
              enquanto o que existe do outro lado é uma assinatura que repete. */}
          {i.ja_pedi ? (
            <GhostCTA
              label={
                pedindo === i.produto_id
                  ? "…"
                  : i.tipo === "assinatura"
                    ? "Assinado"
                    : "Pedido"
              }
              fundo={FORMA.folha.peca.composto}
              onPress={() => void desisto(i.produto_id)}
            />
          ) : (
            <GhostCTA
              label={
                pedindo === i.produto_id
                  ? "…"
                  : i.tipo === "assinatura"
                    ? "Assinar"
                    : "Quero"
              }
              fundo={FORMA.folha.peca.composto}
              onPress={() => void quero(i.produto_id)}
            />
          )}
        </View>
      ))}
    </Band>
  );
}

/** Centavos em prosa: inteiro limpo, quebrado com vírgula. */
function reaisDoAluno(cents: number): string {
  const resto = cents % 100;
  const inteiro = Math.trunc(cents / 100).toLocaleString("pt-BR");
  return resto ? `${inteiro},${String(resto).padStart(2, "0")}` : inteiro;
}

const usarEstilos = estilos(({ T, SPACE, FONTES, FORMA, acento }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    error: { paddingHorizontal: T.pad, paddingTop: SPACE.tight },
    retry: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    mensalidade: { marginTop: SPACE.hair },
    itemDaLoja: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    itemCopy: { flex: 1, minWidth: 0 },
    avisado: { marginTop: SPACE.tight, alignSelf: "flex-start" },

    editRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    campo: { flex: 1 },
    avatarRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    fotoBtn: {
      // O alvo do dedo sai do TEMA, não da soma do padding com a linha do rótulo: assim
      // media 33,5 — abaixo do piso de 44 — encostado num vizinho de 34 que paga hitSlop
      // de 6 e chega a 46. Dois botões da mesma fila com alvos diferentes é o defeito.
      minHeight: FORMA.alturaChip,
      justifyContent: "center",
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      paddingVertical: 8,
      paddingHorizontal: SPACE.tight,
      borderRadius: FORMA.raioAcao,
    },
    corAvatar: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(34),
    },
    salvarNome: { marginTop: SPACE.tight },

    selos: { flexDirection: "row", gap: SPACE.hair, marginTop: SPACE.tight },
    seloCol: { flex: 1 },
    selo: {
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    // Conquistado é a peça da marca (o motor garante a tinta em cima e o piso contra os
    // quatro fundos); não conquistado é o anel de `divider`, que é o token cujo contrato
    // é justamente existir a 3:1 em qualquer um dos quatro. `T.fill` na moldura media
    // 1,23:1 sobre a superfície levantada — moldura que não moldurava nada.
    seloOn: { backgroundColor: acento().piece.fill },
    seloOff: { borderWidth: FORMA.borda, borderColor: T.divider },
    seloLabel: { marginTop: SPACE.hair },

    leave: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.block,
      paddingBottom: SPACE.step,
    },
  }),
);
