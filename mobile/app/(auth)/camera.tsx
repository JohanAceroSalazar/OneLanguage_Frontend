import { Ionicons } from "@expo/vector-icons";
import { BottomNav } from "../../components/bottom-nav";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Camera() {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.cameraDot} />

        <View style={styles.header}>
        <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

        <TouchableOpacity activeOpacity={0.8} style={styles.switchButton}>
            <Ionicons name="camera-reverse-outline" size={35} color="#000000" />
        </TouchableOpacity>
    </View>

    <Image
        source={require("../../assets/images/front_camera.png")}
        style={styles.cameraImage}
        resizeMode="cover"
    />

    <View style={styles.resultCard}>
        <Text style={styles.resultText}>El texto traducido{"\n"}aparecerá aquí...</Text>
    </View>

    <TouchableOpacity activeOpacity={0.85} style={styles.finishButton}>
        <Text style={styles.finishButtonText}>Finalizar traducción</Text>
    </TouchableOpacity>

    <BottomNav active="camera" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    paddingHorizontal: 14,
    paddingTop: 30,
    alignItems: "center",
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
header: {
    width: "100%",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    },
logo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
    marginLeft: 8,
    },
switchButton: {
    width: 54,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    },
cameraImage: {
    width: "100%",
    height: 268,
    marginTop: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000",
    },
resultCard: {
    width: "98%",
    height: 250,
    marginTop: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#707070",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    },
resultText: {
    color: "#000000",
    fontSize: 27,
    lineHeight: 28,
    fontWeight: "400",
    textAlign: "center",
    },
finishButton: {
    width: "74%",
    marginTop: 18,
    backgroundColor: "#FFEB3B",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 13,
    },
finishButtonText: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "500",
    },
});
