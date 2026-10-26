import { isPublicSecureUrl } from "../src/config/network";

test("rejects private and insecure endpoints for release builds", () => {
  expect(isPublicSecureUrl("http://192.168.1.6:8084", "https:")).toBe(false);
  expect(isPublicSecureUrl("https://192.168.1.6:8084", "https:")).toBe(false);
  expect(isPublicSecureUrl("ws://127.0.0.1:8001/ws/recognize", "wss:")).toBe(false);
  expect(isPublicSecureUrl("https://onelanguage.tech", "https:")).toBe(true);
  expect(isPublicSecureUrl("wss://ai.onelanguage.tech/ws/recognize", "wss:")).toBe(true);
});
