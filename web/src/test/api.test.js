import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/authSession", () => ({
  getValidToken: vi.fn(),
  endSessionAndRedirectToLogin: vi.fn(),
}));

import api from "../services/api";
import { endSessionAndRedirectToLogin, getValidToken } from "../services/authSession";

const unauthorized = (config) =>
  Promise.reject(new AxiosError("Unauthorized", "ERR_BAD_RESPONSE", config, null, {
    config,
    data: {},
    headers: {},
    status: 401,
    statusText: "Unauthorized",
  }));

beforeEach(() => vi.clearAllMocks());

describe("API authentication interceptors", () => {
  it("adds a valid token to protected requests", async () => {
    getValidToken.mockReturnValue("signed-token");
    const adapter = vi.fn(async (config) => ({
      config,
      data: {},
      headers: {},
      status: 200,
      statusText: "OK",
    }));

    await api.get("/api/users/me", { adapter });

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe("Bearer signed-token");
  });

  it("ends the session after a protected 401", async () => {
    await expect(api.get("/api/users/me", { adapter: unauthorized })).rejects.toBeInstanceOf(AxiosError);
    expect(endSessionAndRedirectToLogin).toHaveBeenCalledOnce();
  });

  it.each(["/auth/login", "/auth/forgot-password", "/auth/reset-password", "/api/users"])(
    "does not redirect after a public 401 on %s",
    async (url) => {
      await expect(api.post(url, {}, { adapter: unauthorized })).rejects.toBeInstanceOf(AxiosError);
      expect(endSessionAndRedirectToLogin).not.toHaveBeenCalled();
    },
  );
});
