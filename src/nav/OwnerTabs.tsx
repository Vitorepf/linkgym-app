import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Studio } from "../api";
import { Base } from "../screens/owner/Base";
import { Painel } from "../screens/owner/Painel";
import { Revisao } from "../screens/owner/Revisao";
import { productTheme } from "../theme";
import { RoleTabLabel, roleTabScreenOptions } from "./tabChrome";
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
    <Tab.Navigator
      initialRouteName="Painel"
      screenOptions={roleTabScreenOptions(accent)}
    >
      <Tab.Screen
        name="Painel"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="PAINEL" color={color} />
          ),
          tabBarAccessibilityLabel: "Painel",
        }}
      >
        {() => (
          <Painel
            token={token}
            person={person}
            studio={studio}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Semana"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="SEMANA" color={color} />
          ),
          tabBarAccessibilityLabel: "Semana",
        }}
      >
        {() => (
          <Revisao
            token={token}
            studioName={studio.name}
            accent={accent}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Fichas"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="FICHAS" color={color} />
          ),
          tabBarAccessibilityLabel: "Fichas",
        }}
      >
        {() => (
          <Base
            token={token}
            studioName={studio.name}
            accent={accent}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
