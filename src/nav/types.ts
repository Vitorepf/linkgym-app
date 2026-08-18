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
  Hoje: undefined;
  Ficha: {
    studioName: string;
    accent: string;
    items: TodayItem[];
  };
  ComoFazer: {
    studioName: string;
    accent: string;
    item: TodayItem;
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
