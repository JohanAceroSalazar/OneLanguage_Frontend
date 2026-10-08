import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../src/theme/ThemeContext";
import { useMainPager } from "./main-pager-context";

export type BottomNavTab = "home" | "camera" | "history" | "accessibility" | "profile";

type BottomNavProps = {
  active: BottomNavTab;
  onNavigate?: (tab: BottomNavTab) => void;
  renderInPager?: boolean;
};

const tabs: {
  name: BottomNavTab;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route:
    | "/(auth)/home"
    | "/(auth)/camera"
    | "/(auth)/history"
    | "/(auth)/accessibility"
    | "/(auth)/user_profile"
    | "/(auth)/login";
  size: number;
}[] = [
  { name: "home", icon: "home-outline", activeIcon: "home", route: "/(auth)/home", size: 32 },
  { name: "camera", icon: "camera-outline", activeIcon: "camera", route: "/(auth)/camera", size: 32 },
  { name: "history", icon: "document-text-outline", activeIcon: "document-text", route: "/(auth)/history", size: 32 },
  { name: "accessibility", icon: "accessibility-outline", activeIcon: "accessibility", route: "/(auth)/accessibility", size: 34 },
  { name: "profile", icon: "person-circle-outline", activeIcon: "person-circle", route: "/(auth)/user_profile", size: 34 },
];

export function BottomNav({ active, onNavigate, renderInPager = false }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const mainPager = useMainPager();

  const isDark = theme === "dark";
  const safeBottom = Math.max(insets.bottom, 8);

  if (mainPager && !renderInPager) return null;

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: isDark ? "#0f172a" : "#1D1B3D",
          height: 70 + safeBottom,
          paddingBottom: safeBottom,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.name === active;
        const iconColor = isDark ? colors.accent : "#FFEB3B";
        const icon = tab.name === "history" ? (
          <Ionicons name={isActive ? "document-text" : "document-text-outline"} size={34} color={iconColor} />
        ) : !isActive && tab.name === "profile" ? (
          <View style={[styles.profileOutline, { borderColor: iconColor }]}>
            <Ionicons name="person-outline" size={22} color={iconColor} />
          </View>
        ) : (
          <Ionicons
            name={isActive ? tab.activeIcon : tab.icon}
            size={tab.size}
            color={iconColor}
          />
        );

        if (isActive) {
          return (
            <View key={tab.name} style={styles.tabButton}>{icon}</View>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={0.8}
            style={styles.tabButton}
            onPress={() => onNavigate ? onNavigate(tab.name) : router.push(tab.route)}
          >
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    paddingHorizontal: 26,
    backgroundColor: "#1D1B3D",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  profileOutline: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
