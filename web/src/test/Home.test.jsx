import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key, options) =>
  key === "home.greeting" ? `Hola ${options.name} bienvenido` : key }) }));
vi.mock("../components/NavBar/NavBar", () => ({ default: () => null }));
vi.mock("../components/BrandLogo/BrandLogo", () => ({ default: () => null }));

import Home from "../pages/home/Home";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

it("greets the signed-in person by first name", () => {
  localStorage.setItem("user", JSON.stringify({ fullName: "Ana María Pérez" }));
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText("Hola Ana bienvenido")).toBeInTheDocument();
});

it("opens translation without requesting camera permission", async () => {
  render(<MemoryRouter initialEntries={["/home"]}><Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/translate" element={<div>Traducción</div>} />
  </Routes></MemoryRouter>);
  await userEvent.setup().click(screen.getByRole("button", { name: "home.start" }));
  expect(screen.getByText("Traducción")).toBeInTheDocument();
});
