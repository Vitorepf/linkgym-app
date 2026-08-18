import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONT, productTheme as T } from "../theme";
import {
  IconFicha,
  IconPeople,
  IconPerson,
  IconPulse,
  IconTrend,
} from "../ui/Icons";

const ICONS: Record<string, typeof IconPulse> = {
  Hoje: IconPulse,
  Painel: IconPulse,
  Ficha: IconFicha,
  MinhaFicha: IconFicha,
  Fichas: IconFicha,
  Progresso: IconTrend,
  Semana: IconPeople,
  Perfil: IconPerson,
};

const LABELS: Record<string, string> = {
  Hoje: "HOJE",
  Painel: "HOJE",
  Ficha: "FICHA",
  MinhaFicha: "FICHA",
  Fichas: "FICHAS",
  Progresso: "PROGRESSO",
  Semana: "SEMANA",
  Perfil: "PERFIL",
};

export function DockTabBar({
  state,
  descriptors,
  navigation,
  accent,
}: BottomTabBarProps & { accent: string }) {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(inset.bottom, 10) },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? accent : T.muted2;
        const Icon = ICONS[route.name] ?? IconPulse;
        const label =
          LABELS[route.name] ??
          descriptors[route.key].options.tabBarAccessibilityLabel ??
          route.name;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={String(label)}
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
            style={[styles.item, focused && { borderTopColor: accent }]}
          >
            <Icon color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function roleTabScreenOptions(accent: string) {
  return {
    headerShown: false,
    tabBarActiveTintColor: accent,
    tabBarInactiveTintColor: T.muted2,
    tabBar: (props: BottomTabBarProps) => (
      <DockTabBar {...props} accent={accent} />
    ),
  };
}

export function RoleTabLabel({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return <Text style={[styles.label, { color }]}>{label}</Text>;
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
  label: {
    fontFamily: FONT,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
