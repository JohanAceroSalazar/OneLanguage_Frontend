import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BottomNav } from "../../components/bottom-nav";
import { BrandWordmark } from "../../components/brand-wordmark";
import { useMainPager } from "../../components/main-pager-context";
import { SwipeNavigation } from "../../components/swipe-navigation";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
    const { t } = useTranslation();
    const { colors, fontScale } = useTheme();
    const router = useRouter();
    const mainPager = useMainPager();
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        let active = true;
        AsyncStorage.getItem("user").then((stored) => {
            const user = stored ? JSON.parse(stored) : null;
            const name = String(user?.fullName || user?.name || user?.firstName || "").trim().split(/\s+/)[0];
            if (active) setFirstName(name || "");
        }).catch(() => undefined);
        return () => { active = false; };
    }, []);

    const openTranslator = () => {
        if (mainPager) mainPager.navigate("camera");
        else router.push("/(auth)/camera");
    };

    return (
        <SwipeNavigation active="home">
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandWordmark color={colors.text} style={styles.logo} />

        <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text, fontSize: 24 * fontScale }]}>{t("home.greeting", { name: firstName || t("home.fallbackName", "usuario") })}</Text>
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="contain"
            />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}> 
            <Text style={[styles.cardTitle, { color: colors.textOnSurface, fontSize: 30 * fontScale }]}>{t("home.title")}</Text>

        <Text style={[styles.description, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}> 
            {t("home.description")}
        </Text>

        <TouchableOpacity activeOpacity={0.85} onPress={openTranslator} style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={[styles.buttonText, { color: colors.accentText, fontSize: 25 * fontScale }]}>{t("home.start")}</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        <BottomNav active="home" />
    </SafeAreaView>
    </SwipeNavigation>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#3a78c2",
    },
content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 118,
    },
logo: {
    marginLeft: 8,
    },
header: {
    width: "100%",
    marginTop: 36,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    },
greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 27,
    fontWeight: "normal",
    },
avatar: {
    width: 76,
    height: 58,
    },
card: {
    width: "100%",
    marginTop: 60,
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#090909",
    minHeight: 475,
    justifyContent: "space-between",
    },
cardTitle: {
    color: "#000000",
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "600",
    textAlign: "center",
    },
description: {
    textAlign: "center",
    color: "#000000",
    fontSize: 19,
    lineHeight: 26,
    marginTop: 34,
    },
button: {
    alignSelf: "center",
    width: "92%",
    marginTop: 30,
    backgroundColor: "#f4dc2e",
    borderRadius: 14,
    paddingVertical: 3,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 6,
    },
buttonText: {
    color: "#000000",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "600",
    textAlign: "center",
    },
});
