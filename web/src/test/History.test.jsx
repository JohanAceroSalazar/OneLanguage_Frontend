import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key, i18n: { language: "es" } }) }));
vi.mock("../components/NavBar/NavBar", () => ({ default: () => null }));
vi.mock("../components/BrandLogo/BrandLogo", () => ({ default: () => null }));
vi.mock("../services/translationService", () => ({
  getTranslations: vi.fn().mockResolvedValue([
    { id: "1", translatedText: "Seña reciente", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: "2", translatedText: "Seña antigua", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  ]),
  deleteTranslation: vi.fn(), deleteAllTranslations: vi.fn(), getTranslationRecording: vi.fn(),
}));

import History from "../pages/history/History";

it("keeps the filter available and separates recent from older entries", async () => {
  const user = userEvent.setup();
  render(<History />);
  expect(await screen.findByText("Seña reciente")).toBeInTheDocument();
  expect(screen.getByText("Seña antigua")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "history.all" }));
  await user.click(screen.getByRole("button", { name: "history.recent" }));
  expect(screen.getByText("history.recentHint")).toBeInTheDocument();
  expect(screen.getByText("Seña reciente")).toBeInTheDocument();
  expect(screen.queryByText("Seña antigua")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "history.recent" }));
  await user.click(screen.getByRole("button", { name: "history.old" }));
  expect(screen.getByText("history.olderHint")).toBeInTheDocument();
  expect(screen.queryByText("history.recentHint")).not.toBeInTheDocument();
  expect(screen.getByText("Seña antigua")).toBeInTheDocument();
  expect(screen.queryByText("Seña reciente")).not.toBeInTheDocument();
});
