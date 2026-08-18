import type { FinishRecord, TodayItem } from "../api";

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
};

export type RootStackParamList = {
  Painel: undefined;
  Retorno: {
    token: string;
    studioName: string;
    accent: string;
  };
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
  };
};
