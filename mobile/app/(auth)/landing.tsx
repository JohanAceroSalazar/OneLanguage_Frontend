import { useRouter } from "expo-router";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeContext";

export default function Landing() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image source={require("../../assets/images/Logo.png")} style={styles.logoImage} />
          <Text style={[styles.brand, { color: colors.text }]}>One Language</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={[styles.badge, { color: colors.accent }]}>Plataforma de inclusión</Text>
        <Text style={[styles.title, { color: colors.text }]}>Conecta personas sin barreras.</Text>
        <Text style={[styles.description]}>Traduce, consulta tu historial y activa accesibilidad desde una experiencia clara y moderna.</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}> 
        <View style={styles.infoItem}>
          <Ionicons name="flash-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>Tiempo real</Text>
          <Text style={styles.infoText}>Flujo pensado para traducir rápido.</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>Historial</Text>
          <Text style={styles.infoText}>Guarda conversaciones y revisa resultados.</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="accessibility-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>Accesible</Text>
          <Text style={styles.infoText}>Diseño contrastado y fácil de navegar.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 45,
    height: 45,
    marginTop: 15,
    borderRadius: 25,
  },
  brand: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 15,
  },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 18,
  },
  badge: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color : "#fff",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
  },
  infoItem: {
    paddingVertical: 8,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
});
