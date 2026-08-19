import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { Person, Time } from "../api";
import { Operacao } from "../screens/owner/Operacao";
import { Painel } from "../screens/owner/Painel";
import { PerfilTime } from "../screens/owner/PerfilTime";
import { Revisao } from "../screens/owner/Revisao";
import { Turma } from "../screens/owner/Turma";
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

export function OwnerTabs({ token, person, time, onTimeChange, onLeave }: Props) {

  return (
    <Tab.Navigator initialRouteName="Painel" {...dockTabs()}>
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
      {/* A aba lista a TURMA. Ela montava a Base sem `personId`, e a Base caía no
          primeiro nome da semana: a aba de fichas abria a ficha de um aluno arbitrário.
          A escolha da pessoa é o primeiro ato de prescrever, não um padrão. */}
      <Tab.Screen name="Fichas">
        {() => (
          <Turma
            token={token}
            timeName={time.name}
          />
        )}
      </Tab.Screen>
      {/* A operação: as leituras da Mensalidade sobre a turma, quem está em aberto e
          quem está perto de sumir. O Painel continua sendo a aba de HOJE; esta é a de
          manter e escalar. */}
      <Tab.Screen name="Operacao">
        {() => <Operacao token={token} time={time} />}
      </Tab.Screen>
      {/* O white-label e a saída moram aqui — o Sair no meio do Painel era um botão
          morto na tela de trabalho. */}
      <Tab.Screen name="PerfilTime">
        {() => (
          <PerfilTime
            token={token}
            time={time}
            onTimeChange={onTimeChange}
            onLeave={onLeave}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
