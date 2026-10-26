import { Alert } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import UserProfile from "../app/(auth)/user_profile";
import { clearAuthSession, getLocalAccessibilitySettings } from "../src/services/authService";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("expo-camera", () => ({ Camera: { getCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: false }) } }));
jest.mock("expo-speech", () => ({ stop: jest.fn() }));
jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View, useSafeAreaInsets: () => ({ bottom: 0 }) };
});
jest.mock("../components/brand-wordmark", () => ({ BrandWordmark: () => null }));
jest.mock("../components/bottom-nav", () => ({ BottomNav: () => null }));
jest.mock("../components/main-pager-context", () => ({ useMainPager: () => null }));
jest.mock("../components/swipe-navigation", () => ({ SwipeNavigation: ({ children }) => children }));
jest.mock("../components/feature-permission-dialog", () => ({ FeaturePermissionDialog: () => null }));
jest.mock("../src/i18n", () => ({ setLanguage: jest.fn().mockResolvedValue(undefined) }));
jest.mock("../src/theme/ThemeContext", () => ({
  useTheme: () => ({
    colors: { background: "#3a78c2", surface: "#fff", surfaceAlt: "#eee", text: "#fff", textOnSurface: "#111", textMuted: "#555", primary: "#3a78c2", border: "#ccc", accent: "#ff0", accentText: "#111" },
    theme: "light", fontScale: 1, setThemeMode: jest.fn(), setFontSizeMode: jest.fn(),
  }),
}));
jest.mock("../src/services/authService", () => ({
  clearAuthSession: jest.fn().mockResolvedValue(undefined),
  getCurrentUser: jest.fn().mockResolvedValue({ fullName: "Ana Perez", email: "ana@example.com" }),
  getLocalAccessibilitySettings: jest.fn().mockResolvedValue({ language: "es", theme: "light", textSize: "medium" }),
}));
jest.mock("../src/services/featurePermissionService", () => ({
  getFeaturePermissions: jest.fn().mockResolvedValue({ camera: false, audio: false }),
  setFeaturePermission: jest.fn(),
}));

test("asks before logging out and only leaves after confirmation", async () => {
  jest.clearAllMocks();
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
  render(<UserProfile />);

  fireEvent.press(screen.getByText("common.logout"));

  expect(alert).toHaveBeenCalledWith(
    "common.logout",
    "profile.logoutQuestion",
    expect.arrayContaining([
      expect.objectContaining({ text: "common.cancel", style: "cancel" }),
      expect.objectContaining({ text: "profile.confirmLogout", style: "destructive" }),
    ]),
  );
  expect(clearAuthSession).not.toHaveBeenCalled();
  expect(mockReplace).not.toHaveBeenCalled();

  const confirm = alert.mock.calls[0][2].find((action) => action.text === "profile.confirmLogout");
  confirm.onPress();

  await waitFor(() => expect(clearAuthSession).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(getLocalAccessibilitySettings).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/(auth)/login"));
  alert.mockRestore();
});
