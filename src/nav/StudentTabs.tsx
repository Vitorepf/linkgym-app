import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Studio } from "../api";
import { Hoje } from "../screens/student/Hoje";
import { Perfil } from "../screens/student/Perfil";
import { Progresso } from "../screens/student/Progresso";
import { productTheme } from "../theme";
import { RoleTabLabel, roleTabScreenOptions } from "./tabChrome";
import type { StudentTabParamList } from "./types";

/** Root stack route that hosts these tabs. Reset here to land on the Hoje tab. */
export const STUDENT_HOME_ROUTE = "Hoje" as const;

export const studentHomeTarget = {
  name: STUDENT_HOME_ROUTE,
  params: { screen: "Hoje" as const },
};

type Props = {
  token: string;
  person: Person;
  studio: Studio;
  needsCommitment: boolean;
  onLeave: () => void;
};

const Tab = createBottomTabNavigator<StudentTabParamList>();

export function StudentTabs({
  token,
  person,
  studio,
  needsCommitment,
  onLeave,
}: Props) {
  const accent = studio.accent_color || productTheme.accentFallback;

  return (
    <Tab.Navigator
      initialRouteName="Hoje"
      screenOptions={roleTabScreenOptions(accent)}
    >
      <Tab.Screen
        name="Hoje"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="HOJE" color={color} />
          ),
          tabBarAccessibilityLabel: "Hoje",
        }}
      >
        {() => (
          <Hoje
            token={token}
            person={person}
            studio={studio}
            needsCommitment={needsCommitment}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Progresso"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="PROGRESSO" color={color} />
          ),
          tabBarAccessibilityLabel: "Progresso",
        }}
      >
        {() => <Progresso token={token} person={person} studio={studio} />}
      </Tab.Screen>
      <Tab.Screen
        name="Perfil"
        options={{
          tabBarLabel: ({ color }) => (
            <RoleTabLabel label="PERFIL" color={color} />
          ),
          tabBarAccessibilityLabel: "Perfil",
        }}
      >
        {() => (
          <Perfil
            token={token}
            person={person}
            studio={studio}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
