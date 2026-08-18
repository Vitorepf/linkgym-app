import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Studio } from "../api";
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
  studio: Studio;
  onLeave: () => void;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export function OwnerTabs({ token, person, studio, onLeave }: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;

  return (
    <Tab.Navigator initialRouteName="Painel" {...dockTabs(accent)}>
      <Tab.Screen name="Painel">
        {() => (
          <Painel
            token={token}
            person={person}
            studio={studio}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Semana">
        {() => (
          <Revisao
            token={token}
            studioName={studio.name}
            accent={accent}
            tab
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Fichas">
        {() => (
          <Base
            token={token}
            studioName={studio.name}
            accent={accent}
            tab
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
