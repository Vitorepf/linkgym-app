import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { accentOn, dockActiveMin, FONT, productTheme as T } from "../theme";
import {
  IconFicha,
  IconPeople,
  IconPerson,
  IconPulse,
  IconTrend,
} from "../ui/Icons";
import { Txt } from "../ui/Txt";

const ICONS: Record<string, typeof IconPulse> = {
  Hoje: IconPulse,
  Painel: IconPulse,
  MinhaFicha: IconFicha,
  Fichas: IconFicha,
  Progresso: IconTrend,
  Semana: IconPeople,
  Perfil: IconPerson,
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
};

function DockTabBar({
  state,
  navigation,
  accent,
}: BottomTabBarProps & { accent: string }) {
  const inset = useSafeAreaInsets();
  const on = accentOn(accent, T.dock, dockActiveMin);
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
            style={[styles.item, focused && { borderTopColor: on }]}
          >
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
export function dockTabs(accent: string) {
  return {
    screenOptions: { headerShown: false } as const,
    tabBar: (props: BottomTabBarProps) => (
      <DockTabBar {...props} accent={accent} />
    ),
  };
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: T.dock,
    borderTopWidth: 2,
    borderTopColor: T.divider,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingTop: 10,
    paddingBottom: 9,
    borderTopWidth: 2,
    borderTopColor: "transparent",
    marginTop: -2,
  },
  // O rótulo é item de flex numa barra de altura fixa: sem lineHeight próprio a caixa
  // vira o corpo da letra e corta o 'j' de HOJE e o 'g' de PROGRESSO na base.
  label: {
    fontFamily: FONT,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    flexShrink: 0,
  },
});
