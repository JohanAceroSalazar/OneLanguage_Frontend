import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BottomNav } from "../../components/bottom-nav";

type PermissionItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
};

function PermissionItem({ icon, title, description }: PermissionItemProps) {
    return (
    <View style={styles.permissionItem}>
        <Ionicons name={icon} size={34} color="#333333" />

    <View style={styles.permissionText}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
    </View>

    <TouchableOpacity activeOpacity={0.85} style={styles.activateButton}>
        <Text style={styles.activateText}>Activar</Text>
    </TouchableOpacity>
    </View>
    );
}

export default function UserProfile() {
    const router = useRouter();

    return (
    <SafeAreaView style={styles.container}>
        <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
    >
        <View style={styles.header}>
            <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="cover"
        />
        </View>

        <Text style={styles.title}>Perfil de usuario</Text>

        <View style={styles.card}>
            <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={34} color="#000000" />

            <View>
                <Text style={styles.sectionTitle}>Información personal</Text>
                <Text style={styles.sectionSubtitle}>
                Visualiza tus datos personales
            </Text>
            </View>
        </View>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
            style={styles.input}
            value="Johan Acero"
            editable={false}
        />

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
            style={styles.input}
            value="johan@gmail.com"
            editable={false}
        />

        <TouchableOpacity activeOpacity={0.85} style={styles.passwordButton}>
            <Text style={styles.passwordButtonText}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <Text style={styles.permissionsTitle}>Permisos del dispositivo</Text>
        <Text style={styles.permissionsSubtitle}>
            Gestiona los permisos de acceso a{"\n"}funciones del dispositivo
        </Text>

        <PermissionItem
            icon="camera-outline"
            title="Cámara"
            description={"Necesaria para\nreconocimiento de señas"}
        />
        <PermissionItem
            icon="musical-notes"
            title="Audio"
            description={"Para funciones de\nconvertir y escuchar el\naudio"}
        />
        <PermissionItem
            icon="folder"
            title="Archivos"
            description="Acceso para los archivos"
        />
        </View>

        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.logoutButton}
            onPress={() => router.push("/(auth)/login")}
        >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
    </ScrollView>

        <BottomNav active="profile" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    },
content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 105,
    },
header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    },
logo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
    marginLeft: 8,
    },
avatar: {
    width: 76,
    height: 58,
    borderRadius: 28,
    borderColor: "#090909",
    borderWidth: 1,
    backgroundColor: "#FFEB3B",
    },
title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 32,
    marginLeft: 8,
    },
card: {
    width: "100%",
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#6E6574",
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 18,
    },
sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 20,
    },
sectionTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
sectionSubtitle: {
    color: "#333333",
    fontSize: 13,
    },
label: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
    marginBottom: 7,
    },
input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#9A9A9A",
    borderRadius: 11,
    paddingHorizontal: 10,
    color: "#777777",
    fontSize: 14,
    marginBottom: 13,
    backgroundColor: "#FFFFFF",
    },
passwordButton: {
    alignSelf: "center",
    width: "78%",
    backgroundColor: "#FFEB3B",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 13,
    },
passwordButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
permissionsTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
permissionsSubtitle: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 14,
    marginBottom: 11,
    },
permissionItem: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    },
permissionText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
    },
permissionTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "500",
    },
permissionDescription: {
    color: "#555555",
    fontSize: 12,
    lineHeight: 14,
    },
activateButton: {
    width: 64,
    minHeight: 42,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    backgroundColor: "#FFEB3B",
    alignItems: "center",
    justifyContent: "center",
    },
activateText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "500",
    },
logoutButton: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#D91414",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    },
logoutText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    },
});
