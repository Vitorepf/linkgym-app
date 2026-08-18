import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Time } from "../api";
import { FichaTab } from "../screens/student/FichaTab";
import { Hoje } from "../screens/student/Hoje";
import { Perfil } from "../screens/student/Perfil";
import { Progresso } from "../screens/student/Progresso";
import { productTheme } from "../theme";
import { dockTabs } from "./tabChrome";
import type { StudentTabParamList } from "./types";

export const STUDENT_HOME_ROUTE = "Hoje" as const;

export const studentHomeTarget = {
  name: STUDENT_HOME_ROUTE,
  params: { screen: "Hoje" as const },
};

type Props = {
  token: string;
  person: Person;
  time: Time;
  needsCommitment: boolean;
  onLeave: () => void;
};

const Tab = createBottomTabNavigator<StudentTabParamList>();

export function StudentTabs({
  token,
  person,
  time,
  needsCommitment,
  onLeave,
}: Props) {
  const accent = time.accent_color || productTheme.accentFallback;

  return (
    <Tab.Navigator initialRouteName="Hoje" {...dockTabs(accent)}>
      <Tab.Screen name="Hoje">
        {() => (
          <Hoje
            token={token}
            person={person}
            time={time}
            needsCommitment={needsCommitment}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="MinhaFicha">
        {() => (
          <FichaTab token={token} person={person} time={time} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Progresso">
        {() => <Progresso token={token} person={person} time={time} />}
      </Tab.Screen>
      <Tab.Screen name="Perfil">
        {() => (
          <Perfil
            token={token}
            person={person}
            time={time}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
