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

test("uses the same inclusive seven-day boundary as web", () => {
  const cutoff = now - 7 * 24 * 60 * 60 * 1000;
  const boundary = [
    { id: "future", createdAt: new Date(now + 1000).toISOString() },
    { id: "at-cutoff", createdAt: new Date(cutoff).toISOString() },
    { id: "before-cutoff", createdAt: new Date(cutoff - 1).toISOString() },
  ];

  expect(filterTranslations(boundary, "recent", now).map(({ id }) => id)).toEqual(["at-cutoff"]);
  expect(filterTranslations(boundary, "older", now).map(({ id }) => id)).toEqual(["before-cutoff"]);
});
