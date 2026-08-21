import Constants from "expo-constants";
import { Platform } from "react-native";
import { APARENCIA_PADRAO, type Aparencia } from "./theme";
export { resultadoDaSessao } from "./sessao";

export function apiBaseUrl(): string {
  const env = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080").replace(
    /\/$/,
    "",
  );
  // Simulador iOS: localhost é o Mac, e o ATS do Expo Go deixa HTTP claro só para
  // localhost. Trocar pelo IP da LAN faz o fetch morrer antes de chegar na API.
  const onDevice = (Constants as { isDevice?: boolean }).isDevice;
  if (Platform.OS === "ios" && onDevice === false) {
    return env;
  }
  const hostUri = Constants.expoConfig?.hostUri ?? "";
  const host = hostUri.replace(/^\w+:\/\//, "").split(":")[0];
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    let port = "8080";
    try {
      const u = new URL(/^\w+:\/\//.test(env) ? env : `http://${env}`);
      if (u.port) port = u.port;
    } catch {
      /* padrão 8080 */
    }
    return `http://${host}:${port}`;
  }
  return env;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

/** Teto de uma ida à API. Sem isto, "Abrindo o dia…" fica aberto para sempre
 *  quando a rede morre no meio do fetch — o aluno só sai matando o app. */
const REQUEST_MS = 15_000;

async function request<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  try {
    return await requestOnce<T>(path, init);
  } catch (err) {
    // Só GET: repetir POST criaria sessão/série em dobro. Uma segunda ida cobre
    // o abort de 15s numa leitura; escrita falha de verdade e a tela oferece "Tentar de novo".
    const method = (init.method ?? "GET").toUpperCase();
    if (
      err instanceof ApiError &&
      err.status === 0 &&
      (method === "GET" || method === "HEAD") &&
      !init.signal?.aborted
    ) {
      return requestOnce<T>(path, init);
    }
    throw err;
  }
}

async function requestOnce<T>(
  path: string,
  init: RequestInit & { token?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (init.token) {
    headers.Authorization = `Bearer ${init.token}`;
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_MS);
  const parent = init.signal;
  if (parent) {
    if (parent.aborted) ctrl.abort();
    else parent.addEventListener("abort", () => ctrl.abort(), { once: true });
  }
  try {
    const res = await fetch(`${apiBaseUrl()}${path}`, {
      method: init.method,
      body: init.body,
      headers,
      signal: ctrl.signal,
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
    } & T;
    if (!res.ok) {
      throw new ApiError(res.status, body.error ?? "erro");
    }
    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, "sem_conexao");
  } finally {
    clearTimeout(timer);
  }
}

export type Person = {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatar_color?: string;
  avatar_url?: string;
};

/** A config white-label do Time — o cardápio que o personal monta. Toda chave é
 *  opcional no payload; `configDoTime` aplica os padrões de fábrica. */
export type TimeConfig = {
  /** A APARÊNCIA: o documento que o personal edita para o app inteiro ser dele. A cor
   *  primária NÃO mora aqui — ela é `accent_color`, que já é coluna e já viaja no convite.
   *  Um documento com dois donos da mesma cor é a receita de divergirem. */
  aparencia?: Partial<Aparencia>;
  liga?: "nomes" | "anonima" | "off";
  selos?: boolean;
  xp?: boolean;
  prontidao?: boolean;
  passo_kg?: number;
  dias_padrao?: number;
  boas_vindas?: string;
  retomada?: string;
};

export type Time = {
  id: string;
  name: string;
  accent_color: string;
  logo_url?: string;
  config?: TimeConfig | null;
};

/** Config com os padrões de fábrica aplicados: ausência de chave = comportamento que o
 *  app sempre teve. É a única porta de leitura — tela nenhuma lê `time.config` cru. */
export function configDoTime(time: Time): Required<
  Pick<TimeConfig, "liga" | "selos" | "xp" | "prontidao" | "passo_kg" | "dias_padrao">
> &
  Pick<TimeConfig, "boas_vindas" | "retomada"> {
  const c = time.config ?? {};
  return {
    liga: c.liga ?? "nomes",
    selos: c.selos ?? true,
    xp: c.xp ?? true,
    prontidao: c.prontidao ?? true,
    passo_kg: c.passo_kg ?? 2.5,
    dias_padrao: c.dias_padrao ?? 3,
    boas_vindas: c.boas_vindas,
    retomada: c.retomada,
  };
}

/** A aparência com os padrões de fábrica aplicados e a cor primária vinda de onde ela
 *  mora. Ausência de documento = o app de sempre, byte a byte. */
export function aparenciaDoTime(time: Time | null | undefined): Aparencia {
  const a = time?.config?.aparencia ?? {};
  return {
    ...APARENCIA_PADRAO,
    ...a,
    primaria: time?.accent_color || APARENCIA_PADRAO.primaria,
  };
}

/** URL de mídia pronta para o aparelho. A API manda caminho RELATIVO (/v1/media/...):
 *  quem serve a imagem é a própria API, no MESMO host que o app já alcança em qualquer
 *  aparelho. A primeira versão trocava o host de uma URL presignada do MinIO — e a
 *  assinatura SigV4 é presa ao host: quebrava com 403 e o logo sumia da tela. */
export function mediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("/") ? `${apiBaseUrl()}${url}` : url;
}

export function requestCode(phone: string, inviteCode?: string) {
  return request<{ ok: boolean; dev_code?: string; time?: Time }>(
    "/v1/auth/code",
    {
      method: "POST",
      body: JSON.stringify({ phone, invite_code: inviteCode ?? "" }),
    },
  );
}

export function verify(phone: string, code: string, inviteCode?: string) {
  return request<{ token: string; person: Person; time: Time }>(
    "/v1/auth/verify",
    {
      method: "POST",
      body: JSON.stringify({ phone, code, invite_code: inviteCode ?? "" }),
    },
  );
}

export type MePayload = {
  person: Person;
  time: Time;
  onboarding_complete: boolean;
  commitment_complete: boolean;
  debut: boolean;
};

export function me(token: string) {
  return request<MePayload>("/v1/me", { token });
}

export function logout(token: string) {
  return request<{ ok: boolean }>("/v1/auth/logout", { method: "POST", token });
}

export type TodayItem = {
  id: string;
  exercise_id: string;
  name: string;
  position: number;
  planned_sets: number;
  planned_reps: string;
  load_kg: number;
  rest_seconds: number | null;
  notes: string | null;
  video_url: string | null;
  /** O que o CORPO dele fez da última vez neste exercício — série executada, não carga
   *  prescrita. `null` quando nunca fez: a tela desenha a ausência, nunca um número
   *  inventado. */
  last_kg: number | null;
  last_reps: number | null;
};

export type Prontidao = {
  score: number;
  energy: number;
  soreness: number;
  sleep: number;
  label: string;
};

export type TodayPayload = {
  time: Time;
  person: { id: string; name: string };
  prontidao: Prontidao;
  ofensiva: { current_count: number; protector_available: boolean };
  xp_total: number;
  prescription: {
    id: string;
    name: string;
    for_date: string;
    minutes: number;
    items: TodayItem[];
  } | null;
  banner: { text: string; kind: string } | null;
  coach_line: string;
  debut: boolean;
  comeback: { id: string; minutes: number; coach_line: string } | null;
  /** Cumprimento: a Sessão prescrita de hoje FECHADA. Nunca volume, carga ou percentual
   *  do prescrito. É o que acende o contador da Ofensiva no chrome. */
  cumprido: boolean;
};

export type OwnerHome = {
  greeting: string;
  student_count: number;
  fio: {
    prescribed: number;
    done: number;
    week: { for_date: string; done: number; prescribed: number }[];
  };
  attention: {
    id: string;
    person_id: string;
    name: string;
    reason: string;
    decision: string;
    rank: number;
    applied?: boolean;
    days?: number;
  }[];
  unread_returns: number;
};

export function today(token: string) {
  return request<TodayPayload>("/v1/today", { token });
}

export function putProntidao(
  token: string,
  body: { energy: number; soreness: number; sleep: number },
) {
  return request<Prontidao>("/v1/today/prontidao", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function ownerHome(token: string) {
  return request<OwnerHome>("/v1/owner/home", { token });
}

/** As LEITURAS da Mensalidade sobre a turma (CONTEXT.md) + quem está perto de sumir.
 *  Dinheiro em centavos: float é o bug que ninguém acha. */
export type OwnerOperacao = {
  student_count: number;
  com_mensalidade: number;
  /** O COMBINADO: preço de tabela × turma de hoje. NÃO é receita — não muda um centavo
   *  quando ninguém paga. Chamava-se "Receita do mês" na tela, colado num "em aberto"
   *  que dizia o contrário. */
  receita_cents: number;
  ticket_cents: number;
  /** O mês em três pedaços, que somam o combinado: o que entrou, o que ainda vai vencer,
   *  e o que passou do dia. Antes os dois últimos eram um número só. */
  recebido_cents: number;
  a_vencer_cents: number;
  vencido_cents: number;
  /** Quando o personal marcou alguma coisa pela última vez. `null` = nunca. É o que deixa
   *  a tela distinguir "ninguém pagou" de "ele parou de marcar" — sem isso, o esquecimento
   *  dele vira acusação de calote contra a turma inteira. */
  ultima_marcacao: string | null;
  /** A chave de recebimento do personal. NÃO viaja no payload do aluno: quem paga não
   *  precisa saber a chave, e `Time` é compartilhado com o convite. */
  pix: {
    configurado: boolean;
    chave: string;
    nome: string;
    cidade: string;
  };
  /** O que ele vendeu fora da mensalidade e ainda não recebeu: avaliação, whey, marmita.
   *  Dois campos, sem catálogo — "qualquer tipo de produto" com categoria, foto, estoque e
   *  frete são seis decisões entre o personal e o dinheiro. */
  a_entregar: Extra[];
  /** A fita: uma coluna por mês FECHADO. Vazia até existirem dois — um ponto não é série,
   *  e não existe placeholder de gráfico. Cada coluna carrega os nomes que a compõem. */
  meses: {
    month: string;
    recebido_cents: number;
    quantos: number;
    nomes: string[];
  }[];
  /** A ÚNICA estatística agregada do produto, e ela é sobre o comportamento DELE — nunca
   *  uma classificação da turma. "Você tocou em 7 pessoas este mês. 5 voltaram a treinar." */
  placar: { tocados: number; voltaram: number };
  /** O cardápio, com o dinheiro que cada linha já fez. */
  produtos: Produto[];
  /** O QUE REPETE TODO MÊS e ainda não foi recebido. O tipo `assinatura` dizia "repete todo
   *  mês" no cardápio e nada repetia — vender a marmita criava UMA linha, uma vez. Agora a
   *  competência é DERIVADA, como na mensalidade: não existe o dia em que o processo do dia
   *  1º falhou e a turma ficou sem cobrança. */
  assinaturas: Assinatura[];
  /** A OPERAÇÃO INTEIRA. Os números que o personal não tem em lugar nenhum — nem no
   *  caderno, nem na planilha — e que mudam o que ele faz no mês seguinte. */
  visao: {
    entraram: number;
    sairam: number;
    permanencia_meses: number;
    produto_cents: number;
    /** a maior fatia da receita numa pessoa só, em pontos-base. Concentração é risco. */
    maior_fatia_bps: number;
    maior_nome: string;
  };
  month: string;
  em_aberto: {
    bond_id: string;
    person_id: string;
    name: string;
    amount_cents: number;
    due_day: number;
    /** dias desde o vencimento neste mês; negativo = ainda vence. */
    vencido_ha: number;
    /** A aluna DISSE que já pagou. Não é pagamento e não muda número nenhum: é um nome
     *  para o dedo do personal confirmar — a única fonte de verdade sobre o dinheiro que
     *  não depende da memória de uma pessoa ocupada. */
    diz_que_ja_pagou: boolean;
    /** Quantas competências esta pessoa deve, e quanto isso soma. A lista é escopada pelo
     *  mês, e por isso o valor da linha era sempre o de UM mês: quem devia desde junho lia
     *  "venceu há 3 meses · R$ 350" quando o fato eram R$ 1.050. É do tamanho DELA — a barra
     *  do mês continua sendo do mês, e as duas coisas dizem o que são. */
    meses_abertos: number;
    devido_cents: number;
    /** A DATA em que a competência aberta mais antiga venceu, ISO. O pedido escrito era
     *  "quem não pagou ainda E A DATA", e a tela não tinha uma data de calendário em lugar
     *  nenhum — só "venceu há 9 dias", e para quem devia mais de um mês, nem isso. */
    venceu_em: string;
    /** o copia-e-cola do Pix COM o valor desta linha. Vazio = o personal ainda não
     *  configurou a chave. É o que impede a aluna pagar R$ 300 quando o combinado é 350. */
    copia_e_cola: string;
  }[];
  /** QUEM VAI SUMIR — e por quê, numa frase conferível. Nunca um score, nunca um
   *  percentual: "78% de chance de cancelar" é infalsificável para quem lê, e o personal
   *  ou obedece sem julgar ou ignora. Um fato ele confere contra a memória em dois
   *  segundos, descobre que ela viajou, e a fila continua merecendo confiança. Teto de 3. */
  risco: {
    person_id: string;
    bond_id: string;
    name: string;
    phone: string;
    motivo: string;
    /** o que o dedo faz nesta linha. */
    acao: "recebi" | "pix" | "mandar" | "publicar" | "abrir";
    /** o código do sinal que a escolheu, para o toque registrar o porquê. */
    sinal: string;
    amount_cents: number;
  }[];
  /** QUEM não tem combinado. O rodapé escrevia só o número e mandava digitar "na
   *  pessoa" — uma porta que não existia. Número sem os nomes que o compõem não abre
   *  nada. */
  sem_combinado: {
    bond_id: string;
    person_id: string;
    name: string;
  }[];
  /** O que CADA UMA paga. São as mesmas linhas que produzem `receita_cents` e
   *  `ticket_cents`, sem o SUM — a média sozinha é o mesmo número para uma turma toda em
   *  375 e para metade em 250 e metade em 500, e as duas pedem manhãs diferentes. */
  combinados: {
    bond_id: string;
    person_id: string;
    name: string;
    amount_cents: number;
    due_day: number;
  }[];
};

/** O CATÁLOGO: o que o personal vende, com nome e preço digitados UMA vez.
 *
 *  Quatro tipos e só quatro. Não é taxonomia — são os três comportamentos que o dinheiro
 *  tem, mais a entrega: repete todo mês, carrega saldo, acontece uma vez, chega na mão dela.
 *  Sem categoria, foto, variante, cupom, frete, carrinho ou busca: cada um deles é um campo
 *  entre o personal e o dinheiro, e nenhum é escolha que ele saiba fazer às 22h. */
export type Produto = {
  id: string;
  tipo: "assinatura" | "pacote" | "avulso" | "fisico";
  nome: string;
  preco_cents: number;
  sessoes: number | null;
  ativo: boolean;
  vendidos: number;
  aberto_cents: number;
  recebido_mes_cents: number;
};

/** O cardápio de modelos: ele escolhe uma linha e digita o preço. Formulário em branco é
 *  onde a maioria desiste. */
export type ModeloDeProduto = {
  tipo: Produto["tipo"];
  nome: string;
  sessoes: number | null;
  nota: string;
};

export function modelosDeProduto(token: string) {
  return request<{ items: ModeloDeProduto[] }>("/v1/owner/produtos/modelos", { token });
}

export function criarProduto(
  token: string,
  body: { tipo: Produto["tipo"]; nome: string; preco_cents: number; sessoes?: number | null },
) {
  return request<Produto>("/v1/owner/produtos", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

/** Pausar é o estoque dele: um toque quando acaba o whey. Some da loja da aluna e do
 *  cardápio de venda; as vendas antigas ficam inteiras. */
export function pausarProduto(token: string, id: string, ativo: boolean) {
  return request<{ ok: boolean }>(`/v1/owner/produtos/${id}/ativo`, {
    method: "PUT",
    token,
    body: JSON.stringify({ ativo }),
  });
}

/** Vender é sempre para UMA pessoa, escolhida por ele. Não existe prateleira que se navegue
 *  sozinha — e é isso que faz vender ser, por construção, mais um motivo para ele tocar em
 *  alguém hoje. */
export function venderProduto(token: string, produtoId: string, bondId: string) {
  return request<Extra>(`/v1/owner/produtos/${produtoId}/vender`, {
    method: "POST",
    token,
    body: JSON.stringify({ bond_id: bondId }),
  });
}

/** Gastar uma sessão do pacote. O saldo é contagem, nunca coluna que decrementa. */
export function gastarSessao(token: string, extraId: string, dia: string) {
  return request<{ ok: boolean }>(`/v1/owner/extras/${extraId}/uso`, {
    method: "POST",
    token,
    body: JSON.stringify({ dia }),
  });
}

export type Assinatura = {
  id: string;
  bond_id: string;
  produto_id: string;
  person_id: string;
  name: string;
  nome: string;
  valor_cents: number;
  desde: string;
  meses_abertos: number;
  devido_cents: number;
  primeira_aberta: string;
  copia_e_cola: string;
};

/** Assinar é diferente de vender: é um combinado que repete, não uma linha. */
export function assinarProduto(token: string, produtoId: string, bondId: string) {
  return request<Assinatura | { ok: boolean }>(`/v1/owner/produtos/${produtoId}/assinar`, {
    method: "POST",
    token,
    body: JSON.stringify({ bond_id: bondId }),
  });
}

/** Recebe a competência aberta MAIS ANTIGA, uma por vez — a mesma lei da mensalidade. */
export function receberAssinatura(token: string, id: string) {
  return request<{ ok: boolean }>(`/v1/owner/assinaturas/${id}/recebi`, {
    method: "POST",
    token,
  });
}

export function cancelarAssinatura(token: string, id: string) {
  return request<{ ok: boolean }>(`/v1/owner/assinaturas/${id}`, {
    method: "DELETE",
    token,
  });
}

export type Extra = {
  id: string;
  bond_id: string;
  person_id: string;
  name: string;
  descricao: string;
  valor_cents: number;
  criada_em: string;
  recebida_em: string | null;
  copia_e_cola: string;
  /** Quando a venda veio de um PACOTE: quantas sessões tem e quantas sobraram. */
  sessoes: number | null;
  sobram: number | null;
  /** Quando a venda saiu do cardápio. `null` = avulso de dois campos. */
  produto_id: string | null;
};

/** Criar o que ele vende fora da mensalidade. A resposta já traz o Pix pronto: o gesto
 *  seguinte dele é mandar o código, e um segundo pedido no meio seria uma espera. */
export function criarExtra(
  token: string,
  body: { bond_id: string; descricao: string; valor_cents: number },
) {
  return request<Extra>("/v1/owner/extras", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function receberExtra(token: string, id: string, desfazer = false) {
  return request<{ ok: boolean }>(`/v1/owner/extras/${id}/recebi`, {
    method: desfazer ? "DELETE" : "POST",
    token,
  });
}

/** Encerrar, pausar ou reativar o vínculo. Sem isto, quem sai do estúdio continua contando,
 *  faturando e devendo para sempre — e o erro é cumulativo mês a mês. */
export function mudarEstadoDoVinculo(
  token: string,
  bondId: string,
  estado: "active" | "paused" | "ended",
) {
  return request<{ ok: boolean }>(`/v1/owner/bonds/${bondId}/estado`, {
    method: "PUT",
    token,
    body: JSON.stringify({ estado }),
  });
}

/** O QUE O ALUNO VÊ SOBRE O PRÓPRIO COMBINADO — e o único verbo que ele tem.
 *
 *  Nunca devolve estado de atraso: não existe campo para isso, de propósito, para que
 *  nenhuma tela futura consiga desenhar um. O app não cobra o aluno. */
export type MensalidadeDoAluno = {
  valor_cents: number | null;
  due_day: number | null;
  month: string;
  ja_disse: boolean;
  recebido: boolean;
};

/** A LOJA DELA — e o que ela não é: não tem busca, filtro, categoria nem carrinho, e o
 *  verbo não é "comprar". Ela levanta a mão ("quero"), e isso vira um nome na tela do
 *  personal com o produto do lado. Quem fecha a venda é ele, com a frase dele — a mesma lei
 *  do "já paguei". */
export type ItemDaLoja = {
  produto_id: string;
  tipo: "assinatura" | "pacote" | "avulso" | "fisico";
  nome: string;
  preco_cents: number;
  sessoes: number | null;
  ja_pedi: boolean;
};

export function minhaLoja(token: string) {
  return request<{ items: ItemDaLoja[] }>("/v1/student/loja", { token });
}

export function queroEsse(token: string, produtoId: string) {
  return request<{ ok: boolean }>(`/v1/student/loja/${produtoId}/quero`, {
    method: "POST",
    token,
  });
}

/** O DESFAZER DELA, e é o que torna o "Assinar" de um toque aceitável sem diálogo de
 *  confirmação: a casa recusa confirmar toda ação, e a saída que ela prescreve é o desfazer.
 *  Vale só enquanto NADA foi recebido — depois do primeiro mês na mão dele, quem encerra é
 *  ele, e apagar fato de caixa pela tela de quem paga seria reescrever o livro dele. */
export function desistirDoPedido(token: string, produtoId: string) {
  return request<{ ok: boolean }>(`/v1/student/loja/${produtoId}/quero`, {
    method: "DELETE",
    token,
  });
}

export function minhaMensalidade(token: string) {
  return request<MensalidadeDoAluno>("/v1/student/mensalidade", { token });
}

/** "Já paguei": não registra pagamento, não notifica ninguém, não muda um centavo. Vira um
 *  nome no topo da lista do personal para o dedo dele confirmar. */
export function dizerQueJaPaguei(token: string) {
  return request<{ ok: boolean }>("/v1/student/ja-paguei", {
    method: "POST",
    token,
  });
}

/** O toque é gravado ao ABRIR o WhatsApp, nunca ao enviar: o app não tem como saber se a
 *  mensagem foi, e a alternativa a gravar cedo é não gravar nada. Sem este registro,
 *  "assertivo" é superstição bem diagramada — não existe como perguntar se a fila acerta. */
export function registrarToque(token: string, personId: string, motivo: string) {
  return request<{ ok: boolean }>("/v1/owner/toques", {
    method: "POST",
    token,
    body: JSON.stringify({ person_id: personId, motivo }),
  });
}

/** A OPERAÇÃO, com o payload GARANTIDO.
 *
 *  A tela dereferencia listas e objetos direto (`data.a_entregar.length`, `data.visao.entraram`)
 *  e um servidor mais velho — ou qualquer versão que não conheça um campo novo — derrubava a
 *  aba inteira com "Cannot read property 'length' of undefined". Aconteceu no aparelho.
 *
 *  A regra: campo que a tela lê sem `?.` tem que existir aqui. Falta de dado é lista vazia e
 *  zero, nunca `undefined` — o app degrada mostrando menos, jamais mostrando uma tela de erro
 *  vermelha em cima da operação de alguém. Uma normalização na fronteira protege todas as
 *  telas de uma vez; guarda espalhada por componente diverge no primeiro campo novo. */
export function ownerOperacao(token: string): Promise<OwnerOperacao> {
  return request<OwnerOperacao>("/v1/owner/operacao", { token }).then((r) => ({
    ...r,
    student_count: r.student_count ?? 0,
    com_mensalidade: r.com_mensalidade ?? 0,
    receita_cents: r.receita_cents ?? 0,
    ticket_cents: r.ticket_cents ?? 0,
    recebido_cents: r.recebido_cents ?? 0,
    a_vencer_cents: r.a_vencer_cents ?? 0,
    vencido_cents: r.vencido_cents ?? 0,
    ultima_marcacao: r.ultima_marcacao ?? null,
    // Os ITENS também: um servidor mais velho manda a lista com o formato antigo, e a
    // linha lê `motivo`/`acao` sem guarda. Lista certa com item torto quebra igual.
    em_aberto: (r.em_aberto ?? []).map((i) => ({
      ...i,
      copia_e_cola: i.copia_e_cola ?? "",
      diz_que_ja_pagou: i.diz_que_ja_pagou ?? false,
      meses_abertos: i.meses_abertos ?? 1,
      devido_cents: i.devido_cents ?? i.amount_cents,
    })),
    risco: (r.risco ?? []).map((i) => ({
      ...i,
      motivo: i.motivo ?? "",
      acao: i.acao ?? "abrir",
      sinal: i.sinal ?? "",
      phone: i.phone ?? "",
      bond_id: i.bond_id ?? "",
      amount_cents: i.amount_cents ?? 0,
    })),
    sem_combinado: r.sem_combinado ?? [],
    combinados: r.combinados ?? [],
    a_entregar: r.a_entregar ?? [],
    meses: r.meses ?? [],
    produtos: r.produtos ?? [],
    assinaturas: r.assinaturas ?? [],
    placar: r.placar ?? { tocados: 0, voltaram: 0 },
    pix: r.pix ?? { configurado: false, chave: "", nome: "", cidade: "" },
    visao: r.visao ?? {
      entraram: 0,
      sairam: 0,
      permanencia_meses: 0,
      produto_cents: 0,
      maior_fatia_bps: 0,
      maior_nome: "",
    },
  }));
}

export function pagarMensalidade(token: string, bondId: string) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}/pagar`, {
    method: "POST",
    token,
  });
}

/** O COMBINADO: valor e dia do vencimento daquele Vínculo, digitados pelo personal.
 *
 *  A rota existe no backend desde a migration 00006 e NENHUMA tela do app a chamava —
 *  enquanto o rodapé da Operação mandava o personal "digitar na pessoa". Os quatro
 *  números daquela tela são aritmética sobre este dado, então sem esta chamada a
 *  Operação inteira era um relatório sobre algo que o app não sabia criar. */
/** Desfazer o "Recebi". Travado em `meio = 'mao'` no servidor: pagamento de provedor não
 *  some por toque errado. */
export function desfazerPagamento(token: string, bondId: string) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}/pagar`, {
    method: "DELETE",
    token,
  });
}

export function definirMensalidade(
  token: string,
  bondId: string,
  body: { amount_cents: number; due_day: number },
) {
  return request<{ ok: boolean }>(`/v1/owner/mensalidades/${bondId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function patchTime(
  token: string,
  body: {
    name?: string;
    accent_color?: string;
    logo_object_key?: string;
    config?: TimeConfig;
    /** A chave de recebimento do personal, e os dois campos que o padrão do Banco Central
     *  exige junto dela. O BR Code é montado a partir daqui e o dinheiro do aluno vai
     *  DIRETO para a conta dele: a LinkGym não custodia e não intermedia. String vazia
     *  limpa. */
    chave_pix?: string;
    nome_recebedor?: string;
    cidade_recebedor?: string;
  },
) {
  return request<{ ok: boolean }>("/v1/owner/time", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

/** O CONVITE: a porta do aluno, e o primeiro artefato da marca do personal que sai do
 *  app. Telefone é opcional — sem ele o convite é aberto e serve para quem for. Com ele, a
 *  API devolve o convite ABERTO daquele número se já houver um, em vez de empilhar
 *  códigos: tocar duas vezes no botão manda o mesmo link. */
export function criarConvite(token: string, phone?: string) {
  return request<{ code: string; phone?: string; expires_at: string }>(
    "/v1/owner/invites",
    {
      method: "POST",
      token,
      body: JSON.stringify(phone ? { phone } : {}),
    },
  );
}

export function presignMedia(
  token: string,
  kind: "avatar" | "logo",
  contentType: string,
) {
  return request<{ object_key: string; upload_url: string }>(
    "/v1/media/presign",
    {
      method: "POST",
      token,
      body: JSON.stringify({ kind, content_type: contentType }),
    },
  );
}

export function patchMe(
  token: string,
  body: { name?: string; avatar_color?: string; avatar_object_key?: string },
) {
  return request<MePayload>("/v1/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export type OwnerAttention = OwnerHome["attention"][number];

export function ownerAttention(token: string) {
  return request<{ items: OwnerAttention[] }>("/v1/owner/attention", { token });
}

export function applyOwnerAttention(token: string, id: string) {
  return request<{ ok: boolean }>(`/v1/owner/attention/${id}/apply`, {
    method: "POST",
    token,
  });
}

export async function completeComeback(token: string, id: string) {
  try {
    return await request<{ ok: boolean }>(`/v1/comebacks/${id}/complete`, {
      method: "POST",
      token,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { ok: true };
    }
    throw err;
  }
}

export type SessionStart = {
  id: string;
  local_id: string;
  started_at: string;
};

export type FinishRecord = {
  exercise_name: string;
  load_kg: number;
  previous_kg: number;
};

export type FinishPayload = {
  ofensiva: { current_count: number; protector_available: boolean };
  xp_gained: number;
  xp_total: number;
  records: FinishRecord[];
  badge_keys: string[];
};

export type SessionSetBody = {
  local_id: string;
  prescription_item_id: string;
  exercise_id: string;
  swapped_from_exercise_id: string | null;
  set_index: number;
  reps: number;
  load_kg: number;
  rest_seconds: number;
  effort?: 1 | 2 | 3;
  performed_at: string;
};

export function startSession(
  token: string,
  body: { local_id: string; prescription_id: string },
) {
  return request<SessionStart>("/v1/sessions", {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function addSessionSet(
  token: string,
  sessionId: string,
  body: SessionSetBody,
) {
  return request<SessionSetBody>(`/v1/sessions/${sessionId}/sets`, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
}

export function finishSession(
  token: string,
  sessionId: string,
  effort: 1 | 2 | 3,
) {
  return request<FinishPayload>(`/v1/sessions/${sessionId}/finish`, {
    method: "POST",
    token,
    body: JSON.stringify({ effort }),
  });
}

export function swapExercise(
  token: string,
  sessionId: string,
  fromExerciseId: string,
  toExerciseId: string,
) {
  return request<{ ok: boolean }>(`/v1/sessions/${sessionId}/swap`, {
    method: "POST",
    token,
    body: JSON.stringify({
      from_exercise_id: fromExerciseId,
      to_exercise_id: toExerciseId,
    }),
  });
}

export type OwnerReturn = {
  alert_id: string;
  person_id: string;
  name: string;
  effort: number;
  records: FinishRecord[];
  /** Trocas feitas no meio da sessão. Avisam o personal; não quebram a ofensiva. */
  swaps?: { from: string; to: string }[];
  created_at: string;
};

export function ownerReturns(token: string) {
  return request<{ items: OwnerReturn[] }>("/v1/owner/returns", { token });
}

export function applyOwnerReturn(
  token: string,
  alertId: string,
  bumpKg: number,
) {
  return request<{ ok: boolean }>(`/v1/owner/returns/${alertId}/apply`, {
    method: "POST",
    token,
    body: JSON.stringify({ bump_kg: bumpKg }),
  });
}

export type OwnerWeekItem = {
  person_id: string;
  name: string;
  adherence: string;
  suggested: string;
  selected: boolean;
};

export function ownerWeek(token: string, from?: string) {
  const q = from ? `?from=${encodeURIComponent(from)}` : "";
  return request<{ items: OwnerWeekItem[] }>(`/v1/owner/week${q}`, { token });
}

export function approveOwnerWeek(token: string, personIds: string[]) {
  return request<{ count: number }>("/v1/owner/week/approve", {
    method: "POST",
    token,
    body: JSON.stringify({ person_ids: personIds }),
  });
}

export type OwnerStudent = {
  person_id: string;
  bond_id: string;
  name: string;
  last_effort: number | null;
  last_loads: { exercise_name: string; load_kg: number }[];
  ofensiva: { current_count: number };
  suggested: string;
  commitment_text: string | null;
  /** O combinado desta pessoa. `null` = o personal nunca digitou — e é essa ausência que
   *  a tela usa para oferecer "Combinar o valor" em vez de desenhar um R$ 0 mentiroso. */
  combinado: { amount_cents: number; due_day: number } | null;
  /** O que ela assina hoje. Mora aqui e não na fila do mês da Operação: aquela lista é o
   *  TRABALHO do mês (quem deve o quê) e encerrar não é trabalho do mês — é mudança de
   *  combinado, e combinado é assunto da pessoa. Era a porta de saída que não existia. */
  assinaturas: {
    id: string;
    produto_id: string;
    nome: string;
    valor_cents: number;
    desde: string;
  }[];
  /** O que ela respondeu na entrada. `null` quando ainda não respondeu — a tela não
   *  inventa "nunca treinei" no lugar de um vazio. */
  onboarding?: {
    experience: "never" | "before" | "training";
    days_per_week: number;
    pain: boolean;
    sex?: string;
    height_cm?: number;
    weight_kg?: number;
  } | null;
};

export function ownerStudent(token: string, id: string) {
  // A lista nasce vazia quando o servidor é mais velho que a tela: degradar é a regra da
  // fronteira, e uma tela que quebra por causa de um campo novo é pior que uma sem o bloco.
  return request<OwnerStudent>(`/v1/owner/students/${id}`, { token }).then((r) => ({
    ...r,
    assinaturas: r.assinaturas ?? [],
    onboarding: r.onboarding ?? null,
  }));
}

export type ModelSummary = {
  id: string;
  name: string;
};

export function listModels(token: string) {
  return request<{ items: ModelSummary[] }>("/v1/models", { token });
}

export type ModelItem = {
  id: string;
  exercise_id: string;
  name: string;
  position: number;
  planned_sets: number;
  planned_reps: string;
  starter_load_kg: number;
};

export type ModelDetail = {
  id: string;
  name: string;
  items: ModelItem[];
};

export function getModel(token: string, id: string) {
  return request<ModelDetail>(`/v1/models/${id}`, { token });
}

export type Exercise = {
  id: string;
  name: string;
  has_video: boolean;
};

export function listExercises(token: string) {
  return request<{ items: Exercise[] }>("/v1/exercises", { token });
}

export type NewModelItem = {
  exercise_id: string;
  planned_sets: number;
  planned_reps: string;
  rest_seconds?: number | null;
  notes?: string | null;
  starter_load_kg?: number | null;
};

export function createModel(token: string, name: string, items: NewModelItem[]) {
  return request<ModelDetail>("/v1/models", {
    method: "POST",
    token,
    body: JSON.stringify({ name, items }),
  });
}

export function renameModel(token: string, id: string, name: string) {
  return request<{ ok: boolean }>(`/v1/models/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ name }),
  });
}

export function deleteModel(token: string, id: string) {
  return request<{ ok: boolean }>(`/v1/models/${id}`, {
    method: "DELETE",
    token,
  });
}

export function putModelItems(token: string, id: string, items: NewModelItem[]) {
  return request<ModelDetail>(`/v1/models/${id}/items`, {
    method: "PUT",
    token,
    body: JSON.stringify({ items }),
  });
}

export type DraftItem = {
  id: string;
  exercise_id: string;
  name: string;
  planned_sets: number;
  planned_reps: string;
  load_kg: number;
  /** De onde a carga veio. 'history' = o CORPO levantou; 'prescription' = a ficha
   *  anterior pediu e o corpo ainda nao fez; 'starter' = chute do Modelo; 'manual' = o
   *  personal cravou. Os quatro sao distintos de proposito: e onde o personal ve o que
   *  ainda precisa decidir. */
  load_source: "history" | "prescription" | "starter" | "manual";
  /** A frase do personal neste exercício. Ausente é ausente. */
  notes?: string | null;
};

export function draftFromLast(
  token: string,
  modelId: string,
  personId: string,
  from: "last" | "model" = "last",
) {
  return request<{ draft_id: string; items: DraftItem[] }>(
    `/v1/models/${modelId}/draft-from-last`,
    {
      method: "POST",
      token,
      body: JSON.stringify({ person_id: personId, from }),
    },
  );
}

export function patchPrescriptionItem(
  token: string,
  prescriptionId: string,
  itemId: string,
  body: {
    load_kg: number;
    planned_sets: number;
    planned_reps: string;
    notes?: string | null;
  },
) {
  return request<{ ok: boolean }>(
    `/v1/prescriptions/${prescriptionId}/items/${itemId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    },
  );
}

/** `coachLine` é a frase que o personal escreveu para o dia, na voz dele. Vazia é o
 *  caso normal: o /v1/today devolve vazio e a tela do aluno não desenha bloco nenhum —
 *  o app não assina no lugar de quem não escreveu. */
export function publishPrescription(
  token: string,
  prescriptionId: string,
  alsoPersonIds: string[],
  coachLine = "",
) {
  return request<{ ok: boolean }>("/v1/publish", {
    method: "POST",
    token,
    body: JSON.stringify({
      prescription_id: prescriptionId,
      also_person_ids: alsoPersonIds,
      coach_line: coachLine,
    }),
  });
}

export type LeagueRow = {
  name: string;
  xp_total: number;
  me: boolean;
};

export type ProgressPayload = {
  ofensiva: { current_count: number; protector_available: boolean };
  xp_total: number;
  league: LeagueRow[];
  badges: { badge_key: string; earned_at: string }[];
  prontidao_week: { for_date: string; score: number }[];
};

export type RecordItem = {
  exercise_name: string;
  load_kg: number;
  reps: number;
  achieved_at: string;
  history: { load_kg: number; achieved_at: string }[];
};

export function progress(token: string) {
  return request<ProgressPayload>("/v1/progress", { token });
}

export function records(token: string) {
  return request<{ items: RecordItem[] }>("/v1/records", { token });
}

export type OnboardingBody = {
  experience: "never" | "before" | "training";
  days_per_week: 2 | 3 | 4 | 5 | 6;
  pain: boolean;
  sex?: "male" | "female";
  height_cm?: number;
  weight_kg?: number;
};

export function putOnboarding(token: string, body: OnboardingBody) {
  return request<{ ok: boolean }>("/v1/onboarding", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export function putCommitment(token: string, daysPerWeek: 2 | 3 | 4 | 5 | 6) {
  return request<{ ok: boolean }>("/v1/commitment", {
    method: "PUT",
    token,
    body: JSON.stringify({ days_per_week: daysPerWeek }),
  });
}
