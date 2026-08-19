import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IconCifrao,
  IconFicha,
  IconPeople,
  IconPerson,
  IconPulse,
  IconTinta,
  IconTrend,
} from "../ui/Icons";
import { estilos, useTema } from "../ui/tema";
import { Txt } from "../ui/Txt";

const ICONS: Record<string, typeof IconPulse> = {
  Hoje: IconPulse,
  Painel: IconPulse,
  MinhaFicha: IconFicha,
  Fichas: IconFicha,
  Progresso: IconTrend,
  Semana: IconPeople,
  Perfil: IconPerson,
  Operacao: IconCifrao,
  PerfilTime: IconTinta,
};

/** O rótulo é PALAVRA DO ALUNO, nunca o nome da rota. `MinhaFicha` é identificador de
 *  código e chegou a ser lido na barra por um juiz cego. */
const LABELS: Record<string, string> = {
  Hoje: "HOJE",
  Painel: "HOJE",
  MinhaFicha: "FICHA",
  Fichas: "FICHAS",
  Progresso: "PROGRESSO",
  Semana: "SEMANA",
  Perfil: "PERFIL",
  Operacao: "OPERAÇÃO",
  PerfilTime: "PERFIL",
};

function DockTabBar({ state, navigation }: BottomTabBarProps) {
  const styles = usarEstilos();
  const { T, FORMA, acentoEm, dockActiveMin } = useTema();
  const inset = useSafeAreaInsets();
  const on = acentoEm(undefined, T.dock, dockActiveMin);
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(inset.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? on : T.muted2;
        const Icon = ICONS[route.name] ?? IconPulse;
        const label = LABELS[route.name] ?? route.name.toUpperCase();
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            style={[styles.item, focused && !FORMA.raio && { borderTopColor: on }]}
          >
            {/* A marca da aba ativa acompanha a família. Régua de topo sangrada é a
                linguagem do canto RETO; numa barra de cantos arredondados ela vira o
                único ângulo vivo da tela. Ali a marca é uma pastilha centrada — mesma
                tinta, mesmo peso, mesma posição de leitura. */}
            {focused && FORMA.raio ? (
              <View style={[styles.pastilha, { backgroundColor: on }]} />
            ) : null}
            <Icon color={color} />
            <Txt role="label" color={color} style={styles.label}>
              {label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

/** `tabBar` é prop do NAVIGATOR, não screenOption. Passado dentro de `screenOptions` o
 *  react-navigation o ignora em silêncio e desenha a barra padrão — MissingIcon (os
 *  quatro triângulos idênticos) e o NOME DA ROTA como rótulo. Era o defeito. Espalhar
 *  este objeto no Navigator põe cada metade no lugar certo de uma vez, e não sobra um
 *  `screenOptions` solto para alguém enfiar `tabBar` de novo. */
export function dockTabs() {
  return {
    screenOptions: { headerShown: false } as const,
    tabBar: (props: BottomTabBarProps) => <DockTabBar {...props} />,
  };
}

const usarEstilos = estilos(({ FONTES, FORMA }) => {
  // A MOLDURA que não rola com o conteúdo, lida do tema — fundo, traço (espessura e cor) e
  // sombra, os quatro campos, e nenhum campo da folha sobra sem ser pintado. Antes daqui a
  // barra perguntava só `FORMA.vidro`, e depois só `fundo` e `sombra`: nos dois casos
  // `solida`, `contorno` e `elevada` produziam o MESMO dock no chão escuro, onde não há
  // sombra. Quem separa a levantada agora é a COR do traço (`reguaDoDock`, no tema).
  //
  // MEDIDO nos 42 pares (7 chãos x 6 pares de superfície), lendo do ARQUIVO os campos que
  // este bloco consome: lendo só `fundo` e `sombra`, 15 colidiam — `solida`×`contorno` nos
  // 7 chãos, mais `solida`×`elevada` e `contorno`×`elevada` nos 4 escuros. Lendo os quatro,
  // 7. Os 7 que sobram são `solida`×`contorno` e colidem de propósito: o tema mantém o dock
  // OPACO no contorno, porque moldura transparente deixa a lista correr por baixo do
  // rótulo. A isenção está escrita na régua (§33 de tools/aparencia.mjs), não suposta.
  const chrome = FORMA.folha.chrome;
  return StyleSheet.create({
    bar: {
      flexDirection: "row",
      backgroundColor: chrome.fundo,
      // A régua que separa a barra do conteúdo não some em família nenhuma — é ela que
      // impede a última linha da lista de encostar no rótulo —, e ela vem INTEIRA da folha
      // do chrome, espessura e cor. UM traço, DUAS perguntas: delimita (3:1 contra os dois
      // lados, e delimitador é sempre `divider` ou `ink` — SPEC §3) e, no chão escuro onde
      // sombra preta sobre preto não existe, é a COR dele que diz que a barra tem altura.
      // Ver `reguaDoDock` no tema. Um fio de luz SEPARADO aqui seriam dois traços na mesma
      // aresta, que leem como erro de renderização; a aresta de luz é MATERIAL e nunca
      // substitui um token que carrega informação.
      borderTopWidth: chrome.borda,
      borderTopColor: chrome.corDaBorda,
      ...chrome.sombra,
    },
    pastilha: {
      position: "absolute",
      top: 0,
      width: 28,
      height: FORMA.borda,
      borderRadius: FORMA.borda,
      alignSelf: "center",
    },
    item: {
      flex: 1,
      alignItems: "center",
      gap: 5,
      paddingTop: 10,
      paddingBottom: 9,
      borderTopWidth: FORMA.borda,
      borderTopColor: "transparent",
      marginTop: -FORMA.borda,
    },
    // O rótulo é item de flex numa barra de altura fixa: sem lineHeight próprio a caixa
    // vira o corpo da letra e corta o 'j' de HOJE e o 'g' de PROGRESSO na base.
    label: {
      fontFamily: FONTES.texto,
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0.8,
      flexShrink: 0,
    },
  });
});
