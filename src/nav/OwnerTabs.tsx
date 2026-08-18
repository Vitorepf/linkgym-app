import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Time } from "../api";
import { Base } from "../screens/owner/Base";
import { Painel } from "../screens/owner/Painel";
import { Revisao } from "../screens/owner/Revisao";
import { productTheme } from "../theme";
import { dockTabs } from "./tabChrome";
import type { OwnerTabParamList } from "./types";

export const OWNER_HOME_ROUTE = "Painel" as const;

type Props = {
  token: string;
  person: Person;
  time: Time;
  onLeave: () => void;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export function OwnerTabs({ token, person, time, onLeave }: Props) {
  const accent = time.accent_color || productTheme.accentFallback;

  return (
    <Tab.Navigator initialRouteName="Painel" {...dockTabs(accent)}>
      <Tab.Screen name="Painel">
        {() => (
          <Painel
            token={token}
            person={person}
            time={time}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Semana">
        {() => (
          <Revisao
            token={token}
            timeName={time.name}
            accent={accent}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Fichas">
        {() => (
          <Base
            token={token}
            timeName={time.name}
            accent={accent}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
