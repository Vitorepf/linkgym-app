import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Time } from "../api";
import { Mais } from "../screens/owner/Mais";
import { Operacao } from "../screens/owner/Operacao";
import { Painel } from "../screens/owner/Painel";
import { Revisao } from "../screens/owner/Revisao";
import { dockTabs } from "./tabChrome";
import type { OwnerTabParamList } from "./types";

export const OWNER_HOME_ROUTE = "Painel" as const;

type Props = {
  token: string;
  person: Person;
  time: Time;
  onTimeChange: (next: Time) => void;
  onLeave: () => void;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export function OwnerTabs({ token, person, time }: Props) {

  return (
    <Tab.Navigator initialRouteName="Painel" {...dockTabs()}>
      {/* A operação: as leituras da Mensalidade sobre a turma, quem está em aberto e
          quem está perto de sumir. Primeira na barra porque é o dinheiro e a casa
          rodando; o Painel continua sendo a aba de HOJE, o destino inicial. */}
      <Tab.Screen name="Operacao">
        {() => <Operacao token={token} time={time} />}
      </Tab.Screen>
      <Tab.Screen name="Painel">
        {() => (
          <Painel
            token={token}
            person={person}
            time={time}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Semana">
        {() => (
          <Revisao
            token={token}
            timeName={time.name}
          />
        )}
      </Tab.Screen>
      {/* A CASA: perfil, ficha de treino e a turma. Não cabem na barra do dia, e
          "mais" era o rótulo de gaveta. Daqui cada um empilha sozinho. */}
      <Tab.Screen name="Mais">
        {() => <Mais time={time} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
