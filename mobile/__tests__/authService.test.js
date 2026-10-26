import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../src/services/authService";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("../src/config/network", () => ({ API_BASE_URL: "https://api.example.test" }));

const response = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
});

beforeEach(async () => {
  await AsyncStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  delete global.fetch;
});

test("login sends credentials to the backend and returns the session", async () => {
  fetch.mockResolvedValue(response(200, { token: "signed-token", user: { id: 7 } }));

  await expect(loginUser({ email: "ana@example.com", password: "secret123" })).resolves.toEqual({
    token: "signed-token",
    user: { id: 7 },
  });
  expect(fetch).toHaveBeenCalledWith("https://api.example.test/auth/login", expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ email: "ana@example.com", password: "secret123" }),
  }));
});

test("registration maps the name to fullName", async () => {
  fetch.mockResolvedValue(response(201, { id: 7 }));

  await registerUser({ name: "Ana Perez", email: "ana@example.com", password: "secret123" });

  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
    fullName: "Ana Perez",
    email: "ana@example.com",
    password: "secret123",
  });
});

test("login exposes the backend error without storing a session", async () => {
  fetch.mockResolvedValue(response(401, { message: "Credenciales incorrectas" }));

  await expect(loginUser({ email: "ana@example.com", password: "wrong123" })).rejects.toEqual({
    message: "Credenciales incorrectas",
  });
  expect(await AsyncStorage.getItem("token")).toBeNull();
});

test("an authenticated 401 clears the token and user", async () => {
  await AsyncStorage.multiSet([
    ["token", "expired-token"],
    ["user", JSON.stringify({ id: 7 })],
  ]);
  fetch.mockResolvedValue(response(401, {}));

  await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });

  expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer expired-token");
  expect(await AsyncStorage.getItem("token")).toBeNull();
  expect(await AsyncStorage.getItem("user")).toBeNull();
});
