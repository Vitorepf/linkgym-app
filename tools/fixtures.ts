import type { Aparencia } from "../src/theme";
// Fixtures do host de screenshot. Uma entrada por tela, com os props de sessão do Root,
// o initialState do NavigationContainer e o JSON que o stub de rede devolve.
// Dados de treino de verdade: nomes brasileiros, exercícios reais, cargas em kg.
import type {
  Extra,
  DraftItem,
  FinishRecord,
  MePayload,
  OwnerHome,
  OwnerReturn,
  OwnerStudent,
  OwnerWeekItem,
  Person,
  ProgressPayload,
  RecordItem,
  Time,
  TodayItem,
  TodayPayload,
} from "../src/api";
import type { RootStackParamList, SessionRoute } from "../src/nav/types";

export const TOKEN = "shot-token";

// Estado difícil de propósito: nome de aluno longo.
export const ALUNA: Person = {
  id: "p-ana",
  name: "Ana Beatriz Nascimento Rodrigues",
  phone: "+5511987654321",
  role: "student",
  // avatar por COR (sem foto): o shot prova o degrau do meio do Avatar sem depender de
  // imagem de rede — o host de shots não sai para a internet.
  avatar_color: "#2d7ef7",
};

export const PERSONAL: Person = {
  id: "p-fred",
  name: "Fred Menezes",
  phone: "+5511912345678",
  role: "owner",
};

function item(
  n: number,
  name: string,
  sets: number,
  reps: string,
  kg: number,
  rest: number | null,
  notes: string | null = null,
): TodayItem {
  return {
    id: `pi-${n}`,
    exercise_id: `ex-${n}`,
    name,
    position: n,
    planned_sets: sets,
    planned_reps: reps,
    load_kg: kg,
    rest_seconds: rest,
    notes,
    video_url: n === 1 ? "https://media.invalido/agachamento.mp4" : null,
    // Os dois caminhos entram no shot de propósito. O exercício 5 nunca foi feito, então
    // vem sem referência e a tela tem que desenhar a AUSÊNCIA — se todo item tivesse
    // histórico, as 600 montagens jamais provariam o caso do traço.
    //
    // O número é diferente do prescrito também de propósito: se alguém religar a
    // referência na prescrição, o shot passa a mostrar a mesma carga duas vezes e a
    // diferença aparece na imagem.
    last_kg: n === 5 ? null : Math.round((kg + 5) * 2) / 2,
    last_reps: n === 5 ? null : Number(reps) + 1 || null,
  };
}

// Carga de 3 dígitos no terra — é onde o número quebra o layout.
export const ITEMS: TodayItem[] = [
  item(1, "Agachamento livre", 4, "8", 82.5, 120, "Desce até o paralelo."),
  item(2, "Levantamento terra", 3, "5", 127.5, 180),
  item(3, "Supino reto com barra", 4, "10", 62.5, 90),
  item(4, "Remada curvada", 3, "10", 55, 90),
  item(5, "Desenvolvimento militar", 3, "12", 37.5, 75),
  item(6, "Rosca direta", 3, "12", 22.5, 60),
];

const RECORDS: FinishRecord[] = [
  { exercise_name: "Levantamento terra", load_kg: 127.5, previous_kg: 120 },
  { exercise_name: "Supino reto com barra", load_kg: 62.5, previous_kg: 60 },
];

const PR_ITEMS: RecordItem[] = [
  {
    exercise_name: "Levantamento terra",
    load_kg: 127.5,
    reps: 5,
    achieved_at: "2026-08-18T11:04:00.000Z",
    history: [
      { load_kg: 110, achieved_at: "2026-06-02T11:00:00.000Z" },
      { load_kg: 120, achieved_at: "2026-07-14T11:00:00.000Z" },
      { load_kg: 127.5, achieved_at: "2026-08-18T11:04:00.000Z" },
    ],
  },
  {
    exercise_name: "Agachamento livre",
    load_kg: 82.5,
    reps: 8,
    achieved_at: "2026-08-11T11:00:00.000Z",
    history: [{ load_kg: 80, achieved_at: "2026-07-07T11:00:00.000Z" }],
  },
];

/** A prova da sessão que a Feito desenha, com a MESMA conta de `sessionProof`: uma
 *  execução inteira de ITEMS, série por série, na carga prescrita. Os 47 min são MEDIDOS
 *  (vão entre a primeira e a última série) e por isso diferem dos 52 PREVISTOS que a Hoje
 *  mostra — são dois números de donos diferentes, e o fixture não os empata. */
const PROOF = {
  sets: ITEMS.reduce((n, it) => n + it.planned_sets, 0),
  volumeKg: ITEMS.reduce(
    (kg, it) => kg + it.planned_sets * Number(it.planned_reps) * it.load_kg,
    0,
  ),
  minutes: 47,
};

// 20 alunos: é o lote que o fluxo 1 mede (tools/taps.mjs).
const WEEK: OwnerWeekItem[] = [
  { person_id: "p-ana", name: "Ana Beatriz Nascimento Rodrigues", adherence: "3 de 4", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-carlos", name: "Carlos Eduardo Lima", adherence: "4 de 4", suggested: "Subir carga", selected: true },
  { person_id: "p-juliana", name: "Juliana Prado", adherence: "1 de 3", suggested: "Manter", selected: false },
  { person_id: "p-rafa", name: "Rafael Souza", adherence: "2 de 3", suggested: "Retomada curta", selected: true },
  { person_id: "p-marina", name: "Marina Okamoto", adherence: "0 de 3", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-bruno", name: "Bruno Tavares", adherence: "3 de 4", suggested: "Subir carga", selected: false },
  { person_id: "p-camila", name: "Camila Ferreira", adherence: "4 de 4", suggested: "Manter", selected: true },
  { person_id: "p-diego", name: "Diego Albuquerque", adherence: "1 de 3", suggested: "Retomada curta", selected: true },
  { person_id: "p-elaine", name: "Elaine Moraes", adherence: "2 de 3", suggested: "Repetir com +2,5 kg", selected: false },
  { person_id: "p-fabio", name: "Fábio Nogueira", adherence: "0 de 3", suggested: "Subir carga", selected: true },
  { person_id: "p-gabriela", name: "Gabriela Pinheiro", adherence: "3 de 4", suggested: "Manter", selected: true },
  { person_id: "p-henrique", name: "Henrique Castro", adherence: "4 de 4", suggested: "Retomada curta", selected: false },
  { person_id: "p-isabela", name: "Isabela Duarte", adherence: "1 de 3", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-joao", name: "João Vitor Barbosa", adherence: "2 de 3", suggested: "Subir carga", selected: true },
  { person_id: "p-karina", name: "Karina Ramos", adherence: "0 de 3", suggested: "Manter", selected: false },
  { person_id: "p-leonardo", name: "Leonardo Prates", adherence: "3 de 4", suggested: "Retomada curta", selected: true },
  { person_id: "p-mariana", name: "Mariana Antunes", adherence: "4 de 4", suggested: "Repetir com +2,5 kg", selected: true },
  { person_id: "p-nathalia", name: "Nathalia Vasconcelos", adherence: "1 de 3", suggested: "Subir carga", selected: false },
  { person_id: "p-otavio", name: "Otávio Bittencourt", adherence: "2 de 3", suggested: "Manter", selected: true },
  { person_id: "p-patricia", name: "Patrícia Salgado", adherence: "0 de 3", suggested: "Retomada curta", selected: true },
];
const ATTENTION: OwnerHome["attention"] = [
  {
    id: "al-1",
    person_id: "p-marina",
    name: "Marina Okamoto",
    reason: "student_stopped",
    decision: "Mandar retomada curta",
    rank: 1,
    days: 9,
  },
  {
    id: "al-2",
    person_id: "p-carlos",
    name: "Carlos Eduardo Lima",
    reason: "high_effort",
    decision: "Subir 2,5 kg",
    rank: 2,
  },
  {
    id: "al-3",
    person_id: "p-ana",
    name: "Ana Beatriz Nascimento Rodrigues",
    reason: "pain_flag",
    decision: "Trocar desenvolvimento",
    rank: 3,
  },
];

/** A operação: leituras da Mensalidade sobre a MESMA turma de WEEK (20 alunos), com a
 *  conta fechando — ticket = receita / com_mensalidade. Nomes reaproveitados de WEEK
 *  para as portas (risco abre a Aluna) apontarem para gente que existe no fixture. */
// A receita do FRED REAL, e nao um numero redondo de 5 caracteres. Com 700000 a fila de
// numeros cabia em duas colunas na foto e cabia em uma no aparelho: `FORMA.numero.colunas`
// recusa a segunda coluna acima de 5 caracteres, e "10.500" tem 6. A fixture escondia da
// catraca e do critico cego exatamente o estado em que o estudio que cresce perde a dobra.
// BR Codes REAIS, gerados por internal/pix/brcode.go com a chave do Fred — copiados da
// saida do proprio gerador, nunca escritos a mao. A versao anterior era escrita a mao e nao
// passava num parser TLV (tamanho do campo 26 errado, um digito a mais no 54, e sem os
// quatro digitos do CRC) enquanto o comentario jurava que eram reais. Nenhum banco abriria.
const PIX_350 = "00020126400014br.gov.bcb.pix0118fred@studio.com.br5204000053039865406350.005802BR5913FRED PERSONAL6009SAO PAULO62070503***63041519";
const PIX_300 = "00020126400014br.gov.bcb.pix0118fred@studio.com.br5204000053039865406300.005802BR5913FRED PERSONAL6009SAO PAULO62070503***630443E3";
const PIX_150 = "00020126400014br.gov.bcb.pix0118fred@studio.com.br5204000053039865406150.005802BR5913FRED PERSONAL6009SAO PAULO62070503***63043AF2";
const PIX_219 = "00020126400014br.gov.bcb.pix0118fred@studio.com.br5204000053039865406219.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304817D";
const PIX_400 = "00020126400014br.gov.bcb.pix0118fred@studio.com.br5204000053039865406400.005802BR5913FRED PERSONAL6009SAO PAULO62070503***6304AC3B";

// O cardapio do Fred: os quatro tipos, para a tela ser julgada com os quatro na frente.
const PRODUTOS = [
  { id: "pd-1", tipo: "assinatura" as const, nome: "Marmita fitness", preco_cents: 89000, sessoes: null, ativo: true, vendidos: 6, aberto_cents: 89000, recebido_mes_cents: 445000 },
  { id: "pd-2", tipo: "pacote" as const, nome: "Pacote de 10 sessões", preco_cents: 90000, sessoes: 10, ativo: true, vendidos: 2, aberto_cents: 0, recebido_mes_cents: 180000 },
  { id: "pd-3", tipo: "avulso" as const, nome: "Avaliação física", preco_cents: 15000, sessoes: null, ativo: true, vendidos: 3, aberto_cents: 15000, recebido_mes_cents: 30000 },
  { id: "pd-4", tipo: "fisico" as const, nome: "Whey protein", preco_cents: 21900, sessoes: null, ativo: true, vendidos: 4, aberto_cents: 21900, recebido_mes_cents: 65700 },
  { id: "pd-5", tipo: "fisico" as const, nome: "Camiseta do time", preco_cents: 7900, sessoes: null, ativo: false, vendidos: 11, aberto_cents: 0, recebido_mes_cents: 0 },
];

const MODELOS = [
  { tipo: "assinatura", nome: "Consultoria online", sessoes: null, nota: "Repete todo mês" },
  { tipo: "assinatura", nome: "Marmita fitness", sessoes: null, nota: "Repete todo mês" },
  { tipo: "pacote", nome: "Pacote de 10 sessões", sessoes: 10, nota: "Carrega saldo, você marca cada uso" },
  { tipo: "avulso", nome: "Avaliação física", sessoes: null, nota: "Acontece uma vez" },
  { tipo: "avulso", nome: "Aula experimental", sessoes: null, nota: "Acontece uma vez" },
  { tipo: "fisico", nome: "Whey protein", sessoes: null, nota: "Você entrega na mão" },
  { tipo: "fisico", nome: "Camiseta do time", sessoes: null, nota: "Você entrega na mão" },
];

const NOMES_DO_MES = [
  "Ana Beatriz Nascimento Rodrigues", "Bruno Tavares", "Carla Reis", "Davi Monteiro",
  "Elis Prado", "Fernanda Lima", "Gustavo Rocha", "Helena Braga", "Igor Sampaio",
  "Joana Vidal", "Kaique Nunes", "Larissa Fontes", "Marina Okamoto", "Nina Bastos",
  "Otávio Serra", "Paula Vasques", "Quésia Andrade", "Rafael Souza", "Sofia Camargo",
  "Tiago Nunes", "Úrsula Mendes", "Vitor Freire", "Wesley Pinto", "Xênia Rocha",
  "Yara Duarte", "Zeca Portela", "Amanda Klein",
];

// O QUE CADA UMA PAGA — as 28 linhas que somam receita_cents (R$ 10.500) e dividem em
// ticket_cents (R$ 375). A conta fecha por construcao: a escada nao pode discordar do
// numero que ela desmente.
//
// E a FORMA da turma e a historia que a media esconde: nove numa faixa abaixo do que ele
// cobra hoje de aluna nova, um buraco entre R$ 400 e R$ 449, e duas no topo. "Ticket medio
// R$ 375" e o mesmo numero para essa turma e para uma em que as 28 pagam 375 — e as duas
// pedem manhas diferentes.
const PRECOS = [
  25000, 25000,
  33000, 33000, 33000, 33000, 33000, 33000, 33000, 33000, 33000,
  38000, 38000, 38000, 38000, 38000, 38000, 38000, 38000, 38000, 38000, 38000,
  46000, 46000, 46000, 47000,
  50000, 50000,
];
const COMBINADOS = PRECOS.map((amount_cents, i) => ({
  bond_id: `b-c${i}`,
  person_id: `p-c${i}`,
  // 27 nomes para 28 linhas: a ultima e a Patricia, que e quem a frase da concentracao
  // nomeia — o nome tem que existir nos dois lugares.
  name: NOMES_DO_MES[i] ?? "Patrícia Salgado",
  amount_cents,
  due_day: [5, 10, 15, 20, 25][i % 5],
}));

const OWNER_OPERACAO = {
  student_count: 28,
  com_mensalidade: 28,
  receita_cents: 1050000,
  ticket_cents: 37500,
  // O mes em tres pedacos. 25 marcados x 375 = 937500 entrou; sobram os tres em aberto,
  // e um deles (Patricia, dia 25) ainda NAO venceu — e era isso que o cartao antigo
  // somava junto com os vencidos.
  recebido_cents: 940000,
  vencido_cents: 65000,
  a_vencer_cents: 40000,
  ultima_marcacao: "2026-08-18" as string | null,
  month: "2026-08-01",
  // O copia_e_cola vem PRONTO do servidor, com o valor daquela pessoa dentro.
  em_aberto: [
    { bond_id: "b-marina", person_id: "p-marina", name: "Marina Okamoto", amount_cents: 35000, due_day: 10, vencido_ha: 9, diz_que_ja_pagou: true, meses_abertos: 1, devido_cents: 35000, venceu_em: "2026-08-10", copia_e_cola: PIX_350 },
    { bond_id: "b-rafa", person_id: "p-rafa", name: "Rafael Souza", amount_cents: 30000, due_day: 15, vencido_ha: 66, diz_que_ja_pagou: false, meses_abertos: 3, devido_cents: 90000, venceu_em: "2026-06-15", copia_e_cola: PIX_300 },
    { bond_id: "b-patricia", person_id: "p-patricia", name: "Patrícia Salgado", amount_cents: 40000, due_day: 25, vencido_ha: -6, diz_que_ja_pagou: false, meses_abertos: 1, devido_cents: 40000, venceu_em: "2026-08-25", copia_e_cola: PIX_400 },
  ],
  pix: { configurado: true, chave: "fred@studio.com.br", nome: "Fred Personal", cidade: "Sao Paulo" },
  // O que ele vende fora da mensalidade e ainda nao recebeu.
  a_entregar: [
    {
      id: "c-1", bond_id: "b-marina", person_id: "p-marina", name: "Marina Okamoto",
      descricao: "Avaliação física", valor_cents: 15000, criada_em: "2026-08-14",
      recebida_em: null, copia_e_cola: PIX_150, sessoes: null, sobram: null,
    },
    {
      id: "c-2", bond_id: "b-rafa", person_id: "p-rafa", name: "Rafael Souza",
      descricao: "Whey 900g", valor_cents: 21900, criada_em: "2026-08-17",
      recebida_em: null, copia_e_cola: PIX_219, sessoes: null, sobram: null,
    },
  ] as Extra[],
  // Seis meses fechados. A fita so desenha a partir de dois, e cada coluna carrega os
  // nomes que a compoem — tocar devolve gente, nunca um percentual.
  placar: { tocados: 4, voltaram: 3 },
  produtos: PRODUTOS,
  // A marmita que repete: a Bea assina desde marco e deve tres competencias. E o estado que
  // prova que "repete todo mes" virou comportamento, e nao so rotulo do cardapio.
  assinaturas: [
    {
      id: "as-1", bond_id: "b-bea", produto_id: "pd-1", person_id: "p-bea",
      name: "Bea Nunes", nome: "Marmita fitness", valor_cents: 89000,
      desde: "2026-06-01", meses_abertos: 3, devido_cents: 267000,
      primeira_aberta: "2026-06-01", copia_e_cola: PIX_350,
    },
    {
      id: "as-2", bond_id: "b-carla", produto_id: "pd-1", person_id: "p-carla",
      name: "Carla Reis", nome: "Marmita fitness", valor_cents: 89000,
      desde: "2026-08-01", meses_abertos: 1, devido_cents: 89000,
      primeira_aberta: "2026-08-01", copia_e_cola: PIX_350,
    },
  ],
  visao: {
    entraram: 3, sairam: 1, permanencia_meses: 14.2, produto_cents: 72060,
    // 50000 / 1050000 = 476 bps. Cravava 1140, que exigiria um combinado de R$ 1.197 sem
    // dono em lista nenhuma — a fixture afirmava uma concentracao que a turma nao tem, e
    // so nao aparecia porque nenhuma tela desenhava os 28 valores. Agora desenha.
    maior_fatia_bps: 476, maior_nome: "Patrícia Salgado",
  },
  meses: [
    { month: "2026-02-01", recebido_cents: 780000, quantos: 21, nomes: NOMES_DO_MES.slice(0, 21) },
    { month: "2026-03-01", recebido_cents: 855000, quantos: 23, nomes: NOMES_DO_MES.slice(0, 23) },
    { month: "2026-04-01", recebido_cents: 820000, quantos: 22, nomes: NOMES_DO_MES.slice(0, 22) },
    { month: "2026-05-01", recebido_cents: 940000, quantos: 25, nomes: NOMES_DO_MES.slice(0, 25) },
    { month: "2026-06-01", recebido_cents: 910000, quantos: 24, nomes: NOMES_DO_MES.slice(0, 24) },
    // DUAS SOMEM de junho para julho, e e de proposito: as fatias aninhadas faziam a serie
    // inteira crescer por conjunto: ninguem nunca deixava de pagar, e a frase que nomeia o
    // degrau nao existia em foto nenhuma.
    { month: "2026-07-01", recebido_cents: 1010000, quantos: 25,
      nomes: NOMES_DO_MES.filter((n) => n !== "Bruno Tavares" && n !== "Carla Reis") },
  ],
  // Tres sinais DIFERENTES, que e o ponto: a fila antiga dizia "N dias sem treinar" para
  // todo mundo, e o mesmo numero nao significa a mesma coisa para quem treinava 4x e para
  // quem treina 1x. Aqui cada linha traz o motivo conferivel e a acao daquele motivo.
  risco: [
    {
      person_id: "p-marina",
      bond_id: "b-marina",
      name: "Marina Okamoto",
      phone: "+5511900000031",
      motivo: "Disse que pagou R$ 350, e está há 12 dias sem treinar.",
      acao: "recebi" as const,
      sinal: "disse_que_pagou_e_sumico",
      amount_cents: 35000,
    },
    {
      person_id: "p-patricia",
      bond_id: "b-patricia",
      name: "Patrícia Salgado",
      phone: "+5511900000032",
      motivo: "Treinava 4× por semana. Fez 1 nas últimas duas.",
      acao: "mandar" as const,
      sinal: "queda_contra_a_linha",
      amount_cents: 0,
    },
    {
      person_id: "p-diego",
      bond_id: "b-diego",
      name: "Diego Albuquerque",
      phone: "+5511900000033",
      motivo: "Você não publica para Diego há 24 dias.",
      acao: "publicar" as const,
      sinal: "silencio_do_personal",
      amount_cents: 0,
    },
  ],
  sem_combinado: [] as { bond_id: string; person_id: string; name: string }[],
  combinados: COMBINADOS,
};

/** Os alunos sem valor combinado — o estado que a fixture cheia nunca produzia, porque ela
 *  cravava com_mensalidade === student_count. A faixa que aponta para a tela do Combinado
 *  NUNCA entrava em foto nenhuma, e por isso nem a catraca nem o critico cego viram que ela
 *  prometia uma porta inexistente. */
const SEM_COMBINADO = [
  { bond_id: "b-ana", person_id: "p-ana", name: "Ana Beatriz Nascimento Rodrigues" },
  { bond_id: "b-bruno", person_id: "p-bruno", name: "Bruno Tavares" },
  { bond_id: "b-carla", person_id: "p-carla", name: "Carla Reis" },
  { bond_id: "b-davi", person_id: "p-davi", name: "Davi Monteiro" },
  { bond_id: "b-elis", person_id: "p-elis", name: "Elis Prado" },
];

const OWNER_HOME: OwnerHome = {
  greeting: "Bom treino",
  // O MESMO conjunto de WEEK: na API os dois números saem da mesma consulta (bonds
  // ativos). Enquanto o Painel dizia 34 e a turma listava 20, o número era só enfeite —
  // agora ele é uma porta e abre a lista que ele conta.
  student_count: WEEK.length,
  fio: {
    prescribed: 28,
    done: 19,
    week: [
      { for_date: "2026-08-12", done: 4, prescribed: 6 },
      { for_date: "2026-08-13", done: 5, prescribed: 5 },
      { for_date: "2026-08-14", done: 3, prescribed: 6 },
      { for_date: "2026-08-15", done: 4, prescribed: 4 },
      { for_date: "2026-08-16", done: 0, prescribed: 2 },
      { for_date: "2026-08-17", done: 1, prescribed: 2 },
      { for_date: "2026-08-18", done: 2, prescribed: 3 },
    ],
  },
  attention: ATTENTION,
  unread_returns: 4,
};

const OWNER_STUDENT: OwnerStudent = {
  person_id: "p-ana",
  bond_id: "b-ana",
  name: "Ana Beatriz Nascimento Rodrigues",
  combinado: { amount_cents: 37500, due_day: 5 },
  // A ASSINATURA COM PORTA DE SAIDA. Sem uma na fixture, o bloco "Todo mes" e o "Encerrar"
  // nunca entram em foto nenhuma — e a assinatura sem saida foi exatamente o defeito que
  // ninguem viu porque nao tinha foto.
  assinaturas: [
    { id: "as-1", produto_id: "pd-1", nome: "Marmita fitness", valor_cents: 89000, desde: "2026-05-01" },
  ],
  last_effort: 2,
  last_loads: [
    { exercise_name: "Levantamento terra", load_kg: 127.5 },
    { exercise_name: "Agachamento livre", load_kg: 82.5 },
    { exercise_name: "Supino reto com barra", load_kg: 62.5 },
  ],
  ofensiva: { current_count: 12 },
  suggested: "Subir 2,5 kg no terra",
  commitment_text: "4 dias por semana, antes do trabalho.",
};

const RETURNS: OwnerReturn[] = [
  {
    alert_id: "rt-1",
    person_id: "p-ana",
    name: "Ana Beatriz Nascimento Rodrigues",
    effort: 1,
    records: RECORDS,
    swaps: [{ from: "Agachamento livre", to: "Agachamento no smith" }],
    created_at: "2026-08-18T11:10:00.000Z",
  },
  {
    alert_id: "rt-2",
    person_id: "p-carlos",
    name: "Carlos Eduardo Lima",
    effort: 3,
    records: [],
    swaps: [
      { from: "Supino reto com barra", to: "Supino com halteres" },
    ],
    created_at: "2026-08-18T09:40:00.000Z",
  },
];

const DRAFT: DraftItem[] = ITEMS.map((it, i) => ({
  id: it.id,
  exercise_id: it.exercise_id,
  name: it.name,
  planned_sets: it.planned_sets,
  planned_reps: it.planned_reps,
  load_kg: it.load_kg,
  // Os QUATRO valores aparecem, senao o shot nunca desenha o estado novo e o rodape
  // "de onde sairam as N cargas" nunca e conferido somando certo.
  load_source:
    i === 0 ? "history" : i === 1 ? "prescription" : i === 5 ? "starter" : "manual",
}));

const PROGRESS: ProgressPayload = {
  ofensiva: { current_count: 214, protector_available: true },
  xp_total: 18740,
  league: [
    { name: "Carlos Eduardo Lima", xp_total: 21100, me: false },
    { name: "Ana Beatriz Nascimento Rodrigues", xp_total: 18740, me: true },
    { name: "Juliana Prado", xp_total: 12300, me: false },
    { name: "Rafael Souza", xp_total: 9800, me: false },
    { name: "Marina Okamoto", xp_total: 4120, me: false },
  ],
  badges: [
    { badge_key: "primeira_serie", earned_at: "2026-01-09T11:00:00.000Z" },
    { badge_key: "pr_terra", earned_at: "2026-08-18T11:04:00.000Z" },
    { badge_key: "cem_dias", earned_at: "2026-05-20T11:00:00.000Z" },
  ],
  prontidao_week: [
    { for_date: "2026-08-12", score: 72 },
    { for_date: "2026-08-13", score: 81 },
    { for_date: "2026-08-14", score: 64 },
    { for_date: "2026-08-15", score: 88 },
    { for_date: "2026-08-16", score: 51 },
    { for_date: "2026-08-17", score: 77 },
    { for_date: "2026-08-18", score: 84 },
  ],
};

function todayPayload(time: Time, over: Partial<TodayPayload> = {}): TodayPayload {
  return {
    time,
    person: { id: ALUNA.id, name: ALUNA.name },
    prontidao: { score: 84, energy: 4, soreness: 2, sleep: 4, label: "pronta" },
    ofensiva: { current_count: 12, protector_available: true },
    xp_total: 18740,
    prescription: {
      id: "pr-1",
      name: "Força A",
      for_date: "2026-08-18",
      minutes: 52,
      items: ITEMS,
    },
    banner: null,
    coach_line: "Hoje é dia de terra. Vai com calma na primeira.",
    debut: false,
    comeback: null,
    cumprido: false,
    ...over,
  };
}

export type Fixture = {
  /** Props de sessão do Root. */
  role?: "owner" | "student";
  onboardingComplete?: boolean;
  commitmentComplete?: boolean;
  debut?: boolean;
  /** Rota de destino. Se `tabs`, entra pela home da role e seleciona a aba.
   *
   *  `folha` desce para a PILHA DE DENTRO da tela. A Aparência deixou de ser uma rolagem
   *  de oito telas e virou um índice com dez folhas, cada uma numa `formSheet` de um
   *  navegador local — e sem este campo o medidor só alcançaria o índice, ou seja,
   *  fotografaria a porta e nunca o quarto. */
  route?: { name: keyof RootStackParamList; folha?: string };
  tab?: string;
  /** A APARÊNCIA desta fixture. É o eixo que faltava: sem ele, as oito linguagens que o
   *  produto vende eram medidas só em número (`tools/linguagens.mjs` prova que os 28 pares
   *  se separam) e nunca em pixel. Com ele, "são oito" vira prova fotográfica que a catraca
   *  `telas` guarda. */
  aparencia?: Partial<Aparencia>;
  /** Componente que não é rota (vive dentro de outra tela). */
  direct?: "Criacao" | "MaquinaOcupada" | "App";
  /** Sobrescreve o JSON de rede desta tela. path (regex) -> body. */
  api?: Record<string, unknown>;
};

const OWNER_CHROME = { token: TOKEN, timeName: "", accent: "" };

function session(time: Time): SessionRoute {
  return {
    token: TOKEN,
    timeName: time.name,
    localId: "cs-shot-0001",
    prescriptionId: "pr-1",
    items: ITEMS,
    itemIndex: 1, // terra: carga de 3 dígitos
    setIndex: 2,
    ofensivaCount: 12,
    xpTotal: 18740,
    needsCommitment: false,
  };
}

/** Params por tela, resolvidos com a marca ativa. */
export function params(screen: string, time: Time): object | undefined {
  const chrome = { ...OWNER_CHROME, timeName: time.name, accent: time.accent_color };
  switch (screen) {
    case "Retorno":
    case "Atencao":
    case "Revisao":
      return chrome;
    case "Aluna":
      return { ...chrome, personId: ALUNA.id };
    case "Modelo":
      return {
        token: TOKEN,
        timeName: time.name,
        modelId: "m-1",
        modelName: "Treino A",
      };
    case "NovaModelo":
      return { token: TOKEN, timeName: time.name };
    // O lote: e nele que a tela e julgada, porque uma linha sozinha nao mostra a decisao
    // que a tela toma (a caixa de edicao sobre NOMES, e nao um formulario por pessoa).
    case "Combinado":
      return {
        ...chrome,
        pessoas: SEM_COMBINADO.map((p) => ({ bond_id: p.bond_id, name: p.name })),
      };
    case "Produtos":
      return { ...chrome, produtos: PRODUTOS };
    case "Base":
      return { ...chrome, personId: ALUNA.id, personName: ALUNA.name };
    case "Ajustar":
      return {
        ...chrome,
        prescriptionId: "pr-1",
        personId: ALUNA.id,
        personName: ALUNA.name,
        items: DRAFT,
      };
    case "Publicar":
      return {
        ...chrome,
        prescriptionId: "pr-1",
        personId: ALUNA.id,
        personName: ALUNA.name,
      };
    case "Ficha":
      return { ...chrome, items: ITEMS, prescriptionId: "pr-1" };
    case "ComoFazer":
      return { ...chrome, item: ITEMS[0], items: ITEMS, prescriptionId: "pr-1" };
    case "Serie":
      return session(time);
    case "Descanso":
      return { ...session(time), restSeconds: 180, last: false };
    case "Feito":
      return {
        timeName: time.name,
        ofensivaCount: 214,
        xpTotal: 18740,
        xpGained: 40,
        records: RECORDS,
        proof: PROOF,
        needsCommitment: false,
      };
    case "Recorde":
      return { accent: time.accent_color, records: RECORDS };
    default:
      return undefined;
  }
}

/** Props diretos dos componentes que não são rota. */
export function directProps(
  kind: Fixture["direct"],
  time: Time,
): Record<string, unknown> {
  if (kind === "Criacao") {
    return {
      timeName: time.name,
      busy: false,
      error: "",
      onBeat: () => {},
      onBack: () => {},
      onSend: () => {},
    };
  }
  return {
    token: TOKEN,
    timeName: time.name,
    prescriptionId: "pr-1",
    from: ITEMS[4],
    items: ITEMS,
  };
}

const OWNER: Pick<Fixture, "role" | "onboardingComplete" | "commitmentComplete"> = {
  role: "owner",
  onboardingComplete: true,
  commitmentComplete: true,
};

const STUDENT: Pick<Fixture, "role" | "onboardingComplete" | "commitmentComplete"> = {
  role: "student",
  onboardingComplete: true,
  commitmentComplete: true,
};

export const FIXTURES: Record<string, Fixture> = {
  // ---- personal (9)
  Painel: { ...OWNER, tab: "Painel" },
  Turma: { ...OWNER, route: { name: "Alunos" } },
  Mais: { ...OWNER, tab: "Mais" },
  Modelos: { ...OWNER, route: { name: "Modelos" } },
  Modelo: { ...OWNER, route: { name: "Modelo" } },
  NovaModelo: { ...OWNER, route: { name: "NovaModelo" } },
  Operacao: { ...OWNER, tab: "Operacao" },
  PerfilTime: { ...OWNER, route: { name: "PerfilTime" } },
  // A APARÊNCIA NUNCA FOI FOTOGRAFADA. O editor inteiro — o lugar onde o personal decide
  // como o app dele se parece — não tinha uma fixture sequer, o que quer dizer que
  // nenhuma das combinações que ele monta apareceu em montagem nenhuma. Agora são onze:
  // o índice e as dez folhas.
  // AS OITO LINGUAGENS, cada uma fotografada na tela do aluno.
  LinguaFerro: { ...STUDENT, tab: "Hoje", aparencia: { acao: "linha", voz: "bloco", chao: "carvao", porte: "padrao", forma: "reta", superficie: "solida", peso: "medio", densidade: "normal", movimento: "normal", hierarquia: "salto", anel: "resgate", numero: "empilhado", contraste: "normal" } },
  LinguaModerno: { ...STUDENT, tab: "Hoje", aparencia: { acao: "empilhada", voz: "neutra", chao: "grafite", porte: "padrao", forma: "macia", superficie: "elevada", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" } },
  LinguaMinimalista: { ...STUDENT, tab: "Hoje", aparencia: { acao: "centro", voz: "neutra", chao: "linho", porte: "justo", forma: "reta", superficie: "nenhuma", peso: "fino", densidade: "arejada", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "normal" } },
  LinguaCartaz: { ...STUDENT, tab: "Hoje", aparencia: { acao: "caixa", voz: "condensada", chao: "papel", porte: "folgado", forma: "reta", superficie: "carimbo", peso: "grosso", densidade: "compacta", movimento: "seco", hierarquia: "parelha", anel: "sempre", numero: "empilhado", contraste: "alto" } },
  LinguaVitrine: { ...STUDENT, tab: "Hoje", aparencia: { acao: "linha", voz: "tecnica", chao: "breu", porte: "padrao", forma: "pilula", superficie: "vidro", peso: "fino", densidade: "normal", movimento: "generoso", hierarquia: "parelha", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  LinguaBoutique: { ...STUDENT, tab: "Hoje", aparencia: { acao: "centro", voz: "editorial", chao: "papel", porte: "folgado", forma: "macia", superficie: "elevada", peso: "fino", densidade: "arejada", movimento: "normal", hierarquia: "salto", anel: "sempre", numero: "cartaz", contraste: "normal" } },
  LinguaClinica: { ...STUDENT, tab: "Hoje", aparencia: { acao: "centro", voz: "tecnica", chao: "neve", porte: "justo", forma: "macia", superficie: "fio", peso: "medio", densidade: "compacta", movimento: "seco", hierarquia: "eco", anel: "resgate", numero: "linha", contraste: "alto" } },
  LinguaSereno: { ...STUDENT, tab: "Hoje", aparencia: { acao: "centro", voz: "suave", chao: "tabaco", porte: "folgado", forma: "pilula", superficie: "solida", peso: "fino", densidade: "arejada", movimento: "generoso", hierarquia: "eco", anel: "resgate", numero: "cartaz", contraste: "normal" } },
  Aparencia: { ...OWNER, route: { name: "Aparencia" } },
  AparenciaAjustar: { ...OWNER, route: { name: "Aparencia", folha: "Ajustar" } },
  AparenciaCores: { ...OWNER, route: { name: "Aparencia", folha: "Cores" } },
  AparenciaComparacao: { ...OWNER, route: { name: "Aparencia", folha: "Comparacao" } },
  AparenciaFundo: { ...OWNER, route: { name: "Aparencia", folha: "Fundo" } },
  AparenciaLetra: { ...OWNER, route: { name: "Aparencia", folha: "Letra" } },
  AparenciaBotao: { ...OWNER, route: { name: "Aparencia", folha: "Botao" } },
  AparenciaRecuar: { ...OWNER, route: { name: "Aparencia", folha: "Recuar" } },
  AparenciaNumeros: { ...OWNER, route: { name: "Aparencia", folha: "Numeros" } },
  AparenciaBlocos: { ...OWNER, route: { name: "Aparencia", folha: "Blocos" } },
  AparenciaTraco: { ...OWNER, route: { name: "Aparencia", folha: "Traco" } },
  AparenciaEspaco: { ...OWNER, route: { name: "Aparencia", folha: "Espaco" } },
  AparenciaTexto: { ...OWNER, route: { name: "Aparencia", folha: "Texto" } },
  Atencao: { ...OWNER, route: { name: "Atencao" } },
  Aluna: { ...OWNER, route: { name: "Aluna" } },
  Base: { ...OWNER, route: { name: "Base" } },
  Publicar: { ...OWNER, route: { name: "Publicar" } },
  Revisao: { ...OWNER, route: { name: "Revisao" } },
  Ajustar: { ...OWNER, route: { name: "Ajustar" } },
  Retorno: { ...OWNER, route: { name: "Retorno" } },

  // ---- aluno (17)
  Estreia: { ...STUDENT, debut: true, commitmentComplete: false, route: { name: "Estreia" } },
  Hoje: { ...STUDENT, tab: "Hoje" },
  // O estado ACESO do contador, coberto nas 20 marcas: com o dia cumprido o mesmo desenho
  // troca de saturação, e é justamente aí que um acento hostil (marca 13, igual ao fundo)
  // teria chance de sumir.
  HojeCumprido: { ...STUDENT, tab: "Hoje", api: { "/v1/today": "cumprido" } },
  Ficha: { ...STUDENT, route: { name: "Ficha" } },
  FichaTab: { ...STUDENT, tab: "MinhaFicha" },
  Serie: { ...STUDENT, route: { name: "Serie" } },
  Descanso: { ...STUDENT, route: { name: "Descanso" } },
  DescansoVirada: { ...STUDENT, route: { name: "Descanso" } },
  Feito: { ...STUDENT, route: { name: "Feito" } },
  Pronto: { ...STUDENT, onboardingComplete: false, route: { name: "Pronto" } },
  Progresso: { ...STUDENT, tab: "Progresso" },
  Recorde: { ...STUDENT, route: { name: "Recorde" } },
  // A Retomada deixou de ser rota: virou faixa sobre a Hoje. A tela coberta continua
  // sendo UMA na catraca `telas`, agora no estado que importa — a faixa E o dia atras
  // dela na mesma imagem.
  HojeRetomada: {
    ...STUDENT,
    tab: "Hoje",
    api: {
      "/v1/today": "comeback",
    },
  },
  Perfil: { ...STUDENT, tab: "Perfil" },
  SobreVoce: { ...STUDENT, onboardingComplete: false, route: { name: "SobreVoce" } },
  ComoFazer: { ...STUDENT, route: { name: "ComoFazer" } },
  Compromisso: { ...STUDENT, commitmentComplete: false, route: { name: "Compromisso" } },
  // Porta de entrada real: monta o App inteiro, não o Root.
  Acesso: { direct: "App" },
  Criacao: { ...STUDENT, direct: "Criacao" },
  MaquinaOcupada: { ...STUDENT, direct: "MaquinaOcupada" },

  // ---- estados difíceis (é onde o app é julgado)
  HojeVazio: { ...STUDENT, tab: "Hoje", api: { "/v1/today": "vazio" } },
  AtencaoVazio: { ...OWNER, route: { name: "Atencao" }, api: { "/v1/owner/attention": { items: [] } } },
  OperacaoVazia: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        em_aberto: [],
        risco: [],
      },
    },
  },
  // O estado que a fixture cheia escondia: parte da turma sem combinado, e a porta para a
  // tela que resolve isso desenhada no rodape.
  OperacaoSemCombinado: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        com_mensalidade: OWNER_OPERACAO.student_count - SEM_COMBINADO.length,
        sem_combinado: SEM_COMBINADO,
        combinados: COMBINADOS.slice(SEM_COMBINADO.length),
      },
    },
  },
  Combinado: { ...OWNER, route: { name: "Combinado" } },
  Produtos: { ...OWNER, route: { name: "Produtos" } },
  // O ESTADO DO APARELHO: chave Pix ainda nao configurada (o formulario aparece) e um atraso
  // longo (a prosa do tempo tem que arredondar). E onde os dois defeitos de acabamento moravam.
  OperacaoSemPix: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        pix: { configurado: false, chave: "", nome: "", cidade: "" },
        em_aberto: [
          { bond_id: "b-jose", person_id: "p-jose", name: "Jose", amount_cents: 35000, due_day: 10, vencido_ha: 400, diz_que_ja_pagou: false, meses_abertos: 14, devido_cents: 490000, venceu_em: "2025-07-10", copia_e_cola: "" },
          { bond_id: "b-tiago", person_id: "p-tiago", name: "Tiago Nunes", amount_cents: 35000, due_day: 10, vencido_ha: 1, diz_que_ja_pagou: false, meses_abertos: 1, devido_cents: 35000, venceu_em: "2026-08-10", copia_e_cola: "" },
        ],
        a_entregar: [],
        produtos: [],
        visao: { entraram: 27, sairam: 0, permanencia_meses: 0.5, produto_cents: 0, maior_fatia_bps: 428, maior_nome: "Wellington dos Santos" },
      },
    },
  },
  // O MES EM DIA: ninguem devendo, ninguem em risco. E o unico estado em que a fita sobe
  // para a dobra — e ela e a peca que precisa ser vista para ser julgada.
  OperacaoEmDia: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        recebido_cents: OWNER_OPERACAO.receita_cents,
        vencido_cents: 0,
        a_vencer_cents: 0,
        em_aberto: [],
        risco: [],
        a_entregar: [],
      },
    },
  },
  // A TURMA COM UMA PESSOA MUITO ACIMA DAS OUTRAS. E o estado em que a escada PERDE a
  // resolucao de proposito — o passo estoura para R$ 250, as 27 caem numa faixa so, e a
  // geometria fica muda em vez de reescalar e mentir. Quem fala e a prosa. E e o unico
  // estado em que a frase da concentracao existe, porque so aqui ela e verdade.
  OperacaoConcentrada: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        ...OWNER_OPERACAO,
        receita_cents: 1119700,
        ticket_cents: 39989,
        combinados: [
          ...COMBINADOS.slice(0, 27),
          { bond_id: "b-patricia", person_id: "p-patricia", name: "Patrícia Salgado", amount_cents: 119700, due_day: 5 },
        ],
        visao: { ...OWNER_OPERACAO.visao, maior_fatia_bps: 1069 },
      },
    },
  },
  // O PRIMEIRO DIA. Turma zero: nenhum aluno, nenhum combinado, nenhum produto, nenhum
  // pagamento, nenhum mes fechado. E o estado que TODO personal ve no minuto 1 e o unico
  // que nunca foi fotografado. Payload identico ao que a API devolve num studio recem
  // criado (internal/owner/operacao.go: agregados em 0, listas vazias, ticket 0 porque
  // com_mensalidade e 0 e a divisao e pulada).
  OperacaoPrimeiroDia: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        student_count: 0,
        com_mensalidade: 0,
        receita_cents: 0,
        ticket_cents: 0,
        recebido_cents: 0,
        vencido_cents: 0,
        a_vencer_cents: 0,
        ultima_marcacao: null,
        month: "2026-08-01",
        em_aberto: [],
        pix: { configurado: false, chave: "", nome: "", cidade: "" },
        a_entregar: [],
        placar: { tocados: 0, voltaram: 0 },
        produtos: [],
        visao: { entraram: 0, sairam: 0, permanencia_meses: 0, produto_cents: 0, maior_fatia_bps: 0, maior_nome: "" },
        meses: [],
        risco: [],
        sem_combinado: [],
      },
    },
  },
  // O SEGUNDO DIA: tres convites aceitos, nenhum valor combinado ainda. O estado (b) da
  // SPEC — o vazio E o formulario.
  OperacaoSegundoDia: {
    ...OWNER,
    tab: "Operacao",
    api: {
      "/v1/owner/operacao": {
        student_count: 3,
        com_mensalidade: 0,
        receita_cents: 0,
        ticket_cents: 0,
        recebido_cents: 0,
        vencido_cents: 0,
        a_vencer_cents: 0,
        ultima_marcacao: null,
        month: "2026-08-01",
        em_aberto: [],
        pix: { configurado: false, chave: "", nome: "", cidade: "" },
        a_entregar: [],
        placar: { tocados: 0, voltaram: 0 },
        produtos: [],
        visao: { entraram: 3, sairam: 0, permanencia_meses: 0, produto_cents: 0, maior_fatia_bps: 0, maior_nome: "" },
        meses: [],
        risco: [],
        sem_combinado: SEM_COMBINADO.slice(0, 3),
      },
    },
  },
  ProgressoZero: {
    ...STUDENT,
    tab: "Progresso",
    api: {
      "/v1/progress": {
        ofensiva: { current_count: 0, protector_available: false },
        xp_total: 0,
        league: [],
        badges: [],
        prontidao_week: [],
      },
    },
  },
  RecordeVazio: { ...STUDENT, route: { name: "Recorde" }, api: { "/v1/records": { items: [] } } },
  RevisaoVazio: { ...OWNER, route: { name: "Revisao" }, api: { "/v1/owner/week": { items: [] } } },
};

/**
 * Entradas que existem para o tools/taps.mjs e NÃO são tela do v1: o gate de screenshot
 * as ignora por padrão. "Acesso" monta o App inteiro — é a porta de entrada, não uma tela
 * do catálogo. Ainda dá para fotografar à mão com --screens=Acesso.
 */
export const HARNESS = ["Acesso"];

export const SCREENS = Object.keys(FIXTURES).filter((k) => !HARNESS.includes(k));

/**
 * Mapa determinístico de rede. Ordem importa: o primeiro regex que casar ganha.
 * Só rotas /v1 — qualquer outra URL (fonte, asset) passa direto.
 */
export function apiRoutes(
  time: Time,
  over: Record<string, unknown> = {},
): [RegExp, unknown][] {
  const mine: MePayload = {
    person: ALUNA,
    time,
    onboarding_complete: true,
    commitment_complete: true,
    debut: false,
  };
  const base: [RegExp, unknown][] = [
    [/^\/v1\/me$/, mine],
    [/^\/v1\/today\/prontidao$/, { score: 84, energy: 4, soreness: 2, sleep: 4, label: "pronta" }],
    [/^\/v1\/today$/, todayPayload(time)],
    [/^\/v1\/student\/mensalidade$/, {
      valor_cents: 37500, due_day: 5, month: "2026-08-01", ja_disse: false, recebido: false,
    }],
    [/^\/v1\/student\/ja-paguei$/, { ok: true }],
    [/^\/v1\/student\/loja\/[^/]+\/quero$/, { ok: true }],
    [/^\/v1\/student\/loja$/, {
      items: [
        { produto_id: "pd-1", tipo: "assinatura", nome: "Marmita fitness", preco_cents: 89000, sessoes: null, ja_pedi: false },
        { produto_id: "pd-4", tipo: "fisico", nome: "Whey protein", preco_cents: 21900, sessoes: null, ja_pedi: true },
        { produto_id: "pd-2", tipo: "pacote", nome: "Pacote de 10 sessões", preco_cents: 90000, sessoes: 10, ja_pedi: false },
      ],
    }],
    [/^\/v1\/owner\/extras$/, { ok: true }],
    [/^\/v1\/owner\/produtos\/modelos$/, { items: MODELOS }],
    [/^\/v1\/owner\/produtos$/, PRODUTOS[0]],
    [/^\/v1\/owner\/bonds\/[^/]+\/estado$/, { ok: true }],
    [/^\/v1\/owner\/home$/, OWNER_HOME],
    [/^\/v1\/owner\/operacao$/, OWNER_OPERACAO],
    [/^\/v1\/owner\/mensalidades\/[^/]+\/pagar$/, { ok: true }],
    [/^\/v1\/owner\/time$/, { ok: true }],
    [/^\/v1\/media\/presign$/, { object_key: "avatar/p-ana/x.jpg", upload_url: "http://localhost:9000/none" }],
    [/^\/v1\/owner\/attention\/[^/]+\/apply$/, { ok: true }],
    [/^\/v1\/owner\/attention$/, { items: ATTENTION }],
    [/^\/v1\/owner\/returns\/[^/]+\/apply$/, { ok: true }],
    [/^\/v1\/owner\/returns$/, { items: RETURNS }],
    [/^\/v1\/owner\/week\/approve$/, { count: 3 }],
    [/^\/v1\/owner\/week/, { items: WEEK }],
    [/^\/v1\/owner\/students\/[^/]+$/, OWNER_STUDENT],
    [/^\/v1\/exercises$/, {
      items: ITEMS.map((it) => ({
        id: it.exercise_id,
        name: it.name,
        has_video: Boolean(it.video_url),
      })),
    }],
    [/^\/v1\/models\/[^/]+\/draft-from-last$/, { draft_id: "dr-1", items: DRAFT }],
    [/^\/v1\/models\/[^/]+\/items$/, {
      id: "m-1",
      name: "Treino A",
      items: [
        { id: "mi-1", exercise_id: "ex-3", name: "Supino", position: 1, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 20 },
        { id: "mi-2", exercise_id: "ex-4", name: "Remada", position: 2, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 18 },
        { id: "mi-3", exercise_id: "ex-1", name: "Agachamento", position: 3, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 40 },
      ],
    }],
    [
      /^\/v1\/models\/[^/]+$/,
      {
        id: "m-1",
        name: "Treino A",
        items: [
          { id: "mi-1", exercise_id: "ex-3", name: "Supino", position: 1, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 20 },
          { id: "mi-2", exercise_id: "ex-4", name: "Remada", position: 2, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 18 },
          { id: "mi-3", exercise_id: "ex-1", name: "Agachamento", position: 3, planned_sets: 3, planned_reps: "8-12", starter_load_kg: 40 },
        ],
      },
    ],
    [
      /^\/v1\/models$/,
      {
        items: [
          // Base.tsx usa o PRIMEIRO modelo da lista e escreve o nome que vier — não
          // chumba nome de Modelo. Estes dois nomes espelham o seed da API.
          { id: "m-1", name: "Treino A" },
          { id: "m-2", name: "Treino B" },
          { id: "m-3", name: "Full body iniciante" },
        ],
      },
    ],
    [/^\/v1\/prescriptions\/[^/]+\/items\/[^/]+$/, { ok: true }],
    [/^\/v1\/publish$/, { ok: true }],
    [/^\/v1\/progress$/, PROGRESS],
    [/^\/v1\/records$/, { items: PR_ITEMS }],
    [/^\/v1\/sessions\/[^/]+\/finish$/, {
      ofensiva: { current_count: 214, protector_available: true },
      xp_gained: 40,
      xp_total: 18740,
      records: RECORDS,
      badge_keys: ["pr_terra"],
    }],
    [/^\/v1\/sessions\/[^/]+\/sets$/, { ok: true }],
    [/^\/v1\/sessions\/[^/]+\/swap$/, { ok: true }],
    [/^\/v1\/sessions$/, { id: "s-1", local_id: "cs-shot-0001", started_at: "2026-08-18T11:00:00.000Z" }],
    [/^\/v1\/comebacks\/[^/]+\/complete$/, { ok: true }],
    [/^\/v1\/onboarding$/, { ok: true }],
    [/^\/v1\/commitment$/, { ok: true }],
    [/^\/v1\/auth\/code$/, { ok: true, dev_code: "4242", time }],
    [/^\/v1\/auth\/verify$/, { token: TOKEN, person: ALUNA, time }],
    [/^\/v1\/auth\/logout$/, { ok: true }],
  ];

  const named: Record<string, unknown> = {
    comeback: todayPayload(time, {
      // A ficha de hoje FICA. Quem faltou ontem tem treino hoje, e a faixa se sobrepõe a
      // ele em vez de substituí-lo — se a fixture viesse sem prescrição, o shot provaria
      // o contrário do que o desenho promete.
      ofensiva: { current_count: 4, protector_available: false },
      comeback: { id: "cb-1", minutes: 18, coach_line: "Sua carga e seus recordes continuam aí." },
    }),
    cumprido: todayPayload(time, { cumprido: true, ofensiva: { current_count: 13, protector_available: true } }),
    vazio: todayPayload(time, {
      prescription: null,
      prontidao: { score: 0, energy: 0, soreness: 0, sleep: 0, label: "" },
      ofensiva: { current_count: 0, protector_available: false },
      xp_total: 0,
      coach_line: "",
    }),
  };

  const patches: [RegExp, unknown][] = Object.entries(over).map(([path, body]) => [
    new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    typeof body === "string" ? named[body] : body,
  ]);

  return [...patches, ...base];
}
