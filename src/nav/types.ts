import type { TodayItem } from "../api";

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
};
