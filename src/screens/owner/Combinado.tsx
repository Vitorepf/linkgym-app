import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { definirMensalidade } from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { Initials } from "../../ui/Initials";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";

/** O COMBINADO: quanto cada aluno paga, e em que dia.
 *
 *  Esta tela não existia. A rota `PUT /v1/owner/mensalidades/{bond_id}` estava roteada e
 *  implementada desde a migration 00006, e nenhuma linha do app a chamava — enquanto o
 *  rodapé da Operação escrevia "N sem valor combinado ainda. O combinado se digita uma vez,
 *  na pessoa" e mandava o personal a um lugar que não ficava em lugar nenhum. Os quatro
 *  números da Operação são aritmética sobre este dado: sem ele, aquela tela era um
 *  relatório sobre uma coisa que o app não sabia criar.
 *
 *  NASCE EM LOTE, e essa é a decisão. Um estúdio de 28 alunos com preço de tabela não tem
 *  28 combinados: tem UM combinado e 28 vínculos. Cadastrar um por vez são 28 idas e
 *  voltas, e é a diferença entre o personal experimentar com três e cadastrar a turma. É
 *  também a primeira tela do produto em que a caixa de edição fica sobre NOMES — a regra
 *  que `docs/barra/eixo2-operacao-personal/NOTAS.md` §2 escreve como o que a referência
 *  de mercado erra: lá o lote só serve para arquivar aviso, nunca para atender pessoas.
 *
 *  Não há rota de lote transacional, de propósito. Falha parcial é um estado legítimo: a
 *  linha que falhou fica com a borda de aviso e o valor digitado preservado, e o botão
 *  passa a oferecer só as que faltam. Uma transação de 28 escritas que volta atrás inteira
 *  porque a 27ª caiu faria o personal redigitar 26 valores certos. */
type Pessoa = {
  bond_id: string;
  name: string;
  /** o que já está combinado, quando já está. A linha nasce com ele, e o "mesmo valor
   *  para todos" nunca o sobrescreve sem toque — corrigir é ato deliberado. */
  amount_cents?: number;
  due_day?: number;
};

export type CombinadoRoute = {
  token: string;
  timeName: string;
  pessoas: Pessoa[];
};

/** Centavos para o que se digita: "350" ou "350,50". Vazio vira vazio, não zero — campo em
 *  branco é "não combinei", e R$ 0,00 é um combinado de graça. */
function paraCampo(cents?: number): string {
  if (cents === undefined) return "";
  const resto = cents % 100;
  return resto
    ? `${Math.trunc(cents / 100)},${String(resto).padStart(2, "0")}`
    : String(Math.trunc(cents / 100));
}

/** O que o dedo digitou, em centavos. Aceita vírgula e ponto porque o teclado numérico do
 *  iOS oferece os dois e ninguém lembra qual é o certo. `null` = não dá para guardar. */
export function centavosDe(texto: string): number | null {
  const limpo = texto.trim().replace(/\s/g, "").replace(".", ",");
  if (!limpo) return null;
  if (!/^\d{1,7}(,\d{0,2})?$/.test(limpo)) return null;
  const [inteiro, decimal = ""] = limpo.split(",");
  const cents = Number(inteiro) * 100 + Number(decimal.padEnd(2, "0"));
  return cents > 0 ? cents : null;
}

/** O dia do vencimento existe em TODO mês civil: 29, 30 e 31 não são dia de vencimento,
 *  são casos especiais de fevereiro. O schema já recusa desde 00006; aqui a recusa é antes
 *  da viagem, para o personal ver o erro no campo e não numa faixa vermelha. */
export function diaDe(texto: string): number | null {
  const n = Number(texto.trim());
  return Number.isInteger(n) && n >= 1 && n <= 28 ? n : null;
}

type Linha = { valor: string; dia: string; falhou: boolean };

export function Combinado({ token, timeName, pessoas }: CombinadoRoute) {
  const styles = usarEstilos();
  const navigation = useNavigation<OwnerTabNavigation>();
  const { errorInk, FORMA } = useTema();
  const lote = pessoas.length > 1;

  // O dia que a turma já usa manda no palpite. Numa turma sem nenhum combinado é 5, que é
  // o dia seguinte ao pagamento da maioria dos salários no Brasil.
  const diaPadrao = useMemo(() => {
    const contagem = new Map<number, number>();
    for (const p of pessoas) {
      if (p.due_day) contagem.set(p.due_day, (contagem.get(p.due_day) ?? 0) + 1);
    }
    let melhor = 5;
    let max = 0;
    for (const [dia, n] of contagem) {
      if (n > max) {
        melhor = dia;
        max = n;
      }
    }
    return String(melhor);
  }, [pessoas]);

  const [linhas, setLinhas] = useState<Record<string, Linha>>(() =>
    Object.fromEntries(
      pessoas.map((p) => [
        p.bond_id,
        {
          valor: paraCampo(p.amount_cents),
          dia: p.due_day ? String(p.due_day) : diaPadrao,
          falhou: false,
        },
      ]),
    ),
  );
  const [todosValor, setTodosValor] = useState("");
  const [todosDia, setTodosDia] = useState(diaPadrao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function editar(bondId: string, campo: "valor" | "dia", texto: string) {
    setLinhas((atual) => ({
      ...atual,
      [bondId]: { ...atual[bondId], [campo]: texto, falhou: false },
    }));
  }

  /** "Mesmo valor para todos" preenche quem está EM BRANCO e quem falhou. Não pisa em
   *  quem já tem combinado nem em quem o personal acabou de digitar diferente: o lote é
   *  para o preço de tabela, e a exceção é justamente o que ele não pode apagar. */
  function aplicarEmTodos() {
    setLinhas((atual) => {
      const proximo = { ...atual };
      for (const p of pessoas) {
        const linha = proximo[p.bond_id];
        const jaTem = p.amount_cents !== undefined;
        if (!jaTem && !linha.valor.trim()) {
          proximo[p.bond_id] = { ...linha, valor: todosValor, dia: todosDia, falhou: false };
        }
      }
      return proximo;
    });
  }

  const prontas = pessoas.filter((p) => {
    const l = linhas[p.bond_id];
    return centavosDe(l.valor) !== null && diaDe(l.dia) !== null;
  });
  const invalidas = pessoas.filter((p) => {
    const l = linhas[p.bond_id];
    const vazia = !l.valor.trim() && !l.dia.trim();
    return !vazia && (centavosDe(l.valor) === null || diaDe(l.dia) === null);
  });

  async function guardar() {
    if (salvando || prontas.length === 0) return;
    setSalvando(true);
    setErro("");
    // Em paralelo: são N escritas independentes numa rota idempotente (ON CONFLICT DO
    // UPDATE). Serial custaria N vezes a latência da academia, que é onde o personal está.
    const resultados = await Promise.all(
      prontas.map(async (p) => {
        const l = linhas[p.bond_id];
        try {
          await definirMensalidade(token, p.bond_id, {
            amount_cents: centavosDe(l.valor) as number,
            due_day: diaDe(l.dia) as number,
          });
          return { bond: p.bond_id, ok: true };
        } catch {
          return { bond: p.bond_id, ok: false };
        }
      }),
    );
    const caidas = resultados.filter((r) => !r.ok).map((r) => r.bond);
    setSalvando(false);
    if (caidas.length === 0) {
      // Sem callback de volta: a Operação recarrega sozinha no foco (useFocusEffect), e
      // um callback em parâmetro de rota é estado que não sobrevive a um restore.
      navigation.goBack();
      return;
    }
    // O valor digitado NÃO some. A linha marca que caiu e o botão passa a oferecer só o
    // que falta — redigitar 26 valores certos por causa da 27ª é o que a transação faria.
    setLinhas((atual) => {
      const proximo = { ...atual };
      for (const bond of caidas) proximo[bond] = { ...proximo[bond], falhou: true };
      return proximo;
    });
    setErro(
      caidas.length === 1
        ? "Uma não foi. O que você digitou está guardado aqui."
        : `${caidas.length} não foram. O que você digitou está guardado aqui.`,
    );
  }

  const caidas = pessoas.filter((p) => linhas[p.bond_id].falhou);
  // O rótulo conta o que EXISTE. "Guardar os 0" era o botão anunciando o próprio vazio —
  // com nada digitado ele volta a ser só o nome da ação, e o desligado já diz o resto.
  const rotulo = caidas.length
    ? caidas.length === 1
      ? "Tentar de novo"
      : `Tentar as ${caidas.length}`
    : lote && prontas.length > 1
      ? `Guardar os ${prontas.length}`
      : "Guardar";

  return (
    <Phone>
      <Head
        kicker={lote ? `${pessoas.length} sem valor` : timeName}
        kickerMuted
        title="O combinado"
        body="Quanto cada um paga, e em que dia. Digita uma vez; dá para corrigir depois."
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {lote ? (
          <Band rule="hair">
            <Txt role="label">Mesmo valor para todos</Txt>
            <Txt role="note" tone="dim" style={styles.dica}>
              Preenche quem está em branco. Quem paga diferente, você ajusta na linha.
            </Txt>
            <View style={styles.par}>
              <Campo
                label="Valor para todos"
                placeholder="350"
                keyboardType="decimal-pad"
                value={todosValor}
                onChangeText={setTodosValor}
                style={styles.valor}
              />
              <Campo
                label="Dia do vencimento para todos"
                placeholder="5"
                keyboardType="number-pad"
                maxLength={2}
                value={todosDia}
                onChangeText={setTodosDia}
                style={styles.dia}
              />
            </View>
            <View style={styles.aplicar}>
              <GhostCTA
                label="Preencher"
                disabled={centavosDe(todosValor) === null || diaDe(todosDia) === null}
                onPress={aplicarEmTodos}
                fundo={FORMA.folha.peca.composto}
              />
            </View>
          </Band>
        ) : null}

        {pessoas.map((p) => {
          const l = linhas[p.bond_id];
          const valorRuim = l.valor.trim() !== "" && centavosDe(l.valor) === null;
          const diaRuim = l.dia.trim() !== "" && diaDe(l.dia) === null;
          return (
            <View key={p.bond_id} style={styles.linha}>
              <Initials name={p.name} size={34} />
              <View style={styles.nome}>
                <Txt role="body" numberOfLines={1}>
                  {p.name}
                </Txt>
              </View>
              <Campo
                label={`Valor de ${p.name}`}
                placeholder="350"
                keyboardType="decimal-pad"
                value={l.valor}
                erro={valorRuim || l.falhou}
                onChangeText={(t) => editar(p.bond_id, "valor", t)}
                style={styles.valor}
              />
              <Campo
                label={`Dia do vencimento de ${p.name}`}
                placeholder="5"
                keyboardType="number-pad"
                maxLength={2}
                value={l.dia}
                erro={diaRuim || l.falhou}
                onChangeText={(t) => editar(p.bond_id, "dia", t)}
                style={styles.dia}
              />
            </View>
          );
        })}

        {invalidas.length > 0 ? (
          <Band rule="none">
            <Txt role="note" tone="dim">
              O dia do vencimento vai de 1 a 28 — assim ele existe em todo mês, inclusive
              fevereiro.
            </Txt>
          </Band>
        ) : null}

        {erro ? (
          <Band rule="none">
            <Txt role="body" color={errorInk}>
              {erro}
            </Txt>
          </Band>
        ) : null}
      </ScrollView>

      <DockFooter>
        <AccentCTA
          label={rotulo}
          busy={salvando}
          disabled={prontas.length === 0}
          block
          onPress={() => void guardar()}
        />
        <View style={styles.segunda}>
          <GhostCTA
            label="Voltar"
            onPress={() => navigation.goBack()}
            fundo={FORMA.folha.chrome.composto}
          />
        </View>
      </DockFooter>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, SPACE, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    dica: { marginTop: SPACE.hair },
    par: { flexDirection: "row", gap: SPACE.tight, marginTop: SPACE.tight },
    aplicar: { marginTop: SPACE.tight, alignSelf: "flex-start" },
    linha: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      paddingHorizontal: T.pad,
      paddingVertical: SPACE.tight,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    // O nome encolhe e os campos não: um nome longo não pode roubar o alvo do dedo.
    nome: { flex: 1, minWidth: 0 },
    // O dinheiro cabe em 5 algarismos ("2.500") e o dia em 2. Antes: 96+64, que deixava
    // ~130pt para o nome e cortava "Ana Beatriz" no meio.
    valor: { width: 84 },
    dia: { width: 52 },
    segunda: { marginTop: SPACE.tight },
  }),
);
