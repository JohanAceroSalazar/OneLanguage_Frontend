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
import { useTheme } from "../../src/theme/ThemeContext";

type PermissionItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
};

function PermissionItem({ icon, title, description }: PermissionItemProps) {
    const { colors, fontScale } = useTheme();

    return (
    <View style={[styles.permissionItem, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}> 
        <Ionicons name={icon} size={34} color={colors.primary} />

    <View style={styles.permissionText}>
        <Text style={[styles.permissionTitle, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>{title}</Text>
        <Text style={[styles.permissionDescription, { color: colors.textMuted, fontSize: 12 * fontScale }]}>{description}</Text>
    </View>

    <TouchableOpacity activeOpacity={0.85} style={[styles.activateButton, { backgroundColor: colors.accent }]}> 
        <Text style={[styles.activateText, { color: colors.textOnSurface, fontSize: 13 * fontScale }]}>Activar</Text>
    </TouchableOpacity>
    </View>
    );
}

export default function UserProfile() {
    const router = useRouter();
    const { colors, fontScale } = useTheme();

    return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
    >
        <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.text, fontSize: 20 * fontScale }]}>ONE{"\n"}LANGUAGE</Text>
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="cover"
        />
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: 26 * fontScale }]}>Perfil de usuario</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={34} color={colors.primary} />

            <View>
                <Text style={[styles.sectionTitle, { color: colors.textOnSurface, fontSize: 18 * fontScale }]}>Información personal</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textMuted, fontSize: 13 * fontScale }]}> 
                Visualiza tus datos personales
            </Text>
            </View>
        </View>

        <Text style={[styles.label, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>Nombre completo</Text>
        <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: colors.border }]}
            value="Johan Acero"
            editable={false}
        />

        <Text style={[styles.label, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>Correo electrónico</Text>
        <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: colors.border }]}
            value="johan@gmail.com"
            editable={false}
        />

        <TouchableOpacity activeOpacity={0.85} style={[styles.passwordButton, { backgroundColor: colors.accent }]}> 
            <Text style={[styles.passwordButtonText, { color: colors.textOnSurface, fontSize: 18 * fontScale }]}>Cambiar contraseña</Text>
        </TouchableOpacity>

        <Text style={[styles.permissionsTitle, { color: colors.textOnSurface, fontSize: 18 * fontScale }]}>Permisos del dispositivo</Text>
        <Text style={[styles.permissionsSubtitle, { color: colors.textMuted, fontSize: 13 * fontScale }]}> 
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
            <Text style={[styles.logoutText, { color: "#FFFFFF", fontSize: 20 * fontScale }]}>Cerrar sesión</Text>
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
