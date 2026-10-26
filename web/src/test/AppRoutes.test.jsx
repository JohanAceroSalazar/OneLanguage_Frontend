import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";
import { clearAuthSession } from "../services/authSession";

vi.mock("../components/ThemeBootstrap/ThemeBootstrap", () => ({ default: () => null }));
vi.mock("../pages/landing/Landing", () => ({ default: () => <div>Landing visible</div> }));
vi.mock("../pages/register/Register", () => ({ default: () => null }));
vi.mock("../pages/login/Login", () => ({ default: () => <div>Login visible</div> }));
vi.mock("../pages/terms/terms", () => ({ default: () => null }));
vi.mock("../pages/home/Home", () => ({ default: () => <div>Home visible</div> }));
vi.mock("../pages/forgotpassword/ForgotPassword", () => ({ default: () => null }));
vi.mock("../pages/translate/Translate", () => ({ default: () => null }));
vi.mock("../pages/history/History", () => ({ default: () => null }));
vi.mock("../pages/accessibility/Accessibility", () => ({ default: () => null }));
vi.mock("../pages/resetpassword/ResetPassword", () => ({ default: () => null }));
vi.mock("../pages/profile/Profile", () => ({
  default: function TestProfile() {
    const navigate = useNavigate();
    return <button onClick={() => { clearAuthSession(); navigate("/", { replace: true }); }}>Cerrar sesión</button>;
  },
}));

import AppRoutes from "../routes/AppRoutes";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

it("renders the landing immediately after ending an active session", async () => {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
  localStorage.setItem("token", `header.${payload}.signature`);
  window.history.replaceState({}, "", "/profile");

  render(<AppRoutes />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Cerrar sesión" }));

  expect(await screen.findByText("Landing visible")).toBeInTheDocument();
  expect(window.location.pathname).toBe("/");
});
