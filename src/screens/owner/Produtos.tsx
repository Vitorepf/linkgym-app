import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  criarProduto,
  modelosDeProduto,
  pausarProduto,
  type ModeloDeProduto,
  type Produto,
} from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron } from "../../ui/Icons";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";
import { centavosDe } from "./Combinado";

/** O QUE ELE VENDE.
 *
 *  O pedido era criar produto "em pouquíssimos cliques, da forma mais simples possível", com
 *  loja de suplemento e assinatura de marmita como exemplos. A resposta NÃO é um formulário
 *  em branco com tipo, categoria, foto, variante e frete — formulário em branco às 22h é
 *  onde a maioria desiste.
 *
 *  É um CARDÁPIO. Ele toca "Whey protein", digita 219, e acabou: quatro toques e um campo. O
 *  tipo vem junto com a linha do cardápio, porque quem escolhe "Marmita fitness" já disse
 *  que aquilo repete todo mês — perguntar de novo é fazer o app parecer um formulário de
 *  banco.
 *
 *  QUATRO TIPOS, fechados, e eles não são taxonomia: são os três comportamentos que o
 *  dinheiro tem, mais a entrega. Repete todo mês; carrega saldo contável; acontece uma vez;
 *  chega na mão dela. O quinto tipo que alguém pedir é sinal de que a lista está errada, não
 *  de que falta um.
 *
 *  ESTOQUE NÃO EXISTE, e a ausência é a decisão. Quantidade exige decremento atômico,
 *  reserva e a pergunta "o que acontece quando dois compram o último" — e o personal que tem
 *  quatro potes de whey no porta-malas resolve isso pausando o produto num toque. `ativo` é
 *  o estoque dele. */
type Props = {
  token: string;
  timeName: string;
  produtos: Produto[];
};

const ROTULO_DO_TIPO: Record<Produto["tipo"], string> = {
  assinatura: "todo mês",
  pacote: "pacote",
  avulso: "avulso",
  fisico: "entrega",
};

export function Produtos({ token, timeName, produtos }: Props) {
  const styles = usarEstilos();
  const navigation = useNavigation<OwnerTabNavigation>();
  const { FORMA, errorInk, T } = useTema();
  const [modelos, setModelos] = useState<ModeloDeProduto[]>([]);
  const [escolhido, setEscolhido] = useState<ModeloDeProduto | null>(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  // Quantas sessões o pacote carrega. Vem do modelo quando há modelo, e é digitado quando
  // ele está criando um pacote que o cardápio não previu.
  const [sessoes, setSessoes] = useState("");
  const [tiposAbertos, setTiposAbertos] = useState(false);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState("");
  const [lista, setLista] = useState(produtos);

  useFocusEffect(
    useCallback(() => {
      modelosDeProduto(token)
        .then((r) => setModelos(r.items))
        .catch(() => setErro("Não deu para abrir o cardápio."));
    }, [token]),
  );

  function escolher(m: ModeloDeProduto) {
    setEscolhido(m);
    // O NOME JÁ VEM PREENCHIDO. É o ponto inteiro do cardápio: ele confere e digita o preço.
    // Quem vende "Whey Growth 900g" corrige o nome; quem vende whey não digita nada.
    setNome(m.nome);
    setPreco("");
    setSessoes(m.sessoes ? String(m.sessoes) : "");
    setErro("");
  }

  /** O QUANTO do pacote. Fora do pacote não existe, e dentro dele é obrigatório: um "pacote
   *  de sessões" sem quantas é um produto que ninguém sabe consumir — a API recusa, e recusar
   *  depois do toque é pior que não deixar tocar. */
  const quantasSessoes = escolhido?.tipo === "pacote" ? Number(sessoes) || 0 : 0;
  const faltaSessoes = escolhido?.tipo === "pacote" && quantasSessoes <= 0;

  async function criar() {
    const cents = centavosDe(preco);
    if (!escolhido || cents === null || !nome.trim() || criando) return;
    setCriando(true);
    setErro("");
    try {
      const novo = await criarProduto(token, {
        tipo: escolhido.tipo,
        nome: nome.trim(),
        preco_cents: cents,
        sessoes: escolhido.tipo === "pacote" ? quantasSessoes : null,
      });
      setLista((l) => [...l, novo]);
      setEscolhido(null);
      setNome("");
      setPreco("");
      setSessoes("");
      setTiposAbertos(false);
    } catch {
      setErro(`Não deu para criar. Já existe algo chamado "${nome.trim()}"?`);
    } finally {
      setCriando(false);
    }
  }

  async function alternar(p: Produto) {
    try {
      await pausarProduto(token, p.id, !p.ativo);
      setLista((l) => l.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)));
    } catch {
      setErro("Não deu para mudar. O produto continua como estava.");
    }
  }

  return (
    <Phone>
      <Head
        kicker={timeName}
        kickerMuted
        title="O que você vende"
        body="Fora a mensalidade. Escolha uma linha, digite o preço, e ele fica no cardápio."
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {escolhido ? (
          <Band raised rule="hair">
            <Txt role="label">{escolhido.nota}</Txt>
            <Campo
              label="Nome"
              rotulo
              value={nome}
              onChangeText={setNome}
              maxLength={60}
              style={styles.campo}
            />
            {escolhido.tipo === "pacote" ? (
              <Campo
                label="Quantas sessões"
                rotulo
                placeholder="10"
                keyboardType="number-pad"
                value={sessoes}
                onChangeText={setSessoes}
                style={styles.campoCurto}
              />
            ) : null}
            <Campo
              label="Preço"
              rotulo
              nota={quantasSessoes > 0 ? `${quantasSessoes} sessões, no total` : undefined}
              placeholder="219"
              keyboardType="decimal-pad"
              value={preco}
              onChangeText={setPreco}
              style={styles.campoCurto}
            />
            {erro ? (
              <Txt role="note" color={errorInk} style={styles.campo}>
                {erro}
              </Txt>
            ) : null}
            <View style={styles.acaoDupla}>
              <AccentCTA
                label="Criar"
                busy={criando}
                disabled={centavosDe(preco) === null || !nome.trim() || faltaSessoes}
                quiet
                onPress={() => void criar()}
              />
              <GhostCTA
                label="Voltar ao cardápio"
                fundo={FORMA.folha.peca.composto}
                onPress={() => setEscolhido(null)}
              />
            </View>
          </Band>
        ) : (
          <>
            {lista.length > 0 ? (
              <>
                <View style={styles.secHead}>
                  <Txt role="label">Seu cardápio · {lista.length}</Txt>
                </View>
                {lista.map((p) => (
                  <View key={p.id} style={styles.row}>
                    <View style={styles.rowCopy}>
                      <Txt role="body" numberOfLines={1} tone={p.ativo ? undefined : "dim"}>
                        {p.nome}
                      </Txt>
                      <Txt role="note" tone="dim" style={styles.rowNote}>
                        R$ {reaisDoProduto(p.preco_cents)} · {ROTULO_DO_TIPO[p.tipo]}
                        {p.vendidos > 0
                          ? ` · ${p.vendidos} ${p.vendidos === 1 ? "venda" : "vendas"}`
                          : ""}
                        {p.ativo ? "" : " · pausado"}
                      </Txt>
                    </View>
                    <Pressable
                      onPress={() => void alternar(p)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        p.ativo ? `Pausar ${p.nome}` : `Voltar a vender ${p.nome}`
                      }
                      hitSlop={8}
                    >
                      <Txt role="label" tone="dim">
                        {p.ativo ? "Pausar" : "Voltar"}
                      </Txt>
                    </Pressable>
                  </View>
                ))}
              </>
            ) : null}

            <View style={styles.secHead}>
              <Txt role="label">
                {lista.length > 0 ? "Criar mais um" : "O cardápio"}
              </Txt>
            </View>
            {/* O cardápio é a tela de criação. Sem ele, criar produto é um formulário em
                branco com um seletor de tipo — e ninguém sabe qual tipo é o dele. */}
            {/* O modelo que ele JÁ criou sai do cardápio: "Marmita fitness" aparecendo na
                lista dele e logo abaixo como sugestão é a tela oferecendo o que ela mesma
                acabou de mostrar que existe. */}
            {modelos
              .filter(
                (m) =>
                  !lista.some(
                    (p) => p.nome.trim().toLowerCase() === m.nome.trim().toLowerCase(),
                  ),
              )
              .map((m) => (
              <Pressable
                key={m.nome}
                onPress={() => escolher(m)}
                accessibilityRole="button"
                accessibilityLabel={`Criar ${m.nome}. ${m.nota}`}
                style={styles.row}
              >
                <View style={styles.rowCopy}>
                  <Txt role="body">{m.nome}</Txt>
                  <Txt role="note" tone="dim" style={styles.rowNote}>
                    {m.nota}
                  </Txt>
                </View>
                <IconChevron color={T.muted2} size={16} />
              </Pressable>
            ))}

            {/* O CARDÁPIO ACABA, E ELE NÃO. Os modelos que ele já criou saem da lista, então
                depois do sétimo a seção "Criar mais um" ficava VAZIA e não existia mais
                caminho nenhum para criar produto — num app cujo pedido escrito era "qualquer
                tipo de produto". O cardápio continua sendo a porta principal (é ele que faz o
                dedo parar de digitar); esta é a porta que faltava ao lado dela.

                Os quatro tipos saem dos próprios modelos, e não de uma cópia aqui: a palavra
                que descreve cada tipo é decidida no servidor (internal/owner/produto.go), e
                uma segunda lista aqui seria a mesma taxonomia com duas redações. */}
            <Pressable
              onPress={() => setTiposAbertos((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: tiposAbertos }}
              accessibilityLabel="Criar outra coisa, escolhendo o tipo"
              style={styles.row}
            >
              <View style={styles.rowCopy}>
                <Txt role="body">Outra coisa</Txt>
                <Txt role="note" tone="dim" style={styles.rowNote}>
                  Você escolhe o tipo e escreve o nome.
                </Txt>
              </View>
              <IconChevron color={T.muted2} size={16} />
            </Pressable>
            {tiposAbertos
              ? tiposDeProduto(modelos).map((t) => (
                  <Pressable
                    key={t.tipo}
                    onPress={() => escolher({ tipo: t.tipo, nome: "", sessoes: null, nota: t.nota })}
                    accessibilityRole="button"
                    accessibilityLabel={`Criar do zero: ${t.nota}`}
                    style={[styles.row, styles.rowDentro]}
                  >
                    <View style={styles.rowCopy}>
                      <Txt role="body">{t.nota}</Txt>
                    </View>
                    <IconChevron color={T.muted2} size={16} />
                  </Pressable>
                ))
              : null}

            {erro && !escolhido ? (
              <Band rule="none">
                <Txt role="body" color={errorInk}>
                  {erro}
                </Txt>
              </Band>
            ) : null}
          </>
        )}
      </ScrollView>

      <DockFooter>
        <GhostCTA
          label="Voltar"
          onPress={() => navigation.goBack()}
          fundo={FORMA.folha.chrome.composto}
        />
      </DockFooter>
    </Phone>
  );
}

/** OS QUATRO TIPOS, deduzidos dos modelos. Cada tipo aparece uma vez, com a palavra que o
 *  servidor usa para descrevê-lo — nunca o nome do enum, que é vocabulário de tabela.
 *  Uma segunda lista aqui seria a mesma taxonomia com duas redações. */
function tiposDeProduto(
  modelos: ModeloDeProduto[],
): { tipo: ModeloDeProduto["tipo"]; nota: string }[] {
  const vistos = new Set<string>();
  const out: { tipo: ModeloDeProduto["tipo"]; nota: string }[] = [];
  for (const m of modelos) {
    if (vistos.has(m.tipo)) continue;
    vistos.add(m.tipo);
    out.push({ tipo: m.tipo, nota: m.nota });
  }
  return out;
}

function reaisDoProduto(cents: number): string {
  const resto = cents % 100;
  const inteiro = Math.trunc(cents / 100).toLocaleString("pt-BR");
  return resto ? `${inteiro},${String(resto).padStart(2, "0")}` : inteiro;
}

const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    campo: { marginTop: SPACE.tight },
    campoCurto: { marginTop: SPACE.tight, width: 140 },
    acaoDupla: { marginTop: SPACE.tight, gap: SPACE.tight, alignSelf: "flex-start" },
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
      paddingVertical: 14,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    rowCopy: { flex: 1, minWidth: 0 },
    rowNote: { marginTop: 2 },
    // O recuo diz que estas quatro linhas pertencem à de cima, e não ao cardápio: um degrau
    // de `block` (27) contra o `pad` (18) das outras, e é o mesmo recuo que a lista aberta
    // usa em qualquer lugar do app.
    rowDentro: { paddingLeft: SPACE.block + T.pad - 18 },
  }),
);
