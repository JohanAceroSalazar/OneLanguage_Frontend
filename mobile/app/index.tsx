import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../src/services/authService";

export default function Index() {
  const router = useRouter();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let active = true;
    const navigate = async () => {
      let destination: "/(auth)/login" | "/(auth)/main" = "/(auth)/login";
      if (await AsyncStorage.getItem("token")) {
        try {
          await getCurrentUser();
          destination = "/(auth)/main";
        } catch {
          destination = "/(auth)/login";
        }
      }
      if (!active) return;
      Animated.timing(opacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start(() => {
        if (active) router.replace(destination);
      });
    };
    const timer = setTimeout(() => { void navigate(); }, 900);

    return () => { active = false; clearTimeout(timer); };
  }, [opacity, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.brand, { opacity }]}>
        <Image source={require("../assets/images/Logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.name}>One Language</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A78C2",
  },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  logo: {
    width: 64,
    height: 64,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },
});
