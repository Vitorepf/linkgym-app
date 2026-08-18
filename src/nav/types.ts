import type { DraftItem, FinishRecord, TodayItem } from "../api";

export type SessionRoute = {
  token: string;
  studioName: string;
  accent: string;
  clientId: string;
  prescriptionId: string;
  items: TodayItem[];
  itemIndex: number;
  setIndex: number;
  streakCount: number;
  xpTotal: number;
  needsCommitment: boolean;
};

export type RootStackParamList = {
  Painel: undefined;
  Retorno: {
    token: string;
    studioName: string;
    accent: string;
  };
  Atencao: {
    token: string;
    studioName: string;
    accent: string;
  };
  Revisao: {
    token: string;
    studioName: string;
    accent: string;
  };
  Aluna: {
    token: string;
    personId: string;
    studioName: string;
    accent: string;
  };
  Base: {
    token: string;
    studioName: string;
    accent: string;
    personId?: string;
    personName?: string;
  };
  Ajustar: {
    token: string;
    studioName: string;
    accent: string;
    prescriptionId: string;
    personId: string;
    personName: string;
    items: DraftItem[];
  };
  Publicar: {
    token: string;
    studioName: string;
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
  Hoje: undefined;
  Ficha: {
    token: string;
    studioName: string;
    accent: string;
    items: TodayItem[];
    prescriptionId: string;
  };
  ComoFazer: {
    token: string;
    studioName: string;
    accent: string;
    item: TodayItem;
    items: TodayItem[];
    prescriptionId: string;
  };
  Serie: SessionRoute;
  Descanso: SessionRoute & { restSeconds: number; last: boolean };
  Feito: {
    studioName: string;
    accent: string;
    streakCount: number;
    xpGained: number;
    xpTotal: number;
    records: FinishRecord[];
    pending?: boolean;
    needsCommitment?: boolean;
  };
  Recorde: {
    accent: string;
    records: FinishRecord[];
    needsCommitment?: boolean;
  };
  Progresso: undefined;
  Perfil: undefined;
};
