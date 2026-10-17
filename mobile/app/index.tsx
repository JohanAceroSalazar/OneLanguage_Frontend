import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start(() => router.replace("/(auth)/login"));
    }, 900);

    return () => clearTimeout(timer);
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
    backgroundColor: "#06142B",
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
