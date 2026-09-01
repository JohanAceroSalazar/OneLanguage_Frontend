import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AppAlertVariant = "success" | "error" | "info";

type AppAlertProps = {
  visible: boolean;
  label?: string;
  title: string;
  message: string;
  actionText?: string;
  variant?: AppAlertVariant;
  onAction: () => void;
};

const variantColors: Record<AppAlertVariant, string> = {
  success: "#16a34a",
  error: "#ef4444",
  info: "#3A78C2",
};

export function AppAlert({
  visible,
  label,
  title,
  message,
  actionText = "Aceptar",
  variant = "success",
  onAction,
}: AppAlertProps) {
  const statusColor = variantColors[variant];

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.box, { borderTopColor: statusColor }]}>
          {label ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{label}</Text>
            </View>
          ) : null}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity activeOpacity={0.88} style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{actionText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(5, 16, 32, 0.42)",
  },
  box: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    borderTopWidth: 6,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 34,
    backgroundColor: "#ffffff",
    shadowColor: "#13294b",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 12,
  },
  badge: {
    minWidth: 80,
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
    backgroundColor: "#FFF5BE",
  },
  badgeText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  title: {
    color: "#0f172a",
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  message: {
    color: "#475569",
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingHorizontal: 18,
    backgroundColor: "#F4DC2E",
    shadowColor: "#F4DC2E",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.34,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonText: {
    color: "#05050B",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
});
