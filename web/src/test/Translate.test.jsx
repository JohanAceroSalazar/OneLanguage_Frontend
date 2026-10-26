import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../services/featurePermissionService", () => ({
  getFeaturePermissions: vi.fn().mockResolvedValue({ camera: false, audio: false }),
  setFeaturePermission: vi.fn().mockResolvedValue({ camera: false, audio: true }),
}));
vi.mock("../components/NavBar/NavBar", () => ({ default: () => null }));
vi.mock("../components/BrandLogo/BrandLogo", () => ({ default: () => null }));

import Translate from "../pages/translate/Translate";
import { setFeaturePermission } from "../services/featurePermissionService";

it("asks for camera access only after starting a translation", async () => {
  render(<MemoryRouter><Translate /></MemoryRouter>);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  await userEvent.setup().click(screen.getByRole("button", { name: "translate.start" }));
  expect(await screen.findByRole("dialog")).toHaveTextContent("profile.cameraPermissionTitle");
  expect(screen.getByRole("button", { name: "common.ok" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "common.cancel" })).toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole("button", { name: "common.ok" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("profile.cameraPermissionMessage");
  expect(screen.getByRole("button", { name: "common.activate" })).toBeInTheDocument();
});

it("keeps voice off when audio permission is disabled and offers activation in place", async () => {
  vi.stubGlobal("speechSynthesis", { cancel: vi.fn() });
  render(<MemoryRouter><Translate /></MemoryRouter>);
  expect(screen.getByRole("button", { name: "translate.autoOn" })).toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole("button", { name: "translate.autoOn" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("profile.audioPermissionTitle");
  await userEvent.setup().click(screen.getByRole("button", { name: "common.ok" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("profile.audioPermissionMessage");
  await userEvent.setup().click(screen.getByRole("button", { name: "common.activate" }));
  await waitFor(() => expect(setFeaturePermission).toHaveBeenCalledWith("audio", true));
  expect(await screen.findByRole("button", { name: "translate.autoOff" })).toBeInTheDocument();
});

it("swaps the translation and camera panels", async () => {
  const { container } = render(<MemoryRouter><Translate /></MemoryRouter>);
  const panels = container.querySelector(".translate-content");
  expect(panels).not.toHaveClass("flipped");

  await userEvent.setup().click(screen.getByRole("button", { name: "translate.swap" }));
  expect(panels).toHaveClass("flipped");

  await userEvent.setup().click(screen.getByRole("button", { name: "translate.swap" }));
  expect(panels).not.toHaveClass("flipped");
});
