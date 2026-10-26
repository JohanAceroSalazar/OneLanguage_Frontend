import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../i18n", () => ({ default: { changeLanguage: vi.fn() } }));
vi.mock("../components/NavBar/NavBar", () => ({ default: () => null }));
vi.mock("../components/BrandLogo/BrandLogo", () => ({ default: () => null }));
vi.mock("../services/authService", () => ({ getCurrentUser: vi.fn().mockResolvedValue({ fullName: "Ana Perez", email: "ana@example.com" }) }));
vi.mock("../services/featurePermissionService", () => ({ getFeaturePermissions: vi.fn().mockResolvedValue({ camera: false, audio: false }), setFeaturePermission: vi.fn() }));

import Profile from "../pages/profile/Profile";

beforeEach(() => localStorage.clear());

it("clears the session and returns to the landing page after confirmation", async () => {
  localStorage.setItem("token", "active-session");
  localStorage.setItem("user", JSON.stringify({ fullName: "Ana Perez" }));

  render(<MemoryRouter initialEntries={["/profile"]}><Routes>
    <Route path="/profile" element={<Profile />} />
    <Route path="/" element={<div>Landing público</div>} />
  </Routes></MemoryRouter>);

  await userEvent.setup().click(screen.getByRole("button", { name: "common.logout" }));
  await userEvent.setup().click(screen.getByRole("button", { name: "profile.confirmLogout" }));

  expect(screen.getByText("Landing público")).toBeInTheDocument();
  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("user")).toBeNull();
});
