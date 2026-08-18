import { StyleSheet, Text } from "react-native";
import { productTheme } from "../theme";

export function roleTabScreenOptions(accent: string) {
  return {
    headerShown: false,
    tabBarActiveTintColor: accent,
    tabBarInactiveTintColor: productTheme.muted,
    tabBarLabelVisibilityMode: "labeled" as const,
    tabBarLabelStyle: styles.label,
    tabBarStyle: styles.bar,
    tabBarItemStyle: styles.item,
    tabBarIconStyle: styles.icon,
    tabBarIcon: () => null,
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
    backgroundColor: productTheme.bg,
    borderTopWidth: 2,
    borderTopColor: productTheme.divider,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  item: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  icon: {
    height: 0,
    width: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  label: {
    fontFamily: "Archivo_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
