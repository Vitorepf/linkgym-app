import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Studio } from "../api";
import { FichaTab } from "../screens/student/FichaTab";
import { Hoje } from "../screens/student/Hoje";
import { Perfil } from "../screens/student/Perfil";
import { Progresso } from "../screens/student/Progresso";
import { productTheme } from "../theme";
import { roleTabScreenOptions } from "./tabChrome";
import type { StudentTabParamList } from "./types";

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
        options={{ tabBarAccessibilityLabel: "Hoje" }}
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
        name="MinhaFicha"
        options={{ tabBarAccessibilityLabel: "Ficha" }}
      >
        {() => (
          <FichaTab token={token} person={person} studio={studio} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Progresso"
        options={{ tabBarAccessibilityLabel: "Progresso" }}
      >
        {() => <Progresso token={token} person={person} studio={studio} />}
      </Tab.Screen>
      <Tab.Screen
        name="Perfil"
        options={{ tabBarAccessibilityLabel: "Perfil" }}
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
