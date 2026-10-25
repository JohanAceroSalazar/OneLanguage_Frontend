import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../services/featurePermissionService", () => ({ getFeaturePermissions: vi.fn().mockResolvedValue({ camera: false }) }));
vi.mock("../components/NavBar/NavBar", () => ({ default: () => null }));
vi.mock("../components/BrandLogo/BrandLogo", () => ({ default: () => null }));

import Translate from "../pages/translate/Translate";

it("asks for camera access only after starting a translation", async () => {
  render(<MemoryRouter><Translate /></MemoryRouter>);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  await userEvent.setup().click(screen.getByRole("button", { name: "translate.start" }));
  expect(await screen.findByRole("dialog")).toHaveTextContent("cameraPermission.title");
  expect(screen.getByRole("button", { name: "common.ok" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "common.cancel" })).toBeInTheDocument();
});
