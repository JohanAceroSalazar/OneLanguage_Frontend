import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import { withPublicLanguage } from "../components/public-language-screen";
import i18n from "../src/i18n";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View };
});

const Probe = withPublicLanguage(() => {
  const { t } = useTranslation();
  return <Text>{t("auth.login")}</Text>;
});

test("public language stays separate from account language", async () => {
  await AsyncStorage.clear();
  const accountLanguage = i18n.language;
  render(<Probe />);

  await screen.findByText("Iniciar sesión");
  fireEvent.press(screen.getByLabelText("English"));

  await waitFor(() => expect(screen.getByText("Log in")).toBeTruthy());
  expect(await AsyncStorage.getItem("publicLanguage")).toBe("en");
  expect(await AsyncStorage.getItem("language")).toBeNull();
  expect(i18n.language).toBe(accountLanguage);
});
