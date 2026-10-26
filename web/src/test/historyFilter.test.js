import { expect, it } from "vitest";
import { filterTranslations } from "../pages/history/historyFilter";

const now = Date.parse("2026-10-26T12:00:00Z");
const translations = [
  { id: "older", createdAt: "2026-10-10T12:00:00Z" },
  { id: "recent", createdAt: "2026-10-25T12:00:00Z" },
  { id: "unknown", createdAt: "invalid" },
];

it("shows only the last seven days as recent", () => {
  expect(filterTranslations(translations, "recent", now).map(({ id }) => id)).toEqual(["recent"]);
  expect(filterTranslations(translations, "older", now).map(({ id }) => id)).toEqual(["older"]);
});

it("shows all translations newest first, including those without a valid date", () => {
  expect(filterTranslations(translations, "all", now).map(({ id }) => id)).toEqual(["recent", "older", "unknown"]);
});
