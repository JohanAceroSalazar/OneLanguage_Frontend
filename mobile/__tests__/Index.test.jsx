import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, render } from "@testing-library/react-native";
import { Animated } from "react-native";

const mockReplace = jest.fn();
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("expo-router", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("../src/services/authService", () => ({ getCurrentUser: jest.fn() }));

import Index from "../app/index";
import { getCurrentUser } from "../src/services/authService";

beforeEach(async () => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  jest.spyOn(Animated, "timing").mockReturnValue({ start: (complete) => complete() });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

test("opens the app when a saved session is still valid", async () => {
  await AsyncStorage.setItem("token", "saved-token");
  getCurrentUser.mockResolvedValue({ fullName: "Ana Perez" });
  render(<Index />);
  await act(async () => { jest.advanceTimersByTime(900); await Promise.resolve(); });
  expect(getCurrentUser).toHaveBeenCalled();
  expect(mockReplace).toHaveBeenCalledWith("/(auth)/main");
});

test("returns to login when the saved session is rejected", async () => {
  await AsyncStorage.setItem("token", "expired-token");
  getCurrentUser.mockRejectedValue(new Error("expired"));
  render(<Index />);
  await act(async () => { jest.advanceTimersByTime(900); await Promise.resolve(); });
  expect(mockReplace).toHaveBeenCalledWith("/(auth)/login");
});
