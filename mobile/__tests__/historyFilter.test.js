import { filterTranslations } from "../src/services/historyFilter";

const now = Date.parse("2026-10-26T12:00:00Z");
const translations = [
  { id: "older", createdAt: "2026-10-10T12:00:00Z" },
  { id: "recent", createdAt: "2026-10-25T12:00:00Z" },
  { id: "unknown", createdAt: "invalid" },
];

test("separates recent and older saved translations", () => {
  expect(filterTranslations(translations, "recent", now).map(({ id }) => id)).toEqual(["recent"]);
  expect(filterTranslations(translations, "older", now).map(({ id }) => id)).toEqual(["older"]);
});

test("keeps all entries available in newest-first order", () => {
  expect(filterTranslations(translations, "all", now).map(({ id }) => id)).toEqual(["recent", "older", "unknown"]);
});
