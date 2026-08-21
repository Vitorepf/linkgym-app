import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DraftItem, FinishRecord, Produto, TodayItem } from "../api";
import type { CombinadoRoute } from "../screens/owner/Combinado";
import type { SessionProof } from "../offline/sessionQueue";

/** ponytail: `accent` saiu de TODA rota. A cor do personal é o TEMA (src/ui/tema.tsx), e
 *  parâmetro de rota é CONGELADO no momento do navigate — com uma tela empilhada aberta,
 *  trocar a cor no Perfil deixava aquela tela pintando a cor velha até o usuário voltar.
 *  Cópia de estado global em parâmetro de rota é bug esperando data. */
export type SessionRoute = {
  token: string;
  timeName: string;
  localId: string;
  prescriptionId: string;
  items: TodayItem[];
  itemIndex: number;
  setIndex: number;
  ofensivaCount: number;
  xpTotal: number;
  needsCommitment: boolean;
  /** passo do ajuste de carga (config do Time); 2,5 quando o Time não configurou. */
  passoKg?: number;
};

export type OwnerTabParamList = {
  Painel: undefined;
  Semana: undefined;
  Operacao: undefined;
  Mais: undefined;
};

export type StudentTabParamList = {
  Hoje: undefined;
  MinhaFicha: undefined;
  Progresso: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Painel: NavigatorScreenParams<OwnerTabParamList> | undefined;
  /** Sem parâmetro de propósito: quem a monta é o Root, que já tem token, time e o
   *  onTimeChange. Empurrar o Time inteiro por parâmetro de rota é serializar estado que
   *  já existe uma linha acima. */
  Aparencia: undefined;
  ComoFunciona: undefined;
  Convite: undefined;
  /** White-label e saída. Era aba; agora mora atrás da Casa, porque a barra só
   *  carrega o trabalho do dia — Operação, Hoje, Semana. */
  PerfilTime: undefined;
  /** A turma inteira: buscar, chamar, conversar. Era a aba Fichas, e Ficha é outra
   *  coisa — o treino, não a pessoa. */
  Alunos: undefined;
  /** As fichas de treino (Modelos). Lista; o detalhe é `Modelo`. */
  Modelos: undefined;
  Modelo: {
    token: string;
    timeName: string;
    modelId: string;
    modelName?: string;
  };
  /** Montar ou editar um Modelo. Sem `modelId` é ficha nova; com ele, a estrutura
   *  que já existe. `modelName` é o título otimista até o GET voltar. */
  NovaModelo: {
    token: string;
    timeName: string;
    modelId?: string;
    modelName?: string;
  };
  Retorno: {
    token: string;
    timeName: string;
  };
  Atencao: {
    token: string;
    timeName: string;
  };
  Revisao: {
    token: string;
    timeName: string;
  };
  Aluna: {
    token: string;
    personId: string;
    timeName: string;
  };
  /** O combinado, em lote ou em um. `pessoas` viaja por parâmetro porque a lista já veio
   *  no payload da Operação (ou da própria pessoa): buscar de novo aqui seria uma segunda
   *  ida à rede para o mesmo dado que a tela anterior tem na mão. */
  Combinado: CombinadoRoute;
  /** O que ele vende fora da mensalidade. `produtos` viaja por parâmetro porque a lista já
   *  veio no payload da Operação — buscar de novo seria uma segunda ida à rede pelo mesmo
   *  dado que a tela anterior tem na mão. */
  Produtos: { token: string; timeName: string; produtos: Produto[] };
  /** `personId` é obrigatório: prescrever é sempre PARA alguém, e o opcional daqui era o
   *  que deixava a tela escolher um aluno sozinha. */
  Base: {
    token: string;
    timeName: string;
    personId: string;
    personName: string;
  };
  Ajustar: {
    token: string;
    timeName: string;
    prescriptionId: string;
    personId: string;
    personName: string;
    items: DraftItem[];
  };
  Publicar: {
    token: string;
    timeName: string;
    prescriptionId: string;
    personId: string;
    personName: string;
  };
  SobreVoce: undefined;
  Pronto: undefined;
  Estreia: undefined;
  Compromisso: undefined;
  Hoje: NavigatorScreenParams<StudentTabParamList> | undefined;
  Ficha: {
    token: string;
    timeName: string;
    items: TodayItem[];
    prescriptionId: string;
  };
  ComoFazer: {
    token: string;
    timeName: string;
    item: TodayItem;
    items: TodayItem[];
    prescriptionId: string;
  };
  Serie: SessionRoute;
  Descanso: SessionRoute & { restSeconds: number; last: boolean };
  Feito: {
    timeName: string;
    ofensivaCount: number;
    xpTotal: number;
    xpGained: number;
    records: FinishRecord[];
    /** Lido da sessão local ANTES do flush, que apaga a sessão. Opcional porque pode não
     *  existir (sessão sem série gravada); ausente = a tela não desenha a prova. */
    proof?: SessionProof;
    pending?: boolean;
    needsCommitment?: boolean;
  };
  Recorde: {
    records: FinishRecord[];
    needsCommitment?: boolean;
  };
};

export type OwnerTabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<OwnerTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type StudentTabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<StudentTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
