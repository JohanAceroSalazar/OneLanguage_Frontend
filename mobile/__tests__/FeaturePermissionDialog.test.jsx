import { fireEvent, render, screen } from "@testing-library/react-native";
import { FeaturePermissionDialog } from "../components/feature-permission-dialog";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View };
});
jest.mock("../src/theme/ThemeContext", () => ({
  useTheme: () => ({
    fontScale: 1,
    colors: { surface: "#fff", border: "#ccc", textOnSurface: "#111", accent: "#ff0", accentText: "#111" },
  }),
}));

test("opens the same camera activation dialog after the notice", () => {
  const onContinue = jest.fn();
  const onActivate = jest.fn();
  const { rerender } = render(<FeaturePermissionDialog feature="camera" notice onContinue={onContinue} onActivate={onActivate} onClose={jest.fn()} />);

  expect(screen.getByText("cameraPermission.title")).toBeTruthy();
  fireEvent.press(screen.getByText("common.ok"));
  expect(onContinue).toHaveBeenCalledTimes(1);

  rerender(<FeaturePermissionDialog feature="camera" onActivate={onActivate} onClose={jest.fn()} />);
  expect(screen.getByText("profile.cameraPermissionTitle")).toBeTruthy();
  fireEvent.press(screen.getByText("common.activate"));
  expect(onActivate).toHaveBeenCalledTimes(1);
});
