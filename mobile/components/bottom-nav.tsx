import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type BottomNavTab = "home" | "camera" | "history" | "accessibility" | "profile";

type BottomNavProps = {
  active: BottomNavTab;
};

const tabs: {
  name: BottomNavTab;
  icon: keyof typeof Ionicons.glyphMap;
  route:
    | "/(auth)/home"
    | "/(auth)/camera"
    | "/(auth)/history"
    | "/(auth)/accessibility"
    | "/(auth)/user_profile"
    | "/(auth)/login";
  size: number;
}[] = [
  { name: "home", icon: "home-outline", route: "/(auth)/home", size: 32 },
  { name: "camera", icon: "camera-outline", route: "/(auth)/camera", size: 32 },
  { name: "history", icon: "receipt-outline", route: "/(auth)/history", size: 32 },
  { name: "accessibility", icon: "accessibility-outline", route: "/(auth)/accessibility", size: 34 },
  { name: "profile", icon: "person-circle-outline", route: "/(auth)/user_profile", size: 34 },
];

export function BottomNav({ active }: BottomNavProps) {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const icon = <Ionicons name={tab.icon} size={tab.size} color="#FFEB3B" />;

        if (tab.name === active) {
          return (
            <View key={tab.name} style={styles.activeTab}>
              {icon}
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={0.8}
            onPress={() => router.push(tab.route)}
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
  activeTab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    borderColor: "#FFEB3B",
    backgroundColor: "#1D1B3D",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
  },
});
