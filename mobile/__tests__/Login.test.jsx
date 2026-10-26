import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import Login from "../app/(auth)/login";
import { getAccessibilitySettings, loginUser, persistLocalAccessibilitySettings } from "../src/services/authService";

const mockReplace = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("expo-router", () => ({ useRouter: () => ({ replace: mockReplace, push: jest.fn() }) }));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock("@expo/vector-icons", () => ({ Ionicons: () => null }));
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View, useSafeAreaInsets: () => ({ bottom: 0 }) };
});
jest.mock("../components/brand-wordmark", () => ({ BrandWordmark: () => null }));
jest.mock("../components/app-alert", () => {
  const React = require("react");
  const { Text, View } = require("react-native");
  return {
    AppAlert: ({ visible, title, actionText, onAction }) => visible
      ? React.createElement(View, null,
        React.createElement(Text, null, title),
        React.createElement(Text, { onPress: onAction }, actionText))
      : null,
  };
});
jest.mock("../src/theme/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      background: "#fff", surface: "#fff", border: "#ccc", text: "#111",
      textOnSurface: "#111", surfaceAlt: "#eee", textMuted: "#555",
      accent: "#333", accentText: "#fff",
    },
    theme: "light",
    fontSizeMode: "medium",
    setThemeMode: jest.fn(),
    setFontSizeMode: jest.fn(),
  }),
}));
jest.mock("../src/i18n", () => ({
  __esModule: true,
  default: { language: "es", changeLanguage: jest.fn().mockResolvedValue(undefined) },
  languageOptions: [{ code: "es" }],
}));
jest.mock("../src/services/authService", () => ({
  loginUser: jest.fn(),
  getAccessibilitySettings: jest.fn(),
  persistLocalAccessibilitySettings: jest.fn(),
  hasLocalAccessibilitySettings: jest.fn(),
}));

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

test("does not call login with empty credentials", () => {
  render(<Login />);

  fireEvent.press(screen.getAllByText("auth.login").at(-1));

  expect(loginUser).not.toHaveBeenCalled();
  expect(screen.getByText("auth.emailRequired")).toBeTruthy();
  expect(screen.getByText("auth.passwordRequired")).toBeTruthy();
});

test("stores a successful login and navigates after confirmation", async () => {
  loginUser.mockResolvedValue({ token: "signed-token", user: { id: 7 } });
  getAccessibilitySettings.mockResolvedValue({ language: "es", theme: "light", textSize: "medium" });
  persistLocalAccessibilitySettings.mockResolvedValue({});
  render(<Login />);

  fireEvent.changeText(screen.getByPlaceholderText("andres@gmail.com"), "ana@example.com");
  fireEvent.changeText(screen.getByPlaceholderText("********"), "secret123");
  fireEvent.press(screen.getAllByText("auth.login").at(-1));

  await waitFor(() => expect(screen.getByText("auth.loginSuccess")).toBeTruthy());
  expect(await AsyncStorage.getItem("token")).toBe("signed-token");
  expect(await AsyncStorage.getItem("user")).toBe(JSON.stringify({ id: 7 }));
  fireEvent.press(screen.getByText("auth.enterNow"));
  expect(mockReplace).toHaveBeenCalledWith("/(auth)/main");
});
