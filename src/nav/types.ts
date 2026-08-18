import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DraftItem, FinishRecord, TodayItem } from "../api";
import type { SessionProof } from "../offline/sessionQueue";

export type SessionRoute = {
  token: string;
  timeName: string;
  accent: string;
  localId: string;
  prescriptionId: string;
  items: TodayItem[];
  itemIndex: number;
  setIndex: number;
  ofensivaCount: number;
  xpTotal: number;
  needsCommitment: boolean;
};

export type OwnerTabParamList = {
  Painel: undefined;
  Semana: undefined;
  Fichas: undefined;
};

export type StudentTabParamList = {
  Hoje: undefined;
  MinhaFicha: undefined;
  Progresso: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Painel: NavigatorScreenParams<OwnerTabParamList> | undefined;
  Retorno: {
    token: string;
    timeName: string;
    accent: string;
  };
  Atencao: {
    token: string;
    timeName: string;
    accent: string;
  };
  Revisao: {
    token: string;
    timeName: string;
    accent: string;
  };
  Aluna: {
    token: string;
    personId: string;
    timeName: string;
    accent: string;
  };
  Base: {
    token: string;
    timeName: string;
    accent: string;
    personId?: string;
    personName?: string;
  };
  Ajustar: {
    token: string;
    timeName: string;
    accent: string;
    prescriptionId: string;
    personId: string;
    personName: string;
    items: DraftItem[];
  };
  Publicar: {
    token: string;
    timeName: string;
    accent: string;
    prescriptionId: string;
    personId: string;
    personName: string;
  };
  SobreVoce: undefined;
  Pronto: undefined;
  Estreia: undefined;
  Retomada: undefined;
  Compromisso: undefined;
  Hoje: NavigatorScreenParams<StudentTabParamList> | undefined;
  Ficha: {
    token: string;
    timeName: string;
    accent: string;
    items: TodayItem[];
    prescriptionId: string;
  };
  ComoFazer: {
    token: string;
    timeName: string;
    accent: string;
    item: TodayItem;
    items: TodayItem[];
    prescriptionId: string;
  };
  Serie: SessionRoute;
  Descanso: SessionRoute & { restSeconds: number; last: boolean };
  Feito: {
    timeName: string;
    accent: string;
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
    accent: string;
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
