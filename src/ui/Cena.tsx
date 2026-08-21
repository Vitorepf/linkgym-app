import { StyleSheet, View } from "react-native";
import { AccentBudget } from "./accent";
import { AccentCTA } from "./AccentCTA";
import { Avatar } from "./Avatar";
import { Baseline } from "./Baseline";
import { Figure } from "./Figure";
import { GhostCTA } from "./GhostCTA";
import { MetricGrid } from "./Metric";
import { Band, Head } from "./Screen";
import { estilos, useTema } from "./tema";
import { Troca } from "./Troca";
import { Txt } from "./Txt";

/** AS CINCO CENAS — o app do aluno, parado, para o personal olhar.
 *
 *  O editor mostrava UMA prévia: um recorte da tela Hoje, e ainda por cima editado para
 *  caber (a grade de números saía na variante alta). Isso é uma maquete que se anuncia como
 *  peça real, e ela já tinha andado uma vez. Pior: a maior parte das alavancas muda coisas
 *  que aquele recorte não sabe desenhar — como uma LISTA respira, como uma comemoração
 *  ocupa a tela, como dois botões dividem o rodapé.
 *
 *  São cinco, e cada uma entra por ser o ÚNICO lugar onde alguma alavanca aparece:
 *
 *    HOJE       a marca no cabeçalho, a segunda cor na régua, o botão principal inteiro
 *    FICHA      superfície, traço, canto e respiro REPETIDOS seis vezes — um bloco esconde
 *               o ritmo, seis blocos denunciam
 *    SÉRIE      a anatomia do número no corpo de herói, e os dois botões lado a lado, que é
 *               o único lugar onde o "botão de recuar" tem contra o que recuar
 *    RECORDE    a comemoração: o degrau `mega`, a massa de acento em tela cheia
 *    PROGRESSO  a única tela onde a segunda cor justifica existir — a série de comparação
 *
 *  Uma sexta cena que não conseguisse nomear uma alavanca só dela seria enfeite.
 *
 *  Cada cena abre o PRÓPRIO orçamento de acento. Sem isso, N cenas montadas lado a lado no
 *  palco disparam o `console.error` do orçamento — e `tools/shots.mjs` trata erro de
 *  console como montagem falha, então a catraca `telas` desabaria inteira por causa de um
 *  provider faltando. */
export type NomeDaCena = "hoje" | "ficha" | "serie" | "recorde" | "progresso";

export const CENAS: { id: NomeDaCena; rotulo: string }[] = [
  { id: "hoje", rotulo: "Hoje" },
  { id: "ficha", rotulo: "Ficha" },
  { id: "serie", rotulo: "Série" },
  { id: "recorde", rotulo: "Recorde" },
  { id: "progresso", rotulo: "Progresso" },
];

type Props = {
  cena: NomeDaCena;
  /** o nome do time e o logo do personal: é a marca DELE que tem que aparecer no palco. */
  nome: string;
  logo?: string;
  accent: string;
};

export function Cena({ cena, nome, logo, accent }: Props) {
  return (
    <AccentBudget>
      {cena === "hoje" ? <CenaHoje nome={nome} logo={logo} accent={accent} /> : null}
      {cena === "ficha" ? <CenaFicha nome={nome} /> : null}
      {cena === "serie" ? <CenaSerie nome={nome} /> : null}
      {cena === "recorde" ? <CenaRecorde nome={nome} /> : null}
      {cena === "progresso" ? <CenaProgresso nome={nome} /> : null}
    </AccentBudget>
  );
}

function CenaHoje({ nome, logo, accent }: { nome: string; logo?: string; accent: string }) {
  const s = usarEstilos();
  return (
    <>
      <Head
        marca={logo ? <Avatar url={logo} name={nome} size={34} /> : undefined}
        kicker={nome}
        title="Hoje"
      />
      <Band raised rule="none">
        <View style={s.linha}>
          <Avatar name={nome} accent={accent} fill size={44} />
          <View style={s.cresce}>
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
        <AccentCTA label="Começar" onPress={naoFaz} meta="52 MIN" />
      </Band>
    </>
  );
}

/** A LISTA, que é onde o ritmo aparece. Seis linhas do mesmo objeto: um bloco sozinho não
 *  mostra respiro nem traço, seis mostram os dois. */
function CenaFicha({ nome }: { nome: string }) {
  const s = usarEstilos();
  const { T, FORMA } = useTema();
  const itens = [
    ["Supino reto", "4 × 8", "72 kg"],
    ["Supino inclinado", "3 × 10", "54 kg"],
    ["Crucifixo", "3 × 12", "18 kg"],
    ["Paralelas", "3 × 8", "peso do corpo"],
    ["Tríceps na polia", "4 × 12", "32 kg"],
    ["Tríceps francês", "3 × 10", "24 kg"],
  ];
  return (
    <>
      <Head kicker={nome} title="Peito e tríceps" body="6 exercícios · 52 min" />
      <Band rule="hair" pad={false}>
        {itens.map(([exercicio, series, carga], i) => (
          <View
            key={exercicio}
            style={[
              s.item,
              { paddingHorizontal: T.pad },
              i > 0 && { borderTopWidth: FORMA.fio, borderTopColor: T.divider },
            ]}
          >
            <View style={s.cresce}>
              <Txt role="body" numberOfLines={1}>
                {exercicio}
              </Txt>
              <Txt role="note" tone="dim">
                {series}
              </Txt>
            </View>
            <Txt role="label" tone="muted">
              {carga}
            </Txt>
          </View>
        ))}
      </Band>
    </>
  );
}

/** O NÚMERO NO CORPO DE HERÓI, e os dois botões dividindo o rodapé — o único lugar onde o
 *  botão de recuar tem contra o que recuar. */
function CenaSerie({ nome }: { nome: string }) {
  const s = usarEstilos();
  const { T, FORMA } = useTema();
  return (
    <>
      <Head kicker={`${nome} pediu`} title="Supino reto" body="Série 2 de 4" />
      <Band raised grow rule="none">
        <Figure label="Carga" value={72} unit="kg" role="hero" />
        <Txt role="note" tone="dim" style={s.acima}>
          na última vez você fez 70 kg
        </Txt>
      </Band>
      <Band rule="none">
        <View style={s.dois}>
          <View style={s.cresce}>
            <AccentCTA label="Registrar" onPress={naoFaz} check />
          </View>
          <View style={s.cresce}>
            <GhostCTA label="Pular" onPress={naoFaz} fundo={FORMA.folha.chrome.composto} />
          </View>
        </View>
        <Txt role="note" tone="dim" style={[s.acima, { color: T.muted2 }]}>
          segure para repetir
        </Txt>
      </Band>
    </>
  );
}

/** A COMEMORAÇÃO. É a tela onde a massa de acento ocupa a tela inteira e onde o degrau
 *  `mega` é o único objeto — nenhuma outra cena mostra o topo da escala tipográfica. */
function CenaRecorde({ nome }: { nome: string }) {
  const s = usarEstilos();
  return (
    <>
      <Head kicker="Recorde" title="Você subiu 5 kg" />
      <Band raised grow rule="none">
        <Troca antes="70 kg" depois="75 kg" />
        <Txt role="body" tone="muted" style={s.acima}>
          é a maior carga que você já levantou no supino reto.
        </Txt>
      </Band>
      <Band rule="none">
        <Txt role="note" tone="dim">
          {nome} vê isso hoje.
        </Txt>
        <AccentCTA label="Continuar" onPress={naoFaz} />
      </Band>
    </>
  );
}

/** A ÚNICA CENA ONDE A SEGUNDA COR JUSTIFICA EXISTIR: a série de comparação ao lado da
 *  do aluno. Nas outras ela é uma cor guardada que não pinta nada. */
function CenaProgresso({ nome }: { nome: string }) {
  const s = usarEstilos();
  return (
    <>
      <Head kicker={nome} title="Progresso" body="as últimas quatro semanas" />
      <Band rule="hair">
        <Txt role="label">Supino reto</Txt>
        <Baseline value={68} label="média do mês" />
        <Txt role="note" tone="dim" style={s.acima}>
          você está 4 kg acima da sua média
        </Txt>
      </Band>
      <MetricGrid
        cells={[
          { label: "Sessões", value: 14, note: "neste mês" },
          { label: "Carga total", value: "18,4", unit: "t" },
          { label: "Recordes", value: 3 },
        ]}
        columns={3}
      />
    </>
  );
}

/** As cenas são INERTES: nenhum toque delas faz nada. O palco é para olhar, e um botão que
 *  navega dali levaria o personal para dentro do app do aluno. */
function naoFaz() {}

const usarEstilos = estilos(({ SPACE, T, FORMA }) =>
  StyleSheet.create({
    linha: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    cresce: { flex: 1, minWidth: 0 },
    acima: { marginTop: SPACE.hair },
    dois: { flexDirection: "row", gap: SPACE.tight },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      paddingVertical: SPACE.tight,
      minHeight: FORMA.alturaMinima,
      backgroundColor: T.bg,
    },
  }),
);
