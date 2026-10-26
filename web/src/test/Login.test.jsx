import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../services/authService", () => ({
  loginUser: vi.fn(),
  syncAccessibilityAfterLogin: vi.fn(),
}));

import Login from "../pages/login/Login";
import { loginUser, syncAccessibilityAfterLogin } from "../services/authService";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

function renderLogin() {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<div>Inicio privado</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

it("does not submit an invalid form", async () => {
  const user = userEvent.setup();
  renderLogin();

  await user.click(screen.getByRole("button", { name: "auth.login" }));

  expect(loginUser).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toHaveTextContent("auth.reviewMessage");
});

it("saves the session and navigates after successful login", async () => {
  const user = userEvent.setup();
  loginUser.mockResolvedValue({ token: "signed-token", user: { email: "ana@example.com" } });
  syncAccessibilityAfterLogin.mockResolvedValue(null);
  renderLogin();

  await user.type(screen.getByLabelText("common.email"), "ana@example.com");
  await user.type(screen.getByLabelText("common.password"), "secret123");
  await user.click(screen.getByRole("button", { name: "auth.login" }));

  await waitFor(() => expect(loginUser).toHaveBeenCalledWith({
    email: "ana@example.com",
    password: "secret123",
  }));
  expect(localStorage.getItem("token")).toBe("signed-token");
  expect(syncAccessibilityAfterLogin).toHaveBeenCalledOnce();
  await user.click(screen.getByRole("button", { name: "auth.enterNow" }));
  expect(screen.getByText("Inicio privado")).toBeInTheDocument();
});

it("shows a failed login without storing a token", async () => {
  const user = userEvent.setup();
  loginUser.mockRejectedValue(new Error("Credenciales incorrectas"));
  renderLogin();

  await user.type(screen.getByLabelText("common.email"), "ana@example.com");
  await user.type(screen.getByLabelText("common.password"), "wrong123");
  await user.click(screen.getByRole("button", { name: "auth.login" }));

  expect(await screen.findByRole("dialog")).toHaveTextContent("Credenciales incorrectas");
  expect(localStorage.getItem("token")).toBeNull();
});
