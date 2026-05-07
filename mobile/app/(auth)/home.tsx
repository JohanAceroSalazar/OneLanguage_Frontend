import { BottomNav } from "../../components/bottom-nav";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.cameraDot} />

        <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

        <View style={styles.header}>
            <Text style={styles.greeting}>Hola usuario{"\n"}bienvenido</Text>
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="cover"
            />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>¡Bienvenido a{"\n"}One Language!</Text>

        <Text style={styles.description}>
            One Language es una aplicación diseñada para traducir el lenguaje de
            señas colombiano a texto y audio en tiempo real, promoviendo la
            inclusión y la comunicación sin barreras en Colombia.
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.button}>
            <Text style={styles.buttonText}>Comenzar a{"\n"}traducir</Text>
        </TouchableOpacity>
        </View>

        <BottomNav active="home" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    paddingHorizontal: 22,
    paddingTop: 28,
    },
cameraDot: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#05050B",
    borderWidth: 3,
    borderColor: "#111827",
    zIndex: 5,
    },
logo: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#FFFFFF",
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
    borderRadius: 28,
    borderColor: "#090909",
    borderWidth: 1,
    backgroundColor: "#FFEB3B",
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
    backgroundColor: "#FFEB3B",
    borderWidth: 2,
    borderColor: "#000000",
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
